import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../models/database.js';
import { ENV } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { verifyPassword, hashPassword } from '../utils/security.js';
import { AuthenticatedAdminRequest } from '../middleware/adminAuth.middleware.js';
import {
  AdminUser,
  CMSPage,
  DashboardConfig,
  Crop,
  MandiItem,
  GovernmentScheme,
  StoreProduct,
  NotificationItem,
  MediaItem,
  WeatherAdvisoryItem,
  AIAdvisorArticleItem,
  DroneServiceItem,
  SiteSettings
} from '../types/index.js';

export class AdminController {
  // ==================================================
  // 1. AUTHENTICATION
  // ==================================================
  public static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const admin = Array.from(db.admins.values()).find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!admin) {
      return sendError(res, 'Invalid admin email or password', 401);
    }

    if (!verifyPassword(password, admin.passwordHash)) {
      return sendError(res, 'Invalid admin email or password', 401);
    }

    if (admin.status !== 'Active') {
      return sendError(res, 'This admin account has been suspended', 403);
    }

    admin.lastLogin = new Date().toISOString();
    db.admins.set(admin.id, admin);
    db.logActivity(admin.name, admin.email, 'Logged in', 'Admin Portal', 'Session initiated');

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeAdmin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      lastLogin: admin.lastLogin
    };

    return sendSuccess(res, { admin: safeAdmin, token }, 'Admin authenticated successfully');
  }

  public static async getMe(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    if (!req.admin) {
      return sendError(res, 'Not authenticated', 401);
    }
    const safeAdmin = {
      id: req.admin.id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      status: req.admin.status,
      lastLogin: req.admin.lastLogin
    };
    return sendSuccess(res, safeAdmin);
  }

  // ==================================================
  // 2. DASHBOARD & STATS
  // ==================================================
  public static async getStats(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const totalUsers = 2450 + db.users.size - 1;
    const activeFarmers = 1982 + db.users.size - 1;
    const totalCrops = 4821 + db.crops.size - 4;
    const totalProducts = db.products.size;
    const totalSchemes = db.schemes.size;
    const totalMandis = db.mandis.size;
    const totalAiArticles = db.aiArticles.size;
    const totalNotifications = db.notifications.size;

    const stats = {
      totalUsers,
      activeFarmers,
      totalCrops,
      totalProducts,
      totalSchemes,
      totalMandis,
      totalAiArticles,
      totalNotifications,
      systemStatus: 'Operational (99.98% Uptime)',
      activeSensors: db.iotDevices.size,
      recentActivities: db.activityLogs.slice(0, 8),
      recentPages: Array.from(db.pages.values()).slice(0, 6)
    };

    return sendSuccess(res, stats);
  }

  // ==================================================
  // 3. UNIVERSAL PAGE MANAGER
  // ==================================================
  public static async getAllPages(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const pages = Array.from(db.pages.values()).sort((a, b) => a.name.localeCompare(b.name));
    return sendSuccess(res, pages);
  }

  public static async getPageById(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const page = db.pages.get(id) || Array.from(db.pages.values()).find((p) => p.slug === id);
    if (!page) {
      return sendError(res, 'Page not found', 404);
    }
    return sendSuccess(res, page);
  }

  public static async savePage(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const pageData: Partial<CMSPage> = req.body;

    let page = db.pages.get(id);
    const adminName = req.admin?.name || 'Admin';
    const adminEmail = req.admin?.email || 'admin@krishismart.ai';

    if (!page) {
      // Create new page
      const newId = id && !id.startsWith('new') ? id : `page-${Date.now()}`;
      page = {
        id: newId,
        slug: pageData.slug || `page-${Date.now()}`,
        name: pageData.name || 'New Custom Page',
        route: pageData.route || `/${pageData.slug || 'custom'}`,
        status: pageData.status || 'Draft',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: adminName,
        sections: pageData.sections || []
      };
      db.pages.set(page.id, page);
      db.logActivity(adminName, adminEmail, 'Created Page', 'Page Manager', page.name);
    } else {
      // Update existing page
      page = {
        ...page,
        ...pageData,
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: adminName
      };
      db.pages.set(page.id, page);
      db.logActivity(adminName, adminEmail, 'Updated Page', 'Page Manager', page.name);
    }

    db.saveToFile();
    return sendSuccess(res, page, 'Page saved successfully');
  }

  public static async publishPage(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const page = db.pages.get(id);
    if (!page) return sendError(res, 'Page not found', 404);

    const newStatus = page.status === 'Published' ? 'Draft' : 'Published';
    page.status = newStatus;
    page.lastUpdated = new Date().toISOString().split('T')[0];
    page.updatedBy = req.admin?.name || 'Admin';
    db.pages.set(page.id, page);

    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      newStatus === 'Published' ? 'Published Page' : 'Unpublished Page',
      'Page Manager',
      page.name
    );

    db.saveToFile();
    return sendSuccess(res, page, `Page status changed to ${newStatus}`);
  }

  public static async duplicatePage(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const page = db.pages.get(id);
    if (!page) return sendError(res, 'Page not found', 404);

    const newId = `page-${Date.now()}`;
    const duplicated: CMSPage = {
      ...page,
      id: newId,
      slug: `${page.slug}-copy`,
      name: `${page.name} (Copy)`,
      route: `${page.route}-copy`,
      status: 'Draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: req.admin?.name || 'Admin'
    };

    db.pages.set(duplicated.id, duplicated);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Duplicated Page',
      'Page Manager',
      duplicated.name
    );
    db.saveToFile();

    return sendSuccess(res, duplicated, 'Page duplicated as Draft', 201);
  }

  public static async deletePage(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    if (id === 'page-dashboard' || id === 'dashboard') {
      return sendError(res, 'Cannot delete primary Dashboard page', 400);
    }
    const page = db.pages.get(id);
    if (!page) return sendError(res, 'Page not found', 404);

    db.pages.delete(id);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Deleted Page',
      'Page Manager',
      page.name
    );
    db.saveToFile();
    return sendSuccess(res, { deleted: true }, 'Page deleted successfully');
  }

  // ==================================================
  // 4. DASHBOARD & QUICK ACTIONS EDITOR
  // ==================================================
  public static async getDashboardConfig(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, db.dashboardConfig);
  }

  public static async updateDashboardConfig(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const updates: Partial<DashboardConfig> = req.body;
    db.dashboardConfig = {
      ...db.dashboardConfig,
      ...updates,
      hero: {
        ...db.dashboardConfig.hero,
        ...(updates.hero || {})
      },
      statusCards: updates.statusCards || db.dashboardConfig.statusCards,
      quickActions: updates.quickActions || db.dashboardConfig.quickActions
    };

    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Updated Dashboard Content',
      'Dashboard Editor',
      `Greeting: "${db.dashboardConfig.hero.greeting}"`
    );

    db.saveToFile();
    return sendSuccess(res, db.dashboardConfig, 'Dashboard configuration updated and published');
  }

  // ==================================================
  // 5. CROP MANAGER
  // ==================================================
  public static async getCrops(req: Request, res: Response): Promise<Response> {
    const { search, category, status } = req.query;
    let list = Array.from(db.crops.values());

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.localName && c.localName.toLowerCase().includes(q)) ||
          (c.hindiName && c.hindiName.toLowerCase().includes(q)) ||
          c.variety.toLowerCase().includes(q)
      );
    }
    if (category) {
      list = list.filter((c) => c.category === category);
    }
    if (status) {
      list = list.filter((c) => c.status === status);
    }

    return sendSuccess(res, list);
  }

  public static async createCrop(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const data = req.body;
    const id = `crop-${Date.now()}`;
    const newCrop: Crop = {
      id,
      farmId: data.farmId || 'farm-1',
      name: data.name || 'New Crop',
      variety: data.variety || 'Standard Hybrid',
      area: Number(data.area) || 1.0,
      sowingDate: data.sowingDate || new Date().toISOString().split('T')[0],
      expectedHarvestDate: data.expectedHarvestDate || '2026-12-30',
      currentStage: data.currentStage || 'seed',
      healthScore: Number(data.healthScore) || 90,
      status: data.status || 'Healthy',
      irrigationSchedule: data.irrigationSchedule || 'Weekly Drip',
      fertilizerSchedule: data.fertilizerSchedule || 'NPK Basal Dose',
      projectedYieldKg: Number(data.projectedYieldKg) || 5000,
      expectedRevenue: Number(data.expectedRevenue) || 150000,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
      nextTask: data.nextTask || 'Soil moisture telemetry check',
      localName: data.localName || '',
      hindiName: data.hindiName || '',
      category: data.category || 'Grain & Cereals',
      description: data.description || '',
      growingSeason: data.growingSeason || 'Kharif',
      soilType: data.soilType || 'Loamy',
      waterRequirement: data.waterRequirement || 'Moderate',
      temperatureRange: data.temperatureRange || '22°C - 32°C',
      acreage: Number(data.acreage) || Number(data.area) || 1.0,
      diseases: data.diseases || [],
      fertilizers: data.fertilizers || [],
      recommendations: data.recommendations || [],
      timeline: data.timeline || [
        { id: 'seed', name: 'Land Prep & Seed Sowing', status: 'active', progress: 50, estimatedDate: 'Jun 10', notes: 'Basal compost applied', tasks: ['Tilling', 'Seed treatment'] },
        { id: 'germination', name: 'Germination & Sprouting', status: 'upcoming', progress: 0, estimatedDate: 'Jul 01', notes: 'First weeding', tasks: ['Moisture check'] },
        { id: 'growth', name: 'Vegetative Growth', status: 'upcoming', progress: 0, estimatedDate: 'Aug 10', notes: 'Fertilizer top dressing', tasks: ['Weeding', 'Spray'] },
        { id: 'flowering', name: 'Flowering & Setting', status: 'upcoming', progress: 0, estimatedDate: 'Sep 15', notes: 'Critical irrigation', tasks: ['Foliar micronutrient'] },
        { id: 'harvest', name: 'Harvest & Sorting', status: 'upcoming', progress: 0, estimatedDate: 'Oct 25', notes: 'APMC mandi dispatch', tasks: ['Combine booking'] }
      ]
    };

    db.crops.set(newCrop.id, newCrop);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Added Crop',
      'Crop Manager',
      `${newCrop.name} (${newCrop.variety})`
    );
    db.saveToFile();

    return sendSuccess(res, newCrop, 'Crop created successfully', 201);
  }

  public static async updateCrop(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const crop = db.crops.get(id);
    if (!crop) return sendError(res, 'Crop not found', 404);

    const updatedCrop = { ...crop, ...req.body };
    db.crops.set(id, updatedCrop);

    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Updated Crop',
      'Crop Manager',
      updatedCrop.name
    );
    db.saveToFile();

    return sendSuccess(res, updatedCrop, 'Crop updated successfully');
  }

  public static async deleteCrop(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const crop = db.crops.get(id);
    if (!crop) return sendError(res, 'Crop not found', 404);

    db.crops.delete(id);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Deleted Crop',
      'Crop Manager',
      crop.name
    );
    db.saveToFile();

    return sendSuccess(res, { deleted: true }, 'Crop removed successfully');
  }

  // ==================================================
  // 6. MARKET MANAGER
  // ==================================================
  public static async getMarkets(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.mandis.values()));
  }

  public static async createMarket(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const data = req.body;
    const id = `mnd-${Date.now()}`;
    const mandi: MandiItem = {
      id,
      commodity: data.commodity || 'Tomato',
      marketName: data.marketName || 'APMC Yard',
      district: data.district || 'Mandya',
      state: data.state || 'Karnataka',
      currentPrice: Number(data.currentPrice) || 2500,
      prevPrice: Number(data.prevPrice) || Number(data.currentPrice) || 2400,
      priceChange: Number(data.priceChange) || 0,
      minPrice: Number(data.minPrice) || 2000,
      maxPrice: Number(data.maxPrice) || 3000,
      demandLevel: data.demandLevel || 'High',
      supplyLevel: data.supplyLevel || 'Adequate',
      arrivalTons: Number(data.arrivalTons) || 100,
      distanceKm: Number(data.distanceKm) || 25,
      transportCostPerQtl: Number(data.transportCostPerQtl) || 50,
      updatedAt: 'Just now'
    };

    db.mandis.set(mandi.id, mandi);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Added Mandi Rate',
      'Market Manager',
      `${mandi.commodity} at ${mandi.marketName}`
    );
    db.saveToFile();

    return sendSuccess(res, mandi, 'Mandi market entry added', 201);
  }

  public static async updateMarket(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const mandi = db.mandis.get(id);
    if (!mandi) return sendError(res, 'Market entry not found', 404);

    const updated = { ...mandi, ...req.body, updatedAt: 'Just now' };
    db.mandis.set(id, updated);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Updated Mandi Rate',
      'Market Manager',
      `${updated.commodity} (Rs ${updated.currentPrice})`
    );
    db.saveToFile();

    return sendSuccess(res, updated, 'Market entry updated');
  }

  public static async deleteMarket(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const mandi = db.mandis.get(id);
    if (!mandi) return sendError(res, 'Market entry not found', 404);

    db.mandis.delete(id);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Deleted Mandi Entry',
      'Market Manager',
      `${mandi.commodity} at ${mandi.marketName}`
    );
    db.saveToFile();

    return sendSuccess(res, { deleted: true }, 'Market entry deleted');
  }

  // ==================================================
  // 7. GOVERNMENT SCHEMES MANAGER
  // ==================================================
  public static async getSchemes(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.schemes.values()));
  }

  public static async createScheme(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const data = req.body;
    const id = `sch-${Date.now()}`;
    const scheme: GovernmentScheme = {
      id,
      name: data.name || 'New Welfare Scheme',
      shortName: data.shortName || data.name || 'Scheme',
      department: data.department || 'Ministry of Agriculture',
      financialBenefit: data.financialBenefit || 'Direct Bank Transfer / Subsidy',
      eligibility: Array.isArray(data.eligibility) ? data.eligibility : [data.eligibility || 'All small & marginal farmers'],
      documentsRequired: Array.isArray(data.documentsRequired) ? data.documentsRequired : ['Aadhaar', 'Land RTC Record', 'Bank Passbook'],
      deadline: data.deadline || 'Ongoing',
      applicationMode: data.applicationMode || 'Online',
      status: data.status || 'Open',
      officialUrl: data.officialUrl || 'https://agricoop.gov.in',
      category: data.category || 'Direct Income',
      appliedStatus: 'Not Applied'
    };

    db.schemes.set(scheme.id, scheme);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Added Government Scheme',
      'Schemes Manager',
      scheme.name
    );
    db.saveToFile();

    return sendSuccess(res, scheme, 'Government scheme created', 201);
  }

  public static async updateScheme(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const scheme = db.schemes.get(id);
    if (!scheme) return sendError(res, 'Scheme not found', 404);

    const updated = { ...scheme, ...req.body };
    db.schemes.set(id, updated);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Updated Government Scheme',
      'Schemes Manager',
      updated.name
    );
    db.saveToFile();

    return sendSuccess(res, updated, 'Scheme updated successfully');
  }

  public static async deleteScheme(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const scheme = db.schemes.get(id);
    if (!scheme) return sendError(res, 'Scheme not found', 404);

    db.schemes.delete(id);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Deleted Government Scheme',
      'Schemes Manager',
      scheme.name
    );
    db.saveToFile();

    return sendSuccess(res, { deleted: true }, 'Scheme removed successfully');
  }

  // ==================================================
  // 8. WEATHER CONTENT MANAGER
  // ==================================================
  public static async getWeatherAdvisories(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, {
      weather: db.weather,
      advisories: Array.from(db.weatherAdvisories.values())
    });
  }

  public static async createWeatherAdvisory(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const data = req.body;
    const id = `wadv-${Date.now()}`;
    const item: WeatherAdvisoryItem = {
      id,
      title: data.title || 'Weather Alert',
      message: data.message || '',
      type: data.type || 'Advisory',
      priority: data.priority || 'Medium',
      validUntil: data.validUntil || new Date().toISOString().split('T')[0],
      visible: data.visible !== false
    };

    db.weatherAdvisories.set(item.id, item);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Added Weather Advisory',
      'Weather Manager',
      item.title
    );
    db.saveToFile();

    return sendSuccess(res, item, 'Weather advisory created', 201);
  }

  public static async updateWeatherAdvisory(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const adv = db.weatherAdvisories.get(id);
    if (!adv) return sendError(res, 'Advisory not found', 404);

    const updated = { ...adv, ...req.body };
    db.weatherAdvisories.set(id, updated);
    db.saveToFile();
    return sendSuccess(res, updated, 'Weather advisory updated');
  }

  public static async deleteWeatherAdvisory(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    db.weatherAdvisories.delete(id);
    db.saveToFile();
    return sendSuccess(res, { deleted: true }, 'Advisory deleted');
  }

  // ==================================================
  // 9. AI ADVISOR CONTENT MANAGER
  // ==================================================
  public static async getAIArticles(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.aiArticles.values()));
  }

  public static async createAIArticle(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const data = req.body;
    const id = `art-${Date.now()}`;
    const article: AIAdvisorArticleItem = {
      id,
      title: data.title || 'Agronomy Guide',
      category: data.category || 'Farming Tips',
      crop: data.crop || 'General',
      content: data.content || '',
      image: data.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      language: data.language || 'en',
      status: data.status || 'Published',
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.aiArticles.set(article.id, article);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Created AI Knowledge Article',
      'AI Advisor Manager',
      article.title
    );
    db.saveToFile();

    return sendSuccess(res, article, 'AI article published', 201);
  }

  public static async updateAIArticle(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const art = db.aiArticles.get(id);
    if (!art) return sendError(res, 'Article not found', 404);

    const updated = { ...art, ...req.body };
    db.aiArticles.set(id, updated);
    db.saveToFile();
    return sendSuccess(res, updated, 'Article updated');
  }

  public static async deleteAIArticle(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    db.aiArticles.delete(id);
    db.saveToFile();
    return sendSuccess(res, { deleted: true }, 'Article removed');
  }

  // ==================================================
  // 10. DRONE MANAGEMENT
  // ==================================================
  public static async getDroneServices(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, {
      services: Array.from(db.droneServices.values()),
      plans: Array.from(db.dronePlans.values())
    });
  }

  public static async createDroneService(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const data = req.body;
    const id = `srv-${Date.now()}`;
    const srv: DroneServiceItem = {
      id,
      name: data.name || 'Autonomous Spray Mission',
      description: data.description || '',
      pricePerAcre: Number(data.pricePerAcre) || 450,
      status: data.status || 'Active',
      coverageType: data.coverageType || 'Liquid Spray',
      image: data.image || 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
      availableLocations: Array.isArray(data.availableLocations) ? data.availableLocations : ['Mandya', 'Mysuru']
    };

    db.droneServices.set(srv.id, srv);
    db.saveToFile();
    return sendSuccess(res, srv, 'Drone service added', 201);
  }

  public static async updateDroneService(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const srv = db.droneServices.get(id);
    if (!srv) return sendError(res, 'Drone service not found', 404);

    const updated = { ...srv, ...req.body };
    db.droneServices.set(id, updated);
    db.saveToFile();
    return sendSuccess(res, updated, 'Drone service updated');
  }

  public static async deleteDroneService(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    db.droneServices.delete(id);
    db.saveToFile();
    return sendSuccess(res, { deleted: true }, 'Drone service deleted');
  }

  // ==================================================
  // 11. IoT MANAGEMENT
  // ==================================================
  public static async getIoTDevices(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.iotDevices.values()));
  }

  public static async updateIoTDevice(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const dev = db.iotDevices.get(id);
    if (!dev) return sendError(res, 'IoT Device not found', 404);

    const updated = { ...dev, ...req.body, lastPing: 'Just now' };
    db.iotDevices.set(id, updated);
    db.saveToFile();
    return sendSuccess(res, updated, 'Device telemetry updated');
  }

  // ==================================================
  // 12. SMART PUMP MANAGEMENT
  // ==================================================
  public static async getSmartPump(req: Request, res: Response): Promise<Response> {
    const pump = Array.from(db.smartPumps.values())[0];
    return sendSuccess(res, pump);
  }

  public static async updateSmartPump(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const pump = Array.from(db.smartPumps.values())[0];
    if (!pump) return sendError(res, 'Pump not found', 404);

    const updated = { ...pump, ...req.body };
    db.smartPumps.set(pump.id, updated);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Configured Smart Pump',
      'Smart Pump Manager',
      `Mode: ${updated.mode}, Status: ${updated.status}`
    );
    db.saveToFile();
    return sendSuccess(res, updated, 'Smart pump configuration updated');
  }

  // ==================================================
  // 13. KRISHI STORE MANAGER
  // ==================================================
  public static async getStoreProducts(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.products.values()));
  }

  public static async createStoreProduct(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const data = req.body;
    const id = `prod-${Date.now()}`;
    const product: StoreProduct = {
      id,
      name: data.name || 'Agri Product',
      category: data.category || 'Fertilizers',
      price: Number(data.price) || 299,
      originalPrice: Number(data.originalPrice) || 350,
      rating: Number(data.rating) || 4.8,
      reviewCount: Number(data.reviewCount) || 12,
      image: data.image || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300&auto=format&fit=crop&q=80',
      brand: data.brand || 'KrishiSmart Agrotech',
      inStock: data.inStock !== false,
      badge: data.badge || 'Govt Certified',
      description: data.description || '',
      features: Array.isArray(data.features) ? data.features : ['High bio-availability', 'Lab tested'],
      dosageOrUsage: data.dosageOrUsage || 'Apply as per agronomy instructions'
    };

    db.products.set(product.id, product);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Added Store Product',
      'Store Manager',
      product.name
    );
    db.saveToFile();

    return sendSuccess(res, product, 'Store product created', 201);
  }

  public static async updateStoreProduct(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const prod = db.products.get(id);
    if (!prod) return sendError(res, 'Product not found', 404);

    const updated = { ...prod, ...req.body };
    db.products.set(id, updated);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Updated Store Product',
      'Store Manager',
      updated.name
    );
    db.saveToFile();

    return sendSuccess(res, updated, 'Product updated');
  }

  public static async deleteStoreProduct(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const prod = db.products.get(id);
    if (!prod) return sendError(res, 'Product not found', 404);

    db.products.delete(id);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Deleted Store Product',
      'Store Manager',
      prod.name
    );
    db.saveToFile();

    return sendSuccess(res, { deleted: true }, 'Product deleted');
  }

  // ==================================================
  // 14. MEDIA LIBRARY
  // ==================================================
  public static async getMedia(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.media.values()));
  }

  public static async uploadMedia(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { name, url, type, size, tags } = req.body;
    if (!url) {
      return sendError(res, 'Image URL or file data is required', 400);
    }

    const id = `med-${Date.now()}`;
    const mediaItem: MediaItem = {
      id,
      name: name || `Image_${Date.now()}`,
      url,
      type: type || 'image',
      size: size || 250000,
      uploadedAt: new Date().toISOString().split('T')[0],
      tags: Array.isArray(tags) ? tags : ['custom', 'media']
    };

    db.media.set(mediaItem.id, mediaItem);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Uploaded Media Asset',
      'Media Library',
      mediaItem.name
    );
    db.saveToFile();

    return sendSuccess(res, mediaItem, 'Media file uploaded successfully', 201);
  }

  public static async deleteMedia(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const item = db.media.get(id);
    if (!item) return sendError(res, 'Media item not found', 404);

    db.media.delete(id);
    db.saveToFile();
    return sendSuccess(res, { deleted: true }, 'Media removed');
  }

  // ==================================================
  // 15. USERS MANAGEMENT
  // ==================================================
  public static async getUsers(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.users.values()));
  }

  public static async updateUser(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = db.users.get(id);
    if (!user) return sendError(res, 'User not found', 404);

    const updated = { ...user, ...req.body };
    db.users.set(id, updated);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Updated User Profile/Role',
      'Users Manager',
      updated.name
    );
    db.saveToFile();

    return sendSuccess(res, updated, 'User profile updated');
  }

  // ==================================================
  // 16. NOTIFICATIONS BROADCAST
  // ==================================================
  public static async getNotifications(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.notifications.values()));
  }

  public static async createNotification(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const data = req.body;
    const id = `ntf-${Date.now()}`;
    const notification: NotificationItem = {
      id,
      title: data.title || 'System Notification',
      message: data.message || '',
      timestamp: 'Just now',
      priority: data.priority || 'Normal',
      category: data.category || 'Weather',
      read: false,
      actionRoute: data.actionRoute || 'dashboard'
    };

    db.notifications.set(notification.id, notification);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Broadcasted Notification',
      'Notifications Manager',
      notification.title
    );
    db.saveToFile();

    return sendSuccess(res, notification, 'Notification broadcasted to all farmers', 201);
  }

  public static async deleteNotification(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    db.notifications.delete(id);
    db.saveToFile();
    return sendSuccess(res, { deleted: true }, 'Notification removed');
  }

  // ==================================================
  // 17. SITE SETTINGS
  // ==================================================
  public static async getSettings(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, db.siteSettings);
  }

  public static async updateSettings(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const updates: Partial<SiteSettings> = req.body;
    db.siteSettings = { ...db.siteSettings, ...updates };

    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Updated Site Settings',
      'Site Settings',
      db.siteSettings.siteName
    );
    db.saveToFile();

    return sendSuccess(res, db.siteSettings, 'Site settings updated');
  }

  // ==================================================
  // 18. ADMIN USERS & ROLES
  // ==================================================
  public static async getAdminUsers(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const admins = Array.from(db.admins.values()).map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      role: a.role,
      status: a.status,
      createdAt: a.createdAt,
      lastLogin: a.lastLogin
    }));
    return sendSuccess(res, admins);
  }

  public static async createAdminUser(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { name, email, password, role } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const existing = Array.from(db.admins.values()).find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return sendError(res, 'An admin account with this email already exists', 400);
    }

    const id = `adm-${Date.now()}`;
    const newAdmin: AdminUser = {
      id,
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      role: role || 'Editor',
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    db.admins.set(newAdmin.id, newAdmin);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Created Admin User',
      'Admin Users',
      `${newAdmin.name} (${newAdmin.role})`
    );
    db.saveToFile();

    const safeAdmin = {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      status: newAdmin.status,
      createdAt: newAdmin.createdAt
    };

    return sendSuccess(res, safeAdmin, 'Admin user created successfully', 201);
  }

  public static async updateAdminUser(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const admin = db.admins.get(id);
    if (!admin) return sendError(res, 'Admin not found', 404);

    const { name, role, status, password } = req.body;
    if (name) admin.name = name;
    if (role) admin.role = role;
    if (status) admin.status = status;
    if (password) admin.passwordHash = hashPassword(password);

    db.admins.set(id, admin);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Updated Admin User',
      'Admin Users',
      `${admin.name} (${admin.role})`
    );
    db.saveToFile();

    return sendSuccess(res, {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status
    }, 'Admin account updated');
  }

  public static async deleteAdminUser(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    if (id === 'adm-1' || id === req.admin?.id) {
      return sendError(res, 'Cannot delete the primary Super Admin or currently logged in account', 400);
    }
    const admin = db.admins.get(id);
    if (!admin) return sendError(res, 'Admin not found', 404);

    db.admins.delete(id);
    db.logActivity(
      req.admin?.name || 'Admin',
      req.admin?.email || 'admin@krishismart.ai',
      'Deleted Admin User',
      'Admin Users',
      admin.name
    );
    db.saveToFile();

    return sendSuccess(res, { deleted: true }, 'Admin account removed');
  }

  // ==================================================
  // 19. ACTIVITY AUDIT LOGS
  // ==================================================
  public static async getActivityLogs(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
    return sendSuccess(res, db.activityLogs);
  }
}
