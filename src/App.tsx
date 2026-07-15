import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Ticket, Wallet, LifeBuoy, User, Bell, ChevronRight, 
  MapPin, Clock, Star, Bed, Sparkles, LogOut, Check, ArrowRight
} from 'lucide-react';

// Shared Components
import SplashView from './components/SplashView';
import OnboardingView from './components/OnboardingView';
import HomeView from './components/HomeView';
import SearchResultsView from './components/SearchResultsView';
import SeatSelectorModal from './components/SeatSelectorModal';
import TicketDetailModal from './components/TicketDetailModal';
import WalletView from './components/WalletView';
import SupportView from './components/SupportView';
import ProfileView from './components/ProfileView';

// Data and Types
import { 
  Route, Bus, Offer, Transaction, Booking, Passenger 
} from './types';
import { 
  IMAGES, POPULAR_ROUTES, BUSES, OFFERS, 
  INITIAL_TRANSACTIONS, INITIAL_PASSENGERS 
} from './data';

export default function App() {
  // App views: 'splash' | 'onboarding' | 'main'
  const [view, setView] = useState<'splash' | 'onboarding' | 'main'>(() => {
    const savedView = localStorage.getItem('travelgo_view');
    return (savedView as any) || 'splash';
  });

  // Active tab inside main view: 'home' | 'trips' | 'wallet' | 'support' | 'profile'
  const [tab, setTab] = useState<'home' | 'trips' | 'wallet' | 'support' | 'profile'>(() => {
    const savedTab = localStorage.getItem('travelgo_tab');
    return (savedTab as any) || 'home';
  });

  // Global state managers
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('travelgo_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Alex Johnson',
      email: 'alex.j@travelgo.com',
      phone: '+1 (555) 0123-456',
      avatar: IMAGES.alexJohnsonAvatarStudio,
      premium: true
    };
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem('travelgo_wallet');
    return savedBalance ? parseFloat(savedBalance) : 124.50;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTx = localStorage.getItem('travelgo_transactions');
    return savedTx ? JSON.parse(savedTx) : INITIAL_TRANSACTIONS;
  });

  const [savedPassengers, setSavedPassengers] = useState<Passenger[]>(() => {
    const savedPs = localStorage.getItem('travelgo_passengers');
    return savedPs ? JSON.parse(savedPs) : INITIAL_PASSENGERS;
  });

  // Pre-populate with 1 completed trip to Manchester so the Trips history doesn't look empty!
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const savedBks = localStorage.getItem('travelgo_bookings');
    if (savedBks) return JSON.parse(savedBks);
    
    // Default past booking
    return [
      {
        id: 'TG-748293',
        bus: BUSES[2], // Atlas Express
        seatNumbers: ['B4', 'B5'],
        boardingPoint: 'Victoria Bus Station, Bay 12',
        droppingPoint: 'Edinburgh Central Coach Yard',
        date: '15 Oct, 2026',
        passengers: ['Alex Johnson', 'Mark J.'],
        totalPrice: 64.00,
        status: 'Completed',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TravelGo-Ticket-Past`
      }
    ];
  });

  // Theme support
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedDark = localStorage.getItem('travelgo_dark');
    return savedDark === 'true';
  });

  // Search Results view toggles
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFrom, setSearchFrom] = useState('London');
  const [searchTo, setSearchTo] = useState('Edinburgh');
  const [searchDate, setSearchDate] = useState('24 Oct, 2026');
  const [searchPassengersCount, setSearchPassengersCount] = useState(2);

  // Active overlays
  const [selectedBusForBooking, setSelectedBusForBooking] = useState<Bus | null>(null);
  const [selectedBookingDetail, setSelectedBookingBookingDetail] = useState<Booking | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('travelgo_view', view);
    localStorage.setItem('travelgo_tab', tab);
    localStorage.setItem('travelgo_user', JSON.stringify(currentUser));
    localStorage.setItem('travelgo_wallet', walletBalance.toString());
    localStorage.setItem('travelgo_transactions', JSON.stringify(transactions));
    localStorage.setItem('travelgo_passengers', JSON.stringify(savedPassengers));
    localStorage.setItem('travelgo_bookings', JSON.stringify(bookings));
    localStorage.setItem('travelgo_dark', darkMode.toString());

    // Apply dark theme class to HTML element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [view, tab, currentUser, walletBalance, transactions, savedPassengers, bookings, darkMode]);

  // Alert system helper
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  const handleSplashLogin = () => {
    setView('main');
    setTab('home');
    triggerNotification("Logged in successfully as Alex Johnson!");
  };

  const handleSplashContinue = () => {
    setView('onboarding');
  };

  const handleOnboardingSkip = () => {
    setView('main');
    setTab('home');
    triggerNotification("Welcome to TravelGo! Book your tickets instantly.");
  };

  const handleSearchTrigger = (from: string, to: string, date: string, count: number) => {
    setSearchFrom(from);
    setSearchTo(to);
    setSearchDate(date);
    setSearchPassengersCount(count);
    setShowSearchResults(true);
    triggerNotification(`Found premium fleets from ${from} to ${to}!`);
  };

  const handleBookingConfirmation = (newBooking: Booking, updatedWalletBalance: number) => {
    setWalletBalance(updatedWalletBalance);
    setBookings([newBooking, ...bookings]);

    // Add debit transaction record
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Trip to ${newBooking.bus.arrivalCity}`,
      date: `Today • Bus Booking`,
      type: 'booking',
      amount: -newBooking.totalPrice,
      status: 'Success'
    };
    setTransactions([newTx, ...transactions]);

    setSelectedBusForBooking(null);
    setSelectedBookingBookingDetail(newBooking); // Open ticket detail immediately
    triggerNotification(`Booking confirmed! Ticket ID: ${newBooking.id}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Remove or cancel the booking
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));

    // Refund money
    const refundAmt = booking.totalPrice;
    setWalletBalance(prev => prev + refundAmt);

    // Add credit refund transaction
    const refundTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Refund: Trip to ${booking.bus.arrivalCity}`,
      date: `Today • Cancelled Booking`,
      type: 'refund',
      amount: refundAmt,
      status: 'Success'
    };
    setTransactions([refundTx, ...transactions]);

    setSelectedBookingBookingDetail(null);
    triggerNotification(`Booking cancelled. £${refundAmt.toFixed(2)} refunded to your TravelGo Wallet.`);
  };

  const handleAddWalletFunds = (amount: number) => {
    setWalletBalance(prev => prev + amount);
    const topupTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'Wallet Load',
      date: `Today • Via Card`,
      type: 'topup',
      amount: amount,
      status: 'Success'
    };
    setTransactions([topupTx, ...transactions]);
  };

  const handleTransferWalletFunds = (amount: number, recipient: string): boolean => {
    if (walletBalance < amount) {
      triggerNotification("Transfer failed. Insufficient funds in TravelGo Wallet.");
      return false;
    }
    setWalletBalance(prev => prev - amount);
    const transferTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Sent to ${recipient}`,
      date: `Today • Peer Transfer`,
      type: 'booking',
      amount: -amount,
      status: 'Success'
    };
    setTransactions([transferTx, ...transactions]);
    triggerNotification(`Successfully transferred £${amount.toFixed(2)} to ${recipient}!`);
    return true;
  };

  const handleAddPassenger = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const bgClasses = ['bg-purple-100', 'bg-blue-100', 'bg-orange-100', 'bg-amber-100', 'bg-emerald-100'];
    const textClasses = ['text-purple-600', 'text-blue-600', 'text-orange-600', 'text-amber-600', 'text-emerald-600'];
    const randomIdx = Math.floor(Math.random() * bgClasses.length);

    const newPassenger: Passenger = {
      id: `p-${Date.now()}`,
      name: name,
      initials: initials || 'TR',
      bgClass: bgClasses[randomIdx],
      textClass: textClasses[randomIdx]
    };
    setSavedPassengers([...savedPassengers, newPassenger]);
  };

  const handleProfileUpdate = (name: string, email: string, phone: string) => {
    setCurrentUser({
      ...currentUser,
      name,
      email,
      phone
    });
  };

  const handleLogoutReset = () => {
    localStorage.clear();
    setView('splash');
    setTab('home');
    setWalletBalance(124.50);
    setTransactions(INITIAL_TRANSACTIONS);
    setSavedPassengers(INITIAL_PASSENGERS);
    setBookings([
      {
        id: 'TG-748293',
        bus: BUSES[2],
        seatNumbers: ['B4', 'B5'],
        boardingPoint: 'Victoria Bus Station, Bay 12',
        droppingPoint: 'Edinburgh Central Coach Yard',
        date: '15 Oct, 2026',
        passengers: ['Alex Johnson', 'Mark J.'],
        totalPrice: 64.00,
        status: 'Completed',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TravelGo-Ticket-Past`
      }
    ]);
    setShowSearchResults(false);
    triggerNotification("Sandbox reset! Welcome back to TravelGo Onboarding.");
  };

  // Render top notification banner
  const renderNotificationBanner = () => (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 glass p-4 rounded-2xl shadow-xl flex items-start gap-3 border border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left text-xs font-bold leading-relaxed pt-1.5">
            {notification}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Core Main layout
  if (view === 'splash') {
    return <SplashView onContinue={handleSplashContinue} onLogin={handleSplashLogin} />;
  }

  if (view === 'onboarding') {
    return <OnboardingView onSkip={handleOnboardingSkip} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-background pb-28 relative">
      
      {/* Dynamic Notifications Banner */}
      {renderNotificationBanner()}

      {/* Global Custom Top Navigation Header */}
      <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-xl border-b border-outline/10 shadow-sm">
        <div className="flex justify-between items-center px-5 py-3 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-surface flex-shrink-0">
              <img 
                className="w-full h-full object-cover" 
                src={currentUser?.avatar} 
                alt={currentUser?.name} 
              />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Hello, {currentUser?.name.split(' ')[0]}!
              </p>
              <h1 className="text-xl font-black text-primary uppercase tracking-wider mt-0.5 font-display">
                TravelGo
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              id="top-bell-notification"
              onClick={() => triggerNotification("No new priority alerts. Your upcoming departure to Edinburgh is confirmed!")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 active:scale-95 transition-transform cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Core Body Container */}
      <main className="pt-20 px-5 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + (showSearchResults ? '-search' : '-normal')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="pt-4"
          >
            {/* Tab: HOME */}
            {tab === 'home' && (
              <>
                {showSearchResults ? (
                  <SearchResultsView 
                    from={searchFrom}
                    to={searchTo}
                    date={searchDate}
                    passengers={searchPassengersCount}
                    onBack={() => setShowSearchResults(false)}
                    onSelectBus={(bus) => {
                      setSelectedBusForBooking(bus);
                      triggerNotification(`Initiating seat configuration for ${bus.operator}`);
                    }}
                  />
                ) : (
                  <HomeView 
                    onSearch={handleSearchTrigger}
                    currentUser={currentUser}
                    onNavigateToTab={(t: any) => setTab(t)}
                    onTriggerNotification={triggerNotification}
                  />
                )}
              </>
            )}

            {/* Tab: MY TRIPS */}
            {tab === 'trips' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">My Booked Trips</h2>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">View upcoming journeys, check-in QR codes, or cancelled manifests.</p>
                </div>

                <div className="space-y-6">
                  {/* Section 1: Upcoming */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Upcoming Departures</h3>
                    {bookings.filter(b => b.status === 'Upcoming').length === 0 ? (
                      <div className="p-6 bg-slate-100/60 dark:bg-slate-800/40 rounded-2xl text-center text-xs font-bold text-slate-500 border border-dashed border-slate-200">
                        No upcoming departures scheduled. Search routes to book your seat!
                      </div>
                    ) : (
                      bookings.filter(b => b.status === 'Upcoming').map((bk) => (
                        <div 
                          key={bk.id}
                          onClick={() => setSelectedBookingBookingDetail(bk)}
                          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 text-primary dark:text-blue-300 rounded-xl flex items-center justify-center font-bold text-lg">
                              {bk.bus.operator[0]}
                            </div>
                            <div>
                              <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {bk.bus.departureCity} → {bk.bus.arrivalCity}
                              </p>
                              <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                                {bk.date} • Seats: {bk.seatNumbers.join(', ')}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Section 2: Completed / Cancelled */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Past & Cancelled Activity</h3>
                    {bookings.filter(b => b.status !== 'Upcoming').map((bk) => (
                      <div 
                        key={bk.id}
                        onClick={() => setSelectedBookingBookingDetail(bk)}
                        className={`p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center border border-slate-100 dark:border-slate-800/50 bg-white/60 dark:bg-slate-800/40 opacity-75`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center font-bold text-slate-400 text-lg">
                            {bk.bus.operator[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                              {bk.bus.departureCity} → {bk.bus.arrivalCity}
                            </p>
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                              {bk.date} • Status: <span className={bk.status === 'Completed' ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>{bk.status}</span>
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: WALLET */}
            {tab === 'wallet' && (
              <WalletView 
                walletBalance={walletBalance}
                onAddFunds={handleAddWalletFunds}
                onTransferFunds={handleTransferWalletFunds}
                transactions={transactions}
                onTriggerNotification={triggerNotification}
              />
            )}

            {/* Tab: SUPPORT */}
            {tab === 'support' && (
              <SupportView 
                onTriggerNotification={triggerNotification}
              />
            )}

            {/* Tab: PROFILE */}
            {tab === 'profile' && (
              <ProfileView 
                currentUser={currentUser}
                onUpdateProfile={handleProfileUpdate}
                savedPassengers={savedPassengers}
                onAddPassenger={handleAddPassenger}
                onLogout={handleLogoutReset}
                darkMode={darkMode}
                onToggleDarkMode={setDarkMode}
                onTriggerNotification={triggerNotification}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Bottom Navigation bar */}
      <nav className="fixed bottom-0 w-full z-40 rounded-t-3xl bg-surface/90 backdrop-blur-xl border-t border-outline/10 shadow-2xl py-2">
        <div className="flex justify-around items-center w-full max-w-7xl mx-auto px-4 pb-4 sm:pb-2">
          
          <button 
            id="tab-home"
            onClick={() => { setTab('home'); setShowSearchResults(false); }}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl active:scale-90 transition-all cursor-pointer ${
              tab === 'home' 
                ? 'text-primary font-extrabold scale-105' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <Home className={`w-6 h-6 ${tab === 'home' ? 'fill-primary/5' : ''}`} />
            <span className="text-[10px] tracking-wide mt-1">Home</span>
          </button>

          <button 
            id="tab-trips"
            onClick={() => setTab('trips')}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl active:scale-90 transition-all cursor-pointer ${
              tab === 'trips' 
                ? 'text-primary font-extrabold scale-105' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <Ticket className={`w-6 h-6 ${tab === 'trips' ? 'fill-primary/5' : ''}`} />
            <span className="text-[10px] tracking-wide mt-1">My Trips</span>
          </button>

          <button 
            id="tab-wallet"
            onClick={() => setTab('wallet')}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl active:scale-90 transition-all cursor-pointer ${
              tab === 'wallet' 
                ? 'text-primary font-extrabold scale-105' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <Wallet className={`w-6 h-6 ${tab === 'wallet' ? 'fill-primary/5' : ''}`} />
            <span className="text-[10px] tracking-wide mt-1">Wallet</span>
          </button>

          <button 
            id="tab-support"
            onClick={() => setTab('support')}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl active:scale-90 transition-all cursor-pointer ${
              tab === 'support' 
                ? 'text-primary font-extrabold scale-105' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <LifeBuoy className={`w-6 h-6 ${tab === 'support' ? 'fill-primary/5' : ''}`} />
            <span className="text-[10px] tracking-wide mt-1">Support</span>
          </button>

          <button 
            id="tab-profile"
            onClick={() => setTab('profile')}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl active:scale-90 transition-all cursor-pointer ${
              tab === 'profile' 
                ? 'text-primary font-extrabold scale-105' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <User className={`w-6 h-6 ${tab === 'profile' ? 'fill-primary/5' : ''}`} />
            <span className="text-[10px] tracking-wide mt-1">Profile</span>
          </button>

        </div>
      </nav>

      {/* Global Overlays Modal Renderers */}
      
      {/* Overlay 1: Interactive Coach Seat selector */}
      <AnimatePresence>
        {selectedBusForBooking && (
          <SeatSelectorModal 
            bus={selectedBusForBooking}
            passengersCount={searchPassengersCount}
            walletBalance={walletBalance}
            onClose={() => setSelectedBusForBooking(null)}
            onConfirmBooking={handleBookingConfirmation}
            onTriggerNotification={triggerNotification}
          />
        )}
      </AnimatePresence>

      {/* Overlay 2: Ticket Detail Viewer */}
      <AnimatePresence>
        {selectedBookingDetail && (
          <TicketDetailModal 
            booking={selectedBookingDetail}
            onClose={() => setSelectedBookingBookingDetail(null)}
            onCancelBooking={handleCancelBooking}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
