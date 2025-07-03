import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserResults } from '../hooks/useQueries';
import {
  Target,
  Award,
  Clock,
  FileText,
  TrendingUp,
  ArrowRight,
  BookOpen,
  BarChart3,
  Zap,
  Star,
  Trophy,
  Calendar,
  Users,
  Brain,
  Flame
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: resultsData } = useUserResults(user?.id || '', 1, 5);

  // Enhanced mock data for student dashboard
  const studentStats = {
    totalQuizzesTaken: 12,
    averageScore: 78,
    totalTimeSpent: 180,
    quizzesCompleted: 8,
    streak: 7,
    rank: 15,
    totalStudents: 150,
    achievements: 5
  };

  // Enhanced performance data
  const performanceData = [
    { month: 'Yan', score: 75, tests: 2 },
    { month: 'Fev', score: 78, tests: 3 },
    { month: 'Mar', score: 82, tests: 2 },
    { month: 'Apr', score: 79, tests: 4 },
    { month: 'May', score: 85, tests: 3 },
    { month: 'Iyn', score: 88, tests: 2 }
  ];

  const weeklyActivity = [
    { day: 'Du', tests: 2, time: 45 },
    { day: 'Se', tests: 1, time: 30 },
    { day: 'Ch', tests: 3, time: 60 },
    { day: 'Pa', tests: 0, time: 0 },
    { day: 'Ju', tests: 2, time: 40 },
    { day: 'Sh', tests: 1, time: 25 },
    { day: 'Ya', tests: 1, time: 35 }
  ];

  const scoreDistribution = [
    { range: '90-100%', count: 2, color: '#10B981' },
    { range: '70-89%', count: 5, color: '#3B82F6' },
    { range: '50-69%', count: 3, color: '#F59E0B' },
    { range: 'Below 50%', count: 2, color: '#EF4444' }
  ];

  const achievements = [
    { id: 1, title: 'First Quiz', icon: '🎯', unlocked: true },
    { id: 2, title: 'Speed Runner', icon: '⚡', unlocked: true },
    { id: 3, title: 'Perfect Score', icon: '💯', unlocked: false },
    { id: 4, title: 'Streak Master', icon: '🔥', unlocked: true },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 
                    rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Xush kelibsiz, {user?.firstName}! 👋
                </h1>
                <p className="text-indigo-100 text-lg">
                  O'qishni davom ettirishga tayyormisiz?
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="font-semibold">{studentStats.streak} kunlik streak</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">#{studentStats.rank} reyting</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center float">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-interactive p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl 
                          flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{studentStats.totalQuizzesTaken}</p>
              <p className="text-sm font-medium text-gray-600">Ishlangan testlar</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>O'tgan oydan +12%</span>
          </div>
        </div>

        <div className="card-interactive p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl 
                          flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{studentStats.averageScore}%</p>
              <p className="text-sm font-medium text-gray-600">O'rtacha ball</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+5% yaxshilanish</span>
          </div>
        </div>

        <div className="card-interactive p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl 
                          flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{studentStats.totalTimeSpent}</p>
              <p className="text-sm font-medium text-gray-600">Daqiqa sarflangan</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-blue-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Bu oy</span>
          </div>
        </div>

        <div className="card-interactive p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl 
                          flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{studentStats.quizzesCompleted}</p>
              <p className="text-sm font-medium text-gray-600">Yakunlangan</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-orange-600">
            <Trophy className="w-4 h-4 mr-1" />
            <span>Yakunlangan testlar</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trend */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Natijalar dinamikasi</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>So'nggi 6 oy</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Haftalik faollik</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Bu hafta</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                }}
              />
              <Bar dataKey="tests" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Results */}
        <div className="lg:col-span-2 dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">So'nggi natijalar</h3>
            <Link
              to="/results"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1
                       hover:gap-2 transition-all duration-200"
            >
              Barchasini ko'rish <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {resultsData?.data.slice(0, 4).map((result, index) => (
              <div key={result.id} 
                   className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl 
                            hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02]"
                   style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl 
                                flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{result.quiz.title}</p>
                    <p className="text-sm text-gray-500">{result.percentage}% natija</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    result.percentage >= 70
                      ? 'bg-green-100 text-green-700'
                      : result.percentage >= 50
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {result.percentage >= 70 ? 'A\'lo' : result.percentage >= 50 ? 'Yaxshi' : 'Yaxshilash kerak'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements & Quick Actions */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="dashboard-card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Yutuqlar
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} 
                     className={`p-3 rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                       achievement.unlocked 
                         ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                         : 'bg-gray-50 border border-gray-200 opacity-60'
                     }`}>
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className="text-xs font-semibold text-gray-700">{achievement.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tezkor amallar</h3>
            <div className="space-y-3">
              <Link
                to="/quizzes"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 
                         hover:from-indigo-100 hover:to-purple-100 rounded-2xl transition-all duration-300 
                         hover:scale-105 group border border-indigo-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl 
                              flex items-center justify-center shadow-lg group-hover:shadow-xl 
                              transition-all duration-300">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Test ishlash</p>
                  <p className="text-sm text-gray-500">Yangi testni boshlash</p>
                </div>
              </Link>

              <Link
                to="/results"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 
                         hover:from-green-100 hover:to-emerald-100 rounded-2xl transition-all duration-300 
                         hover:scale-105 group border border-green-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl 
                              flex items-center justify-center shadow-lg group-hover:shadow-xl 
                              transition-all duration-300">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Natijalarni ko'rish</p>
                  <p className="text-sm text-gray-500">O'z natijalaringizni tekshiring</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;