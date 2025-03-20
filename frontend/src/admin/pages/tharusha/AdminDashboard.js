import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Simulate fetching data or calculating statistics
    const fetchData = async () => {
      // Sample data for the bar chart
      const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'New Users',
            data: [15, 25, 20, 35, 30, 45],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      };
      setChartData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li>Users</li>
          <li>
            <Link to="/display-restaurant" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Display Restaurant
            </Link>
          </li>
          <li>Settings</li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <button>Profile</button>
            <button>Logout</button>
          </div>
        </header>
        <section className="cards">
          <div className="card">
            <h3>New Signups</h3>
            <p>120</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p>$10,000</p>
          </div>
        </section>
        <section className="chart-section">
          {chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Monthly New Users' },
                },
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
