import type { Metadata } from "next";
import CourseSearch from "@/components/CourseSearch";
export const metadata: Metadata={title:"Canonical Course Registry",description:"Search the governed SAG Institute of Assurance course registry by domain, academy, duration and jurisdiction."};
export default function CoursesPage(){return <section className="section"><div className="shell"><p className="eyebrow">Canonical registry</p><h1 className="h1 mt-4 max-w-4xl">Course Registry & Search</h1><p className="copy mt-6 max-w-3xl">Search exact-version course records across the Institute. Registry status communicates lifecycle position only; it does not imply external accreditation, regulator approval or credential issuance.</p><div className="mt-10"><CourseSearch/></div></div></section>}
