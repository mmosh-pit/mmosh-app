import { Guild, GuildFilter } from "@/app/models/guild";
import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

const gensMap = {
  gen1: "lineage.promotor",
  gen2: "lineage.scout",
  gen3: "lineage.recruitor",
  gen4: "lineage.originator",
};

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-lineage");

  const { searchParams } = new URL(req.url);
  const param = searchParams.get("address");
  const gens = searchParams.get("gens");
  const skip = searchParams.get("skip");
  const sortValue = searchParams.get("sort") as string;
  const sortDirection = searchParams.get("sortDir") as string;

  if (!param || !gens || !skip || !sortValue || !sortDirection) {
    return NextResponse.json("Invalid Payload", { status: 400 });
  }

  const gensDecoded: GuildFilter[] = gens.split(",") as GuildFilter[];

  const filter = {
    $or: [] as Guild[],
  };

  gensDecoded.forEach((gen) => {
    filter.$or.push({ [gensMap[gen]]: param });
  });

  const guilds = await collection
    .find<{ lineage: Guild; profile: string }>(filter, {
      projection: {
        _id: 0,
        lineage: 1,
        profile: 1,
      },
    })
    .toArray();

  const lineagesMap: any = {};

  for (const value of guilds) {
    let lineageValue = "";

    if (value.lineage.promotor === param) {
      lineageValue = "promotor";
    }

    if (value.lineage.scout === param && lineageValue !== "") {
      lineageValue = "scout";
    }

    if (value.lineage.recruitor === param && lineageValue !== "") {
      lineageValue = "recruitor";
    }

    if (value.lineage.originator === param && lineageValue !== "") {
      lineageValue = "originator";
    }

    lineagesMap[value.profile] = lineageValue;
  }

  const profilesFilter = {
    profilenft: { $in: Object.keys(lineagesMap) },
  };

  const sortDirectionValue = sortDirection === "desc" ? -1 : 1;

  const profiles = await db
    .collection("mmosh-app-profiles")
    .find(profilesFilter, {
      projection: {
        _id: 0,
        profilenft: 1,
        profile: 1,
        royalty: 1,
        "telegram.username": 1,
        "telegram.points": 1,
        "twitter.username": 1,
      },
    })
    .sort({ [sortValue]: sortDirectionValue })
    .skip(Number(skip))
    .limit(10)
    .toArray();

  for (const value of profiles) {
    value.lineageValue = lineagesMap[value.profilenft];
  }

  return NextResponse.json(profiles, {
    status: 200,
  });
}
