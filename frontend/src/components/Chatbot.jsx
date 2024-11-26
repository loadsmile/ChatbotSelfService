import { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage = {
      text: "Hello! I'm AI Labby, your virtual assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getAnswer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Server error: ${data.error || response.statusText}`);
      }

      const botResponse = {
        text: data.answers[0].answer || "I don't have an answer for that.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error:", error);
      const botResponse = {
        text: "Sorry, there was an error processing your request. Please try again later.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">AI Labby</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col">
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg shadow-sm
                  ${message.isUser ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
              >
                {message.text}
              </div>
              <span className={`text-xs mt-1 text-gray-500 ${message.isUser ? 'text-right' : 'text-left'}`}>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-3 rounded-lg animate-pulse text-black">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white shadow-lg">
        <div className="max-w-4xl mx-auto flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            placeholder="Type your question..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className={`px-6 py-2 rounded-r-lg transition duration-200
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
              text-white`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
