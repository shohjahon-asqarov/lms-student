import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizzes } from '../hooks/useQueries';
import { Paginator } from 'primereact/paginator';
import {
    BarChart3,
    Search,
    FileText,
    Clock,
    Filter,
    Trophy,
    Target,
    Star,
    Calendar,
    TrendingUp,
    Award,
    CheckCircle,
    Eye,
    ArrowRight,
    Brain,
    Zap
} from 'lucide-react';
import { paginationConfig } from '../config/env';
import { Dropdown } from 'primereact/dropdown';

const AllResults: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(paginationConfig.defaultPageSize);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const { data: quizzesData, isLoading, error } = useQuizzes(page, pageSize);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                        <BarChart3 className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Natijalar yuklanmoqda...</h2>
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <FileText className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-900 mb-4">Xatolik yuz berdi ❌</h3>
                    <p className="text-red-700 mb-8">Testlar yuklanmadi. Iltimos, sahifani yangilab ko'ring.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Sahifani yangilash
                    </button>
                </div>
            </div>
        );
    }

    // Filter only completed quizzes
    let completedQuizzes = quizzesData?.data.filter((quiz) => quiz.status === 'FINISHED') || [];

    if (searchTerm) {
        completedQuizzes = completedQuizzes.filter((quiz) =>
            quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filterDifficulty !== 'all') {
        completedQuizzes = completedQuizzes.filter((quiz) => quiz.difficulty === filterDifficulty);
    }

    // Sort quizzes
    completedQuizzes.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'name':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    const getDifficultyConfig = (difficulty: string | undefined) => {
        switch (difficulty) {
            case 'easy':
                return {
                    color: 'bg-green-100 text-green-700 border-green-200',
                    icon: '🟢',
                    label: 'Oson'
                };
            case 'medium':
                return {
                    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    icon: '🟡',
                    label: 'O\'rtacha'
                };
            case 'hard':
                return {
                    color: 'bg-red-100 text-red-700 border-red-200',
                    icon: '🔴',
                    label: 'Qiyin'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-700 border-gray-200',
                    icon: '⚪',
                    label: 'Noma\'lum'
                };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 fade-in">
                {/* Enhanced Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 
                                  rounded-3xl shadow-2xl mb-6 hover:scale-110 transition-transform duration-300">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 gradient-text mb-4">
                        Yakunlangan testlar 🏆
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Siz yakunlagan barcha testlarning natijalarini ko'ring va tahlil qiling
                    </p>
                    {quizzesData && (
                        <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 
                                      rounded-2xl px-6 py-3 border border-indigo-200">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-semibold text-indigo-900">
                                Jami yakunlangan: {completedQuizzes.length} ta test
                            </span>
                        </div>
                    )}
                </div>

                {/* Enhanced Filters */}
                <div className="dashboard-card">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Test nomi bo'yicha qidiring..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 
                                             focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white
                                             transition-all duration-200 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4">
                            <Dropdown
                                value={filterDifficulty}
                                options={[
                                    { label: 'Barcha qiyinliklar', value: 'all' },
                                    { label: 'Oson', value: 'easy' },
                                    { label: "O'rtacha", value: 'medium' },
                                    { label: 'Qiyin', value: 'hard' },
                                ]}
                                onChange={(e) => setFilterDifficulty(e.value)}
                                className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                                placeholder="Qiyinlikni tanlang"
                            />

                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card-interactive p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl 
                                          flex items-center justify-center shadow-lg">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{completedQuizzes.length}</p>
                                <p className="text-sm font-medium text-gray-600">Yakunlangan</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>Barcha testlar</span>
                        </div>
                    </div>

                    <div className="card-interactive p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl 
                                          flex items-center justify-center shadow-lg">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">85%</p>
                                <p className="text-sm font-medium text-gray-600">O'rtacha natija</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                            <Star className="w-4 h-4 mr-1" />
                            <span>Yaxshi natija</span>
                        </div>
                    </div>

                    <div className="card-interactive p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl 
                                          flex items-center justify-center shadow-lg">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">240</p>
                                <p className="text-sm font-medium text-gray-600">Daqiqa sarflangan</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-purple-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Jami vaqt</span>
                        </div>
                    </div>

                    <div className="card-interactive p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl 
                                          flex items-center justify-center shadow-lg">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">7</p>
                                <p className="text-sm font-medium text-gray-600">Kun streak</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-orange-600">
                            <Zap className="w-4 h-4 mr-1" />
                            <span>Faol davr</span>
                        </div>
                    </div>
                </div>

                {/* Enhanced Quizzes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {completedQuizzes.map((quiz, index) => {
                        const difficultyConfig = getDifficultyConfig(quiz.difficulty);

                        return (
                            <div
                                key={quiz.id}
                                className="card-interactive group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 
                                              rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 
                                              transition-opacity duration-300"></div>

                                <div className="relative z-10 p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl 
                                                              flex items-center justify-center shadow-lg">
                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold
                                                               border border-green-200">
                                                    ✅ Yakunlangan
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 
                                                         transition-colors duration-200">
                                                {quiz.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                {quiz.description || `Test ${quiz.questionCount} ta savoldan iborat`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-blue-50 rounded-2xl p-3 border border-blue-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                <span className="text-xs font-semibold text-blue-700">Savollar</span>
                                            </div>
                                            <span className="text-lg font-bold text-blue-900">
                                                {quiz.totalQuestions || quiz.questionCount}
                                            </span>
                                        </div>

                                        <div className="bg-purple-50 rounded-2xl p-3 border border-purple-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="w-4 h-4 text-purple-600" />
                                                <span className="text-xs font-semibold text-purple-700">Vaqt</span>
                                            </div>
                                            <span className="text-lg font-bold text-purple-900">
                                                {quiz.duration} daq
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyConfig.color}`}>
                                            {difficultyConfig.icon} {difficultyConfig.label}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                            📅 {new Date(quiz.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Mock Performance Indicator */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <span>Sizning natijangiz</span>
                                            <span>85%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill bg-gradient-to-r from-green-500 to-emerald-500"
                                                style={{ width: '85%' }}></div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => navigate(`/my-quiz-result/${quiz.id}`)}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 
                                                 hover:to-emerald-700 text-white py-3 px-4 rounded-2xl font-semibold 
                                                 transition-all duration-300 shadow-lg hover:shadow-xl 
                                                 transform hover:-translate-y-1 active:translate-y-0
                                                 flex items-center justify-center gap-2 group"
                                    >
                                        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                        Natijani ko'rish
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </button>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Enhanced Empty State */}
                {completedQuizzes.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full 
                                      flex items-center justify-center mx-auto mb-8 shadow-lg">
                            <Brain className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Yakunlangan testlar topilmadi 🔍</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                            {searchTerm
                                ? 'Qidiruv so\'zlarini o\'zgartirib ko\'ring yoki filtrlarni qayta sozlang.'
                                : 'Hali yakunlangan testlar yo\'q. Testlarni ishlashni boshlang!'}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterDifficulty('all');
                                    setSortBy('newest');
                                }}
                                className="btn-secondary"
                            >
                                Filtrlarni tozalash
                            </button>
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="btn-primary"
                            >
                                Testlarni boshlash
                            </button>
                        </div>
                    </div>
                )}

                {/* Enhanced Pagination */}
                {quizzesData && (
                    <div className="mt-12">
                        <Paginator
                            first={(page - 1) * pageSize}
                            rows={pageSize}
                            totalRecords={quizzesData.meta.total}
                            onPageChange={(e) => {
                                setPage(Math.floor(e.first / e.rows) + 1);
                                setPageSize(e.rows);
                            }}
                            rowsPerPageOptions={[...paginationConfig.pageSizeOptions]}
                            template="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllResults;