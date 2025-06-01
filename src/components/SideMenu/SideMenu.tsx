import React from 'react';
import './SideMenu.css';
import { useNavigate } from 'react-router-dom';

interface SideMenuProps {
  onSelect: (key: string) => void;
  onClose: () => void;
  role: 'admin' | 'cook' | 'waiter';
}

const SideMenu: React.FC<SideMenuProps> = ({ onSelect, onClose, role }) => {
  const navigate = useNavigate();
  const handleClick = (key: string) => {
    if (key === 'tables') {
      navigate('/tables');
    }
    if (key === 'create-menu') {
      navigate('/create-menu-item');
    }
    if (key === 'add-user') {
      navigate('/add-user');
    }
    onSelect(key);
    onClose();
  };
  return (
    <div className="side-menu">
      <button className="side-menu-btn" onClick={() => handleClick('tables')}>List of Tables</button>
      {(role === 'admin' || role === 'cook') && (
        <button className="side-menu-btn" onClick={() => handleClick('create-menu')}>Create New Menu Option</button>
      )}
      {role === 'admin' && (
        <button className="side-menu-btn" onClick={() => handleClick('add-user')}>Add a User</button>
      )}
    </div>
  );
};

export default SideMenu; 