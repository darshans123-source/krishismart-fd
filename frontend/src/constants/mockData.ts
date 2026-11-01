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
  NotificationItem,
  AchievementBadge,
  KrishiBhavishyaForecast,
  DiseaseDetectionResult
} from '../types';

export const INITIAL_USER: UserProfile = {
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

export const INITIAL_FARMS: Farm[] = [
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

export const INITIAL_CROPS: Crop[] = [
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
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
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
    variety: 'RCH-659 (BG-II Hybrid)',
    area: 1.5,
    sowingDate: '2026-06-25',
    expectedHarvestDate: '2026-11-15',
    currentStage: 'growth',
    healthScore: 92,
    status: 'Healthy',
    irrigationSchedule: 'Drip every 4 days',
    fertilizerSchedule: 'Nitrogen split application at square formation',
    projectedYieldKg: 3200,
    expectedRevenue: 198000,
    nextTask: 'Weeding & pest trap check',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
    timeline: [
      { id: 'seed', name: 'Sowing & Germination', status: 'completed', progress: 100, estimatedDate: 'Jun 25', notes: 'Dibbling in moist soil.', tasks: ['Seed sowing', 'Pre-emergence herbicide'] },
      { id: 'growth', name: 'Vegetative & Square Formation', status: 'active', progress: 55, estimatedDate: 'Aug 10', notes: 'Square formation started.', tasks: ['Pheromone trap installation', 'Earthing up'] },
      { id: 'flowering', name: 'Flowering & Boll Development', status: 'upcoming', progress: 0, estimatedDate: 'Sep 20', notes: 'Monitor bollworm incidence.', tasks: ['Boron foliar spray'] },
      { id: 'harvest', name: 'Boll Bursting & Picking', status: 'upcoming', progress: 0, estimatedDate: 'Nov 15', notes: 'First picking when 60% bolls burst.', tasks: ['Hand picking', 'Storage'] }
    ]
  }
];

export const INITIAL_TASKS: FarmTask[] = [
  {
    id: 'task-1',
    cropId: 'crop-2',
    title: 'Foliar Spray: Potassium Silicate & Micronutrients (Tomato)',
    category: 'Fertilizer',
    priority: 'High',
    dueDate: 'Today, 5:30 PM',
    completed: false,
    xpReward: 50,
    notes: 'Apply in cool evening hours to boost flower retention and leaf cuticle strength.'
  },
  {
    id: 'task-2',
    cropId: 'crop-1',
    title: 'Inspect Paddy field drainage before tomorrow rain',
    category: 'Soil',
    priority: 'Medium',
    dueDate: 'Tomorrow, 8:00 AM',
    completed: false,
    xpReward: 30,
    notes: 'Clear canal outlet to prevent waterlogging during forecasted thunderstorms.'
  },
  {
    id: 'task-3',
    cropId: 'crop-2',
    title: 'Scan Tomato lower leaves with AI Crop Doctor',
    category: 'Pesticide',
    priority: 'High',
    dueDate: 'Today, 3:00 PM',
    completed: true,
    xpReward: 40,
    notes: 'Early Blight diagnosed at 91% confidence. Bio-spray recommended.'
  },
  {
    id: 'task-4',
    title: 'Run DroneSpray AI flight simulation for Field B (Tomato)',
    category: 'Drone',
    priority: 'Medium',
    dueDate: 'Aug 21',
    completed: false,
    xpReward: 60,
    notes: 'Verify wind tolerance (<12 km/h) before booking drone pilot.'
  },
  {
    id: 'task-5',
    title: 'Check PM-KISAN 17th Installment KYC Status',
    category: 'Market',
    priority: 'Low',
    dueDate: 'Aug 25',
    completed: false,
    xpReward: 25,
    notes: 'Aadhaar biometric authentication update verified on portal.'
  }
];

export const INITIAL_WEATHER: WeatherData = {
  temp: 29.4,
  condition: 'Partly Cloudy & Pleasant',
  conditionIcon: 'cloud-sun',
  humidity: 68,
  windSpeed: 9.8,
  rainProbability: 22,
  soilMoisture: 58,
  soilTemp: 24.2,
  uvIndex: 6.5,
  airQuality: 'Good (AQI 42)',
  sprayingAdvisory: {
    status: 'Optimal',
    reason: 'Wind speed is low (9.8 km/h) and rain probability is under 25% for the next 6 hours.',
    bestWindow: '4:30 PM – 6:45 PM'
  },
  irrigationAdvisory: {
    needed: false,
    recommendedMm: 0,
    reason: 'Soil moisture is optimal at 58%. Light rain expected in 36 hours.'
  },
  forecast: [
    { day: 'Wed', date: 'Aug 19', tempMax: 30, tempMin: 21, condition: 'Partly Cloudy', rainProb: 20, icon: 'cloud-sun' },
    { day: 'Thu', date: 'Aug 20', tempMax: 29, tempMin: 20, condition: 'Scattered Showers', rainProb: 65, icon: 'cloud-rain' },
    { day: 'Fri', date: 'Aug 21', tempMax: 28, tempMin: 20, condition: 'Thunderstorms', rainProb: 80, icon: 'cloud-lightning' },
    { day: 'Sat', date: 'Aug 22', tempMax: 30, tempMin: 21, condition: 'Clear Sky', rainProb: 15, icon: 'sun' },
    { day: 'Sun', date: 'Aug 23', tempMax: 31, tempMin: 22, condition: 'Mostly Sunny', rainProb: 10, icon: 'sun' },
    { day: 'Mon', date: 'Aug 24', tempMax: 32, tempMin: 22, condition: 'Partly Cloudy', rainProb: 25, icon: 'cloud-sun' },
    { day: 'Tue', date: 'Aug 25', tempMax: 31, tempMin: 21, condition: 'Overcast', rainProb: 40, icon: 'cloud' }
  ]
};

export const INITIAL_MANDIS: MandiItem[] = [
  {
    id: 'mandi-1',
    commodity: 'Tomato (Hybrid)',
    marketName: 'Kolar APMC Market',
    district: 'Kolar',
    state: 'Karnataka',
    currentPrice: 2250,
    prevPrice: 2100,
    priceChange: 7.1,
    minPrice: 1900,
    maxPrice: 2400,
    demandLevel: 'High',
    supplyLevel: 'Deficit',
    arrivalTons: 145,
    distanceKm: 148,
    transportCostPerQtl: 130,
    updatedAt: 'Today, 11:30 AM'
  },
  {
    id: 'mandi-2',
    commodity: 'Tomato (Hybrid)',
    marketName: 'Mysuru APMC Mandi (Bandipalya)',
    district: 'Mysuru',
    state: 'Karnataka',
    currentPrice: 2080,
    prevPrice: 2050,
    priceChange: 1.4,
    minPrice: 1800,
    maxPrice: 2180,
    demandLevel: 'Moderate',
    supplyLevel: 'Adequate',
    arrivalTons: 210,
    distanceKm: 32,
    transportCostPerQtl: 40,
    updatedAt: 'Today, 10:15 AM'
  },
  {
    id: 'mandi-3',
    commodity: 'Tomato (Hybrid)',
    marketName: 'Yeshwanthpur APMC (Bengaluru)',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    currentPrice: 2320,
    prevPrice: 2150,
    priceChange: 7.9,
    minPrice: 2000,
    maxPrice: 2450,
    demandLevel: 'High',
    supplyLevel: 'Deficit',
    arrivalTons: 380,
    distanceKm: 110,
    transportCostPerQtl: 95,
    updatedAt: 'Today, 12:00 PM'
  },
  {
    id: 'mandi-4',
    commodity: 'Paddy (Sona Masoori / BPT)',
    marketName: 'Mandya Central APMC',
    district: 'Mandya',
    state: 'Karnataka',
    currentPrice: 2480,
    prevPrice: 2420,
    priceChange: 2.5,
    minPrice: 2300,
    maxPrice: 2550,
    demandLevel: 'High',
    supplyLevel: 'Adequate',
    arrivalTons: 520,
    distanceKm: 14,
    transportCostPerQtl: 25,
    updatedAt: 'Today, 09:45 AM'
  },
  {
    id: 'mandi-5',
    commodity: 'Paddy (Sona Masoori / BPT)',
    marketName: 'Raichur Grain Market Yard',
    district: 'Raichur',
    state: 'Karnataka',
    currentPrice: 2620,
    prevPrice: 2550,
    priceChange: 2.7,
    minPrice: 2450,
    maxPrice: 2700,
    demandLevel: 'High',
    supplyLevel: 'Surplus',
    arrivalTons: 1100,
    distanceKm: 380,
    transportCostPerQtl: 260,
    updatedAt: 'Today, 11:10 AM'
  },
  {
    id: 'mandi-6',
    commodity: 'Onion (Red Nashik Quality)',
    marketName: 'Lasalgaon APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    currentPrice: 2850,
    prevPrice: 2600,
    priceChange: 9.6,
    minPrice: 2400,
    maxPrice: 3100,
    demandLevel: 'High',
    supplyLevel: 'Deficit',
    arrivalTons: 890,
    distanceKm: 860,
    transportCostPerQtl: 420,
    updatedAt: 'Today, 01:15 PM'
  },
  {
    id: 'mandi-7',
    commodity: 'Cotton (Medium Staple)',
    marketName: 'Rajkot APMC Market',
    district: 'Rajkot',
    state: 'Gujarat',
    currentPrice: 7350,
    prevPrice: 7200,
    priceChange: 2.1,
    minPrice: 6800,
    maxPrice: 7600,
    demandLevel: 'Moderate',
    supplyLevel: 'Adequate',
    arrivalTons: 640,
    distanceKm: 1240,
    transportCostPerQtl: 680,
    updatedAt: 'Today, 10:45 AM'
  },
  {
    id: 'mandi-8',
    commodity: 'Wheat (Sharbati / Lokwan)',
    marketName: 'Indore Mandi (Choithram)',
    district: 'Indore',
    state: 'Madhya Pradesh',
    currentPrice: 2980,
    prevPrice: 2920,
    priceChange: 2.0,
    minPrice: 2750,
    maxPrice: 3150,
    demandLevel: 'High',
    supplyLevel: 'Adequate',
    arrivalTons: 1450,
    distanceKm: 1100,
    transportCostPerQtl: 560,
    updatedAt: 'Today, 11:00 AM'
  }
];

export const MOCK_BHAVISHYA_FORECASTS: Record<string, KrishiBhavishyaForecast> = {
  'Tomato': {
    crop: 'Tomato (Hybrid F1)',
    currentPrice: 2250,
    timeframes: {
      today: 2250,
      days7: 2480,
      days15: 2760,
      days30: 3120,
      days60: 2150
    },
    bestSellingWindow: 'Day 25 to Day 35 (Peak Festival Demand)',
    peakPrice: 3120,
    expectedProfitIncrease: 38.6,
    confidenceScore: 92,
    marketSentiment: 'Strong Bullish',
    riskScore: 'Low',
    factors: [
      'North Indian crop arrival delayed by 2 weeks due to monsoon shifts',
      'Festival season in southern metro cities driving 35% higher consumption',
      'Cold storage reserves at historical 3-year low of 18%'
    ]
  },
  'Paddy (Rice)': {
    crop: 'Paddy (Sona Masoori)',
    currentPrice: 2480,
    timeframes: {
      today: 2480,
      days7: 2510,
      days15: 2560,
      days30: 2680,
      days60: 2840
    },
    bestSellingWindow: 'Day 50 to Day 60 (Post-harvest consolidation)',
    peakPrice: 2840,
    expectedProfitIncrease: 14.5,
    confidenceScore: 89,
    marketSentiment: 'Bullish',
    riskScore: 'Low',
    factors: [
      'Government MSP increment of ₹117/qtl for upcoming procurement cycle',
      'Non-basmati export quotas reopening across Southeast Asia',
      'Stable domestic mill demand with steady buffer stocking'
    ]
  },
  'Onion': {
    crop: 'Onion (Red Nashik)',
    currentPrice: 2850,
    timeframes: {
      today: 2850,
      days7: 3100,
      days15: 3450,
      days30: 3800,
      days60: 2600
    },
    bestSellingWindow: 'Day 20 to Day 30',
    peakPrice: 3800,
    expectedProfitIncrease: 33.3,
    confidenceScore: 87,
    marketSentiment: 'Strong Bullish',
    riskScore: 'Moderate',
    factors: [
      'Rabi stock depletion in Maharashtra storage chawls',
      'Kharif acreage estimated 12% lower in key producing belts',
      'High wholesale mandi bidding in APMCs'
    ]
  },
  'Sugarcane': {
    crop: 'Sugarcane',
    currentPrice: 350, // per quintal FRP
    timeframes: {
      today: 350,
      days7: 350,
      days15: 355,
      days30: 360,
      days60: 365
    },
    bestSellingWindow: 'Crushing season start (Day 45-60)',
    peakPrice: 365,
    expectedProfitIncrease: 4.2,
    confidenceScore: 96,
    marketSentiment: 'Neutral',
    riskScore: 'Low',
    factors: [
      'FRP revised by Central Cabinet with sugar mill incentives',
      'Ethanol blending procurement targets increased to 20%',
      'Direct mill tie-up assured'
    ]
  }
};

export const INITIAL_SCHEMES: GovernmentScheme[] = [
  {
    id: 'scheme-pmkisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    shortName: 'PM-KISAN',
    department: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    financialBenefit: '₹6,000 / year (in 3 equal installments of ₹2,000 via DBT)',
    eligibility: [
      'All landholding farmer families with cultivable landholding in their names',
      'Aadhaar seeded bank account',
      'e-KYC verified on pmkisan.gov.in'
    ],
    documentsRequired: ['Aadhaar Card', 'Land Ownership Record (RTC/Pahani/7/12)', 'Bank Passbook copy'],
    deadline: 'Open Year-Round (Next Installment: Oct 2026)',
    applicationMode: 'Online',
    status: 'Open',
    officialUrl: 'https://pmkisan.gov.in',
    appliedStatus: 'Approved',
    category: 'Direct Income'
  },
  {
    id: 'scheme-kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    shortName: 'KCC Interest Subvention',
    department: 'NABARD & Commercial/Cooperative Banks',
    financialBenefit: 'Collateral-free crop loan up to ₹3.00 Lakhs at 4% effective interest (with 3% prompt repayment subvention)',
    eligibility: [
      'Owner cultivators, tenant farmers, oral lessees, sharecroppers',
      'Valid farming land or animal husbandry/fishery unit',
      'Age between 18 and 75 years'
    ],
    documentsRequired: ['Application Form', 'Land Records / RTC', 'Identity & Address Proof', 'Crop Cultivation Declaration'],
    deadline: 'Year-Round Processing at Bank Branches',
    applicationMode: 'CSC Center',
    status: 'Open',
    officialUrl: 'https://myscheme.gov.in',
    appliedStatus: 'In Progress',
    category: 'Credit & Loan'
  },
  {
    id: 'scheme-pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    shortName: 'PM Fasal Bima',
    department: 'Dept of Agriculture, Cooperation & Farmers Welfare',
    financialBenefit: 'Comprehensive crop loss cover with premium capped at only 1.5% for Rabi, 2% for Kharif, and 5% for Horticultural crops',
    eligibility: [
      'All farmers cultivating notified crops in notified areas',
      'Both loanee and non-loanee farmers eligible'
    ],
    documentsRequired: ['Land Record Certificate', 'Sowing Certificate / Declaration', 'Aadhaar Card', 'Bank Passbook'],
    deadline: 'Aug 31, 2026 (Kharif Season Enrollment Deadline)',
    applicationMode: 'Online',
    status: 'Expiring Soon',
    officialUrl: 'https://pmfby.gov.in',
    appliedStatus: 'Approved',
    category: 'Insurance'
  },
  {
    id: 'scheme-pmksy',
    name: 'PM Krishi Sinchayee Yojana (Per Drop More Crop)',
    shortName: 'PMKSY Drip Subsidy',
    department: 'Ministry of Jal Shakti & State Agriculture Depts',
    financialBenefit: 'Up to 75% to 90% capital subsidy for installing Drip & Sprinkler Micro-Irrigation kits',
    eligibility: [
      'Farmers with assured water source (borewell/well/canal)',
      'Minimum 0.5 acre cultivable parcel'
    ],
    documentsRequired: ['RTC / Land Title', 'Water Source Certificate', 'Electricity Bill / Borewell report', 'Quotation from registered micro-irrigation vendor'],
    deadline: 'Open for FY 2026-27 tranche',
    applicationMode: 'Online',
    status: 'Open',
    officialUrl: 'https://pmksy.gov.in',
    appliedStatus: 'Not Applied',
    category: 'Equipment & Solar'
  },
  {
    id: 'scheme-smam',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    shortName: 'Tractor & Drone Subsidy',
    department: 'Dept of Agricultural Mechanization',
    financialBenefit: '40% to 50% subsidy on Tractors, Rotavators, Power Tillers, and 75% subsidy on Agricultural Spraying Drones for FPOs/SHGs',
    eligibility: [
      'Small & Marginal farmers, Women farmers, SC/ST, and Farmer Producer Organizations (FPOs)'
    ],
    documentsRequired: ['Aadhaar', 'Land Record', 'Bank Details', 'Category Certificate (if applicable)'],
    deadline: 'Sep 15, 2026',
    applicationMode: 'CSC Center',
    status: 'Open',
    officialUrl: 'https://agrimachinery.nic.in',
    appliedStatus: 'Not Applied',
    category: 'Equipment & Solar'
  },
  {
    id: 'scheme-pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    shortName: 'PKVY Organic Farming',
    department: 'National Mission on Sustainable Agriculture',
    financialBenefit: '₹50,000 / hectare over 3 years for organic conversion, PGS certification, and bio-input production units',
    eligibility: [
      'Farmers willing to adopt certified organic clusters (minimum 20 hectares group or individual registration)'
    ],
    documentsRequired: ['Cluster Member Agreement', 'Land RTC', 'Soil Baseline Test Report'],
    deadline: 'Year-round Cluster Onboarding',
    applicationMode: 'Online',
    status: 'Open',
    officialUrl: 'https://pgsindia-ncof.gov.in',
    appliedStatus: 'Not Applied',
    category: 'Organic & Seeds'
  }
];

export const INITIAL_FINANCIAL_SUMMARY: FinancialSummary = {
  totalIncome: 486250,
  totalExpenses: 142800,
  netProfit: 343450,
  farmInvestment: 85000,
  profitMargin: 70.6,
  kisanCreditScore: 785,
  loanEligibilityAmount: 450000
};

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-1',
    type: 'Income',
    category: 'Crop Sales',
    amount: 142000,
    date: '2026-08-14',
    description: 'Harvest Batch 1 Tomato sold at Kolar APMC (65 quintals @ ₹2,184/qtl)',
    cropAssociated: 'Tomato'
  },
  {
    id: 'tx-2',
    type: 'Income',
    category: 'Subsidies',
    amount: 2000,
    date: '2026-08-01',
    description: 'PM-KISAN Direct Benefit Transfer installment received',
  },
  {
    id: 'tx-3',
    type: 'Expense',
    category: 'Fertilizer',
    amount: 8400,
    date: '2026-08-10',
    description: 'Water soluble 19:19:19 + Micronutrient chelate pack (3 bags)',
    cropAssociated: 'Tomato'
  },
  {
    id: 'tx-4',
    type: 'Expense',
    category: 'Labor',
    amount: 12500,
    date: '2026-08-08',
    description: 'Weeding and bamboo staking labor wages (5 workers x 5 days)',
    cropAssociated: 'Tomato'
  },
  {
    id: 'tx-5',
    type: 'Expense',
    category: 'Seeds',
    amount: 6800,
    date: '2026-06-05',
    description: 'BPT-5204 Foundation Paddy certified seeds (25 kg)',
    cropAssociated: 'Paddy (Rice)'
  },
  {
    id: 'tx-6',
    type: 'Income',
    category: 'Crop Sales',
    amount: 342250,
    date: '2026-05-20',
    description: 'Previous Rabi Wheat and Pulses harvest realization',
  }
];

