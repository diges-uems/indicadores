'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import React from 'react';

interface SectionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  badgeText: string;
  isDarkThemeSource?: boolean;
  children: React.ReactNode;
}

export function SectionModal({
  open,
  onClose,
  title,
  subtitle,
  badgeText,
  isDarkThemeSource = false,
  children,
}: SectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-300 w-full max-w-[98vw] sm:max-w-[98vw] md:max-w-[98vw] h-[96vh] p-0 gap-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{subtitle}</DialogDescription>

        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-slate-100 z-10 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-widest mb-2 shadow-sm border border-blue-200">
              {badgeText}
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-slate-700 font-black mt-1 uppercase text-sm tracking-widest">
              {subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 hover:text-red-700 border-2 border-red-100 shadow-sm transition-transform hover:rotate-90 shrink-0"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div
          className={`flex-1 bg-slate-50 relative overflow-y-auto overflow-x-hidden ${
            isDarkThemeSource
              ? 'modal-white-override bg-white'
              : 'bg-white'
          } rounded-b-[2rem] p-8`}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
