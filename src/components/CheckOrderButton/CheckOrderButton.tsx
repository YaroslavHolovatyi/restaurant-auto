import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { toggleCart } from "../../store/cartSlice";
import "./CheckOrderButton.css";
import { useTranslation } from "react-i18next";

const CheckOrderButton: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user);
  const userRole = user.profile?.role;

  // Only show for waiters
  if (userRole !== "waiter" || items.length === 0) return null;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <button
      className="check-order-button"
      onClick={() => dispatch(toggleCart())}
    >
      <span>{t("cart.checkOrder")}</span>
      <span className="order-total">{total} UAH</span>
    </button>
  );
};

export default CheckOrderButton;
