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
  landSize: number;
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
  totalArea: number;
  soilType: string;
  waterSource: 'Borewell' | 'Canal' | 'Drip/Sprinkler' | 'Rainfed';
  fieldsCount: number;
}

export interface CropTimelineStage {
  id: 'seed' | 'germination' | 'growth' | 'flowering' | 'harvest';
  name: string;
  status: 'completed' | 'active' | 'upcoming';
  progress: number;
  estimatedDate: string;
  notes: string;
  tasks: string[];
}

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  area: number;
  sowingDate: string;
  expectedHarvestDate: string;
  currentStage: 'seed' | 'germination' | 'growth' | 'flowering' | 'harvest';
  healthScore: number;
  status: 'Healthy' | 'Needs Attention' | 'Critical' | 'Harvest Ready';
  irrigationSchedule: string;
  fertilizerSchedule: string;
  projectedYieldKg: number;
  expectedRevenue: number;
  imageUrl?: string;
  nextTask?: string;
  timeline: CropTimelineStage[];
  localName?: string;
  hindiName?: string;
  category?: string;
  description?: string;
  growingSeason?: string;
  soilType?: string;
  waterRequirement?: string;
  temperatureRange?: string;
  acreage?: number;
  diseases?: string[];
  fertilizers?: string[];
  recommendations?: string[];
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
  windSpeed: number;
  rainProbability: number;
  soilMoisture: number;
  soilTemp: number;
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
  forecast: Array<{
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProb: number;
    icon: string;
  }>;
}

export interface MandiItem {
  id: string;
  commodity: string;
  marketName: string;
  district: string;
  state: string;
  currentPrice: number;
  prevPrice: number;
  priceChange: number;
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
  expectedProfitIncrease: number;
  confidenceScore: number;
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
  kisanCreditScore: number;
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
  confidence: number;
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
  organicCarbon: number;
  salinityEc: number;
  healthIndex: number;
  recommendedCrops: string[];
  fertilizerPlan: string[];
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'Soil Probe' | 'Weather Node' | 'Water Level Sensor' | 'Leaf Wetness' | 'Pump Controller';
  fieldLocation: string;
  batteryLevel: number;
  signalStrength: number;
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
  coverageProgress: number;
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

// ==================================================
// ADMIN & CMS TYPES
// ==================================================

export type AdminRole = 'Super Admin' | 'Admin' | 'Editor';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface CMSComponent {
  id: string;
  type: string; // 'text' | 'heading' | 'paragraph' | 'image' | 'icon' | 'button' | 'card' | 'statistic' | 'banner' | 'grid' | 'list' | 'badge' | 'alert' | 'chart' | 'weather' | 'crop' | 'product' | 'scheme' | 'custom'
  title?: string;
  content?: any;
  image?: string;
  icon?: string;
  link?: string;
  settings?: Record<string, any>;
  visible: boolean;
  order: number;
}

export interface CMSSection {
  id: string;
  title: string;
  type: string;
  visible: boolean;
  order: number;
  components: CMSComponent[];
  settings?: Record<string, any>;
}

export interface CMSPage {
  id: string;
  slug: string;
  name: string;
  route: string;
  status: 'Published' | 'Draft';
  lastUpdated: string;
  updatedBy: string;
  sections: CMSSection[];
}

export interface DashboardHeroConfig {
  greeting: string;
  mainHeading: string;
  subtitle: string;
  locationText: string;
  farmHealthScore: number;
  heroBg: string;
  heroImage?: string;
  buttonText: string;
  buttonLink: string;
  visible: boolean;
}

export interface DashboardStatusCard {
  id: string;
  title: string;
  value?: string;
  description?: string;
  icon?: string;
  image?: string;
  color?: string;
  route?: string;
  visible: boolean;
  order: number;
}

export interface DashboardQuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
  bg?: string;
  description?: string;
  visible: boolean;
  order: number;
}

export interface DashboardConfig {
  hero: DashboardHeroConfig;
  statusCards: DashboardStatusCard[];
  quickActions: DashboardQuickAction[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'icon' | 'document';
  size: number;
  uploadedAt: string;
  tags?: string[];
}

export interface ActivityLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  page: string;
  record?: string;
  timestamp: string;
}

export interface SiteSettings {
  siteName: string;
  logo: string;
  favicon?: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
  };
  defaultLanguage: Language;
  theme: {
    primaryColor: string;
    accentColor: string;
  };
  footerText: string;
  supportInfo: string;
}

export interface WeatherAdvisoryItem {
  id: string;
  title: string;
  message: string;
  type: 'Alert' | 'Advisory' | 'Seasonal' | 'Warning';
  priority: 'High' | 'Medium' | 'Low';
  validUntil: string;
  visible: boolean;
}

export interface AIAdvisorArticleItem {
  id: string;
  title: string;
  category: string;
  crop: string;
  content: string;
  image?: string;
  language: Language;
  status: 'Published' | 'Draft';
  tags: string[];
  createdAt: string;
}

export interface DroneServiceItem {
  id: string;
  name: string;
  description: string;
  pricePerAcre: number;
  status: 'Active' | 'Inactive';
  coverageType: string;
  image: string;
  availableLocations: string[];
}

