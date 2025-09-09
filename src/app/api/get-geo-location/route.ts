import { clickhouse } from "@/app/lib/clickhouse";
import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    try {
        const forwarded = req.headers.get('x-forwarded-for');
        console.log("===== 1.REQUEST RECEICED =====", forwarded);
        let ip = forwarded ? forwarded.replace("::ffff:", "") : req.headers.get('x-real-ip') || '127.0.0.1';
        if (ip === "::1") {
            ip = "127.0.0.1"
        }
        console.log("===== 2.REQUEST RECEICED =====", ip);
        const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
        // console.log("===== 3.REQUEST RECEICED =====", geoResponse);
        const geoData = geoResponse.data;
        console.log("===== 3.REQUEST RECEICED =====", geoData);
        return NextResponse.json({
            country: geoData.country_name || 'Unknown',
            region: geoData.region || 'Unknown',
            city: geoData.city || 'Unknown',
            ip: ip
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            ip: '0.0.0.0'
        }, { status: 200 });
    }
}