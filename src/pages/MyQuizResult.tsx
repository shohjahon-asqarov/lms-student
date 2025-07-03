import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    FileText,
    CheckCircle,
    XCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
    Star,
    Award,
    Trophy,
    Repeat,
    ListChecks,
    Target,
    Brain,
    TrendingUp,
    Calendar,
    Clock,
    BarChart3
} from 'lucide-react';
import { useMyQuizResult } from '../hooks/useQueries';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const MyQuizResult: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const { data, isLoading, error } = useMyQuizResult(quizId || '', 1, 10, 'ASC');
    const results = data?.data || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                        <Brain className="w-12 h-12 text-white" />
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

    if (error || !results.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <XCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Natija topilmadi 🔍</h2>
                    <p className="text-gray-600 mb-8">
                        {error ? 'Natija topilmadi yoki yuklanmadi' : 'Natija topilmadi'}
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-primary"
                    >
                        Orqaga qaytish
                    </button>
                </div>
            </div>
        );
    }

    // Asosiy natija va urinishlarni data tartibiga ko'ra ajratish
    let mainResult: any = null;
    let attemptResults: any[] = [];
    if (results.length > 0) {
        mainResult = results[0];
        attemptResults = results.slice(1);
    }

    // Progress bar component with dynamic color
    const ProgressBar = ({ value, max }: { value: number; max: number }) => {
        let percent = max > 0 ? (value / max) * 100 : 0;
        let colorClass = 'bg-red-500';
        if (percent >= 90) colorClass = 'bg-yellow-500'; // gold
        else if (percent >= 70) colorClass = 'bg-blue-500'; // blue
        else if (percent >= 50) colorClass = 'bg-green-500'; // green

        return (
            <div className="progress-bar">
                <div
                    className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        );
    };

    // Motivational banner
    const getMotivation = (percentage: number) => {
        if (percentage >= 90) return {
            text: 'Mukammal natija! 🏆',
            icon: <Star className="w-6 h-6 text-yellow-500" />,
            color: 'bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 border-yellow-200'
        };
        if (percentage >= 70) return {
            text: "A'lo! Yana ham yaxshilash mumkin! 🌟",
            icon: <Award className="w-6 h-6 text-blue-500" />,
            color: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200'
        };
        if (percentage >= 50) return {
            text: 'Yaxshi! Yana harakat qiling! 👍',
            icon: <Trophy className="w-6 h-6 text-green-500" />,
            color: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200'
        };
        return {
            text: 'Boshlanishi yaxshi! Mashqni davom eting! 💪',
            icon: <Repeat className="w-6 h-6 text-gray-500" />,
            color: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200'
        };
    };

    // Pie chart: barcha urinishlar bo'yicha umumiy natija
    const totalCorrect = results.reduce((sum: number, r: any) => sum + (r.studentCorrentcts?.length || 0), 0);
    const totalQuestions = results.reduce((sum: number, r: any) => sum + (r.questions?.length || 0), 0);
    const totalIncorrect = totalQuestions - totalCorrect;
    const hasPieData = totalQuestions > 0;
    const pieData = hasPieData
        ? [
            { name: "To'g'ri", value: totalCorrect },
            { name: "Noto'g'ri", value: totalIncorrect }
        ]
        : [];
    const pieColors = ['#22c55e', '#ef4444'];
    const mainPercentage = hasPieData ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Bar chart: har bir urinish uchun to'g'ri, noto'g'ri, savollar soni va foiz
    const barData = results.map((r: any, idx: number) => ({
        name: idx === 0 ? 'Asosiy' : `Urinish ${idx + 1}`,
        Foiz: typeof r.percentage === 'number' && !isNaN(r.percentage) ? r.percentage : 0,
        Togri: r.studentCorrentcts?.length || 0,
        Savollar: r.questions?.length || 0,
        Notogri: (r.questions?.length || 0) - (r.studentCorrentcts?.length || 0)
    }));

    // Faqat haqiqiy foizlarni olish
    const validPercentages = results
        .map((r: any) => typeof r.percentage === 'number' && !isNaN(r.percentage) ? r.percentage : null)
        .filter((p: number | null) => p !== null) as number[];
    const avgPercentage = validPercentages.length
        ? Math.round(validPercentages.reduce((sum, p) => sum + p, 0) / validPercentages.length)
        : 0;

    // Eng yaxshi natija
    const bestResult = results.reduce(
        (max: any, r: any) =>
            typeof r.percentage === 'number' && (!max || r.percentage > max.percentage) ? r : max,
        null
    );
    const bestScore = bestResult?.percentage || 0;
    const lastAttemptDate = results.length ? results[results.length - 1]?.createdAt : null;

    // Statistik bloklar uchun massiv
    const stats = [
        {
            label: "O'rtacha foiz",
            value: avgPercentage + '%',
            icon: <ListChecks className="w-6 h-6 text-blue-500" />,
            bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
        },
        {
            label: 'Urinishlar',
            value: results.length,
            icon: <Repeat className="w-6 h-6 text-purple-500" />,
            bg: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
        },
        {
            label: 'Eng yaxshi natija',
            value: bestScore + '%',
            icon: <Trophy className="w-6 h-6 text-yellow-500" />,
            bg: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200',
        },
        {
            label: 'Oxirgi urinish',
            value: lastAttemptDate ? new Date(lastAttemptDate).toLocaleDateString() : '—',
            icon: <Calendar className="w-6 h-6 text-green-500" />,
            bg: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
        },
        {
            label: "To'g'ri javoblar (umumiy)",
            value: totalCorrect + ' / ' + totalQuestions,
            icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
            bg: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
        },
        {
            label: "Noto'g'ri javoblar (umumiy)",
            value: totalIncorrect,
            icon: <XCircle className="w-6 h-6 text-red-500" />,
            bg: 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200',
        },
    ];

    // Card rendering helper
    const renderResultCard = (result: any, idx: number, label?: string) => {
        const isOpen = openIndex === idx;
        const correctCount = result.studentCorrentcts?.length || 0;
        const totalQuestions = result.questions?.length || 0;
        const percent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        const motivation = getMotivation(percent);

        return (
            <div
                key={result.id || idx}
                className={`card p-8 bg-gradient-to-br from-white to-gray-50/50 relative overflow-hidden
                          transition-all duration-300 hover:shadow-xl ${isOpen ? 'ring-2 ring-indigo-400 scale-[1.01]' : ''}`}
            >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 
                              rounded-full -translate-y-16 translate-x-16 opacity-30"></div>

                <div className="relative z-10">
                    {/* Motivational banner */}
                    <div className={`mb-6 px-4 py-3 rounded-2xl font-bold flex items-center gap-3 text-base 
                                   shadow-sm border-2 ${motivation.color}`}>
                        {motivation.icon}
                        {motivation.text}
                    </div>

                    <div
                        className="cursor-pointer select-none"
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                {label && (
                                    <div className="inline-block px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 
                                                  rounded-full mb-3 border border-indigo-200">
                                        {label}
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                    <Brain className="w-7 h-7 text-indigo-600" />
                                    {result.quiz?.title || "Test nomi: Ma'lumot yo'q"}
                                </h3>

                                {result.quiz?.description && (
                                    <p className="text-gray-600 mb-4 leading-relaxed">{result.quiz.description}</p>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-blue-50 rounded-2xl p-3 border border-blue-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Target className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-semibold text-blue-700">Foiz</span>
                                        </div>
                                        <span className="text-lg font-bold text-blue-900">
                                            {typeof result.percentage === 'number' ? result.percentage : '—'}%
                                        </span>
                                    </div>

                                    <div className="bg-purple-50 rounded-2xl p-3 border border-purple-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Repeat className="w-4 h-4 text-purple-600" />
                                            <span className="text-xs font-semibold text-purple-700">Urinishlar</span>
                                        </div>
                                        <span className="text-lg font-bold text-purple-900">
                                            {typeof result.attempts === 'number' ? result.attempts : '—'}
                                        </span>
                                    </div>

                                    <div className="bg-green-50 rounded-2xl p-3 border border-green-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span className="text-xs font-semibold text-green-700">To'g'ri</span>
                                        </div>
                                        <span className="text-lg font-bold text-green-900">
                                            {correctCount} / {totalQuestions}
                                        </span>
                                    </div>

                                    <div className="bg-red-50 rounded-2xl p-3 border border-red-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span className="text-xs font-semibold text-red-700">Noto'g'ri</span>
                                        </div>
                                        <span className="text-lg font-bold text-red-900">
                                            {totalQuestions - correctCount}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {result.createdAt ? new Date(result.createdAt).toLocaleString() : "Sana: Ma'lumot yo'q"}
                                </div>

                                <div className="mb-4">
                                    <ProgressBar value={correctCount} max={totalQuestions || 1} />
                                </div>
                            </div>

                            <button
                                className="ml-6 w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-200 
                                         bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 
                                         shadow-md hover:shadow-lg"
                                type="button"
                            >
                                {isOpen ? (
                                    <ChevronUp className="w-6 h-6 text-indigo-600" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-gray-400 hover:text-indigo-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {isOpen && (
                        <div className="mt-8 animate-fade-in">
                            <h4 className="text-lg font-bold mb-6 text-indigo-700 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Savollar va javoblar
                            </h4>
                            {Array.isArray(result.questions) && result.questions.length > 0 ? (
                                <div className="space-y-6">
                                    {result.questions.map((q: any, qidx: number) => {
                                        const userCorrect = result.studentCorrentcts?.some((c: any) => c.id === q.id);
                                        return (
                                            <div
                                                key={q.id || qidx}
                                                className={`card p-6 border-l-4 transition-all duration-200 ${userCorrect
                                                    ? 'border-l-green-500 bg-gradient-to-r from-green-50/50 to-white'
                                                    : 'border-l-red-500 bg-gradient-to-r from-red-50/50 to-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={`w-10 h-10 rounded-2xl font-bold text-sm flex items-center 
                                                                   justify-center text-white shadow-lg ${userCorrect
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                            : 'bg-gradient-to-r from-red-500 to-pink-500'
                                                        }`}>
                                                        {qidx + 1}
                                                    </div>
                                                    <h5 className="text-lg font-bold text-gray-900 flex-1">
                                                        {q.text || "Savol matni yo'q"}
                                                    </h5>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center 
                                                                    gap-1 border ${userCorrect
                                                            ? 'bg-green-100 text-green-700 border-green-300'
                                                            : 'bg-red-100 text-red-700 border-red-300'
                                                        }`}>
                                                        {userCorrect ? (
                                                            <>
                                                                <CheckCircle className="w-3 h-3" />
                                                                To'g'ri
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-3 h-3" />
                                                                Noto'g'ri
                                                            </>
                                                        )}
                                                    </span>
                                                </div>

                                                {Array.isArray(q.answers) && q.answers.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {q.answers.map((a: any) => (
                                                            <div
                                                                key={a.id}
                                                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl 
                                                                          transition-colors duration-200 text-sm font-medium border-2 ${a.isCorrect
                                                                        ? 'bg-green-50 text-green-800 border-green-200'
                                                                        : 'bg-gray-50 text-gray-700 border-gray-200'
                                                                    }`}
                                                            >
                                                                {a.isCorrect ? (
                                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                                ) : (
                                                                    <XCircle className="w-5 h-5 text-gray-400" />
                                                                )}
                                                                <span className="flex-1">
                                                                    {a.label ? `${a.label}. ` : ''}{a.text || "Javob matni yo'q"}
                                                                </span>
                                                                {a.isCorrect && (
                                                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 
                                                                                   text-xs font-bold border border-green-200">
                                                                        To'g'ri javob
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-400 italic">Javoblar mavjud emas</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400 italic">Savollar mavjud emas</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 gradient-text mb-4">
                        Mening test natijam 📊
                    </h1>
                    <p className="text-gray-600 text-lg">Test natijalaringizni batafsil ko'ring va tahlil qiling</p>
                </div>

                {/* STATISTIKA BLOKI */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className={`card p-6 text-center hover:scale-105 transition-all duration-300 
                                      border-2 ${s.bg} relative overflow-hidden`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-8 translate-x-8"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 mx-auto mb-3 bg-white/80 backdrop-blur-sm rounded-2xl 
                                              flex items-center justify-center shadow-lg">
                                    {s.icon}
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
                                <div className="text-xs text-gray-600 font-medium">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHARTLAR BLOKI */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Donut chart */}
                    <div className="card p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            Umumiy natija
                        </h3>
                        {hasPieData ? (
                            <div className="flex flex-col items-center">
                                <ResponsiveContainer width={300} height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            startAngle={90}
                                            endAngle={-270}
                                            stroke="#fff"
                                            strokeWidth={3}
                                        >
                                            {pieData.map((entry, idx) => (
                                                <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="36"
                                            fontWeight="bold"
                                            fill="#1e293b"
                                        >
                                            {mainPercentage}%
                                        </text>
                                        <text
                                            x="50%"
                                            y="62%"
                                            textAnchor="middle"
                                            fontSize="14"
                                            fill="#64748b"
                                        >
                                            Umumiy natija
                                        </text>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex gap-6 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                        <span className="text-sm font-medium text-gray-700">To'g'ri</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                        <span className="text-sm font-medium text-gray-700">Noto'g'ri</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px]">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <span className="text-gray-500 font-medium">Ma'lumot yo'q</span>
                            </div>
                        )}
                    </div>

                    {/* Grouped Bar chart */}
                    <div className="card p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                            Urinishlar bo'yicha natijalar
                        </h3>
                        {barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData} barCategoryGap={20}>
                                    <XAxis dataKey="name" fontSize={12} stroke="#64748b" />
                                    <YAxis fontSize={12} stroke="#64748b" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: 'none',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="Togri" fill="#22c55e" radius={[4, 4, 0, 0]} name="To'g'ri" />
                                    <Bar dataKey="Notogri" fill="#ef4444" radius={[4, 4, 0, 0]} name="Noto'g'ri" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px]">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <BarChart3 className="w-8 h-8 text-gray-400" />
                                </div>
                                <span className="text-gray-500 font-medium">Ma'lumot yo'q</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* NATIJALAR */}
                <div className="space-y-8">
                    {mainResult && renderResultCard(mainResult, 0, 'Asosiy natija')}

                    {attemptResults.length > 0 && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Repeat className="w-7 h-7 text-purple-600" />
                                Boshqa urinishlar
                            </h2>
                            {attemptResults.map((result: any, idx: number) => renderResultCard(result, idx + 1))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyQuizResult;