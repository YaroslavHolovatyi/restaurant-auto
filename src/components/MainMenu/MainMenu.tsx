import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './MainMenu.css';

interface Category {
  id: string;
  title: string;
}

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  
  const categories: Category[] = [
    { id: 'burgers', title: 'БУРГЕРИ' },
    { id: 'additions', title: 'ДО БУРГЕРІВ' },
    { id: 'drinks', title: 'НАПОЇ' },
    { id: 'desserts', title: 'ДЕСЕРТИ' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate('/menu', { state: { initialCategory: categoryId } });
  };

  return (
    <div className="menu-container">
      {categories.map((category) => (
        <div 
          key={category.id} 
          className="menu-card"
          onClick={() => handleCategoryClick(category.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCategoryClick(category.id);
            }
          }}
        >
          <span className="menu-title">{category.title}</span>
          <ArrowForwardIosIcon className="menu-arrow" sx={{ fontSize: 20 }} />
        </div>
      ))}
    </div>
  );
};

export default MainMenu;