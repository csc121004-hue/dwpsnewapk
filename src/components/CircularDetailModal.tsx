import React from 'react';
import { CircularItem } from '../types';

interface CircularDetailModalProps {
  circular: CircularItem;
  onClose: () => void;
}

export const CircularDetailModal: React.FC<CircularDetailModalProps> = ({ circular, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#e2e8f0] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-3.5 bg-[#00152f] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#fde68a] text-[#9b4500] text-[10px] font-bold">
              {circular.category}
            </span>
            <span className="text-xs text-[#b0c8f0]">{circular.date}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white hover:text-[#fde68a] font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3">
          {circular.imageUrl && (
            <div className="rounded-xl overflow-hidden h-48 w-full bg-[#e5eeff]">
              <img
                src={circular.imageUrl}
                alt={circular.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <h2 className="text-lg font-bold text-[#00152f] leading-snug">
            {circular.title}
          </h2>

          <div className="flex items-center gap-3 text-xs text-[#74777f] pb-2 border-b border-[#e2e8f0]">
            <span>Target: <strong>{circular.targetGrades}</strong></span>
            <span>•</span>
            <span>Published: <strong>{circular.publishedTime}</strong></span>
          </div>

          <div className="text-xs text-[#43474e] leading-relaxed space-y-2">
            <p className="font-semibold text-[#00152f]">{circular.summary}</p>
            <p>
              Delhi World Public School Ballabgarh takes immense pride in organizing events that foster holistic physical, cognitive, and artistic growth among students.
            </p>
            <p>
              Parents and guardians are requested to adhere to reporting timings and designated parking areas opposite Gate No. 2 (Milk Plant Road). Students must be in full proper school attire.
            </p>
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-xs text-[#00152f]">
            <span className="font-bold">Important Note for Attendees:</span>
            <p className="text-[11px] text-[#74777f] mt-0.5">
              Please carry your Parent ID badge for entry verification at the security reception.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00152f] text-white rounded-xl text-xs font-bold hover:bg-[#0f2a4a] active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
