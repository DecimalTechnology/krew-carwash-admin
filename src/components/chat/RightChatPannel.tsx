import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, resolveIssue } from "../../api/admin/chatService";
import { useSocket } from "../../context/SocketProvider";
import SendMessage from "./SendMessage";
import { IRootState } from "../../app/store";
import { setChats, setSelectedChat } from "../../features/chatSlice";
import { useNavigate } from "react-router";

function RightChatPannel() {
    const selectedChat = useSelector((state: any) => state?.chat?.selectedChat);
    console.log(selectedChat);
    const allChats = useSelector((data: IRootState) => data.chat.chats);
    const admin = useSelector((state: IRootState) => state.admin.adminData);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookingId, setBookingId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [chat, setChat] = useState<any>();
    const { socket } = useSocket();
    const [messageInput, setMessageInput] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch();
    const [issueResolved, setIssueResolved] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIssueResolved(selectedChat?.issueResolved);
    }, [selectedChat]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchChat = async () => {
            if (!selectedChat?._id) return;

            setLoading(true);
            setError(null);

            try {
                const res = await getMessages(selectedChat._id);
                console.log(res);
                setMessages(res?.messages || []);
                setBookingId(res?.chat?.bookingId?.bookingId || "");
                setChat(res?.chat);
            } catch (err) {
                console.error("Error fetching messages:", err);
                setError("Failed to load messages. Please try again.");
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChat();
    }, [selectedChat]);

    useEffect(() => {
        if (!socket || !selectedChat?._id) return;

        const roomId = selectedChat._id;

        // Join new room
        socket.emit("join_room", roomId);

        // Leave the room when chat changes or component unmounts
        return () => {
            socket.emit("leave_room", roomId);
        };
    }, [socket, selectedChat?._id]);

    const handleSendMessage = () => {
        const newMessageObj = {
            senderType: "Admin",
            content: messageInput,
            createdAt: new Date(),
            updatedAt: new Date(),
            chatId: selectedChat?._id,
            senderId: admin?._id,
        };

        setMessages((prev: any) => [...prev, newMessageObj]);
        setMessageInput("");
        if (socket) socket.emit("send_message", { roomId: chat?._id, message: newMessageObj });
    };

    useEffect(() => {
        if (!socket) return;

        const handler = (message: any) => {
            setMessages((prev) => [...prev, message]);
        };

        socket.on("receive_message", handler);

        return () => {
            socket.off("receive_message", handler);
        };
    }, [socket]);

    const resolve = async (chatId: string) => {
        try {
            const res = await resolveIssue(selectedChat?._id as string);

            const newChats = allChats.map((obj: any) => (obj?._id == selectedChat?._id ? { ...obj, issueResolved: !issueResolved } : obj));
            dispatch(setChats(newChats));
            //  dispatch(setSelectedChat({ ...selectedChat, issueResolved: !selectedChat?.issueResolved }));
            setIssueResolved(!issueResolved);
        } catch (error) {}
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-50 h-[86%]">
            {/* Chat Header */}
            {selectedChat && (
                <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0">
                    {/* Left Side: Profile Info */}
                    <div className="flex items-center">
                        {
                            <img
                                onClick={() => navigate(`/cleaners/${selectedChat?.cleaner?._id}`)}
                                src="https://i.pravatar.cc/150?u=jsmith"
                                alt="John Smith"
                                className="cursor-pointer w-10 h-10 rounded-full object-cover mr-3"
                            />
                        }
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">{selectedChat?.cleaner?.name || "Select a chat"}</h3>

                            {bookingId && (
                                <div
                                    onClick={() => {
                                        navigate(`/bookings/${selectedChat?.bookingId}`);
                                    }}
                                    className="mt-1 inline-flex items-center text-xs px-2 py-1 rounded-full border border-teal-500 text-teal-600 cursor-pointer hover:bg-teal-50 transition"
                                >
                                    <span className="font-medium">Booking: {bookingId}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center: Compact Issue Report */}
                    {selectedChat && (
                        <div className="flex-1 mx-6">
                            <div className="relative group flex items-center justify-center bg-red-50 border border-red-200 rounded-lg px-4 py-2 max-w-md mx-auto cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-wide">
                                        Issue
                                    </span>

                                    <span className="text-xs text-gray-700 font-medium">{chat?.issue}</span>

                                    <div className="w-px h-4 bg-red-200 mx-2"></div>

                                    {/* truncated description */}
                                    <span className="text-xs text-gray-500 line-clamp-1 max-w-[120px]">{chat?.description}</span>
                                </div>

                                {/* Hover Popup */}
                                <div className="absolute z-50 hidden group-hover:block bg-white shadow-lg border border-gray-200 rounded-lg p-3 w-60 top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-gray-700 leading-relaxed">
                                    {chat?.description}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Right Side: Action Button */}
                    <div>
                        <div
                            onClick={() => resolve(selectedChat?._id)}
                            className={`
      cursor-pointer text-xs font-bold px-4 py-2 rounded-lg 
      ${issueResolved ? "bg-white border border-green-500 text-green-600" : "bg-white border border-red-500 text-red-600"}
    `}
                        >
                            {issueResolved ? "Resolved" : "Mark Resolved"}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
                    <p className="text-gray-600">Loading messages...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-800 font-medium mb-2">Oops! Something went wrong</p>
                    <p className="text-gray-600 text-sm">{error}</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && (!selectedChat || messages.length === 0) && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    {!selectedChat ? (
                        <>
                            <p className="text-gray-800 font-medium mb-2">Select a conversation</p>
                            <p className="text-gray-600 text-sm">Choose a chat from the left panel to view messages</p>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-800 font-medium mb-2">No messages yet</p>
                            <p className="text-gray-600 text-sm">Start the conversation by sending a message</p>
                        </>
                    )}
                </div>
            )}

            {/* Messages Area */}
            {!loading && !error && (
                <>
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((message: any) => {
                            const isAdmin = message?.senderType === "Admin";

                            return (
                                <div key={message._id || message.id}>
                                    {isAdmin ? (
                                        <div className="flex justify-start">
                                            <div className="max-w-[70%] rounded-2xl px-4 py-3 shadow-sm bg-white text-gray-800 rounded-bl-none border border-gray-100">
                                                <p className="text-sm leading-relaxed">{message?.content}</p>
                                                <p className="text-[10px] mt-1 text-right text-gray-400">
                                                    {message?.createdAt ? formatTime(message.createdAt) : "Just now"}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end">
                                            <div className="max-w-[70%] rounded-2xl px-4 py-3 shadow-sm bg-teal-500 text-white rounded-br-none border border-teal-600">
                                                <p className="text-sm leading-relaxed">{message?.content}</p>
                                                <p className="text-[10px] mt-1 text-right text-teal-100">
                                                    {message?.createdAt ? formatTime(message.createdAt) : "Just now"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* 👇 stick this at the bottom */}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input Area */}
                    <SendMessage messageInput={messageInput} setMessageInput={setMessageInput} handleSendMessage={handleSendMessage} />
                </>
            )}
        </div>
    );
}

export default RightChatPannel;
