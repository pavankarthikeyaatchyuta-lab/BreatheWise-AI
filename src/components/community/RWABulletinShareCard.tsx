'use client';

import React from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface RWABulletinShareCardProps {
  copied: boolean;
  onCopy: () => void;
  onWhatsAppShare: () => void;
}

export function RWABulletinShareCard({
  copied,
  onCopy,
  onWhatsAppShare,
}: RWABulletinShareCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4" role="region" aria-label="Share Action Bulletin">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
          <Share2 className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Share Action Bulletin
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Send a ready-to-share update to your school, RWA or community WhatsApp group.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
        <button
          onClick={onCopy}
          className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
          aria-label={copied ? 'Advisory copied to clipboard' : 'Copy advisory to clipboard'}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          onClick={onWhatsAppShare}
          className="px-5 py-2.5 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-2"
          aria-label="Share community advisory on WhatsApp"
        >
          <Share2 className="w-4 h-4" aria-hidden="true" />
          <span>Share on WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
