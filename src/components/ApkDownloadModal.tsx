import React, { useState } from 'react';
import { usePWA } from '../hooks/usePWA';

interface ApkDownloadModalProps {
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWA();
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const handleDownloadApk = () => {
    setDownloadTriggered(true);
    // Trigger direct download from the Express backend
    const link = document.createElement('a');
    link.href = '/api/download/dwps-app.apk';
    link.download = 'disney-world-portal-v1.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#e2e8f0] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#00152f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">android</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#00152f]">Download Android APK</h3>
              <p className="text-xs text-[#74777f]">Official Mobile App Package</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#74777f] hover:text-[#00152f] font-bold"
          >
            ✕
          </button>
        </div>

        {/* APK Card */}
        <div className="p-4 bg-[#00152f] text-white rounded-xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full bg-[#10b981] text-white text-[10px] font-bold uppercase tracking-wider">
              Ready for Download
            </span>
            <span className="text-xs text-[#fde68a] font-mono">v1.0.1</span>
          </div>

          <div>
            <h4 className="text-base font-bold">Disney World Public School</h4>
            <p className="text-xs text-[#b0c8f0] font-mono mt-0.5">org.disneyworldps.portal</p>
          </div>

          <div className="pt-2 border-t border-[#304869] grid grid-cols-2 gap-2 text-[11px] text-[#d4e3ff]">
            <span>Target: <strong>Android 8.0+</strong></span>
            <span>Architecture: <strong>Universal</strong></span>
          </div>
        </div>

        {/* Download Button */}
        <div className="space-y-2">
          <button
            onClick={handleDownloadApk}
            className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download disney-world-portal-v1.0.apk</span>
          </button>

          {downloadTriggered && (
            <div className="p-2.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs font-semibold text-[#065f46] text-center">
              ✓ Downloading APK package from server! Check your Downloads folder.
            </div>
          )}
        </div>

        {/* Instant WebAPK Install Option if available */}
        {isInstallable && !isInstalled && (
          <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#00152f]">Instant WebAPK Install</span>
              <span className="text-[10px] font-bold text-[#10b981]">1-Tap Install</span>
            </div>
            <p className="text-[11px] text-[#43474e]">
              Install directly to your phone's home screen without downloading files manually.
            </p>
            <button
              onClick={promptInstall}
              className="w-full py-2 bg-[#00152f] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">install_mobile</span>
              <span>Install to Home Screen</span>
            </button>
          </div>
        )}

        {isIOS && (
          <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-xs space-y-1">
            <span className="font-bold text-[#00152f]">Install on iPhone / iPad (iOS):</span>
            <p className="text-[11px] text-[#43474e]">
              Tap Safari's <strong className="text-[#00152f]">Share</strong> button (box with arrow) and select <strong className="text-[#00152f]">Add to Home Screen</strong>.
            </p>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-2 text-xs">
          <span className="font-bold text-[#00152f] uppercase text-[10px]">How to install APK on Android:</span>
          <ol className="list-decimal pl-4 space-y-1 text-[#43474e] text-[11px]">
            <li>Tap the green <strong>Download dwps-portal-v1.0.apk</strong> button above.</li>
            <li>Once downloaded, open the file from your notifications or <strong>Downloads</strong> folder.</li>
            <li>If prompted by Android, tap <strong>Settings</strong> and allow <em>"Install unknown apps"</em> for your browser.</li>
            <li>Tap <strong>Install</strong> to add Disney World Public School to your apps!</li>
          </ol>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-[#f8fafc] text-[#00152f] rounded-xl text-xs font-bold border border-[#e2e8f0] hover:bg-[#eff4ff] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
