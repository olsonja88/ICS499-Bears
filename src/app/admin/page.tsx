"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UserList from "@/components/userlist";
import DanceList from "@/components/DanceList";

// Component that uses useSearchParams
const AdminPageContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<'users' | 'dances'>('users');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login"); // Redirect if no token
                return;
            }

            const response = await fetch("/api/auth/protected", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setIsAdmin(true);
            } else {
                router.push("/"); // Redirect if not an admin
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    // Set active tab based on URL query parameter
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'dances') {
            setActiveTab('dances');
        }
    }, [searchParams]);

    if (isLoading) return <p className="text-white">Loading...</p>;
    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-white">Admin Panel</h1>
                
                {/* Tab Navigation */}
                <div className="border-b border-gray-700 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`${
                                activeTab === 'users'
                                ? 'border-blue-500 text-blue-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveTab('dances')}
                            className={`${
                                activeTab === 'dances'
                                ? 'border-blue-500 text-blue-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Dance Management
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                    {activeTab === 'users' ? (
                        <UserList />
                    ) : (
                        <DanceList />
                    )}
                </div>
            </div>
        </div>
    );
};

// Loading fallback component
const LoadingFallback = () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

// Main component with Suspense boundary
export default function AdminPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AdminPageContent />
        </Suspense>
    );
}
