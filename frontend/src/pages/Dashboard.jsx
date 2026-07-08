import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI } from '../services/api';
import Header from '../components/layout/Header';
import FaceVerifyModal from '../components/face/FaceVerifyModal';
import './Dashboard.css';
import { loadFaceModels } from "../utils/faceApiLoader";



const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [todayStatus, setTodayStatus] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyAction, setVerifyAction] = useState(null);
  const [currentAttendanceId, setCurrentAttendanceId] = useState(null);
  

  useEffect(() => {
    fetchDashboardData();
  }, [month, year]);
  
  useEffect(() => {
    loadFaceModels();
  }, []);

  useEffect(() => {
    let interval;
    const updateLiveHours = () => {
      if (todayStatus?.checked_in && !todayStatus?.checked_out && todayStatus?.check_in_time) {
        const now = new Date();
        const checkInParts = todayStatus.check_in_time.split(':');
        
        const checkInDate = new Date();
        checkInDate.setHours(parseInt(checkInParts[0], 10));
        checkInDate.setMinutes(parseInt(checkInParts[1], 10));
        checkInDate.setSeconds(parseInt(checkInParts[2] || '0', 10));
        
        let diffMs = now.getTime() - checkInDate.getTime();
        if (diffMs < 0) diffMs = 0;
        
        const workedHoursLive = Number((diffMs / (1000 * 60 * 60)).toFixed(2));

        setTodayStatus(prev => {
          if (!prev) return prev;
          return { ...prev, worked_hours: workedHoursLive };
        });

        const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        setChartData(prev => {
          if (!prev) return prev;
          return prev.map(d => 
            d.date === todayStr ? { ...d, worked_hours: workedHoursLive, status: 'present' } : d
          );
        });
      }
    };

    if (todayStatus?.checked_in && !todayStatus?.checked_out) {
      updateLiveHours(); // Initial update
      // Update every 10 minutes (600,000 milliseconds) as requested
      interval = setInterval(updateLiveHours, 10 * 60 * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [todayStatus?.checked_in, todayStatus?.checked_out, todayStatus?.check_in_time]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, chartRes, statusRes] = await Promise.all([
        attendanceAPI.getStats(month, year),
        attendanceAPI.getMonthlyChart(month, year),
        attendanceAPI.getTodayStatus(),
      ]);
      setStats(statsRes.data || {});
      setChartData(chartRes.data || []);
      setTodayStatus(statusRes.data || {});
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values on error
      setStats({
        total_attendance_this_month: 0,
        checked_in_today: false,
        checked_out_today: false,
        current_status: 'absent',
        worked_hours_today: 0
      });
      setChartData([]);
      setTodayStatus({
        checked_in: false,
        checked_out: false,
        check_in_time: null,
        check_out_time: null,
        worked_hours: 0,
        status: 'absent'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setVerifyAction('check_in');
    setShowVerifyModal(true);
  };

  const handleCheckOut = async () => {
    try {
      const attendances = await attendanceAPI.getAttendances({ per_page: 1 });
      if (attendances.data.length > 0) {
        setCurrentAttendanceId(attendances.data[0].id);
        setVerifyAction('check_out');
        setShowVerifyModal(true);
      } else {
        alert('No active check-in found');
      }
    } catch (error) {
      alert(error.message || 'Failed to fetch attendance');
    }
  };

  const handleVerifySuccess = () => {
    setShowVerifyModal(false);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header title="Dashboard" />
        <div className="page-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title="Dashboard" />
      <div className="page-content">
        <div className="dashboard-actions">
          {!todayStatus?.checked_in ? (
            <button onClick={handleCheckIn} className="verify-btn">
              📍 Verify & Check In
            </button>
          ) : !todayStatus?.checked_out ? (
            <button onClick={handleCheckOut} className="verify-btn checkout-btn">
              🏁 Verify & Check Out
            </button>
          ) : (
            <button className="verify-btn disabled" disabled>
              ✅ Completed for Today
            </button>
          )}
        </div>

        <div className="dashboard-grid">
          <div className="employment-summary">
            <h2>Employment Summary</h2>
            <div className="summary-items">
              <div className="summary-item">
                <span className="summary-label">Position</span>
                <span className="summary-value">{user?.position || '-'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Level</span>
                <span className="summary-value">{user?.level || '-'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Status</span>
                <span className="summary-value status-badge">{user?.status || '-'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Joined Date</span>
                <span className="summary-value">{user?.joined_date || '-'}</span>
              </div>
            </div>
          </div>

          <div className="attendance-stats">
            <h2>Today's Status</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🕐</div>
                <div className="stat-content">
                  <p className="stat-label">Check In</p>
                  <p className="stat-value">
                    {todayStatus?.check_in_time || '-'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🕔</div>
                <div className="stat-content">
                  <p className="stat-label">Check Out</p>
                  <p className="stat-value">
                    {todayStatus?.check_out_time || '-'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <p className="stat-label">Worked Hours</p>
                  <p className="stat-value">
                    {todayStatus?.worked_hours || 0}h
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <p className="stat-label">Status</p>
                  <p className="stat-value status-badge">
                    {todayStatus?.status || 'absent'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="attendance-chart-section">
          <div className="chart-header">
            <h2>Monthly Attendance Analytics</h2>
            <div className="chart-filters">
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color present"></span>
                <span>Present</span>
              </div>
              <div className="legend-item">
                <span className="legend-color absent"></span>
                <span>Absent</span>
              </div>
              <div className="legend-item">
                <span className="legend-line"></span>
                <span>Target (8h)</span>
              </div>
            </div>
            <div className="chart-bars">
              {chartData && chartData.length > 0 ? (
                chartData.map((data) => (
                  <div key={data.day} className="chart-bar-wrapper">
                    <div className="chart-bar-container">
                      <div
                        className={`chart-bar ${data.status}`}
                        style={{ height: `${(data.worked_hours / 12) * 100}%` }}
                        title={`${data.date}: ${data.worked_hours}h`}
                      ></div>
                      <div className="target-line" style={{ bottom: '66.67%' }}></div>
                    </div>
                    <span className="chart-label">{data.day}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No attendance data available for this month
                </div>
              )}
            </div>
          </div>
          <div className="chart-stats">
            <div className="chart-stat">
              <span>Total Attendance:</span>
              <strong>{stats?.total_attendance_this_month || 0} days</strong>
            </div>
            <div className="chart-stat">
              <span>Average Hours:</span>
              <strong>
                {chartData && chartData.length > 0
                  ? (() => {
                      const presentDays = chartData.filter(d => d.status === 'present');
                      if (presentDays.length === 0) return '0.0';
                      const total = presentDays.reduce((sum, d) => sum + (d.worked_hours || 0), 0);
                      return (total / presentDays.length).toFixed(1);
                    })()
                  : '0.0'}h
              </strong>
            </div>
          </div>
        </div>

        <FaceVerifyModal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          action={verifyAction}
          attendanceId={currentAttendanceId}
          onSuccess={handleVerifySuccess}
        />
      </div>
    </div>
    
  );
};

export default Dashboard;
