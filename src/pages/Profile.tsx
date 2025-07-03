import React, { useState } from 'react';
import { useProfile, useUpdateProfile, useChangePassword } from '../hooks/useQueries';
import {
  User,
  Mail,
  Lock,
  Save,
  Camera,
  Eye,
  EyeOff,
  Phone,
  Calendar,
  MapPin,
  Award,
  Trophy,
  Target,
  Zap,
  Star,
  Shield,
  Edit3
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ChangePasswordData } from '../types';
import { Skeleton } from '../components/Skeleton';
import { CardSkeleton } from '../components/Skeletons/CardSkeleton';
import { ProfileHeaderSkeleton } from '../components/Skeletons/ProfileHeaderSkeleton';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || ''
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm<ChangePasswordData>();

  const onProfileSubmit = async (data: any) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordData) => {
    if (data.newPassword !== data.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync(data);
      alert('Password changed successfully!');
      resetPasswordForm();
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height="h-24" />
          ))}
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'profile',
      label: 'Profil ma\'lumotlari',
      icon: User,
      description: 'Shaxsiy ma\'lumotlar'
    },
    {
      id: 'password',
      label: 'Parolni o\'zgartirish',
      icon: Lock,
      description: 'Xavfsizlik sozlamalari'
    },
    {
      id: 'achievements',
      label: 'Yutuqlar',
      icon: Trophy,
      description: 'Erishgan natijalar'
    }
  ];

  const achievements = [
    { id: 1, title: 'First Quiz', description: 'Birinchi testni yakunlash', icon: '🎯', unlocked: true, date: '2024-01-15' },
    { id: 2, title: 'Speed Runner', description: '5 daqiqada test yakunlash', icon: '⚡', unlocked: true, date: '2024-01-20' },
    { id: 3, title: 'Perfect Score', description: '100% natija olish', icon: '💯', unlocked: false, date: null },
    { id: 4, title: 'Streak Master', description: '7 kun ketma-ket test ishlash', icon: '🔥', unlocked: true, date: '2024-02-01' },
    { id: 5, title: 'Knowledge Seeker', description: '50 ta test yakunlash', icon: '📚', unlocked: false, date: null },
    { id: 6, title: 'Time Master', description: 'Vaqtdan oldin yakunlash', icon: '⏰', unlocked: true, date: '2024-01-25' },
  ];

  const stats = [
    { label: 'Ishlangan testlar', value: '12', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { label: 'O\'rtacha natija', value: '85%', icon: Award, color: 'from-green-500 to-emerald-500' },
    { label: 'Eng yaxshi natija', value: '98%', icon: Star, color: 'from-yellow-500 to-orange-500' },
    { label: 'Streak', value: '7 kun', icon: Zap, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 fade-in">
        {/* Enhanced Header */}
        <div className="card p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10 flex items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
                <User className="w-16 h-16 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-2xl shadow-lg 
                               flex items-center justify-center hover:bg-gray-50 transition-all duration-200 
                               hover:scale-110 group">
                <Camera className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
              </button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-xl text-indigo-100 mb-4 capitalize">
                {profile?.role === 'STUDENT' ? 'Talaba' : profile?.role}
              </p>
              <div className="flex items-center gap-6 text-indigo-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>{profile?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>A'zo: {new Date(profile?.createdAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card-interactive p-6 bg-gradient-to-br from-white to-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl 
                                 flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Tabs */}
        <div className="dashboard-card">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div>{tab.label}</div>
                      <div className="text-xs text-gray-400">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-group">
                    <label className="form-label">
                      <User className="w-4 h-4 inline mr-2" />
                      Ism
                    </label>
                    <input
                      {...registerProfile('firstName', { required: 'Ism kiritish majburiy' })}
                      className="form-input"
                      placeholder="Ismingizni kiriting"
                    />
                    {profileErrors.firstName && (
                      <p className="text-red-500 text-sm mt-2">{profileErrors.firstName.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User className="w-4 h-4 inline mr-2" />
                      Familiya
                    </label>
                    <input
                      {...registerProfile('lastName', { required: 'Familiya kiritish majburiy' })}
                      className="form-input"
                      placeholder="Familiyangizni kiriting"
                    />
                    {profileErrors.lastName && (
                      <p className="text-red-500 text-sm mt-2">{profileErrors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Elektron pochta
                  </label>
                  <input
                    {...registerProfile('email', {
                      required: 'Email kiritish majburiy',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Noto\'g\'ri email format'
                      }
                    })}
                    className="form-input"
                    placeholder="Email manzilingizni kiriting"
                  />
                  {profileErrors.email && (
                    <p className="text-red-500 text-sm mt-2">{profileErrors.email.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? (
                      <div className="loading-spinner w-4 h-4"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    O'zgarishlarni saqlash
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-8">
                <div className="form-group">
                  <label className="form-label">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Joriy parol
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('currentPassword', { required: 'Joriy parol kiritish majburiy' })}
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="form-input pr-12"
                      placeholder="Joriy parolingizni kiriting"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-2">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Yangi parol
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('newPassword', {
                        required: 'Yangi parol kiritish majburiy',
                        minLength: { value: 6, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' }
                      })}
                      type={showNewPassword ? 'text' : 'password'}
                      className="form-input pr-12"
                      placeholder="Yangi parolingizni kiriting"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-2">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Yangi parolni tasdiqlang
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('confirmPassword', { required: 'Parolni tasdiqlash majburiy' })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-input pr-12"
                      placeholder="Yangi parolni tasdiqlang"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Parol uchun talablar:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Kamida 6 ta belgidan iborat bo'lishi kerak</li>
                        <li>• Harflar va raqamlar bo'lishi kerak</li>
                        <li>• Oddiy parollardan foydalanmang</li>
                        <li>• Boshqa saytlardagi parollarni takrorlamang</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {changePasswordMutation.isPending ? (
                      <div className="loading-spinner w-4 h-4"></div>
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    Parolni o'zgartirish
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Sizning yutuqlaringiz 🏆</h3>
                  <p className="text-gray-600">Test ishlash jarayonida erishgan natijalaringiz</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`card p-6 text-center transition-all duration-300 hover:scale-105 ${achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                    >
                      <div className={`text-4xl mb-4 ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                      {achievement.unlocked ? (
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 
                                         rounded-full text-xs font-semibold border border-green-200">
                            <Trophy className="w-3 h-3" />
                            Qo'lga kiritildi
                          </span>
                          {achievement.date && (
                            <p className="text-xs text-gray-500">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 
                                       rounded-full text-xs font-semibold">
                          <Lock className="w-3 h-3" />
                          Qulflanghan
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 
                                rounded-2xl border border-indigo-200">
                    <Trophy className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-900">
                      {achievements.filter(a => a.unlocked).length} / {achievements.length} yutuq qo'lga kiritildi
                    </span>
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

export default Profile;