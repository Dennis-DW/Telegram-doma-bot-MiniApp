import React from 'react';
import {
  DashboardHeader,
  StatsSection,
  DomainsList,
  useDashboard
} from './dashboard';

const DashboardSection = ({ blockchain }) => {
  const {
    domains,
    loading,
    stats,
    getDomainStatus,
    formatExpiryDate
  } = useDashboard(blockchain);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <DashboardHeader />
      <StatsSection stats={stats} />
      <DomainsList
        domains={domains}
        loading={loading}
        getDomainStatus={getDomainStatus}
        formatExpiryDate={formatExpiryDate}
      />
    </div>
  );
};

export default DashboardSection; 