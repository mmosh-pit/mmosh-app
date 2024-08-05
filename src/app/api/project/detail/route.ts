import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project");

  const projectCoinCollection = db.collection("mmosh-app-project-coins");
  const coins = await projectCoinCollection.findOne({ projectkey: project });

  const projectCommunityCollection = db.collection(
    "mmosh-app-project-community",
  );
  const community = await projectCommunityCollection
    .find({ projectkey: project })
    .toArray();

  const projectProfileCollection = db.collection("mmosh-app-project-profiles");
  const profiles = await projectProfileCollection
    .find({ projectkey: project })
    .toArray();

  const projectTokenomicsCollection = db.collection(
    "mmosh-app-project-tokenomics",
  );
  const tokenomics = await projectTokenomicsCollection
    .find({ projectkey: project })
    .toArray();

  const projectCollection = db.collection("mmosh-app-project");
  const projectData = await projectCollection.findOne({ key: project });

  const passCollection = db.collection("mmosh-app-project-pass");
  const passes = await passCollection.find({ projectkey: project }).toArray();

  const result = {
    coins,
    community,
    profiles,
    tokenomics,
    project: projectData,
    passes,
  };

  return NextResponse.json(result, {
    status: 200,
  });
}
