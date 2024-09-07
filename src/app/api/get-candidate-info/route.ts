import { db } from "@/app/lib/mongoClient";
import { Candidate } from "@/app/models/candidate";
import { CandidateInfo } from "@/app/models/candidateInfo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const collection = db.collection("candidates");

  const { searchParams } = new URL(req.url);
  const param = searchParams.get("candidate");

  const candidate = await collection.findOne<Candidate>({
    CANDIDATE_ID: param,
  });

  if (!candidate) {
    return NextResponse.json("", { status: 404 });
  }

  let firstOponent: Candidate | null = null;

  const response: CandidateInfo = {
    candidate,
    firstOponent: firstOponent,
    secondOponent: null,
  };

  if (candidate.PARTY == "DEM") {
    firstOponent = await collection.findOne<Candidate>({
      PARTY: "REP",
      CANDIDATE_ID: {
        $regex: new RegExp(`^${candidate.CANDIDATE_ID.at(0)}`, "i"),
      },
    });
  } else if (candidate.PARTY == "REP") {
    firstOponent = await collection.findOne<Candidate>({
      PARTY: "DEM",
      CANDIDATE_ID: {
        $regex: new RegExp(`^${candidate.CANDIDATE_ID.at(0)}`, "i"),
      },
    });
  } else {
    firstOponent = await collection.findOne<Candidate>({
      PARTY: { $not: { $eq: candidate.PARTY } },
      CANDIDATE_ID: {
        $regex: new RegExp(`^${candidate.CANDIDATE_ID.at(0)}`, "i"),
      },
    });
  }

  if (!firstOponent) {
    return NextResponse.json(response, { status: 200 });
  }

  response.firstOponent = firstOponent;

  const secondOponent = await collection.findOne<Candidate>({
    PARTY: {
      $not: {
        $in: [firstOponent!.PARTY, candidate!.PARTY],
      },
    },
    CANDIDATE_ID: {
      $regex: new RegExp(`^${candidate.CANDIDATE_ID.at(0)}`, "i"),
    },
  });

  response.secondOponent = secondOponent;

  return NextResponse.json(response, { status: 200 });
}
