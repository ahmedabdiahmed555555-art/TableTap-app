import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react';
import { OrderItem } from '../types';
import { cn } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onPlaceOrder: () => void;
  total: number;
  orderStatus: 'idle' | 'submitting' | 'success';
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onPlaceOrder, 
  total,
  orderStatus 
}: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A0A0C] border-l border-white/5 z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-teal-400" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Your Order</h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-white/10" />
                  </div>
                  <p className="text-white/40">Empty cart. Time to eat?</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 text-teal-400 font-bold hover:underline py-2"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center"
                    >
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white truncate">{item.name}</h4>
                        <p className="text-xs font-mono text-white/40 mt-0.5">${item.price.toFixed(2)} unit</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-white/10 text-white/60 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-bold text-white">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-white/10 text-white/60 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="w-16 text-right font-mono font-bold text-teal-400 text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 bg-[#0A0A0C] border-t border-white/5 space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Estimated Total</span>
                <span className="text-3xl font-black text-white font-mono">${total.toFixed(2)}</span>
              </div>
              
              {orderStatus === 'success' ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-teal-400 text-slate-950 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  ORDER RECEIVED
                </motion.div>
              ) : (
                <button
                  disabled={items.length === 0 || orderStatus === 'submitting'}
                  onClick={onPlaceOrder}
                  className={cn(
                    "w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98]",
                    items.length === 0 || orderStatus === 'submitting'
                      ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                      : "bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-2xl shadow-teal-500/20"
                  )}
                >
                  {orderStatus === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      SUBMITTING...
                    </>
                  ) : (
                    <>PLACE ORDER</>
                  )}
                </button>
              )}
              <p className="text-[10px] text-center text-white/20 uppercase tracking-[0.3em] font-black">
                TABLETAP • EST 2024
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
