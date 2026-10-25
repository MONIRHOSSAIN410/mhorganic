"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, LogOut, PackagePlus, Pencil, Trash2, X, Leaf, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { apiRequest, getToken } from "@/lib/api";
import { Product } from "@/components/ProductCard";

const empty = { name:"", category:"Organic Spices", price:"", oldPrice:"", unit:"250 gm", image:"", description:"", stock:"20", featured:false };
type FormData = typeof empty;
export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormData>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const data = await apiRequest<{ products: Product[] }>("/products"); setProducts(data.products); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load products"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    load();
  }, [load, router]);

  function openNew() { setEditing(null); setForm(empty); setShowForm(true); setNotice(""); }
  function openEdit(p: Product) {
    setEditing(p._id); setForm({ name:p.name, category:p.category, price:String(p.price), oldPrice:p.oldPrice ? String(p.oldPrice) : "", unit:p.unit, image:p.image, description:p.description || "", stock:String(p.stock ?? 20), featured:Boolean(p.featured) }); setShowForm(true); setNotice("");
  }
  async function save(e: FormEvent) {
    e.preventDefault(); setError(""); setNotice("");
    const body = { ...form, price:Number(form.price), oldPrice:form.oldPrice ? Number(form.oldPrice) : null, stock:Number(form.stock) };
    try {
      await apiRequest(editing ? `/products/${editing}` : "/products", { method: editing ? "PUT" : "POST", body: JSON.stringify(body) });
      setNotice(editing ? "Product updated successfully." : "Product created successfully."); setShowForm(false); setForm(empty); setEditing(null); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save product"); }
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this product permanently?")) return;
    try { await apiRequest(`/products/${id}`, { method:"DELETE" }); setNotice("Product deleted."); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not delete product"); }
  }
  function logout() { localStorage.removeItem("organic_admin_token"); router.push("/login"); }

  return <main className="min-h-screen bg-slate-50">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8"><Link href="/" className="flex items-center gap-2 text-lg font-black text-leaf-700"><span className="rounded-lg bg-leaf-100 p-2"><Leaf size={20}/></span> GreenBasket Admin</Link><div className="flex gap-2"><Link href="/dashboard/orders" className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold text-leaf-700 hover:bg-leaf-50">Orders</Link><Link href="/" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:flex"><ArrowLeft size={16}/> Store</Link><Button variant="outline" onClick={logout}><LogOut size={16}/> Logout</Button></div></div></header>
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-leaf-600">Store management</p><h1 className="mt-1 text-3xl font-black tracking-tight">Product dashboard</h1><p className="mt-2 text-sm text-slate-500">Create, update, and remove products shown on the storefront.</p></div><div className="flex gap-2"><Button variant="outline" onClick={load}><RefreshCw size={16}/> Refresh</Button><Button onClick={openNew}><PackagePlus size={17}/> Add product</Button></div></motion.div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">Total products</p><p className="mt-2 text-3xl font-black">{products.length}</p></div><div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">Categories</p><p className="mt-2 text-3xl font-black">{new Set(products.map(p=>p.category)).size}</p></div><div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">Out of stock</p><p className="mt-2 text-3xl font-black">{products.filter(p=>(p.stock ?? 0)===0).length}</p></div></div>
      {notice && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{notice}</p>}{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {showForm && <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 p-4 sm:items-center"><motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} className="my-4 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-center justify-between"><h2 className="text-xl font-black">{editing ? "Edit product" : "Add new product"}</h2><button onClick={()=>setShowForm(false)} className="rounded-lg p-2 hover:bg-slate-100"><X size={20}/></button></div>
        <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Product name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-leaf-500"/></label>
          <label className="text-sm font-semibold">Category<input required value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-leaf-500"/></label>
          <label className="text-sm font-semibold">Price (৳)<input required type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-leaf-500"/></label>
          <label className="text-sm font-semibold">Old price (optional)<input type="number" min="0" value={form.oldPrice} onChange={e=>setForm({...form,oldPrice:e.target.value})} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-leaf-500"/></label>
          <label className="text-sm font-semibold">Unit<input required value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="250 gm" className="mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-leaf-500"/></label>
          <label className="text-sm font-semibold">Stock quantity<input required type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-leaf-500"/></label>
          <label className="text-sm font-semibold sm:col-span-2">Image URL<input required type="url" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..." className="mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-leaf-500"/></label>
          <label className="text-sm font-semibold sm:col-span-2">Description<textarea rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-leaf-500"/></label>
          <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="h-4 w-4 accent-green-700"/> Mark as popular product</label>
          <div className="flex gap-2 sm:col-span-2"><Button type="submit">{editing ? "Save changes" : "Create product"}</Button><Button type="button" variant="outline" onClick={()=>setShowForm(false)}>Cancel</Button></div>
        </form>
      </motion.div></div>}
      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-4"><h2 className="font-bold">Product catalogue</h2><span className="text-xs text-slate-500">{products.length} products</span></div>
        {loading ? <div className="p-10 text-center text-sm text-slate-500">Loading products…</div> : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y">{products.map(p=><tr key={p._id} className="hover:bg-slate-50/70"><td className="px-5 py-3"><div className="flex items-center gap-3"><div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100"><Image src={p.image} alt={p.name} fill sizes="48px" unoptimized className="object-contain p-1"/></div><div><p className="max-w-[240px] truncate font-bold">{p.name}</p><p className="text-xs text-slate-400">{p.unit}</p></div></div></td><td className="px-4 py-3 text-slate-600">{p.category}</td><td className="px-4 py-3 font-bold">৳ {p.price.toLocaleString("en-BD")}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${(p.stock??0)===0?"bg-red-50 text-red-700":"bg-green-50 text-green-700"}`}>{p.stock??0} in stock</span></td><td className="px-5 py-3"><div className="flex justify-end gap-2"><button onClick={()=>openEdit(p)} className="rounded-lg border p-2 text-slate-600 hover:border-leaf-400 hover:text-leaf-700" aria-label="Edit product"><Pencil size={16}/></button><button onClick={()=>remove(p._id)} className="rounded-lg border p-2 text-red-600 hover:bg-red-50" aria-label="Delete product"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>{products.length===0 && <p className="p-10 text-center text-sm text-slate-500">No products yet. Add your first product.</p>}</div>}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-400">Admin access is protected by a signed JWT. Keep your environment secrets private and use HTTPS and secure cookies for production deployment.</p>
    </div>
  </main>;
}
