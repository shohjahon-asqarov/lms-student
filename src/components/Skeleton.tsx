import React from "react";

export const Skeleton: React.FC<{ width?: string; height?: string }> = ({
    width = "w-full",
    height = "h-6",
}) => (
    <div className={`bg-gray-200 animate-pulse rounded ${width} ${height}`}></div>
); 