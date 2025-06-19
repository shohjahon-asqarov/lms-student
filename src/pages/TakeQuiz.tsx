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
    Loader2
} from 'lucide-react';
import { Question, QuizSubmission } from '../types';
import { quizConfig } from '../config/env';

// Environment variables for quiz settings

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

    // Fetch quiz data when component mounts
    useEffect(() => {
        // If duration is passed via location state, use it for timer
        if (location.state?.duration) {
            const durationInMinutes = location.state.duration;
            setTimeRemaining(durationInMinutes * 60);
        }

        // Always fetch quiz data from API
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

            // Only set timeRemaining if not already set from location state
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

    const handleAnswerSelect = useCallback((questionId: string, answerId: string) => {
        setSelectedAnswers(prev => {
            const currentAnswer = prev[questionId];

            // If the same answer is clicked again, do nothing
            if (currentAnswer === answerId) {
                return prev;
            }

            // Set the new answer
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

            // Pass both result and quiz data to Results page
            navigate(`/results`, {
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Starting Quiz...</h2>
                    <p className="text-gray-600">Please wait while we load your quiz.</p>
                </div>
            </div>
        );
    }

    // Error state
    if (startQuizMutation.isError || error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Start Quiz</h2>
                    <p className="text-gray-600 mb-4">
                        {error || 'An error occurred while starting the quiz.'}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={handleStartQuiz}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate('/quizzes')}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    console.log(currentQuestion, quizData);

    if (!currentQuestion || !quizData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
                    <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist or has expired.</p>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/quizzes')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Quizzes
                        </button>
                        <div className="h-6 w-px bg-gray-300" />
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-900">Quiz in Progress</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-bold text-red-600">
                            <Clock className="w-5 h-5" />
                            {formatTime(timeRemaining)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Question */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {currentQuestion.text}
                        </h2>
                    </div>

                    {/* Answers */}
                    <div className="space-y-3">
                        {currentQuestion.answers.map((answer) => {
                            const isSelected = selectedAnswers[currentQuestion.id] === answer.id;

                            return (
                                <button
                                    key={answer.id}
                                    onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                                    className={`w-full p-4 text-left border rounded-lg transition-all duration-200 ${isSelected
                                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {isSelected ? (
                                                <CheckCircle className="w-6 h-6 text-blue-600" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-gray-900">{answer.label}.</span>
                                            <span className="text-gray-700">{answer.text}</span>
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
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <div className="flex items-center gap-3">
                        {!isLastQuestion ? (
                            <button
                                onClick={handleNextQuestion}
                                disabled={!hasAnsweredCurrent}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={isSubmitting || !hasAnsweredCurrent}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Submit Quiz
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Navigation */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                        {questions.map((_, index) => {
                            const questionId = questions[index].id;
                            const isAnswered = !!selectedAnswers[questionId];
                            const isCurrent = index === currentQuestionIndex;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${isCurrent
                                        ? 'bg-blue-600 text-white'
                                        : isAnswered
                                            ? 'bg-green-100 text-green-700 border border-green-300'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeQuiz; 