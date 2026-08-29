import Link from "next/link";
import { academies } from "@/data/academies";
import { ArrowUpRight } from "lucide-react";

export default function AcademyGrid(){return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{academies.map((a,index)=><Link key={a.slug} href={`/academies/${a.slug}`} className="group panel p-6 hover:border-sag-glow/70 hover:-translate-y-1 transition"><div className="flex items-start justify-between gap-4"><span className="text-xs font-semibold text-sag-gold">{String(index+1).padStart(2,"0")} · {a.code}</span><ArrowUpRight size={18} className="text-sag-muted group-hover:text-sag-glow"/></div><h3 className="mt-5 text-xl font-semibold">{a.name}</h3><p className="mt-3 text-sm leading-6 text-sag-muted">{a.description}</p><div className="mt-5 flex flex-wrap gap-2">{a.scope.slice(0,3).map(s=><span key={s} className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">{s}</span>)}</div></Link>)}</div>}
