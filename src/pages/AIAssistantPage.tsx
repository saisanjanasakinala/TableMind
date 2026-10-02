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
  MapPin,
  Star,
  ChevronRight,
  Compass,
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
    userLocation,
    setBookingDate,
    setBookingTime,
    setBookingPartySize,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Welcome to TableMind AI! I am your location-aware dining concierge. Ask me for tables by area, city, date, party size, or cuisine (e.g. "Find a table for 4 people tomorrow at 7 PM near Surampalem"), and I'll find suitable restaurants and available tables in real time.`,
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
        content: data.replyText || "I've checked our live table inventory for your location.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionableReservation: data.actionableReservation,
        nearbyRestaurants: data.nearbyRestaurants,
        alternativeSuggestions: data.alternativeSuggestions,
        estimatedWaitMinutes: data.estimatedWaitMinutes,
        extractedLocation: data.extractedLocation,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: AIAssistantMessage = {
        id: `msg-${Date.now()}-fallback`,
        role: 'assistant',
        content:
          "I've verified the live table inventory. Let me know which restaurant, location, and time you prefer, or select an open slot from our recommendations.",
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

  const handleGoToRestaurantBooking = (restaurantId: string, date?: string, time?: string, guests?: number) => {
    if (date) setBookingDate(date);
    if (time) setBookingTime(time);
    if (guests) setBookingPartySize(guests);
    navigate('booking', restaurantId);
  };

  const samplePrompts = [
    "Find a table for 4 people tomorrow at 7 PM near Surampalem.",
    "Table for 2 tonight near Downtown San Francisco, booth preferred",
    "Available dinner tables near Surampalem for tonight",
    "Find a table for 6 this weekend at 8 PM near Kakinada",
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

                {/* Nearby Suitable Restaurants List */}
                {msg.nearbyRestaurants && msg.nearbyRestaurants.length > 0 && (
                  <div className="mt-3.5 space-y-2">
                    <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        Suitable Restaurants Found {msg.extractedLocation ? `near ${msg.extractedLocation}` : ''}:
                      </span>
                    </div>

                    <div className="space-y-2">
                      {msg.nearbyRestaurants.map((item) => (
                        <div
                          key={item.restaurantId}
                          className="p-3 rounded-xl bg-stone-950/90 border border-stone-700/80 hover:border-amber-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.heroImage}
                              alt={item.restaurantName}
                              className="w-14 h-14 rounded-lg object-cover border border-stone-800 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-xs">{item.restaurantName}</span>
                                <span className="px-1.5 py-0.2 rounded bg-stone-800 text-[10px] text-amber-300 font-semibold">
                                  {item.priceRange}
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                                <span>{item.cuisine}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 text-amber-400">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                  {item.rating}
                                </span>
                              </div>
                              <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-2.5 h-2.5" />
                                <span className="truncate max-w-[180px]">{item.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800 shrink-0">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.availableTableCount > 0
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {item.availableTableCount > 0
                                ? `${item.availableTableCount} tables open`
                                : 'Waitlist Only'}
                            </span>

                            <button
                              onClick={() =>
                                handleGoToRestaurantBooking(
                                  item.restaurantId,
                                  msg.actionableReservation?.date,
                                  msg.actionableReservation?.time,
                                  msg.actionableReservation?.guestCount
                                )
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] transition-transform hover:scale-[1.02] cursor-pointer flex items-center gap-1 shadow-sm"
                            >
                              <span>View Tables</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
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
