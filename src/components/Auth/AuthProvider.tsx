import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import type { RootState } from "../../store/store";
import {
  clearAuthData,
  updateLastActivity,
  checkUserInactivity,
} from "../../utils/authUtils";

interface AuthProviderProps {
  children: React.ReactNode;
  inactivityTimeout?: number; // in milliseconds
}

const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  inactivityTimeout = 15 * 60 * 1000, // 15 minutes by default
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // Reset the inactivity timer on user activity
  const handleUserActivity = () => {
    // Use utility function to update last activity timestamp
    updateLastActivity();
  };

  // Check if user has been inactive for too long
  const checkInactivity = () => {
    if (checkUserInactivity(inactivityTimeout)) {
      console.log("User inactive for too long, logging out");
      dispatch(logout());
      navigate("/");
      return true;
    }
    return false;
  };  // Setup inactivity tracking
  useEffect(() => {
    if (isLoggedIn) {
      // Initialize the lastActivity on login
      if (!sessionStorage.getItem("lastActivity")) {
        sessionStorage.setItem("lastActivity", Date.now().toString());
      }

      // Add event listeners for user activity
      const events = [
        "mousedown",
        "mousemove",
        "keypress",
        "scroll",
        "touchstart",
      ];
      events.forEach((event) => {
        window.addEventListener(event, handleUserActivity);
      });

      // Set inactivity check interval
      const interval = setInterval(() => {
        checkInactivity();
      }, 60000); // Check every minute

      return () => {
        // Remove event listeners
        events.forEach((event) => {
          window.removeEventListener(event, handleUserActivity);
        });

        // Clear the interval
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      // Clear lastActivity when logged out
      sessionStorage.removeItem("lastActivity");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, inactivityTimeout, dispatch, navigate]);

  // Handle page refresh/reload logout
  useEffect(() => {
    // Function to handle beforeunload event (page refresh)
    const handleBeforeUnload = () => {
      // Save a timestamp for when the user is about to leave
      sessionStorage.setItem("pageReloadTimestamp", Date.now().toString());
    };

    // Function to check if the page was reloaded
    const checkPageReload = () => {
      const timestamp = sessionStorage.getItem("pageReloadTimestamp");
      if (timestamp) {
        // Page was reloaded, remove timestamp and log the user out
        sessionStorage.removeItem("pageReloadTimestamp");
        if (isLoggedIn) {
          console.log("Page was reloaded, logging out user");
          dispatch(logout());
          navigate("/");
        }
      }
    };

    // Set up event listener for page unload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check if the page was reloaded when the component mounts
    checkPageReload();

    // Clear user session if localStorage token exists but Redux store is not logged in
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn) {
      clearAuthData();
    }

    // Clean up event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch, navigate, isLoggedIn]);

  return <>{children}</>;
};

export default AuthProvider;
