import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  CartItem,
  StoreOrder,
  NotificationItem,
  AchievementBadge
} from '../types';
import {
  INITIAL_USER,
  INITIAL_FARMS,
  INITIAL_CROPS,
  INITIAL_TASKS,
  INITIAL_WEATHER,
  INITIAL_SCHEMES,
  INITIAL_FINANCIAL_SUMMARY,
  INITIAL_TRANSACTIONS,
  INITIAL_IOT_DEVICES,
  INITIAL_SMART_PUMP,
  INITIAL_DRONE_PLANS,
  INITIAL_STORE_PRODUCTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACHIEVEMENTS
} from '../constants/mockData';
import { useToast } from './ToastContext';
import {
  LocationState,
  getStoredLocation,
  setStoredLocation,
  getCurrentGPSCoordinates,
  reverseGeocode,
  AGRI_DISTRICT_CENTROIDS
} from '../services/locationService';
import { fetchLiveWeather } from '../services/weatherService';
import { getNearbyMandisForLocation } from '../services/mandiService';
import { api } from '../services/api';

export interface AIFarmHealthScore {
  overall: number;
  cropHealth: number;
  soilCondition: number;
  weatherRisk: number;
  irrigation: number;
  marketOpportunity: number;
  factors: {
    name: string;
    score: number;
    weight: string;
    impact: 'positive' | 'warning' | 'neutral';
    description: string;
  }[];
}

export interface AIBriefing {
  title: string;
  greeting: string;
  summary: string;
  bullets: string[];
  generatedAt: string;
}

interface FarmDataContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;

  farms: Farm[];
  addFarm: (farm: Omit<Farm, 'id'>) => void;

  crops: Crop[];
  addCrop: (crop: Omit<Crop, 'id' | 'timeline'>) => void;
  advanceCropStage: (cropId: string, stageId: Crop['currentStage']) => void;
  deleteCrop: (cropId: string) => void;

  tasks: FarmTask[];
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<FarmTask, 'id' | 'completed'>) => void;

  // Real-Time Location & Geolocation
  locationState: LocationState;
  requestGPSLocation: () => Promise<void>;
  setManualLocation: (district: string, state: string, village?: string) => Promise<void>;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Dynamic Weather & Market Telemetry
  weather: WeatherData;
  isWeatherLive: boolean;
  weatherLastUpdated: string;
  refreshWeather: () => Promise<void>;
  mandis: MandiItem[];
  nearbyMandis: MandiItem[];

  // AI-Powered Farm Intelligence & Health
  aiFarmHealth: AIFarmHealthScore;
  aiBriefing: AIBriefing;
  aiMonitoringStatus: {
    isLive: boolean;
    lastChecked: string;
    activeSensors: number;
    dataConfidence: string;
  };

  // AI Command Center
  activePromptForAI: string | null;
  openAIChatWithPrompt: (prompt: string) => void;
  clearAIChatPrompt: () => void;
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;

  schemes: GovernmentScheme[];
  applyForScheme: (schemeId: string) => void;

  financialSummary: FinancialSummary;
  transactions: FinancialTransaction[];
  addTransaction: (tx: Omit<FinancialTransaction, 'id'>) => void;

  iotDevices: IoTDevice[];
  addIoTDevice: (device: Omit<IoTDevice, 'id' | 'lastPing' | 'status'>) => void;

  smartPump: SmartPump;
  togglePumpStatus: (status?: 'ON' | 'OFF') => void;
  setPumpMode: (mode: 'MANUAL' | 'AUTO' | 'SCHEDULE') => void;
  updatePumpThreshold: (threshold: number) => void;

  dronePlans: DronePlan[];
  addDronePlan: (plan: Omit<DronePlan, 'id' | 'coverageProgress' | 'status'>) => void;
  executeDroneMission: (planId: string) => void;

  storeProducts: StoreProduct[];
  cart: CartItem[];
  addToCart: (product: StoreProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: StoreOrder[];
  placeOrder: (deliveryAddress: string, paymentMethod: string) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  achievements: AchievementBadge[];
  addXP: (amount: number, reason?: string) => void;

  isProUnlocked: boolean;
  unlockProTier: () => void;

  // Dynamic CMS Configuration
  cmsDashboard: any | null;
  refreshCMSDashboard: () => Promise<void>;
}

