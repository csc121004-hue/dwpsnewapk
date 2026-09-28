import React from 'react';
import { BusTrackingData } from '../types';

interface BusTrackingModalProps {
  busData: BusTrackingData;
  onClose: () => void;
}

export const BusTrackingModal: React.FC<BusTrackingModalProps> = ({ busData, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#e2e8f0] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#10b981] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">directions_bus</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#00152f]">Live Bus Tracking</h3>
              <p className="text-xs text-[#74777f]">{busData.busNumber} • {busData.registrationNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#74777f] hover:text-[#00152f] font-bold"
          >
            ✕
          </button>
        </div>

        {/* Live Status Hero */}
        <div className="p-3.5 bg-[#00152f] text-white rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10b981] text-white text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE GPS ACTIVE
            </span>
            <span className="text-xs text-[#fde68a] font-bold">ETA: ~{busData.etaMinutes} Mins</span>
          </div>

          <div>
            <span className="text-[10px] text-[#b0c8f0] uppercase font-semibold">Current Transit</span>
            <p className="text-sm font-bold text-white mt-0.5">{busData.currentLocation}</p>
          </div>

          <div className="pt-2 border-t border-[#304869] flex items-center justify-between text-xs">
            <span className="text-[#d4e3ff]">Next: <strong className="text-white">{busData.nextStop}</strong></span>
            <span className="text-[#10b981] font-semibold">● {busData.status}</span>
          </div>
        </div>

        {/* Driver Contact */}
        <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#74777f] font-semibold uppercase">Authorized Driver</span>
            <p className="text-xs font-bold text-[#00152f] mt-0.5">{busData.driverName}</p>
          </div>
          <a
            href={`tel:${busData.driverPhone}`}
            className="px-3 py-1.5 bg-[#10b981] text-white rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Call Driver</span>
          </a>
        </div>

        {/* Timeline of Stops */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#43474e] uppercase">Route Stops &amp; Schedule</span>
          <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e2e8f0]">
            {busData.stops.map((stop, idx) => (
              <div key={idx} className="relative flex items-center justify-between text-xs">
                {/* Node icon */}
                <span
                  className={`absolute -left-5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                    stop.current
                      ? 'border-[#10b981] ring-4 ring-[#10b981]/20'
                      : stop.passed
                      ? 'border-[#00152f] bg-[#00152f]'
                      : 'border-[#c4c6cf]'
                  }`}
                >
                  {stop.passed && (
                    <span className="material-symbols-outlined text-[10px] text-white">check</span>
                  )}
                </span>

                <div className="ml-2">
                  <p
                    className={`font-semibold ${
                      stop.current
                        ? 'text-[#10b981] font-bold'
                        : stop.passed
                        ? 'text-[#74777f]'
                        : 'text-[#00152f]'
                    }`}
                  >
                    {stop.name}
                  </p>
                  {stop.current && (
                    <span className="text-[10px] text-[#10b981] font-bold">Bus Arriving Next</span>
                  )}
                </div>

                <span className="text-[11px] font-mono text-[#74777f]">{stop.time}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00152f] font-bold text-xs rounded-xl active:scale-95 transition-all"
        >
          Close Bus Tracker
        </button>
      </div>
    </div>
  );
};
