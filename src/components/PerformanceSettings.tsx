import React, { useState, useEffect } from 'react';
import { Settings, Monitor, Zap } from 'lucide-react';

interface PerformanceSettings {
  quality: 'low' | 'medium' | 'high';
  pauseWhenHidden: boolean;
  enableLazyLoading: boolean;
}

export function PerformanceSettingsModal({ 
  isOpen, 
  onClose, 
  onSettingsChange 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: PerformanceSettings) => void;
}) {
  const [settings, setSettings] = useState<PerformanceSettings>({
    quality: 'medium',
    pauseWhenHidden: true,
    enableLazyLoading: true
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('performanceSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [isOpen]);

  const handleSettingChange = (key: keyof PerformanceSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('performanceSettings', JSON.stringify(newSettings));
    onSettingsChange(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-teal-600 mr-2" />
              <h2 className="text-xl font-semibold">Performance Settings</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Quality Settings */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Monitor className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">3D Quality</h3>
                  <p className="text-sm text-gray-500">Adjust rendering quality vs performance</p>
                </div>
              </div>
              <select
                value={settings.quality}
                onChange={(e) => handleSettingChange('quality', e.target.value)}
                className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Auto-pause when hidden */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <h3 className="font-medium">Auto-pause</h3>
                  <p className="text-sm text-gray-500">Pause 3D rendering when not visible</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('pauseWhenHidden', !settings.pauseWhenHidden)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.pauseWhenHidden ? 'bg-teal-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.pauseWhenHidden ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Lazy Loading */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <h3 className="font-medium">Lazy Loading</h3>
                  <p className="text-sm text-gray-500">Load 3D content only when needed</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('enableLazyLoading', !settings.enableLazyLoading)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.enableLazyLoading ? 'bg-teal-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.enableLazyLoading ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              <p className="mb-2"><strong>Performance Tips:</strong></p>
              <ul className="space-y-1 text-xs">
                <li>• Use "Low" quality on older devices for better performance</li>
                <li>• Enable auto-pause to save CPU when scrolling</li>
                <li>• Lazy loading reduces initial page load time</li>
                <li>• Medium quality provides best balance for most users</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PerformanceSettingsButton({ 
  onOpenSettings 
}: { 
  onOpenSettings: () => void;
}) {
  return (
    <button
      onClick={onOpenSettings}
      className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
      title="Performance Settings"
    >
      <Settings className="h-5 w-5" />
    </button>
  );
}