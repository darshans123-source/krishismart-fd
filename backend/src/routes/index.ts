import { Router } from 'express';
import authRoutes from './auth.routes.js';
import farmRoutes from './farm.routes.js';
import cropRoutes from './crop.routes.js';
import aiRoutes from './ai.routes.js';
import diseaseRoutes from './disease.routes.js';
import soilRoutes from './soil.routes.js';
import financeRoutes from './finance.routes.js';
import schemeRoutes from './scheme.routes.js';
import marketRoutes from './market.routes.js';
import weatherRoutes from './weather.routes.js';
import notificationRoutes from './notification.routes.js';
import iotRoutes from './iot.routes.js';
import pumpRoutes from './pump.routes.js';
import droneRoutes from './drone.routes.js';
import storeRoutes from './store.routes.js';
import premiumRoutes from './premium.routes.js';
import assistantRoutes from './assistant.routes.js';
import adminRoutes from './admin.routes.js';
import cmsRoutes from './cms.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/crops', cropRoutes);
router.use('/ai', aiRoutes);
router.use('/disease', diseaseRoutes);
router.use('/soil', soilRoutes);
router.use('/finance', financeRoutes);
router.use('/schemes', schemeRoutes);
router.use('/market', marketRoutes);
router.use('/weather', weatherRoutes);
router.use('/notifications', notificationRoutes);
router.use('/iot', iotRoutes);
router.use('/pumps', pumpRoutes);
router.use('/drone', droneRoutes);
router.use('/store', storeRoutes);
router.use('/premium', premiumRoutes);
router.use('/assistant', assistantRoutes);

// Admin & CMS Endpoints
router.use('/admin', adminRoutes);
router.use('/cms', cmsRoutes);

export default router;

