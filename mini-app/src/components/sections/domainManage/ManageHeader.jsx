import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../../ui';

const ManageHeader = ({ onRefresh, loading }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Domain Management</h1>
        <p className="text-gray-600">Manage your domain portfolio</p>
      </div>
      <Button
        icon={RefreshCw}
        onClick={onRefresh}
        loading={loading}
        variant="outline"
        size="medium"
      >
        Refresh
      </Button>
    </div>
  );
};

export default ManageHeader; 