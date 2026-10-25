"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ClipboardList, Leaf, PackageCheck, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function MyOrdersPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const placed = searchParams.get("placed") === "1";
  useEffect(() => {
    setOrderId(localStorage.getItem("organic_last_order_id") || "");
    setCustomerName(localStorage.getItem("organic_last_order_name") || "");
  }, []);
  return <main className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-slate-50">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-5xl items-center px-4 py-4"><Link href="/" className="flex items-center gap-2 text-lg font-black text-leaf-700"><span className="rounded-xl bg-leaf-100 p-2"><Leaf size={20}/></span> greenbasket</Link></div></header>
    <div className="mx-auto max-w-3xl px-4 py-12">
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="rounded-3xl border border-green-100 bg-white p-7 text-center shadow-soft sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700"><CheckCircle2 size={34}/></div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-leaf-600">{placed ? "Order received" : "Customer dashboard"}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{placed ? `Thank you${customerName ? `, ${customerName}` : ""}!` : "Welcome back"}</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">{placed ? "Your order has been saved. Our team will review it and contact you if needed." : "Your latest order confirmation is shown here on this device."}</p>
        {orderId && <div className="mx-auto mt-6 max-w-md rounded-2xl bg-slate-50 p-4 text-left"><p className="flex items-center gap-2 text-sm font-bold"><ClipboardList size={17} className="text-leaf-700"/> Order reference</p><p className="mt-2 break-all font-mono text-xs text-slate-600">{orderId}</p><p className="mt-3 flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-amber-400"/> Status: <strong>Pending</strong></p><p className="mt-1 text-xs text-slate-500">Payment method: Cash on Delivery</p></div>}
        <div className="mx-auto mt-6 grid max-w-md gap-3 text-left sm:grid-cols-2"><div className="rounded-xl border p-4"><PackageCheck size={20} className="text-leaf-700"/><p className="mt-2 text-sm font-bold">Order placed</p><p className="mt-1 text-xs text-slate-500">Saved to the store database.</p></div><div className="rounded-xl border p-4"><ShoppingBag size={20} className="text-leaf-700"/><p className="mt-2 text-sm font-bold">Next step</p><p className="mt-1 text-xs text-slate-500">Store admin can review and update status.</p></div></div>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/"><Button>Continue shopping</Button></Link><Link href="/order"><Button variant="outline">View basket / order page</Button></Link></div>
      </motion.div>
    </div>
  </main>;
}
