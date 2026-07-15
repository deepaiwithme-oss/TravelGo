import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, Moon, Bell, ChevronRight, HelpCircle, 
  LogOut, Plus, Edit2, ShieldCheck, Globe, CreditCard, X, Save
} from 'lucide-react';
import { Passenger } from '../types';
import { IMAGES } from '../data';

interface ProfileViewProps {
  currentUser: { name: string; email: string; phone: string; avatar: string; premium: boolean } | null;
  onUpdateProfile: (name: string, email: string, phone: string) => void;
  savedPassengers: Passenger[];
  onAddPassenger: (name: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: (enabled: boolean) => void;
  onTriggerNotification: (msg: string) => void;
}

export default function ProfileView({ 
  currentUser, 
  onUpdateProfile, 
  savedPassengers, 
  onAddPassenger, 
  onLogout,
  darkMode,
  onToggleDarkMode,
  onTriggerNotification
}: ProfileViewProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Alex Johnson');
  const [email, setEmail] = useState(currentUser?.email || 'alex.j@travelgo.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 0123-456');

  // Passenger form states
  const [showAddPassengerModal, setShowAddPassengerModal] = useState(false);
  const [newPassengerName, setNewPassengerName] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      onTriggerNotification("Please fill in all profile fields.");
      return;
    }
    onUpdateProfile(name.trim(), email.trim(), phone.trim());
    setIsEditing(false);
    onTriggerNotification("Profile updated successfully!");
  };

  const handleAddPassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassengerName.trim()) {
      onTriggerNotification("Please enter a passenger name.");
      return;
    }
    onAddPassenger(newPassengerName.trim());
    setNewPassengerName('');
    setShowAddPassengerModal(false);
    onTriggerNotification("Successfully added new traveler!");
  };

  return (
    <div className="space-y-6 pb-6 text-slate-800 dark:text-slate-100 text-left">
      
      {/* Profile Header Block */}
      <section className="flex flex-col items-center text-center space-y-3 pt-4">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#050505] dark:border-white shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] relative">
            <img 
              className="w-full h-full object-cover" 
              src={IMAGES.alexJohnsonAvatarStudio} 
              alt={currentUser?.name || 'Alex Johnson'} 
            />
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-0 right-0 bg-primary text-[#050505] p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] active:scale-90 transition-transform cursor-pointer border-2 border-[#050505]"
            title="Edit Profile Info"
          >
            <Edit2 className="w-4.5 h-4.5" />
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display uppercase tracking-wider">
            {currentUser?.name || 'Alex Johnson'}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest mt-0.5">
            Premium Member since 2022
          </p>
        </div>

        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-3 bg-white text-[#050505] border-2 border-[#050505] rounded-xl font-black uppercase tracking-wider text-xs active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] cursor-pointer flex items-center gap-1.5"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? 'Discard Changes' : 'Edit Profile Form'}
        </button>
      </section>

      {/* Profile Information details */}
      <section className="bg-surface p-5 rounded-2xl border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
        <h3 className="font-black text-sm text-[#050505] dark:text-white uppercase tracking-wider font-display flex items-center gap-2 border-b-2 border-[#050505] dark:border-white pb-3">
          <User className="w-5 h-5 text-primary" /> Personal Information
        </h3>

        {isEditing ? (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border-2 border-[#050505] bg-white dark:bg-slate-800 rounded-lg text-xs font-black focus:ring-0 text-on-background"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border-2 border-[#050505] bg-white dark:bg-slate-800 rounded-lg text-xs font-black focus:ring-0 text-on-background"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border-2 border-[#050505] bg-white dark:bg-slate-800 rounded-lg text-xs font-black focus:ring-0 text-on-background"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-primary text-[#050505] border-2 border-[#050505] font-black rounded-lg text-xs uppercase cursor-pointer shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] active:scale-95 transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs flex items-center gap-1.5"><Mail className="w-4 h-4" /> Email</span>
              <span className="font-bold text-xs text-slate-850 dark:text-slate-200">{currentUser?.email || 'alex.j@travelgo.com'}</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs flex items-center gap-1.5"><Phone className="w-4 h-4" /> Phone</span>
              <span className="font-bold text-xs text-slate-850 dark:text-slate-200">{currentUser?.phone || '+1 (555) 0123-456'}</span>
            </div>
          </div>
        )}
      </section>

      {/* Saved Passengers Section */}
      <section className="bg-surface p-5 rounded-2xl border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-sm text-[#050505] dark:text-white uppercase tracking-wider font-display flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Saved Travelers
          </h3>
          <button 
            id="profile-add-traveler"
            onClick={() => setShowAddPassengerModal(true)}
            className="text-primary font-black uppercase text-xs hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 animate-pulse" /> Add New
          </button>
        </div>

        {/* Horizontal scroll passengers */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
          {savedPassengers.map((ps) => (
            <div key={ps.id} className="flex-shrink-0 flex flex-col items-center space-y-1">
              <div className={`w-12 h-12 rounded-full ${ps.bgClass} flex items-center justify-center font-black ${ps.textClass} text-xs shadow-sm border border-slate-100/10`}>
                {ps.initials}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {ps.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="bg-surface p-5 rounded-2xl border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
        <h3 className="font-black text-sm text-[#050505] dark:text-white uppercase tracking-wider font-display flex items-center gap-2 border-b-2 border-[#050505] dark:border-white pb-3">
          <CreditCard className="w-5 h-5 text-primary" /> Payment Methods
        </h3>
        <div className="space-y-3">
          {/* Card Option */}
          <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/30 rounded-xl border-2 border-[#050505] dark:border-white shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none transition-all">
            <span className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-primary dark:text-blue-300">
              <CreditCard className="w-5 h-5" />
            </span>
            <div className="flex-1 text-left">
              <p className="font-bold text-xs text-slate-800 dark:text-white">Visa ending in 4242</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mt-0.5">Expires 12/26</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* UPI Option */}
          <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/30 rounded-xl border-2 border-[#050505] dark:border-white shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none transition-all">
            <span className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-500">
              <User className="w-5 h-5 text-slate-500" />
            </span>
            <div className="flex-1 text-left">
              <p className="font-bold text-xs text-slate-800 dark:text-white">alex.j@upi</p>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Default UPI Account</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </section>

      {/* App Settings Section */}
      <section className="bg-surface p-5 rounded-2xl border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
        <h3 className="font-black text-sm text-[#050505] dark:text-white uppercase tracking-wider font-display flex items-center gap-2 border-b-2 border-[#050505] dark:border-white pb-3">
          <Moon className="w-5 h-5 text-primary" /> App Customizations
        </h3>
        <div className="space-y-1">
          {/* Dark Mode toggle */}
          <div className="flex justify-between items-center py-2.5">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Moon className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-bold">Aesthetic Dark Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                id="profile-toggle-dark-mode"
                type="checkbox" 
                checked={darkMode}
                onChange={(e) => {
                  onToggleDarkMode(e.target.checked);
                  onTriggerNotification(`Switched to ${e.target.checked ? 'Dark' : 'Light'} theme!`);
                }}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-blue-600" />
            </label>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/50 my-1" />

          {/* Language preference */}
          <div 
            onClick={() => onTriggerNotification("Language choices are currently English (US) only. Regional dialects coming soon.")}
            className="flex justify-between items-center py-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-1.5 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Globe className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-bold">App Language</span>
            </div>
            <span className="text-primary dark:text-blue-400 font-extrabold text-xs flex items-center gap-0.5">
              English (US) <ChevronRight className="w-4 h-4 text-slate-400" />
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/50 my-1" />

          {/* Notifications setup */}
          <div 
            onClick={() => onTriggerNotification("Push notifications are enabled! You'll receive priority transit and booking updates.")}
            className="flex justify-between items-center py-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-1.5 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-bold">Notifications Enabled</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </section>

      {/* Account Actions */}
      <section className="bg-surface p-4 rounded-2xl border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-2">
        <a 
          href="https://google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2.5 hover:bg-primary/5 dark:hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer"
        >
          <HelpCircle className="w-5 h-5 text-slate-400" />
          <span className="text-xs font-bold flex-1 text-slate-800 dark:text-slate-200">Legal & Help Desk documentation</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </a>

        <div 
          onClick={onLogout}
          className="flex items-center gap-3 p-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer text-rose-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs font-extrabold flex-1">Reset Sandbox (Sign Out)</span>
        </div>
      </section>

      {/* Add Passenger Modal */}
      <AnimatePresence>
        {showAddPassengerModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background w-full max-w-sm rounded-xl p-5 border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b-2 border-[#050505] dark:border-white pb-2">
                <h3 className="font-black text-sm text-[#050505] dark:text-white uppercase font-display tracking-wider flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-primary animate-pulse" /> Add Saved Passenger
                </h3>
                <button onClick={() => setShowAddPassengerModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddPassengerSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Passenger Full Name</label>
                  <input 
                    type="text" 
                    value={newPassengerName} 
                    onChange={(e) => setNewPassengerName(e.target.value)} 
                    className="w-full mt-1 p-3 border-2 border-[#050505] dark:border-white bg-white dark:bg-slate-800 rounded-lg font-black text-xs focus:ring-0 text-on-background" 
                    placeholder="e.g. Samuel Richard"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-primary text-[#050505] border-2 border-[#050505] font-black rounded-lg text-xs uppercase cursor-pointer shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]">
                  Save Passenger Details
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
