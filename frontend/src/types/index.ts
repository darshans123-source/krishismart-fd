export type Language = 'en' | 'kn' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  state: string;
  district: string;
  village: string;
  landSize: number; // in acres
  farmingType: 'Organic' | 'Conventional' | 'Precision Tech' | 'Natural';
  preferredLanguage: Language;
  experienceYears: number;
  isPremium: boolean;
  tier: 'Free' | 'Pro' | 'Enterprise';
  level: number;
  xp: number;
  streakDays: number;
  joinedDate: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  totalArea: number; // acres
  soilType: string;
  waterSource: 'Borewell' | 'Canal' | 'Drip/Sprinkler' | 'Rainfed';
  fieldsCount: number;
  /** Farm photo URL or a data URL uploaded by the farmer. Never a shared generic sunset image. */
  imageUrl?: string;
}

export interface SchemeApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  reference: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  farmerName: string;
  phone: string;
  village: string;
  district: string;
  landAcres: number;
  documents: string[];
  submittedAt: string;
  /** Saved in KrishiSmart only. A government submission is NOT claimed unless the official portal confirms it. */
  governmentSubmitted: false;
}

export interface CropTimelineStage {
  id: 'seed' | 'germination' | 'growth' | 'flowering' | 'harvest';
  name: string;
  status: 'completed' | 'active' | 'upcoming';
  progress: number; // 0 - 100
  estimatedDate: string;
  notes: string;
  tasks: string[];
}

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  area: number; // acres
  sowingDate: string;
  expectedHarvestDate: string;
  currentStage: 'seed' | 'germination' | 'growth' | 'flowering' | 'harvest';
  healthScore: number; // 0-100
  status: 'Healthy' | 'Needs Attention' | 'Critical' | 'Harvest Ready';
  irrigationSchedule: string;
  fertilizerSchedule: string;
  projectedYieldKg: number;
  expectedRevenue: number;
  timeline: CropTimelineStage[];
  imageUrl?: string;
  nextTask?: string;
}

export interface FarmTask {
  id: string;
  cropId?: string;
  title: string;
  category: 'Irrigation' | 'Fertilizer' | 'Pesticide' | 'Harvest' | 'Soil' | 'Drone' | 'Market';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  completed: boolean;
  notes?: string;
  xpReward: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  conditionIcon: string;
  humidity: number;
  windSpeed: number; // km/h
  rainProbability: number; // %
  soilMoisture: number; // %
  soilTemp: number; // °C
  uvIndex: number;
  airQuality: string;
  sprayingAdvisory: {
    status: 'Optimal' | 'Caution' | 'Unfavorable';
    reason: string;
    bestWindow: string;
  };
  irrigationAdvisory: {
    needed: boolean;
    recommendedMm: number;
    reason: string;
  };
  forecast: DailyForecast[];
}

export interface DailyForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainProb: number;
  icon: string;
}

export interface MandiItem {
  id: string;
  commodity: string;
  marketName: string;
  district: string;
  state: string;
  currentPrice: number; // Rs per quintal
  prevPrice: number;
  priceChange: number; // %
  minPrice: number;
  maxPrice: number;
  demandLevel: 'High' | 'Moderate' | 'Low';
  supplyLevel: 'Surplus' | 'Adequate' | 'Deficit';
  arrivalTons: number;
  distanceKm: number;
  transportCostPerQtl: number;
  updatedAt: string;
}

export interface KrishiBhavishyaForecast {
  crop: string;
  currentPrice: number;
  timeframes: {
    today: number;
    days7: number;
    days15: number;
    days30: number;
    days60: number;
  };
  bestSellingWindow: string;
  peakPrice: number;
  expectedProfitIncrease: number; // %
  confidenceScore: number; // %
  marketSentiment: 'Strong Bullish' | 'Bullish' | 'Neutral' | 'Bearish';
  riskScore: 'Low' | 'Moderate' | 'High';
  factors: string[];
}

