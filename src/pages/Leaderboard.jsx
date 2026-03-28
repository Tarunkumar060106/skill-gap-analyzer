import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Flame, Star, Zap, ChevronUp, ChevronDown, Minus, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getLeaderboard } from '../services/api';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('league'); // league or friends
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
       try {
         setLoading(true);
         const data = await getLeaderboard();
         setLeaderboard(data);
       } catch (e) {
         console.error(e);
       } finally {
         setLoading(false);
       }
    }
    fetchLeaderboard();
  }, []);

  const userRank = leaderboard.find(u => u.isUser)?.rank || 'N/A';
  const userXP = leaderboard.find(u => u.isUser)?.xp || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 shadow-sm px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="rounded-full hover:bg-slate-100 shrink-0">
           <ArrowLeft size={24} className="text-slate-600" />
        </Button>
        <div className="flex-1 text-center pr-10">
           <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">Leaderboards</h1>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full py-8 px-4 flex flex-col gap-8">
        
        {/* League Banner */}
        <div className="bg-gradient-to-br from-yellow-400 to-amber-600 p-8 rounded-3xl shadow-lg text-white text-center relative overflow-hidden">
           <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
           
           <div className="relative z-10 flex flex-col items-center">
             <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40 mb-4 shadow-xl">
               <Shield size={48} className="text-white drop-shadow-md fill-white/20" />
             </div>
             <h2 className="text-3xl font-black mb-1 drop-shadow-md">Gold League</h2>
             <p className="font-medium text-white/90">Top 3 advance to Sapphire League!</p>
           </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 flex flex-col items-center text-center shadow-sm">
             <Trophy size={28} className="text-yellow-500 mb-2" />
             <p className="text-xs font-bold text-slate-400 uppercase">Current Rank</p>
             <p className="text-2xl font-black text-slate-800">{userRank}{userRank !== 'N/A' && (userRank === 1 ? 'st' : userRank === 2 ? 'nd' : userRank === 3 ? 'rd' : 'th')}</p>
           </div>
           <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 flex flex-col items-center text-center shadow-sm">
             <Zap size={28} className="text-blue-500 mb-2" />
             <p className="text-xs font-bold text-slate-400 uppercase">Total Score</p>
             <p className="text-2xl font-black text-slate-800">{userXP.toLocaleString()}</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl border-2 border-slate-200 p-1">
          <button 
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'league' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('league')}
          >
            Current League
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'friends' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 text-center">
               <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-slate-500 font-bold uppercase tracking-wider">Syncing Ranks...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-20 text-center">
               <p className="text-slate-500 font-bold uppercase tracking-wider">No results found yet.</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => {
               // Promotion / Demotion zones
               const isPromotion = index < 3;
               const isDemotion = index >= leaderboard.length - 2;
               
               return (
                 <div key={index} className={`flex items-center gap-4 p-4 border-b-2 border-slate-100 last:border-b-0 transition-colors
                   ${entry.isUser ? 'bg-blue-50/50 relative' : 'hover:bg-slate-50'}
                   ${isPromotion && index === 2 ? 'border-b-4 border-b-green-500' : ''}
                   ${isDemotion && index === leaderboard.length - 3 ? 'border-b-4 border-b-red-500' : ''}
                 `}>
                    
                    {/* Active Indicator for User */}
                    {entry.isUser && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}
  
                    {/* Rank */}
                    <div className={`w-8 text-center font-black text-lg ${
                      index === 0 ? 'text-yellow-500' : 
                      index === 1 ? 'text-slate-400' : 
                      index === 2 ? 'text-amber-700' : 'text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
  
                    {/* Trend Icon */}
                    <div className="w-4 flex justify-center">
                      {entry.trend === 'up' && <ChevronUp size={16} className="text-green-500" strokeWidth={3} />}
                      {entry.trend === 'down' && <ChevronDown size={16} className="text-red-500" strokeWidth={3} />}
                      {entry.trend === 'same' && <Minus size={16} className="text-slate-300" strokeWidth={3} />}
                    </div>
  
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-inner ${entry.avatar}`}>
                       {entry.name?.charAt(0) || 'U'}
                    </div>
  
                    {/* Name & XP */}
                    <div className="flex-1">
                       <p className={`font-bold text-[15px] ${entry.isUser ? 'text-primary' : 'text-slate-800'}`}>
                         {entry.name}
                       </p>
                       <p className="text-xs font-semibold text-slate-400">{entry.xp} Score</p>
                    </div>
  
                 </div>
               );
            })
          )}
        </div>

      </main>
    </div>
  );
}
