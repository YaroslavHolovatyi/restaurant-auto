import React from 'react';
import './Main.css';
import MainInfo from '../MainInfo/MainInfo';
import MainMenu from '../MainMenu/MainMenu';

const Main = () => {
  return (
    <div className="main-container">
      <MainInfo />
      <MainMenu />
    </div>
  );
};

export default Main; 