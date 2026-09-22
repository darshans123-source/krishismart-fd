import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from '../utils/security.js';
import {
  UserProfile,
  Farm,
  Crop,
  FarmTask,
  WeatherData,
  MandiItem,
  GovernmentScheme,
  FinancialSummary,
  FinancialTransaction,
  IoTDevice,
  SmartPump,
  DronePlan,
  StoreProduct,
  StoreOrder,
  NotificationItem,
  AchievementBadge,
  KrishiBhavishyaForecast,
  DiseaseDetectionResult,
  AdminUser,
  CMSPage,
  CMSSection,
  CMSComponent,
  DashboardConfig,
  DashboardHeroConfig,
  DashboardStatusCard,
  DashboardQuickAction,
  MediaItem,
  ActivityLog,
  SiteSettings,
  WeatherAdvisoryItem,
  AIAdvisorArticleItem,
  DroneServiceItem
} from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Model Store with File-Backed Atomic Persistence
class DatabaseStore {
  public users: Map<string, UserProfile> = new Map();
  public farms: Map<string, Farm> = new Map();
  public crops: Map<string, Crop> = new Map();
  public tasks: Map<string, FarmTask> = new Map();
  public weather!: WeatherData;
  public mandis: Map<string, MandiItem> = new Map();
  public schemes: Map<string, GovernmentScheme> = new Map();
  public financialSummary!: FinancialSummary;
  public transactions: Map<string, FinancialTransaction> = new Map();
  public iotDevices: Map<string, IoTDevice> = new Map();
  public smartPumps: Map<string, SmartPump> = new Map();
  public dronePlans: Map<string, DronePlan> = new Map();
  public products: Map<string, StoreProduct> = new Map();
  public orders: Map<string, StoreOrder> = new Map();
  public notifications: Map<string, NotificationItem> = new Map();
  public achievements: Map<string, AchievementBadge> = new Map();
  public bhavishyaForecasts: Map<string, KrishiBhavishyaForecast> = new Map();
  public sampleDiagnostics: Map<string, any> = new Map();

  // Admin & CMS Collections
  public admins: Map<string, AdminUser> = new Map();
  public pages: Map<string, CMSPage> = new Map();
  public dashboardConfig!: DashboardConfig;
  public media: Map<string, MediaItem> = new Map();
  public activityLogs: ActivityLog[] = [];
  public siteSettings!: SiteSettings;
  public weatherAdvisories: Map<string, WeatherAdvisoryItem> = new Map();
  public aiArticles: Map<string, AIAdvisorArticleItem> = new Map();
  public droneServices: Map<string, DroneServiceItem> = new Map();

  constructor() {
    this.initDefaultMetrics();
    this.initStore();
  }

  private initDefaultMetrics() {
    this.weather = {
      temp: 29.4,
      condition: 'Partly Cloudy with Scattered Showers',
      conditionIcon: 'cloud-sun-rain',
      humidity: 76,
      windSpeed: 11.2,
      rainProbability: 65,
      soilMoisture: 58,
      soilTemp: 24.8,
      uvIndex: 7.2,
      airQuality: 'Good (AQI 42)',
      sprayingAdvisory: {
        status: 'Caution',
        reason: '65% rain probability in next 24-36 hrs may wash away chemical spray.',
        bestWindow: 'Tomorrow morning 06:00 AM - 09:30 AM (Dry spell)'
      },
      irrigationAdvisory: {
        needed: false,
        recommendedMm: 0,
        reason: 'Soil moisture is optimal (58%). Postpone irrigation due to approaching rain.'
      },
      forecast: [
        { day: 'Today', date: 'Aug 29', tempMax: 30, tempMin: 21, condition: 'Scattered Showers', rainProb: 65, icon: 'cloud-rain' },
        { day: 'Sat', date: 'Aug 30', tempMax: 28, tempMin: 20, condition: 'Moderate Rain', rainProb: 80, icon: 'cloud-heavy-rain' },
        { day: 'Sun', date: 'Aug 31', tempMax: 29, tempMin: 21, condition: 'Light Drizzle', rainProb: 40, icon: 'cloud-drizzle' },
        { day: 'Mon', date: 'Sep 01', tempMax: 31, tempMin: 22, condition: 'Mostly Sunny', rainProb: 15, icon: 'sun' },
        { day: 'Tue', date: 'Sep 02', tempMax: 32, tempMin: 22, condition: 'Clear Sky', rainProb: 10, icon: 'sun' },
        { day: 'Wed', date: 'Sep 03', tempMax: 31, tempMin: 21, condition: 'Partly Cloudy', rainProb: 25, icon: 'cloud-sun' },
        { day: 'Thu', date: 'Sep 04', tempMax: 30, tempMin: 21, condition: 'Isolated Showers', rainProb: 35, icon: 'cloud-sun-rain' }
      ]
    };

    this.financialSummary = {
      totalIncome: 485000,
      totalExpenses: 192400,
      netProfit: 292600,
      farmInvestment: 160000,
      profitMargin: 60.3,
      kisanCreditScore: 785,
      loanEligibilityAmount: 750000
    };
  }

