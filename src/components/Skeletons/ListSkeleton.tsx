import React from "react";

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse" />
        ))}
    </div>
); 