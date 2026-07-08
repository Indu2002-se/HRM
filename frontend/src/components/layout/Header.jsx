import { useAuth } from '../../context/AuthContext';
import { getCurrentDate } from '../../utils/dateUtils';
import './Header.css';

const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
        <p className="current-date">{getCurrentDate()}</p>
      </div>
      <div className="header-right">
        <div className="notification-icon">
          🔔
          <span className="notification-badge">3</span>
        </div>
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div className="user-details">
            <p className="user-name">{user?.name || 'User'}</p>
            <p className="user-role">{user?.role || 'Employee'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
