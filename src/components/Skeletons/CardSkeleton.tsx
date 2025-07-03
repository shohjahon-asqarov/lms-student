import React from "react";

export const CardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-4">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
        <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
    </div>
); 