import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Eye, EyeOff, Loader2, Sparkles, Shield, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import { Skeleton } from '../components/Skeleton';
import { FormSkeleton } from '../components/Skeletons/FormSkeleton';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('+998 ')) {
      value = '+998 ' + value.replace(/^[^0-9]*/, '').replace(/\+?998 ?/, '');
    }
    let digits = value.replace(/[^0-9]/g, '');
    if (digits.startsWith('998')) digits = digits.slice(3);
    digits = digits.slice(0, 9);

    if (e.nativeEvent instanceof InputEvent && e.nativeEvent.inputType === 'deleteContentBackward') {
      setPhone(value);
      return;
    }

    let formatted = '+998 ';
    if (digits.length > 0) {
      formatted += '(' + digits.slice(0, 2);
    }
    if (digits.length >= 2) {
      formatted += ') ' + digits.slice(2, 5);
    }
    if (digits.length >= 5) {
      formatted += '-' + digits.slice(5, 7);
    }
    if (digits.length >= 7) {
      formatted += '-' + digits.slice(7, 9);
    }
    setPhone(formatted.trim());
  };

  const getRawPhone = (formatted: string) => {
    let digits = formatted.replace(/[^0-9]/g, '');
    if (digits.startsWith('998')) digits = digits.slice(3);
    return '+998' + digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ phone: getRawPhone(phone), password });
      toast.success('Muvaffaqiyatli kirildi! 🎉');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login yoki parol xato. Iltimos, qayta urinib ko\'ring.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Interaktiv testlar',
      description: 'Zamonaviy va qiziqarli test formatlari'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Xavfsiz platforma',
      description: 'Ma\'lumotlaringiz himoyalangan'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Tezkor natijalar',
      description: 'Darhol natijalarni ko\'ring'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Bilimlaringizni
                <span className="gradient-text block">sinab ko'ring! 🚀</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Zamonaviy test platformasi orqali o'z bilimlaringizni baholang va rivojlantiring
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-300"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Xush kelibsiz! 👋</h1>
            <p className="text-gray-600">Quiz tizimiga kirish</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tizimga kirish</h2>
              <p className="text-gray-600">Hisobingizga kiring va o'qishni davom eting</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 scale-in">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  📱 Telefon raqami
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="form-input"
                  placeholder="+998 (99) 123-45-67"
                  required
                  maxLength={19}
                  autoComplete="username"
                  name="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  🔒 Parol
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pr-12"
                    placeholder="Parolingizni kiriting"
                    required
                    autoComplete="current-password"
                    name="password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600">Eslab qolish</span>
                </label>
                <Link
                  to="/"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                >
                  Parolni unutdingizmi?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-4 rounded-2xl 
                         font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 
                         focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                         flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                         active:translate-y-0"
              >
                {isSubmitting ? (
                  <FormSkeleton />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Tizimga kirish
                  </>
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Hisobingiz yo'qmi?{' '}
                <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Ro'yxatdan o'ting
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-2">Ishonchli va xavfsiz platforma</p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                SSL himoyalangan
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Tezkor ishlaydi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;