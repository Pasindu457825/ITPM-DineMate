import React, { useState } from 'react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('shops');

    const renderContent = () => {
        switch (activeTab) {
            case 'shops':
                return <p>Here you can view and manage all your restaurant locations.</p>;
            case 'menu':
                return <p>Here you can manage your food menu items.</p>;
            case 'orders':
                return <p>Here you can view and manage all recent orders.</p>;
            case 'settings':
                return <p>Adjust your settings.</p>;
            default:
                return <p>Select an option from the sidebar to view details.</p>;
        }
    };

    return (
        <div className="flex h-screen bg-black">
            <div className="w-64 p-5 bg-white text-black">
                <h2 className="text-xl font-bold text-gray-800 mb-5">Manager Dashboard</h2>
                <div className="mb-8">
                    <button onClick={() => setActiveTab('shops')} className="w-full p-3 text-left font-semibold rounded-lg bg-gold-500 hover:bg-gold-600 focus:outline-none focus:shadow-outline-gold text-white transition duration-150 ease-in-out">
                        All Shops
                    </button>
                    <button onClick={() => setActiveTab('menu')} className="w-full p-3 text-left font-semibold rounded-lg bg-gold-500 hover:bg-gold-600 focus:outline-none focus:shadow-outline-gold text-white transition duration-150 ease-in-out mt-2">
                        Food Menu
                    </button>
                    <button onClick={() => setActiveTab('orders')} className="w-full p-3 text-left font-semibold rounded-lg bg-gold-500 hover:bg-gold-600 focus:outline-none focus:shadow-outline-gold text-white transition duration-150 ease-in-out mt-2">
                        Orders
                    </button>
                    <button onClick={() => setActiveTab('settings')} className="w-full p-3 text-left font-semibold rounded-lg bg-gold-500 hover:bg-gold-600 focus:outline-none focus:shadow-outline-gold text-white transition duration-150 ease-in-out mt-2">
                        Settings
                    </button>
                </div>
                <button className="w-full p-3 text-left font-semibold rounded-lg bg-gray-600 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray text-white transition duration-150 ease-in-out">
                    Log Out
                </button>
            </div>

            <div className="flex-1 p-10 text-white">
                <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
                <div id="dashboardContent" className="space-y-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

// Tailwind CSS Customization for Gold Color
const styles = {
    '.bg-gold-500': { backgroundColor: '#c0b283' },
    '.bg-gold-600': { backgroundColor: '#b6a577' },
    '.focus\\:shadow-outline-gold': { boxShadow: '0 0 0 3px rgba(192, 178, 131, 0.5)' }
};

// Insert these styles into your global CSS or use a CSS-in-JS approach to apply them