export const INITIAL_IOT_DEVICES: IoTDevice[] = [
  {
    id: 'iot-soil-01',
    name: 'Field A Soil Telemetry Node',
    type: 'Soil Probe',
    fieldLocation: 'Field 1 (Paddy Parcel)',
    batteryLevel: 94,
    signalStrength: 88,
    status: 'Normal',
    lastPing: '2 mins ago',
    metrics: {
      soilMoisture: 58,
      soilTemp: 24.2,
      ambientTemp: 29.4,
      humidity: 68
    }
  },
  {
    id: 'iot-soil-02',
    name: 'Field B Smart Drip Probe',
    type: 'Soil Probe',
    fieldLocation: 'Field 2 (Tomato Polyhouse / Mulch)',
    batteryLevel: 82,
    signalStrength: 92,
    status: 'Normal',
    lastPing: 'Just now',
    metrics: {
      soilMoisture: 42,
      soilTemp: 25.8,
      ambientTemp: 30.1,
      humidity: 64
    }
  },
  {
    id: 'iot-tank-01',
    name: 'Overhead Borewell Sump Sensor',
    type: 'Water Level Sensor',
    fieldLocation: 'Pump House & Sump',
    batteryLevel: 98,
    signalStrength: 96,
    status: 'Normal',
    lastPing: '1 min ago',
    metrics: {
      waterLevel: 84
    }
  },
  {
    id: 'iot-weather-01',
    name: 'Micro-Climate Farm Station',
    type: 'Weather Node',
    fieldLocation: 'Central Farm Perimeter',
    batteryLevel: 76,
    signalStrength: 85,
    status: 'Normal',
    lastPing: '4 mins ago',
    metrics: {
      ambientTemp: 29.4,
      humidity: 68,
      sunlightLux: 48500
    }
  }
];

