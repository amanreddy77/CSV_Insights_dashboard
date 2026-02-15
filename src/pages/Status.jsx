import { useState, useEffect } from 'react';
import { Activity, Database, Brain, Server, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Status() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}/api/health`);
      setStatus(response.data);
      setLastChecked(new Date());
    } catch (err) {
      console.error('Status check error:', err);
      setError('Unable to connect to backend');
      setStatus({
        backend: 'ERROR',
        database: 'UNKNOWN',
        llm: 'UNKNOWN'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OK':
      case 'CONFIGURED':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'NOT_CONFIGURED':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case 'ERROR':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK':
      case 'CONFIGURED':
        return 'bg-green-100 border-green-300';
      case 'NOT_CONFIGURED':
        return 'bg-yellow-100 border-yellow-300';
      case 'ERROR':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'OK':
        return 'Operational';
      case 'CONFIGURED':
        return 'Configured';
      case 'NOT_CONFIGURED':
        return 'Not Configured';
      case 'ERROR':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
        <p className="text-gray-600">Monitor the health of backend services</p>
      </div>

      {/* Refresh Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {lastChecked && (
            <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
          )}
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
          <XCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Status Cards */}
      <div className="space-y-4">
        {/* Backend Status */}
        <div className={`border rounded-lg p-6 ${getStatusColor(status?.backend)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Server className="h-8 w-8 mr-4 text-gray-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Backend Server</h3>
                <p className="text-sm text-gray-600">Express.js API server</p>
              </div>
            </div>
            <div className="flex items-center">
              {getStatusIcon(status?.backend)}
              <span className="ml-2 font-semibold text-gray-900">
                {getStatusText(status?.backend)}
              </span>
            </div>
          </div>
          {status?.backendError && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded">
              <strong>Error:</strong> {status.backendError}
            </div>
          )}
        </div>

        {/* Database Status */}
        <div className={`border rounded-lg p-6 ${getStatusColor(status?.database)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-8 w-8 mr-4 text-gray-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Database</h3>
                <p className="text-sm text-gray-600">SQLite database connection</p>
              </div>
            </div>
            <div className="flex items-center">
              {getStatusIcon(status?.database)}
              <span className="ml-2 font-semibold text-gray-900">
                {getStatusText(status?.database)}
              </span>
            </div>
          </div>
          {status?.databaseError && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded">
              <strong>Error:</strong> {status.databaseError}
            </div>
          )}
        </div>

        {/* LLM Status */}
        <div className={`border rounded-lg p-6 ${getStatusColor(status?.llm)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-8 w-8 mr-4 text-gray-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">LLM Service</h3>
                <p className="text-sm text-gray-600">OpenAI GPT-4 API</p>
              </div>
            </div>
            <div className="flex items-center">
              {getStatusIcon(status?.llm)}
              <span className="ml-2 font-semibold text-gray-900">
                {getStatusText(status?.llm)}
              </span>
            </div>
          </div>
          {status?.llmError && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded">
              <strong>Error:</strong> {status.llmError}
            </div>
          )}
          {status?.llm === 'NOT_CONFIGURED' && (
            <div className="mt-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded">
              <strong>Note:</strong> OpenAI API key is not configured. Set OPENAI_API_KEY in .env file.
            </div>
          )}
        </div>
      </div>

      {/* System Info */}
      {status && (
        <div className="mt-8 bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
              <dd className="mt-1 text-sm text-gray-900">{status.timestamp}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Overall Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {status.backend === 'OK' && status.database === 'OK' && (status.llm === 'OK' || status.llm === 'CONFIGURED') ? (
                  <span className="text-green-600 font-semibold">All Systems Operational</span>
                ) : (
                  <span className="text-red-600 font-semibold">Some Services Unavailable</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
