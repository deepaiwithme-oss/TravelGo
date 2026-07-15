import React from 'react';
import { motion } from 'motion/react';
import { 
  X, Check, Bus, Calendar, Armchair, MapPin, 
  Trash2, QrCode, ShieldAlert, FileText, Download 
} from 'lucide-react';
import { Booking } from '../types';

interface TicketDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export default function TicketDetailModal({ booking, onClose, onCancelBooking }: TicketDetailModalProps) {
  const isUpcoming = booking.status === 'Upcoming';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-background rounded-2xl overflow-hidden flex flex-col border-4 border-[#050505] dark:border-white shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] text-left relative"
      >
        
        {/* Decorative Ticket Corner Cuts (Left & Right) */}
        <div className="absolute top-[48%] -left-3 w-6 h-6 rounded-full bg-black/60 z-30" />
        <div className="absolute top-[48%] -right-3 w-6 h-6 rounded-full bg-black/60 z-30" />

        {/* Top Header Card */}
        <header className="p-6 bg-primary text-[#050505] border-b-4 border-[#050505] dark:border-white flex justify-between items-center relative">
          <div>
            <span className="bg-white/30 text-[#050505] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md w-fit mb-2 block">
              Travel Ticket Receipt
            </span>
            <h2 className="font-black text-xl font-display uppercase tracking-wider">{booking.bus.operator}</h2>
            <p className="text-[10px] text-[#050505]/70 font-bold uppercase tracking-wider mt-0.5">
              Ref: {booking.id}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 border-2 border-[#050505] bg-white text-[#050505] hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Ticket Details (Top segment) */}
        <div className="p-6 pb-4 space-y-4 bg-background">
          
          {/* Timing & Stations row */}
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Departure</span>
              <span className="block font-black text-lg text-slate-900 dark:text-white">{booking.bus.departureTime}</span>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">{booking.bus.departureCity}</span>
            </div>

            <div className="flex flex-col items-center flex-1 px-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{booking.bus.duration}</span>
              <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center">
                <Bus className="w-3.5 h-3.5 text-primary dark:text-blue-400 absolute bg-white dark:bg-slate-900 px-0.5" />
              </div>
            </div>

            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Arrival</span>
              <span className="block font-black text-lg text-slate-900 dark:text-white">{booking.bus.arrivalTime}</span>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">{booking.bus.arrivalCity}</span>
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                <Calendar className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Travel Date</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{booking.date}</span>
              </div>
            </div>

            <div className="flex gap-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                <Armchair className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Seats Reserved</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{booking.seatNumbers.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Boarding/Dropping list */}
          <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-xs space-y-2.5">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-slate-400 block text-[10px] uppercase">Boarding Terminal</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{booking.boardingPoint}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-slate-400 block text-[10px] uppercase">Dropping Terminal</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{booking.droppingPoint}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Perforated Separator Line */}
        <div className="w-full h-1 border-t-2 border-dashed border-slate-200 dark:border-slate-800" />

        {/* QR Code and Pricing (Bottom segment) */}
        <div className="p-6 pt-4 bg-slate-50/55 dark:bg-slate-900/40 text-center space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Passenger Name</span>
              <span className="font-black text-sm text-slate-800 dark:text-white">{booking.passengers[0]}</span>
              {booking.passengers.length > 1 && (
                <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">
                  + {booking.passengers.length - 1} more traveler(s)
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Fare Paid</span>
              <span className="font-black text-lg text-primary dark:text-blue-400">£{booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Interactive QR Code scan framing */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-white rounded-2xl p-2.5 shadow-md border border-slate-200/50 flex items-center justify-center">
              <img 
                className="w-full h-full" 
                src={booking.qrCode} 
                alt="QR Code Ticket Scan Verification"
              />
            </div>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-2 flex items-center gap-1 justify-center">
              <QrCode className="w-3.5 h-3.5" /> Present QR on Boarding manifest
            </p>
          </div>

          {/* Actions panel */}
          <div className="flex gap-2.5 w-full pt-1">
            <button 
              onClick={() => alert("Downloading PDF Ticket Statement... Done. Saved to device storage.")}
              className="flex-1 bg-white hover:bg-slate-100 border-2 border-[#050505] text-[#050505] font-black uppercase tracking-wider py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] hover:shadow-none"
            >
              <Download className="w-4 h-4" /> Save Ticket
            </button>
            
            {isUpcoming && onCancelBooking && (
              <button 
                id="cancel-booking-ticket"
                onClick={() => {
                  if (confirm("Are you sure you want to cancel this booking? A 100% refund will be issued back to your TravelGo wallet instantly.")) {
                    onCancelBooking(booking.id);
                  }
                }}
                className="flex-1 bg-rose-200 hover:bg-rose-300 border-2 border-[#050505] text-rose-800 font-black uppercase tracking-wider py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] hover:shadow-none"
              >
                <Trash2 className="w-4 h-4" /> Cancel Ticket
              </button>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
