import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { removeItem, updateQuantity, toggleCart, clearCart } from '../../store/cartSlice';
import './Cart.css';
import { useTranslation } from 'react-i18next';

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleCompleteOrder = () => {
    // Here you would typically handle the order completion
    // For now, we'll just clear the cart
    dispatch(clearCart());
    dispatch(toggleCart());
  };

  return (
    <div className="cart-overlay">
      <div className="cart-content">
        <div className="cart-header">
          <h2>{t('cart.yourOrder')}</h2>
          <button className="close-button" onClick={() => dispatch(toggleCart())}>×</button>
        </div>
        
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image_url} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>{item.price} {item.currency}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button 
                className="remove-item"
                onClick={() => dispatch(removeItem(item.id))}
              >
                {t('cart.remove')}
              </button>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>{t('cart.total')}</span>
            <span>{total} UAH</span>
          </div>
          <button 
            className="complete-order-button"
            onClick={handleCompleteOrder}
            disabled={items.length === 0}
          >
            {t('cart.completeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 