import { NextResponse } from "next/server";
import { certificateRecords } from "@/data/certificates";

export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const uuid = typeof body?.uuid === "string" ? body.uuid.trim().toLowerCase() : "";
  const validFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid);
  if (!validFormat) return NextResponse.json({ ok:false, error:"Enter a valid certificate UUID." }, { status:400 });
  const record = certificateRecords.find((item) => item.uuid.toLowerCase() === uuid);
  if (!record) return NextResponse.json({ ok:true, found:false, message:"No public Registrar record was found for that UUID." });
  return NextResponse.json({ ok:true, found:true, record });
}
