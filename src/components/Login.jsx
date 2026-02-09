import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearMessage } from "../redux/slices/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const onChange = (e) => {
    dispatch(clearMessage());
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      dispatch(clearMessage()); // Clear previous messages first
      return;
    }

    dispatch(loginUser(form));
  };

  useEffect(() => {
    if (success && message) {
      setTimeout(() => {
        dispatch(clearMessage());
        navigate("/");
      }, 2000);
    }
  }, [success, message, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-slate-300 text-sm mt-1">
          Login with your username and password
        </p>

        {(error || success) && (
          <div
            className={`mt-4 rounded-xl border p-3 text-sm ${
              success
                ? "border-emerald-700 bg-emerald-900/30 text-emerald-200"
                : "border-rose-700 bg-rose-900/30 text-rose-200"
            }`}
          >
            {error || message}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="e.g. saad123"
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 font-medium transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
