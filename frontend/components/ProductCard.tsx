"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import Button from "@/components/ui/Button";

export type Product = { _id: string; name: string; category: string; price: number; oldPrice?: number | null; unit: string; image: string; description?: string; stock?: number; featured?: boolean };
export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const dispatch = useDispatch();
  return <motion.article initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .35, delay: Math.min(index * .025, .2) }} whileHover={{ y: -4 }} className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-leaf-200 hover:shadow-soft">
    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[#f6f7f1]">
      <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 180px" className="object-contain p-2 transition duration-500 group-hover:scale-105" unoptimized/>
      {product.featured && <span className="absolute left-2 top-2 rounded-md bg-leaf-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-leaf-700">Popular</span>}
      <button onClick={() => dispatch(addToCart({ _id: product._id, name: product.name, price: product.price, image: product.image, unit: product.unit }))} aria-label={`Add ${product.name} to basket`} className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-leaf-600 text-white shadow-md transition hover:scale-110 hover:bg-leaf-700"><Plus size={18}/></button>
    </div>
    <p className="mt-2 truncate text-[10px] font-semibold uppercase tracking-wide text-leaf-700">{product.category}</p>
    <h3 className="mt-1 line-clamp-2 min-h-[2.2rem] text-xs font-bold leading-4 text-slate-800 sm:text-sm">{product.name}</h3>
    <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-500"><Star size={11} fill="currentColor"/><Star size={11} fill="currentColor"/><Star size={11} fill="currentColor"/><Star size={11} fill="currentColor"/><Star size={11} fill="currentColor"/><span className="text-slate-400">(4.9)</span></div>
    <div className="mt-2 flex flex-wrap items-center justify-between gap-1"><span className="text-sm font-extrabold text-slate-900">৳ {product.price.toLocaleString("en-BD")}</span><span className="rounded border border-leaf-200 px-1.5 py-0.5 text-[9px] text-leaf-700">{product.unit}</span></div>
  </motion.article>;
}
