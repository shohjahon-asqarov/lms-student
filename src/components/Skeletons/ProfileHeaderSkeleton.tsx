import React from "react";

export const ProfileHeaderSkeleton: React.FC = () => (
    <div className="card p-8 flex items-center gap-8">
        <div className="w-32 h-32 rounded-3xl bg-gray-200 animate-pulse" />
        <div className="flex-1 space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    </div>
); 