import { Request, Response } from 'express';
import { db } from '../models/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class CMSController {
  public static async getDashboard(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, db.dashboardConfig);
  }

  public static async getPageBySlug(req: Request, res: Response): Promise<Response> {
    const { slug } = req.params;
    const page = Array.from(db.pages.values()).find(
      (p) => p.slug === slug || p.id === slug || p.route === `/${slug}`
    );

    if (!page) {
      return sendError(res, `Page '${slug}' not found`, 404);
    }

    return sendSuccess(res, page);
  }

  public static async getSettings(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, db.siteSettings);
  }

  public static async getWeatherAdvisories(req: Request, res: Response): Promise<Response> {
    const visible = Array.from(db.weatherAdvisories.values()).filter((w) => w.visible);
    return sendSuccess(res, visible);
  }

  public static async getCrops(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.crops.values()));
  }

  public static async getMarkets(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.markets.values()));
  }

  public static async getSchemes(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.schemes.values()));
  }

  public static async getStoreProducts(req: Request, res: Response): Promise<Response> {
    return sendSuccess(res, Array.from(db.products.values()));
  }

  public static async getAIArticles(req: Request, res: Response): Promise<Response> {
    const published = Array.from(db.aiArticles.values()).filter(a => a.status === 'published');
    return sendSuccess(res, published);
  }

  public static async getNotifications(req: Request, res: Response): Promise<Response> {
    const active = Array.from(db.notifications.values()).filter(n => n.status === 'active');
    return sendSuccess(res, active);
  }
}
