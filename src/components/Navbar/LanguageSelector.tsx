import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        className={`language-selector-btn${i18n.language === 'ua' ? ' active' : ''}`}
        onClick={() => changeLanguage('ua')}
      >
        UA
      </button>
      <span className="language-selector-divider">|</span>
      <button
        className={`language-selector-btn${i18n.language === 'en' ? ' active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector; 