export interface GovernmentScheme {
  id: string;
  name: string;
  shortName: string;
  department: string;
  financialBenefit: string;
  eligibility: string[];
  documentsRequired: string[];
  deadline: string;
  applicationMode: 'Online' | 'Offline' | 'CSC Center';
  status: 'Open' | 'Expiring Soon' | 'Year-round';
  officialUrl: string;
  appliedStatus?: 'Not Applied' | 'In Progress' | 'Approved' | 'Disbursed';
  category: 'Direct Income' | 'Credit & Loan' | 'Insurance' | 'Equipment & Solar' | 'Organic & Seeds';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  farmInvestment: number;
  profitMargin: number;
  kisanCreditScore: number; // 300 - 900
  loanEligibilityAmount: number;
}

export interface FinancialTransaction {
  id: string;
  type: 'Income' | 'Expense';
  category: 'Crop Sales' | 'Seeds' | 'Fertilizer' | 'Pesticide' | 'Labor' | 'Machinery/Fuel' | 'Equipment' | 'Subsidies' | 'Livestock' | 'Other';
  amount: number;
  date: string;
  description: string;
  cropAssociated?: string;
  receiptUrl?: string;
}

export interface DiseaseDetectionResult {
  diseaseName: string;
  scientificName: string;
  cropType: string;
  confidence: number; // %
  severity: 'Mild' | 'Moderate' | 'Severe';
  pathology: string;
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventiveMeasures: string[];
  recommendedProducts: string[];
}

export interface SoilAnalysisReport {
  ph: number;
  nitrogen: { value: number; unit: string; status: 'Low' | 'Optimal' | 'High' };
  phosphorus: { value: number; unit: string; status: 'Low' | 'Optimal' | 'High' };
  potassium: { value: number; unit: string; status: 'Low' | 'Optimal' | 'High' };
  organicCarbon: number; // %
  salinityEc: number; // dS/m
  healthIndex: number; // 0-100
  recommendedCrops: string[];
  fertilizerPlan: string[];
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'Soil Probe' | 'Weather Node' | 'Water Level Sensor' | 'Leaf Wetness' | 'Pump Controller';
  fieldLocation: string;
  batteryLevel: number; // %
  signalStrength: number; // %
  status: 'Normal' | 'Warning' | 'Critical' | 'Offline';
  lastPing: string;
  metrics: {
    soilMoisture?: number;
    soilTemp?: number;
    ambientTemp?: number;
    humidity?: number;
    waterLevel?: number;
    sunlightLux?: number;
  };
}

export interface SmartPump {
  id: string;
  name: string;
  field: string;
  hp: number;
  status: 'ON' | 'OFF';
  mode: 'MANUAL' | 'AUTO' | 'SCHEDULE';
  currentFlowLpm: number;
  dailyWaterLitres: number;
  soilMoistureThreshold: number;
  nextSchedule?: string;
  schedules: Array<{
    id: string;
    startTime: string;
    durationMins: number;
    days: string[];
    enabled: boolean;
  }>;
}

export interface DronePlan {
  id: string;
  fieldName: string;
  cropName: string;
  areaAcres: number;
  sprayType: 'Bio-Fungicide' | 'Micronutrient Mix' | 'Nano Urea' | 'Insecticide';
  chemicalName: string;
  solutionVolumeLitres: number;
  altitudeMeters: number;
  estimatedFlightTimeMinutes: number;
  batteryPacksNeeded: number;
  windSpeedAcceptable: boolean;
  status: 'Draft' | 'Scheduled' | 'In Flight' | 'Completed';
  coverageProgress: number; // 0-100
}

export interface StoreProduct {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Bio Products' | 'Tools' | 'Irrigation' | 'Sensors' | 'Farm Equipment' | 'Drone Services';
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  brand: string;
  inStock: boolean;
  badge?: string;
  description: string;
  features: string[];
  dosageOrUsage?: string;
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export interface StoreOrder {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  status: 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  trackingSteps: Array<{
    title: string;
    date: string;
    completed: boolean;
  }>;
  paymentMethod: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  priority: 'Critical' | 'Important' | 'Normal';
  category: 'Weather' | 'Disease' | 'Market' | 'Irrigation' | 'Govt Schemes' | 'Finance' | 'IoT' | 'Pump';
  read: boolean;
  actionRoute?: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpValue: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: Language;
  suggestions?: string[];
}
