import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  Filter,
  CheckCheck
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';

interface AlertCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

export const AlertCenterModal: React.FC<AlertCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useFarmData();
  const { t } = useLanguage();

  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Critical' | 'Important' | 'Normal'>('All');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) =>
    priorityFilter === 'All' ? true : n.priority === priorityFilter
  );

  const handleActionClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.actionRoute) {
      onNavigate(notif.actionRoute);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#EFF4EF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#059669]" />
            <div>
              <h3 className="font-extrabold text-base text-[#172B24] font-heading">
                {t('notifications')}
              </h3>
              <p className="text-xs text-[#8A9A90]">
                {notifications.filter((n) => !n.read).length} unread alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-[#064E3B] font-bold hover:underline flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#8A9A90] hover:text-[#3E5248]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Priority Filter Pills */}
        <div className="px-5 py-2.5 bg-[#F7FAF7] border-b border-[#EFF4EF] flex gap-1.5 overflow-x-auto">
          {(['All', 'Critical', 'Important', 'Normal'] as const).map((prio) => (
            <button
              key={prio}
              onClick={() => setPriorityFilter(prio)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                priorityFilter === prio
                  ? 'bg-[#172B24] text-white shadow-xs'
                  : 'bg-white text-[#5A6E64] border border-[#E5EDE7] hover:bg-[#EFF4EF]'
              }`}
            >
              {prio}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-[#34D399] mx-auto" />
              <div className="font-bold text-[#243A32] text-sm">All clear! No alerts</div>
              <p className="text-xs text-[#8A9A90]">
                You are up to date on weather, disease, and mandi price alerts.
              </p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  notif.read
                    ? 'bg-[#F7FAF7]/70 border-[#E5EDE7] opacity-70'
                    : 'bg-white border-[#E5EDE7] shadow-2xs hover:border-[#6EE7B7]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        notif.priority === 'Critical'
                          ? 'bg-rose-500 animate-ping'
                          : notif.priority === 'Important'
                          ? 'bg-amber-500'
                          : 'bg-[#10B981]'
                      }`}
                    />
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EFF4EF] text-[#3E5248]">
                      {notif.category}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#8A9A90] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timestamp}</span>
                  </span>
                </div>

                <div className="font-bold text-xs text-[#172B24]">{notif.title}</div>
                <p className="text-xs text-[#5A6E64] leading-relaxed">{notif.message}</p>

                {notif.actionRoute && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionClick(notif);
                    }}
                    className="pt-2 text-xs font-bold text-[#064E3B] hover:text-[#064E3B] flex items-center gap-1"
                  >
                    <span>View & Take Action</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
