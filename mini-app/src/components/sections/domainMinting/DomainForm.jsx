import React from 'react';
import { Plus } from 'lucide-react';
import { Card, Input, Button, DomainAvailabilityChecker } from '../../ui';

const DomainForm = ({ 
  formData, 
  loading, 
  blockchain, 
  domainAvailability,
  gasEstimate,
  onInputChange, 
  onAvailabilityChange, 
  onSubmit 
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Domain Name
        </label>
        <div className="flex">
          <input
            type="text"
            name="sld"
            value={formData.sld}
            onChange={onInputChange}
            placeholder="example"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 font-medium">
            .{formData.tld}
          </span>
        </div>
        
        {/* Domain Availability Checker */}
        <DomainAvailabilityChecker
          domainName={formData.sld}
          contract={blockchain?.contract}
          onAvailabilityChange={onAvailabilityChange}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Top Level Domain
          </label>
          <select
            name="tld"
            value={formData.tld}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="doma">doma</option>
            <option value="test">test</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (Years)
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
            <option value="5">5 Years</option>
            <option value="10">10 Years</option>
          </select>
        </div>
      </div>

      {/* Gas Estimation */}
      {gasEstimate && (
        <Card className="bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Gas Estimation</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>Estimated Gas: {gasEstimate.gas}</div>
            <div>Gas Price: {gasEstimate.gasPrice} wei</div>
            <div>Estimated Cost: {parseInt(gasEstimate.gas) * parseInt(gasEstimate.gasPrice) / 1e18} ETH</div>
          </div>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Domain Preview</h4>
        <div className="text-lg font-mono text-blue-700">
          {formData.sld ? `${formData.sld}.${formData.tld}` : 'Enter domain name'}
        </div>
      </Card>

      <div className="text-center">
        <Button
          type="submit"
          loading={loading}
          disabled={!formData.sld.trim() || !blockchain?.contract || (domainAvailability && !domainAvailability.available)}
          icon={Plus}
          size="large"
        >
          Mint Domain
        </Button>
      </div>
    </form>
  );
};

export default DomainForm; 