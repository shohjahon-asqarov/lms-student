import React, { useState } from 'react';
import { useUserSettings, useUpdateUserSettings } from '../hooks/useQueries';
import {
  Palette,
  Globe,
  Bell,
  Mail,
  Moon,
  Sun,
  Monitor,
  Check,
  Shield,
  Download,
  Trash2,
  Volume2,
  VolumeX,
  Smartphone,
  Laptop,
  Settings as SettingsIcon,
  Lock,
  Eye,
  Database,
  HelpCircle
} from 'lucide-react';

const Settings: React.FC = () => {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettingsMutation = useUpdateUserSettings();
  const [activeSection, setActiveSection] = useState('appearance');

  const handleThemeChange = async (theme: 'light' | 'dark') => {
    try {
      await updateSettingsMutation.mutateAsync({ theme });
      document.documentElement.setAttribute('data-theme', theme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const handleLanguageChange = async (language: 'en' | 'uz' | 'ru') => {
    try {
      await updateSettingsMutation.mutateAsync({ language });
    } catch (error) {
      console.error('Error updating language settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl 
                        flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <SettingsIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sozlamalar yuklanmoqda...</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sections = [
    {
      id: 'appearance',
      label: 'Ko\'rinish',
      icon: Palette,
      description: 'Mavzu va dizayn sozlamalari'
    },
    {
      id: 'language',
      label: 'Til va mintaqa',
      icon: Globe,
      description: 'Til va joylashuv sozlamalari'
    },
    {
      id: 'privacy',
      label: 'Maxfiylik',
      icon: Shield,
      description: 'Ma\'lumot va xavfsizlik sozlamalari'
    }
  ];

  const themes = [
    {
      value: 'light',
      label: 'Yorug\'',
      icon: Sun,
      description: 'Yorug\' muhit uchun',
      preview: 'bg-white border-gray-200'
    },
    {
      value: 'dark',
      label: 'Qorong\'u',
      icon: Moon,
      description: 'Qorong\'u muhit uchun',
      preview: 'bg-gray-900 border-gray-700'
    },
    {
      value: 'auto',
      label: 'Avtomatik',
      icon: Monitor,
      description: 'Tizim sozlamasiga mos',
      preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400'
    }
  ];

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸', description: 'English (US)' },
    { value: 'uz', label: 'O\'zbekcha', flag: '🇺🇿', description: 'O\'zbek tili' },
    { value: 'ru', label: 'Русский', flag: '🇷🇺', description: 'Русский язык' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 fade-in">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 
                        rounded-3xl shadow-2xl mb-6 hover:scale-110 transition-transform duration-300">
            <SettingsIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 gradient-text mb-4">Sozlamalar ⚙️</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ilovangizni o'zingizga moslang va eng yaxshi tajribaga ega bo'ling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="dashboard-card p-6">
              <h3 className="font-bold text-gray-900 mb-6">Sozlamalar bo'limlari</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 text-left ${activeSection === section.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-semibold text-sm">{section.label}</div>
                        <div className={`text-xs ${activeSection === section.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                          {section.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl 
                                flex items-center justify-center shadow-lg">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Ko'rinish</h2>
                    <p className="text-gray-600">Ilovaning ko'rinishini va mavzusini moslang</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Mavzu tanlash</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {themes.map((theme) => {
                        const Icon = theme.icon;
                        const isSelected = settings?.theme === theme.value;

                        return (
                          <button
                            key={theme.value}
                            onClick={() => handleThemeChange(theme.value as 'light' | 'dark')}
                            className={`card p-6 text-center transition-all duration-300 hover:scale-105 ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                              }`}
                          >
                            <div className={`w-16 h-16 ${theme.preview} rounded-2xl mx-auto mb-4 border-2 
                                          flex items-center justify-center shadow-lg`}>
                              <Icon className={`w-8 h-8 ${theme.value === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">{theme.label}</span>
                              {isSelected && <Check className="w-5 h-5 text-indigo-600" />}
                            </div>
                            <p className="text-sm text-gray-600">{theme.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-start gap-3">
                      <Eye className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Ko'rinish haqida</h4>
                        <p className="text-sm text-blue-700">
                          Mavzu tanlash orqali ilovani o'z didingizga moslashtirishingiz mumkin.
                          Qorong'u mavzu ko'zlaringizni himoya qiladi va batareya quvvatini tejaydi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Language Settings */}
            {activeSection === 'language' && (
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl 
                                flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Til va mintaqa</h2>
                    <p className="text-gray-600">Tilni va mintaqaviy sozlamalarni tanlang</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Ko'rsatiladigan til</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {languages.map((language) => {
                        const isSelected = settings?.language === language.value;

                        return (
                          <button
                            key={language.value}
                            onClick={() => handleLanguageChange(language.value as 'en' | 'uz' | 'ru')}
                            className={`card p-6 text-center transition-all duration-300 hover:scale-105 ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                              }`}
                          >
                            <div className="text-4xl mb-4">{language.flag}</div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">{language.label}</span>
                              {isSelected && <Check className="w-5 h-5 text-indigo-600" />}
                            </div>
                            <p className="text-sm text-gray-600">{language.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="flex items-start gap-3">
                      <Globe className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Til haqida</h4>
                        <p className="text-sm text-green-700">
                          Tilni o'zgartirish barcha interfeys elementlarini tanlangan tilga o'tkazadi.
                          O'zgarishlar darhol qo'llaniladi va qayta yuklash talab qilinmaydi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {/* Removed notification settings section */}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl 
                                flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Maxfiylik va xavfsizlik</h2>
                    <p className="text-gray-600">Ma'lumotlaringiz va xavfsizlik sozlamalari</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-6">
                    <button className="w-full text-left p-6 border-2 border-blue-200 rounded-2xl hover:bg-blue-50 
                                     transition-all duration-200 hover:scale-[1.02] group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl 
                                        flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <Download className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Ma'lumotlarni yuklab olish</p>
                            <p className="text-sm text-gray-600">Barcha test ma'lumotlaringiz va natijalaringizni yuklab oling</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-semibold">
                          Yuklab olish
                        </div>
                      </div>
                    </button>

                    <button className="w-full text-left p-6 border-2 border-green-200 rounded-2xl hover:bg-green-50 
                                     transition-all duration-200 hover:scale-[1.02] group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl 
                                        flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <Database className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Ma'lumotlar arxivi</p>
                            <p className="text-sm text-gray-600">Eski ma'lumotlarni arxivlash va saqlash</p>
                          </div>
                        </div>
                        <div className="text-green-600 font-semibold">
                          Boshqarish
                        </div>
                      </div>
                    </button>

                    <button className="w-full text-left p-6 border-2 border-yellow-200 rounded-2xl hover:bg-yellow-50 
                                     transition-all duration-200 hover:scale-[1.02] group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl 
                                        flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <Lock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Maxfiylik sozlamalari</p>
                            <p className="text-sm text-gray-600">Kim sizning ma'lumotlaringizni ko'ra olishini boshqaring</p>
                          </div>
                        </div>
                        <div className="text-yellow-600 font-semibold">
                          Sozlash
                        </div>
                      </div>
                    </button>

                    <button className="w-full text-left p-6 border-2 border-red-200 rounded-2xl hover:bg-red-50 
                                     transition-all duration-200 hover:scale-[1.02] group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl 
                                        flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <Trash2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-red-900">Akkauntni o'chirish</p>
                            <p className="text-sm text-red-600">Akkauntingiz va barcha ma'lumotlarni butunlay o'chirish</p>
                          </div>
                        </div>
                        <div className="text-red-600 font-semibold">
                          O'chirish
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="card p-6 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-6 h-6 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Muhim eslatma</h4>
                        <p className="text-sm text-red-700">
                          Akkauntni o'chirish qaytarib bo'lmaydigan amal hisoblanadi. Barcha ma'lumotlaringiz,
                          test natijalari va yutuqlaringiz butunlay yo'qoladi. Iltimos, ehtiyot bo'ling.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;