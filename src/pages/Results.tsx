import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  CheckCircle,
  XCircle,
  Award,
  ArrowLeft,
  BarChart3,
  Send,
  Trophy,
  Target,
  Clock,
  Brain,
  Star,
  Zap,
  TrendingUp,
  Share2,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { QuizFinishResponse } from '../types';
import { sendTelegramResult } from '../utils/telegram';
import { toast } from 'react-toastify';

function getScoreColor(percentage: number) {
  if (percentage >= 90) return 'text-emerald-600';
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 70) return 'text-blue-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreBgColor(percentage: number) {
  if (percentage >= 90) return 'bg-emerald-100 border-emerald-200';
  if (percentage >= 80) return 'bg-green-100 border-green-200';
  if (percentage >= 70) return 'bg-blue-100 border-blue-200';
  if (percentage >= 60) return 'bg-yellow-100 border-yellow-200';
  return 'bg-red-100 border-red-200';
}

function getPerformanceLabel(percentage: number) {
  if (percentage >= 90) return { label: 'Mukammal!', emoji: '🏆', color: 'emerald' };
  if (percentage >= 80) return { label: 'A\'lo!', emoji: '🌟', color: 'green' };
  if (percentage >= 70) return { label: 'Yaxshi!', emoji: '👍', color: 'blue' };
  if (percentage >= 60) return { label: 'Qoniqarli', emoji: '👌', color: 'yellow' };
  return { label: 'Yaxshilash kerak', emoji: '💪', color: 'red' };
}

function renderScoreCard(percentage: number, correctAnswers: number, totalQuestions: number, incorrectAnswers: number) {
  const performance = getPerformanceLabel(percentage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Main Score */}
      <div className="md:col-span-2 lg:col-span-1">
        <div className={`card p-8 text-center bg-gradient-to-br from-white to-gray-50 border-2 ${getScoreBgColor(percentage)}`}>
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full 
                        flex items-center justify-center shadow-2xl">
            <span className="text-2xl font-bold text-white">{percentage}%</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Umumiy natija</h3>
          <p className={`text-sm font-semibold ${getScoreColor(percentage)}`}>
            {performance.emoji} {performance.label}
          </p>
        </div>
      </div>

      {/* Correct Answers */}
      <div className="card p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl 
                      flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">To'g'ri javoblar</h3>
        <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
        <p className="text-sm text-gray-500">/ {totalQuestions} ta</p>
      </div>

      {/* Incorrect Answers */}
      <div className="card p-6 text-center bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl 
                      flex items-center justify-center mx-auto mb-4 shadow-lg">
          <XCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Noto'g'ri javoblar</h3>
        <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
        <p className="text-sm text-gray-500">/ {totalQuestions} ta</p>
      </div>

      {/* Performance */}
      <div className="card p-6 text-center bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl 
                      flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Daraja</h3>
        <p className={`text-lg font-bold ${getScoreColor(percentage)}`}>
          {performance.label}
        </p>
        <p className="text-sm text-gray-500">{performance.emoji}</p>
      </div>
    </div>
  );
}

