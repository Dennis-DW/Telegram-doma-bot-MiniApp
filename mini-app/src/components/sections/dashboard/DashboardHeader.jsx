import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import { Button } from '../../ui';

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Domain Dashboard</h1>
        <p className="text-gray-600">Manage and monitor your domains</p>
      </div>
      <div className="flex space-x-3">
        <Link to="/mint">
          <Button icon={Plus} size="medium">
            Mint Domain
          </Button>
        </Link>
        <Link to="/manage">
          <Button icon={Settings} size="medium" variant="outline">
            Manage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader; 