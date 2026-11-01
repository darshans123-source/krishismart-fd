import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full ${maxWidth} bg-white rounded-2xl border border-[#E5EDE7] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5EDE7] flex items-center justify-between bg-[#F7FAF7]/70">
          <div>
            <h3 className="text-base font-extrabold text-[#172B24] font-heading tracking-tight">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#718078] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#E5EDE7] text-[#718078] hover:text-[#243A32] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
