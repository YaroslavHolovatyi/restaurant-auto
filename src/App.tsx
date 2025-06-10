import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./styles/global.css";
import "./App.css";
import MainPage from "./pages/MainPage";
import MenuPage from "./pages/MenuPage/MenuPage";
import Navbar from "./components/Navbar/Navbar";
import ProfilePage from "./pages/ProfilePage";
import TablesPage from "./pages/TablesPage";
import CreateMenuItemPage from "./pages/CreateMenuItemPage";
import AddUserPage from "./pages/AddUserPage";
import AuthProvider from "./components/Auth/AuthProvider";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <div className="app">
            <Navbar />
            <div className="app-content">
              {" "}
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tables"
                  element={
                    <ProtectedRoute>
                      <TablesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-menu-item"
                  element={
                    <ProtectedRoute>
                      <CreateMenuItemPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-user"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AddUserPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </Router>
    </Provider>
  );
};

export default App;
