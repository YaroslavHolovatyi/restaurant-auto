import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { TextField, Button, MenuItem, Checkbox, FormControlLabel, Alert, Tabs, Tab, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const categories = [
  { value: 'burgers', label: 'Burgers' },
  { value: 'extras', label: 'Extras' },
  { value: 'salads', label: 'Salads' },
  { value: 'fries', label: 'Fries' },
  { value: 'sauces', label: 'Sauces' },
  { value: 'drinks', label: 'Drinks' },
];

interface MenuItem {
  id: number;
  name: string;
  status: string;
  description: string;
  price: number;
  category: string;
}

interface MenuOffer {
  _id: string;
  name: string;
  status: string;
  description: string;
  price: number;
  category: string;
}

// Mock data for pending menu items
const pendingMenuItems: MenuItem[] = [
  { id: 1, name: 'Pending Item 1', status: 'pending', description: 'Description for Pending Item 1', price: 10, category: 'burgers' },
  { id: 2, name: 'Pending Item 2', status: 'pending', description: 'Description for Pending Item 2', price: 15, category: 'salads' },
];

// Mock data for cook's menu items
const cookMenuItems: MenuItem[] = [
  { id: 1, name: 'Cook Item 1', status: 'pending', description: 'Description for Cook Item 1', price: 20, category: 'drinks' },
  { id: 2, name: 'Cook Item 2', status: 'rejected', description: 'Description for Cook Item 2', price: 25, category: 'fries' },
  { id: 3, name: 'Cook Item 3', status: 'accepted', description: 'Description for Cook Item 3', price: 30, category: 'sauces' },
];

const CreateMenuItemPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const role = user.profile?.role as 'admin' | 'cook' | 'waiter' || 'waiter';
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image_url: '',
    weight: '',
    is_new: false,
    available: true,
    currency: 'UAH',
  });
  const [success, setSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingOffers, setPendingOffers] = useState<MenuOffer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    // Here you would send the data to the backend or update the db
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleItemClick = (item: MenuItem | MenuOffer) => {
    setSelectedItem(item as MenuItem);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (role === 'admin' && tabValue === 1) {
      setLoading(true);
      fetch('http://localhost:5000/api/menuOffers')
        .then(res => res.json())
        .then(data => setPendingOffers(data.filter((o: MenuOffer) => o.status === 'pending')))
        .finally(() => setLoading(false));
    }
  }, [role, tabValue, success]);

  const handleAccept = async (id: string) => {
    await fetch(`http://localhost:5000/api/menuOffers/${id}/accept`, { method: 'POST' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    setPendingOffers(pendingOffers.filter(o => o._id !== id));
  };

  const handleReject = async (id: string) => {
    await fetch(`http://localhost:5000/api/menuOffers/${id}/reject`, { method: 'POST' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    setPendingOffers(pendingOffers.filter(o => o._id !== id));
  };

  const renderCreateForm = () => (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TextField label="Name" name="name" value={form.name} onChange={handleChange} required />
      <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} required />
      <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={2} required />
      <TextField select label="Category" name="category" value={form.category} onChange={handleChange} required>
        {categories.map(option => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </TextField>
      <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
      <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>Choose Image</Button>
      {form.image_url && <img src={form.image_url} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />}
      <TextField label="Weight" name="weight" value={form.weight} onChange={handleChange} />
      <FormControlLabel
        control={<Checkbox checked={form.is_new} onChange={handleChange} name="is_new" />}
        label="Is New"
      />
      <FormControlLabel
        control={<Checkbox checked={form.available} onChange={handleChange} name="available" />}
        label="Available"
      />
      <Button type="submit" variant="contained" color="primary">Create</Button>
      {success && <Alert severity="success">Menu item created (mock)!</Alert>}
    </form>
  );

  const renderPendingItems = () => (
    <div>
      <h3>Pending Menu Items</h3>
      {loading ? <p>Loading...</p> : (
        <ul>
          {pendingOffers.map(item => (
            <li key={item._id} onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
              {item.name} - {item.status}
              <Button onClick={e => { e.stopPropagation(); handleAccept(item._id); }}>Accept</Button>
              <Button onClick={e => { e.stopPropagation(); handleReject(item._id); }}>Reject</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderCookItems = () => (
    <div>
      <h3>Your Menu Items</h3>
      <ul>
        {cookMenuItems.map(item => (
          <li key={item.id} onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
            {item.name} - {item.status}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '2rem' }}>
      <h2>Create New Menu Item</h2>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Create" />
        {role === 'admin' && <Tab label="Pending Items" />}
        {(role === 'admin' || role === 'cook') && <Tab label="Your Items" />}
      </Tabs>
      <Box p={3}>
        {tabValue === 0 && renderCreateForm()}
        {tabValue === 1 && role === 'admin' && renderPendingItems()}
        {tabValue === 1 && role === 'cook' && renderCookItems()}
        {tabValue === 2 && role === 'admin' && renderCookItems()}
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedItem?.name}</DialogTitle>
        <DialogContent>
          <p><strong>Description:</strong> {selectedItem?.description}</p>
          <p><strong>Price:</strong> {selectedItem?.price}</p>
          <p><strong>Category:</strong> {selectedItem?.category}</p>
          <p><strong>Status:</strong> {selectedItem?.status}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateMenuItemPage; 