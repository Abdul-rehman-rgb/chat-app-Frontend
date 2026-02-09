import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearMessage } from "../redux/slices/userSlice";

export default function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  const passwordMatch = useMemo(
    () =>
      form.password.length > 0 &&
      form.confirmPassword.length > 0 &&
      form.password === form.confirmPassword,
    [form.password, form.confirmPassword]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    dispatch(clearMessage());
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(clearMessage());

    // basic client-side validations (same as backend intent)
    if (!form.fullName || !form.username || !form.password || !form.confirmPassword || !form.gender) {
      return;
    }
    if (form.password !== form.confirmPassword) {
      return;
    }

    const fd = new FormData();
    fd.append("fullName", form.fullName);
    fd.append("username", form.username);
    fd.append("password", form.password);
    fd.append("confirmPassword", form.confirmPassword);
    fd.append("gender", form.gender);
    if (profilePhoto) fd.append("profilePhoto", profilePhoto);

    dispatch(registerUser(fd));
  };

  useEffect(() => {
    if (success && message) {
      // reset
      setForm({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "male",
      });
      setProfilePhoto(null);
      setTimeout(() => {
        dispatch(clearMessage());
        navigate("/login");
      }, 2000);
    }
  }, [success, message, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="text-slate-300 mt-1 text-sm">
            Signup with your details. Profile photo is optional.
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
            {/* Full Name */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="e.g. Saad Ahmed"
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Username */}
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

            {/* Gender */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {form.confirmPassword.length > 0 && (
                <p className={`mt-1 text-xs ${passwordMatch ? "text-emerald-300" : "text-rose-300"}`}>
                  {passwordMatch ? "Passwords match ✅" : "Passwords do not match ❌"}
                </p>
              )}
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Profile Photo <span className="text-slate-400">(optional)</span>
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
                />
              </div>

              {profilePhoto && (
                <p className="mt-2 text-xs text-slate-300">
                  Selected: <span className="text-slate-200">{profilePhoto.name}</span>
                </p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 font-medium transition"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            <p className="text-xs text-slate-400 text-center">
              By signing up, you agree to our terms & privacy policy.
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          Backend should accept <span className="text-slate-300">multipart/form-data</span> for file upload.
        </p>
      </div>
    </div>
  );
}
