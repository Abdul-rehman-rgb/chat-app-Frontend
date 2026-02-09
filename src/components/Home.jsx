import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, logoutUser, fetchMessages, sendMessage } from '../redux/slices/userSlice';
import { UserAvatar } from './ui';
import { Search, Send, LogOut, Image as ImageIcon, FileText, X } from 'lucide-react';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, users, usersLoading, messages, messagesLoading, loading } = useSelector((state) => state.user);
    
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const scrollRef = useRef(null);
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);

    // Initial load users
    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        dispatch(fetchUsers());
    }, [dispatch, user]);

    // Fetch messages when user is selected
    useEffect(() => {
        if (selectedUser?._id) {
            dispatch(fetchMessages(selectedUser._id));
        }
    }, [selectedUser, dispatch]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!selectedUser || (!message.trim() && !selectedFile)) return;

        const formData = new FormData();
        if (message.trim()) formData.append('message', message);
        if (selectedFile) formData.append('file', selectedFile);

        try {
            const resultAction = await dispatch(sendMessage({ id: selectedUser._id, formData }));
            if (sendMessage.fulfilled.match(resultAction)) {
                // If backend returned created message object, it's already pushed into state by thunk
                setMessage("");
                setSelectedFile(null);
            } else {
                console.error('Send message failed:', resultAction.payload || resultAction.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 p-4">
            <div className="flex w-full max-w-6xl mx-auto overflow-hidden bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                
                {/* Sidebar */}
                <div className="w-80 flex flex-col border-r border-gray-700">
                    <div className="p-4 border-b border-gray-700">
                        <div className="relative">
                            <input type="text" placeholder="Search..." className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {usersLoading ? <p className="p-4 text-center">Loading...</p> : 
                        users.map((u) => (
                            <div key={u._id} onClick={() => setSelectedUser(u)} 
                                 className={`flex items-center gap-3 p-4 hover:bg-gray-700 cursor-pointer ${selectedUser?._id === u._id ? 'bg-gray-700' : ''}`}>
                                <UserAvatar name={u.fullName} status={u.status} src={u.profilePhoto} size="md" showStatus={true} />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">{u.fullName}</h3>
                                    <p className="text-xs text-gray-400 truncate">@{u.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-700">
                        <button onClick={() => dispatch(logoutUser())} className="flex items-center justify-center gap-2 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-gray-900">
                    {selectedUser ? (
                        <>
                            <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center gap-3">
                                <UserAvatar name={selectedUser.fullName} src={selectedUser.profilePhoto} size="sm" />
                                <span className="font-bold">{selectedUser.fullName}</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messagesLoading ? <p className="text-center text-gray-500">Loading chat...</p> : 
                                messages.map((msg) => {
                                    const isMine = msg.senderId === user?._id || msg.senderId === user?.user?._id;
                                    return (
                                    <div key={msg._id} ref={scrollRef} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-3 rounded-2xl max-w-[80%] ${isMine ? 'bg-blue-600 rounded-tr-none' : 'bg-gray-700 rounded-tl-none'}`}>
                                            {/* Render attachment if present */}
                                            {msg.fileUrl ? (
                                                msg.fileType === 'image' ? (
                                                    <img src={msg.fileUrl} alt={msg.message || 'attachment'} className="max-w-full rounded mb-2" />
                                                ) : (
                                                    <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="block text-sm underline">
                                                        {msg.fileName || 'Download attachment'}
                                                    </a>
                                                )
                                            ) : null}

                                            {msg.message ? <p className="text-sm">{msg.message}</p> : null}
                                            <div className="text-[10px] text-gray-300 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                )})}
                            </div>

                            <div className="p-4 bg-gray-800 border-t border-gray-700">
                                {/* File preview */}
                                {selectedFile && (
                                    <div className="mb-3 p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {selectedFile.type.startsWith('image/') ? (
                                                <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-20 h-20 object-cover rounded" />
                                            ) : (
                                                <FileText className="w-6 h-6" />
                                            )}
                                            <div className="min-w-0">
                                                <div className="text-sm truncate">{selectedFile.name}</div>
                                                <div className="text-xs text-gray-400">{(selectedFile.size/1024).toFixed(1)} KB</div>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedFile(null)} className="p-2 hover:bg-gray-600 rounded"><X className="w-4 h-4" /></button>
                                    </div>
                                )}

                                <div className="flex gap-2 items-center">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => imageInputRef.current?.click()} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="Attach image">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="Attach file">
                                            <FileText className="w-5 h-5" />
                                        </button>
                                        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const f = e.target.files?.[0]; if (f) setSelectedFile(f);
                                        }} />
                                        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => {
                                            const f = e.target.files?.[0]; if (f) setSelectedFile(f);
                                        }} />
                                    </div>

                                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                                           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                           placeholder="Type a message..." className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none" />
                                    <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg"><Send className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">Select a user to chat</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;