export const INITIAL_SMART_PUMP: SmartPump = {
  id: 'pump-01',
  name: 'Kirloskar 7.5 HP Submersible Smart Starter',
  field: 'Field 1 & Field 2 Dual Zone',
  hp: 7.5,
  status: 'OFF',
  mode: 'AUTO',
  currentFlowLpm: 0,
  dailyWaterLitres: 4800,
  soilMoistureThreshold: 40,
  nextSchedule: 'Today, 6:00 PM (Tomato Drip Zone 2)',
  schedules: [
    { id: 'sch-1', startTime: '06:00 AM', durationMins: 45, days: ['Mon', 'Wed', 'Fri', 'Sun'], enabled: true },
    { id: 'sch-2', startTime: '06:00 PM', durationMins: 30, days: ['Tue', 'Thu', 'Sat'], enabled: true }
  ]
};

export const INITIAL_DRONE_PLANS: DronePlan[] = [
  {
    id: 'drone-plan-01',
    fieldName: 'Field 2 (Tomato 2.0 Acres)',
    cropName: 'Tomato',
    areaAcres: 2.0,
    sprayType: 'Bio-Fungicide',
    chemicalName: 'Bacillus subtilis + Trichoderma Harzianum Bio-formulation',
    solutionVolumeLitres: 40,
    altitudeMeters: 2.2,
    estimatedFlightTimeMinutes: 14,
    batteryPacksNeeded: 1,
    windSpeedAcceptable: true,
    status: 'Scheduled',
    coverageProgress: 0
  },
  {
    id: 'drone-plan-02',
    fieldName: 'Field 1 (Paddy 2.5 Acres)',
    cropName: 'Paddy',
    areaAcres: 2.5,
    sprayType: 'Nano Urea',
    chemicalName: 'IFFCO Nano Urea Liquid (500 ml/acre)',
    solutionVolumeLitres: 50,
    altitudeMeters: 2.5,
    estimatedFlightTimeMinutes: 18,
    batteryPacksNeeded: 2,
    windSpeedAcceptable: true,
    status: 'Completed',
    coverageProgress: 100
  }
];

