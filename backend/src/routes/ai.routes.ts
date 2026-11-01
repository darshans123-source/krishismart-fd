import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';

const router = Router();

router.post('/diagnose', AIController.diagnose);
router.get('/samples', AIController.getSamples);
router.post('/soil-analysis', AIController.analyzeSoil);
router.post('/yield-prediction', AIController.predictYield);
router.post('/crop-recommendation', AIController.recommendCrops);
router.post('/chat', AIController.chat);

export default router;
