import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import SearchAutocomplete from "../components/Navbar/SearchAutocomplete";

interface Table {
  _id: string;
  number: number;
  seats: number;
  status: string;
}

interface TableOrder {
  [tableNumber: number]: { name: string; price: number }[];
}

interface OrderStatus {
  [tableNumber: number]: "ordered" | "cooking" | "ready";
}

interface DatabaseOrder {
  _id: string;
  tableNumber: number;
  items: { name: string; price: number; quantity: number }[];
  waiterId: string;
  status: "ordered" | "cooking" | "ready";
  createdAt: string;
}

interface OrderStatus {
  [tableNumber: number]: "ordered" | "cooking" | "ready";
}

const TablesPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const userRole = user.profile?.role;
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [order, setOrder] = useState<TableOrder>({});
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({});
  const [databaseOrders, setDatabaseOrders] = useState<DatabaseOrder[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const isCook = userRole === "cook";

  useEffect(() => {
    fetchTables();
    fetchOrders();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tables");
      if (response.ok) {
        const data = await response.json();
        setTables(data);
      } else {
        console.error('Failed to fetch tables');
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      if (response.ok) {
        const data = await response.json();
        setDatabaseOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddToOrder = (dish: { name: string; price: number }) => {
    if (!selectedTable) return;
    setOrder((prev) => ({
      ...prev,
      [selectedTable.number]: [
        ...(prev[selectedTable.number] || []),
        { name: dish.name, price: dish.price },
      ],
    }));
    setOrderStatus((prev) => ({
      ...prev,
      [selectedTable.number]: "ordered",
    }));
  };

  const getTotal = (tableNumber: number) => {
    return (order[tableNumber] || []).reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
  };

  const getCurrentTableOrder = (tableNumber: number): DatabaseOrder | null => {
    return databaseOrders.find(
      (order) => order.tableNumber === tableNumber && order.status !== "ready"
    ) || null;
  };

  const handleStatusChange = async (newStatus: "ordered" | "cooking" | "ready") => {
    if (!selectedTable || userRole !== "cook") {
      alert("Only cooks can change order status");
      return;
    }

    // Find the database order for this table
    const tableOrder = databaseOrders.find(
      (order) => order.tableNumber === selectedTable.number && order.status !== "ready"
    );

    if (!tableOrder) {
      alert("No active order found for this table");
      return;
    }

    // Only allow valid status transitions
    const validTransitions: Record<string, string[]> = {
      ordered: ["cooking"],
      cooking: ["ready"],
      ready: []
    };

    if (!validTransitions[tableOrder.status]?.includes(newStatus)) {
      alert(`Cannot change status from ${tableOrder.status} to ${newStatus}`);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${tableOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...tableOrder, status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        
        // Update the database orders state
        setDatabaseOrders((prev) =>
          prev.map((order) =>
            order._id === tableOrder._id ? updatedOrder : order
          )
        );
        
        // Update the order status state
        setOrderStatus((prev) => ({
          ...prev,
          [selectedTable.number]: newStatus,
        }));
        
        // Refresh orders to ensure consistency
        await fetchOrders();
        
        alert(`Order status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(`Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCompleteTableOrder = async () => {
    if (!selectedTable || userRole !== "waiter") {
      alert("Only waiters can complete orders");
      return;
    }

    const tableOrder = order[selectedTable.number];
    if (!tableOrder || tableOrder.length === 0) {
      alert("No items in order");
      return;
    }

    try {
      const orderData = {
        tableNumber: selectedTable.number,
        items: tableOrder.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: 1, // Default quantity, could be enhanced later
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
        const newOrder = await response.json();
        alert(`Order successfully placed for Table ${selectedTable.number}!`);
        
        // Clear the local order for this table
        setOrder((prev) => ({
          ...prev,
          [selectedTable.number]: [],
        }));
        
        // Add the new order to database orders
        setDatabaseOrders((prev) => [...prev, newOrder]);
        
        // Update order status to "ordered"
        setOrderStatus((prev) => ({
          ...prev,
          [selectedTable.number]: "ordered",
        }));
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleTableStatusChange = async (tableId: string, newStatus: "free" | "occupied" | "booked") => {
    if (userRole !== "admin" && userRole !== "waiter") {
      alert("Only admins and waiters can change table status");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tables/${tableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTable = await response.json();
        
        // Update the tables state
        setTables((prev) =>
          prev.map((table) =>
            table._id === tableId ? updatedTable : table
          )
        );
        
        // Refresh tables to ensure consistency
        await fetchTables();
        
        alert(`Table status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update table status");
      }
    } catch (error) {
      console.error("Error updating table status:", error);
      alert(`Failed to update table status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Tables</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {tables.map((table: Table) => (
          <div
            key={table._id}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 16,
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div>
                <strong>Table {table.number}</strong> — Seats: {table.seats} —
                Status:{" "}
                {userRole === "admin" || userRole === "waiter" ? (
                  <select
                    value={table.status}
                    onChange={(e) => handleTableStatusChange(table._id, e.target.value as "free" | "occupied" | "booked")}
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "0.9rem",
                      color:
                        table.status === "free"
                          ? "green"
                          : table.status === "occupied"
                          ? "orange"
                          : "blue",
                      fontWeight: "bold"
                    }}
                  >
                    <option value="free" style={{ color: "green" }}>free</option>
                    <option value="occupied" style={{ color: "orange" }}>occupied</option>
                    <option value="booked" style={{ color: "blue" }}>booked</option>
                  </select>
                ) : (
                  <span
                    style={{
                      color:
                        table.status === "free"
                          ? "green"
                          : table.status === "occupied"
                          ? "orange"
                          : "blue",
                      fontWeight: "bold"
                    }}
                  >
                    {table.status}
                  </span>
                )}
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleTableClick(table)}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedTable?.number}</DialogTitle>
        <DialogContent>
          {selectedTable && (
            <>
              <div>
                <strong>Table:</strong> {selectedTable.number}
              </div>
              <div>
                <strong>Seats:</strong> {selectedTable.seats}
              </div>
              <div>
                <strong>Status:</strong> {selectedTable.status}
              </div>
              <div style={{ marginTop: 16 }}>
                <strong>Order:</strong>
                <div style={{ marginBottom: 8 }}>
                  {(order[selectedTable.number] || []).map((dish, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "2px 0",
                      }}
                    >
                      <span>{dish.name}</span>
                      <span style={{ color: "#888" }}>{dish.price} UAH</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontWeight: 600, margin: "8px 0" }}>
                  Total: {getTotal(selectedTable.number)} UAH
                </div>
                <div style={{ margin: "8px 0" }}>
                  <strong>Order Status:</strong>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    {(() => {
                      const currentOrder = getCurrentTableOrder(selectedTable.number);
                      const currentStatus = currentOrder?.status || null;
                      
                      return (
                        <>
                          <Button
                            size="small"
                            variant={currentStatus === "ordered" ? "contained" : "outlined"}
                            color="primary"
                            disabled={userRole !== "cook" || !currentOrder || currentStatus !== "ordered"}
                            onClick={() => handleStatusChange("cooking")}
                          >
                            Ordered
                          </Button>
                          <Button
                            size="small"
                            variant={currentStatus === "cooking" ? "contained" : "outlined"}
                            color="secondary"
                            disabled={userRole !== "cook" || !currentOrder || currentStatus !== "cooking"}
                            onClick={() => handleStatusChange("ready")}
                          >
                            Cooking
                          </Button>
                          <Button
                            size="small"
                            variant={currentStatus === "ready" ? "contained" : "outlined"}
                            color="success"
                            disabled={true}
                          >
                            Ready
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                  {getCurrentTableOrder(selectedTable.number) && (
                    <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
                      Current Status: {getCurrentTableOrder(selectedTable.number)?.status}
                    </div>
                  )}
                </div>
                {userRole === "waiter" && (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setSearchOpen(true)}
                      style={{ marginRight: 8 }}
                    >
                      Make Order
                    </Button>
                    {(order[selectedTable.number] || []).length > 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCompleteTableOrder}
                      >
                        Complete Order
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <SearchAutocomplete
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onAdd={(dish) => {
          handleAddToOrder(dish);
          setSearchOpen(false);
        }}
      />
    </div>
  );
};

export default TablesPage;
