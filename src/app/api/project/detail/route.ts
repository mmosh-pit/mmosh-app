import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const address = searchParams.get("address");

  const projectCollection = db.collection("mmosh-app-project");

  let projectData:any;
  if(symbol) {
    projectData = await projectCollection.findOne({ symbol: symbol?.toUpperCase() });
    if(!projectData) {
      projectData = await projectCollection.findOne({ symbol: symbol });
      if (!projectData) {
        return NextResponse.json(null, {
          status: 200,
        });
      }
    }
  } else {
    projectData = await projectCollection.findOne({ key: address });
  }





  const projectCoinCollection = db.collection("mmosh-app-project-coins");
  const coins = await projectCoinCollection.find({ projectkey: projectData.key }).toArray();

  const updated_date = new Date();
  const communityCoinAccount = await projectCoinCollection.findOne({
    projectkey: projectData.key,
    updated_date: {$lt: updated_date},
  });

  const projectCommunityCollection = db.collection(
    "mmosh-app-project-community",
  );
  const community = await projectCommunityCollection
    .find({ projectkey: projectData.key })
    .toArray();

  const projectProfileCollection = db.collection("mmosh-app-project-profiles");
  const profiles = await projectProfileCollection
    .find({ projectkey: projectData.key })
    .toArray();

  const projectTokenomicsCollection = db.collection(
    "mmosh-app-project-tokenomics",
  );
  const tokenomics = await projectTokenomicsCollection
    .find({ projectkey: projectData.key })
    .toArray();

  const passCollection = db.collection("mmosh-app-project-pass");
  const passes = await passCollection.find({ projectkey: projectData.key }).toArray();

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
