import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, InputBase, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/cartSlice';
import './SearchAutocomplete.css';
import { useTranslation } from 'react-i18next';

interface Dish {
  _id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  category: string;
  image_url: string;
  weight: string | null;
  is_new: boolean;
  available: boolean;
}

interface SearchAutocompleteProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (dish: Dish) => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ open, onClose, onAdd }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('http://localhost:5000/api/dishes')
      .then(res => res.json())
      .then(setDishes);
  }, []);

  const filteredDishes = dishes.filter((dish: Dish) =>
    dish.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddToOrder = (dish: Dish) => {
    if (onAdd) {
      onAdd(dish);
    } else {
      dispatch(addItem({
        id: dish._id,
        name: dish.name,
        price: dish.price,
        currency: dish.currency,
        image_url: dish.image_url,
        quantity: 1
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{t('navbar.search')}</span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 2 }}
          onSubmit={e => e.preventDefault()}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={t('navbar.search')}
            inputProps={{ 'aria-label': t('navbar.search') }}
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <div className="search-results">
          {filteredDishes.length === 0 && query && (
            <div className="no-results">No results found</div>
          )}
          {filteredDishes.map(dish => (
            <div key={dish._id} className="dish-card search-card">
              <div className="dish-info">
                <div className="dish-header">
                  <h3 className="dish-name">{dish.name}</h3>
                  {dish.is_new && <span className="new-badge">{t('menu.new')}</span>}
                </div>
                <p className="dish-price">{dish.price} {dish.currency}</p>
                <p className="dish-description">{dish.description}</p>
                {dish.weight && (
                  <p className="nutrition-info">{dish.weight}</p>
                )}
                <button 
                  className="add-to-order-button"
                  onClick={() => handleAddToOrder(dish)}
                >
                  {t('menu.addToOrder')}
                </button>
              </div>
              <div className="dish-image-container">
                {dish.image_url && (
                  <img 
                    src={`http://localhost:5000${dish.image_url}`} 
                    alt={dish.name} 
                    className="dish-image"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchAutocomplete; 