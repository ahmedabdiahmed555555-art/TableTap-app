import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  RefreshCcw,
  LogIn,
  Layers,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { subscribeToOrders, updateOrderStatus } from '../services/orderService';
import { cn } from '../lib/utils';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribeOrders = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
    });
    return () => unsubscribeOrders();
  }, [user]);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-sm w-full backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl">
          <div className="bg-teal-400/20 border border-teal-400/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(45,212,191,0.1)]">
            <ChefHat className="w-10 h-10 text-teal-400" />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-3">Staff Access</h1>
          <p className="text-white/40 mb-10 text-sm leading-relaxed font-medium">Please authenticate to access the live order control center.</p>
          <button 
            onClick={login}
            className="w-full flex items-center justify-center gap-3 bg-teal-400 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-xs hover:bg-teal-300 transition-all shadow-xl shadow-teal-500/20 active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            Auth with Google
          </button>
        </div>
      </div>
    );
  }

  const liveOrdersCount = orders.filter(o => o.status !== 'served').length;

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-[#0A0A0C]/40 border-b border-white/5 py-6 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-teal-400 text-xs font-black uppercase tracking-[0.3em]">INTERNAL DASHBOARD</span>
            <h2 className="text-3xl font-light tracking-tight text-white flex items-center gap-3 pt-1">
              Control Center
            </h2>
          </div>
          <div className="flex gap-8 items-end">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] uppercase text-white/40 font-black tracking-widest">Active Staff</p>
              <p className="text-sm font-mono font-bold text-white mt-1">{user.displayName?.split(' ')[0]}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase text-white/40 font-black tracking-widest">Live Orders</p>
              <p className="text-2xl font-mono font-bold text-teal-400 mt-0.5">{liveOrdersCount.toString().padStart(2, '0')}</p>
            </div>
            <button 
              onClick={() => auth.signOut()} 
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 pt-40">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "backdrop-blur-md bg-white/5 border rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between group transition-all duration-500",
                  order.status === 'pending' ? "border-orange-500/30" : "border-white/10",
                  order.status === 'served' && "opacity-40 grayscale-[50%]"
                )}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={cn(
                        "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] mb-4 inline-block border",
                        order.status === 'pending' ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                        order.status === 'preparing' ? "bg-teal-400/20 text-teal-400 border-teal-400/30" :
                        "bg-white/5 text-white/40 border-white/10"
                      )}>
                        {order.status}
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Table #{order.tableNumber}</h3>
                      <div className="flex items-center gap-2 text-white/40 mt-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[11px] uppercase tracking-widest font-mono">
                          Ordered {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-white/20 font-bold">#{order.id.slice(-4).toUpperCase()}</span>
                  </div>

                  <div className="space-y-2 py-6 border-y border-white/5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm items-start">
                        <span className="text-white/80 font-medium leading-relaxed">
                          <span className="text-teal-400 font-bold mr-2">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-white/20 mt-1 uppercase tracking-tighter">PREP</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="flex-1 bg-teal-400 text-slate-950 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-teal-300 shadow-lg shadow-teal-500/10 active:scale-95"
                      >
                        Prepare
                      </button>
                      <button className="px-4 bg-white/5 hover:bg-red-400/20 border border-white/10 rounded-xl transition-all group/btn">
                        <X className="w-4 h-4 text-white/20 group-hover/btn:text-red-400" />
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'served')}
                      className="w-full bg-white text-slate-950 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/90 active:scale-95"
                    >
                      Mark as Served
                    </button>
                  )}
                  {order.status === 'served' && (
                    <div className="w-full bg-white/5 border border-white/10 text-white/20 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-white/10">
            <Layers className="w-20 h-20 mb-6 animate-pulse" />
            <p className="font-bold tracking-[0.4em] uppercase text-xs">Waiting for incoming cycles</p>
          </div>
        )}
      </main>
    </div>
  );
}
