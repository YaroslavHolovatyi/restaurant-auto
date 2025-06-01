import React, { useState, useEffect, useCallback } from 'react';
import { IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useSwipeable } from 'react-swipeable';
import { burgerImagesArray } from '../../assets/images';
import './ImageSlider.css';

const DEFAULT_INTERVAL = 5000; // 5 seconds
const INTERACTION_INTERVAL = 15000; // 15 seconds

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideInterval, setSlideInterval] = useState(DEFAULT_INTERVAL);

  const resetToDefaultInterval = useCallback(() => {
    setSlideInterval(DEFAULT_INTERVAL);
  }, []);

  const setLongerInterval = useCallback(() => {
    setSlideInterval(INTERACTION_INTERVAL);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % burgerImagesArray.length);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + burgerImagesArray.length) % burgerImagesArray.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNextSlide, slideInterval);
    return () => clearInterval(timer);
  }, [goToNextSlide, slideInterval]);

  const handleManualNavigation = useCallback((direction: 'next' | 'prev') => {
    if (direction === 'next') {
      goToNextSlide();
    } else {
      goToPrevSlide();
    }
    setLongerInterval();

    // Reset to default interval after 15 seconds
    const resetTimer = setTimeout(resetToDefaultInterval, INTERACTION_INTERVAL);
    return () => clearTimeout(resetTimer);
  }, [goToNextSlide, goToPrevSlide, setLongerInterval, resetToDefaultInterval]);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleManualNavigation('next'),
    onSwipedRight: () => handleManualNavigation('prev'),
    trackMouse: false,
    preventScrollOnSwipe: true,
    trackTouch: true,
    delta: 10,
  });

  return (
    <div className="slider-container">
      <div
        className="slider-wrapper"
        {...handlers}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {burgerImagesArray.map((image, index) => (
          <div key={index} className="slide">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="slider-image"
              draggable={false}
            />
          </div>
        ))}
      </div>
      
      <IconButton
        className="slider-button prev"
        onClick={() => handleManualNavigation('prev')}
        aria-label="Previous slide"
      >
        <NavigateBeforeIcon />
      </IconButton>
      
      <IconButton
        className="slider-button next"
        onClick={() => handleManualNavigation('next')}
        aria-label="Next slide"
      >
        <NavigateNextIcon />
      </IconButton>
      
      <div className="slider-counter">
        {currentIndex + 1} / {burgerImagesArray.length}
      </div>
    </div>
  );
};

export default ImageSlider; 