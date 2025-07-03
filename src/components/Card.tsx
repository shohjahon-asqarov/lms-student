import React from "react";

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        {children}
    </div>
); 