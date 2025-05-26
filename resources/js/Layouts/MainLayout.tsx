import React, { ReactNode } from "react";
import Navbar from "../Components/Navbar";

type MainLayoutProps = {
    children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <main className="p-6 max-w-7xl mx-auto">{children}</main>
        </div>
    );
}
