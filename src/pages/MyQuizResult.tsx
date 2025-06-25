import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
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

    // Progress bar component
    const ProgressBar = ({ value, max }: { value: number; max: number }) => (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(value / max) * 100}%` }}
            />
        </div>
    );

    // Card rendering helper
    const renderResultCard = (result: any, idx: number, label?: string) => {
        const isOpen = openIndex === idx;
        const correctCount = result.studentCorrentcts?.length || 0;
        const totalQuestions = result.questions?.length || 0;
        return (
            <div
                key={result.id}
                className={`border rounded-2xl p-6 bg-white shadow-md transition-all duration-200 relative group hover:shadow-xl ${isOpen ? 'ring-2 ring-blue-400' : ''}`}
            >
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
                        <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {result.quiz?.title || 'Test nomi'}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                Foiz: <span className="font-bold ml-1">{result.percentage}%</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                                Urinishlar: <span className="font-bold ml-1">{result.attempts}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                To'g'ri javoblar: <span className="font-bold ml-1">{correctCount}</span> / {totalQuestions}
                            </span>
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                            {result.createdAt ? new Date(result.createdAt).toLocaleString() : ''}
                        </div>
                        <div className="mt-2">
                            <ProgressBar value={correctCount} max={totalQuestions} />
                        </div>
                    </div>
                    <button
                        className={`ml-4 w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 group-hover:bg-blue-50 transition-colors duration-200`}
                        tabIndex={-1}
                        aria-label={isOpen ? 'Yopish' : 'Batafsil ko‘rish'}
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
                        <h2 className="text-base font-semibold mb-2 text-blue-700">Savollar va javoblar</h2>
                        <div className="space-y-4">
                            {result.questions?.map((q: any, qidx: number) => {
                                const userCorrect = result.studentCorrentcts?.some((c: any) => c.id === q.id);
                                return (
                                    <div
                                        key={q.id}
                                        className={`p-4 rounded-xl border transition-colors duration-200 ${userCorrect ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                                    >
                                        <div className="font-medium mb-2 flex items-center gap-2">
                                            <span className="text-gray-700">{qidx + 1}. {q.text}</span>
                                            {userCorrect ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" aria-label="To'g'ri javob berilgan" />
                                            ) : (
                                                <X className="w-5 h-5 text-gray-400" aria-label="To'g'ri javob berilmagan" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {q.answers?.map((a: any) => (
                                                <div
                                                    key={a.id}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 ${a.isCorrect ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                                                >
                                                    {a.isCorrect ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <FileText className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <span>{a.label}. {a.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-2 sm:px-4 fade-in space-y-10">
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