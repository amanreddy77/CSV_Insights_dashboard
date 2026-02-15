import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Calendar, Loader2, AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}/api/reports/${id}`);
      setReport(response.data);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Error loading report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!report) return;

    const reportText = `CSV Insights Report
Filename: ${report.filename}
Generated: ${new Date(report.created_at).toLocaleString()}

${report.insights}
`;

    navigator.clipboard.writeText(reportText);
    setSuccess('Report copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDownloadReport = () => {
    if (!report) return;

    const reportText = `CSV Insights Report
Filename: ${report.filename}
Generated: ${new Date(report.created_at).toLocaleString()}

${report.insights}

---
Raw Data Summary:
Total Rows: ${report.data.length}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.filename.replace('.csv', '')}-insights.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccess('Report downloaded!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
        <button
          onClick={() => navigate('/reports')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </button>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/reports')}
          className="mb-4 px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.filename}</h1>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(report.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {/* Data Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(report.data[0] || {}).map(column => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.data.slice(0, 10).map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((value, cellIdx) => (
                    <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {value?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Showing 10 of {report.data.length} rows
        </p>
      </div>

      {/* Charts */}
      {report.charts && report.charts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Visualizations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {report.charts.map((chart, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 text-center">{chart.title}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  {chart.type === 'line' ? (
                    <LineChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={chart.xKey} label={{ value: chart.xLabel, position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: chart.yLabel, angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey={chart.yKey} stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  ) : (
                    <BarChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={chart.xKey} label={{ value: chart.xLabel, position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: chart.yLabel, angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={chart.yKey} fill="#3b82f6" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>
        <div className="prose max-w-none">
          <div className="text-gray-700 whitespace-pre-wrap">{report.insights}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Export</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleCopyReport}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </button>
          <button
            onClick={handleDownloadReport}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