export const INITIAL_STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod-1',
    name: 'BPT-5204 Samba Mahsuri Certified Seeds (25kg)',
    category: 'Seeds',
    price: 1350,
    originalPrice: 1600,
    rating: 4.8,
    reviewCount: 240,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    brand: 'National Seeds Corporation (NSC)',
    inStock: true,
    badge: 'Govt Certified',
    description: 'High yielding premium fine grain paddy seed with resistance to bacterial leaf blight. 145-150 days maturity.',
    features: ['High milling recovery (68%)', 'Excellent cooking aroma', 'Drought tolerant tillering']
  },
  {
    id: 'prod-2',
    name: 'Arka Rakshak F1 Hybrid Tomato Seeds (10g)',
    category: 'Seeds',
    price: 850,
    originalPrice: 1050,
    rating: 4.9,
    reviewCount: 380,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
    brand: 'IIHR ICAR Bengaluru',
    inStock: true,
    badge: 'Triple Disease Resistant',
    description: 'ICAR patented triple disease resistant hybrid (ToLCV, BW, EB). Deep red firm fruits, yield up to 38-40 tons/acre.',
    features: ['Resistant to Leaf Curl Virus', 'Firm fruits with 20 days shelf life', 'High yield potential']
  },
  {
    id: 'prod-3',
    name: 'IFFCO Nano Urea Liquid Fertilizer (500ml x 2)',
    category: 'Fertilizers',
    price: 450,
    originalPrice: 520,
    rating: 4.7,
    reviewCount: 512,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&auto=format&fit=crop&q=80',
    brand: 'IFFCO GreenTech',
    inStock: true,
    badge: '80% Nitrogen Efficiency',
    description: 'Revolutionary nanotechnology based foliar nitrogen fertilizer. One 500ml bottle replaces an entire 45kg bag of conventional urea.',
    features: ['No groundwater contamination', 'Enhances chlorophyll synthesis', 'Easy foliar spray application']
  },
  {
    id: 'prod-4',
    name: 'Bio-Trichoderma & Pseudomonas Bio-Shield (1kg)',
    category: 'Bio Products',
    price: 320,
    originalPrice: 420,
    rating: 4.9,
    reviewCount: 195,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
    brand: 'KrishiBio Naturals',
    inStock: true,
    badge: '100% Organic',
    description: 'Potent biological fungicide combo for root rot, damping off, wilt, and blight control. Safe for earthworms and soil microbiome.',
    features: ['Colonizes rhizosphere quickly', 'Secretes antibiotic enzymes', 'OMRI organic listed']
  },
  {
    id: 'prod-5',
    name: 'Smart Drip Automation Kit (1 Acre Complete)',
    category: 'Irrigation',
    price: 14800,
    originalPrice: 18500,
    rating: 4.8,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&auto=format&fit=crop&q=80',
    brand: 'Jain Irrigation Systems',
    inStock: true,
    badge: 'Subsidy Eligible',
    description: 'Complete 16mm inline pressure compensating drip irrigation system with disc filters, venturi injector, and fittings.',
    features: ['Saves 60% water', 'Uniform water & nutrient delivery', 'Anti-clogging emitter maze']
  },
  {
    id: 'prod-6',
    name: 'SmartFarm LoRaWAN Multi-Depth Soil Moisture Probe',
    category: 'Sensors',
    price: 6499,
    originalPrice: 7999,
    rating: 4.9,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    brand: 'KrishiSmart IoT Labs',
    inStock: true,
    badge: 'Plug & Play IoT',
    description: 'Precision FDR dielectric soil probe measuring volumetric water content (VWC), soil temperature, and EC at 15cm and 30cm depths.',
    features: ['5-year solar battery life', '10km LoRaWAN wireless range', 'Direct KrishiSmart App sync']
  },
  {
    id: 'prod-7',
    name: 'KrishiSmart Hexacopter Drone Spraying Service (Per Acre)',
    category: 'Drone Services',
    price: 499,
    originalPrice: 750,
    rating: 5.0,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&auto=format&fit=crop&q=80',
    brand: 'KrishiFly Aero Tech',
    inStock: true,
    badge: 'DGCA Certified Pilots',
    description: 'Precision agricultural drone spray service with micronized droplet atomization. Sprays 1 acre in just 7 minutes with 95% canopy penetration.',
    features: ['Trained licensed pilot on site', 'Zero crop trampling damage', 'High uniformity spray index']
  },
  {
    id: 'prod-8',
    name: 'Battery Operated 16L Backpack Knapsack Sprayer',
    category: 'Tools',
    price: 2899,
    originalPrice: 3499,
    rating: 4.6,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=400&auto=format&fit=crop&q=80',
    brand: 'Neptune Agritech',
    inStock: true,
    badge: '12V 12Ah Heavy Battery',
    description: 'Dual pump high pressure battery sprayer with stainless steel extendable lance and 4 adjustable spray nozzles.',
    features: ['Sprays up to 35 tanks on 1 charge', 'Regulated pressure dial', 'Ergonomic back cushion']
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Rain Forecast Alert: 65mm expected over next 48 hours',
    message: 'Postpone nitrogen fertilizer application and clear field drainage channels.',
    timestamp: '25 mins ago',
    priority: 'Critical',
    category: 'Weather',
    read: false,
    actionRoute: 'weather'
  },
  {
    id: 'notif-2',
    title: 'Mandi Price Surge: Tomato up +7.9% in Bengaluru APMC',
    message: 'Wholesale prices crossed ₹2,320/qtl due to low arrivals. Recommended selling window is active.',
    timestamp: '2 hours ago',
    priority: 'Important',
    category: 'Market',
    read: false,
    actionRoute: 'bhavishya'
  },
  {
    id: 'notif-3',
    title: 'PMFBY Kharif Insurance Deadline Approaching',
    message: 'Enrollment for Paddy crop insurance closes on Aug 31. Complete application online.',
    timestamp: '5 hours ago',
    priority: 'Important',
    category: 'Govt Schemes',
    read: false,
    actionRoute: 'schemes'
  },
  {
    id: 'notif-4',
    title: 'Smart Irrigation Auto-Cycle Completed',
    message: 'Field 2 Tomato Drip delivered 4,800 Litres as scheduled. Soil moisture restored to 58%.',
    timestamp: '6 hours ago',
    priority: 'Normal',
    category: 'Pump',
    read: true,
    actionRoute: 'pump'
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-1',
    name: 'Smart Starter',
    description: 'Completed farmer onboarding and registered first farm parcel.',
    icon: '🌱',
    unlocked: true,
    unlockedAt: 'Jun 15, 2025',
    progress: 1,
    maxProgress: 1,
    xpValue: 100
  },
  {
    id: 'ach-2',
    name: 'Water Saver',
    description: 'Saved over 50,000 Litres of irrigation water via Smart Irrigation schedules.',
    icon: '💧',
    unlocked: true,
    unlockedAt: 'Jul 28, 2025',
    progress: 54000,
    maxProgress: 50000,
    xpValue: 350
  },
  {
    id: 'ach-3',
    name: 'Crop Guardian',
    description: 'Conducted 10+ AI crop doctor scans and resolved pest/disease threats early.',
    icon: '🛡️',
    unlocked: true,
    unlockedAt: 'Aug 04, 2026',
    progress: 12,
    maxProgress: 10,
    xpValue: 500
  },
  {
    id: 'ach-4',
    name: 'Market Master',
    description: 'Sold harvest at top 10% peak market price predicted by KrishiBhavishya AI.',
    icon: '📈',
    unlocked: true,
    unlockedAt: 'Aug 14, 2026',
    progress: 3,
    maxProgress: 3,
    xpValue: 600
  },
  {
    id: 'ach-5',
    name: 'Drone Commander',
    description: 'Successfully executed 5 automated drone precision spray missions.',
    icon: '🚁',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    xpValue: 750
  },
  {
    id: 'ach-6',
    name: 'Precision Pioneer',
    description: 'Connected 4 or more live IoT telemetry sensors across multiple fields.',
    icon: '📡',
    unlocked: true,
    unlockedAt: 'Aug 10, 2026',
    progress: 4,
    maxProgress: 4,
    xpValue: 800
  }
];

