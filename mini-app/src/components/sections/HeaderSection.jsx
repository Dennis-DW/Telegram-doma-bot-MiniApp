import React from 'react';
import { Link } from 'react-router-dom';

const HeaderSection = ({ user, apiStatus }) => {

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <Link to="/" className="flex items-center min-w-0">
              <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">📢</div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Doma Event Tracker</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Domain Event Notifications</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* API Status Indicator */}
            {apiStatus && (
              <div className={`hidden sm:flex items-center px-2 py-1 rounded-full text-xs ${
                apiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
                apiStatus === 'error' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  apiStatus === 'connected' ? 'bg-green-500' : 
                  apiStatus === 'error' ? 'bg-red-500' : 
                  'bg-yellow-500'
                }`}></div>
                {apiStatus === 'connected' ? 'Connected' : 
                 apiStatus === 'error' ? 'Error' : 'Checking'}
              </div>
            )}
            
            <Link 
              to="/settings" 
              className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base flex items-center"
            >
              <span className="sm:hidden">⚙️</span>
              <span className="hidden sm:inline">⚙️ Settings</span>
            </Link>
            
            {user && (
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <span className="mr-1 sm:mr-2">👤</span>
                <span className="hidden sm:inline">{user.first_name || 'User'}</span>
                <span className="sm:hidden">User</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection; 