import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Loader2, X, ChevronDown, ChevronUp, Star, Award, Trophy, Repeat, ListChecks } from 'lucide-react';
import { useMyQuizResult } from '../hooks/useQueries';

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
        if (percentage >= 70) return { text: 'Zo‘r! Yana ham yaxshilash mumkin!', icon: <Award className="inline w-7 h-7 text-blue-400" />, color: 'bg-blue-50 text-blue-700' };
        if (percentage >= 50) return { text: 'Yaxshi! Yana harakat qiling!', icon: <Trophy className="inline w-7 h-7 text-green-500" />, color: 'bg-green-50 text-green-700' };
        return { text: 'Boshlanishi yaxshi! Mashqni davom eting!', icon: <Repeat className="inline w-7 h-7 text-gray-400" />, color: 'bg-gray-50 text-gray-700' };
    };

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