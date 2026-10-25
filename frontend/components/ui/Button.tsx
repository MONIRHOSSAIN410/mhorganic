"use client";
import { ButtonHTMLAttributes } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" };
export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const variants = {
    primary: "bg-leaf-600 text-white hover:bg-leaf-700 shadow-sm",
    outline: "border border-leaf-600 text-leaf-700 hover:bg-leaf-50",
    ghost: "text-slate-600 hover:bg-slate-100"
  };
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />;
}
