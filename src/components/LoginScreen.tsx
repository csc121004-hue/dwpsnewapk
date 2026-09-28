import React, { useState } from 'react';

export type UserRole = 'parent' | 'admin';

interface LoginScreenProps {
  onLogin: (role: UserRole, userDetails: { name: string; title: string; avatar: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('parent');

  // Parent form fields
  const [parentIdentifier, setParentIdentifier] = useState('+91 98112 04182');
  const [parentPin, setParentPin] = useState('••••••');

  // Admin form fields
  const [adminUsername, setAdminUsername] = useState('principal@disneyworldps.org');
  const [adminPassword, setAdminPassword] = useState('••••••••');

  const [isLoading, setIsLoading] = useState(false);

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('parent', {
        name: 'Mr. R. K. Sharma (Parent)',
        title: 'Parent of Aarav Sharma (Grade VI-B)',
        avatar: 'AS',
      });
    }, 400);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('admin', {
        name: 'Mr. Rohit Choudhary',
        title: 'Director Principal • Disney World Public School',
        avatar: 'RC',
      });
    }, 400);
  };

  const handleQuickDemoParent = (studentName: string, grade: string, avatar: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('parent', {
        name: `Parent of ${studentName}`,
        title: `${grade} • Disney World Public School`,
        avatar,
      });
    }, 300);
  };

  const handleQuickDemoAdmin = (name: string, title: string, avatar: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('admin', {
        name,
        title,
        avatar,
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00152f] via-[#001a3a] to-[#04244a] flex flex-col justify-between p-4 sm:p-6 font-['Outfit'] select-none">
      {/* Top Ambient Light */}
      <div className="w-full max-w-md mx-auto pt-4 sm:pt-8 flex flex-col items-center text-center">
        {/* School Crest Logo */}
        <div className="relative mb-3 group">
          <div className="w-24 h-28 sm:w-28 sm:h-32 flex items-center justify-center p-1 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-105">
            <img
              src="/disney-world-logo.svg"
              alt="Disney World Public School Crest"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Disney World Public School
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[#fde68a] mt-1 tracking-wide">
          Knowledge is Our Magic • CBSE Affiliated
        </p>
        <span className="mt-2 inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#0f2a4a] text-[#b0c8f0] border border-[#304869]">
          Institutional Portal • Academic Session 2024-25
        </span>
      </div>

      {/* Main Authentication Container */}
      <div className="w-full max-w-md mx-auto my-6 bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#e2e8f0]/80">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-[#00152f]">Portal Authentication</h2>
          <p className="text-xs text-[#74777f]">Select your portal role to sign in</p>
        </div>

        {/* Portal Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#eff4ff] rounded-2xl border border-[#dce9ff] mb-5">
          <button
            type="button"
            onClick={() => setActiveRoleTab('parent')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeRoleTab === 'parent'
                ? 'bg-[#00152f] text-white shadow-md'
                : 'text-[#43474e] hover:text-[#00152f]'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">family_restroom</span>
            <span>Parent Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoleTab('admin')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeRoleTab === 'admin'
                ? 'bg-[#9b4500] text-white shadow-md'
                : 'text-[#43474e] hover:text-[#00152f]'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">admin_panel_settings</span>
            <span>School Admin Login</span>
          </button>
        </div>

        {/* PARENT LOGIN FORM */}
        {activeRoleTab === 'parent' && (
          <form onSubmit={handleParentSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#00152f] uppercase tracking-wider">
                  Parent Mobile / Admission No.
                </label>
                <span className="text-[10px] text-[#74777f]">Student Ward</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#74777f] material-symbols-outlined text-[20px]">
                  smartphone
                </span>
                <input
                  type="text"
                  required
                  value={parentIdentifier}
                  onChange={(e) => setParentIdentifier(e.target.value)}
                  placeholder="e.g. +91 98112 04182 or DWPS-2024-0418"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#e2e8f0] text-xs sm:text-sm font-semibold text-[#00152f] bg-[#f8fafc] focus:bg-white focus:outline-hidden focus:border-[#00152f] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#00152f] uppercase tracking-wider">
                  Parent Security PIN / Password
                </label>
                <span className="text-[10px] text-[#9b4500] font-semibold cursor-pointer hover:underline">
                  Forgot PIN?
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#74777f] material-symbols-outlined text-[20px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={parentPin}
                  onChange={(e) => setParentPin(e.target.value)}
                  placeholder="Enter 6-digit security PIN"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#e2e8f0] text-xs sm:text-sm font-semibold text-[#00152f] bg-[#f8fafc] focus:bg-white focus:outline-hidden focus:border-[#00152f] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00152f] hover:bg-[#0f2a4a] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              <span>{isLoading ? 'Authorizing Parent Portal...' : 'Login as Parent'}</span>
            </button>

            {/* Quick Demo Parent Accounts */}
            <div className="pt-3 border-t border-[#e2e8f0] space-y-2">
              <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider block text-center">
                1-Tap Demo Parent Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoParent('Aarav Sharma', 'Grade VI-B', 'AS')}
                  className="p-2.5 rounded-xl bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#fde68a] text-left transition-all active:scale-95"
                >
                  <p className="text-xs font-bold text-[#00152f]">Aarav Sharma</p>
                  <p className="text-[10px] text-[#9b4500] font-semibold">Grade VI-B • Parent</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoParent('Dhruv Sharma', 'Grade IX-A', 'DS')}
                  className="p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] border border-[#dce9ff] text-left transition-all active:scale-95"
                >
                  <p className="text-xs font-bold text-[#00152f]">Dhruv Sharma</p>
                  <p className="text-[10px] text-[#00152f] font-semibold">Grade IX-A • Parent</p>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SCHOOL ADMIN LOGIN FORM */}
        {activeRoleTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#00152f] uppercase tracking-wider">
                  School Admin Email / Staff ID
                </label>
                <span className="text-[10px] text-[#10b981] font-bold">Authorized Staff</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#74777f] material-symbols-outlined text-[20px]">
                  badge
                </span>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="e.g. principal@disneyworldps.org"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#e2e8f0] text-xs sm:text-sm font-semibold text-[#00152f] bg-[#f8fafc] focus:bg-white focus:outline-hidden focus:border-[#00152f] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#00152f] uppercase tracking-wider">
                  Admin Passkey / Password
                </label>
                <span className="text-[10px] text-[#74777f]">Encrypted 256-Bit</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#74777f] material-symbols-outlined text-[20px]">
                  key
                </span>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter administrative credentials"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#e2e8f0] text-xs sm:text-sm font-semibold text-[#00152f] bg-[#f8fafc] focus:bg-white focus:outline-hidden focus:border-[#00152f] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#9b4500] hover:bg-[#7e3800] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span>{isLoading ? 'Verifying Admin Credentials...' : 'Login as School Admin'}</span>
            </button>

            {/* Quick Demo School Admin Accounts */}
            <div className="pt-3 border-t border-[#e2e8f0] space-y-2">
              <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider block text-center">
                1-Tap Demo School Admin Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoAdmin(
                      'Mr. Rohit Choudhary',
                      'Director Principal • Disney World Public School',
                      'RC'
                    )
                  }
                  className="p-2.5 rounded-xl bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#fde68a] text-left transition-all active:scale-95"
                >
                  <p className="text-xs font-bold text-[#00152f]">Mr. Rohit Choudhary</p>
                  <p className="text-[10px] text-[#9b4500] font-semibold">Director Principal</p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoAdmin(
                      'Mrs. Shalini Verma',
                      'Class Teacher (VI-B) & Head of Science',
                      'SV'
                    )
                  }
                  className="p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] border border-[#dce9ff] text-left transition-all active:scale-95"
                >
                  <p className="text-xs font-bold text-[#00152f]">Mrs. Shalini Verma</p>
                  <p className="text-[10px] text-[#00152f] font-semibold">Faculty / Homeroom</p>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md mx-auto text-center space-y-1 text-xs text-[#b0c8f0]/80 pb-2">
        <p className="font-semibold text-white/90">
          Disney World Public School • CBSE Affiliated
        </p>
        <p className="text-[11px] text-[#b0c8f0]">
          Strict Role Separation: Parent and Administrator interfaces operate on dedicated secure partitions.
        </p>
      </div>
    </div>
  );
};
