import React from "react";

export const FormSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-12 bg-gray-200 rounded animate-pulse w-1/3" />
    </div>
); 