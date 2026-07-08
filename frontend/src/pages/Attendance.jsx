import { useEffect, useState } from 'react';
import { attendanceAPI } from '../services/api';
import Header from '../components/layout/Header';
import { formatDate, formatTime, getDayName } from '../utils/dateUtils';
import './Attendance.css';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [meta, setMeta] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date: '',
    page: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendances();
    fetchStats();
  }, [filters]);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getAttendances(filters);
      setAttendances(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await attendanceAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className="page-container">
      <Header title="Attendance" />
      <div className="page-content">
        <div className="stats-cards">
          <div className="stat-card-large">
            <div className="stat-icon-large">📊</div>
            <div className="stat-content-large">
              <p className="stat-label-large">Total Attendance</p>
              <p className="stat-value-large">
                {stats?.total_attendance_this_month || 0}
              </p>
              <p className="stat-sublabel">This Month</p>
            </div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon-large">✅</div>
            <div className="stat-content-large">
              <p className="stat-label-large">Checked In</p>
              <p className="stat-value-large">
                {stats?.checked_in_today ? 'Yes' : 'No'}
              </p>
              <p className="stat-sublabel">Today</p>
            </div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon-large">🏁</div>
            <div className="stat-content-large">
              <p className="stat-label-large">Checked Out</p>
              <p className="stat-value-large">
                {stats?.checked_out_today ? 'Yes' : 'No'}
              </p>
              <p className="stat-sublabel">Today</p>
            </div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon-large">⏱️</div>
            <div className="stat-content-large">
              <p className="stat-label-large">Current Status</p>
              <p className="stat-value-large status-badge">
                {stats?.current_status || 'absent'}
              </p>
              <p className="stat-sublabel">Today</p>
            </div>
          </div>
        </div>

        <div className="attendance-section">
          <div className="section-header">
            <h2>Attendance History</h2>
          </div>

          <div className="filters-bar">
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="filter-select"
            />
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Worked Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="no-data">
                          No attendance records found
                        </td>
                      </tr>
                    ) : (
                      attendances.map((attendance) => (
                        <tr key={attendance.id}>
                          <td>{formatDate(attendance.date)}</td>
                          <td>{attendance.day}</td>
                          <td>{formatTime(attendance.check_in)}</td>
                          <td>{formatTime(attendance.check_out)}</td>
                          <td>{attendance.worked_hours || 0}h</td>
                          <td>
                            <span className={`status-badge ${attendance.status}`}>
                              {attendance.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {meta && meta.last_page > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(meta.current_page - 1)}
                    disabled={meta.current_page === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {meta.current_page} of {meta.last_page}
                  </span>
                  <button
                    onClick={() => handlePageChange(meta.current_page + 1)}
                    disabled={meta.current_page === meta.last_page}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
