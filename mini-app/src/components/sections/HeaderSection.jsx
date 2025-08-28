import React from 'react';
import { Link } from 'react-router-dom';

const HeaderSection = ({ user }) => {

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl mr-3">📢</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Doma Event Tracker</h1>
                <p className="text-sm text-gray-600">Domain Event Notifications</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/settings" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ⚙️ Settings
            </Link>
            
            {user && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">👤</span>
                <span>{user.first_name || 'User'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection; 