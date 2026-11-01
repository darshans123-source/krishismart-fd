import { Request, Response } from 'express';
import { CropDoctorService } from '../services/ai/cropDoctor.service.js';
import { SoilAnalysisService } from '../services/ai/soilAnalysis.service.js';
import { YieldPredictionService } from '../services/ai/yieldPrediction.service.js';
import { CropRecommendationService } from '../services/ai/cropRecommendation.service.js';
import { AssistantService } from '../services/ai/assistant.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class AIController {
  public static async diagnose(req: Request, res: Response): Promise<Response> {
    const { image, sampleId, cropHint } = req.body;
    const result = await CropDoctorService.analyzeImage(image, sampleId, cropHint);
    return sendSuccess(res, result, 'Diagnosis completed');
  }

  public static getSamples(req: Request, res: Response): Response {
    const samples = CropDoctorService.getSampleDiagnostics();
    return sendSuccess(res, samples);
  }

  public static analyzeSoil(req: Request, res: Response): Response {
    const { ph, nitrogen, phosphorus, potassium, organicCarbon, salinityEc } = req.body;
    if (ph === undefined || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
      return sendError(res, 'ph, nitrogen, phosphorus, and potassium are required', 400);
    }
    const report = SoilAnalysisService.analyzeSoil({ ph, nitrogen, phosphorus, potassium, organicCarbon, salinityEc });
    return sendSuccess(res, report, 'Soil analysis report generated');
  }

  public static predictYield(req: Request, res: Response): Response {
    const { crop, areaAcres, soilHealthRating, irrigationHealth, climateRiskFactor } = req.body;
    if (!crop || !areaAcres) {
      return sendError(res, 'crop and areaAcres are required', 400);
    }
    const prediction = YieldPredictionService.predictYield({
      crop,
      areaAcres,
      soilHealthRating,
      irrigationHealth,
      climateRiskFactor
    });
    return sendSuccess(res, prediction, 'Yield prediction generated');
  }

  public static recommendCrops(req: Request, res: Response): Response {
    const { state, district, season, soilType, waterSource, landSizeAcres } = req.body;
    if (!state) {
      return sendError(res, 'state is required', 400);
    }
    const recs = CropRecommendationService.recommendCrops({
      state,
      district,
      season,
      soilType,
      waterSource,
      landSizeAcres
    });
    return sendSuccess(res, recs, 'Crop recommendations generated');
  }

  public static async chat(req: Request, res: Response): Promise<Response> {
    const { query, language, context } = req.body;
    if (!query) {
      return sendError(res, 'query is required', 400);
    }
    const response = await AssistantService.generateResponse(query, language, context);
    return sendSuccess(res, response);
  }
}
