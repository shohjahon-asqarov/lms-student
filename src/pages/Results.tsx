import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuiz } from '../hooks/useQueries';
import {
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ArrowLeft,
  BarChart3,
  Calendar,
  Send
} from 'lucide-react';
import { QuizFinishResponse } from '../types';
import { sendTelegramResult } from '../utils/telegram';
import { toast } from 'react-toastify';

function getScoreColor(percentage: number) {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreBgColor(percentage: number) {
  if (percentage >= 80) return 'bg-green-100';
  if (percentage >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
}

function getPerformanceLabel(percentage: number) {
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Good';
  if (percentage >= 40) return 'Fair';
  return 'Needs Improvement';
}

function renderScoreCard(percentage: number, correctAnswers: number, totalQuestions: number, incorrectAnswers: number) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Score */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBgColor(percentage)} mb-4`}>
          <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Score</h3>
        <p className="text-gray-600">{correctAnswers} / {totalQuestions} correct</p>
      </div>
      {/* Correct Answers */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Correct</h3>
        <p className="text-green-600 font-bold text-xl">{correctAnswers}</p>
      </div>
      {/* Incorrect Answers */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Incorrect</h3>
        <p className="text-red-600 font-bold text-xl">{incorrectAnswers}</p>
      </div>
      {/* Performance */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-4">
          <BarChart3 className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Performance</h3>
        <p className={`font-medium ${getScoreColor(percentage)}`}>{getPerformanceLabel(percentage)}</p>
      </div>
    </div>
  );
}

function renderQuestionDetails(result: QuizFinishResponse) {
  return (
    <div className="space-y-4">
      {result.data.map((questionResult, index) => (
        <div key={questionResult.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {questionResult.user_result ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                <span className={`text-sm font-medium ${questionResult.user_result ? 'text-green-600' : 'text-red-600'}`}>
                  {questionResult.user_result ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <p className="text-gray-900 mb-2">{questionResult.text}</p>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Correct Answer:</span> {questionResult.result.text}
                </p>
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

  // Get result and quiz data from location state
  const result: QuizFinishResponse = location.state?.result;
  const quizData = location.state?.quizData;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Result Not Found</h2>
          <p className="text-gray-600 mb-4">The quiz result you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/results')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back to Results
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = result.data.length;
  const correctAnswers = result.correntCount;
  const incorrectAnswers = result.inCorrentCount;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const formatDate = (date: Date) => {
    const months = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
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
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown';
    const userPhone = user?.phone || 'Unknown';

    const message = `📊 <b>Quiz Result - Detailed Report</b>\n\n` +
      `👤 <b>User Information:</b>\n` +
      `   • Name: ${userName}\n` +
      `   • Phone: ${userPhone}\n` +
      `   • Role: ${user?.role || 'Unknown'}\n\n` +
      `📝 <b>Quiz Information:</b>\n` +
      `   • Title: ${quizData?.title || 'Unknown Quiz'}\n` +
      `   • Duration: ${quizData?.duration || 'Unknown'} minutes\n` +
      `   • Difficulty: ${quizData?.difficulty || 'Unknown'}\n` +
      `   • Status: ${quizData?.status || 'Unknown'}\n` +
      `   • Created: ${quizData?.createdAt ? new Date(quizData.createdAt).toLocaleDateString('uz-UZ') : 'Unknown'}\n\n` +
      `📈 <b>Performance Results:</b>\n` +
      `   • Score: ${percentage}%\n` +
      `   • Correct Answers: ${correctAnswers}/${totalQuestions}\n` +
      `   • Incorrect Answers: ${incorrectAnswers}/${totalQuestions}\n` +
      `   • Performance: ${getPerformanceLabel(percentage)}\n\n` +
      `⏰ <b>Completion Time:</b>\n` +
      `   • ${currentDate}\n\n` +
      `🎯 <b>Detailed Breakdown:</b>\n` +
      `   • Questions Answered: ${totalQuestions}\n` +
      `   • Success Rate: ${((correctAnswers / totalQuestions) * 100).toFixed(1)}%\n` +
      `   • Error Rate: ${((incorrectAnswers / totalQuestions) * 100).toFixed(1)}%`;

    try {
      await sendTelegramResult(message);
      setTelegramSent(true);
      toast.success('Detailed result sent to Telegram!');
    } catch (e) {
      toast.error('Failed to send result to Telegram.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/results')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Results
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Quiz Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
            <p className="text-gray-600">Here are your results</p>
          </div>
          {renderScoreCard(percentage, correctAnswers, totalQuestions, incorrectAnswers)}
        </div>

        {/* Quiz Information Card */}
        {quizData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Quiz Title</p>
                <p className="font-medium text-gray-900">{quizData.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium text-gray-900">{quizData.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-medium text-gray-900">{quizData.difficulty || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-gray-900">{quizData.status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Details</h2>
          {renderQuestionDetails(result)}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/quizzes')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Take Another Quiz
          </button>
          <button
            onClick={() => navigate('/results')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            View All Results
          </button>
          <button
            onClick={() => handleSendTelegram()}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 flex items-center gap-2"
            disabled={telegramSent}
          >
            <Send className="w-4 h-4" />
            {telegramSent ? 'Sent!' : 'Send Detailed Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;