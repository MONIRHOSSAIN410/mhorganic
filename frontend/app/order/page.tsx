"use client";
import { FormEvent, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Leaf, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { RootState } from "@/store";
import { changeQty, clearCart, removeFromCart } from "@/store/cartSlice";
import Button from "@/components/ui/Button";
import { apiRequest } from "@/lib/api";

export default function OrderPage() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.qty, 0), [items]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!items.length) { setError("Please add products to your basket first."); return; }
    setLoading(true);
    try {
      const result = await apiRequest<{ order: { _id: string } }>("/orders", {
        method: "POST",
        body: JSON.stringify({
          customerName, phone, address, note,
          items: items.map(item => ({ productId: item._id, qty: item.qty }))
        })
      });
      localStorage.setItem("organic_last_order_id", result.order._id);
      localStorage.setItem("organic_last_order_name", customerName);
      dispatch(clearCart());
      router.push("/my-orders?placed=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order could not be placed. Please try again.");
    } finally { setLoading(false); }
  }

  return <main className="min-h-screen bg-slate-50">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link href="/" className="flex items-center gap-2 text-lg font-black text-leaf-700"><span className="rounded-xl bg-leaf-100 p-2"><Leaf size={20}/></span> greenbasket</Link><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-leaf-700"><ArrowLeft size={16}/> Continue shopping</Link></div></header>
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-leaf-600">Almost there</p><h1 className="mt-1 text-3xl font-black tracking-tight">Place your order</h1><p className="mt-2 text-sm text-slate-500">Fill in your delivery details and review your basket.</p>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <form onSubmit={submit} className="rounded-2xl border bg-white p-5 sm:p-7">
          <h2 className="text-lg font-black">Delivery information</h2>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold">Full name<input required value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Your full name" className="mt-1.5 w-full rounded-xl border px-3 py-3 font-normal outline-none focus:border-leaf-500"/></label>
            <label className="block text-sm font-semibold">Mobile number<input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="01XXXXXXXXX" pattern="[0-9+() -]{8,20}" className="mt-1.5 w-full rounded-xl border px-3 py-3 font-normal outline-none focus:border-leaf-500"/></label>
            <label className="block text-sm font-semibold">Delivery address<textarea required rows={3} value={address} onChange={e=>setAddress(e.target.value)} placeholder="House, road, area, district" className="mt-1.5 w-full rounded-xl border px-3 py-3 font-normal outline-none focus:border-leaf-500"/></label>
            <label className="block text-sm font-semibold">Order note <span className="font-normal text-slate-400">(optional)</span><textarea rows={2} value={note} onChange={e=>setNote(e.target.value)} placeholder="Any delivery instructions?" className="mt-1.5 w-full rounded-xl border px-3 py-3 font-normal outline-none focus:border-leaf-500"/></label>
          </div>
          <div className="mt-5 rounded-xl bg-leaf-50 p-4"><p className="font-bold text-leaf-800">Cash on Delivery</p><p className="mt-1 text-xs text-leaf-700">Pay when your order arrives. Online payment is not configured in this starter.</p></div>
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={loading || items.length===0} className="mt-5 w-full py-3.5">{loading ? "Placing order..." : `Confirm order · ৳ ${total.toLocaleString("en-BD")}`}</Button>
        </form>
        <aside className="h-fit rounded-2xl border bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between"><h2 className="text-lg font-black">Your basket</h2><span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-700">{items.reduce((n,i)=>n+i.qty,0)} items</span></div>
          {!items.length ? <div className="py-10 text-center"><ShoppingBag size={32} className="mx-auto text-slate-300"/><p className="mt-3 text-sm text-slate-500">Your basket is empty.</p><Link href="/" className="mt-3 inline-block text-sm font-bold text-leaf-700">Browse products</Link></div> : <div className="mt-5 divide-y">{items.map(item=><div key={item._id} className="flex gap-3 py-4 first:pt-0"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50"><Image src={item.image} alt={item.name} fill sizes="64px" unoptimized className="object-contain p-1"/></div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-slate-500">৳ {item.price.toLocaleString("en-BD")} · {item.unit}</p><div className="mt-2 flex items-center gap-2"><button type="button" onClick={()=>dispatch(changeQty({id:item._id,qty:item.qty-1}))} className="rounded border p-1"><Minus size={12}/></button><span className="min-w-4 text-center text-xs font-bold">{item.qty}</span><button type="button" onClick={()=>dispatch(changeQty({id:item._id,qty:item.qty+1}))} className="rounded border p-1"><Plus size={12}/></button><button type="button" onClick={()=>dispatch(removeFromCart(item._id))} className="ml-auto p-1 text-red-500" aria-label="Remove item"><Trash2 size={15}/></button></div></div><p className="whitespace-nowrap text-sm font-extrabold">৳ {(item.price*item.qty).toLocaleString("en-BD")}</p></div>)}</div>}
          <div className="mt-4 space-y-3 border-t pt-4 text-sm"><div className="flex justify-between text-slate-500"><span>Subtotal</span><span>৳ {total.toLocaleString("en-BD")}</span></div><div className="flex justify-between text-slate-500"><span>Delivery</span><span>Calculated by store</span></div><div className="flex justify-between border-t pt-3 text-base font-black"><span>Total</span><span>৳ {total.toLocaleString("en-BD")}</span></div></div>
        </aside>
      </div>
    </div>
  </main>;
}
