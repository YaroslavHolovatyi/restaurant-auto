import React, { useState } from 'react';
import {
  IconButton,
  Collapse,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Footer.css';

interface WorkingHours {
  day: string;
  hours: string;
}

const Footer: React.FC = () => {
  const [scheduleExpanded, setScheduleExpanded] = useState<boolean>(false);

  const workingHours: WorkingHours[] = [
    { day: 'Пн', hours: '10:00 - 22:00' },
    { day: 'Вт', hours: '10:00 - 22:00' },
    { day: 'Ср', hours: '10:00 - 22:00' },
    { day: 'Чт', hours: '10:00 - 22:00' },
    { day: 'Пт', hours: '10:00 - 22:00' },
    { day: 'Сб', hours: '10:00 - 22:00' },
    { day: 'Нд', hours: '10:00 - 22:00' },
  ];

  const handleCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="info-section">
          <div className="info-item">
            <RestaurantIcon className="info-icon" />
            <div className="info-text">
              <span className="info-label">Про місце:</span>
              <div className="info-value">
               Тихе і спокійне місце для поїдання бургерів і не тільки.
              </div>
            </div>
          </div>

          <div className="info-item">
            <LocationOnIcon className="info-icon" />
            <div className="info-text">
              <span className="info-label">Адреса:</span>
              <div className="info-value">
                вулиця Фальшива, 228, Львів, Львівська область, Україна
                <IconButton className="copy-button" onClick={() => handleCopy('вулиця Фальшива, 228, Львів')}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="info-item">
            <PhoneIcon className="info-icon" />
            <div className="info-text">
              <span className="info-label">Телефон:</span>
              <div className="info-value">
                +380 63 099 99 99
                <IconButton className="copy-button" onClick={() => handleCopy('+380630999999')}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="info-item">
            <EmailIcon className="info-icon" />
            <div className="info-text">
              <span className="info-label">Ел. пошта:</span>
              <div className="info-value">
                boomer.lviv@gmail.com
                <IconButton className="copy-button" onClick={() => handleCopy('boomer.lviv@gmail.com')}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="info-item">
            <AccessTimeIcon className="info-icon" />
            <div className="info-text">
              <span className="info-label">Робочий час:</span>
              <div className="info-value">
                10:00 - 22:00
              </div>
            </div>
          </div>
        </div>

        <div className="social-section">
          <h3 className="social-title">Ми в соцмережах</h3>
          <div className="social-links">
            <a href="#" className="social-link">
              <FacebookOutlinedIcon />
              Facebook
            </a>
            <a href="#" className="social-link">
              <InstagramIcon />
              Instagram
            </a>
            <a href="#" className="social-link">
              <PublicOutlinedIcon />
              TripAdvisor
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 