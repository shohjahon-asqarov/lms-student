import React from 'react';
import { Award, Star, Target, Zap, BookOpen, Trophy, Medal, Crown } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: 'award' | 'star' | 'target' | 'zap' | 'book' | 'trophy' | 'medal' | 'crown';
    category: 'quiz' | 'streak' | 'score' | 'time' | 'special';
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
    unlockedAt?: Date;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementBadgeProps {
    achievement: Achievement;
    onClick?: () => void;
    showProgress?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
    achievement,
    onClick,
    showProgress = true
}) => {
    const getIcon = (icon: Achievement['icon']) => {
        switch (icon) {
            case 'award':
                return <Award className="w-6 h-6" />;
            case 'star':
                return <Star className="w-6 h-6" />;
            case 'target':
                return <Target className="w-6 h-6" />;
            case 'zap':
                return <Zap className="w-6 h-6" />;
            case 'book':
                return <BookOpen className="w-6 h-6" />;
            case 'trophy':
                return <Trophy className="w-6 h-6" />;
            case 'medal':
                return <Medal className="w-6 h-6" />;
            case 'crown':
                return <Crown className="w-6 h-6" />;
            default:
                return <Award className="w-6 h-6" />;
        }
    };

    const getRarityColor = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common':
                return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'rare':
                return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'epic':
                return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'legendary':
                return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getRarityGradient = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common':
                return 'from-gray-400 to-gray-500';
            case 'rare':
                return 'from-blue-400 to-blue-500';
            case 'epic':
                return 'from-purple-400 to-purple-500';
            case 'legendary':
                return 'from-yellow-400 to-yellow-500';
            default:
                return 'from-gray-400 to-gray-500';
        }
    };

    const progressPercentage = achievement.progress && achievement.maxProgress
        ? (achievement.progress / achievement.maxProgress) * 100
        : 0;

    return (
        <div
            className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${achievement.unlocked
                    ? getRarityColor(achievement.rarity)
                    : 'bg-gray-50 text-gray-400 border-gray-200 opacity-60'
                }
        ${onClick ? 'hover:scale-105 hover:shadow-md' : ''}
      `}
            onClick={onClick}
        >
            {/* Rarity indicator */}
            <div className="absolute -top-1 -right-1">
                <div className={`
          w-3 h-3 rounded-full bg-gradient-to-r ${getRarityGradient(achievement.rarity)}
          ${achievement.unlocked ? 'opacity-100' : 'opacity-30'}
        `} />
            </div>

            {/* Icon */}
            <div className={`
        w-12 h-12 rounded-lg flex items-center justify-center mb-3
        ${achievement.unlocked
                    ? `bg-gradient-to-r ${getRarityGradient(achievement.rarity)} text-white`
                    : 'bg-gray-200 text-gray-400'
                }
      `}>
                {getIcon(achievement.icon)}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm mb-1">
                {achievement.title}
            </h3>

            {/* Description */}
            <p className="text-xs mb-3 line-clamp-2">
                {achievement.description}
            </p>

            {/* Progress Bar */}
            {showProgress && achievement.progress !== undefined && achievement.maxProgress && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`
                h-2 rounded-full transition-all duration-300
                ${achievement.unlocked
                                    ? `bg-gradient-to-r ${getRarityGradient(achievement.rarity)}`
                                    : 'bg-gray-300'
                                }
              `}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Unlocked Date */}
            {achievement.unlocked && achievement.unlockedAt && (
                <div className="mt-2 text-xs opacity-70">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                </div>
            )}

            {/* Locked State */}
            {!achievement.unlocked && (
                <div className="mt-2 text-xs opacity-70">
                    Not unlocked yet
                </div>
            )}
        </div>
    );
};

export default AchievementBadge; 