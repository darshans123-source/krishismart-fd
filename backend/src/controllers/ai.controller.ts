import { Request, Response } from 'express';
import { CropDoctorService } from '../services/ai/cropDoctor.service.js';
import { SoilAnalysisService } from '../services/ai/soilAnalysis.service.js';
import { YieldPredictionService } from '../services/ai/yieldPrediction.service.js';
import { CropRecommendationService } from '../services/ai/cropRecommendation.service.js';
import { AssistantService } from '../services/ai/assistant.service.js';
import { generateOpenAiText, validateOpenAiRequest, OpenAiError } from '../services/ai/openai.service.js';
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

  /**
   * Centralized OpenAI endpoint: POST /api/ai/generate
   * Text only. Returns a real OpenAI answer, or a clear error
   * (e.g. key not configured) — never a fabricated answer.
   */
  public static async generate(req: Request, res: Response): Promise<Response> {
    try {
      const validated = validateOpenAiRequest(req.body);
      const result = await generateOpenAiText(validated);
      return sendSuccess(res, result, 'AI response generated');
    } catch (err: any) {
      if (err instanceof OpenAiError) return sendError(res, err.message, err.status, err.code);
      return sendError(res, 'AI request failed. Please try again.', 502);
    }
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
