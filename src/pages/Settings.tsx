import React from 'react';
import { useUserSettings, useUpdateUserSettings } from '../hooks/useQueries';
import { 
  Palette, 
  Globe, 
  Bell, 
  Mail, 
  Moon, 
  Sun,
  Monitor,
  Check
} from 'lucide-react';

const Settings: React.FC = () => {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettingsMutation = useUpdateUserSettings();

  const handleThemeChange = async (theme: 'light' | 'dark') => {
    try {
      await updateSettingsMutation.mutateAsync({ theme });
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const handleLanguageChange = async (language: 'en' | 'uz' | 'ru') => {
    try {
      await updateSettingsMutation.mutateAsync({ language });
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const handleNotificationToggle = async (type: 'notifications' | 'emailUpdates', value: boolean) => {
    try {
      await updateSettingsMutation.mutateAsync({ [type]: value });
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Light theme for bright environments' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme for low-light environments' },
  ];

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'uz', label: 'O\'zbekcha', flag: '🇺🇿' },
    { value: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your preferences and account settings</p>
      </div>

      {/* Theme Settings */}
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
            <p className="text-sm text-gray-600">Customize how the app looks to you</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Theme</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = settings?.theme === theme.value;
              
              return (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value as 'light' | 'dark')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{theme.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-sm text-gray-600">{theme.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Language & Region</h2>
            <p className="text-sm text-gray-600">Choose your preferred language</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Display Language</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {languages.map((language) => {
              const isSelected = settings?.language === language.value;
              
              return (
                <button
                  key={language.value}
                  onClick={() => handleLanguageChange(language.value as 'en' | 'uz' | 'ru')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{language.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600">Manage how you receive notifications</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Get notified about new quizzes and results</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.notifications || false}
                onChange={(e) => handleNotificationToggle('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Email Updates</p>
                <p className="text-sm text-gray-600">Receive email notifications about important updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.emailUpdates || false}
                onChange={(e) => handleNotificationToggle('emailUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Monitor className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
            <p className="text-sm text-gray-600">Manage your data and privacy settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Download Your Data</p>
                <p className="text-sm text-gray-600">Get a copy of all your quiz data and results</p>
              </div>
              <div className="text-blue-600">
                Download
              </div>
            </div>
          </button>

          <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </div>
              <div className="text-red-600">
                Delete
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;