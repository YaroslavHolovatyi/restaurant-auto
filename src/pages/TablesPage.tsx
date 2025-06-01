import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@mui/material';
import SearchAutocomplete from '../components/Navbar/SearchAutocomplete';

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
  [tableNumber: number]: 'ordered' | 'cooking' | 'ready';
}

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [order, setOrder] = useState<TableOrder>({});
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const isCook = true; // Mock cook check

  useEffect(() => {
    fetch('http://localhost:5000/api/tables')
      .then(res => res.json())
      .then(setTables);
  }, []);

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddToOrder = (dish: any) => {
    if (!selectedTable) return;
    setOrder(prev => ({
      ...prev,
      [selectedTable.number]: [...(prev[selectedTable.number] || []), { name: dish.name, price: dish.price }]
    }));
    setOrderStatus(prev => ({
      ...prev,
      [selectedTable.number]: 'ordered'
    }));
  };

  const getTotal = (tableNumber: number) => {
    return (order[tableNumber] || []).reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const handleStatusChange = (newStatus: 'ordered' | 'cooking' | 'ready') => {
    if (isCook && (newStatus === 'cooking' || (selectedTable?.status === 'cooking' && newStatus === 'ready'))) {
      setSelectedTable((prev: any) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '2rem' }}>
      <h2>Tables</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tables.map((table: Table) => (
          <div key={table._id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong>Table {table.number}</strong> — Seats: {table.seats} — Status: <span style={{ color: table.status === 'free' ? 'green' : table.status === 'occupied' ? 'orange' : 'blue' }}>{table.status}</span>
            </div>
            <Button variant="contained" color="primary" onClick={() => handleTableClick(table)}>
              View
            </Button>
          </div>
        ))}
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTable?.number}</DialogTitle>
        <DialogContent>
          {selectedTable && (
            <>
              <div><strong>Table:</strong> {selectedTable.number}</div>
              <div><strong>Seats:</strong> {selectedTable.seats}</div>
              <div><strong>Status:</strong> {selectedTable.status}</div>
              <div style={{ marginTop: 16 }}>
                <strong>Order:</strong>
                <div style={{ marginBottom: 8 }}>
                  {(order[selectedTable.number] || []).map((dish, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                      <span>{dish.name}</span>
                      <span style={{ color: '#888' }}>{dish.price} UAH</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontWeight: 600, margin: '8px 0' }}>Total: {getTotal(selectedTable.number)} UAH</div>
                <div style={{ margin: '8px 0' }}>
                  <strong>Order Status:</strong>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Button size="small" variant={selectedTable?.status === 'ordered' ? 'contained' : 'outlined'} color="primary" disabled={!isCook || selectedTable?.status !== 'ordered'} onClick={() => handleStatusChange('ordered')}>Ordered</Button>
                    <Button size="small" variant={selectedTable?.status === 'cooking' ? 'contained' : 'outlined'} color="secondary" disabled={!isCook || selectedTable?.status !== 'cooking'} onClick={() => handleStatusChange('cooking')}>Cooking</Button>
                    <Button size="small" variant={selectedTable?.status === 'ready' ? 'contained' : 'outlined'} color="success" disabled={!isCook || selectedTable?.status !== 'ready'} onClick={() => handleStatusChange('ready')}>Ready</Button>
                  </div>
                </div>
                <Button variant="contained" color="secondary" onClick={() => setSearchOpen(true)}>
                  Make Order
                </Button>
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
        onAdd={dish => {
          handleAddToOrder(dish);
          setSearchOpen(false);
        }}
      />
    </div>
  );
};

export default TablesPage; 