import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Loader2, X } from 'lucide-react';
import { useMyQuizResult } from '../hooks/useQueries';

const MyQuizResult: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const { data, isLoading, error } = useMyQuizResult(quizId || '', 1, 10, 'ASC');
    const results = data?.data || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (isLoading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>;
    }
    if (error || !results.length) {
        return <div className="flex flex-col items-center justify-center h-64 text-red-500"><XCircle className="w-12 h-12 mb-2" />{error ? 'Natija topilmadi yoki yuklanmadi' : 'Natija topilmadi'}</div>;
    }

    // Asosiy natija va urinishlarni data tartibiga ko'ra ajratish (1-result asosiy, qolganlari urinishlar)
    let mainResult: any = null;
    let attemptResults: any[] = [];
    if (results.length > 0) {
        mainResult = results[0];
        attemptResults = results.slice(1);
    }

    // Card rendering helper
    const renderResultCard = (result: any, idx: number, label?: string) => {
        const isOpen = openIndex === idx;
        const correctCount = result.studentCorrentcts?.length || 0;
        const totalQuestions = result.questions?.length || 0;
        return (
            <div key={result.id} className={`border rounded-lg p-6 bg-white shadow-sm transition-all duration-200 ${isOpen ? 'ring-2 ring-blue-400' : ''}`}>
                <div
                    className="flex items-center justify-between cursor-pointer select-none"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                    <div>
                        {label && <div className="text-xs font-bold text-blue-600 mb-1">{label}</div>}
                        <div className="text-lg font-semibold text-gray-900">{result.quiz?.title || 'Test nomi'}</div>
                        <div className="text-gray-600 text-sm mt-1 flex flex-wrap gap-4">
                            <span>Foiz: <span className="font-semibold">{result.percentage}%</span></span>
                            <span>Urinishlar: <span className="font-semibold">{result.attempts}</span></span>
                            <span>To'g'ri javoblar: <span className="font-semibold">{correctCount}</span> / {totalQuestions}</span>
                        </div>
                        <div className="text-gray-400 text-xs mt-1">{result.createdAt ? new Date(result.createdAt).toLocaleString() : ''}</div>
                    </div>
                    <button
                        className={`ml-4 w-8 h-8 flex items-center justify-center rounded-full border ${isOpen ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300'}`}
                        tabIndex={-1}
                        aria-label={isOpen ? 'Yopish' : 'Batafsil ko‘rish'}
                        type="button"
                    >
                        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                    </button>
                </div>
                {isOpen && (
                    <div className="mt-6">
                        <h2 className="text-base font-semibold mb-2">Savollar va javoblar</h2>
                        <div className="space-y-4">
                            {result.questions?.map((q: any, qidx: number) => {
                                const userCorrect = result.studentCorrentcts?.some((c: any) => c.id === q.id);
                                return (
                                    <div key={q.id} className={`p-4 rounded-lg border ${userCorrect ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                        <div className="font-medium mb-2 flex items-center gap-2">
                                            {qidx + 1}. {q.text}
                                            {userCorrect ? <CheckCircle className="w-5 h-5 text-green-500" aria-label="To'g'ri javob berilgan" /> : <X className="w-5 h-5 text-gray-400" aria-label="To'g'ri javob berilmagan" />}
                                        </div>
                                        <div className="space-y-1">
                                            {q.answers?.map((a: any) => (
                                                <div
                                                    key={a.id}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg ${a.isCorrect ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                                                >
                                                    {a.isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : <FileText className="w-4 h-4 text-gray-400" />}
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
        <div className="max-w-3xl mx-auto py-8 px-4 fade-in space-y-8">
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