import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import axios from 'axios';
import config from '../utils/config';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency, fetchUserPreferences } from '../utils/formatters';

const API_ENDPOINT = config.reportsEndpoint;
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [dateRange, setDateRange] = useState({
    type: 'monthly', // monthly, yearly, custom
    month: new Date().toISOString().slice(0, 7),
    year: new Date().getFullYear().toString(),
    startDate: '',
    endDate: ''
  });

  // Fetch reports on component mount
  useEffect(() => {
    const initializeData = async () => {
      const user = await getCurrentUser();
      await fetchUserPreferences(user.userId);
      fetchReports();
    };
    initializeData();
  }, []);

  const fetchReports = async () => {
    try {
      const user = await getCurrentUser();
      const response = await axios.get(API_ENDPOINT, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': user.userId
        }
      });

      if (response.data.statusCode === 200) {
        const reportsData = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
        setReports(Array.isArray(reportsData) ? reportsData : reportsData.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type, period, params) => {
    try {
      setGeneratingReport(true);
      setError('');
      const user = await getCurrentUser();
      

      const requestData = type === 'custom' 
        ? {
            reportType: type,
            startDate: params.startDate,
            endDate: params.endDate
          }
        : {
            reportType: type,
            period: period
          };


      const response = await axios.post(
        API_ENDPOINT,
        requestData,
        {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'Authorization': user.userId
          }
        }
      );


      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        const reportData = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
        
        setSelectedReport(reportData);
        await fetchReports();
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError(error.response?.data?.error || 'Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const deleteReport = async (reportId) => {
    try {
      const user = await getCurrentUser();
      
      
      const response = await axios.delete(`${API_ENDPOINT}/${reportId}`, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': user.userId
        }
      });


      if (response.data.statusCode === 200) {
        // Remove the report from local state
        setReports(prevReports => prevReports.filter(report => report.id !== reportId));
        
        // Clear selected report if it was the one deleted
        if (selectedReport?.id === reportId) {
          setSelectedReport(null);
        }

      } else {
        throw new Error('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      setError('Failed to delete report');
    }
  };

  const getReport = async (reportId) => {
    try {
      const user = await getCurrentUser();
      const response = await axios.get(`${API_ENDPOINT}/${reportId}`, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': user.userId
        }
      });

      if (response.data.statusCode === 200) {
        const reportData = JSON.parse(response.data.body);
        setSelectedReport(reportData);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to fetch report details');
    }
  };

  const handleReportSelect = async (report) => {
    try {
      
      if (!report) {
        return;
      }

      // Get user ID
      const user = await getCurrentUser();

      // Fetch report data
      const response = await axios.get(`${API_ENDPOINT}/${report.id}`, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': user.userId
        }
      });


      if (response.data.statusCode === 200) {
        const reportData = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
        
        setSelectedReport(reportData);
      } else {
        throw new Error('Failed to fetch report');
      }
    } catch (error) {
      console.error('Error selecting report:', error);
      setError('Failed to load report details');
    }
  };

  // Add chart data configuration
  const getBarChartData = (report) => {
    if (!report || !report.totals) return null;

    return {
      labels: ['Income vs Expenses'],
      datasets: [
        {
          label: 'Income',
          data: [report.totals?.income || 0],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: [report.totals?.expenses || 0],
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getDoughnutChartData = (report) => {
    if (!report || !report.totals?.byCategory) return null;

    const categories = Object.keys(report.totals.byCategory);
    const values = Object.values(report.totals.byCategory);

    return {
      labels: categories,
      datasets: [
        {
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Generate list of available months (last 12 months)
  const getAvailableMonths = () => {
    const months = [];
    const years = getAvailableYears(); // Get all available years
    
    years.forEach(year => {
      for (let month = 0; month < 12; month++) {
        const date = new Date(parseInt(year.value), month, 1);
        // Skip future months
        if (date > new Date()) return;
        
        months.push({
          value: date.toISOString().slice(0, 7),
          label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
        });
      }
    });

    return months.sort((a, b) => b.value.localeCompare(a.value)); // Sort in descending order
  };

  // Generate list of available years (last 5 years)
  const getAvailableYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      years.push({
        value: year.toString(),
        label: year.toString()
      });
    }
    return years;
  };

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      setError('');

      switch (dateRange.type) {
        case 'monthly':
          await generateReport('monthly', dateRange.month);
          break;
        case 'yearly':
          await generateReport('yearly', dateRange.year);
          break;
        case 'custom':
          if (!dateRange.startDate || !dateRange.endDate) {
            setError('Please select both start and end dates');
            return;
          }
          await generateReport('custom', null, {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          });
          break;
        default:
          setError('Invalid report type');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  // Add export functions after your existing functions
  const exportToPDF = (report) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Financial Report - ${report.period}`, 14, 22);
    
    // Add summary section
    doc.setFontSize(16);
    doc.text('Summary', 14, 35);
    doc.setFontSize(12);
    doc.text(`Total Income: $${report.totals.income.toFixed(2)}`, 14, 45);
    doc.text(`Total Expenses: $${report.totals.expenses.toFixed(2)}`, 14, 55);
    doc.text(`Net Savings: $${(report.totals.income - report.totals.expenses).toFixed(2)}`, 14, 65);
    
    // Add category breakdown
    doc.setFontSize(16);
    doc.text('Expense Categories', 14, 85);
    
    const categoryData = Object.entries(report.totals.byCategory).map(([category, amount]) => [
      category,
      `$${amount.toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 90,
      head: [['Category', 'Amount']],
      body: categoryData,
      theme: 'striped'
    });
    
    // Add transactions table
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Transactions', 14, 22);
    
    const transactionData = report.transactions.map(t => [
      t.date,
      t.name,
      t.type,
      t.category,
      `$${t.amount.toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 30,
      head: [['Date', 'Description', 'Type', 'Category', 'Amount']],
      body: transactionData,
      theme: 'striped'
    });
    
    // Save the PDF
    doc.save(`financial-report-${report.period}.pdf`);
  };

  const exportToExcel = (report) => {
    // Prepare workbook
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['Financial Report', report.period],
      [],
      ['Summary'],
      ['Total Income', report.totals.income],
      ['Total Expenses', report.totals.expenses],
      ['Net Savings', report.totals.income - report.totals.expenses],
      [],
      ['Category Breakdown'],
      ['Category', 'Amount'],
      ...Object.entries(report.totals.byCategory)
    ];
    
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
    
    // Transactions sheet
    const transactionData = [
      ['Date', 'Description', 'Type', 'Category', 'Amount'],
      ...report.transactions.map(t => [
        t.date,
        t.name,
        t.type,
        t.category,
        t.amount
      ])
    ];
    
    const transactionsWS = XLSX.utils.aoa_to_sheet(transactionData);
    XLSX.utils.book_append_sheet(wb, transactionsWS, 'Transactions');
    
    // Save the file
    XLSX.writeFile(wb, `financial-report-${report.period}.xlsx`);
  };

  // Add export buttons to the report display section
  const ExportButtons = ({ report }) => (
    <div className="flex space-x-4 mt-6">
      <button
        onClick={() => exportToPDF(report)}
        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span>Export as PDF</span>
      </button>
      <button
        onClick={() => exportToExcel(report)}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Export as Excel</span>
      </button>
    </div>
  );

  // Add a utility class for bottom margin specifically for mobile view
  const mobileBottomMargin = 'mb-16 lg:mb-0'; // Apply margin-bottom on mobile, remove on larger screens

  return (
    <div className={`bg-black text-white min-h-screen p-6 font-sans ${mobileBottomMargin}`}>
      <h1 className="text-3xl font-bold mb-8">Financial Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Report Generation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-indigo-400">Generate Report</h2>
            
            {/* Report Type Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-3 text-sm font-medium">Report Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['Monthly', 'Yearly', 'Custom'].map(type => (
                  <button
                    key={type}
                    onClick={() => setDateRange({ ...dateRange, type: type.toLowerCase() })}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      dateRange.type === type.toLowerCase() 
                        ? 'bg-indigo-600 text-white shadow-lg transform scale-105' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6 space-y-4">
              {dateRange.type === 'monthly' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Year</label>
                    <select
                      value={dateRange.month.slice(0, 4)}
                      onChange={(e) => {
                        const newYear = e.target.value;
                        const currentMonth = dateRange.month.slice(5, 7);
                        setDateRange({ ...dateRange, month: `${newYear}-${currentMonth}` });
                      }}
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    >
                      {getAvailableYears().map(year => (
                        <option key={year.value} value={year.value}>{year.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Month</label>
                    <select
                      value={dateRange.month.slice(5, 7)}
                      onChange={(e) => {
                        const currentYear = dateRange.month.slice(0, 4);
                        const newMonth = e.target.value.padStart(2, '0');
                        setDateRange({ ...dateRange, month: `${currentYear}-${newMonth}` });
                      }}
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    >
                      {Array.from({ length: 12 }, (_, i) => ({
                        value: (i + 1).toString().padStart(2, '0'),
                        label: new Date(2000, i).toLocaleString('default', { month: 'long' })
                      })).map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {dateRange.type === 'yearly' && (
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Select Year</label>
                  <select
                    value={dateRange.year}
                    onChange={(e) => setDateRange({ ...dateRange, year: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  >
                    {getAvailableYears().map(year => (
                      <option key={year.value} value={year.value}>{year.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {dateRange.type === 'custom' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">End Date</label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateReport}
              disabled={generatingReport || (dateRange.type === 'custom' && (!dateRange.startDate || !dateRange.endDate))}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 
                transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {generatingReport ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Report...
                </div>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>

          {/* Reports List */}
          <div className="mt-8 bg-gray-900 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-indigo-400">Available Reports</h2>
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => handleReportSelect(report)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedReport?.id === report.id 
                      ? 'bg-indigo-600 shadow-lg transform scale-[1.02]' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                      </h3>
                      <p className="text-sm text-gray-400">{report.period}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this report?')) {
                          deleteReport(report.id).then(() => {
                            // Optionally refresh the reports list
                            fetchReports();
                          });
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Report Display */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg min-h-[600px]">
            {selectedReport ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <h2 className="text-xl font-semibold text-indigo-400">
                    {selectedReport.type === 'custom' 
                      ? 'Custom Report' 
                      : `${selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)} Report`}
                  </h2>
                  <p className="text-gray-400">{selectedReport.period}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Charts */}
                  <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
                    {getBarChartData(selectedReport) && (
                      <Bar 
                        data={getBarChartData(selectedReport)}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: { color: 'white' }
                            }
                          },
                          scales: {
                            y: { ticks: { color: 'white' } },
                            x: { ticks: { color: 'white' } }
                          }
                        }}
                      />
                    )}
                  </div>

                  <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                    {getDoughnutChartData(selectedReport) && (
                      <Doughnut 
                        data={getDoughnutChartData(selectedReport)}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: { color: 'white' }
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Total Income</p>
                      <p className="text-2xl font-bold text-green-500">
                        {formatCurrency(selectedReport.totals.income)}
                      </p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-500">
                        {formatCurrency(selectedReport.totals.expenses)}
                      </p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Net Savings</p>
                      <p className={`text-2xl font-bold ${
                        (selectedReport.totals?.income || 0) - (selectedReport.totals?.expenses || 0) > 0 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {formatCurrency((selectedReport.totals?.income || 0) - (selectedReport.totals?.expenses || 0))}
                      </p>
                    </div>
                  </div>
                </div>

                <ExportButtons report={selectedReport} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">Select a report to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Reports;
  