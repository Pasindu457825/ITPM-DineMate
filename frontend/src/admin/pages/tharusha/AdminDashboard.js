import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [greeting, setGreeting] = useState('');
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Dashboard card data
  const dashboardCards = [
    {
      title: "All Restaurants",
      description: "View and manage all restaurant listings",
      icon: "🍽️",
      link: "/display-restaurant",
      color: "#2c3e50",
      count: 24
    },
    {
      title: "Pending Approvals",
      description: "Review new restaurant submissions",
      icon: "⏳",
      link: "/pending-approvals",
      color: "#e74c3c",
      count: 5
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: "👥",
      link: "/admin/users",
      color: "#27ae60",
      count: 156
    },
    {
      title: "Reports & Analytics",
      description: "View restaurant performance metrics",
      icon: "📊",
      link: "/analytics",
      color: "#f39c12",
      count: null
    }
  ];

  // Stats data
  const statsData = [
    { title: 'Total Restaurants', value: '24', change: '+3', icon: '🍽️', color: '#3498db' },
    { title: 'Active Users', value: '1,245', change: '+12%', icon: '👥', color: '#2ecc71' },
    { title: 'New Reviews', value: '56', change: '+8', icon: '⭐', color: '#f1c40f' },
    { title: 'Revenue', value: '$12,450', change: '+5%', icon: '💰', color: '#9b59b6' }
  ];

  // Activity data
  const activityData = [
    { user: 'Jason Kim', action: 'approved', item: 'Italian Delight Restaurant', time: '10 min ago', avatar: 'JK' },
    { user: 'Sarah Chen', action: 'added', item: 'Sushi Paradise', time: '2 hours ago', avatar: 'SC' },
    { user: 'Mike Johnson', action: 'updated', item: 'Taco Corner', time: '5 hours ago', avatar: 'MJ' },
    { user: 'Emily Davis', action: 'deleted', item: 'Burger Place', time: 'Yesterday', avatar: 'ED' }
  ];

  // Tasks data
  const tasksData = [
    { task: 'Review new restaurant submissions', deadline: 'Today', priority: 'High' },
    { task: 'Update featured restaurants', deadline: 'Tomorrow', priority: 'Medium' },
    { task: 'Respond to user inquiries', deadline: 'Today', priority: 'High' },
    { task: 'Schedule system maintenance', deadline: 'Next week', priority: 'Low' }
  ];

  return (
    <div className="admin-dashboard">
      {/* Header section with greeting and search */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{greeting}, Admin</h1>
          <p>Here's what's happening today</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="user-avatar">
            👤
          </div>
        </div>
      </div>
      
      {/* Statistics summary */}
      <div className="stats-container">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ 
              backgroundColor: `${stat.color}20`,
              color: stat.color
            }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p>{stat.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3>{stat.value}</h3>
                <span className={`stat-change ${stat.change.includes('+') ? 'positive-change' : 'negative-change'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main dashboard cards */}
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Quick Actions</h2>
      <div className="dashboard-cards">
        {dashboardCards.map((card, index) => (
          <Link 
            key={index}
            to={card.link} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="dashboard-card">
              <div className="card-header" style={{ backgroundColor: card.color, color: '#ecf0f1' }}>
                <div className="card-header-icon">
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                
                {card.count !== null && (
                  <div className="card-badge">
                    {card.count}
                  </div>
                )}
              </div>
              
              <div className="card-content">
                <p>{card.description}</p>
                
                <div className="card-action" style={{ color: card.color }}>
                  View Details
                  <span>→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Recent activity section */}
      <div className="bottom-section">
        <div className="activity-panel">
          <h3 className="panel-header">Recent Activity</h3>
          
          {activityData.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-avatar">
                {activity.avatar}
              </div>
              
              <div className="activity-content">
                <p>
                  <span style={{ fontWeight: 'bold' }}>{activity.user}</span>
                  &nbsp;{activity.action}&nbsp;
                  <span style={{ fontWeight: 'bold' }}>{activity.item}</span>
                </p>
                <span className="activity-time">{activity.time}</span>
              </div>
              
              <button className="activity-button">
                Details
              </button>
            </div>
          ))}
        </div>
        
        <div className="tasks-panel">
          <h3 className="panel-header">Pending Tasks</h3>
          
          {tasksData.map((task, index) => (
            <div key={index} className="task-item">
              <input 
                type="checkbox" 
                className="task-checkbox"
              />
              
              <div className="task-content">
                <p>{task.task}</p>
                <div className="task-tags">
                  <span className="task-tag task-date">
                    {task.deadline}
                  </span>
                  <span className={`task-tag priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          <button className="view-all-button">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;