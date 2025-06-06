import React from 'react';
import StaffNavigation from '../components/StaffNavigation';

const StaffLayout = ({ children }) => {
  return (
    <div className="staff-layout">
      <StaffNavigation />
      <main className="staff-main-content">
        {children}
      </main>
    </div>
  );
};

// Add styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .staff-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f5f5f5;
  }

  .staff-main-content {
    flex-grow: 1;
    padding: 24px;
    margin-left: 240px; /* Same as navigation width */
    min-height: 100vh;
    background-color: #f5f5f5;
    transition: margin-left 0.3s ease;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .staff-main-content {
      margin-left: 0;
      padding: 16px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default StaffLayout; 