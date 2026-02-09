import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Use relative API paths in development so Vite dev server proxy forwards requests to backend.
// In production use the absolute backend URL.
const API_BASE = import.meta.env.DEV
    ? ""
    : "https://chat-app-backend-steel-eight.vercel.app";

// --- Async Thunks ---

export const registerUser = createAsyncThunk("user/registerUser", async (formData, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_BASE}/api/v1/user/register`, { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data?.message || "Signup failed.");
        return data;
    } catch (err) { return rejectWithValue("Network error."); }
});

export const loginUser = createAsyncThunk("user/loginUser", async (credentials, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_BASE}/api/v1/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data?.message || "Login failed.");
        return data;
    } catch (err) { return rejectWithValue("Network error."); }
});

export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_BASE}/api/v1/user/logout`, { method: "POST", credentials: "include" });
        if (!res.ok) return rejectWithValue("Logout failed.");
        return null;
    } catch (err) { return rejectWithValue("Network error during logout."); }
});

export const fetchCurrentUser = createAsyncThunk("user/fetchCurrentUser", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_BASE}/api/v1/user/me`, { method: "GET", credentials: "include" });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data?.message || "Failed to fetch user.");
        return data;
    } catch (err) { return rejectWithValue("Network error."); }
});

export const fetchUsers = createAsyncThunk("user/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_BASE}/api/v1/user`, { method: "GET", credentials: "include" });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data?.message || "Failed to fetch users.");
        // Handling various response structures
        return Array.isArray(data) ? data : (data.users || data.data || []);
    } catch (err) { return rejectWithValue("Network error."); }
});

// Fetch Messages Thunk
export const fetchMessages = createAsyncThunk("user/fetchMessages", async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_BASE}/api/v1/message/${id}`, { method: "GET", credentials: "include" });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data?.message || "Failed to fetch messages.");
        return data; // Backend se jo messages array aa raha hai
    } catch (err) { return rejectWithValue("Network error."); }
});

// Send message (text or file)
export const sendMessage = createAsyncThunk(
    "user/sendMessage",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}/api/v1/message/send/${id}`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) return rejectWithValue(data?.message || "Failed to send message.");
            return data; // Expect backend to return created message object
        } catch (err) {
            return rejectWithValue("Network error.");
        }
    }
);

// --- Slice ---

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    users: [],
    messages: [], // Chat messages yahan store honge
    loading: false,
    usersLoading: false,
    messagesLoading: false, // Messages ka loading state
    error: null,
    success: false,
    message: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
            state.error = null;
            state.success = false;
        },
        clearError: (state) => { state.error = null; },
        setUser: (state, action) => { state.user = action.payload; },
        // Naya message state mein add karne ke liye (Optional: use in Socket.io)
        setNewMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        logoutLocal: (state) => {
            state.user = null;
            state.messages = [];
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            // Auth Cases
            .addCase(registerUser.pending, (state) => { state.loading = true; })
            .addCase(registerUser.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; state.message = ""; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Login successful!";
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed.";
                state.user = null;
            })

            // User List Cases
            .addCase(fetchUsers.pending, (state) => { state.usersLoading = true; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.usersLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.usersLoading = false;
                state.error = action.payload;
            })

            // --- FETCH MESSAGES CASES ---
            .addCase(fetchMessages.pending, (state) => {
                state.messagesLoading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messagesLoading = false;
                state.messages = action.payload; // Backend ka array state mein save
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.messagesLoading = false;
                state.messages = [];
                state.error = action.payload;
            })

            // Send message
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns created message object; push into messages
                if (action.payload) {
                    state.messages.push(action.payload);
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.users = [];
                state.messages = [];
                localStorage.removeItem("user");
            });
    },
});

export const { clearMessage, clearError, setUser, logoutLocal, setNewMessage } = userSlice.actions;
export default userSlice.reducer;