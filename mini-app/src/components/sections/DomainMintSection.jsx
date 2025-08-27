import React from 'react';
import { Card, TransactionStatus } from '../ui';
import { 
  DomainForm, 
  InformationSection, 
  HeaderSection, 
  useDomainMinting 
} from './domainMinting';

const DomainMintSection = ({ blockchain }) => {
  const {
    formData,
    loading,
    transactionStatus,
    domainAvailability,
    gasEstimate,
    handleInputChange,
    handleAvailabilityChange,
    handleMint,
    clearTransactionStatus
  } = useDomainMinting(blockchain);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <HeaderSection />

      <Card>
        <DomainForm
          formData={formData}
          loading={loading}
          blockchain={blockchain}
          domainAvailability={domainAvailability}
          gasEstimate={gasEstimate}
          onInputChange={handleInputChange}
          onAvailabilityChange={handleAvailabilityChange}
          onSubmit={handleMint}
        />

        {/* Transaction Status */}
        <TransactionStatus
          status={transactionStatus?.type}
          message={transactionStatus?.message}
          txHash={transactionStatus?.txHash}
          receipt={transactionStatus?.receipt}
          onClose={clearTransactionStatus}
        />
      </Card>

      <InformationSection />
    </div>
  );
};

export default DomainMintSection; 