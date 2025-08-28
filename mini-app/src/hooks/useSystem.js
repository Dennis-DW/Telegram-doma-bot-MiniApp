// mini-app/src/hooks/useSystem.js
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useSystem = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [apiDocs, setApiDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSystemInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getSystemInfo();
      setSystemInfo(data.data || data);
    } catch (err) {
      console.error('Failed to fetch system info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const data = await apiService.healthCheck();
      setHealthStatus(data.data || data);
      return data.data || data;
    } catch (err) {
      console.error('Health check failed:', err);
      setHealthStatus({ status: 'ERROR', error: err.message });
      throw err;
    }
  }, []);

  const fetchApiDocs = useCallback(async () => {
    try {
      const data = await apiService.getApiDocs();
      setApiDocs(data.data || data);
    } catch (err) {
      console.error('Failed to fetch API docs:', err);
      setError(err.message);
    }
  }, []);


  // Check if system is healthy
  const isHealthy = useCallback(() => {
    return healthStatus?.status === 'OK';
  }, [healthStatus]);

  // Get system uptime
  const getUptime = useCallback(() => {
    if (!systemInfo?.uptime) return null;
    
    const seconds = Math.floor(systemInfo.uptime);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }, [systemInfo]);

  // Get memory usage
  const getMemoryUsage = useCallback(() => {
    if (!systemInfo?.memory) return null;
    
    const { rss, heapUsed, heapTotal } = systemInfo.memory;
    const mb = 1024 * 1024;
    
    return {
      rss: Math.round(rss / mb),
      heapUsed: Math.round(heapUsed / mb),
      heapTotal: Math.round(heapTotal / mb)
    };
  }, [systemInfo]);

  // Get system version
  const getVersion = useCallback(() => {
    return systemInfo?.version || 'Unknown';
  }, [systemInfo]);

  // Get environment
  const getEnvironment = useCallback(() => {
    return systemInfo?.environment || 'Unknown';
  }, [systemInfo]);

  useEffect(() => {
    fetchSystemInfo();
    checkHealth();
    fetchApiDocs();
  }, [fetchSystemInfo, checkHealth, fetchApiDocs]);

  return {
    // State
    systemInfo,
    healthStatus,
    apiDocs,
    loading,
    error,
    
    // Computed values
    isHealthy: isHealthy(),
    uptime: getUptime(),
    memoryUsage: getMemoryUsage(),
    version: getVersion(),
    environment: getEnvironment(),
    
    // Actions
    refreshSystemInfo: fetchSystemInfo,
    checkHealth,
    refreshApiDocs: fetchApiDocs
  };
};
