import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { data } = await req.json();

  console.warn("Data: ", data);

  return NextResponse.json("", { status: 200 });
}
