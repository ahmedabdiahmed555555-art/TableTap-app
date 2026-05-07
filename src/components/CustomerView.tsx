import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, UtensilsCrossed, ChevronRight, Plus, Minus, X } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '../constants';
import { MenuItem, Category, OrderItem } from '../types';
import { cn } from '../lib/utils';
import { placeOrder } from '../services/orderService';
import CartDrawer from './CartDrawer';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function CustomerView() {
  const [searchParams] = useSearchParams();

  // Test Firestore Connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'system', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  const tableNumber = searchParams.get('table') || '1';
  const [activeCategory, setActiveCategory] = useState<Category>('Breakfast');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const filteredItems = MENU_ITEMS.filter(item => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setOrderStatus('submitting');
    try {
      await placeOrder({
        tableNumber,
        items: cart,
        status: 'pending',
        total,
        createdAt: new Date().toISOString()
      });
      setOrderStatus('success');
      setCart([]);
      setTimeout(() => setOrderStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setOrderStatus('idle');
    }
  };

  return (
    <div className="pb-32 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-2xl bg-[#0A0A0C]/60 border-b border-white/5 px-6 py-5">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.2)]">
              <UtensilsCrossed className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                TableTap
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-teal-400 uppercase tracking-widest">
                  Table #{tableNumber}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-400 text-slate-950 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
                activeCategory === cat 
                  ? "bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20" 
                  : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4"
            >
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-4 flex gap-4 items-center hover:bg-white/[0.08] transition-all duration-300"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                  </div>
                  <div className="flex flex-col flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-base font-semibold text-white leading-tight truncate">
                        {item.name}
                      </h3>
                      <span className="text-sm font-mono font-bold text-teal-400 shrink-0">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-teal-500/10"
                      >
                        <Plus className="w-5 h-5 font-black" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating View Order Button */}
      {cart.length > 0 && !isCartOpen && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-0 right-0 px-6 z-40 max-w-2xl mx-auto"
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-teal-400 text-slate-950 px-8 py-5 rounded-[2rem] shadow-2xl shadow-teal-500/30 flex justify-between items-center font-bold group transition-all hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <span className="tracking-tight text-sm uppercase tracking-[0.1em]">View Order ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black">${total.toFixed(2)}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onPlaceOrder={handlePlaceOrder}
        total={total}
        orderStatus={orderStatus}
      />
    </div>
  );
}

import { ShoppingBag } from 'lucide-react';