  private seedInitialData() {
    // User
    const initialUser: UserProfile = {
      id: 'usr-001',
      name: 'Darshan Patil',
      phone: '+91 98452 34120',
      email: 'darshan.agri@krishismart.ai',
      state: 'Karnataka',
      district: 'Mandya',
      village: 'Pandavapura',
      landSize: 6.5,
      farmingType: 'Precision Tech',
      preferredLanguage: 'en',
      experienceYears: 8,
      isPremium: true,
      tier: 'Pro',
      level: 4,
      xp: 3450,
      streakDays: 14,
      joinedDate: '2025-06-15',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    this.users.set(initialUser.id, initialUser);

    // Farms
    const farms: Farm[] = [
      {
        id: 'farm-1',
        name: 'Cauvery River Oasis',
        location: 'Pandavapura, Mandya, Karnataka',
        totalArea: 4.5,
        soilType: 'Red Loamy & Clayey',
        waterSource: 'Canal',
        fieldsCount: 3
      },
      {
        id: 'farm-2',
        name: 'Siddaganga Highlands',
        location: 'Nagamangala, Mandya, Karnataka',
        totalArea: 2.0,
        soilType: 'Black Sandy Loam',
        waterSource: 'Borewell',
        fieldsCount: 2
      }
    ];
    farms.forEach((f) => this.farms.set(f.id, f));

    // Crops
    const crops: Crop[] = [
      {
        id: 'crop-1',
        farmId: 'farm-1',
        name: 'Paddy',
        variety: 'BPT-5204 (Samba Mahsuri)',
        area: 2.5,
        sowingDate: '2026-06-10',
        expectedHarvestDate: '2026-10-25',
        currentStage: 'flowering',
        healthScore: 94,
        status: 'Healthy',
        irrigationSchedule: 'Every 2 days (Alternate Wetting & Drying)',
        fertilizerSchedule: 'Potash & Zinc spray due in 4 days',
        projectedYieldKg: 6250,
        expectedRevenue: 156250,
        nextTask: 'Irrigation tomorrow',
        imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
        timeline: [
          { id: 'seed', name: 'Seed Treatment & Nursery', status: 'completed', progress: 100, estimatedDate: 'Jun 10', notes: 'Bio-priming with Trichoderma done.', tasks: ['Seed selection', 'Fungicide treatment'] },
          { id: 'germination', name: 'Transplanting & Germination', status: 'completed', progress: 100, estimatedDate: 'Jun 28', notes: 'Transplanted 21-day old seedlings at 20x15 cm spacing.', tasks: ['Field puddling', 'Basal fertilizer NPK'] },
          { id: 'growth', name: 'Vegetative Tillering', status: 'completed', progress: 100, estimatedDate: 'Jul 25', notes: 'Active tillering stage; weed management completed.', tasks: ['Urea top dressing', 'Weeding'] },
          { id: 'flowering', name: 'Panicle Initiation & Flowering', status: 'active', progress: 68, estimatedDate: 'Aug 22', notes: 'Keep 2-3 cm standing water; watch for stem borer.', tasks: ['Foliar micronutrient spray', 'Monitor moisture'] },
          { id: 'harvest', name: 'Grain Maturation & Harvest', status: 'upcoming', progress: 0, estimatedDate: 'Oct 25', notes: 'Stop irrigation 10 days before harvesting.', tasks: ['Combine harvester booking', 'Mandi listing'] }
        ]
      },
      {
        id: 'crop-2',
        farmId: 'farm-1',
        name: 'Tomato',
        variety: 'Arka Rakshak (F1 Hybrid)',
        area: 2.0,
        sowingDate: '2026-07-01',
        expectedHarvestDate: '2026-09-30',
        currentStage: 'flowering',
        healthScore: 88,
        status: 'Needs Attention',
        irrigationSchedule: 'Daily Drip (45 mins in morning)',
        fertilizerSchedule: 'Water soluble 19:19:19 via fertigation',
        projectedYieldKg: 18000,
        expectedRevenue: 288000,
        nextTask: 'Bio-fungicide spray today',
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        timeline: [
          { id: 'seed', name: 'Nursery Bed Preparation', status: 'completed', progress: 100, estimatedDate: 'Jul 01', notes: 'Raised bed nursery with pro-trays.', tasks: ['Pro-tray seeding', 'Damping-off control'] },
          { id: 'germination', name: 'Hardening & Transplant', status: 'completed', progress: 100, estimatedDate: 'Jul 20', notes: 'Silver-black mulching installed.', tasks: ['Mulching & drip setup', 'Transplanting'] },
          { id: 'growth', name: 'Branching & Staking', status: 'completed', progress: 100, estimatedDate: 'Aug 08', notes: 'Bamboo trellis staking completed.', tasks: ['Staking & trellising', 'Pinching suckers'] },
          { id: 'flowering', name: 'Fruit Set & Sizing', status: 'active', progress: 45, estimatedDate: 'Aug 25', notes: 'Slight early blight spotted on lower leaves.', tasks: ['Neem oil preventive spray', 'Calcium nitrate fertigation'] },
          { id: 'harvest', name: 'Picking & Sorting', status: 'upcoming', progress: 0, estimatedDate: 'Sep 30', notes: 'Multiple harvest flushes expected over 4 weeks.', tasks: ['Grading crates', 'Cold storage transport'] }
        ]
      },
      {
        id: 'crop-3',
        farmId: 'farm-2',
        name: 'Sugarcane',
        variety: 'Co-86032 (Nayana)',
        area: 2.0,
        sowingDate: '2026-02-15',
        expectedHarvestDate: '2027-01-20',
        currentStage: 'growth',
        healthScore: 96,
        status: 'Healthy',
        irrigationSchedule: 'Sub-surface drip every 3 days',
        fertilizerSchedule: 'Second earthing up & potash booster',
        projectedYieldKg: 95000,
        expectedRevenue: 332500,
        nextTask: 'Potash booster next week',
        imageUrl: 'https://images.unsplash.com/photo-1598112972019-91e30f406976?w=600&auto=format&fit=crop&q=80',
        timeline: [
          { id: 'seed', name: 'Two-bud Sett Planting', status: 'completed', progress: 100, estimatedDate: 'Feb 15', notes: 'Treated with Bavistin & Carbendazim.', tasks: ['Furrowing', 'Sett treatment'] },
          { id: 'germination', name: 'Sprouting & Formative', status: 'completed', progress: 100, estimatedDate: 'Mar 25', notes: '92% germination rate recorded.', tasks: ['Gap filling', 'First earthing-up'] },
          { id: 'growth', name: 'Grand Growth & Elongation', status: 'active', progress: 60, estimatedDate: 'Aug 15', notes: 'Cane height avg 7.2 ft. Vigorous internode elongation.', tasks: ['Trash mulching', 'Stem borer bio-traps'] },
          { id: 'flowering', name: 'Maturity & Sugar Accumulation', status: 'upcoming', progress: 0, estimatedDate: 'Nov 30', notes: 'Brix index monitoring.', tasks: ['Stop N fertilizer', 'Pre-harvest brix check'] },
          { id: 'harvest', name: 'Cutting & Mill Dispatch', status: 'upcoming', progress: 0, estimatedDate: 'Jan 20', notes: 'Direct supply contract with Mandya Sugar Factory.', tasks: ['Factory cutting permit', 'Tractor transport'] }
        ]
      },
      {
        id: 'crop-4',
        farmId: 'farm-2',
        name: 'Cotton',
        variety: 'Bt Cotton (RCH-659)',
        area: 1.5,
        sowingDate: '2026-06-20',
        expectedHarvestDate: '2026-11-25',
        currentStage: 'flowering',
        healthScore: 92,
        status: 'Healthy',
        irrigationSchedule: 'Furrow irrigation every 7 days',
        fertilizerSchedule: 'Magnesium sulphate & Boron spray',
        projectedYieldKg: 3500,
        expectedRevenue: 245000,
        nextTask: 'Bollworm pheromone trap check',
        imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
        timeline: [
          { id: 'seed', name: 'Dibbling & Seed Treatment', status: 'completed', progress: 100, estimatedDate: 'Jun 20', notes: 'Imidacloprid treated for sucking pests.', tasks: ['Land leveling', 'Precision dibbling'] },
          { id: 'germination', name: 'Square Formation & Squaring', status: 'completed', progress: 100, estimatedDate: 'Jul 30', notes: 'Square formation started at 40 DAS.', tasks: ['Inter-row hoeing', 'Top dress nitrogen'] },
          { id: 'growth', name: 'Peak Flowering & Boll Setting', status: 'active', progress: 55, estimatedDate: 'Aug 28', notes: 'Heavy flowering; pink bollworm pheromone traps set.', tasks: ['Bollworm check', 'Micronutrient foliar spray'] },
          { id: 'flowering', name: 'Boll Maturation & Bursting', status: 'upcoming', progress: 0, estimatedDate: 'Oct 20', notes: 'Ensure dry conditions for clean lint burst.', tasks: ['Defoliant advisory', 'Pick schedule'] },
          { id: 'harvest', name: 'Manual Picking & Ginning', status: 'upcoming', progress: 0, estimatedDate: 'Nov 25', notes: 'Clean picking for APMC auction.', tasks: ['Graded sorting', 'Transport to ginning yard'] }
        ]
      }
    ];
    crops.forEach((c) => this.crops.set(c.id, c));

    // Tasks
    const tasks: FarmTask[] = [
      { id: 'tsk-1', cropId: 'crop-2', title: 'Foliar Spray of Bio-Fungicide (Trichoderma) for Tomato Early Blight', category: 'Pesticide', priority: 'High', dueDate: 'Tomorrow, 07:00 AM', completed: false, xpReward: 50, notes: 'Mix 5ml/L of water. Spray underside of leaves.' },
      { id: 'tsk-2', cropId: 'crop-1', title: 'Schedule Smart Pump 45-min Fertigation for Sugarcane Plot B', category: 'Irrigation', priority: 'Medium', dueDate: 'Today, 05:30 PM', completed: false, xpReward: 30, notes: 'Inject dissolved Nano Urea via Venturi suction.' },
      { id: 'tsk-3', cropId: 'crop-2', title: 'Pre-book Drone Spray for Tomato Block with Micronutrient Cocktail', category: 'Drone', priority: 'High', dueDate: 'Sep 02, 2026', completed: false, xpReward: 60, notes: 'Recommended 12L/acre spray volume.' },
      { id: 'tsk-4', cropId: 'crop-3', title: 'Apply 200L Jeevamrutha Organic Bio-Stimulant to Ragi Fields', category: 'Fertilizer', priority: 'Medium', dueDate: 'Sep 04, 2026', completed: false, xpReward: 40 },
      { id: 'tsk-5', title: 'Check Soil Moisture telemetry after Saturday evening monsoon rain', category: 'Soil', priority: 'Low', dueDate: 'Aug 31, 2026', completed: true, xpReward: 20 },
      { id: 'tsk-6', title: 'Submit Documents for PM Kisan 17th Installment KYC update', category: 'Market', priority: 'Medium', dueDate: 'Sep 10, 2026', completed: false, xpReward: 50 }
    ];
    tasks.forEach((t) => this.tasks.set(t.id, t));

    // Mandi Items
    const mandis: MandiItem[] = [
      { id: 'mnd-1', commodity: 'Tomato (Hybrid)', marketName: 'Kolar APMC Mandi', district: 'Kolar', state: 'Karnataka', currentPrice: 2450, prevPrice: 2180, priceChange: 12.4, minPrice: 1900, maxPrice: 2800, demandLevel: 'High', supplyLevel: 'Deficit', arrivalTons: 120, distanceKm: 85, transportCostPerQtl: 110, updatedAt: '12 mins ago' },
      { id: 'mnd-2', commodity: 'Sugarcane (Jaggery Grade)', marketName: 'Mandya APMC Market', district: 'Mandya', state: 'Karnataka', currentPrice: 3200, prevPrice: 3150, priceChange: 1.6, minPrice: 3000, maxPrice: 3350, demandLevel: 'High', supplyLevel: 'Adequate', arrivalTons: 450, distanceKm: 14, transportCostPerQtl: 40, updatedAt: '35 mins ago' },
      { id: 'mnd-3', commodity: 'Ragi (Finger Millet)', marketName: 'Yeshwanthpur APMC Yard', district: 'Bengaluru Urban', state: 'Karnataka', currentPrice: 4280, prevPrice: 4320, priceChange: -0.9, minPrice: 3900, maxPrice: 4500, demandLevel: 'Moderate', supplyLevel: 'Adequate', arrivalTons: 85, distanceKm: 98, transportCostPerQtl: 130, updatedAt: '1 hour ago' },
      { id: 'mnd-4', commodity: 'Paddy (Sona Masoori)', marketName: 'Mysuru Bandipalya Market', district: 'Mysuru', state: 'Karnataka', currentPrice: 2650, prevPrice: 2540, priceChange: 4.3, minPrice: 2400, maxPrice: 2850, demandLevel: 'High', supplyLevel: 'Deficit', arrivalTons: 210, distanceKm: 32, transportCostPerQtl: 60, updatedAt: '45 mins ago' },
      { id: 'mnd-5', commodity: 'Onion (Red Nashik Quality)', marketName: 'Hubballi Cotton Market', district: 'Dharwad', state: 'Karnataka', currentPrice: 3400, prevPrice: 2900, priceChange: 17.2, minPrice: 2600, maxPrice: 3750, demandLevel: 'High', supplyLevel: 'Deficit', arrivalTons: 320, distanceKm: 360, transportCostPerQtl: 280, updatedAt: '2 hours ago' },
      { id: 'mnd-6', commodity: 'Green Chilli (G4)', marketName: 'Ramanagara APMC', district: 'Ramanagara', state: 'Karnataka', currentPrice: 4800, prevPrice: 4600, priceChange: 4.3, minPrice: 4200, maxPrice: 5300, demandLevel: 'Moderate', supplyLevel: 'Adequate', arrivalTons: 40, distanceKm: 62, transportCostPerQtl: 85, updatedAt: '15 mins ago' }
    ];
    mandis.forEach((m) => this.mandis.set(m.id, m));

    // Government Schemes
    const schemes: GovernmentScheme[] = [
      { id: 'sch-1', name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)', shortName: 'PM-KISAN', department: 'Ministry of Agriculture & Farmers Welfare, Govt of India', financialBenefit: 'Rs 6,000 / year in 3 direct bank transfers', eligibility: ['All landholding farmer families with cultivable land', 'Aadhaar linked bank account', 'Valid Land Khata/RTC details'], documentsRequired: ['Aadhaar Card', 'Land Ownership Record (RTC/Pahani)', 'Bank Passbook Copy', 'Mobile number linked to Aadhaar'], deadline: 'Ongoing (Next instalment: Oct 2026)', applicationMode: 'Online', status: 'Year-round', officialUrl: 'https://pmkisan.gov.in', appliedStatus: 'Approved', category: 'Direct Income' },
      { id: 'sch-2', name: 'Pradhan Mantri Krishi Sinchayee Yojana (Micro-Irrigation)', shortName: 'PMKSY - Drip & Sprinkler Subsidy', department: 'Department of Agriculture & Farmers Empowerment', financialBenefit: 'Up to 90% subsidy for Small/Marginal farmers, 45% for others', eligibility: ['Farmers owning agricultural land with borewell/openwell', 'Minimum 0.5 acre to max 5.0 acres eligibility', 'Should not have availed drip subsidy in past 7 years'], documentsRequired: ['RTC / Land Title Deeds', 'Water & Electricity Connection Certificate', 'Soil and Water Test Report', 'Caste Certificate (for SC/ST 90% benefit)'], deadline: 'Sep 30, 2026 (State Quota Open)', applicationMode: 'Online', status: 'Expiring Soon', officialUrl: 'https://pmksy.gov.in', appliedStatus: 'In Progress', category: 'Equipment & Solar' },
      { id: 'sch-3', name: 'Kisan Credit Card (KCC) 4% Interest Subvention Loan', shortName: 'KCC Short-term Crop Loan', department: 'NABARD & Commercial/Cooperative Banks', financialBenefit: 'Collateral-free crop loan up to Rs 3 Lakh at effective 4% interest rate', eligibility: ['All individual farmers, tenant cultivators, sharecroppers', 'Satisfactory CIBIL/Credit history or local PAC society membership'], documentsRequired: ['Land Record / Lease Agreement', 'Crop cultivation proof issued by Village Accountant', 'Identity and Address proof', 'Passport photos (2)'], deadline: 'Available Year-round at Bank Branch', applicationMode: 'CSC Center', status: 'Year-round', officialUrl: 'https://www.myscheme.gov.in/schemes/kcc', appliedStatus: 'Not Applied', category: 'Credit & Loan' },
      { id: 'sch-4', name: 'PM-KUSUM Component-B (Solar Water Pumping System)', shortName: 'PM-KUSUM Solar Agri Pump', department: 'Ministry of New & Renewable Energy (MNRE)', financialBenefit: '60% Govt Subsidy (30% Central + 30% State) + 30% Bank Loan', eligibility: ['Individual farmers with tubewell/openwell without grid power', 'Pumps of 3 HP, 5 HP, 7.5 HP, or 10 HP capacity'], documentsRequired: ['Land Khata certificate', 'Borewell water yield test certificate', 'No-Objection from local Electricity Board (ESCOM)', 'Bank Account details'], deadline: 'Oct 31, 2026', applicationMode: 'Online', status: 'Open', officialUrl: 'https://pmkusum.mnre.gov.in', appliedStatus: 'Not Applied', category: 'Equipment & Solar' },
      { id: 'sch-5', name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', shortName: 'PMFBY Crop Insurance', department: 'Ministry of Agriculture & Farmers Welfare', financialBenefit: 'Comprehensive coverage against drought, flood, pests at just 1.5% - 2% farmer premium', eligibility: ['All farmers cultivating notified Kharif/Rabi crops in notified areas'], documentsRequired: ['Sowing certificate', 'Land RTC', 'Aadhaar card', 'Bank passbook'], deadline: 'Sep 15, 2026 (Kharif Cut-off)', applicationMode: 'Online', status: 'Expiring Soon', officialUrl: 'https://pmfby.gov.in', appliedStatus: 'Approved', category: 'Insurance' }
    ];
    schemes.forEach((s) => this.schemes.set(s.id, s));

    // Transactions
    const txs: FinancialTransaction[] = [
      { id: 'tx-1', type: 'Income', category: 'Crop Sales', amount: 142000, date: '2026-08-20', description: 'Early batch Tomato sale at Kolar APMC (58 Qtl @ Rs 24.5/kg)', cropAssociated: 'Tomato (Abhinav F1)' },
      { id: 'tx-2', type: 'Income', category: 'Subsidies', amount: 2000, date: '2026-08-01', description: 'PM-KISAN 16th DBT instalment credited' },
      { id: 'tx-3', type: 'Income', category: 'Crop Sales', amount: 341000, date: '2026-07-14', description: 'Sugarcane interim mill payment from Pandavapura Sugar Factory', cropAssociated: 'Sugarcane (Co 86032)' },
      { id: 'tx-4', type: 'Expense', category: 'Fertilizer', amount: 14800, date: '2026-08-12', description: 'Purchased 4 bags DAP + 6 bottles IFFCO Nano Urea & Potash', cropAssociated: 'Sugarcane (Co 86032)' },
      { id: 'tx-5', type: 'Expense', category: 'Pesticide', amount: 6200, date: '2026-08-16', description: 'Bio-fungicide Trichoderma + Neem Azadirachtin spray bottles', cropAssociated: 'Tomato (Abhinav F1)' },
      { id: 'tx-6', type: 'Expense', category: 'Labor', amount: 18500, date: '2026-08-05', description: 'Trellising, bamboo staking, and weeding labor charges (6 workers x 4 days)', cropAssociated: 'Tomato (Abhinav F1)' },
      { id: 'tx-7', type: 'Expense', category: 'Machinery/Fuel', amount: 8400, date: '2026-07-28', description: 'Tractor rotavator hiring for Ragi field seedbed preparation', cropAssociated: 'Ragi (Finger Millet GPU-28)' },
      { id: 'tx-8', type: 'Expense', category: 'Seeds', amount: 4500, date: '2026-07-12', description: 'GPU-28 certified ragi breeder seeds (30 kg)', cropAssociated: 'Ragi (Finger Millet GPU-28)' }
    ];
    txs.forEach((t) => this.transactions.set(t.id, t));

    // IoT Devices
    const iot: IoTDevice[] = [
      { id: 'iot-1', name: 'Soil Multi-Depth Probe #1', type: 'Soil Probe', fieldLocation: 'Sugarcane Block North (Field 1A)', batteryLevel: 88, signalStrength: 94, status: 'Normal', lastPing: '2 mins ago', metrics: { soilMoisture: 58, soilTemp: 24.5, sunlightLux: 48200 } },
      { id: 'iot-2', name: 'Micro-Weather Telemetry Node', type: 'Weather Node', fieldLocation: 'Central Farm Observatory Mast', batteryLevel: 92, signalStrength: 98, status: 'Normal', lastPing: '1 min ago', metrics: { ambientTemp: 29.4, humidity: 76, sunlightLux: 51200 } },
      { id: 'iot-3', name: 'Borewell Sump Level Monitor', type: 'Water Level Sensor', fieldLocation: 'South Borewell Pump House', batteryLevel: 74, signalStrength: 82, status: 'Normal', lastPing: '4 mins ago', metrics: { waterLevel: 82 } },
      { id: 'iot-4', name: 'Tomato Canopy Leaf Wetness Node', type: 'Leaf Wetness', fieldLocation: 'Tomato Poly-Drip Plot (Field 1B)', batteryLevel: 65, signalStrength: 89, status: 'Warning', lastPing: '6 mins ago', metrics: { soilMoisture: 42, soilTemp: 26.2, humidity: 84 } },
      { id: 'iot-5', name: 'Smart IoT 3-Phase Pump Starter', type: 'Pump Controller', fieldLocation: 'Cauvery River Lift Pump Station', batteryLevel: 100, signalStrength: 96, status: 'Normal', lastPing: 'Just now', metrics: { ambientTemp: 31.0 } }
    ];
    iot.forEach((d) => this.iotDevices.set(d.id, d));

    // Smart Pump
    const pump: SmartPump = {
      id: 'pump-cauvery-01',
      name: 'KrishiSmart VFD 7.5 HP Solar-Grid Hybrid Pump',
      field: 'Sugarcane & Tomato Plot (Farm 1)',
      hp: 7.5,
      status: 'OFF',
      mode: 'AUTO',
      currentFlowLpm: 320,
      dailyWaterLitres: 14200,
      soilMoistureThreshold: 45,
      nextSchedule: 'Tomorrow at 06:00 AM (45 mins)',
      schedules: [
        { id: 'sch-p1', startTime: '06:00 AM', durationMins: 45, days: ['Mon', 'Wed', 'Fri'], enabled: true },
        { id: 'sch-p2', startTime: '05:30 PM', durationMins: 30, days: ['Tue', 'Thu', 'Sat'], enabled: false }
      ]
    };
    this.smartPumps.set(pump.id, pump);

    // Drone Plans
    const drone: DronePlan[] = [
      { id: 'drn-101', fieldName: 'Tomato Abhinav Plot (Field 1B)', cropName: 'Tomato', areaAcres: 1.2, sprayType: 'Bio-Fungicide', chemicalName: 'Trichoderma Harzianum + Seaweed Extract', solutionVolumeLitres: 15, altitudeMeters: 2.5, estimatedFlightTimeMinutes: 8.5, batteryPacksNeeded: 1, windSpeedAcceptable: true, status: 'Completed', coverageProgress: 100 },
      { id: 'drn-102', fieldName: 'Sugarcane Main Block (Field 1A)', cropName: 'Sugarcane', areaAcres: 2.5, sprayType: 'Nano Urea', chemicalName: 'IFFCO Nano Urea + Zinc Chelate EDTA 12%', solutionVolumeLitres: 30, altitudeMeters: 3.5, estimatedFlightTimeMinutes: 16.0, batteryPacksNeeded: 2, windSpeedAcceptable: true, status: 'Scheduled', coverageProgress: 0 }
    ];
    drone.forEach((p) => this.dronePlans.set(p.id, p));

    // Store Products
    const products: StoreProduct[] = [
      { id: 'prod-1', name: 'IFFCO Nano Urea (Liquid) - 500 ml', category: 'Fertilizers', price: 225, originalPrice: 250, rating: 4.8, reviewCount: 420, image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300&auto=format&fit=crop&q=80', brand: 'IFFCO', inStock: true, badge: 'Govt Subsidized', description: 'Innovative nanotechnology liquid fertilizer replaces 1 bag of conventional urea with 80%+ nitrogen uptake efficiency.', features: ['4% Total Nitrogen w/v', 'Zero soil groundwater pollution', 'Enhances crop chlorophyll & tillering'], dosageOrUsage: '2-4 ml per litre of clean water during active vegetative stage.' },
      { id: 'prod-2', name: 'Trichoderma Viride Bio-Fungicide (1 kg)', category: 'Bio Products', price: 180, originalPrice: 220, rating: 4.9, reviewCount: 310, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&auto=format&fit=crop&q=80', brand: 'Multiplex Bio-Tech', inStock: true, badge: '100% Organic', description: 'Powerful eco-friendly biocontrol agent effective against root rot, wilt, damping-off, and fungal blights.', features: ['2x10^6 CFU/gm minimum count', 'Promotes root mycorrhizal symbiosis', 'Safe for pollinators and earthworms'], dosageOrUsage: 'Seed treatment: 10g/kg seed. Foliar/Soil: 5g per litre of water.' },
      { id: 'prod-3', name: 'KrishiSmart IoT Soil Moisture & NPK Telemetry Probe', category: 'Sensors', price: 3499, originalPrice: 4999, rating: 4.9, reviewCount: 88, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80', brand: 'KrishiSmart IoT Hardware', inStock: true, badge: '50% Subsidy Ready', description: 'Stainless steel multi-depth sensor broadcasting real-time Soil Moisture %, Soil Temperature, and Salinity over LoRa/4G.', features: ['Solar + Lithium-ion 2-year battery', 'IP68 waterproof rugged enclosure', 'Direct sync with KrishiSmart AI dashboard'], dosageOrUsage: 'Insert 20-30cm deep into active root zone between drip emitters.' },
      { id: 'prod-4', name: 'Syngenta Abhinav F1 Tomato High-Yield Seeds (10g)', category: 'Seeds', price: 680, originalPrice: 750, rating: 4.7, reviewCount: 195, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop&q=80', brand: 'Syngenta Seeds', inStock: true, badge: 'Top Seller', description: 'Firm, deep red, square-round fruits with high tolerance to Tomato Leaf Curl Virus (ToLCV) and excellent transport shelf-life.', features: ['Fruit weight 90-100 grams', 'Harvest starts 65-70 days after planting', 'High continuous fruit setting'], dosageOrUsage: '40-50g seed required per acre nursery.' }
    ];
    products.forEach((p) => this.products.set(p.id, p));

    // Notifications
    const notifications: NotificationItem[] = [
      { id: 'ntf-1', title: 'Monsoon Rain & Spray Caution Alert', message: '65% to 80% heavy rainfall forecast for Mandya over the next 36 hours. Hold off chemical spraying.', timestamp: '15 mins ago', priority: 'Critical', category: 'Weather', read: false, actionRoute: 'weather' },
      { id: 'ntf-2', title: 'Early Blight Detected on Tomato Crop', message: 'Diagnostic scanner detected 88% confidence Early Blight. Apply recommended Trichoderma or Mancozeb spray.', timestamp: '2 hours ago', priority: 'Important', category: 'Disease', read: false, actionRoute: 'aiHub' },
      { id: 'ntf-3', title: 'Tomato Mandi Price Spike: Rs 2,450 / Qtl (+12.4%)', message: 'Kolar APMC Mandi reports supply deficit. KrishiBhavishya forecasts peak selling window in 15 days.', timestamp: '4 hours ago', priority: 'Important', category: 'Market', read: false, actionRoute: 'krishiBhavishya' },
      { id: 'ntf-4', title: 'PMKSY Micro-Irrigation 90% Subsidy Closing Soon', message: 'State government quota for Drip & Sprinkler subsidy application closes on Sep 30, 2026.', timestamp: '1 day ago', priority: 'Normal', category: 'Govt Schemes', read: true, actionRoute: 'govtSchemes' }
    ];
    notifications.forEach((n) => this.notifications.set(n.id, n));

    // Achievements
    const achievements: AchievementBadge[] = [
      { id: 'ach-1', name: 'Precision Pioneer', description: 'Connect first IoT Soil Probe and monitor live moisture', icon: 'Radio', unlocked: true, unlockedAt: 'Jul 2026', progress: 1, maxProgress: 1, xpValue: 200 },
      { id: 'ach-2', name: 'Master AI Diagnostician', description: 'Scan 5 crop disease cases with AI Crop Doctor', icon: 'BrainCircuit', unlocked: true, unlockedAt: 'Aug 2026', progress: 5, maxProgress: 5, xpValue: 350 },
      { id: 'ach-3', name: 'Sky Commander', description: 'Execute 3 autonomous drone precision spray missions', icon: 'Plane', unlocked: false, progress: 1, maxProgress: 3, xpValue: 500 },
      { id: 'ach-4', name: 'Mandi Oracle', description: 'Sell produce at predicted peak window with KrishiBhavishya', icon: 'TrendingUp', unlocked: true, unlockedAt: 'Jul 2026', progress: 1, maxProgress: 1, xpValue: 400 },
      { id: 'ach-5', name: 'Aqua Guardian', description: 'Save 20,000 Litres of water using Smart Pump auto-triggers', icon: 'Droplets', unlocked: true, unlockedAt: 'Aug 2026', progress: 14200, maxProgress: 20000, xpValue: 450 }
    ];
    achievements.forEach((a) => this.achievements.set(a.id, a));

    // KrishiBhavishya Forecasts
    const forecasts: KrishiBhavishyaForecast[] = [
      {
        crop: 'Tomato',
        currentPrice: 24.5,
        timeframes: { today: 24.5, days7: 29.0, days15: 35.5, days30: 42.0, days60: 22.0 },
        bestSellingWindow: 'Day 25 to Day 32 (Approx. Sep 20 - Sep 28)',
        peakPrice: 42.0,
        expectedProfitIncrease: 71.4,
        confidenceScore: 91,
        marketSentiment: 'Strong Bullish',
        riskScore: 'Low',
        factors: [
          'Heavy monsoon flooding in Northern tomato belts (Himachal & Nashik) reducing North Indian market arrivals.',
          'Festival season surge (Ganesh Chaturthi & Navratri) driving institutional wholesale demand.',
          'Local Mandya & Kolar arrival volumes down by 28% compared to historical 5-year averages.',
          'Cold storage capacity in South India currently operating at 86% occupancy.'
        ]
      },
      {
        crop: 'Onion',
        currentPrice: 34.0,
        timeframes: { today: 34.0, days7: 36.5, days15: 41.0, days30: 48.0, days60: 38.0 },
        bestSellingWindow: 'Day 28 to Day 35',
        peakPrice: 48.0,
        expectedProfitIncrease: 41.2,
        confidenceScore: 88,
        marketSentiment: 'Bullish',
        riskScore: 'Moderate',
        factors: ['Export duty rationalization by government', 'Delayed kharif nursery transplanting in central Maharashtra']
      },
      {
        crop: 'Paddy',
        currentPrice: 26.5,
        timeframes: { today: 26.5, days7: 26.8, days15: 27.2, days30: 28.5, days60: 29.0 },
        bestSellingWindow: 'Day 50 to Day 60',
        peakPrice: 29.0,
        expectedProfitIncrease: 9.4,
        confidenceScore: 94,
        marketSentiment: 'Neutral',
        riskScore: 'Low',
        factors: ['Govt Minimum Support Price (MSP) floor protection', 'Stable buffer stocks in FCI godowns']
      },
      {
        crop: 'Sugarcane',
        currentPrice: 32.0,
        timeframes: { today: 32.0, days7: 32.0, days15: 32.5, days30: 33.2, days60: 34.0 },
        bestSellingWindow: 'Day 45 to Day 60',
        peakPrice: 34.0,
        expectedProfitIncrease: 6.25,
        confidenceScore: 96,
        marketSentiment: 'Bullish',
        riskScore: 'Low',
        factors: ['Ethanol blending target raised to 20%', 'Sugar mill crushing season quotas opening']
      },
      {
        crop: 'Ragi',
        currentPrice: 42.8,
        timeframes: { today: 42.8, days7: 43.5, days15: 44.8, days30: 47.0, days60: 46.2 },
        bestSellingWindow: 'Day 25 to Day 35',
        peakPrice: 47.0,
        expectedProfitIncrease: 9.8,
        confidenceScore: 89,
        marketSentiment: 'Bullish',
        riskScore: 'Low',
        factors: ['International Year of Millets demand surge', 'State government PDS procurement at premium MSP']
      }
    ];
    forecasts.forEach((f) => this.bhavishyaForecasts.set(f.crop, f));

    // Sample Diagnostics
    const sampleDiagnostics = [
      {
        id: 'diag-tomato-blight',
        title: 'Tomato Early Blight (Alternaria solani)',
        crop: 'Tomato',
        sampleImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
        result: {
          diseaseName: 'Early Blight (Alternaria solani)',
          scientificName: 'Alternaria solani',
          cropType: 'Tomato / Solanaceae',
          confidence: 96.4,
          severity: 'Moderate',
          pathology: 'Fungal pathogen characterized by concentric target-like brown ring lesions with chlorotic yellow halos on older leaves.',
          organicTreatment: [
            'Foliar spray with Trichoderma viride or Pseudomonas fluorescens (5g/L) every 7 days',
            'Spray 5% diluted cold-pressed Neem Oil with soap emulsifier',
            'Remove and safely burn lower infected leaves to prevent spore splash'
          ],
          chemicalTreatment: [
            'Mancozeb 75% WP @ 2.5g / Litre of water',
            'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml / Litre of water',
            'Copper Oxychloride 50% WP @ 3g / Litre'
          ],
          preventiveMeasures: [
            'Install drip irrigation to avoid wet foliage (spores proliferate on wet leaves)',
            'Maintain 60cm row spacing for adequate air circulation',
            'Practice 3-year crop rotation without solanaceous crops (potato, brinjal)'
          ],
          recommendedProducts: ['Trichoderma Viride Bio-Fungicide (1 kg)', 'Multiplex Copper Oxychloride 50% WP']
        }
      },
      {
        id: 'diag-rice-blast',
        title: 'Rice / Paddy Leaf Blast (Magnaporthe oryzae)',
        crop: 'Paddy',
        sampleImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
        result: {
          diseaseName: 'Rice Leaf Blast (Magnaporthe oryzae)',
          scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
          cropType: 'Paddy / Rice',
          confidence: 94.8,
          severity: 'Severe',
          pathology: 'Spindle-shaped elliptical lesions with grayish-white centers and dark brown margins.',
          organicTreatment: [
            'Seed treatment with Pseudomonas fluorescens @ 10g/kg seed',
            'Foliar spray of 20% cow urine + Asafoetida extract',
            'Apply silica-rich rice husk ash to strengthen plant epidermis'
          ],
          chemicalTreatment: [
            'Tricyclazole 75% WP @ 0.6g / Litre of water',
            'Isoprothiolane 40% EC @ 1.5 ml / Litre',
            'Kasugamycin 3% SL @ 2.5 ml / Litre'
          ],
          preventiveMeasures: [
            'Avoid excessive split doses of chemical nitrogen fertilizer',
            'Maintain continuous thin water film in field during tillering',
            'Use blast-resistant varieties like GPU-28 or MTU-1010'
          ],
          recommendedProducts: ['Tata Rallies Tricyclazole 75% WP', 'IFFCO Nano Urea']
        }
      },
      {
        id: 'diag-cotton-curl',
        title: 'Cotton Leaf Curl Virus (CLCuV)',
        crop: 'Cotton',
        sampleImage: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&auto=format&fit=crop&q=80',
        result: {
          diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
          scientificName: 'Begomovirus / Geminiviridae',
          cropType: 'Cotton',
          confidence: 92.1,
          severity: 'Critical',
          pathology: 'Upward/downward cupping of leaves, thickening of veins, and small enation (leaf-like outgrowths) on underside.',
          organicTreatment: [
            'Install yellow sticky traps (15 per acre) to trap whitefly vectors',
            'Spray 10% Agniastra or Dashaparni Kashayam organic extract',
            'Encourage natural predators like Chrysoperla carnea (green lacewings)'
          ],
          chemicalTreatment: [
            'Diafenthiuron 50% WP @ 1.2g / Litre for vector control',
            'Pyriproxyfen 10% + Bifenthrin 10% EC @ 2 ml / Litre',
            'Thiamethoxam 25% WG @ 0.3g / Litre'
          ],
          preventiveMeasures: [
            'Eradicate alternative weed hosts (Abutilon indicum, Parthenium)',
            'Avoid planting near okra or cucurbit fields that harbor whiteflies',
            'Sow virus-tolerant Bt hybrid cultivars early in the season'
          ],
          recommendedProducts: ['Yellow Sticky Insect Traps (Pack of 25)', 'Syngenta Pegasus Diafenthiuron']
        }
      }
    ];
    sampleDiagnostics.forEach((s) => this.sampleDiagnostics.set(s.id, s));
  }

  // ==================================================
  // PERSISTENCE ENGINE (Atomic File-Backed Storage)
  // ==================================================

  public initStore() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const success = this.loadFromFile();
        if (!success || this.admins.size === 0) {
          console.log('⚡ Seeding initial KrishiSmart & Admin data...');
          this.seedInitialData();
          this.seedAdminAndCMSData();
          this.saveToFile();
        } else {
          console.log('💾 KrishiSmart DB successfully hydrated from persistent store.');
        }
      } else {
        console.log('🌱 First-time initialization of KrishiSmart database...');
        this.seedInitialData();
        this.seedAdminAndCMSData();
        this.saveToFile();
      }
    } catch (err: any) {
      console.warn('⚠️ Error initializing DB persistence, falling back to in-memory seeds:', err.message);
      this.seedInitialData();
      this.seedAdminAndCMSData();
    }
  }

  public saveToFile(): boolean {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      const state = {
        users: Array.from(this.users.entries()),
        farms: Array.from(this.farms.entries()),
        crops: Array.from(this.crops.entries()),
        tasks: Array.from(this.tasks.entries()),
        weather: this.weather,
        mandis: Array.from(this.mandis.entries()),
        schemes: Array.from(this.schemes.entries()),
        financialSummary: this.financialSummary,
        transactions: Array.from(this.transactions.entries()),
        iotDevices: Array.from(this.iotDevices.entries()),
        smartPumps: Array.from(this.smartPumps.entries()),
        dronePlans: Array.from(this.dronePlans.entries()),
        products: Array.from(this.products.entries()),
        orders: Array.from(this.orders.entries()),
        notifications: Array.from(this.notifications.entries()),
        achievements: Array.from(this.achievements.entries()),
        bhavishyaForecasts: Array.from(this.bhavishyaForecasts.entries()),
        sampleDiagnostics: Array.from(this.sampleDiagnostics.entries()),

        // Admin & CMS
        admins: Array.from(this.admins.entries()),
        pages: Array.from(this.pages.entries()),
        dashboardConfig: this.dashboardConfig,
        media: Array.from(this.media.entries()),
        activityLogs: this.activityLogs,
        siteSettings: this.siteSettings,
        weatherAdvisories: Array.from(this.weatherAdvisories.entries()),
        aiArticles: Array.from(this.aiArticles.entries()),
        droneServices: Array.from(this.droneServices.entries())
      };

      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
      return true;
    } catch (err: any) {
      console.error('❌ Failed to save database to file:', err.message);
      return false;
    }
  }

  public loadFromFile(): boolean {
    try {
      if (!fs.existsSync(DB_FILE)) return false;
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (!raw.trim()) return false;

      const data = JSON.parse(raw);

      if (data.users) this.users = new Map(data.users);
      if (data.farms) this.farms = new Map(data.farms);
      if (data.crops) this.crops = new Map(data.crops);
      if (data.tasks) this.tasks = new Map(data.tasks);
      if (data.weather) this.weather = data.weather;
      if (data.mandis) this.mandis = new Map(data.mandis);
      if (data.schemes) this.schemes = new Map(data.schemes);
      if (data.financialSummary) this.financialSummary = data.financialSummary;
      if (data.transactions) this.transactions = new Map(data.transactions);
      if (data.iotDevices) this.iotDevices = new Map(data.iotDevices);
      if (data.smartPumps) this.smartPumps = new Map(data.smartPumps);
      if (data.dronePlans) this.dronePlans = new Map(data.dronePlans);
      if (data.products) this.products = new Map(data.products);
      if (data.orders) this.orders = new Map(data.orders);
      if (data.notifications) this.notifications = new Map(data.notifications);
      if (data.achievements) this.achievements = new Map(data.achievements);
      if (data.bhavishyaForecasts) this.bhavishyaForecasts = new Map(data.bhavishyaForecasts);
      if (data.sampleDiagnostics) this.sampleDiagnostics = new Map(data.sampleDiagnostics);

      // Admin & CMS
      if (data.admins) this.admins = new Map(data.admins);
      if (data.pages) this.pages = new Map(data.pages);
      if (data.dashboardConfig) this.dashboardConfig = data.dashboardConfig;
      if (data.media) this.media = new Map(data.media);
      if (data.activityLogs) this.activityLogs = data.activityLogs;
      if (data.siteSettings) this.siteSettings = data.siteSettings;
      if (data.weatherAdvisories) this.weatherAdvisories = new Map(data.weatherAdvisories);
      if (data.aiArticles) this.aiArticles = new Map(data.aiArticles);
      if (data.droneServices) this.droneServices = new Map(data.droneServices);

      // Ensure essential configs exist even if loaded from partial file
      if (!this.dashboardConfig || this.admins.size === 0 || this.pages.size === 0) {
        this.seedAdminAndCMSData();
      }

      return true;
    } catch (err: any) {
      console.error('❌ Failed to parse existing db.json file:', err.message);
      return false;
    }
  }

  public logActivity(adminName: string, adminEmail: string, action: string, page: string, record?: string) {
    const log: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminName,
      adminEmail,
      action,
      page,
      record,
      timestamp: new Date().toISOString()
    };
    this.activityLogs.unshift(log);
    if (this.activityLogs.length > 500) {
      this.activityLogs.pop();
    }
    this.saveToFile();
    return log;
  }

  public seedAdminAndCMSData() {
    // 1. Admin Users
    const admins: AdminUser[] = [
      {
        id: 'adm-1',
        name: 'Darshan Patil (Super Admin)',
        email: 'admin@krishismart.ai',
        passwordHash: hashPassword('admin123'),
        role: 'Super Admin',
        status: 'Active',
        createdAt: '2026-01-10T10:00:00Z',
        lastLogin: new Date().toISOString()
      },
      {
        id: 'adm-2',
        name: 'Content Operations Manager',
        email: 'editor@krishismart.ai',
        passwordHash: hashPassword('editor123'),
        role: 'Admin',
        status: 'Active',
        createdAt: '2026-02-15T11:00:00Z',
        lastLogin: '2026-09-20T08:30:00Z'
      },
      {
        id: 'adm-3',
        name: 'Agronomy Field Editor',
        email: 'content@krishismart.ai',
        passwordHash: hashPassword('content123'),
        role: 'Editor',
        status: 'Active',
        createdAt: '2026-03-01T09:00:00Z',
        lastLogin: '2026-09-21T14:15:00Z'
      }
    ];
    admins.forEach((a) => this.admins.set(a.id, a));

    // 2. Dashboard Config
    this.dashboardConfig = {
      hero: {
        greeting: 'GOOD AFTERNOON, FARMER',
        mainHeading: 'GOOD AFTERNOON, FARMER 🌱',
        subtitle: 'Real-time farm status for Mandya, Karnataka. Precision AI monitoring active.',
        locationText: 'Pandavapura, Mandya, Karnataka',
        farmHealthScore: 94,
        heroBg: 'from-emerald-800 to-emerald-900',
        heroImage: '',
        buttonText: 'Farm Health: 94/100',
        buttonLink: 'myFarms',
        visible: true
      },
      statusCards: [
        {
          id: 'card-location',
          title: 'Current Location',
          value: '📍 Pandavapura, Mandya, Karnataka',
          description: 'Click to change location',
          icon: 'MapPin',
          color: 'emerald',
          route: 'locationModal',
          visible: true,
          order: 1
        },
        {
          id: 'card-weather',
          title: 'Weather',
          value: '🌡️ 29.4°C • Partly Cloudy',
          description: 'Wind: 11.2 km/h • 65% Rain Caution',
          icon: 'Sun',
          color: 'amber',
          route: 'weather',
          visible: true,
          order: 2
        },
        {
          id: 'card-crop-health',
          title: 'Crop Health',
          value: '🌾 94% Optimal Health',
          description: '4 active crop parcels monitored',
          icon: 'Wheat',
          color: 'emerald',
          route: 'myFarms',
          visible: true,
          order: 3
        },
        {
          id: 'card-soil-moisture',
          title: 'Soil Moisture',
          value: '💧 58% (Optimal)',
          description: 'Smart Pump: Auto Mode (OFF)',
          icon: 'Droplets',
          color: 'cyan',
          route: 'pump',
          visible: true,
          order: 4
        }
      ],
      quickActions: [
        {
          id: 'aiHub',
          label: 'Crop Scan',
          icon: '🌱',
          route: 'aiHub',
          bg: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200',
          description: 'Instant AI crop disease diagnosis',
          visible: true,
          order: 1
        },
        {
          id: 'weather',
          label: 'Weather',
          icon: '🌦️',
          route: 'weather',
          bg: 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200',
          description: 'Rain alerts & spray advisory',
          visible: true,
          order: 2
        },
        {
          id: 'market',
          label: 'Market',
          icon: '📈',
          route: 'market',
          bg: 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200',
          description: 'Live APMC mandi rates & trends',
          visible: true,
          order: 3
        },
        {
          id: 'finance',
          label: 'Finance',
          icon: '💰',
          route: 'finance',
          bg: 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200',
          description: 'KrishiNidhi farm profit & ledger',
          visible: true,
          order: 4
        },
        {
          id: 'drone',
          label: 'Drone',
          icon: '🚁',
          route: 'drone',
          bg: 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200',
          description: 'Precision drone spraying booking',
          visible: true,
          order: 5
        },
        {
          id: 'pump',
          label: 'Pump',
          icon: '💧',
          route: 'pump',
          bg: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-200',
          description: 'Automated irrigation controls',
          visible: true,
          order: 6
        },
        {
          id: 'iot',
          label: 'IoT',
          icon: '📡',
          route: 'iot',
          bg: 'bg-stone-100 hover:bg-stone-200 text-stone-900 border-stone-300',
          description: 'Multi-depth soil sensor telemetry',
          visible: true,
          order: 7
        }
      ]
    };

    // 3. Universal CMS Pages (13 Farmer Pages)
    const initialPages: CMSPage[] = [
      {
        id: 'page-dashboard',
        slug: 'dashboard',
        name: 'Farmer Dashboard',
        route: '/',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-dash-hero',
            title: 'Hero Overview & Greeting',
            type: 'hero',
            visible: true,
            order: 1,
            components: [
              { id: 'c-dash-1', type: 'badge', title: 'Smart Farming Platform', visible: true, order: 1 },
              { id: 'c-dash-2', type: 'heading', title: 'GOOD AFTERNOON, FARMER 🌱', visible: true, order: 2 },
              { id: 'c-dash-3', type: 'paragraph', title: 'Location & Telemetry Briefing', visible: true, order: 3 }
            ]
          },
          {
            id: 'sec-dash-status',
            title: 'Current Farm Status Cards',
            type: 'grid',
            visible: true,
            order: 2,
            components: [
              { id: 'c-st-1', type: 'card', title: 'Current Location', content: 'Pandavapura, Mandya', visible: true, order: 1 },
              { id: 'c-st-2', type: 'weather', title: 'Live Weather', content: '29.4°C • Partly Cloudy', visible: true, order: 2 },
              { id: 'c-st-3', type: 'crop', title: 'Crop Health', content: '94% Healthy', visible: true, order: 3 },
              { id: 'c-st-4', type: 'card', title: 'Soil Moisture', content: '58% Optimal', visible: true, order: 4 }
            ]
          },
          {
            id: 'sec-dash-quickactions',
            title: 'Quick Actions Bar',
            type: 'grid',
            visible: true,
            order: 3,
            components: [
              { id: 'c-qa-1', type: 'button', title: 'Crop Scan', icon: '🌱', link: '/crop-scan', visible: true, order: 1 },
              { id: 'c-qa-2', type: 'button', title: 'Weather', icon: '🌦️', link: '/weather', visible: true, order: 2 },
              { id: 'c-qa-3', type: 'button', title: 'Market', icon: '📈', link: '/market', visible: true, order: 3 },
              { id: 'c-qa-4', type: 'button', title: 'Finance', icon: '💰', link: '/finance', visible: true, order: 4 },
              { id: 'c-qa-5', type: 'button', title: 'Drone', icon: '🚁', link: '/drone', visible: true, order: 5 },
              { id: 'c-qa-6', type: 'button', title: 'Pump', icon: '💧', link: '/pump', visible: true, order: 6 },
              { id: 'c-qa-7', type: 'button', title: 'IoT', icon: '📡', link: '/iot', visible: true, order: 7 }
            ]
          }
        ]
      },
      {
        id: 'page-my-farm',
        slug: 'my-farm',
        name: 'My Farm Parcels',
        route: '/my-farm',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-farm-hero',
            title: 'Farm Management Header',
            type: 'banner',
            visible: true,
            order: 1,
            components: [
              { id: 'c-mf-1', type: 'heading', title: 'Cauvery River Oasis & Siddaganga Parcels', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-crops',
        slug: 'crops',
        name: 'Crops & Fields',
        route: '/crops',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-crops-active',
            title: 'Active Crop Portfolios',
            type: 'grid',
            visible: true,
            order: 1,
            components: [
              { id: 'c-cr-1', type: 'crop', title: 'Paddy BPT-5204', content: '2.5 Acres', visible: true, order: 1 },
              { id: 'c-cr-2', type: 'crop', title: 'Tomato Arka Rakshak', content: '2.0 Acres', visible: true, order: 2 },
              { id: 'c-cr-3', type: 'crop', title: 'Sugarcane Co-86032', content: '2.0 Acres', visible: true, order: 3 },
              { id: 'c-cr-4', type: 'crop', title: 'Bt Cotton RCH-659', content: '1.5 Acres', visible: true, order: 4 }
            ]
          }
        ]
      },
      {
        id: 'page-ai-advisor',
        slug: 'ai-advisor',
        name: 'AI Hub & Disease Diagnostics',
        route: '/ai-advisor',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-ai-hub',
            title: 'AI Crop Doctor Scanner',
            type: 'card',
            visible: true,
            order: 1,
            components: [
              { id: 'c-ai-1', type: 'heading', title: '24/7 AI Precision Agronomist', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-weather',
        slug: 'weather',
        name: 'Weather & Climate Center',
        route: '/weather',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-weather-alert',
            title: 'Monsoon Alert Banner',
            type: 'alert',
            visible: true,
            order: 1,
            components: [
              { id: 'c-wth-1', type: 'alert', title: '65% Rain Warning', content: 'Hold off pesticide spraying for 24 hours.', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-market',
        slug: 'market',
        name: 'Market & Mandi Rates',
        route: '/market',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-market-rates',
            title: 'Regional Mandi Price Matrix',
            type: 'grid',
            visible: true,
            order: 1,
            components: [
              { id: 'c-mkt-1', type: 'statistic', title: 'Tomato Kolar APMC', content: 'Rs 2,450 / Qtl', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-finance',
        slug: 'finance',
        name: 'KrishiNidhi Finance',
        route: '/finance',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-fin-summary',
            title: 'Farm Profitability Summary',
            type: 'card',
            visible: true,
            order: 1,
            components: [
              { id: 'c-fin-1', type: 'statistic', title: 'Net Farm Income', content: 'Rs 2,92,600', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-schemes',
        slug: 'schemes',
        name: 'Government Schemes',
        route: '/schemes',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-sch-list',
            title: 'Central & State Subsidy Portal',
            type: 'list',
            visible: true,
            order: 1,
            components: [
              { id: 'c-sch-1', type: 'scheme', title: 'PM-KISAN DBT', content: 'Rs 6,000 / year', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-krishibhavishya',
        slug: 'krishibhavishya',
        name: 'KrishiBhavishya Forecasts',
        route: '/krishibhavishya',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-kb-forecast',
            title: 'AI Future Harvest Price Predictions',
            type: 'chart',
            visible: true,
            order: 1,
            components: [
              { id: 'c-kb-1', type: 'chart', title: 'Tomato 60-Day Price Trajectory', content: 'Peak: Rs 42/kg', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-drone',
        slug: 'drone',
        name: 'DroneSpray AI Missions',
        route: '/drone',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-dr-fleet',
            title: 'Autonomous Drone Fleet Services',
            type: 'card',
            visible: true,
            order: 1,
            components: [
              { id: 'c-dr-1', type: 'card', title: 'Precision Bio-Fungicide Spray', content: 'Rs 450 / Acre', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-iot',
        slug: 'iot',
        name: 'SmartFarm IoT Network',
        route: '/iot',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-iot-telemetry',
            title: 'Field Sensor Node Telemetry',
            type: 'grid',
            visible: true,
            order: 1,
            components: [
              { id: 'c-iot-1', type: 'statistic', title: 'Soil Probe #1', content: 'Moisture 58% • Temp 24.5°C', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-smart-pump',
        slug: 'smart-pump',
        name: 'Smart Irrigation Pump',
        route: '/smart-pump',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-pump-vfd',
            title: 'Solar-Grid Hybrid 7.5 HP Pump Starter',
            type: 'card',
            visible: true,
            order: 1,
            components: [
              { id: 'c-pmp-1', type: 'card', title: 'Cauvery River VFD Controller', content: 'AUTO Mode', visible: true, order: 1 }
            ]
          }
        ]
      },
      {
        id: 'page-store',
        slug: 'store',
        name: 'Krishi Agri Store',
        route: '/store',
        status: 'Published',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Darshan Patil',
        sections: [
          {
            id: 'sec-store-prod',
            title: 'Certified Inputs & IoT Hardware',
            type: 'grid',
            visible: true,
            order: 1,
            components: [
              { id: 'c-str-1', type: 'product', title: 'IFFCO Nano Urea', content: 'Rs 225', visible: true, order: 1 }
            ]
          }
        ]
      }
    ];
    initialPages.forEach((p) => this.pages.set(p.id, p));

    // 4. Site Settings
    this.siteSettings = {
      siteName: 'KrishiSmart AI',
      logo: '🌱 KrishiSmart AI',
      favicon: '🌾',
      tagline: 'Smart Farming. Better Decisions. Better Future.',
      contactEmail: 'support@krishismart.ai',
      contactPhone: '+91 8000 123 456',
      socialLinks: {
        facebook: 'https://facebook.com/krishismart',
        twitter: 'https://twitter.com/krishismart',
        youtube: 'https://youtube.com/krishismart',
        instagram: 'https://instagram.com/krishismart'
      },
      defaultLanguage: 'en',
      theme: {
        primaryColor: '#16a34a',
        accentColor: '#d97706'
      },
      footerText: '© 2026 KrishiSmart AI Platform. Empowering precision agriculture for Indian farmers.',
      supportInfo: '24/7 Farmer Helpline available via Toll-Free Voice Call & WhatsApp in Kannada, Hindi, and English.'
    };

    // 5. Media Library
    const mediaSeeds: MediaItem[] = [
      {
        id: 'med-1',
        name: 'Lush Paddy Field Canopy',
        url: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        size: 245000,
        uploadedAt: '2026-08-10',
        tags: ['crop', 'paddy', 'field']
      },
      {
        id: 'med-2',
        name: 'Ripening Red Hybrid Tomatoes',
        url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        size: 312000,
        uploadedAt: '2026-08-12',
        tags: ['crop', 'tomato', 'vegetables']
      },
      {
        id: 'med-3',
        name: 'Sugarcane Green Stalks',
        url: 'https://images.unsplash.com/photo-1598112972019-91e30f406976?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        size: 289000,
        uploadedAt: '2026-08-14',
        tags: ['crop', 'sugarcane']
      },
      {
        id: 'med-4',
        name: 'White Cotton Bolls in Sunlight',
        url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        size: 340000,
        uploadedAt: '2026-08-16',
        tags: ['crop', 'cotton']
      },
      {
        id: 'med-5',
        name: 'Precision Agricultural Spraying Drone',
        url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        size: 420000,
        uploadedAt: '2026-08-18',
        tags: ['drone', 'technology']
      },
      {
        id: 'med-6',
        name: 'IoT Soil Sensor in Soil',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        size: 390000,
        uploadedAt: '2026-08-20',
        tags: ['iot', 'sensor', 'probe']
      }
    ];
    mediaSeeds.forEach((m) => this.media.set(m.id, m));

    // 6. Weather Advisories
    const weatherAdv: WeatherAdvisoryItem[] = [
      {
        id: 'wadv-1',
        title: 'Monsoon Heavy Shower Advisory',
        message: '65% to 80% heavy rainfall forecast for Mandya district over next 36 hours. Avoid foliar spraying.',
        type: 'Warning',
        priority: 'High',
        validUntil: '2026-09-25',
        visible: true
      },
      {
        id: 'wadv-2',
        title: 'Optimal Spray Window Tomorrow Morning',
        message: 'Dry spell window between 06:00 AM and 09:30 AM before convective clouds build up.',
        type: 'Advisory',
        priority: 'Medium',
        validUntil: '2026-09-24',
        visible: true
      },
      {
        id: 'wadv-3',
        title: 'Kharif Post-Sowing Micro-Nutrient Recommendation',
        message: 'Foliar application of Zinc & Boron recommended for tillering Paddy and flowering Tomato.',
        type: 'Seasonal',
        priority: 'Low',
        validUntil: '2026-10-05',
        visible: true
      }
    ];
    weatherAdv.forEach((w) => this.weatherAdvisories.set(w.id, w));

    // 7. AI Advisor Articles
    const articles: AIAdvisorArticleItem[] = [
      {
        id: 'art-1',
        title: 'Integrated Pest Management for Tomato Early Blight',
        category: 'Disease Management',
        crop: 'Tomato',
        content: 'Early Blight caused by Alternaria solani manifests as concentric target rings. Prevent spore dissemination by combining drip irrigation with protective Trichoderma bio-fungicide sprays at 5g/L.',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        language: 'en',
        status: 'Published',
        tags: ['Tomato', 'Early Blight', 'Organic Spray'],
        createdAt: '2026-08-20'
      },
      {
        id: 'art-2',
        title: 'Nano Urea Application Timings in Sugarcane & Paddy',
        category: 'Nutrient Guide',
        crop: 'Sugarcane',
        content: 'IFFCO Nano Urea delivers 80%+ nitrogen assimilation directly into leaf stomata. Apply 4ml/L during active tillering in early morning or late afternoon for maximum leaf stomatal uptake.',
        image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80',
        language: 'en',
        status: 'Published',
        tags: ['Nano Urea', 'Sugarcane', 'Fertigation'],
        createdAt: '2026-08-22'
      },
      {
        id: 'art-3',
        title: 'Whitefly Control and Cotton Leaf Curl Prevention',
        category: 'Pest Control',
        crop: 'Cotton',
        content: 'Whitefly (Bemisia tabaci) transmits Gemini viruses. Install 15 yellow sticky traps per acre and apply neem extract spray before flower bud formation.',
        image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
        language: 'en',
        status: 'Published',
        tags: ['Cotton', 'Whitefly', 'Sticky Traps'],
        createdAt: '2026-08-25'
      }
    ];
    articles.forEach((a) => this.aiArticles.set(a.id, a));

    // 8. Drone Services
    const droneServices: DroneServiceItem[] = [
      {
        id: 'srv-1',
        name: 'Hexacopter 16L Precision Spraying Service',
        description: 'Autonomous RTK-guided aerial spray delivering uniform 15-20 micron droplet dispersion with zero crop stomping.',
        pricePerAcre: 450,
        status: 'Active',
        coverageType: 'Liquid Spray',
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
        availableLocations: ['Mandya', 'Mysuru', 'Kolar', 'Ramanagara', 'Tumakuru']
      },
      {
        id: 'srv-2',
        name: 'Multispectral NDVI Crop Health Scanning Mission',
        description: 'Near-infrared aerial crop health mapping detecting moisture stress and nitrogen deficits 7 days before visible symptoms appear.',
        pricePerAcre: 350,
        status: 'Active',
        coverageType: 'NDVI Multispectral Scan',
        image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&auto=format&fit=crop&q=80',
        availableLocations: ['Mandya', 'Mysuru', 'Hassan', 'Bengaluru Rural']
      }
    ];
    droneServices.forEach((d) => this.droneServices.set(d.id, d));

    // 9. Initial Activity Logs
    this.activityLogs = [
      {
        id: 'act-1',
        adminName: 'Darshan Patil',
        adminEmail: 'admin@krishismart.ai',
        action: 'System Initialized',
        page: 'System',
        record: 'KrishiSmart Admin Portal & CMS loaded',
        timestamp: '2026-09-22T06:00:00Z'
      },
      {
        id: 'act-2',
        adminName: 'Darshan Patil',
        adminEmail: 'admin@krishismart.ai',
        action: 'Published Page',
        page: 'Dashboard',
        record: 'Farmer Dashboard configured with 4 status cards',
        timestamp: '2026-09-22T06:10:00Z'
      },
      {
        id: 'act-3',
        adminName: 'Content Operations Manager',
        adminEmail: 'editor@krishismart.ai',
        action: 'Updated Mandi Rate',
        page: 'Market',
        record: 'Tomato rate updated to Rs 2,450/Qtl in Kolar APMC',
        timestamp: '2026-09-22T06:20:00Z'
      }
    ];
  }
}

export const db = new DatabaseStore();

