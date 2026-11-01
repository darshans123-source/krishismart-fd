import React, { useState, useRef, useEffect } from 'react';
import {
  BrainCircuit,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarmData } from '../../context/FarmDataContext';
import { AIChatMessage } from '../../types';
import { askGeminiChat } from '../../services/gemini';

export const FloatingAIChat: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    user,
    crops,
    weather,
    financialSummary,
    isProUnlocked,
    addXP,
    locationState,
    activePromptForAI,
    clearAIChatPrompt,
    isAIChatOpen,
    setIsAIChatOpen,
    aiFarmHealth
  } = useFarmData();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const initialPrompts: Record<string, string[]> = {
    en: [
      "Analyze my farm today",
      "What should I do today?",
      "Should I irrigate my crops today?",
      "When is the most profitable time to sell my harvest?",
      "Check disease risk on tomato",
      "Show my financial health"
    ],
    kn: [
      "ಇಂದು ನನ್ನ ಜಮೀನನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
      "ಇಂದು ನಾನು ಏನು ಮಾಡಬೇಕು?",
      "ಇಂದು ನನ್ನ ಬೆಳೆಗೆ ನೀರು ಹಾಯಿಸಬೇಕೇ?",
      "ನನ್ನ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಲು ಸೂಕ್ತ ಸಮಯ ಯಾವುದು?",
      "ಟೊಮ್ಯಾಟೋ ಎಲೆಯ ರೋಗ ತಪಾಸಣೆ ಮಾಡಿ"
    ],
    hi: [
      "आज मेरे खेत का समग्र विश्लेषण करें",
      "आज मुझे क्या काम करना चाहिए?",
      "क्या मुझे आज अपने खेत में सिंचाई करनी चाहिए?",
      "फसल बेचने का सबसे अच्छा समय क्या है?",
      "फसल रोग जोखिम की जांच करें"
    ]
  };

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text:
        language === 'kn'
          ? `ನಮಸ್ಕಾರ ${user?.name || 'ರೈತ ಮಿತ್ರರೆ'}! 🌱 ನಾನು ನಿಮ್ಮ ಕೃಷಿಸ್ಮಾರ್ಟ್ ಎಐ ಸಲಹೆಗಾರ. ${locationState.address.district} ನೈಜ-ಸಮಯ ಹವಾಮಾನ ಮತ್ತು ಮಣ್ಣಿನ ಮಾಹಿತಿ ಆಧಾರಿತವಾಗಿ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ!`
          : language === 'hi'
          ? `नमस्ते ${user?.name || 'किसान भाई'}! 🌱 मैं आपका कृषिज्मार्ट AI सलाहकार हूँ। ${locationState.address.district} के वास्तविक मौसम और फसल स्थिति अनुसार कुछ भी पूछें!`
          : `Hello ${user?.name || 'Farmer'}! 🌱 I'm your KrishiSmart AI Farm Advisor, calibrated for **${locationState.address.formatted}**. Ask me about real-time crop analysis, irrigation, disease risks, or mandi trends!`,
      timestamp: 'Just now',
      language
    }
  ]);

  // Listen to external triggers from AI Command Center
  useEffect(() => {
    if (activePromptForAI) {
      setIsAIChatOpen(true);
      handleSend(activePromptForAI);
      clearAIChatPrompt();
    }
  }, [activePromptForAI]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;
    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const result = await askGeminiChat({
        prompt: query,
        language,
        context: {
          district: locationState.address.district,
          state: locationState.address.state,
          crops: crops.map((c) => c.name),
          temperature: weather.temp,
          condition: weather.condition,
          humidity: weather.humidity,
          soilMoisture: weather.soilMoisture,
          rainProbability: weather.rainProbability,
          farmHealth: aiFarmHealth.overall,
          netProfit: financialSummary.netProfit,
        },
      });
      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language
      };
      setMessages((prev) => [...prev, aiMsg]);
      addXP(15, 'Consulted Krishi AI');
    } catch (e: any) {
      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `AI is unavailable right now: ${e?.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentSuggestions = initialPrompts[language] || initialPrompts.en;

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-24 lg:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          className="btn-clay btn-clay-pill relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#064E3B] via-[#059669] to-green-600 text-white shadow-xl shadow-[#064E3B]/30 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#34D399]/40"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7B7] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#34D399]"></span>
          </span>

          <BrainCircuit className="w-5 h-5 animate-pulse" />
          <span className="font-extrabold text-xs tracking-wide font-heading">
            {t('askAi')}
          </span>
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isAIChatOpen && (
        <div className="fixed bottom-20 right-3 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[82vh] bg-white/75 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#E5EDE7]/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#064E3B] to-[#064E3B] text-white flex items-center justify-between border-b border-[#059669]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-[#6EE7B7]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-tight font-heading">
                    KRISHI AI COPILOT
                  </h3>
                  <span className="px-1.5 py-0.2 bg-[#10B981]/40 text-[#A7F3D0] text-[9px] font-extrabold rounded-sm uppercase tracking-wider">
                    24/7 Live
                  </span>
                </div>
                <p className="text-[11px] text-[#A7F3D0]/80">
                  Multilingual Agronomist & Market Intelligence
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAIChatOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F7FAF7]/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5 border border-[#A7F3D0]">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#059669] text-white rounded-br-xs shadow-sm font-medium'
                      : 'bg-white/75 backdrop-blur-xl border border-[#E5EDE7]/90 text-[#243A32] rounded-bl-xs shadow-xs whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-[#D1FAE5]/70' : 'text-[#8A9A90]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-[#243A32] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-[#718078] bg-white/75 backdrop-blur-xl p-3 rounded-2xl border border-[#E5EDE7] max-w-[140px] shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[10px] font-semibold text-[#8A9A90]">Analyzing...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-[#EFF4EF]/70 border-t border-[#E5EDE7]/80 overflow-x-auto flex gap-1.5 no-scrollbar">
            {currentSuggestions.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/75 backdrop-blur-xl hover:bg-[#ECFDF5] text-[10px] font-medium text-[#3E5248] hover:text-[#064E3B] border border-[#E5EDE7] transition-colors shadow-2xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white/75 backdrop-blur-xl border-t border-[#E5EDE7] flex items-center gap-2">
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                language === 'kn'
                  ? "ಕೃಷಿ ಪ್ರಶ್ನೆ ಕೇಳಿ..."
                  : language === 'hi'
                  ? "कृषि प्रश्न पूछें..."
                  : "Ask about crops, pests, prices, schemes..."
              }
              className="flex-1 bg-[#EFF4EF] border border-[#E5EDE7] rounded-xl px-3.5 py-2.5 text-xs text-[#243A32] focus:outline-hidden focus:ring-2 focus:ring-[#10B981] focus:bg-white/75 backdrop-blur-xl transition-all placeholder:text-[#8A9A90]"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl btn-clay-primary disabled:opacity-40 text-white shadow-md shadow-[#059669]/20 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
