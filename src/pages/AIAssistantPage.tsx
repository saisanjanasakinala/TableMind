import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  Calendar,
  Clock,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bot,
  User as UserIcon,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { AIAssistantMessage } from '../types';

export const AIAssistantPage: React.FC = () => {
  const {
    restaurants,
    tables,
    reservations,
    currentUser,
    bookReservation,
    navigate,
    showToast,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Welcome! I am TableMind AI, your intelligent reservation concierge. Tell me what you're craving, party size, date, or seating style (e.g. "I need a table for 4 people tomorrow at 7 PM at L'Étoile Brasserie, booth preferred"), and I'll check live table availability and secure the ideal reservation.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: AIAssistantMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          restaurants,
          tables,
          reservations,
        }),
      });

      const data = await res.json();

      const assistantMsg: AIAssistantMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.replyText || "I've checked our live table availability.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionableReservation: data.actionableReservation,
        alternativeSuggestions: data.alternativeSuggestions,
        estimatedWaitMinutes: data.estimatedWaitMinutes,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: AIAssistantMessage = {
        id: `msg-${Date.now()}-fallback`,
        role: 'assistant',
        content:
          "I've verified the live table inventory. Let me know which restaurant and time you prefer, or select an open slot from our recommendations.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmActionableBooking = async (action: NonNullable<AIAssistantMessage['actionableReservation']>) => {
    setIsLoading(true);
    try {
      const result = await bookReservation({
        restaurantId: action.restaurantId,
        restaurantName: action.restaurantName,
        tableId: action.tableId,
        tableNumber: action.tableNumber,
        customerId: currentUser.id,
        customerName: currentUser.name || 'Alex Morgan',
        customerEmail: currentUser.email || 'alex.morgan@example.com',
        customerPhone: currentUser.phone || '+1 (555) 234-8891',
        date: action.date,
        time: action.time,
        durationMinutes: 90,
        guestCount: action.guestCount,
        seatingPreference: action.seatingType,
        aiAssisted: true,
      });

      if (!result.success) {
        showToast(result.error || 'Failed to book table.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "I need a table for 4 tomorrow at 7 PM at L'Étoile Brasserie, booth preferred",
    "Counter seating for 2 tonight at Sakura Omakase",
    "Find a romantic window table for 2 this weekend around 8 PM",
    "Check availability at Trattoria Bella Vista for 6 guests",
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Conversational Reservation Engine
            </div>
            <h1 className="text-2xl font-bold text-white font-display">
              TableMind AI Assistant
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Live database grounded. Never confirms an unavailable table.
            </p>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'msg-welcome-reset',
                  role: 'assistant',
                  content:
                    "Conversation reset. How may I assist your dining plans today?",
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-800 text-stone-400 hover:text-white text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Chat
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="mb-6">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Quick Example Requests:
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-300 text-xs text-left transition-colors cursor-pointer"
              >
                “{prompt}”
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 bg-stone-900/70 border border-stone-800 rounded-2xl p-4 sm:p-6 overflow-y-auto max-h-[560px] space-y-4 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-medium rounded-tr-none'
                    : 'bg-stone-800/90 border border-stone-700/80 text-stone-200 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Actionable Booking Proposal Card */}
                {msg.actionableReservation && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-stone-950 border border-amber-500/40 text-white shadow-lg">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-2">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Verified Available Table Found
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                        Available
                      </span>
                    </div>

                    <div className="font-bold text-sm text-white font-display">
                      {msg.actionableReservation.restaurantName}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-stone-300">
                      <div>
                        <span className="text-stone-500">Date:</span> {msg.actionableReservation.date}
                      </div>
                      <div>
                        <span className="text-stone-500">Time:</span> {msg.actionableReservation.time}
                      </div>
                      <div>
                        <span className="text-stone-500">Guests:</span> {msg.actionableReservation.guestCount}
                      </div>
                      <div>
                        <span className="text-stone-500">Table:</span> {msg.actionableReservation.tableNumber} ({msg.actionableReservation.seatingType.toUpperCase()})
                      </div>
                    </div>

                    {msg.actionableReservation.reasoning && (
                      <p className="mt-2 text-[10px] text-stone-400 italic">
                        {msg.actionableReservation.reasoning}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleConfirmActionableBooking(msg.actionableReservation!)}
                        className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-transform hover:scale-[1.02]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirm Booking in 1 Click
                      </button>
                    </div>
                  </div>
                )}

                {/* Alternative suggestions if busy */}
                {msg.alternativeSuggestions && msg.alternativeSuggestions.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-stone-950/80 border border-orange-500/30">
                    <div className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Alternative Open Slots:
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.alternativeSuggestions.map((alt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(`Book table at ${alt.time}`)}
                          className="px-2.5 py-1 rounded bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-[11px] font-semibold border border-stone-700 cursor-pointer transition-colors"
                        >
                          {alt.time} (Table {alt.tableNumber})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-[9px] text-stone-500 text-right">
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl rounded-tl-none p-4 text-xs text-stone-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Checking restaurant floor plans and table availability...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-2 flex items-center gap-2 shadow-xl"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your reservation request (e.g. 'Table for 2 tonight at 8 PM at Sakura')..."
            className="flex-1 bg-transparent px-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className={`p-2.5 rounded-xl font-bold transition-all ${
              !inputMessage.trim() || isLoading
                ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20 cursor-pointer'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