function renderQuestionDetails(result: QuizFinishResponse) {
  return (
    <div className="space-y-6">
      {result.data.map((questionResult, index) => (
        <div key={questionResult.id}
          className={`card p-6 border-l-4 ${questionResult.user_result
            ? 'border-l-green-500 bg-gradient-to-r from-green-50/50 to-white'
            : 'border-l-red-500 bg-gradient-to-r from-red-50/50 to-white'
            }`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${questionResult.user_result
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}>
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 text-lg">Savol {index + 1}</h4>
                <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${questionResult.user_result
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                  {questionResult.user_result ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      To'g'ri
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Noto'g'ri
                    </>
                  )}
                </span>
              </div>
              <p className="text-gray-900 mb-4 text-lg leading-relaxed">{questionResult.text}</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">To'g'ri javob:</span>
                </div>
                <p className="text-blue-800 font-medium">{questionResult.result.text}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [telegramSent, setTelegramSent] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const result: QuizFinishResponse = location.state?.result;
  const quizData = location.state?.quizData;

  if (!result || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl 
                        flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Natija topilmadi 🔍</h2>
          <p className="text-gray-600 mb-8">Test natijasi mavjud emas yoki noto'g'ri sahifaga o'tdingiz.</p>
          <button
            onClick={() => navigate('/quizzes')}
            className="btn-primary"
          >
            Testlar ro'yxatiga qaytish
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = result.data.length;
  const correctAnswers = result.correntCount;
  const incorrectAnswers = result.inCorrentCount;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const performance = getPerformanceLabel(percentage);

  const formatDate = (date: Date) => {
    const months = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentabr', 'oktyabr', 'noyabr', 'dekabr'
    ];
    const weekdays = [
      'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba',
      'Payshanba', 'Juma', 'Shanba'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const weekday = weekdays[date.getDay()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${weekday}, ${day} ${month} ${year} | ${hours}:${minutes}`;
  };

  const currentDate = formatDate(new Date());

  async function handleSendTelegram() {
    setIsSharing(true);
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown';
    const userPhone = user?.phone || 'Unknown';

    const message = `🎯 <b>Test Natijasi - Batafsil Hisobot</b>\n\n` +
      `👤 <b>Foydalanuvchi ma'lumotlari:</b>\n` +
      `   • Ism-familiya: ${userName}\n` +
      `   • Telefon: ${userPhone}\n` +
      `   • Lavozim: ${user?.role || 'Noma\'lum'}\n\n` +
      `📝 <b>Test ma'lumotlari:</b>\n` +
      `   • Nomi: ${quizData?.title || 'Noma\'lum test'}\n` +
      `   • Davomiyligi: ${quizData?.duration || 'Noma\'lum'} daqiqa\n` +
      `   • Qiyinlik darajasi: ${quizData?.difficulty || 'Noma\'lum'}\n` +
      `   • Holati: ${quizData?.status || 'Noma\'lum'}\n\n` +
      `📊 <b>Test natijalari:</b>\n` +
      `   • Ball: ${percentage}% ${performance.emoji}\n` +
      `   • Daraja: ${performance.label}\n` +
      `   • To'g'ri javoblar: ${correctAnswers}/${totalQuestions}\n` +
      `   • Noto'g'ri javoblar: ${incorrectAnswers}/${totalQuestions}\n\n` +
      `⏰ <b>Yakunlangan vaqt:</b>\n` +
      `   • ${currentDate}\n\n` +
      `🎯 <b>Batafsil ma'lumot:</b>\n` +
      `   • Muvaffaqiyat darajasi: ${((correctAnswers / totalQuestions) * 100).toFixed(1)}%\n` +
      `   • Xatolik darajasi: ${((incorrectAnswers / totalQuestions) * 100).toFixed(1)}%`;

    try {
      await sendTelegramResult(message);
      setTelegramSent(true);
      toast.success('Batafsil natija Telegramga yuborildi! 🚀');
    } catch (e) {
      toast.error('Natijani Telegramga yuborishda xatolik! ❌');
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 px-4 py-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/results')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 
                       px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Natijalarga qaytish</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl 
                            flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900">Test yakunlandi!</span>
                <p className="text-sm text-gray-500">Natijalaringizni ko'ring</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-2xl font-bold ${getScoreBgColor(percentage)}`}>
              <span className={getScoreColor(percentage)}>{percentage}% {performance.emoji}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Celebration Banner */}
        <div className="card p-8 mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4">{performance.emoji}</div>
            <h1 className="text-4xl font-bold mb-2">Tabriklaymiz!</h1>
            <p className="text-xl text-indigo-100 mb-4">
              Siz testni muvaffaqiyatli yakunladingiz va {percentage}% natija qo'lga kiritdingiz!
            </p>
            <div className="flex items-center justify-center gap-6 text-indigo-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>{correctAnswers} ta to'g'ri</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Yakunlandi</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>{performance.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="mb-8">
          {renderScoreCard(percentage, correctAnswers, totalQuestions, incorrectAnswers)}
        </div>

        {/* Quiz Information */}
        {quizData && (
          <div className="card p-8 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Brain className="w-7 h-7 text-blue-600" />
              Test haqida ma'lumot
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Test nomi</p>
                <p className="font-bold text-gray-900">{quizData.title}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Davomiyligi</p>
                <p className="font-bold text-gray-900">{quizData.duration} daqiqa</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Qiyinlik darajasi</p>
                <p className="font-bold text-gray-900">{quizData.difficulty || 'Ko\'rsatilmagan'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Yakunlangan vaqt</p>
                <p className="font-bold text-gray-900">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Results */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-purple-600" />
            Savollar tafsiloti
          </h2>
          {renderQuestionDetails(result)}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/quizzes')}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                     text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 
                     hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-5 h-5" />
            Yana test ishlash
          </button>

          <button
            onClick={() => navigate('/results')}
            className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-200 text-gray-700 
                     rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105"
          >
            <BarChart3 className="w-5 h-5" />
            Barcha natijalar
          </button>

          <button
            onClick={handleSendTelegram}
            disabled={telegramSent || isSharing}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 
                     text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 
                     transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Yuborilmoqda...
              </>
            ) : telegramSent ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Yuborildi!
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Telegramga yuborish
              </>
            )}
          </button>

          <button
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 
                     text-white rounded-2xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 
                     hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            PDF yuklab olish
          </button>
        </div>

        {/* Motivational Message */}
        <div className="mt-8 card p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl 
                          flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {percentage >= 80 ? 'Ajoyib natija!' : percentage >= 60 ? 'Yaxshi harakat!' : 'Davom eting!'}
              </h3>
              <p className="text-gray-700">
                {percentage >= 80
                  ? 'Siz juda yaxshi natija ko\'rsatdingiz. Davom eting!'
                  : percentage >= 60
                    ? 'Yaxshi natija, lekin yana ham yaxshilash mumkin.'
                    : 'Mashq qiling va yana urinib ko\'ring. Muvaffaqiyat sizni kutmoqda!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;