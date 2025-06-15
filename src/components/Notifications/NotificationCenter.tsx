import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Clock, Award } from 'lucide-react';

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'info' | 'quiz' | 'achievement';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    action?: {
        label: string;
        url: string;
    };
}

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'quiz',
            title: 'Yangi Quiz Mavjud!',
            message: 'JavaScript Fundamentals quizi tayyor. Hozir boshlang!',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: false,
            action: {
                label: 'Quizni boshlash',
                url: '/quizzes'
            }
        },
        {
            id: '2',
            type: 'achievement',
            title: 'Yangi Achievement!',
            message: 'Siz "Quick Learner" unvonini qo\'lga kiritdingiz!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false,
            action: {
                label: 'Ko\'rish',
                url: '/profile'
            }
        },
        {
            id: '3',
            type: 'success',
            title: 'Quiz muvaffaqiyatli yakunlandi!',
            message: 'React Basics quizida 85% natija qayd etildi.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            read: true,
            action: {
                label: 'Natijalarni ko\'rish',
                url: '/results'
            }
        },
        {
            id: '4',
            type: 'warning',
            title: 'Quiz vaqti tugayapti',
            message: 'Python Basics quizida 5 daqiqa qoldi.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            read: true
        }
    ]);

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const count = notifications.filter(n => !n.read).length;
        setUnreadCount(count);
    }, [notifications]);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            case 'quiz':
                return <Clock className="w-5 h-5 text-purple-500" />;
            case 'achievement':
                return <Award className="w-5 h-5 text-orange-500" />;
            default:
                return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    const getNotificationColor = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return 'border-l-green-500 bg-green-50';
            case 'warning':
                return 'border-l-yellow-500 bg-yellow-50';
            case 'info':
                return 'border-l-blue-500 bg-blue-50';
            case 'quiz':
                return 'border-l-purple-500 bg-purple-50';
            case 'achievement':
                return 'border-l-orange-500 bg-orange-50';
            default:
                return 'border-l-gray-500 bg-gray-50';
        }
    };

    const formatTime = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) {
            return `${minutes} daqiqa oldin`;
        } else if (hours < 24) {
            return `${hours} soat oldin`;
        } else {
            return `${days} kun oldin`;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={onClose}
            />

            {/* Notification Panel */}
            <div className="fixed top-16 right-4 w-96 max-h-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">Bildirishnomalar</h3>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                Hammasini o'qilgan deb belgilash
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Hozircha bildirishnomalar yo'q</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${getNotificationColor(notification.type)
                                        } ${!notification.read ? 'bg-white' : ''}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    {notification.title}
                                                </h4>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-400">
                                                    {formatTime(notification.timestamp)}
                                                </span>
                                                {notification.action && (
                                                    <a
                                                        href={notification.action.url}
                                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {notification.action.label}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                        <a
                            href="/notifications"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Barcha bildirishnomalarni ko'rish
                        </a>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationCenter; 