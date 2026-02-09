import Home from "./components/Home";
import Login from "./components/Login";
import SignupForm from "./components/SignupForm"
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "./redux/slices/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore user from localStorage on app load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(setUser(user));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return (
    <>
     <Routes>
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
    </Routes>
    </>
  )
}

export default App
