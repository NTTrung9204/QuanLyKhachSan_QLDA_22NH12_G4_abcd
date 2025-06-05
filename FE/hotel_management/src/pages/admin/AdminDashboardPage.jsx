import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
    const adminLinks = [
        { 
            path: '/admin/rooms', 
            name: 'Manage Rooms',
            icon: '🏠',
            color: '#4f46e5', // Indigo
            hoverColor: '#4338ca'
        },
        { 
            path: '/admin/services', 
            name: 'Manage Services',
            icon: '🛎️',
            color: '#0891b2', // Cyan
            hoverColor: '#0e7490'
        },
        { 
            path: '/admin/images', 
            name: 'Manage Images',
            icon: '🖼️',
            color: '#059669', // Emerald
            hoverColor: '#047857'
        },
        { 
            path: '/admin/facilities', 
            name: 'Manage Facilities',
            icon: '⚡',
            color: '#ca8a04', // Yellow
            hoverColor: '#a16207'
        },
        { 
            path: '/admin/type-rooms', 
            name: 'Manage Room Types',
            icon: '🎯',
            color: '#be185d', // Pink
            hoverColor: '#9d174d'
        },
    ];

    return (
        <div style={{ 
            padding: '40px', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
            minHeight: '100vh' 
        }}>
            <h1 style={{ 
                marginBottom: '40px', 
                textAlign: 'center', 
                color: '#1e293b',
                fontSize: '2.5rem',
                fontWeight: '700',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                Admin Dashboard
            </h1>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '25px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {adminLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px',
                            padding: '30px 20px',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: '#1e293b',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease-in-out',
                            border: `2px solid ${link.color}`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.backgroundColor = link.color;
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.color = '#1e293b';
                        }}
                    >
                        <span style={{ fontSize: '2.5rem' }}>{link.icon}</span>
                        <span style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: '600',
                            textAlign: 'center'
                        }}>
                            {link.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardPage; 