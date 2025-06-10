import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getAuthToken, getAuthHeader } from "../utils/authUtils";

const categories = [
  { value: "burgers", label: "Burgers" },
  { value: "extras", label: "Extras" },
  { value: "salads", label: "Salads" },
  { value: "fries", label: "Fries" },
  { value: "sauces", label: "Sauces" },
  { value: "drinks", label: "Drinks" },
];

interface MenuItem {
  _id: string;
  name: string;
  status: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  weight?: string;
  is_new: boolean;
  available: boolean;
}

interface MenuOffer {
  _id: string;
  name: string;
  status: string;
  description: string;
  price: number;
  category: string;
}

interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  role: string;
}

// Mock data for cook's menu items
const cookMenuItems: MenuItem[] = [
  {
    _id: "1",
    name: "Cook Item 1",
    status: "pending",
    description: "Description for Cook Item 1",
    price: 20,
    category: "drinks",
    image_url: "",
    is_new: false,
    available: true,
  },
  {
    _id: "2",
    name: "Cook Item 2",
    status: "rejected",
    description: "Description for Cook Item 2",
    price: 25,
    category: "fries",
    image_url: "",
    is_new: false,
    available: true,
  },
  {
    _id: "3",
    name: "Cook Item 3",
    status: "accepted",
    description: "Description for Cook Item 3",
    price: 30,
    category: "sauces",
    image_url: "",
    is_new: false,
    available: true,
  },
];

const CreateMenuItemPage: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const role = (user.profile?.role as "admin" | "cook" | "waiter") || "waiter";
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null as File | null,
    weight: "",
    is_new: false,
    available: true,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingOffers, setPendingOffers] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("weight", form.weight);
      formData.append("is_new", form.is_new.toString());
      formData.append("available", form.available.toString());

      if (form.image) {
        formData.append("image", form.image);
      }
      if (role === "admin") {
        // Admin can create dishes directly
        // Get token using our utility function
        const token = getAuthToken();

        console.log(
          "Using admin token:",
          token ? "Token found" : "No token available"
        );

        try {
          await axios.post("http://localhost:5000/api/menu", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              ...getAuthHeader(),
            },
          });
        } catch (authError: unknown) {
          const errorResponse = authError as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          console.error("Auth error details:", errorResponse.response?.data);
          throw new Error(
            `Authentication failed: ${
              errorResponse.response?.data?.message ||
              errorResponse.message ||
              "Unknown error"
            }`
          );
        }
      } else {
        // Non-admin users create menu offers that need approval
        const offerFormData = new FormData();
        offerFormData.append("name", form.name);
        offerFormData.append("price", form.price);
        offerFormData.append("description", form.description);
        offerFormData.append("category", form.category);
        offerFormData.append("weight", form.weight);
        offerFormData.append("is_new", form.is_new.toString());
        offerFormData.append("available", form.available.toString());
        offerFormData.append(
          "createdBy",
          (user.profile as UserProfile)?._id || ""
        );

        if (form.image) {
          offerFormData.append("image", form.image);
        }

        await axios.post(
          "http://localhost:5000/api/menuOffers",
          offerFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setSuccess(true);
      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        image: null,
        weight: "",
        is_new: false,
        available: true,
      });
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      let errorMessage = "An error occurred while creating the menu item";

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (role === "admin" && tabValue === 1) {
      setLoading(true);
      fetch("http://localhost:5000/api/menuOffers")
        .then((res) => res.json())
        .then((data) =>
          setPendingOffers(
            data.filter((o: MenuOffer) => o.status === "pending")
          )
        )
        .finally(() => setLoading(false));
    }
  }, [role, tabValue, success]);
  const handleAccept = async (id: string) => {
    await fetch(`http://localhost:5000/api/menuOffers/${id}/accept`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    setPendingOffers(pendingOffers.filter((o) => o._id !== id));
  };

  const handleReject = async (id: string) => {
    await fetch(`http://localhost:5000/api/menuOffers/${id}/reject`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    setPendingOffers(pendingOffers.filter((o) => o._id !== id));
  };

  const renderCreateForm = () => (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <TextField
        label={t("createMenuItem.name")}
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <TextField
        label={t("createMenuItem.price")}
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        required
      />
      <TextField
        label={t("createMenuItem.description")}
        name="description"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={2}
        required
      />
      <TextField
        select
        label={t("createMenuItem.category")}
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        {categories.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {t(`categories.${option.value}`)}
          </MenuItem>
        ))}
      </TextField>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
        {t("createMenuItem.chooseImage")}
      </Button>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }}
        />
      )}
      <TextField
        label={t("createMenuItem.weight")}
        name="weight"
        value={form.weight}
        onChange={handleChange}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={form.is_new}
            onChange={handleChange}
            name="is_new"
          />
        }
        label={t("createMenuItem.isNew")}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={form.available}
            onChange={handleChange}
            name="available"
          />
        }
        label={t("createMenuItem.available")}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Creating..." : t("createMenuItem.create")}
      </Button>
      {success && (
        <Alert severity="success">
          {role === "admin"
            ? t("createMenuItem.success")
            : "Menu offer submitted for approval"}
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </form>
  );

  const renderPendingItems = () => (
    <div>
      <h3>Pending Menu Items</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {pendingOffers.map((item) => (
            <li
              key={item._id}
              onClick={() => handleItemClick(item)}
              style={{ cursor: "pointer" }}
            >
              {item.name} - {item.status}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccept(item._id);
                }}
              >
                Accept
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(item._id);
                }}
              >
                Reject
              </Button>
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
        {cookMenuItems.map((item) => (
          <li
            key={item._id}
            onClick={() => handleItemClick(item)}
            style={{ cursor: "pointer" }}
          >
            {item.name} - {item.status}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 12px #0001",
        padding: "2rem",
      }}
    >
      <h2>{t("createMenuItem.title")}</h2>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label={t("createMenuItem.create")} />
        {role === "admin" && <Tab label="Pending Items" />}
        {(role === "admin" || role === "cook") && <Tab label="Your Items" />}
      </Tabs>
      <Box p={3}>
        {tabValue === 0 && renderCreateForm()}
        {tabValue === 1 && role === "admin" && renderPendingItems()}
        {tabValue === 1 && role === "cook" && renderCookItems()}
        {tabValue === 2 && role === "admin" && renderCookItems()}
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedItem?.name}</DialogTitle>
        <DialogContent>
          <p>
            <strong>{t("createMenuItem.description")}:</strong>{" "}
            {selectedItem?.description}
          </p>
          <p>
            <strong>{t("createMenuItem.price")}:</strong> {selectedItem?.price}
          </p>
          <p>
            <strong>{t("createMenuItem.category")}:</strong>{" "}
            {selectedItem?.category}
          </p>
          {selectedItem?.image_url && (
            <img
              src={selectedItem.image_url}
              alt={selectedItem.name}
              style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("dialogs.close")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateMenuItemPage;
