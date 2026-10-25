"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Leaf, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import { apiRequest, getToken } from "@/lib/api";

type Order = { _id:string; customerName:string; phone:string; address:string; note?:string; total:number; status:string; createdAt:string; items:{name:string;qty:number;price:number;unit:string}[] };
const statuses = ["Pending","Confirmed","Processing","Delivered","Cancelled"];
export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders,setOrders] = useState<Order[]>([]);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(true);
  const load = useCallback(async()=>{setLoading(true);setError("");try{const d=await apiRequest<{orders:Order[]}>("/orders");setOrders(d.orders);}catch(e){setError(e instanceof Error?e.message:"Unable to load orders");}finally{setLoading(false);}},[]);
  useEffect(()=>{if(!getToken()){router.replace("/login");return;}load();},[load,router]);
  async function setStatus(id:string,status:string){try{await apiRequest(`/orders/${id}/status`,{method:"PATCH",body:JSON.stringify({status})});await load();}catch(e){setError(e instanceof Error?e.message:"Could not update status");}}
  return <main className="min-h-screen bg-slate-50"><header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"><Link href="/" className="flex items-center gap-2 text-lg font-black text-leaf-700"><span className="rounded-lg bg-leaf-100 p-2"><Leaf size={20}/></span> GreenBasket Admin</Link><Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft size={16}/> Products dashboard</Link></div></header>
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-leaf-600">Sales management</p><h1 className="mt-1 text-3xl font-black">Customer orders</h1><p className="mt-2 text-sm text-slate-500">Review orders and update their fulfilment status.</p></div><Button variant="outline" onClick={load}><RefreshCw size={16}/> Refresh</Button></div>
    {error&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mt-6 overflow-hidden rounded-2xl border bg-white"><div className="flex items-center gap-2 border-b px-5 py-4 font-bold"><ClipboardList size={18} className="text-leaf-700"/> Orders <span className="ml-auto text-xs font-normal text-slate-500">{orders.length} total</span></div>
    {loading?<p className="p-10 text-center text-sm text-slate-500">Loading orders…</p>:orders.length===0?<p className="p-10 text-center text-sm text-slate-500">No orders yet. Customer orders will appear here.</p>:<div className="divide-y">{orders.map(o=><article key={o._id} className="p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="font-bold">{o.customerName} <span className="font-normal text-slate-500">· {o.phone}</span></p><p className="mt-1 text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()} · Order #{o._id.slice(-8)}</p><p className="mt-2 max-w-2xl text-sm text-slate-600">{o.address}</p>{o.note&&<p className="mt-1 text-xs text-slate-500">Note: {o.note}</p>}</div><div className="flex items-start gap-3"><p className="whitespace-nowrap text-lg font-black">৳ {o.total.toLocaleString("en-BD")}</p><select value={o.status} onChange={e=>setStatus(o._id,e.target.value)} className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-leaf-500">{statuses.map(s=><option key={s}>{s}</option>)}</select></div></div><div className="mt-3 flex flex-wrap gap-2">{o.items.map((it,i)=><span key={`${it.name}-${i}`} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">{it.name} × {it.qty}</span>)}</div></article>)}</div>}</div></div>
  </main>;
}
