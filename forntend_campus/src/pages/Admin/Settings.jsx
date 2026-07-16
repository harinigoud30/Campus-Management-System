import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaCog, FaCheckCircle, FaSlidersH, FaServer } from 'react-icons/fa';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Settings = () => {
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Settings Form State
  const [settings, setSettings] = useState({
    campusName: '',
    shortName: '',
    academicYear: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    enableNotifications: true,
    maintenanceMode: false
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [api]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await api.updateSettings(settings);
      setSuccessMsg('System configuration settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          System Configurations
        </h1>
        <p className="text-xs text-slate-400">
          Customize campus global settings, maintenance protocols, notifications, and profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Form: Main details */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaCog className="text-indigo-500" /> Campus Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Campus Institutional Name"
              id="campusName"
              placeholder="Vanguard Technical Institute"
              value={settings.campusName}
              onChange={(e) => setSettings({ ...settings, campusName: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Acronym / Short Name"
                id="shortName"
                placeholder="VTI Campus"
                value={settings.shortName}
                onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                required
              />
              <InputField
                label="Active Academic Year"
                id="academicYear"
                placeholder="2026-27"
                value={settings.academicYear}
                onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Institutional Contact Email"
                id="contactEmail"
                type="email"
                placeholder="admin@vanguard.edu"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                required
              />
              <InputField
                label="Institutional Phone"
                id="contactPhone"
                placeholder="+1 (555) 987-6543"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                required
              />
            </div>

            <InputField
              label="Campus Address"
              id="address"
              type="textarea"
              placeholder="890 Innovation Boulevard, Cyber City"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              required
            />

            {successMsg && (
              <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <FaCheckCircle /> {successMsg}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" loading={saving}>
                Save Configurations
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side: Toggles / Info */}
        <div className="space-y-6">
          {/* Flags / Preferences */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaSlidersH className="text-indigo-500" /> Portal Toggles
            </h3>
            
            <div className="space-y-4">
              {/* Notification toggle */}
              <div className="flex justify-between items-center py-2.5">
                <div>
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">System Notifications</h4>
                  <p className="text-[10px] text-slate-400">Broadcast circular updates to student sockets.</p>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="rounded-sm border-slate-300 text-indigo-650 focus:ring-indigo-500/30 h-4.5 w-4.5"
                />
              </div>

              {/* Maintenance mode */}
              <div className="flex justify-between items-center py-2.5 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">Maintenance Mode</h4>
                  <p className="text-[10px] text-slate-400">Lock portals for general curriculum upgrades.</p>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded-sm border-slate-300 text-indigo-650 focus:ring-indigo-500/30 h-4.5 w-4.5"
                />
              </div>
            </div>
          </div>

          {/* Server Info */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaServer className="text-indigo-500" /> Platform Registry
            </h3>
            
            <div className="space-y-2 text-[10px] font-medium text-slate-400">
              <p className="flex justify-between">
                <span>Vite Bundler:</span>
                <strong className="text-slate-700 dark:text-slate-350">v6.0.0 (latest)</strong>
              </p>
              <p className="flex justify-between">
                <span>Styling Engine:</span>
                <strong className="text-slate-700 dark:text-slate-350">Tailwind CSS v4.0</strong>
              </p>
              <p className="flex justify-between">
                <span>Mock DB:</span>
                <strong className="text-slate-700 dark:text-slate-350">HTML5 LocalStorage</strong>
              </p>
              <p className="flex justify-between">
                <span>API Client:</span>
                <strong className="text-slate-700 dark:text-slate-350">Axios-Mock Adapter</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
