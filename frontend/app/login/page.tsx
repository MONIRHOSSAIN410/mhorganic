"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, LockKeyhole, Mail, ArrowLeft, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const result = await apiRequest<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("organic_admin_token", result.token);
      router.push("/dashboard");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not log in"); }
    finally { setLoading(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-leaf-50 via-white to-[#f5f6ed] px-4 py-10">
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-soft sm:p-9">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-leaf-700"><ArrowLeft size={16}/> Back to store</Link>
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700"><Leaf size={28}/></div>
      <h1 className="text-3xl font-black tracking-tight">Admin sign in</h1><p className="mt-2 text-sm leading-6 text-slate-500">Sign in to manage products and your store catalogue.</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Email address<div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-leaf-500"><Mail size={18} className="text-slate-400"/><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full py-3 outline-none" placeholder="admin@example.com"/></div></label>
        <label className="block text-sm font-semibold text-slate-700">Password<div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-leaf-500"><LockKeyhole size={18} className="text-slate-400"/><input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full py-3 outline-none" placeholder="Your password"/></div></label>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full py-3">{loading ? <LoaderCircle className="animate-spin" size={18}/> : "Sign in to dashboard"}</Button>
      </form>
     
    </motion.div>
  </main>;
}
