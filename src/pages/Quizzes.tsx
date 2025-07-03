import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuizzes } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import { paginationConfig } from '../config/env';
import {
  Search,
  Filter,
  Eye,
  Clock,
  FileText,
  Users,
  ArrowRight,
  Star,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Play,
  Award
} from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from '../components/Skeleton';
import { ListSkeleton } from '../components/Skeletons/ListSkeleton';

const Quizzes: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(paginationConfig.defaultPageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const navigate = useNavigate();

  const { data: quizzesData, isLoading, error } = useQuizzes(page, pageSize);

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'FINISHED':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: '✅',
          label: 'Yakunlangan'
        };
      case 'PENDING':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: '⏳',
          label: 'Kutilmoqda'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: '❓',
          label: 'Noma\'lum'
        };
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="w-full max-w-3xl">
          <ListSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">Testlarni yuklashda xatolik</h3>
        <p className="text-red-700">Iltimos, sahifani yangilab ko'ring yoki keyinroq urinib ko'ring.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 gradient-text mb-2">
            Mavjud testlar 📚
          </h1>
          <p className="text-gray-600">Testlar orqali bilimlaringizni sinab ko'ring va o'z darajangizni aniqlang</p>
        </div>
        {quizzesData && (
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl px-6 py-3 border border-indigo-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-900">
                  Jami: {quizzesData.meta.total} ta test
                </span>
              </div>
            </div>
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
                         transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Dropdown
              value={filterStatus}
              options={[
                { label: 'Barcha holatlar', value: 'all' },
                { label: 'Kutilmoqda', value: 'PENDING' },
                { label: 'Yakunlangan', value: 'FINISHED' },
              ]}
              onChange={(e) => setFilterStatus(e.value)}
              className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50"
              placeholder="Holatni tanlang"
            />
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

      {/* Enhanced Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzesData?.data.map((quiz, index) => {
          const difficultyConfig = getDifficultyConfig(quiz.difficulty);
          const statusConfig = getStatusConfig(quiz.status);

          return (
            <div
              key={quiz.id}
              className="card-interactive group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 
                            rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 
                            transition-opacity duration-300"></div>

              <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 
                                 transition-colors duration-200">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {quiz.description || `Test ${quiz.questionCount} ta savoldan iborat`}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl 
                                  flex items-center justify-center shadow-lg group-hover:shadow-xl 
                                  transition-all duration-300 group-hover:scale-110">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{quiz.totalQuestions || quiz.questionCount}</p>
                      <p className="text-xs text-gray-500">Savollar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{quiz.duration}</p>
                      <p className="text-xs text-gray-500">Daqiqa</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyConfig.color}`}>
                    {difficultyConfig.icon} {difficultyConfig.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                </div>

                {/* Progress Bar (if applicable) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>Tayyorlik darajasi</span>
                    <span>85%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/take-quiz/${quiz.id}`, {
                    state: {
                      duration: quiz.duration,
                      quizData: quiz
                    }
                  })}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 
                           hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold 
                           transition-all duration-300 shadow-lg hover:shadow-xl 
                           transform hover:-translate-y-1 active:translate-y-0
                           flex items-center justify-center gap-2 group"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  Testni boshlash
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Empty State */}
      {quizzesData?.data.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full 
                        flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Testlar mavjud emas</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm
              ? 'Qidiruv so\'zlarini o\'zgartirib ko\'ring yoki filtrlarni qayta sozlang.'
              : 'Hozircha siz uchun testlar mavjud emas. Tez orada yangi testlar qo\'shiladi.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterDifficulty('all');
            }}
            className="btn-primary"
          >
            Filtrlarni tozalash
          </button>
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
  );
};

export default Quizzes;