function SendMessage({messageInput,setMessageInput,handleSendMessage}:any) {
    return (
        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    // Add these props for functionality:
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                    className="bg-teal-500 text-white p-3 rounded-xl cursor-pointer hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    // Add click handler:
                    onClick={handleSendMessage}
                   
                    disabled={!messageInput.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default SendMessage;
