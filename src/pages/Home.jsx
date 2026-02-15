import { useState, useRef } from 'react';
import {
  Upload, Download, Copy, Save, FileText, BarChart3,
  MessageSquare, AlertCircle, CheckCircle2, Loader2, X, Brain
} from 'lucide-react';
import axios from 'axios';
import Papa from 'papaparse';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [insights, setInsights] = useState('');
  const [charts, setCharts] = useState([]);
  const [filename, setFilename] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData);

      setData(response.data.data);
      setColumns(response.data.columns);
      setSelectedColumns(response.data.columns);
      setInsights(response.data.insights);
      setCharts(response.data.charts || []);
      setFilename(response.data.filename);
      setSuccess('CSV analyzed successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Error uploading file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(c => c !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const handleSaveReport = async () => {
    if (!data || !insights) {
      setError('No report to save');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/api/reports`, {
        filename,
        insights,
        data,
        charts
      });

      setSuccess('Report saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Error saving report');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!insights) {
      setError('No report to copy');
      return;
    }

    const reportText = `CSV Insights Report
Filename: ${filename}
Generated: ${new Date().toLocaleString()}

${insights}
`;

    navigator.clipboard.writeText(reportText);
    setSuccess('Report copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDownloadReport = () => {
    if (!insights) {
      setError('No report to download');
      return;
    }

    const reportText = `CSV Insights Report
Filename: ${filename}
Generated: ${new Date().toLocaleString()}

${insights}

---
Raw Data Summary:
Total Rows: ${data.length}
Columns: ${columns.join(', ')}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace('.csv', '')}-insights.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccess('Report downloaded!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFollowUpQuestion = async () => {
    if (!followUpQuestion.trim()) {
      setError('Please enter a question');
      return;
    }

    if (!data) {
      setError('Please upload and analyze a CSV first');
      return;
    }

    setFollowUpLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/followup`, {
        data,
        filename,
        question: followUpQuestion
      });

      setFollowUpAnswer(response.data.answer);
    } catch (err) {
      console.error('Follow-up error:', err);
      setError(err.response?.data?.error || 'Error processing question');
    } finally {
      setFollowUpLoading(false);
    }
  };

  const filteredData = data ? data.map(row => {
    const filtered = {};
    selectedColumns.forEach(col => {
      filtered[col] = row[col];
    });
    return filtered;
  }) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-6">
        <div className="inline-block p-1.5 bg-blue-100 rounded-full mb-2">
          <BarChart3 className="h-7 w-7 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CSV Insights Dashboard
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Transform your data into actionable insights with AI-powered analysis
        </p>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-5 text-center text-gray-900">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center group">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110">
              <span className="text-white font-semibold text-lg">1</span>
            </div>
            <h3 className="font-semibold mb-1 text-gray-900 text-sm">Upload CSV</h3>
            <p className="text-xs text-gray-500">Select and upload your CSV file</p>
          </div>
          <div className="text-center group">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110">
              <span className="text-white font-semibold text-lg">2</span>
            </div>
            <h3 className="font-semibold mb-1 text-gray-900 text-sm">AI Analysis</h3>
            <p className="text-xs text-gray-500">Get AI-powered insights and trends</p>
          </div>
          <div className="text-center group">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110">
              <span className="text-white font-semibold text-lg">3</span>
            </div>
            <h3 className="font-semibold mb-1 text-gray-900 text-sm">Review & Customize</h3>
            <p className="text-xs text-gray-500">View charts and select columns</p>
          </div>
          <div className="text-center group">
            <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110">
              <span className="text-white font-semibold text-lg">4</span>
            </div>
            <h3 className="font-semibold mb-1 text-gray-900 text-sm">Save & Export</h3>
            <p className="text-xs text-gray-500">Save or download your report</p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
          <button onClick={() => setError('')} className="ml-auto">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          {success}
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
            <Upload className="h-6 w-6 mr-2 text-blue-600" />
            Upload Your CSV File
          </h2>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />

          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Click to browse or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                Supported format: CSV files only
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <FileText className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                <p className="text-lg font-medium text-gray-900 mb-1">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setFile(null);
                    setError('');
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center font-medium shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Analyze CSV
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {data && (
        <>
          {/* Column Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Columns to Display</h2>
            <div className="flex flex-wrap gap-2">
              {columns.map(column => (
                <button
                  key={column}
                  onClick={() => handleColumnToggle(column)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedColumns.includes(column)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {column}
                </button>
              ))}
            </div>
          </div>

          {/* Data Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedColumns.map(column => (
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
                  {filteredData.slice(0, 10).map((row, idx) => (
                    <tr key={idx}>
                      {selectedColumns.map(column => (
                        <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row[column]?.toString() || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Showing 10 of {data.length} rows
            </p>
          </div>

          {/* Charts */}
          {charts.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                Visualizations
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {charts.map((chart, idx) => (
                  <div key={idx} className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
                    <h3 className="font-semibold mb-4 text-center text-lg text-gray-800">{chart.title}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      {chart.type === 'line' ? (
                        <LineChart data={chart.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey={chart.xKey} label={{ value: chart.xLabel, position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: chart.yLabel, angle: -90, position: 'insideLeft' }} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                          <Legend />
                          <Line type="monotone" dataKey={chart.yKey} stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                        </LineChart>
                      ) : (
                        <BarChart data={chart.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey={chart.xKey} label={{ value: chart.xLabel, position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: chart.yLabel, angle: -90, position: 'insideLeft' }} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                          <Legend />
                          <Bar dataKey={chart.yKey} fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-8 mb-8 border border-blue-100">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Brain className="h-6 w-6 mr-2 text-blue-600" />
              AI-Generated Insights
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{insights}</div>
              </div>
            </div>
          </div>

          {/* Follow-up Question */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
              Ask a Follow-up Question
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleFollowUpQuestion()}
                  placeholder="e.g., What's the average value in column X?"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleFollowUpQuestion}
                  disabled={followUpLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {followUpLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    'Ask'
                  )}
                </button>
              </div>
              {followUpAnswer && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Answer:</p>
                  <div className="text-gray-700 whitespace-pre-wrap">{followUpAnswer}</div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Export & Save</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSaveReport}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Report
              </button>
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
        </>
      )}
    </div>
  );
}
