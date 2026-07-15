import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ArrowUpDown, Calendar, Users, MapPin, 
  Tag, Compass, Bus, Train, Hotel, Car, Navigation, 
  ChevronRight, CalendarDays, Plus, Minus
} from 'lucide-react';
import { IMAGES, POPULAR_ROUTES, OFFERS } from '../data';
import { Route } from '../types';

interface HomeViewProps {
  onSearch: (from: string, to: string, date: string, passengers: number) => void;
  currentUser: { name: string; avatar: string; premium: boolean } | null;
  onNavigateToTab: (tab: string) => void;
  onTriggerNotification: (message: string) => void;
}

const CITIES = ['London', 'Edinburgh', 'Manchester', 'New York', 'Boston', 'LA', 'Las Vegas', 'SF', 'Seattle'];

export default function HomeView({ onSearch, currentUser, onNavigateToTab, onTriggerNotification }: HomeViewProps) {
  const [fromCity, setFromCity] = useState('London');
  const [toCity, setToCity] = useState('Edinburgh');
  const [journeyDate, setJourneyDate] = useState('24 Oct, 2026');
  const [passengerCount, setPassengerCount] = useState(2);
  
  // Dropdown states
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassengerPicker, setShowPassengerPicker] = useState(false);

  // Swap animation trigger
  const [swapSpin, setSwapSpin] = useState(0);

  const handleSwap = () => {
    setSwapSpin((prev) => prev + 180);
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    onTriggerNotification(`Swapped origin and destination!`);
  };

  const handlePopularRouteClick = (route: Route) => {
    setFromCity(route.from);
    setToCity(route.to);
    onTriggerNotification(`Selected popular route: ${route.from} to ${route.to}`);
    onSearch(route.from, route.to, journeyDate, passengerCount);
  };

  const handleSearchSubmit = () => {
    if (!fromCity || !toCity) {
      onTriggerNotification("Please select both Origin and Destination cities.");
      return;
    }
    if (fromCity === toCity) {
      onTriggerNotification("Origin and destination cannot be the same city.");
      return;
    }
    onSearch(fromCity, toCity, journeyDate, passengerCount);
  };

  const copyPromoCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    onTriggerNotification(`Copied discount code: ${code}! Apply at seat booking checkout.`);
  };

  return (
    <div className="space-y-6 pb-6 text-slate-800 dark:text-slate-100">
      
      {/* Hero Section with Search Card Overlay */}
      <section className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-end p-4 md:p-6 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover scale-105" 
            src={IMAGES.searchBackdrop} 
            alt="Double-decker premium bus driving alongside the beautiful blue ocean cliff sunset"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </div>

        {/* Glassmorphism Search Panel */}
        <div className="glass w-full rounded-2xl p-4 md:p-5 shadow-2xl z-10 space-y-4 border border-white/20">
          <div className="flex flex-col md:flex-row gap-3 items-center relative">
            
            {/* From City Input Container */}
            <div className="relative flex-1 w-full bg-white/10 dark:bg-black/20 p-3 rounded-xl border border-white/20 backdrop-blur-md">
              <label className="text-[10px] uppercase tracking-wider text-slate-300 block mb-1 font-bold">
                From City
              </label>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setShowFromDropdown(!showFromDropdown);
                  setShowToDropdown(false);
                }}
              >
                <MapPin className="w-4 h-4 text-primary-fixed-dim" />
                <span className="font-bold text-lg text-white">
                  {fromCity || 'Select City'}
                </span>
              </div>

              {showFromDropdown && (
                <div className="absolute left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto z-40 p-1 no-scrollbar animate-fade-in">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setFromCity(city);
                        setShowFromDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <motion.button 
              onClick={handleSwap}
              animate={{ rotate: swapSpin }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute md:static top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 z-20 bg-primary hover:bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 transition-colors active:scale-90 cursor-pointer"
              title="Swap Cities"
            >
              <ArrowUpDown className="w-5 h-5" />
            </motion.button>

            {/* To City Input Container */}
            <div className="relative flex-1 w-full bg-white/10 dark:bg-black/20 p-3 rounded-xl border border-white/20 backdrop-blur-md">
              <label className="text-[10px] uppercase tracking-wider text-slate-300 block mb-1 font-bold">
                To City
              </label>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setShowToDropdown(!showToDropdown);
                  setShowFromDropdown(false);
                }}
              >
                <Navigation className="w-4 h-4 text-secondary-container" />
                <span className="font-bold text-lg text-white">
                  {toCity || 'Where to?'}
                </span>
              </div>

              {showToDropdown && (
                <div className="absolute left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto z-40 p-1 no-scrollbar animate-fade-in">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setToCity(city);
                        setShowToDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date and Passengers selection */}
          <div className="grid grid-cols-2 gap-3 relative">
            {/* Date Selection */}
            <div className="relative bg-white/10 dark:bg-black/20 p-3 rounded-xl border border-white/20 backdrop-blur-md">
              <label className="text-[10px] uppercase tracking-wider text-slate-300 block mb-1 font-bold">
                Journey Date
              </label>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setShowDatePicker(!showDatePicker);
                  setShowPassengerPicker(false);
                }}
              >
                <Calendar className="w-4 h-4 text-primary-fixed-dim" />
                <span className="text-sm font-bold text-white">
                  {journeyDate}
                </span>
              </div>

              {showDatePicker && (
                <div className="absolute left-0 right-0 bottom-full mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-40 p-3 space-y-2 animate-fade-in">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Select Travel Date</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['24 Oct, 2026', '25 Oct, 2026', '26 Oct, 2026', '01 Nov, 2026', '12 Nov, 2026'].map((dt) => (
                      <button
                        key={dt}
                        onClick={() => {
                          setJourneyDate(dt);
                          setShowDatePicker(false);
                        }}
                        className={`text-xs font-bold py-2 px-1.5 rounded-lg border cursor-pointer ${
                          journeyDate === dt 
                            ? 'bg-primary border-primary text-white' 
                            : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {dt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Passengers Count Selection */}
            <div className="relative bg-white/10 dark:bg-black/20 p-3 rounded-xl border border-white/20 backdrop-blur-md">
              <label className="text-[10px] uppercase tracking-wider text-slate-300 block mb-1 font-bold">
                Passengers
              </label>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setShowPassengerPicker(!showPassengerPicker);
                  setShowDatePicker(false);
                }}
              >
                <Users className="w-4 h-4 text-primary-fixed-dim" />
                <span className="text-sm font-bold text-white">
                  {passengerCount} {passengerCount === 1 ? 'Adult' : 'Adults'}
                </span>
              </div>

              {showPassengerPicker && (
                <div className="absolute right-0 bottom-full mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-40 p-3 space-y-3 min-w-[160px] animate-fade-in">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase text-center">Passengers</p>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                      disabled={passengerCount <= 1}
                      className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                    </button>
                    <span className="font-extrabold text-lg text-slate-800 dark:text-white">
                      {passengerCount}
                    </span>
                    <button
                      onClick={() => setPassengerCount(Math.min(6, passengerCount + 1))}
                      disabled={passengerCount >= 6}
                      className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                    </button>
                  </div>
                  <p className="text-[9px] text-center text-slate-400">Max 6 per booking</p>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <button 
            id="home-search-buses"
            onClick={handleSearchSubmit}
            className="w-full bg-primary text-[#050505] font-black uppercase tracking-wider py-4 rounded-xl border-2 border-outline shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-[#fff2eb] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <Search className="w-5 h-5" />
            Search Buses
          </button>
        </div>
      </section>

      {/* Quick Services Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-black text-on-background tracking-wider font-display uppercase">
          Explore Services
        </h2>
        <div className="grid grid-cols-5 gap-2">
          {/* Active: Bus Tickets */}
          <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="w-14 h-14 bg-primary border-2 border-outline flex items-center justify-center text-[#050505] shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] group-hover:scale-105 active:scale-95 transition-transform">
              <Bus className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold text-on-background uppercase tracking-wider text-center">Buses</span>
          </div>

          <div 
            onClick={() => onTriggerNotification("Train tickets will launch soon! Currently in partnership integration with National Rail.")} 
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-14 h-14 bg-surface border-2 border-outline/20 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:scale-105 active:scale-95 transition-transform">
              <Train className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Trains</span>
          </div>

          <div 
            onClick={() => onTriggerNotification("Hotels booking coming next week! Seamlessly bundle stays with your road transit.")} 
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-14 h-14 bg-surface border-2 border-outline/20 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:scale-105 active:scale-95 transition-transform">
              <Hotel className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Hotels</span>
          </div>

          <div 
            onClick={() => onTriggerNotification("Premium city cab connections is currently in development with private logistics partners.")} 
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-14 h-14 bg-surface border-2 border-outline/20 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:scale-105 active:scale-95 transition-transform">
              <Car className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Cabs</span>
          </div>

          <div 
            onClick={() => onNavigateToTab('wallet')}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-14 h-14 bg-surface border-2 border-outline/20 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:scale-105 active:scale-95 transition-transform">
              <Tag className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Offers</span>
          </div>
        </div>
      </section>

      {/* Special Offers Carousel */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black text-on-background tracking-wider font-display uppercase">
            Special Offers
          </h2>
          <button 
            onClick={() => onNavigateToTab('wallet')}
            className="text-primary font-black uppercase tracking-wider text-xs hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Slider */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x py-1">
          {OFFERS.map((offer) => (
            <div 
              key={offer.id} 
              className="snap-start flex-shrink-0 w-[88%] md:w-[420px] h-48 rounded-xl relative overflow-hidden border-2 border-outline shadow-[4px_4px_0px_0px_#F27D26]"
            >
              <img 
                className="w-full h-full object-cover" 
                src={offer.image} 
                alt={offer.title} 
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${offer.bgGradient} flex flex-col justify-center p-5 text-white`}>
                <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md w-fit mb-2">
                  {offer.badge}
                </span>
                <h3 className="text-xl font-black leading-tight max-w-[220px] uppercase font-display">
                  {offer.title}
                </h3>
                <p className="text-white/80 text-xs mt-2 font-bold uppercase tracking-wide">
                  {offer.subtitle}
                </p>

                {offer.code && (
                  <button 
                    onClick={() => copyPromoCode(offer.code)}
                    className="mt-3 text-[10px] font-black uppercase tracking-widest bg-white text-[#050505] px-3 py-1.5 rounded-md border border-[#050505] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all cursor-pointer hover:bg-slate-100"
                  >
                    Copy Code
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="space-y-3">
        <h2 className="text-sm font-black text-on-background tracking-wider font-display uppercase">
          Popular Routes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {POPULAR_ROUTES.map((route) => (
            <div 
              key={route.id}
              onClick={() => handlePopularRouteClick(route)}
              className="bg-surface p-4 rounded-xl border-2 border-outline flex justify-between items-center hover:shadow-[4px_4px_0px_0px_#F27D26] hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-xl transition-colors">
                  <Compass className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-on-background flex items-center gap-1.5">
                    {route.from} 
                    <span className="text-slate-400 font-normal">→</span> 
                    {route.to}
                  </p>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Daily {route.dailyBuses}+ Buses available
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">Starts at</p>
                <p className="text-lg font-black text-primary font-display">
                  ${route.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
