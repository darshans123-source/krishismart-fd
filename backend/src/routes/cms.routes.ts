import { Router } from 'express';
import { CMSController } from '../controllers/cms.controller.js';

const router = Router();

router.get('/dashboard', CMSController.getDashboard);
router.get('/pages/:slug', CMSController.getPageBySlug);
router.get('/settings', CMSController.getSettings);
router.get('/weather-advisories', CMSController.getWeatherAdvisories);
router.get('/crops', CMSController.getCrops);
router.get('/market', CMSController.getMarkets);
router.get('/schemes', CMSController.getSchemes);
router.get('/store', CMSController.getStoreProducts);
router.get('/ai-advisor', CMSController.getAIArticles);
router.get('/notifications', CMSController.getNotifications);

export default router;
