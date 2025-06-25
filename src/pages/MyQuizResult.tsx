import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Loader2, X, ChevronDown, ChevronUp, Star, Award, Trophy, Repeat, ListChecks } from 'lucide-react';
import { useMyQuizResult } from '../hooks/useQueries';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';

const MyQuizResult: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const { data, isLoading, error } = useMyQuizResult(quizId || '', 1, 10, 'ASC');
    const results = data?.data || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
            </div>
        );
    }
    if (error || !results.length) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <XCircle className="w-12 h-12 mb-2" />
                {error ? 'Natija topilmadi yoki yuklanmadi' : 'Natija topilmadi'}
            </div>
        );
    }

    // Asosiy natija va urinishlarni data tartibiga ko'ra ajratish (1-result asosiy, qolganlari urinishlar)
    let mainResult: any = null;
    let attemptResults: any[] = [];
    if (results.length > 0) {
        mainResult = results[0];
        attemptResults = results.slice(1);
    }

    // Progress bar component with dynamic color
    const ProgressBar = ({ value, max }: { value: number; max: number }) => {
        let percent = max > 0 ? (value / max) * 100 : 0;
        let color = 'bg-red-500';
        if (percent >= 90) color = 'bg-yellow-400'; // gold
        else if (percent >= 70) color = 'bg-blue-500'; // blue
        else if (percent >= 50) color = 'bg-green-500'; // green
        return (
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        );
    };

    // Motivational banner
    const getMotivation = (percentage: number) => {
        if (percentage >= 90) return { text: 'Ajoyib natija! 👏', icon: <Star className="inline w-7 h-7 text-yellow-400" />, color: 'bg-yellow-50 text-yellow-700' };
        if (percentage >= 70) return { text: "Zo'r! Yana ham yaxshilash mumkin!", icon: <Award className="inline w-7 h-7 text-blue-400" />, color: 'bg-blue-50 text-blue-700' };
        if (percentage >= 50) return { text: 'Yaxshi! Yana harakat qiling!', icon: <Trophy className="inline w-7 h-7 text-green-500" />, color: 'bg-green-50 text-green-700' };
        return { text: 'Boshlanishi yaxshi! Mashqni davom eting!', icon: <Repeat className="inline w-7 h-7 text-gray-400" />, color: 'bg-gray-50 text-gray-700' };
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
            bg: 'bg-gradient-to-br from-blue-100 to-blue-50',
        },
        {
            label: 'Urinishlar',
            value: results.length,
            icon: <Repeat className="w-6 h-6 text-yellow-500" />,
            bg: 'bg-gradient-to-br from-yellow-100 to-yellow-50',
        },
        {
            label: 'Eng yaxshi natija',
            value: bestScore + '%',
            icon: <Trophy className="w-6 h-6 text-purple-500" />,
            bg: 'bg-gradient-to-br from-purple-100 to-purple-50',
        },
        {
            label: 'Oxirgi urinish',
            value: lastAttemptDate ? new Date(lastAttemptDate).toLocaleString() : '—',
            icon: <Award className="w-6 h-6 text-pink-500" />,
            bg: 'bg-gradient-to-br from-pink-100 to-pink-50',
        },
        {
            label: "To'g'ri javoblar (umumiy)",
            value: totalCorrect + ' / ' + totalQuestions,
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            bg: 'bg-gradient-to-br from-green-100 to-green-50',
        },
        {
            label: "Noto'g'ri javoblar (umumiy)",
            value: totalIncorrect,
            icon: <XCircle className="w-6 h-6 text-red-500" />,
            bg: 'bg-gradient-to-br from-red-100 to-red-50',
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
                className={`border rounded-2xl p-6 bg-white/80 shadow-2xl transition-all duration-300 relative group hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] ${isOpen ? 'ring-4 ring-blue-400 scale-[1.01]' : ''} w-full max-w-none backdrop-blur-md`}
                style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)' }}
            >
                {/* Motivational banner */}
                <div className={`mb-3 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 text-base shadow-sm ${motivation.color}`}>{React.cloneElement(motivation.icon, { className: 'inline w-5 h-5' })} {motivation.text}</div>
                <div
                    className="flex items-center justify-between cursor-pointer select-none"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                    <div>
                        {label && (
                            <div className="inline-block px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded mb-1">
                                {label}
                            </div>
                        )}
                        <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {result.quiz?.title || "Test nomi: Ma'lumot yo'q"}
                        </div>
                        {result.quiz?.description && (
                            <div className="text-sm text-gray-500 mt-1 mb-2 max-w-xl line-clamp-2">{result.quiz.description}</div>
                        )}
                        <div className="flex flex-wrap gap-3 mt-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                                <ListChecks className="w-4 h-4" /> Foiz: <span className="font-bold ml-1">{typeof result.percentage === 'number' ? result.percentage : '—'}%</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold bg-yellow-50 text-yellow-700">
                                <Repeat className="w-4 h-4" /> Urinishlar: <span className="font-bold ml-1">{typeof result.attempts === 'number' ? result.attempts : '—'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold bg-green-50 text-green-700">
                                <CheckCircle className="w-4 h-4" /> To'g'ri: <span className="font-bold ml-1">{correctCount}</span> / {totalQuestions}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold bg-red-50 text-red-700">
                                <XCircle className="w-4 h-4" /> Noto'g'ri: <span className="font-bold ml-1">{totalQuestions - correctCount}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold bg-gray-50 text-gray-700">
                                <FileText className="w-4 h-4" /> Savollar: <span className="font-bold ml-1">{totalQuestions || '—'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold bg-purple-50 text-purple-700">
                                <Trophy className="w-4 h-4" /> Ball: <span className="font-bold ml-1">{typeof result.score === 'number' ? result.score : '—'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold bg-pink-50 text-pink-700">
                                <Award className="w-4 h-4" /> Holat: <span className="font-bold ml-1">{result.status || "Ma'lumot yo'q"}</span>
                            </span>
                        </div>
                        <div className="text-gray-400 text-xs mt-2">
                            {result.createdAt ? new Date(result.createdAt).toLocaleString() : "Sana: Ma'lumot yo'q"}
                        </div>
                        <div className="mt-3">
                            <ProgressBar value={correctCount} max={totalQuestions || 1} />
                        </div>
                    </div>
                    <button
                        className={`ml-4 w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 group-hover:bg-blue-50 transition-all duration-300 shadow-md`}
                        tabIndex={-1}
                        aria-label={isOpen ? 'Yopish' : 'Batafsil ko\'rish'}
                        type="button"
                    >
                        {isOpen ? (
                            <ChevronUp className="w-6 h-6 text-blue-500" />
                        ) : (
                            <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                        )}
                    </button>
                </div>
                {isOpen && (
                    <div className="mt-6 animate-fade-in">
                        <h2 className="text-base font-bold mb-3 text-blue-700">Savollar va javoblar</h2>
                        {Array.isArray(result.questions) && result.questions.length > 0 ? (
                            <div className="space-y-4">
                                {result.questions.map((q: any, qidx: number) => {
                                    const userCorrect = result.studentCorrentcts?.some((c: any) => c.id === q.id);
                                    return (
                                        <div
                                            key={q.id || qidx}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 bg-white/80 shadow-sm ${userCorrect ? 'border-green-200' : 'border-gray-200'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${userCorrect ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-500 border border-gray-300'}`}>{qidx + 1}</span>
                                                <span className="text-base font-semibold text-gray-800 flex-1">{q.text || "Savol matni yo'q"}</span>
                                                {userCorrect ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                                                        <CheckCircle className="w-4 h-4" /> To'g'ri
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-300">
                                                        <XCircle className="w-4 h-4" /> Noto'g'ri
                                                    </span>
                                                )}
                                            </div>
                                            {Array.isArray(q.answers) && q.answers.length > 0 ? (
                                                <div className="space-y-1 mt-2">
                                                    {q.answers.map((a: any) => (
                                                        <div
                                                            key={a.id}
                                                            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 text-sm font-medium border ${a.isCorrect ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                                                        >
                                                            {a.isCorrect ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <XCircle className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span>{a.label ? `${a.label}. ` : ''}{a.text || "Javob matni yo'q"}</span>
                                                            {a.isCorrect && (
                                                                <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">To'g'ri javob</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400 italic mt-2">Javoblar mavjud emas</div>
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
        );
    };

    return (
        <div className="w-full py-8 px-2 sm:px-8 fade-in space-y-10">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Mening test natijam</h1>
            {/* STATISTIKA BLOKI */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {stats.map((s, i) => (
                    <div
                        key={i}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md transition-all duration-200 ${s.bg} hover:shadow-xl hover:-translate-y-1 border border-gray-100 relative overflow-hidden`}
                    >
                        <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-full shadow bg-white/80">
                            {s.icon}
                        </div>
                        <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                        <div className="text-xs text-gray-500 text-center mt-1">{s.label}</div>
                    </div>
                ))}
            </div>
            {/* CHARTLAR BLOKI */}
            <div className="flex flex-col gap-6 mb-8">
                {/* Donut chart */}
                <div className="dashboard-card flex flex-col items-center w-full p-6 animate-fade-in bg-gradient-to-br from-green-50 to-blue-50 shadow-xl">
                    <div className="text-base font-semibold text-gray-900 mb-4">Umumiy natija (donut chart)</div>
                    {hasPieData ? (
                        <ResponsiveContainer width={280} height={280}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={7}
                                    startAngle={90}
                                    endAngle={-270}
                                    stroke="#fff"
                                    isAnimationActive={true}
                                    cornerRadius={12}
                                >
                                    {pieData.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                                    ))}
                                </Pie>
                                {/* Custom center content */}
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
                                    fontSize="15"
                                    fill="#64748b"
                                >
                                    Umumiy natija
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[280px]">
                            <span className="text-gray-400 text-base font-semibold">Ma'lumot yo'q</span>
                        </div>
                    )}
                    <div className="flex gap-5 mt-4 text-sm">
                        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> To'g'ri</span>
                        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Noto'g'ri</span>
                    </div>
                </div>
                {/* Grouped Bar chart */}
                <div className="dashboard-card flex flex-col items-center w-full p-6 animate-fade-in bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl">
                    <div className="text-base font-semibold text-gray-900 mb-4">Urinishlar bo'yicha natijalar (grouped bar)</div>
                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={barData} barCategoryGap={22}>
                                <XAxis dataKey="name" fontSize={14} />
                                <YAxis fontSize={14} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const d = payload[0].payload;
                                            return (
                                                <div className="rounded-xl shadow-lg bg-white/95 p-3 min-w-[160px]">
                                                    <div className="font-bold text-gray-900 mb-2 text-base">{d.name}</div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                                            <span className="text-xs text-gray-700">To'g'ri:</span>
                                                            <span className="font-bold text-green-700">{d.Togri}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                                                            <span className="text-xs text-gray-700">Noto'g'ri:</span>
                                                            <span className="font-bold text-red-600">{d.Notogri}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                                            <span className="text-xs text-gray-700">Savollar:</span>
                                                            <span className="font-bold text-blue-700">{d.Savollar}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                                                            <span className="text-xs text-gray-700">Foiz:</span>
                                                            <span className="font-bold text-purple-700">{d.Foiz}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                    contentStyle={{ borderRadius: 16, fontSize: 14, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="Togri" fill="#22c55e" radius={[7, 7, 0, 0]} name="To'g'ri" />
                                <Bar dataKey="Notogri" fill="#ef4444" radius={[7, 7, 0, 0]} name="Noto'g'ri" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[260px]">
                            <span className="text-gray-400 text-base font-semibold">Ma'lumot yo'q</span>
                        </div>
                    )}
                </div>
            </div>
            {/* CHARTLAR BLOKI YAKUNI */}
            {mainResult && renderResultCard(mainResult, 0, 'Asosiy natija')}
            {attemptResults.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-base font-bold text-gray-800">Boshqa urinishlar</h2>
                    {attemptResults.map((result: any, idx: number) => renderResultCard(result, idx + 1))}
                </div>
            )}
        </div>
    );
};

export default MyQuizResult; 