const FarmDataContext = createContext<FarmDataContextType | undefined>(undefined);

export const FarmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('krishi_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem('krishi_farms');
    return saved ? JSON.parse(saved) : INITIAL_FARMS;
  });

  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem('krishi_crops');
    return saved ? JSON.parse(saved) : INITIAL_CROPS;
  });

  const [tasks, setTasks] = useState<FarmTask[]>(() => {
    const saved = localStorage.getItem('krishi_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Location State
  const [locationState, setLocationState] = useState<LocationState>(() => {
    const stored = getStoredLocation();
    if (stored) return stored;

    // Graceful initial state with non-intrusive prompt
    const initialDistrict = user?.district || 'Raichur';
    const initialInfo = AGRI_DISTRICT_CENTROIDS[initialDistrict] || AGRI_DISTRICT_CENTROIDS['Raichur'];

    return {
      coordinates: { lat: initialInfo.lat, lng: initialInfo.lng },
      address: {
        village: initialInfo.village || 'Sindhanur',
        district: initialDistrict,
        state: initialInfo.state || 'Karnataka',
        country: 'India',
        formatted: `${initialInfo.village || 'Sindhanur'}, ${initialDistrict}, ${initialInfo.state || 'Karnataka'}`
      },
      source: 'default',
      status: 'idle',
      lastUpdated: 'Ready to detect'
    };
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Real-Time Weather State
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [isWeatherLive, setIsWeatherLive] = useState(false);
  const [weatherLastUpdated, setWeatherLastUpdated] = useState('2 min ago');

  // Mandi items dynamically calculated from user's coordinates
  const [mandis, setMandis] = useState<MandiItem[]>(() =>
    getNearbyMandisForLocation(locationState.coordinates)
  );

  // AI Command Center
  const [activePromptForAI, setActivePromptForAI] = useState<string | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const openAIChatWithPrompt = (prompt: string) => {
    setActivePromptForAI(prompt);
    setIsAIChatOpen(true);
  };

  const clearAIChatPrompt = () => {
    setActivePromptForAI(null);
  };

  // Weather fetcher based on active coordinates
  const updateWeatherForCoords = useCallback(async (lat: number, lng: number) => {
    try {
      const liveData = await fetchLiveWeather(lat, lng);
      setWeather(liveData);
      setIsWeatherLive(true);
      setWeatherLastUpdated('Just now');
    } catch (error) {
      console.warn('Using cached weather due to network limit', error);
      setIsWeatherLive(false);
    }
  }, []);

  // Request real GPS location from browser
  const requestGPSLocation = async () => {
    setLocationState((prev) => ({ ...prev, status: 'loading', errorMessage: undefined }));
    showToast('📡 Requesting GPS satellite fix...', 'info');

    try {
      const coords = await getCurrentGPSCoordinates();
      const address = await reverseGeocode(coords.lat, coords.lng);

      const updated: LocationState = {
        coordinates: coords,
        address,
        source: 'gps',
        status: 'granted',
        lastUpdated: 'Just now'
      };

      setLocationState(updated);
      setStoredLocation(updated);

      // Update user profile location details
      setUser((prev) =>
        prev
          ? {
              ...prev,
              village: address.village || prev.village,
              district: address.district,
              state: address.state
            }
          : null
      );

      // Recalculate dynamic mandis and weather
      setMandis(getNearbyMandisForLocation(coords));
      await updateWeatherForCoords(coords.lat, coords.lng);

      showToast(`📍 GPS Fix acquired: ${address.formatted}`, 'success');
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to detect GPS location';
      const isDenied = errorMsg.includes('denied');

      setLocationState((prev) => ({
        ...prev,
        status: isDenied ? 'denied' : 'error',
        errorMessage: errorMsg
      }));

      showToast(
        isDenied
          ? 'Location permission denied. You can select your district manually.'
          : errorMsg,
        'error'
      );
    }
  };

  // Set manual location
  const setManualLocation = async (district: string, state: string, village?: string) => {
    const centroid = AGRI_DISTRICT_CENTROIDS[district] || {
      lat: 16.2120,
      lng: 77.3439,
      state: state || 'Karnataka',
      village: village || district
    };

    const updated: LocationState = {
      coordinates: { lat: centroid.lat, lng: centroid.lng },
      address: {
        village: village || centroid.village || district,
        district,
        state: state || centroid.state,
        country: 'India',
        formatted: `${village || centroid.village || district}, ${district}, ${state || centroid.state}`
      },
      source: 'manual',
      status: 'granted',
      lastUpdated: 'Just now'
    };

    setLocationState(updated);
    setStoredLocation(updated);

    setUser((prev) =>
      prev
        ? {
            ...prev,
            village: updated.address.village || prev.village,
            district,
            state: state || centroid.state
          }
        : null
    );

    setMandis(getNearbyMandisForLocation(updated.coordinates));
    await updateWeatherForCoords(centroid.lat, centroid.lng);

    showToast(`📍 Location updated to ${district}, ${state || centroid.state}`, 'success');
  };

  const refreshWeather = async () => {
    if (locationState.coordinates) {
      showToast('Refreshing micro-climate weather telemetry...', 'info');
      await updateWeatherForCoords(locationState.coordinates.lat, locationState.coordinates.lng);
      showToast('Weather updated!', 'success');
    }
  };

  // Initial load of live weather if coordinates exist
  useEffect(() => {
    if (locationState.coordinates) {
      updateWeatherForCoords(locationState.coordinates.lat, locationState.coordinates.lng);
    }
  }, [locationState.coordinates, updateWeatherForCoords]);

  // AI Farm Health calculation
  const aiFarmHealth: AIFarmHealthScore = {
    overall: 94,
    cropHealth: Math.round(
      crops.length > 0 ? crops.reduce((acc, c) => acc + c.healthScore, 0) / crops.length : 94
    ),
    soilCondition: 91,
    weatherRisk: weather.rainProbability > 60 ? 84 : 95,
    irrigation: weather.soilMoisture > 50 ? 96 : 88,
    marketOpportunity: 92,
    factors: [
      {
        name: 'Crop Foliar Vigor',
        score: 96,
        weight: '30%',
        impact: 'positive',
        description: 'Multi-spectral satellite NDVI & AI Crop Doctor scan confirm healthy chlorophyll index.'
      },
      {
        name: 'Soil NPK & Moisture',
        score: 91,
        weight: '25%',
        impact: 'positive',
        description: 'Capacitive sensors report 58% moisture (optimal field capacity) with stable pH (6.8).'
      },
      {
        name: 'Micro-Climate Risk',
        score: weather.rainProbability > 60 ? 84 : 95,
        weight: '20%',
        impact: weather.rainProbability > 60 ? 'warning' : 'positive',
        description: `Local wind calm (${weather.windSpeed} km/h). Rain probability is ${weather.rainProbability}%.`
      },
      {
        name: 'Irrigation Automation',
        score: 95,
        weight: '15%',
        impact: 'positive',
        description: 'Smart Pump is in AUTO mode with moisture threshold locks active.'
      },
      {
        name: 'Market Price Opportunity',
        score: 92,
        weight: '10%',
        impact: 'positive',
        description: 'Regional APMC Mandis show positive upward price trends for your harvested crops.'
      }
    ]
  };

  // AI Daily Briefing generation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const aiBriefing: AIBriefing = {
    title: 'AI Farm Briefing',
    greeting: `${getGreeting()}, ${user?.name || 'Farmer'}`,
    summary: `KrishiSmart AI has synthesized real-time telemetry from your ${locationState.address.district} farm parcels. Your crops are exhibiting high vegetative vigor with calm micro-climate conditions today.`,
    bullets: [
      `Your active crops (${crops.map((c) => c.name).join(', ')}) are currently healthy with an average vigor of ${aiFarmHealth.cropHealth}%.`,
      weather.rainProbability > 40
        ? `Rain expected soon (${weather.rainProbability}% probability), so scheduled irrigation can be reduced to save power.`
        : `Weather is clear (${weather.temp}°C, humidity ${weather.humidity}%). Optimal foliar spray window starts at ${weather.sprayingAdvisory.bestWindow}.`,
      `Tomato prices in nearby mandis are trending upward (+7.1% in Kolar & regional yards).`,
      `Your Paddy plot requires monitoring for drainage furrows ahead of weekly showers.`
    ],
    generatedAt: 'Just now'
  };

  const aiMonitoringStatus = {
    isLive: true,
    lastChecked: '2 min ago',
    activeSensors: 7,
    dataConfidence: '99.4%'
  };

  // Existing modules state
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(() => {
    const saved = localStorage.getItem('krishi_schemes');
    return saved ? JSON.parse(saved) : INITIAL_SCHEMES;
  });

  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>(() => {
    const saved = localStorage.getItem('krishi_fin_summary');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_SUMMARY;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('krishi_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [iotDevices, setIotDevices] = useState<IoTDevice[]>(() => {
    const saved = localStorage.getItem('krishi_iot');
    return saved ? JSON.parse(saved) : INITIAL_IOT_DEVICES;
  });

  const [smartPump, setSmartPump] = useState<SmartPump>(() => {
    const saved = localStorage.getItem('krishi_pump');
    return saved ? JSON.parse(saved) : INITIAL_SMART_PUMP;
  });

  const [dronePlans, setDronePlans] = useState<DronePlan[]>(() => {
    const saved = localStorage.getItem('krishi_drone_plans');
    return saved ? JSON.parse(saved) : INITIAL_DRONE_PLANS;
  });

  const [storeProducts] = useState<StoreProduct[]>(INITIAL_STORE_PRODUCTS);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('krishi_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<StoreOrder[]>(() => {
    const saved = localStorage.getItem('krishi_orders');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'ORD-84920',
            date: '2026-08-12',
            items: [{ product: INITIAL_STORE_PRODUCTS[0], quantity: 2 }],
            totalAmount: 2700,
            deliveryAddress: `${locationState.address.village || 'Farm Gate'}, ${locationState.address.district}`,
            status: 'Out for Delivery',
            paymentMethod: 'UPI (Google Pay)',
            trackingSteps: [
              { title: 'Order Confirmed', date: 'Aug 12, 10:00 AM', completed: true },
              { title: 'Dispatched from Hub', date: 'Aug 13, 02:30 PM', completed: true },
              { title: 'Out for Delivery', date: 'Aug 19, 08:00 AM', completed: true },
              { title: 'Delivered', date: 'Expected by 5 PM', completed: false }
            ]
          }
        ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('krishi_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem('krishi_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // Persistence to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('krishi_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('krishi_farms', JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem('krishi_crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('krishi_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('krishi_schemes', JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem('krishi_fin_summary', JSON.stringify(financialSummary));
    localStorage.setItem('krishi_transactions', JSON.stringify(transactions));
  }, [financialSummary, transactions]);

  useEffect(() => {
    localStorage.setItem('krishi_iot', JSON.stringify(iotDevices));
  }, [iotDevices]);

  useEffect(() => {
    localStorage.setItem('krishi_pump', JSON.stringify(smartPump));
  }, [smartPump]);

  useEffect(() => {
    localStorage.setItem('krishi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('krishi_orders', JSON.stringify(orders));
  }, [orders]);

  // Hydrate data from Backend REST API on mount
  useEffect(() => {
    let isMounted = true;
    const hydrateFromBackend = async () => {
      try {
        const [cropsRes, farmsRes, tasksRes, pumpRes, iotRes] = await Promise.allSettled([
          api.crops.getAll(),
          api.farms.getAll(),
          api.crops.getTasks(),
          api.pumps.getAll(),
          api.iot.getDevices()
        ]);

        if (!isMounted) return;

        if (cropsRes.status === 'fulfilled' && cropsRes.value?.success && cropsRes.value?.data?.length) {
          setCrops(cropsRes.value.data);
        }
        if (farmsRes.status === 'fulfilled' && farmsRes.value?.success && farmsRes.value?.data?.length) {
          setFarms(farmsRes.value.data);
        }
        if (tasksRes.status === 'fulfilled' && tasksRes.value?.success && tasksRes.value?.data?.length) {
          setTasks(tasksRes.value.data);
        }
        if (pumpRes.status === 'fulfilled' && pumpRes.value?.success && pumpRes.value?.data?.length) {
          setSmartPump(pumpRes.value.data[0]);
        }
        if (iotRes.status === 'fulfilled' && iotRes.value?.success && iotRes.value?.data?.length) {
          setIotDevices(iotRes.value.data);
        }
      } catch (err) {
        console.warn('Backend API offline or unreachable, running in offline fallback mode:', err);
      }
    };

    hydrateFromBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  // Gamification XP Handler
  const addXP = (amount: number, reason?: string) => {
    if (!user) return;
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    const leveledUp = newLevel > user.level;

    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        xp: newXP,
        level: newLevel
      };
    });

    if (leveledUp) {
      showToast(`🎉 Level Up! You are now a Level ${newLevel} Tech Farmer!`, 'success');
    } else if (reason) {
      showToast(`+${amount} XP: ${reason}`, 'success');
    }
  };

  // User Actions
  const login = (email: string, name?: string) => {
    setUser((prev) => ({
      ...(prev || INITIAL_USER),
      email,
      name: name || prev?.name || 'Darshan Patil'
    }));
    showToast(`Welcome back, ${name || 'Farmer'}!`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('krishi_user');
    showToast('Logged out successfully', 'info');
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
    showToast('Profile updated successfully', 'success');
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      const base = prev || INITIAL_USER;
      return {
        ...base,
        ...data,
        level: 1,
        xp: 100,
        isPremium: true
      };
    });
    addXP(150, 'Completed Onboarding & Farm Setup');
    showToast('Farm successfully registered in KrishiSmart AI!', 'success');
  };

  // Farms & Crops
  const addFarm = async (farmData: Omit<Farm, 'id'>) => {
    const newFarm: Farm = { ...farmData, id: `farm-${Date.now()}` };
    setFarms((prev) => [...prev, newFarm]);
    addXP(100, 'Registered New Farm Parcel');
    showToast(`Farm "${farmData.name}" added successfully!`, 'success');
    try {
      await api.farms.create(farmData);
    } catch (e) {
      console.warn('Backend sync for farm creation deferred:', e);
    }
  };

  const addCrop = async (cropData: Omit<Crop, 'id' | 'timeline'>) => {
    const newCrop: Crop = {
      ...cropData,
      id: `crop-${Date.now()}`,
      timeline: [
        { id: 'seed', name: 'Seed Treatment', status: 'completed', progress: 100, estimatedDate: 'Day 1-15', notes: 'Initial germination', tasks: ['Seed Selection'] },
        { id: 'germination', name: 'Vegetative Growth', status: 'active', progress: 35, estimatedDate: 'Day 16-45', notes: 'Active growth', tasks: ['Weed check'] },
        { id: 'growth', name: 'Canopy Maturation', status: 'upcoming', progress: 0, estimatedDate: 'Day 46-75', notes: 'Canopy development', tasks: ['Foliar feed'] },
        { id: 'flowering', name: 'Flowering & Fruiting', status: 'upcoming', progress: 0, estimatedDate: 'Day 76-100', notes: 'Flowering stage', tasks: ['Moisture check'] },
        { id: 'harvest', name: 'Harvest & Mandi Sale', status: 'upcoming', progress: 0, estimatedDate: 'Harvest', notes: 'Mandi transport', tasks: ['Harvest'] }
      ]
    };
    setCrops((prev) => [...prev, newCrop]);
    addXP(80, `Added Crop: ${cropData.name}`);
    showToast(`Crop "${cropData.name}" added to cultivation!`, 'success');
    try {
      await api.crops.create(cropData);
    } catch (e) {
      console.warn('Backend sync for crop creation deferred:', e);
    }
  };

  const advanceCropStage = async (cropId: string, stageId: Crop['currentStage']) => {
    setCrops((prev) =>
      prev.map((crop) => {
        if (crop.id !== cropId) return crop;
        return {
          ...crop,
          currentStage: stageId,
          healthScore: Math.min(100, crop.healthScore + 2)
        };
      })
    );
    addXP(50, 'Advanced Crop Growth Stage');
    showToast(`Crop progress updated to ${stageId}`, 'success');
    try {
      await api.crops.advanceStage(cropId, stageId);
    } catch (e) {
      console.warn('Backend sync for crop stage deferred:', e);
    }
  };

  const deleteCrop = async (cropId: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== cropId));
    showToast('Crop removed from farm monitoring', 'info');
    try {
      await api.crops.delete(cropId);
    } catch (e) {
      console.warn('Backend sync for crop deletion deferred:', e);
    }
  };

  // Tasks
  const toggleTask = async (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const next = !t.completed;
          if (next) addXP(t.xpReward, `Completed Task: ${t.title}`);
          return { ...t, completed: next };
        }
        return t;
      })
    );
    try {
      await api.crops.toggleTask(taskId);
    } catch (e) {
      console.warn('Backend sync for task toggle deferred:', e);
    }
  };

  const addTask = async (taskData: Omit<FarmTask, 'id' | 'completed'>) => {
    const newTask: FarmTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task added to daily farm plan', 'success');
    try {
      await api.crops.addTask(taskData);
    } catch (e) {
      console.warn('Backend sync for task creation deferred:', e);
    }
  };

  // Schemes
  const applyForScheme = async (schemeId: string) => {
    setSchemes((prev) =>
      prev.map((s) => (s.id === schemeId ? { ...s, applicationStatus: 'Applied' } : s))
    );
    addXP(75, 'Applied for Government Agro Scheme');
    showToast('Application submitted successfully to portal!', 'success');
    try {
      await api.schemes.apply(schemeId);
    } catch (e) {
      console.warn('Backend sync for scheme application deferred:', e);
    }
  };

  // Financials
  const addTransaction = (tx: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = { ...tx, id: `tx-${Date.now()}` };
    setTransactions((prev) => [newTx, ...prev]);

    setFinancialSummary((prev) => {
      const isIncome = tx.type === 'Income';
      const inc = isIncome ? prev.totalIncome + tx.amount : prev.totalIncome;
      const exp = !isIncome ? prev.totalExpenses + tx.amount : prev.totalExpenses;
      const profit = inc - exp;
      return {
        ...prev,
        totalIncome: inc,
        totalExpenses: exp,
        netProfit: profit,
        profitMargin: inc > 0 ? Math.round((profit / inc) * 100) : 0
      };
    });

    addXP(30, 'Recorded Financial Ledger Entry');
    showToast('Transaction recorded in KrishiNidhi', 'success');
  };

  // IoT Devices & Pumps
  const addIoTDevice = (device: Omit<IoTDevice, 'id' | 'lastPing' | 'status'>) => {
    const newDevice: IoTDevice = {
      ...device,
      id: `iot-${Date.now()}`,
      status: 'Normal',
      lastPing: 'Just now'
    };
    setIotDevices((prev) => [...prev, newDevice]);
    addXP(60, `Paired Sensor: ${device.name}`);
    showToast(`Sensor paired with farm telemetry node!`, 'success');
  };

  const togglePumpStatus = async (status?: 'ON' | 'OFF') => {
    const nextStatus = status ? status : smartPump.status === 'ON' ? 'OFF' : 'ON';
    setSmartPump((prev) => ({
      ...prev,
      status: nextStatus
    }));
    showToast(
      nextStatus === 'ON'
        ? '⚡ Smart Pump started. High pressure drip active.'
        : '⏹️ Smart Pump stopped. Power conserved.',
      nextStatus === 'ON' ? 'success' : 'info'
    );
    try {
      await api.pumps.control(smartPump.id, { status: nextStatus });
    } catch (e) {
      console.warn('Backend sync for pump status deferred:', e);
    }
  };

  const setPumpMode = async (mode: 'MANUAL' | 'AUTO' | 'SCHEDULE') => {
    setSmartPump((prev) => ({ ...prev, mode }));
    showToast(`Pump mode switched to ${mode}`, 'info');
    try {
      await api.pumps.control(smartPump.id, { mode });
    } catch (e) {
      console.warn('Backend sync for pump mode deferred:', e);
    }
  };

  const updatePumpThreshold = async (threshold: number) => {
    setSmartPump((prev) => ({ ...prev, soilMoistureThreshold: threshold }));
    showToast(`Auto-start moisture threshold set to ${threshold}%`, 'info');
    try {
      await api.pumps.control(smartPump.id, { threshold });
    } catch (e) {
      console.warn('Backend sync for pump threshold deferred:', e);
    }
  };

  // Drone Plans
  const addDronePlan = (plan: Omit<DronePlan, 'id' | 'coverageProgress' | 'status'>) => {
    const newPlan: DronePlan = {
      ...plan,
      id: `drone-${Date.now()}`,
      status: 'Scheduled',
      coverageProgress: 0
    };
    setDronePlans((prev) => [newPlan, ...prev]);
    addXP(70, 'Configured Autonomous Drone Flight Path');
    showToast('Drone mission scheduled and telemetry approved', 'success');
  };

  const executeDroneMission = (planId: string) => {
    setDronePlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: 'In Flight', coverageProgress: 25 } : p))
    );
    showToast('🚁 Drone launched! Real-time flight telemetry streaming...', 'info');

    setTimeout(() => {
      setDronePlans((prev) =>
        prev.map((p) => (p.id === planId ? { ...p, status: 'Completed', coverageProgress: 100 } : p))
      );
      addXP(100, 'Drone Spray Mission Completed');
      showToast('Drone flight completed. 100% parcel coverage achieved.', 'success');
    }, 4000);
  };

  // E-Commerce Store & Cart
  const addToCart = (product: StoreProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (deliveryAddress: string, paymentMethod: string) => {
    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const newOrder: StoreOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      totalAmount: total,
      deliveryAddress,
      status: 'Processing',
      paymentMethod,
      trackingSteps: [
        { title: 'Order Confirmed', date: 'Today, Just now', completed: true },
        { title: 'Dispatched from Warehouse Hub', date: 'Tomorrow', completed: false },
        { title: 'Out for Delivery to Farm Gate', date: 'In 2 days', completed: false },
        { title: 'Delivered', date: 'In 3 days', completed: false }
      ]
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    addXP(120, 'Ordered Agri Inputs via KrishiStore');
    showToast('Order placed successfully! Delivery tracking initiated.', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Premium Tier
  const isProUnlocked = !!user?.isPremium;
  const unlockProTier = () => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, isPremium: true, tier: 'Pro' } : null));
    addXP(500, 'Upgraded to KrishiSmart Pro');
    showToast('🌟 Welcome to KrishiSmart Pro! All AI & IoT features unlocked.', 'success');
  };

  const [cmsDashboard, setCmsDashboard] = useState<any | null>(null);

  const refreshCMSDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/dashboard');
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setCmsDashboard(json.data);
        }
      }
    } catch (e) {
      console.warn('Could not load CMS dashboard config:', e);
    }
  }, []);

  useEffect(() => {
    refreshCMSDashboard();
  }, [refreshCMSDashboard]);

  // Sync crops from CMS
  useEffect(() => {
    fetch('/api/cms/crops')
      .then(res => res.json())
      .then(json => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setCrops(json.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <FarmDataContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        completeOnboarding,
        farms,
        addFarm,
        crops,
        addCrop,
        advanceCropStage,
        deleteCrop,
        tasks,
        toggleTask,
        addTask,
        locationState,
        requestGPSLocation,
        setManualLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        weather,
        isWeatherLive,
        weatherLastUpdated,
        refreshWeather,
        mandis,
        nearbyMandis: mandis,
        aiFarmHealth,
        aiBriefing,
        aiMonitoringStatus,
        activePromptForAI,
        openAIChatWithPrompt,
        clearAIChatPrompt,
        isAIChatOpen,
        setIsAIChatOpen,
        schemes,
        applyForScheme,
        financialSummary,
        transactions,
        addTransaction,
        iotDevices,
        addIoTDevice,
        smartPump,
        togglePumpStatus,
        setPumpMode,
        updatePumpThreshold,
        dronePlans,
        addDronePlan,
        executeDroneMission,
        storeProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        placeOrder,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        achievements,
        addXP,
        isProUnlocked,
        unlockProTier,
        cmsDashboard,
        refreshCMSDashboard
      }}
    >
      {children}
    </FarmDataContext.Provider>
  );
};

export const useFarmData = () => {
  const context = useContext(FarmDataContext);
  if (!context) {
    throw new Error('useFarmData must be used within a FarmDataProvider');
  }
  return context;
};
