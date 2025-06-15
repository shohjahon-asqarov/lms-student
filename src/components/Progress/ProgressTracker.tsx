import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, Clock, Award, Zap, BookOpen } from 'lucide-react';

interface Goal {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    deadline?: Date;
    category: 'daily' | 'weekly' | 'monthly' | 'custom';
    icon: 'target' | 'trending' | 'calendar' | 'clock' | 'award' | 'zap' | 'book';
}

interface ProgressTrackerProps {
    goals?: Goal[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ goals = [] }) => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');

    // Mock goals data
    const mockGoals: Goal[] = [
        {
            id: '1',
            title: 'Kunlik Quiz',
            description: 'Kuniga kamida 2 ta quiz yechish',
            target: 2,
            current: 1,
            unit: 'quiz',
            category: 'daily',
            icon: 'target'
        },
        {
            id: '2',
            title: 'Haftalik O\'qish',
            description: 'Haftasiga 5 soat o\'qish',
            target: 5,
            current: 3.5,
            unit: 'soat',
            category: 'weekly',
            icon: 'clock'
        },
        {
            id: '3',
            title: 'Yuqori Natija',
            description: 'O\'rtacha natijani 85% ga yetkazish',
            target: 85,
            current: 78,
            unit: '%',
            category: 'monthly',
            icon: 'trending'
        },
        {
            id: '4',
            title: 'Streak',
            description: '7 kun ketma-ket quiz yechish',
            target: 7,
            current: 4,
            unit: 'kun',
            category: 'weekly',
            icon: 'zap'
        }
    ];

    const allGoals = goals.length > 0 ? goals : mockGoals;

    const filteredGoals = selectedCategory === 'all'
        ? allGoals
        : allGoals.filter(goal => goal.category === selectedCategory);

    const getIcon = (icon: Goal['icon']) => {
        switch (icon) {
            case 'target':
                return <Target className="w-5 h-5" />;
            case 'trending':
                return <TrendingUp className="w-5 h-5" />;
            case 'calendar':
                return <Calendar className="w-5 h-5" />;
            case 'clock':
                return <Clock className="w-5 h-5" />;
            case 'award':
                return <Award className="w-5 h-5" />;
            case 'zap':
                return <Zap className="w-5 h-5" />;
            case 'book':
                return <BookOpen className="w-5 h-5" />;
            default:
                return <Target className="w-5 h-5" />;
        }
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return 'bg-green-500';
        if (percentage >= 75) return 'bg-blue-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getProgressTextColor = (percentage: number) => {
        if (percentage >= 100) return 'text-green-600';
        if (percentage >= 75) return 'text-blue-600';
        if (percentage >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getCategoryColor = (category: Goal['category']) => {
        switch (category) {
            case 'daily':
                return 'bg-blue-100 text-blue-700';
            case 'weekly':
                return 'bg-purple-100 text-purple-700';
            case 'monthly':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getCategoryLabel = (category: Goal['category']) => {
        switch (category) {
            case 'daily':
                return 'Kunlik';
            case 'weekly':
                return 'Haftalik';
            case 'monthly':
                return 'Oylik';
            default:
                return 'Boshqa';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Maqsadlar va Progress</h2>
                        <p className="text-sm text-gray-600">O'qish maqsadlaringizni kuzatib boring</p>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
                {['all', 'daily', 'weekly', 'monthly'].map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category as any)}
                        className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${selectedCategory === category
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
            `}
                    >
                        {category === 'all' ? 'Hammasi' : getCategoryLabel(category as Goal['category'])}
                    </button>
                ))}
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGoals.map((goal) => {
                    const percentage = Math.min((goal.current / goal.target) * 100, 100);
                    const isCompleted = percentage >= 100;

                    return (
                        <div
                            key={goal.id}
                            className={`
                dashboard-card transition-all duration-200 hover:shadow-lg
                ${isCompleted ? 'ring-2 ring-green-200 bg-green-50' : ''}
              `}
                        >
                            {/* Goal Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                  `}>
                                        {getIcon(goal.icon)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                                        <p className="text-sm text-gray-600">{goal.description}</p>
                                    </div>
                                </div>
                                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${getCategoryColor(goal.category)}
                `}>
                                    {getCategoryLabel(goal.category)}
                                </span>
                            </div>

                            {/* Progress */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Progress</span>
                                    <span className={`
                    font-semibold ${getProgressTextColor(percentage)}
                  `}>
                                        {goal.current}/{goal.target} {goal.unit}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`
                      h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}
                      ${isCompleted ? 'animate-pulse' : ''}
                    `}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                {/* Progress Text */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        {percentage.toFixed(1)}% bajarildi
                                    </span>
                                    {isCompleted && (
                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                            <Award className="w-4 h-4" />
                                            Bajarildi!
                                        </span>
                                    )}
                                </div>

                                {/* Deadline */}
                                {goal.deadline && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>Deadline: {goal.deadline.toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add New Goal Button */}
            <div className="text-center">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Target className="w-5 h-5" />
                    Yangi maqsad qo'shish
                </button>
            </div>
        </div>
    );
};

export default ProgressTracker; 