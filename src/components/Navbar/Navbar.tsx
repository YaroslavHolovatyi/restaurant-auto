import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { IconButton, Drawer } from '@mui/material';
import { 
  Search, 
  AccountCircle, 
  Menu
} from '@mui/icons-material';
import './Navbar.css';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SearchAutocomplete from './SearchAutocomplete';
import LoginDialog from './LoginDialog';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import SideMenu from '../SideMenu/SideMenu';

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSideMenuSelect = (key: string) => {
    // Optionally, you can handle navigation or state here
    setSideMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => navigate('/') }>
        <img src={logo} alt={t('main.title')} className="logo" />
      </div>
      {/* Controls */}
      <div className="controls">
        {/* Language Selector */}
        <LanguageSelector />
        {/* Search Autocomplete */}
        <IconButton className="nav-button" onClick={() => setSearchOpen(true)}>
          <Search sx={{ fontSize: 24 }} />
        </IconButton>
        {/* Profile Icon */}
        {isLoggedIn ? (
          <IconButton className="nav-button" onClick={handleProfileClick}>
            <AccountCircle sx={{ fontSize: 24 }} />
          </IconButton>
        ) : (
          <IconButton className="nav-button" onClick={() => setLoginOpen(true)}>
          <AccountCircle sx={{ fontSize: 24 }} />
        </IconButton>
        )}
        {/* Side Menu Icon (only when logged in) */}
        {isLoggedIn && (
          <IconButton className="nav-button" onClick={() => setSideMenuOpen(true)}>
          <Menu sx={{ fontSize: 24 }} />
        </IconButton>
        )}
      </div>
      <SearchAutocomplete open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Drawer anchor="left" open={sideMenuOpen} onClose={() => setSideMenuOpen(false)}
        PaperProps={{ sx: { width: 320, maxWidth: '80vw' } }}>
        <SideMenu onSelect={handleSideMenuSelect} onClose={() => setSideMenuOpen(false)} role={((user.profile?.role || 'waiter') as 'waiter' | 'admin' | 'cook')} />
      </Drawer>
    </nav>
  );
};

export default Navbar; 