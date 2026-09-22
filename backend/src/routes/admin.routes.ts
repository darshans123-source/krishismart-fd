import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import {
  authenticateAdmin,
  requireSuperAdmin
} from '../middleware/adminAuth.middleware.js';

const router = Router();

// 1. Auth
router.post('/auth/login', AdminController.login);
router.get('/auth/me', authenticateAdmin, AdminController.getMe);

// 2. Stats
router.get('/stats', authenticateAdmin, AdminController.getStats);

// 3. Pages & Visual Editor
router.get('/pages', authenticateAdmin, AdminController.getAllPages);
router.get('/pages/:id', authenticateAdmin, AdminController.getPageById);
router.post('/pages/:id', authenticateAdmin, AdminController.savePage);
router.put('/pages/:id', authenticateAdmin, AdminController.savePage);
router.post('/pages/:id/publish', authenticateAdmin, AdminController.publishPage);
router.post('/pages/:id/duplicate', authenticateAdmin, AdminController.duplicatePage);
router.delete('/pages/:id', authenticateAdmin, AdminController.deletePage);

// 4. Dashboard Editor
router.get('/dashboard', authenticateAdmin, AdminController.getDashboardConfig);
router.put('/dashboard', authenticateAdmin, AdminController.updateDashboardConfig);
router.post('/dashboard', authenticateAdmin, AdminController.updateDashboardConfig);

// 5. Crops
router.get('/crops', authenticateAdmin, AdminController.getCrops);
router.post('/crops', authenticateAdmin, AdminController.createCrop);
router.put('/crops/:id', authenticateAdmin, AdminController.updateCrop);
router.delete('/crops/:id', authenticateAdmin, AdminController.deleteCrop);

// 6. Market
router.get('/market', authenticateAdmin, AdminController.getMarkets);
router.post('/market', authenticateAdmin, AdminController.createMarket);
router.put('/market/:id', authenticateAdmin, AdminController.updateMarket);
router.delete('/market/:id', authenticateAdmin, AdminController.deleteMarket);

// 7. Schemes
router.get('/schemes', authenticateAdmin, AdminController.getSchemes);
router.post('/schemes', authenticateAdmin, AdminController.createScheme);
router.put('/schemes/:id', authenticateAdmin, AdminController.updateScheme);
router.delete('/schemes/:id', authenticateAdmin, AdminController.deleteScheme);

// 8. Weather
router.get('/weather', authenticateAdmin, AdminController.getWeatherAdvisories);
router.post('/weather', authenticateAdmin, AdminController.createWeatherAdvisory);
router.put('/weather/:id', authenticateAdmin, AdminController.updateWeatherAdvisory);
router.delete('/weather/:id', authenticateAdmin, AdminController.deleteWeatherAdvisory);

// 9. AI Advisor
router.get('/ai-advisor', authenticateAdmin, AdminController.getAIArticles);
router.post('/ai-advisor', authenticateAdmin, AdminController.createAIArticle);
router.put('/ai-advisor/:id', authenticateAdmin, AdminController.updateAIArticle);
router.delete('/ai-advisor/:id', authenticateAdmin, AdminController.deleteAIArticle);

// 10. Drone
router.get('/drone', authenticateAdmin, AdminController.getDroneServices);
router.post('/drone', authenticateAdmin, AdminController.createDroneService);
router.put('/drone/:id', authenticateAdmin, AdminController.updateDroneService);
router.delete('/drone/:id', authenticateAdmin, AdminController.deleteDroneService);

// 11. IoT
router.get('/iot', authenticateAdmin, AdminController.getIoTDevices);
router.put('/iot/:id', authenticateAdmin, AdminController.updateIoTDevice);

// 12. Smart Pump
router.get('/smart-pump', authenticateAdmin, AdminController.getSmartPump);
router.put('/smart-pump', authenticateAdmin, AdminController.updateSmartPump);

// 13. Store
router.get('/store', authenticateAdmin, AdminController.getStoreProducts);
router.post('/store', authenticateAdmin, AdminController.createStoreProduct);
router.put('/store/:id', authenticateAdmin, AdminController.updateStoreProduct);
router.delete('/store/:id', authenticateAdmin, AdminController.deleteStoreProduct);

// 14. Media Library
router.get('/media', authenticateAdmin, AdminController.getMedia);
router.post('/media', authenticateAdmin, AdminController.uploadMedia);
router.delete('/media/:id', authenticateAdmin, AdminController.deleteMedia);

// 15. Users
router.get('/users', authenticateAdmin, AdminController.getUsers);
router.put('/users/:id', authenticateAdmin, AdminController.updateUser);

// 16. Notifications
router.get('/notifications', authenticateAdmin, AdminController.getNotifications);
router.post('/notifications', authenticateAdmin, AdminController.createNotification);
router.delete('/notifications/:id', authenticateAdmin, AdminController.deleteNotification);

// 17. Settings
router.get('/settings', authenticateAdmin, AdminController.getSettings);
router.put('/settings', authenticateAdmin, AdminController.updateSettings);

// 18. Admin Users (Super Admin Only)
router.get('/admin-users', authenticateAdmin, requireSuperAdmin, AdminController.getAdminUsers);
router.post('/admin-users', authenticateAdmin, requireSuperAdmin, AdminController.createAdminUser);
router.put('/admin-users/:id', authenticateAdmin, requireSuperAdmin, AdminController.updateAdminUser);
router.delete('/admin-users/:id', authenticateAdmin, requireSuperAdmin, AdminController.deleteAdminUser);

// 19. Activity Logs
router.get('/activity', authenticateAdmin, AdminController.getActivityLogs);

export default router;
