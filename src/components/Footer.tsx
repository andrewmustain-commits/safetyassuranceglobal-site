import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-sag-slate">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl border border-sag-gold/40 text-xs font-black text-sag-gold">SAG</div><div><p className="font-semibold">Safety Assurance Global</p><p className="text-sm text-sag-muted">Institute of Assurance · Powered by Mandavere</p></div></div><p className="mt-5 max-w-xl text-sm leading-6 text-sag-muted">SAG provides independent assurance, workforce learning, safety, risk, QA/QC and operational-readiness services. Course references to OSHA, USCG, ISO, EM 385-1-1 or other frameworks describe subject-matter scope only and do not imply regulator, standards-body or government endorsement.</p></div>
        <div><p className="text-sm font-semibold">Navigate</p><div className="mt-4 grid gap-2 text-sm text-sag-muted"><Link href="/courses">Course Registry</Link><Link href="/verify">Registrar Lookup</Link><Link href="/enterprise">Enterprise & GovCon</Link></div></div>
        <div><p className="text-sm font-semibold">Claims boundary</p><p className="mt-4 text-sm leading-6 text-sag-muted">Completion of a course is not equivalent to a license, government certification, professional credential, or regulatory approval. Credential issuance is a separate governed Registrar decision.</p></div>
      </div>
      <div className="border-t border-slate-800"><div className="shell flex flex-col gap-3 py-5 text-xs text-sag-muted sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Safety Assurance Global LLC. All rights reserved.</span><span>Enterprise technology attribution: Powered by Mandavere.</span></div></div>
    </footer>
  );
}
