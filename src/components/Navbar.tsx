"use client";

import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { academies } from "@/data/academies";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [academyOpen, setAcademyOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-sag-navy/95 backdrop-blur">
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Safety Assurance Global home">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-sag-gold/40 bg-sag-slate text-sm font-black text-sag-gold">SAG</div>
          <div><div className="text-sm font-semibold tracking-wide">Safety Assurance Global</div><div className="text-xs text-sag-muted">Institute of Assurance · Powered by Mandavere</div></div>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          <div className="relative">
            <button onClick={() => setAcademyOpen(!academyOpen)} className="flex items-center gap-1 text-sm text-slate-200 hover:text-white">Academies <ChevronDown size={15}/></button>
            {academyOpen && <div className="absolute left-0 top-8 w-80 rounded-xl border border-slate-700 bg-sag-slate p-2 shadow-2xl">{academies.map(a => <Link key={a.slug} href={`/academies/${a.slug}`} onClick={()=>setAcademyOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-white">{a.name}</Link>)}</div>}
          </div>
          <Link href="/enterprise" className="text-sm text-slate-200 hover:text-white">Enterprise / GovCon</Link>
          <Link href="/courses" className="text-sm text-slate-200 hover:text-white">Course Registry</Link>
          <Link href="/verify" className="text-sm text-slate-200 hover:text-white">Registrar Lookup</Link>
        </nav>
        <div className="hidden items-center gap-3 xl:flex"><Link className="btn-gold" href="/enterprise#request">Request Enterprise Cohort</Link><Link className="btn-outline" href="/enterprise#learner-sso">Learner SSO Portal</Link></div>
        <button onClick={()=>setOpen(!open)} className="rounded-lg border border-slate-700 p-2 lg:hidden" aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
      </div>
      {open && <div className="border-t border-slate-800 bg-sag-slate lg:hidden"><div className="shell grid gap-2 py-4">{academies.map(a=><Link key={a.slug} href={`/academies/${a.slug}`} onClick={()=>setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">{a.name}</Link>)}<Link href="/enterprise" onClick={()=>setOpen(false)} className="px-3 py-2">Enterprise / GovCon</Link><Link href="/courses" onClick={()=>setOpen(false)} className="px-3 py-2">Course Registry</Link><Link href="/verify" onClick={()=>setOpen(false)} className="px-3 py-2">Registrar Lookup</Link><Link href="/enterprise#request" onClick={()=>setOpen(false)} className="btn-gold mt-2">Request Enterprise Cohort</Link></div></div>}
    </header>
  );
}
