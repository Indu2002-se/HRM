import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
