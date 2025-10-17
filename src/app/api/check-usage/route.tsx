import { clickhouse } from "@/app/lib/clickhouse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const wallet = searchParams.get("wallet");
  const agentId = searchParams.get("agentId");
  const role = searchParams.get("role");
  if (!wallet || !agentId || !role) {
    return NextResponse.json(
      { error: "Missing required parameters: wallet, agentId, and role" },
      { status: 400 }
    );
  }

  try {
    const query = `
      SELECT 
        SUM(value) AS total_value
      FROM mmosh_app_user_agent_usage
      WHERE wallet = {wallet:String} 
        AND agentId = {agentId:String}
    `;

    const resultSet = await clickhouse.query({
      query,
      query_params: { wallet, agentId },
      format: "JSONEachRow",
    });

    const data: any = await resultSet.json();

    if (!data || data.length === 0 || !data[0].total_value) {
      return NextResponse.json({
        allowed: true,
        message: "No usage data found",
      });
    }

    const totalValue = data[0].total_value;

    let allowed = false;
    if (role === "guest") {
      allowed = totalValue < 0.2;
    } else if (role === "creator" || role === "enjoyer") {
      allowed = true;
    } else {
      return NextResponse.json(
        { error: "Invalid role. Must be 'guest', 'creator', or 'enjoyer'" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      allowed,
      totalValue,
      role,
    });
  } catch (error) {
    return NextResponse.json({
      allowed: false,
      totalValue: 0,
      role: "guest",
    });
  }
}
