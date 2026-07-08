import { useEffect, useState } from 'react';
import { leaveAPI } from '../services/api';
import Header from '../components/layout/Header';
import { formatDate, formatDateForInput } from '../utils/dateUtils';
import './Leaves.css';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [meta, setMeta] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    from_date: formatDateForInput(new Date()),
    to_date: formatDateForInput(new Date()),
    leave_type: 'full_day',
    reason: '',
  });

  useEffect(() => {
    fetchLeaves();
    fetchBalance();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await leaveAPI.getLeaves();
      setLeaves(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await leaveAPI.getBalance();
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveAPI.createLeave(formData);
      alert('Leave request submitted successfully!');
      setShowModal(false);
      setFormData({
        from_date: formatDateForInput(new Date()),
        to_date: formatDateForInput(new Date()),
        leave_type: 'full_day',
        reason: '',
      });
      fetchLeaves();
      fetchBalance();
    } catch (error) {
      alert(error.message || 'Failed to submit leave request');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="page-container">
      <Header title="Leaves" />
      <div className="page-content">
        <div className="leave-balance-section">
          <div className="balance-card">
            <div className="balance-header">
              <h3>Leave Balance</h3>
              <p className="balance-total">{balance?.remaining || 0} days remaining</p>
            </div>
            <div className="balance-grid">
              <div className="balance-item">
                <span className="balance-label">Total Balance</span>
                <span className="balance-value">{balance?.total_balance || 0}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Used</span>
                <span className="balance-value used">{balance?.used || 0}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Full Days</span>
                <span className="balance-value">{balance?.full_days || 0}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Half Days</span>
                <span className="balance-value">{balance?.half_days || 0}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Short Leaves</span>
                <span className="balance-value">{balance?.short_leaves || 0}</span>
              </div>
            </div>
          </div>

          <button onClick={() => setShowModal(true)} className="request-leave-btn">
            ➕ Request Leave
          </button>
        </div>

        <div className="leaves-section">
          <div className="section-header">
            <h2>Leave History</h2>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <table className="leaves-table">
                <thead>
                  <tr>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Leave Type</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-data">
                        No leave requests found
                      </td>
                    </tr>
                  ) : (
                    leaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>{formatDate(leave.from_date)}</td>
                        <td>{formatDate(leave.to_date)}</td>
                        <td>
                          <span className="leave-type-badge">
                            {leave.leave_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{leave.num_days}</td>
                        <td className="reason-cell">{leave.reason}</td>
                        <td>
                          <span className={`status-badge ${leave.status}`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Leave</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-row">
                <div className="form-group">
                  <label>From Date</label>
                  <input
                    type="date"
                    name="from_date"
                    value={formData.from_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <input
                    type="date"
                    name="to_date"
                    value={formData.to_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Leave Type</label>
                <select
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleChange}
                  required
                >
                  <option value="full_day">Full Day</option>
                  <option value="half_day">Half Day</option>
                  <option value="short_leave">Short Leave</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter reason for leave..."
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;
