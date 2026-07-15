import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Edit2, Wifi, Power, RefreshCw, 
  MapPin, Clock, Star, Bed, Armchair, HelpCircle
} from 'lucide-react';
import { BUSES } from '../data';
import { Bus } from '../types';

interface SearchResultsViewProps {
  from: string;
  to: string;
  date: string;
  passengers: number;
  onBack: () => void;
  onSelectBus: (bus: Bus) => void;
}

type FilterType = 'price' | 'departure' | 'sleeper' | 'ac' | 'rating';

export default function SearchResultsView({ from, to, date, passengers, onBack, onSelectBus }: SearchResultsViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('price');
  const [showAmenitiesTips, setShowAmenitiesTips] = useState<string | null>(null);

  // Sorting and filtering based on selected chips
  const sortedAndFilteredBuses = useMemo(() => {
    // Generate lists of buses. If the cities are custom, we map departureCity and arrivalCity to the searched ones dynamically for high fidelity!
    const customBuses: Bus[] = BUSES.map(bus => ({
      ...bus,
      departureCity: from,
      arrivalCity: to
    }));

    switch (activeFilter) {
      case 'price':
        return [...customBuses].sort((a, b) => a.price - b.price);
      case 'departure':
        return [...customBuses].sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      case 'rating':
        return [...customBuses].sort((a, b) => b.rating - a.rating);
      case 'sleeper':
        return customBuses.filter(bus => bus.type.toLowerCase().includes('sleeper'));
      case 'ac':
        return customBuses.filter(bus => bus.type.toLowerCase().includes('ac'));
      default:
        return customBuses;
    }
  }, [activeFilter, from, to]);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  return (
    <div className="space-y-6 pb-6 text-slate-800 dark:text-slate-100">
      
      {/* Travel Context Summary Card */}
      <div className="bg-surface p-4 rounded-xl border-2 border-outline flex items-center justify-between">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-on-background font-display uppercase">
            <span className="font-black text-lg tracking-wider">{from}</span>
            <span className="text-primary font-bold">→</span>
            <span className="font-black text-lg tracking-wider">{to}</span>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {date} • {passengers} {passengers === 1 ? 'Adult' : 'Adults'}
          </p>
        </div>
        <button 
          onClick={onBack}
          className="bg-primary text-[#050505] border-2 border-outline font-bold p-2.5 rounded-lg transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] hover:shadow-none hover:bg-white"
          title="Edit Search"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Filter Chips (Horizontal Scroll) */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 -mx-4 px-4 py-1">
        <button
          onClick={() => toggleFilter('price')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'price'
              ? 'bg-primary text-[#050505] border-2 border-outline shadow-[2px_2px_0px_0px_#050505]'
              : 'bg-surface border border-outline/20 text-on-background hover:bg-slate-50'
          }`}
        >
          Price {activeFilter === 'price' && '↓'}
        </button>

        <button
          onClick={() => toggleFilter('departure')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'departure'
              ? 'bg-primary text-[#050505] border-2 border-outline shadow-[2px_2px_0px_0px_#050505]'
              : 'bg-surface border border-outline/20 text-on-background hover:bg-slate-50'
          }`}
        >
          Departure Time {activeFilter === 'departure' && '↑'}
        </button>

        <button
          onClick={() => toggleFilter('sleeper')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'sleeper'
              ? 'bg-primary text-[#050505] border-2 border-outline shadow-[2px_2px_0px_0px_#050505]'
              : 'bg-surface border border-outline/20 text-on-background hover:bg-slate-50'
          }`}
        >
          Sleeper
        </button>

        <button
          onClick={() => toggleFilter('ac')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'ac'
              ? 'bg-primary text-[#050505] border-2 border-outline shadow-[2px_2px_0px_0px_#050505]'
              : 'bg-surface border border-outline/20 text-on-background hover:bg-slate-50'
          }`}
        >
          A/C Only
        </button>

        <button
          onClick={() => toggleFilter('rating')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'rating'
              ? 'bg-primary text-[#050505] border-2 border-outline shadow-[2px_2px_0px_0px_#050505]'
              : 'bg-surface border border-outline/20 text-on-background hover:bg-slate-50'
          }`}
        >
          Rating {activeFilter === 'rating' && '↓'}
        </button>
      </div>

      {/* Bus Cards List */}
      <div className="space-y-4">
        {sortedAndFilteredBuses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-150">
            <Armchair className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="font-bold text-slate-700 dark:text-slate-300 text-base">No Matching Fleets Found</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try toggling different filters or adjust AC requirements.</p>
            <button 
              onClick={() => setActiveFilter('price')}
              className="mt-4 text-xs font-extrabold bg-primary text-white px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          sortedAndFilteredBuses.map((bus) => (
            <motion.div
              key={bus.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/50 dark:border-slate-800/80 flex flex-col gap-4 relative overflow-hidden group"
            >
              
              {/* Operator Title and Logo row */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-inner flex items-center justify-center border border-slate-100">
                    <img 
                      className="w-full h-full object-contain" 
                      src={bus.operatorLogo} 
                      alt={bus.operator}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="font-extrabold text-base text-slate-950 dark:text-white">
                      {bus.operator}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {bus.type}
                    </p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl font-bold text-xs shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {bus.rating.toFixed(1)}
                </div>
              </div>

              {/* Timing timeline block */}
              <div className="flex items-center justify-between px-2">
                <div className="text-left">
                  <span className="block font-black text-xl text-slate-900 dark:text-white">
                    {bus.departureTime}
                  </span>
                  <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {bus.departureCity}
                  </span>
                </div>

                {/* Duration Line Decor */}
                <div className="flex-1 flex flex-col items-center px-4">
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    {bus.duration}
                  </span>
                  <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
                    <div className="absolute w-2 h-2 rounded-full bg-primary dark:bg-blue-500 -left-1" />
                    <div className="absolute w-2 h-2 rounded-full bg-primary dark:bg-blue-500 -right-1" />
                    <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                      <Armchair className="w-3.5 h-3.5 text-primary dark:text-blue-400" />
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-black text-xl text-slate-900 dark:text-white">
                    {bus.arrivalTime}
                  </span>
                  <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {bus.arrivalCity}
                  </span>
                </div>
              </div>

              {/* Amenities, seats left and Price block */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-1.5 relative">
                  {bus.amenities.map((item) => (
                    <button
                      key={item}
                      onClick={() => setShowAmenitiesTips(showAmenitiesTips === item ? null : item)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 cursor-pointer"
                      title={item.toUpperCase()}
                    >
                      {item === 'wifi' && <Wifi className="w-4 h-4" />}
                      {item === 'power' && <Power className="w-4 h-4" />}
                      {item === 'water' && <span className="text-xs font-bold font-sans">H2O</span>}
                      {item === 'bed' && <Bed className="w-4 h-4" />}
                      {item === 'ac' && <span className="text-xs font-bold font-sans">A/C</span>}
                      {item === 'usb' && <span className="text-xs font-bold font-sans">USB</span>}
                      {item === 'chair' && <Armchair className="w-4 h-4" />}
                    </button>
                  ))}

                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1.5">
                    {bus.seatsLeft} Seats Left
                  </span>

                  {/* Tooltip display */}
                  {showAmenitiesTips && (
                    <div className="absolute left-0 bottom-full mb-2 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg font-bold shadow-lg animate-fade-in z-20">
                      {showAmenitiesTips.toUpperCase()} Supported
                    </div>
                  )}
                </div>

                {/* Price Label */}
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">
                    From
                  </span>
                  <span className="text-2xl font-black text-primary dark:text-blue-400">
                    £{bus.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                id={`results-book-${bus.id}`}
                onClick={() => onSelectBus(bus)}
                className="w-full py-3 bg-primary text-[#050505] font-black uppercase tracking-wider rounded-xl border-2 border-outline shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-[#fff2eb] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                Book Seats
              </button>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
