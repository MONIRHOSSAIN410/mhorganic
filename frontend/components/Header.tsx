"use client";
import Link from "next/link";
import { Leaf, Search, ShoppingBasket, UserRound, X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { changeQty, removeFromCart } from "@/store/cartSlice";

export default function Header({ onSearch }: { onSearch: (value: string) => void }) {
  const items = useSelector((state: RootState) => state.cart.items);
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { 
    if (!cartOpen) return; 
    const old = document.body.style.overflow; 
    document.body.style.overflow = "hidden"; 
    const onKey = (e: KeyboardEvent) => { 
      if (e.key === "Escape") setCartOpen(false); 
    }; 
    window.addEventListener("keydown", onKey); 
    return () => { 
      document.body.style.overflow = old; 
      window.removeEventListener("keydown", onKey); 
    }; 
  }, [cartOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-green-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-black tracking-tight text-leaf-700">
            <span className="rounded-xl bg-leaf-100 p-2"><Leaf size={22}/></span>
            <span>green<span className="text-slate-800">basket</span></span>
          </Link>
          <div className="hidden flex-1 md:block">
            <form onSubmit={e => { e.preventDefault(); onSearch(query); }} className="mx-auto flex max-w-xl items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-leaf-500">
              <Search size={18} className="text-slate-400"/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search organic products..." className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"/>
              <button className="rounded-lg bg-leaf-600 px-4 py-2 text-sm font-semibold text-white">Search</button>
            </form>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/login" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-leaf-50 sm:flex">
              <UserRound size={18}/> Admin
            </Link>
            <button type="button" onClick={() => setCartOpen(true)} aria-label="Open shopping basket" className="relative flex items-center gap-2 rounded-xl bg-leaf-50 px-3 py-2.5 text-sm font-bold text-leaf-700 hover:bg-leaf-100">
              <ShoppingBasket size={19}/>
              <span className="hidden sm:inline">Basket</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-leaf-600 px-1 text-xs text-white">{count}</span>
            </button>
          </div>
        </div>
        <div className="border-t border-slate-100 px-4 py-2 md:hidden">
          <form onSubmit={e => { e.preventDefault(); onSearch(query); }} className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3">
            <Search size={16}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="w-full bg-transparent py-2 text-sm outline-none"/>
            <button className="text-sm font-bold text-leaf-700">Go</button>
          </form>
        </div>
      </header>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.button aria-label="Close basket overlay" className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px]" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setCartOpen(false)} />
            <motion.aside role="dialog" aria-modal="true" aria-label="Shopping basket" className="fixed right-0 top-0 z-[60] flex h-dvh w-full max-w-md flex-col bg-white shadow-2xl" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:28,stiffness:300}}>
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <h2 className="text-lg font-black">Your basket</h2>
                  <p className="text-xs text-slate-500">{count} item{count===1?"":"s"} selected</p>
                </div>
                <button onClick={() => setCartOpen(false)} aria-label="Close basket" className="rounded-full p-2 hover:bg-slate-100"><X size={20}/></button>
              </div>
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <span className="rounded-full bg-leaf-50 p-5 text-leaf-700"><ShoppingBag size={30}/></span>
                  <h3 className="mt-4 font-bold">Your basket is empty</h3>
                  <p className="mt-1 text-sm text-slate-500">Add a few fresh favourites to get started.</p>
                  <button onClick={() => setCartOpen(false)} className="mt-5 rounded-xl bg-leaf-600 px-5 py-3 text-sm font-bold text-white">Continue shopping</button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-5">
                    {items.map(item => (
                      <div key={item._id} className="flex gap-3 border-b py-4">
                        <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl bg-slate-50 object-contain p-2"/>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800">{item.name}</p>
                          <p className="mt-1 text-sm font-extrabold text-leaf-700">৳ {item.price.toLocaleString("en-BD")} <span className="text-xs font-normal text-slate-400">/ {item.unit}</span></p>
                          <div className="mt-2 flex items-center gap-2">
                            <button aria-label="Decrease quantity" onClick={() => dispatch(changeQty({id:item._id,qty:item.qty-1}))} className="rounded-lg border p-1.5"><Minus size={13}/></button>
                            <span className="min-w-5 text-center text-sm font-bold">{item.qty}</span>
                            <button aria-label="Increase quantity" onClick={() => dispatch(changeQty({id:item._id,qty:item.qty+1}))} className="rounded-lg border p-1.5"><Plus size={13}/></button>
                            <button aria-label={`Remove ${item.name}`} onClick={() => dispatch(removeFromCart(item._id))} className="ml-auto rounded-lg p-1.5 text-red-500"><Trash2 size={15}/></button>
                          </div>
                        </div>
                        <p className="whitespace-nowrap text-sm font-bold">৳ {(item.price*item.qty).toLocaleString("en-BD")}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-slate-500">Subtotal</span>
                      <span className="text-xl font-black">৳ {total.toLocaleString("en-BD")}</span>
                    </div>
                    <p className="mb-4 text-xs text-slate-500">Delivery fee is calculated during checkout.</p>
                    <Link href="/order" onClick={() => setCartOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 px-4 py-3.5 font-bold text-white">
                      Proceed to checkout <ArrowRight size={17}/>
                    </Link>
                    <button onClick={() => setCartOpen(false)} className="mt-3 w-full py-2 text-sm font-semibold text-slate-500">Continue shopping</button>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}