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
  author?: string;
}

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
  const [userItems, setUserItems] = useState<MenuItem[]>([]);
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
        offerFormData.append("author", user.profile?.role || "cook");

        if (form.image) {
          offerFormData.append("image", form.image);
        }
        await axios.post("http://localhost:5000/api/recipes", offerFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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
      fetch("http://localhost:5000/api/recipes/pending")
        .then((res) => res.json())
        .then((data) => setPendingOffers(data))
        .catch((err) => {
          console.error("Error fetching pending recipes:", err);
          setError("Failed to load pending items");
        })
        .finally(() => setLoading(false));
    }

    // Fetch user's own items for cook or admin
    if (
      (role === "cook" && tabValue === 1) ||
      (role === "admin" && tabValue === 2)
    ) {
      setLoading(true);
      const currentUserRole = user.profile?.role || "cook";

      if (role === "admin") {
        // For admin, fetch from both recipes and dishes collections
        Promise.all([
          fetch(
            `http://localhost:5000/api/recipes/author/${currentUserRole}`
          ).then((res) => res.json()),
          fetch("http://localhost:5000/api/menu").then((res) => res.json()),
        ])
          .then(([recipesData, dishesData]) => {
            // Combine recipes and dishes, adding status field to dishes
            const recipesWithStatus = recipesData || [];
            const dishesWithStatus = (dishesData || []).map(
              (dish: MenuItem) => ({
                ...dish,
                status: "accepted", // Dishes created by admin are automatically accepted
                author: currentUserRole,
              })
            );

            // Combine both arrays
            const allItems = [...recipesWithStatus, ...dishesWithStatus];
            setUserItems(allItems);
          })
          .catch((err) => {
            console.error("Error fetching admin items:", err);
            setError("Failed to load your items");
          })
          .finally(() => setLoading(false));
      } else {
        // For cook, only fetch from recipes
        fetch(`http://localhost:5000/api/recipes/author/${currentUserRole}`)
          .then((res) => res.json())
          .then((data) => setUserItems(data))
          .catch((err) => {
            console.error("Error fetching user recipes:", err);
            setError("Failed to load your items");
          })
          .finally(() => setLoading(false));
      }
    }
  }, [role, tabValue, success, user.profile?.role]);
  const handleAccept = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/recipes/${id}/accept`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setPendingOffers(pendingOffers.filter((o) => o._id !== id));
    } catch (error) {
      console.error("Error accepting recipe:", error);
      setError("Failed to accept recipe");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/recipes/${id}/reject`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setPendingOffers(pendingOffers.filter((o) => o._id !== id));
    } catch (error) {
      console.error("Error rejecting recipe:", error);
      setError("Failed to reject recipe");
    }
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
      <h3 style={{ marginBottom: "1.5rem", color: "#333" }}>
        Pending Menu Items
      </h3>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading pending items...</p>
        </div>
      ) : pendingOffers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          <p>No pending items to review</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {pendingOffers.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "1.5rem",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => handleItemClick(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              {/* Status Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: "#ff9800",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {item.status}
              </div>{" "}
              {/* Item Image */}
              {item.image_url && (
                <div style={{ marginBottom: "1rem" }}>
                  <img
                    src={`http://localhost:5000${item.image_url}`}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}
              {/* Item Info */}
              <div style={{ marginBottom: "1rem" }}>
                <h4
                  style={{
                    margin: "0 0 0.5rem 0",
                    color: "#333",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </h4>
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    color: "#666",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                  }}
                >
                  {item.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#2e7d32",
                    }}
                  >
                    {item.price} UAH
                  </span>
                  <span
                    style={{
                      backgroundColor: "#f5f5f5",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      color: "#666",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.category}
                  </span>
                </div>
                {item.weight && (
                  <p
                    style={{
                      margin: "0.5rem 0 0 0",
                      color: "#888",
                      fontSize: "0.85rem",
                    }}
                  >
                    Weight: {item.weight}
                  </p>
                )}
              </div>
              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  style={{
                    flex: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(item._id);
                  }}
                >
                  ✓ Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  style={{
                    flex: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(item._id);
                  }}
                >
                  ✗ Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  const renderCookItems = () => (
    <div>
      <h3 style={{ marginBottom: "1.5rem", color: "#333" }}>Your Menu Items</h3>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading your items...</p>
        </div>
      ) : userItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          <p>You haven't created any menu items yet</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {userItems.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "1.5rem",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => handleItemClick(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              {/* Status Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor:
                    item.status === "accepted"
                      ? "#4caf50"
                      : item.status === "rejected"
                      ? "#f44336"
                      : "#ff9800",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {item.status}
              </div>

              {/* Item Image */}
              {item.image_url && (
                <div style={{ marginBottom: "1rem" }}>
                  <img
                    src={`http://localhost:5000${item.image_url}`}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}

              {/* Item Info */}
              <div style={{ marginBottom: "1rem" }}>
                <h4
                  style={{
                    margin: "0 0 0.5rem 0",
                    color: "#333",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </h4>
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    color: "#666",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                  }}
                >
                  {item.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#2e7d32",
                    }}
                  >
                    {item.price} UAH
                  </span>
                  <span
                    style={{
                      backgroundColor: "#f5f5f5",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      color: "#666",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.category}
                  </span>
                </div>
                {item.weight && (
                  <p
                    style={{
                      margin: "0.5rem 0 0 0",
                      color: "#888",
                      fontSize: "0.85rem",
                    }}
                  >
                    Weight: {item.weight}
                  </p>
                )}
              </div>

              {/* Status Message */}
              <div
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  backgroundColor:
                    item.status === "accepted"
                      ? "#e8f5e8"
                      : item.status === "rejected"
                      ? "#ffebee"
                      : "#fff3e0",
                  color:
                    item.status === "accepted"
                      ? "#2e7d32"
                      : item.status === "rejected"
                      ? "#d32f2f"
                      : "#f57c00",
                  fontSize: "0.9rem",
                  fontWeight: "medium",
                }}
              >
                {item.status === "accepted" && "✓ Approved and added to menu"}
                {item.status === "rejected" && "✗ Rejected by admin"}
                {item.status === "pending" && "⏳ Waiting for admin approval"}
              </div>
            </div>
          ))}
        </div>
      )}
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
          </p>{" "}
          {selectedItem?.image_url && (
            <img
              src={`http://localhost:5000${selectedItem.image_url}`}
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
