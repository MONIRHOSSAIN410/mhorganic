"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, HeartHandshake, Leaf, ShieldCheck, Truck } from "lucide-react";
import Header from "@/components/Header";
import ProductCard, { Product } from "@/components/ProductCard";
import Button from "@/components/ui/Button";
import { apiRequest } from "@/lib/api";

const categories = ["All", "Organic Spices", "Tea & Drinks", "Healthy Grains", "Fresh Food", "Organic Oils", "Healthy Snacks", "Organic Drinks"];
const fallback: Product[] = [
  { _id:"demo1", name:"Organic Turmeric Powder", category:"Organic Spices", price:180, unit:"250 gm", image:"https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=700&q=80", featured:true },
  { _id:"demo2", name:"Premium Quinoa", category:"Healthy Grains", price:275, unit:"250 gm", image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80" },
  { _id:"demo3", name:"Natural Country Chicken", category:"Fresh Food", price:240, unit:"500 gm", image:"https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=700&q=80" },
  { _id:"demo4", name:"Organic Green Tea", category:"Tea & Drinks", price:225, unit:"25 bags", image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80" },
  { _id:"demo5", name:"Organic Apple Cider Vinegar", category:"Organic Drinks", price:900, unit:"500 ml", image:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=80" },
  { _id:"demo6", name:"Cold Pressed Garlic Oil", category:"Organic Oils", price:1270, unit:"100 ml", image:"https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80" }
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(fallback);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    apiRequest<{ products: Product[] }>("/products").then(data => { if (data.products.length) setProducts(data.products); setApiReady(true); }).catch(() => setApiReady(false));
  }, []);

  const visible = useMemo(() => products.filter(p => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())), [products, category, search]);
  return <main>
    <Header onSearch={value => { setSearch(value); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}/>
    <section className="mx-auto max-w-7xl px-4 pt-5 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#edf6e5] via-[#f4f8ec] to-[#e6f0d8] px-6 py-8 sm:px-10 sm:py-12">
        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border-[35px] border-white/40"/>
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white/70 px-3 py-1.5 text-xs font-bold text-leaf-700"><Leaf size={14}/> GOOD FOOD, GOOD MOOD</span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">Nature&apos;s best, <span className="text-leaf-600">delivered fresh.</span></h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">Shop honest ingredients, organic pantry essentials and everyday goodness for your family.</p>
          <a href="#products"><Button className="mt-5">Shop products <ArrowRight size={17}/></Button></a>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-600"><span className="flex items-center gap-1.5"><BadgeCheck size={16} className="text-leaf-600"/> Quality checked</span><span className="flex items-center gap-1.5"><Truck size={16} className="text-leaf-600"/> Quick delivery</span></div>
        </div>
      </motion.div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-7 lg:px-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[{icon:Leaf,title:"Naturally selected",desc:"Thoughtfully sourced everyday goods"},{icon:ShieldCheck,title:"Quality you trust",desc:"Carefully checked before delivery"},{icon:HeartHandshake,title:"Made for your home",desc:"Good ingredients, better living"}].map(item => <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4"><span className="rounded-xl bg-leaf-50 p-3 text-leaf-700"><item.icon size={21}/></span><div><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.desc}</p></div></div>)}
      </div>
    </section>
    <section id="products" className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-16 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-leaf-600">Fresh picks for you</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Shop our products</h2><p className="mt-1 text-sm text-slate-500">Find your everyday favourites in one place.</p></div><div className="text-xs text-slate-500">{apiReady ? "Live product catalogue" : "Preview catalogue"} · {visible.length} items</div></div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${category === c ? "border-leaf-600 bg-leaf-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-leaf-300 hover:text-leaf-700"}`}>{c}</button>)}</div>
      {visible.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{visible.map((product, i) => <ProductCard key={product._id} product={product} index={i}/>)}</div> : <div className="mt-8 rounded-2xl border border-dashed p-12 text-center text-sm text-slate-500">No products found. Try a different search or category.</div>}
    </section>
    <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span className="font-bold text-leaf-700">greenbasket</span><span>Fresh choices for a naturally better life.</span><span>© {new Date().getFullYear()} GreenBasket</span></div></footer>
  </main>;
}
