import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import SearchAutocomplete from '../components/Navbar/SearchAutocomplete';

interface Table {
  _id: string;
  number: number;
  seats: number;
  status: string;
}

interface TableOrder {
  [tableNumber: number]: string[]; // array of dish names (mock)
}

const TableList: React.FC<{ onTableSelect: (tableNumber: number) => void }> = ({ onTableSelect }) => {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/tables')
      .then(res => res.json())
      .then(setTables);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h3>Tables</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tables.map((table: Table) => (
          <div key={table._id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong>Table {table.number}</strong> — Seats: {table.seats} — Status: <span style={{ color: table.status === 'free' ? 'green' : table.status === 'occupied' ? 'orange' : 'blue' }}>{table.status}</span>
            </div>
            <button style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#F34C2D', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => onTableSelect(table.number)}>
              {table.status === 'occupied' ? 'View/Add Orders' : 'Add Order'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sideMenuSelection, setSideMenuSelection] = useState<string | null>(null);
  const [tableOrder, setTableOrder] = useState<TableOrder>({});
  const [searchTable, setSearchTable] = useState<number | null>(null);

  if (!user.isLoggedIn || !user.profile) {
    return <div style={{ padding: 32 }}>You are not logged in.</div>;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleTableSelect = (tableNumber: number) => {
    setSearchTable(tableNumber);
  };

  const handleAddToTableOrder = (dishName: string) => {
    if (searchTable == null) return;
    setTableOrder(prev => ({
      ...prev,
      [searchTable]: [...(prev[searchTable] || []), dishName]
    }));
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '2rem' }}>
      <h2 style={{ marginBottom: 24 }}>Profile</h2>
      <div><strong>Username:</strong> {user.username}</div>
      <div><strong>Name:</strong> {user.profile.name}</div>
      <div><strong>Email:</strong> {user.profile.email}</div>
      <div><strong>Role:</strong> {user.profile.role}</div>
      <button style={{ marginTop: 32, width: '100%', padding: '0.75rem', background: '#F34C2D', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }} onClick={handleLogout}>
        Logout
      </button>
      {user.profile.role === 'admin' && sideMenuSelection === 'tables' && (
        <div style={{ marginTop: 32 }}>
          <TableList onTableSelect={handleTableSelect} />
          {searchTable && (
            <SearchAutocomplete
              open={!!searchTable}
              onClose={() => setSearchTable(null)}
              onAdd={dish => handleAddToTableOrder(dish.name)}
            />
          )}
          {searchTable && tableOrder[searchTable] && (
            <div style={{ marginTop: 16, background: '#f8f8f8', padding: 16, borderRadius: 8 }}>
              <strong>Order for Table {searchTable}:</strong>
              <ul>
                {tableOrder[searchTable].map((dish, idx) => (
                  <li key={idx}>{dish}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {user.profile.role === 'admin' && sideMenuSelection && sideMenuSelection !== 'tables' && (
        <div style={{ marginTop: 32, background: '#f8f8f8', padding: 24, borderRadius: 12 }}>
          <strong>Selected:</strong> {sideMenuSelection}
          <div style={{ marginTop: 12, color: '#888' }}>(Mock page content here)</div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 