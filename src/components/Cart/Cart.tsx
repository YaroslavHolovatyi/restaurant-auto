import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import {
  removeItem,
  updateQuantity,
  toggleCart,
  clearCart,
} from "../../store/cartSlice";
import "./Cart.css";
import { useTranslation } from "react-i18next";

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user);
  const userRole = user.profile?.role;
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };
  const handleCompleteOrder = async () => {
    if (userRole !== "waiter") {
      alert("Only waiters can complete orders");
      return;
    }

    if (!selectedTable) {
      alert("Please select a table number");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        tableNumber: selectedTable,
        items: items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        waiterId: user.username || user.profile?.name || "unknown",
        status: "ordered",
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert(`Order successfully placed for Table ${selectedTable}!`);
        dispatch(clearCart());
        dispatch(toggleCart());
        setSelectedTable(null);
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-overlay">
      <div className="cart-content">
        <div className="cart-header">
          <h2>{t("cart.yourOrder")}</h2>
          <button
            className="close-button"
            onClick={() => dispatch(toggleCart())}
          >
            ×
          </button>
        </div>
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image_url}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>
                  {item.price} {item.currency}
                </p>
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="remove-item"
                onClick={() => dispatch(removeItem(item.id))}
              >
                {t("cart.remove")}
              </button>
            </div>
          ))}
        </div>{" "}
        <div className="cart-footer">
          <div className="cart-total">
            <span>{t("cart.total")}</span>
            <span>{total} UAH</span>
          </div>

          {userRole === "waiter" && (
            <>
              <div className="table-selection" style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="table-select"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Select Table:
                </label>
                <select
                  id="table-select"
                  value={selectedTable || ""}
                  onChange={(e) => setSelectedTable(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                >
                  <option value="">Choose a table...</option>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Table {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="complete-order-button"
                onClick={handleCompleteOrder}
                disabled={items.length === 0 || !selectedTable || isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : t("cart.completeOrder")}
              </button>
            </>
          )}

          {userRole !== "waiter" && (
            <div
              style={{
                padding: "1rem",
                textAlign: "center",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              Only waiters can place orders
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