export interface SampleDiagnosticItem {
  id: string;
  cropName: string;
  sampleImage: string;
  title: string;
  result: DiseaseDetectionResult;
}

export const SAMPLE_DIAGNOSTICS: SampleDiagnosticItem[] = [
  {
    id: 'diag-tomato-blight',
    cropName: 'Tomato',
    sampleImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    title: 'Tomato Early Blight (Alternaria solani)',
    result: {
      diseaseName: 'Early Blight (Alternaria solani)',
      scientificName: 'Alternaria solani Sorauer',
      cropType: 'Tomato (Solanum lycopersicum)',
      confidence: 94.8,
      severity: 'Moderate',
      pathology: 'Concentric dark target-board rings on older foliage surrounded by chlorotic yellow halos. Caused by Alternaria spores germinating under warm humid conditions (24-29°C) with persistent leaf wetness.',
      organicTreatment: [
        'Foliar spray of 1% Bordeaux mixture or Copper Hydroxide (2.5g/L)',
        'Bio-agent Trichoderma viride / Pseudomonas fluorescens @ 5g/L water',
        'Prune infected bottom 12 inches of foliage and destroy off-field'
      ],
      chemicalTreatment: [
        'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/litre water',
        'Chlorothalonil 75% WP @ 2 g/litre water (spray during early onset)'
      ],
      preventiveMeasures: [
        'Use plastic mulch to prevent soil splashing onto bottom leaves',
        'Adopt drip irrigation instead of overhead sprinklers to keep foliage dry',
        '3-year crop rotation with non-solanaceous crops (e.g. Maize, Legumes)'
      ],
      recommendedProducts: ['Bio-Trichoderma & Pseudomonas Bio-Shield', 'Copper Oxychloride 50 WP']
    }
  },
  {
    id: 'diag-paddy-blast',
    cropName: 'Paddy (Rice)',
    sampleImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    title: 'Paddy Leaf Blast (Magnaporthe oryzae)',
    result: {
      diseaseName: 'Rice Leaf Blast',
      scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
      cropType: 'Paddy / Rice (Oryza sativa)',
      confidence: 96.2,
      severity: 'Mild',
      pathology: 'Spindle-shaped or eye-shaped lesions with grayish-white centers and brownish margins. Favored by excessive nitrogen fertilizer application, cloudy days, and nighttime dew.',
      organicTreatment: [
        'Foliar spray of fermented cow urine + Neem kernel extract (5%)',
        'Spray Kasugamycin 3% SL @ 2 ml/L or Pseudomonas fluorescens culture'
      ],
      chemicalTreatment: [
        'Tricyclazole 75% WP @ 0.6 g/litre water',
        'Isoprothiolane 40% EC @ 1.5 ml/litre water'
      ],
      preventiveMeasures: [
        'Avoid excess split doses of Urea; maintain balanced Potassium nutrition',
        'Seed treatment with Tricyclazole before nursery raising',
        'Maintain clean bunds free of weed grass hosts'
      ],
      recommendedProducts: ['IFFCO Nano Urea Liquid', 'Bio-Trichoderma Bio-Shield']
    }
  },
  {
    id: 'diag-healthy',
    cropName: 'Sugarcane / Maize',
    sampleImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=80',
    title: 'Healthy Crop Foliage (Optimal Vigor)',
    result: {
      diseaseName: 'No Pathogen Detected - Excellent Plant Vigor',
      scientificName: 'Chlorophyll Rich Vegetative Tissue',
      cropType: 'Sugarcane / Green Field',
      confidence: 98.4,
      severity: 'Mild',
      pathology: 'Uniform vibrant green canopy, firm leaf cuticles, and healthy stomatal respiration with zero necrotic lesions.',
      organicTreatment: [
        'Continue regular organic compost or Jeevamrutha drenches every 15 days'
      ],
      chemicalTreatment: [
        'No chemical fungicide or pesticide required. Protect natural beneficial predatory insects.'
      ],
      preventiveMeasures: [
        'Maintain current optimal drip irrigation schedule',
        'Monitor weekly with drone multispectral health indexing'
      ],
      recommendedProducts: ['Bio-Trichoderma Bio-Shield', 'Smart Drip Automation Kit']
    }
  }
];
