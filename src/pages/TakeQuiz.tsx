import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStartQuiz, useFinishQuiz } from '../hooks/useQueries';
import {
    Clock,
    FileText,
    CheckCircle,
    Circle,
    ArrowLeft,
    ArrowRight,
    Send,
    AlertCircle,
    Loader2,
    Brain,
    Target,
    Zap,
    Award,
    BookOpen,
    Timer,
    Flag
} from 'lucide-react';
import { Question, QuizSubmission } from '../types';
import { quizConfig } from '../config/env';

const TakeQuiz: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const startQuizMutation = useStartQuiz();
    const finishQuizMutation = useFinishQuiz();
    const location = useLocation();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quizData, setQuizData] = useState<any>(null);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    // Memoize questions to prevent unnecessary re-renders
    const questions: Question[] = useMemo(() => {
        return quizData || [];
    }, [quizData]);

    // Memoize current question
    const currentQuestion = useMemo(() => {
        return questions[currentQuestionIndex];
    }, [questions, currentQuestionIndex]);

    // Memoize navigation states
    const isLastQuestion = useMemo(() => {
        return currentQuestionIndex === questions.length - 1;
    }, [currentQuestionIndex, questions.length]);

    const hasAnsweredCurrent = useMemo(() => {
        return !!selectedAnswers[currentQuestion?.id];
    }, [selectedAnswers, currentQuestion?.id]);

    const answeredCount = useMemo(() => {
        return Object.keys(selectedAnswers).length;
    }, [selectedAnswers]);

    // Fetch quiz data when component mounts
    useEffect(() => {
        if (location.state?.duration) {
            const durationInMinutes = location.state.duration;
            setTimeRemaining(durationInMinutes * 60);
        }

        if (id && !quizData && !startQuizMutation.isPending) {
            handleStartQuiz();
        }
    }, [id, quizData, startQuizMutation.isPending, location.state]);

    const handleStartQuiz = useCallback(async () => {
        if (!id || quizData) return;

        try {
            setError(null);
            const session = await startQuizMutation.mutateAsync(id);
            setQuizData(session);

            if (!location.state?.duration) {
                const durationInMinutes = session.duration || quizConfig.defaultDuration;
                setTimeRemaining(durationInMinutes * 60);
            }
        } catch (err: any) {
            console.error('Failed to start quiz:', err);
            setError(err.response?.data?.message || 'Failed to start quiz. Please try again.');
        }
    }, [id, quizData, startQuizMutation, location.state]);

    // Timer effect
    useEffect(() => {
        if (timeRemaining <= 0 && quizData) {
            handleSubmitQuiz();
            return;
        }

        if (!quizData) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, quizData]);

    const formatTime = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    const getTimeColor = useCallback((seconds: number) => {
        if (seconds > 300) return 'text-green-600'; // > 5 minutes
        if (seconds > 120) return 'text-yellow-600'; // > 2 minutes
        return 'text-red-600'; // < 2 minutes
    }, []);

    const handleAnswerSelect = useCallback((questionId: string, answerId: string) => {
        setSelectedAnswers(prev => {
            const currentAnswer = prev[questionId];

            if (currentAnswer === answerId) {
                return prev;
            }

            return {
                ...prev,
                [questionId]: answerId
            };
        });
    }, []);

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    }, [currentQuestionIndex, questions.length]);

    const handlePreviousQuestion = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }, [currentQuestionIndex]);

    const handleSubmitQuiz = useCallback(async () => {
        if (isSubmitting || !id) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const submission: QuizSubmission = {
                quizId: id,
                questions: questions.map(question => ({
                    questionId: question.id,
                    questionType: 'multiple_choice',
                    answers: selectedAnswers[question.id] ? [selectedAnswers[question.id]] : []
                }))
            };

            const result = await finishQuizMutation.mutateAsync(submission);

            navigate(`/result`, {
                state: {
                    result,
                    quizId: id,
                    quizData: location.state?.quizData,
                    fromQuiz: true
                }
            });
        } catch (err: any) {
            console.error('Failed to submit quiz:', err);
            setError(err.response?.data?.message || 'Failed to submit quiz. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, id, questions, selectedAnswers, finishQuizMutation, navigate, location.state]);

    // Loading state
    if (startQuizMutation.isPending) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                        <Brain className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Test boshlanmoqda... 🚀</h2>
                    <p className="text-gray-600 mb-6">Iltimos, test yuklanishini kuting.</p>
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

    // Error state
    if (startQuizMutation.isError || error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <AlertCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Testni boshlashda xatolik ❌</h2>
                    <p className="text-gray-600 mb-8">
                        {error || 'Testni boshlashda xatolik yuz berdi.'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleStartQuiz}
                            className="btn-primary"
                        >
                            Qayta urinib ko'ring
                        </button>
                        <button
                            onClick={() => navigate('/quizzes')}
                            className="btn-secondary"
                        >
                            Testlar ro'yxatiga qaytish
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentQuestion || !quizData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-blue-500 rounded-3xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <AlertCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Test topilmadi 🔍</h2>
                    <p className="text-gray-600 mb-8">Siz izlayotgan test mavjud emas yoki muddati tugagan.</p>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Enhanced Header */}
            <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 px-4 py-4 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/quizzes')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 
                                     px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Testlar ro'yxatiga qaytish</span>
                        </button>
                        <div className="h-6 w-px bg-gray-300" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl 
                                          flex items-center justify-center shadow-lg">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-gray-900">Test davom etmoqda</span>
                                <p className="text-sm text-gray-500">Diqqat bilan javob bering</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Progress */}
                        <div className="hidden sm:flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2">
                            <Target className="w-5 h-5 text-indigo-600" />
                            <span className="text-sm font-semibold text-gray-700">
                                {currentQuestionIndex + 1} / {questions.length}
                            </span>
                        </div>

                        {/* Timer */}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-lg
                                       ${timeRemaining <= 120 ? 'bg-red-100 animate-pulse' : 'bg-blue-50'}`}>
                            <Timer className={`w-5 h-5 ${getTimeColor(timeRemaining)}`} />
                            <span className={getTimeColor(timeRemaining)}>
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                            Savol {currentQuestionIndex + 1} / {questions.length}
                        </span>
                        <span className="text-sm text-gray-500">
                            {answeredCount} / {questions.length} javob berildi
                        </span>
                    </div>
                    <div className="progress-bar h-2">
                        <div
                            className="progress-fill h-2"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 scale-in">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            <div>
                                <h3 className="font-semibold text-red-900">Xatolik yuz berdi</h3>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Question Card */}
                    <div className="lg:col-span-3">
                        <div className="card p-8 mb-8 bg-gradient-to-br from-white to-indigo-50/30 border-indigo-200">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl 
                                              flex items-center justify-center shadow-lg flex-shrink-0">
                                    <span className="text-white font-bold">{currentQuestionIndex + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 leading-relaxed">
                                        {currentQuestion.text}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Eng to'g'ri javobni tanlang
                                    </p>
                                </div>
                            </div>

                            {/* Enhanced Answers */}
                            <div className="space-y-4">
                                {currentQuestion.answers.map((answer, index) => {
                                    const isSelected = selectedAnswers[currentQuestion.id] === answer.id;
                                    const letters = ['A', 'B', 'C', 'D', 'E'];

                                    return (
                                        <button
                                            key={answer.id}
                                            onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                                            className={`w-full p-6 text-left border-2 rounded-2xl transition-all duration-300 
                                                      hover:scale-[1.02] hover:shadow-lg group ${isSelected
                                                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg'
                                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center 
                                                               font-bold text-sm transition-all duration-300 ${isSelected
                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                                        : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                                    }`}>
                                                    {letters[index]}
                                                </div>
                                                <div className="flex-1">
                                                    <span className={`text-lg font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-700'
                                                        }`}>
                                                        {answer.text}
                                                    </span>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${isSelected
                                                        ? 'border-indigo-500 bg-indigo-500'
                                                        : 'border-gray-300 group-hover:border-indigo-400'
                                                    }`}>
                                                    {isSelected && (
                                                        <CheckCircle className="w-6 h-6 text-white -m-0.5" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-2xl 
                                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                                         transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Oldingi
                            </button>

                            <div className="flex items-center gap-4">
                                {!isLastQuestion ? (
                                    <button
                                        onClick={handleNextQuestion}
                                        disabled={!hasAnsweredCurrent}
                                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                                                 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 
                                                 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                                                 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                                    >
                                        Keyingi
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowConfirmSubmit(true)}
                                        disabled={!hasAnsweredCurrent}
                                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 
                                                 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 
                                                 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                                                 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                                    >
                                        <Flag className="w-5 h-5" />
                                        Testni yakunlash
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quiz Info */}
                        <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Test ma'lumotlari
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Jami savollar:</span>
                                    <span className="font-semibold">{questions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Javob berildi:</span>
                                    <span className="font-semibold text-green-600">{answeredCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Qolgan:</span>
                                    <span className="font-semibold text-orange-600">{questions.length - answeredCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Question Navigation Grid */}
                        <div className="card p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-600" />
                                Savollar bo'yicha harakat
                            </h3>
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((_, index) => {
                                    const questionId = questions[index].id;
                                    const isAnswered = !!selectedAnswers[questionId];
                                    const isCurrent = index === currentQuestionIndex;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`aspect-square rounded-xl text-sm font-bold transition-all duration-200 
                                                      hover:scale-110 ${isCurrent
                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                                    : isAnswered
                                                        ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="card p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-600" />
                                Maslahatlar
                            </h3>
                            <ul className="text-sm text-gray-700 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600">•</span>
                                    Har bir savolni diqqat bilan o'qing
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600">•</span>
                                    Vaqtingizni to'g\'ri taqsimlang
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600">•</span>
                                    Ishonchingiz komil bo'lmasa, keyinroq qaytib keling
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Submit Modal */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl scale-in">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full 
                                          flex items-center justify-center mx-auto mb-4">
                                <Flag className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Testni yakunlashni tasdiqlang</h3>
                            <p className="text-gray-600 mb-6">
                                Siz {answeredCount} ta savoldan {questions.length} tasiga javob berdingiz.
                                Testni yakunlashni xohlaysizmi?
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirmSubmit(false)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 
                                             transition-all duration-200"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleSubmitQuiz}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 
                                             text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 
                                             disabled:opacity-50 transition-all duration-200 flex items-center 
                                             justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Yuborilmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Ha, yakunlash
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TakeQuiz;