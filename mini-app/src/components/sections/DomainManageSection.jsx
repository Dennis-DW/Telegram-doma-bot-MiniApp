import React from 'react';
import { 
  ManageHeader, 
  ManageDomainsList, 
  useDomainManage 
} from './domainManage';

const DomainManageSection = ({ blockchain }) => {
  const {
    domains,
    loading,
    actionLoading,
    handleRenew,
    handleToggleLock,
    handleBurn,
    refreshDomains
  } = useDomainManage(blockchain);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <ManageHeader 
        onRefresh={refreshDomains} 
        loading={loading} 
      />
      
      <ManageDomainsList
        domains={domains}
        loading={loading}
        actionLoading={actionLoading}
        onRenew={handleRenew}
        onToggleLock={handleToggleLock}
        onBurn={handleBurn}
      />
    </div>
  );
};

export default DomainManageSection; 