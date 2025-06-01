import React from 'react';
import { useTranslation } from 'react-i18next';

const MainInfo = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-4">
      <h1 className="text-3xl font-bold">{t('main.title')}</h1>
      <h3 className="text-3x1">{t('main.subtitle')}</h3>
    </div>
  );
};

export default MainInfo; 