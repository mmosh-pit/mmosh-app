import { mintTokens } from "../../../utils/mintTokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  const { publicKey, points } = await req.json();

      const response = await mintTokens(publicKey, Number(points));

      if(response.status === 400) {
        return NextResponse.json("Error while transferring points", { status: 400 });
      }
      return NextResponse.json("Points transferred to wallet", { status: 200 });
}
