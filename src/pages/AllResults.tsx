import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizzes } from '../hooks/useQueries';
import Pagination from '../components/Pagination';
import { BarChart3, Search, FileText, Clock, FileText as FileIcon } from 'lucide-react';
import { paginationConfig } from '../config/env';

const AllResults: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(paginationConfig.defaultPageSize);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: quizzesData, isLoading, error } = useQuizzes(page, pageSize);

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }
    if (error) {
        return <div className="bg-red-50 border border-red-200 rounded-lg p-4">Xatolik: testlar yuklanmadi</div>;
    }

    // Filter only completed quizzes
    let completedQuizzes = quizzesData?.data.filter((quiz) => quiz.status === 'FINISHED') || [];
    if (searchTerm) {
        completedQuizzes = completedQuizzes.filter((quiz) =>
            quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Yakunlangan testlar</h1>
                    <p className="text-gray-600">Faqat yakunlangan testlar ro'yxati</p>
                </div>
                {quizzesData && (
                    <div className="text-sm text-gray-600">
                        Jami: {quizzesData.meta.total} test
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
                                placeholder="Test nomi bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quizzes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedQuizzes.map((quiz) => (
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
                                <FileIcon className="w-4 h-4" />
                                {quiz.totalQuestions || '-'} ta savol
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {quiz.duration} daqiqa
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => navigate(`/my-quiz-result/${quiz.id}`)}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Natijani ko'rish
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {completedQuizzes.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Yakunlangan testlar topilmadi</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm ? "Qidiruv bo'yicha natija topilmadi." : "Hali yakunlangan testlar yo'q."}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {quizzesData && quizzesData.meta.pageCount > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={quizzesData.meta.pageCount}
                    totalItems={quizzesData.meta.total}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    showPageSizeSelector={true}
                    showQuickJumper={true}
                />
            )}
        </div>
    );
};

export default AllResults; 