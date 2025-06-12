import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import "./OrdersPage.css";

interface Order {
  _id: string;
  tableNumber: number;
  items: { name: string; price: number; quantity: number }[];
  waiterId: string;
  status: "ordered" | "cooking" | "ready";
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const userRole = user.profile?.role;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/orders");
      if (response.ok) {
        const data = await response.json();
        // Sort orders by creation date, newest first
        const sortedOrders = data.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (
    orderId: string,
    newStatus: "ordered" | "cooking" | "ready"
  ) => {
    if (userRole !== "cook") {
      alert("Only cooks can change order status");
      return;
    }

    try {
      const order = orders.find((o) => o._id === orderId);
      if (!order) return;

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...order, status: newStatus }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();

        // Update the order in the local state
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? updatedOrder : order))
        );

        // Refresh orders to ensure consistency
        await fetchOrders();

        alert(`Order status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(
        `Failed to update order status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "primary";
      case "cooking":
        return "warning";
      case "ready":
        return "success";
      default:
        return "default";
    }
  };

  const getTotalPrice = (items: { price: number; quantity: number }[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="orders-container">
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography>
        <Typography>Loading orders...</Typography>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>

      {orders.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No orders found
        </Typography>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="order-card"
              elevation={3}
              data-status={order.status}
            >
              <CardContent>
                {/* Order Header */}
                <Box className="order-header">
                  <Typography variant="h6" component="h3">
                    Table {order.tableNumber}
                  </Typography>
                  <Chip
                    label={order.status.toUpperCase()}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>

                {/* Order Details */}
                <Box className="order-details">
                  <Typography variant="body2" color="textSecondary">
                    Waiter: {order.waiterId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Time: {formatDate(order.createdAt)}
                  </Typography>
                </Box>

                {/* Order Items */}
                <Box className="order-items">
                  <Typography variant="subtitle2" gutterBottom>
                    Items:
                  </Typography>
                  {order.items.map((item, index) => (
                    <Box key={index} className="order-item">
                      <Typography variant="body2">
                        {item.quantity}x {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.price * item.quantity} UAH
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Total Price */}
                <Box className="order-total">
                  <Typography variant="h6" color="primary">
                    Total: {getTotalPrice(order.items)} UAH
                  </Typography>
                </Box>

                {/* Status Change Buttons for Cooks */}
                {userRole === "cook" && (
                  <Box className="order-actions">
                    {order.status === "ordered" && (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleStatusChange(order._id, "cooking")}
                      >
                        Start Cooking
                      </Button>
                    )}
                    {order.status === "cooking" && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleStatusChange(order._id, "ready")}
                      >
                        Mark Ready
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Typography variant="body2" color="success.main">
                        Order Ready for Pickup
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
