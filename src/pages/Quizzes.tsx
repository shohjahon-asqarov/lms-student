import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuizzes } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import Pagination from '../components/Pagination';
import { paginationConfig } from '../config/env';
import {
  Search,
  Filter,
  Eye,
  Clock,
  FileText,
  Users,
  ArrowRight
} from 'lucide-react';
import { sendTelegramResult } from '../utils/telegram';

const Quizzes: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(paginationConfig.defaultPageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const { data: quizzesData, isLoading, error } = useQuizzes(page, pageSize);

  const getDifficultyColor = (difficulty: string | undefined) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading quizzes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Quizzes</h1>
          <p className="text-gray-600">Take quizzes to test your knowledge</p>
        </div>
        {quizzesData && (
          <div className="text-sm text-gray-600">
            Total: {quizzesData.meta.total} quizzes
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="dashboard-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="FINISHED">Finished</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzesData?.data.map((quiz) => (
          <div key={quiz.id} className="dashboard-card hover:scale-105 group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {quiz.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {quiz.description}
                </p>
              </div>
            </div>

            {/* Quiz Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                {quiz.totalQuestions} questions
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {quiz.duration} minutes
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.status === 'FINISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {quiz.status === 'FINISHED' ? 'Finished' : 'Pending'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate(`/take-quiz/${quiz.id}`, {
                  state: {
                    duration: quiz.duration,
                    quizData: quiz  // Pass full quiz data
                  }
                })}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {quizzesData?.data.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'No quizzes are currently available for you to take.'}
          </p>
        </div>
      )}

      {/* Enhanced Pagination */}
      {quizzesData && quizzesData.meta.pageCount > 1 && (
        <Pagination
          currentPage={page}
          totalPages={quizzesData.meta.pageCount}
          totalItems={quizzesData.meta.total}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showPageSizeSelector={true}
          showQuickJumper={true}
        />
      )}
    </div>
  );
};

export default Quizzes;