import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Eye, Edit3, Info, Lock, Bell, Mail, Shield, Check, X } from 'lucide-react';
import SelectMenu from '../common/SelectMenu';

export default function SettingsPanel() {
  const { state, dispatch } = useApp();
  
  const [localRole, setLocalRole] = useState(state.role);
  const [localDarkMode, setLocalDarkMode] = useState(state.darkMode);
  const [localEmail, setLocalEmail] = useState(state.email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [weeklySummaries, setWeeklySummaries] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  
  const [localCurrency, setLocalCurrency] = useState('INR');
  const [localTimezone, setLocalTimezone] = useState('IST');

  const isAdmin = localRole === 'admin';

  const applyChanges = () => {
    const normalizedEmail = localEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
      setEmailError('Please enter a valid email address.');
      setIsEditingEmail(true);
      return;
    }

    if (localRole !== state.role) dispatch({ type: 'SET_ROLE', payload: localRole });
    if (localDarkMode !== state.darkMode) dispatch({ type: 'TOGGLE_DARK_MODE' });
    if (normalizedEmail !== state.email) dispatch({ type: 'SET_EMAIL', payload: normalizedEmail });

    setLocalEmail(normalizedEmail);
    setIsEditingEmail(false);
    setEmailError('');
    dispatch({ type: 'SET_TOAST', payload: { message: 'Settings profile successfully updated.', type: 'success' } });
  };

  const cancelChanges = () => {
    setLocalRole(state.role);
    setLocalDarkMode(state.darkMode);
    setLocalEmail(state.email);
    setIsEditingEmail(false);
    setEmailError('');
  };

  const handleEmailConfirm = () => {
    const normalizedEmail = localEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setLocalEmail(normalizedEmail);
    setEmailError('');
    setIsEditingEmail(false);
  };

  const handleEmailCancel = () => {
    setLocalEmail(state.email);
    setEmailError('');
    setIsEditingEmail(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-display">Platform Settings</h1>
        <p className="text-sub mt-2 leading-relaxed">
          Manage your workspace identity, visual themes, and access levels. These settings demonstrate Role-Based Access Control (RBAC) behavior.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Role Management */}
        <div className="col-span-12 lg:col-span-8 bg-card rounded-xl p-8 shadow-ambient relative overflow-hidden group animate-enter stagger-1">
          <div className="absolute top-0 right-0 p-8 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
            <Shield size={120} />
          </div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-8 bg-emerald rounded-full" />
            <h2 className="font-headline text-2xl font-bold tracking-tight text-display">Identity & Role Management</h2>
          </div>

          <div className="bg-section rounded-xl p-6 mb-6 border border-ghost">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg text-main mb-1">Current Permission Level</h3>
                <p className="text-sm text-sub">Active role determines available features and data mutability.</p>
              </div>
              <span className="px-3 py-1 bg-emerald/10 text-emerald text-[10px] font-black rounded-full uppercase tracking-[0.15em]">
                Live: {state.role}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Viewer */}
              <button
                onClick={() => setLocalRole('viewer')}
                className={`p-5 rounded-xl border-2 transition-all text-left ${
                  !isAdmin ? 'border-ink bg-ink/5' : 'border-transparent bg-card hover:bg-section'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${!isAdmin ? 'bg-ink text-white' : 'bg-inset text-display'}`}>
                    <Eye size={20} />
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !isAdmin ? 'border-ink' : 'border-outline-variant'
                  }`}>
                    {!isAdmin && <div className="w-2 h-2 rounded-full bg-ink" />}
                  </div>
                </div>
                <p className="font-bold text-display mb-1">Viewer Mode</p>
                <p className="text-xs text-sub">Read-only access. View all charts and dashboards but cannot add or edit transactions.</p>
              </button>

              {/* Admin */}
              <button
                onClick={() => setLocalRole('admin')}
                className={`p-5 rounded-xl border-2 transition-all text-left ${
                  isAdmin ? 'border-ink bg-ink/5' : 'border-transparent bg-card hover:bg-section'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${isAdmin ? 'bg-ink text-white' : 'bg-inset text-display'}`}>
                    <Edit3 size={20} />
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isAdmin ? 'border-ink' : 'border-outline-variant'
                  }`}>
                    {isAdmin && <div className="w-2 h-2 rounded-full bg-ink" />}
                  </div>
                </div>
                <p className="font-bold text-display mb-1">Admin Mode</p>
                <p className="text-xs text-sub">Full read/write access. Permissions include adding, editing, and deleting financial records.</p>
              </button>
            </div>
          </div>

          <div className="bg-coral-container/20 p-4 rounded-lg flex gap-3 items-center">
            <Info size={18} className="text-coral shrink-0" />
            <p className="text-sm text-main">
              <strong>RBAC Notice:</strong> Switching to 'Viewer' will immediately disable the 'New Transaction' CTA in your sidebar.
            </p>
          </div>
        </div>

        {/* Theme & Visual */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Theme Selection */}
          <div className="bg-card rounded-xl p-8 shadow-ambient animate-enter stagger-2">
            <h2 className="font-headline text-xl font-bold tracking-tight text-display mb-6">Visual Atelier</h2>
            <div className="space-y-3">
              <button
                onClick={() => setLocalDarkMode(false)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-500 ease-out ${
                  !localDarkMode ? 'bg-section' : 'bg-section/50 opacity-60 hover:opacity-90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun size={18} className="text-main" />
                  <div className="text-left">
                    <p className="font-bold text-sm text-main">Light Mode</p>
                    {!localDarkMode && <p className="label-micro text-[10px]">Current Selection</p>}
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  !localDarkMode ? 'border-ink bg-ink ring-2 ring-ink/20 ring-offset-2' : 'border-outline-variant'}`}
                  style={!localDarkMode ? { ringOffsetColor: 'var(--bg-card)' } : {}}
                />
              </button>
              <button
                onClick={() => setLocalDarkMode(true)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-500 ease-out ${
                  localDarkMode ? 'bg-section' : 'bg-section/50 opacity-60 hover:opacity-90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon size={18} className="text-main" />
                  <div className="text-left">
                    <p className="font-bold text-sm text-main">Dark Mode</p>
                    {localDarkMode && <p className="label-micro text-[10px]">Current Selection</p>}
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  localDarkMode ? 'border-ink bg-ink ring-2 ring-ink/20 ring-offset-2' : 'border-outline-variant'}`}
                />
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-card rounded-xl p-8 shadow-ambient flex-1 flex flex-col justify-center animate-enter stagger-3">
            <h2 className="font-headline text-lg font-bold tracking-tight text-display mb-6">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-ghost">
                <p className="text-sm font-medium text-main">Weekly Summaries</p>
                <div 
                  onClick={() => setWeeklySummaries(!weeklySummaries)}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shadow-inner ${weeklySummaries ? 'bg-emerald' : 'bg-inset'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-500 ease-out ${weeklySummaries ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-ghost">
                <p className="text-sm font-medium text-main">Product Updates</p>
                <div 
                  onClick={() => setProductUpdates(!productUpdates)}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shadow-inner ${productUpdates ? 'bg-emerald' : 'bg-inset'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-500 ease-out ${productUpdates ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Preferences */}
        <div className="col-span-12 bg-card rounded-xl p-8 shadow-ambient animate-enter stagger-4">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-1/3 md:-mt-4">
              <h2 className="font-headline text-2xl font-bold tracking-tight text-display mb-3">Global Preferences</h2>
              <p className="text-sm text-sub mb-6">Configure regional defaults and communication channels.</p>
              <div className="flex items-center justify-between gap-3 p-4 bg-card rounded-lg border border-ghost shadow-sm mb-3 group">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <Mail size={18} className="text-emerald shrink-0" />
                  <div className="min-w-0 w-full">
                    {isEditingEmail ? (
                      <input
                        type="email"
                        value={localEmail}
                        onChange={(e) => {
                          setLocalEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleEmailConfirm();
                          }
                          if (e.key === 'Escape') {
                            e.preventDefault();
                            handleEmailCancel();
                          }
                        }}
                        autoFocus
                        className="w-full text-[15px] font-bold tracking-tight text-display bg-transparent border-none outline-none focus:ring-0 p-0"
                      />
                    ) : (
                      <p className="text-[15px] font-bold tracking-tight text-display truncate" title={localEmail}>{localEmail}</p>
                    )}
                    <p className="text-sm text-muted mt-1">Primary contact</p>
                    {!!emailError && <p className="text-xs text-coral mt-2 font-semibold">{emailError}</p>}
                  </div>
                </div>

                {!isEditingEmail ? (
                  <button
                    onClick={() => {
                      setIsEditingEmail(true);
                      setEmailError('');
                    }}
                    className="w-9 h-9 rounded-lg bg-section flex items-center justify-center text-muted hover:text-display transition-colors shrink-0"
                    aria-label="Edit email"
                    title="Edit email"
                  >
                    <Edit3 size={16} />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleEmailConfirm}
                      className="w-8 h-8 rounded-lg gradient-cta text-white inline-flex items-center justify-center"
                      aria-label="Confirm email edit"
                      title="Confirm"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={handleEmailCancel}
                      className="w-8 h-8 rounded-lg bg-section flex items-center justify-center text-muted hover:text-display transition-colors"
                      aria-label="Cancel email edit"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="relative z-20">
                  <label className="label-micro block mb-2 uppercase text-[10px] font-bold text-muted tracking-widest">Currency Display</label>
                  <SelectMenu
                    value={localCurrency}
                    onChange={setLocalCurrency}
                    options={[
                      { value: 'INR', label: 'INR - Indian Rupee (₹)' },
                      { value: 'USD', label: 'USD - United States Dollar ($)' },
                      { value: 'EUR', label: 'EUR - Euro (€)' }
                    ]}
                    placeholder="Select Currency"
                    className="w-full bg-card border border-ghost rounded-xl text-sm py-3 px-4 shadow-ambient focus:ring-2 focus:ring-ink-soft/20 text-display font-semibold outline-none"
                  />
                </div>
                <div className="relative z-10">
                  <label className="label-micro block mb-2 uppercase text-[10px] font-bold text-muted tracking-widest">Timezone</label>
                  <SelectMenu
                    value={localTimezone}
                    onChange={setLocalTimezone}
                    options={[
                      { value: 'IST', label: '(GMT+05:30) India' },
                      { value: 'EST', label: '(GMT-05:00) USA' },
                      { value: 'GMT', label: '(GMT+00:00) London' }
                    ]}
                    placeholder="Select Timezone"
                    className="w-full bg-card border border-ghost rounded-xl text-sm py-3 px-4 shadow-ambient focus:ring-2 focus:ring-ink-soft/20 text-display font-semibold outline-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="label-micro block mb-2 uppercase text-[10px] font-bold text-muted tracking-widest invisible">Alignment</label>
                  <div className="flex items-center justify-between p-3 pl-0 md:pl-3">
                    <div className="flex items-center gap-4">
                      <Lock size={18} className="text-display" />
                      <p className="text-[15px] font-bold text-display tracking-tight">Two-Factor Auth</p>
                    </div>
                    <div 
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shadow-inner ${twoFactor ? 'bg-emerald' : 'bg-inset'}`}
                    >
                      <div className={`absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-500 ease-out ${twoFactor ? 'right-[2px]' : 'left-[2px]'}`} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label-micro block mb-2 uppercase text-[10px] font-bold text-muted tracking-widest invisible">Alignment</label>
                  <div className="flex items-center justify-between p-3 pl-0 md:pl-3">
                    <div className="flex items-center gap-4">
                      <Bell size={18} className="text-display" />
                      <p className="text-[15px] font-bold text-display tracking-tight">Risk Alerts</p>
                    </div>
                    <div 
                      onClick={() => setRiskAlerts(!riskAlerts)}
                      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shadow-inner ${riskAlerts ? 'bg-emerald' : 'bg-inset'}`}
                    >
                      <div className={`absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-500 ease-out ${riskAlerts ? 'right-[2px]' : 'left-[2px]'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button 
          onClick={cancelChanges}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-display hover:bg-section transition-colors"
        >
          Cancel Changes
        </button>
        <button 
          onClick={applyChanges}
          className="px-8 py-2.5 gradient-cta text-white rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] transition-transform"
          style={{ boxShadow: '0 4px 14px rgba(0,21,62,0.2)' }}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}
