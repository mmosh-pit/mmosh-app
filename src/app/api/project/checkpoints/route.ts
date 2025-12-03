import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import axios from "axios";

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.DATABASE_NAME;

interface CheckpointAttribute {
  label: string;
  type: string;
  required: boolean;
  instructions: string;
  value?: any;
  collected?: boolean;
}

interface CheckpointData {
  name: string;
  tag: string;
  description: string;
  additionalInstructions: string;
  attributes: CheckpointAttribute[];
  prerequisites?: string[];
}

// GET - Load checkpoints for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get("project");
    const botId = searchParams.get("bot_id") || "default_bot";

    if (!projectKey) {
      return NextResponse.json({ error: "Project key required" }, { status: 400 });
    }

    // Authenticate user
    const authorization = request.headers.get("authorization");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/is-auth`,
      {
        headers: {
          Authorization: authorization ?? "",
        },
      },
    );

    const authData = await response.json();
    if (!authData?.data?.is_auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.data.user.ID;

    const client = new MongoClient(MONGO_URI!);
    await client.connect();
    const db = client.db(MONGO_DB_NAME);

    const checkpoints = await db.collection("checkpoints")
      .find({
        bot_id: botId
      })
      .sort({ execution_order: 1, created_at: 1 })
      .toArray();

    await client.close();

    // Transform MongoDB format to component format
    const transformedCheckpoints = checkpoints.map((cp: any) => ({
      id: cp._id.toString(),
      name: cp.checkpoint_name,
      tag: cp.tag,
      description: cp.description,
      additionalInstructions: cp.additional_instructions,
      attributes: cp.attributes.map((attr: any) => ({
        id: attr._id?.toString() || new ObjectId().toString(),
        label: attr.label,
        type: attr.type,
        required: attr.required,
        instructions: attr.instructions
      })),
      prerequisites: cp.prerequisites || [],
      completed: cp.completed || false,
      executionOrder: cp.execution_order || 1
    }));

    return NextResponse.json({ checkpoints: transformedCheckpoints });
  } catch (error) {
    console.error("Error loading checkpoints:", error);
    return NextResponse.json({ error: "Failed to load checkpoints" }, { status: 500 });
  }
}

// POST - Create new checkpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project, checkpoint, bot_id = "default_bot" } = body;

    if (!project || !checkpoint) {
      return NextResponse.json({ error: "Project and checkpoint data required" }, { status: 400 });
    }

    // Authenticate user
    const authorization = request.headers.get("authorization");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/is-auth`,
      {
        headers: {
          Authorization: authorization ?? "",
        },
      },
    );

    const authData = await response.json();

    if (!authData?.data?.is_auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.data.user.ID;

    const client = new MongoClient(MONGO_URI!);
    await client.connect();
    const db = client.db(MONGO_DB_NAME);

    // Get the next execution order
    const lastCheckpoint = await db.collection("checkpoints")
      .findOne(
        { bot_id },
        { sort: { execution_order: -1 } }
      );

    const executionOrder = (lastCheckpoint?.execution_order || 0) + 1;

    const checkpointDoc = {
      _id: new ObjectId(),
      bot_id,
      checkpoint_name: checkpoint.name,
      tag: checkpoint.tag,
      description: checkpoint.description,
      additional_instructions: checkpoint.additionalInstructions,
      attributes: checkpoint.attributes.map((attr: any) => ({
        _id: new ObjectId(),
        label: attr.label,
        type: attr.type,
        required: attr.required,
        instructions: attr.instructions,
        value: null,
        collected: false
      })),
      prerequisites: checkpoint.prerequisites || [],
      completed: false,
      execution_order: executionOrder,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await db.collection("checkpoints").insertOne(checkpointDoc);
    await client.close();

    if (result.insertedId) {
      await updateGoalsChanged(userId, bot_id, authorization || "");
      return NextResponse.json({
        success: true,
        checkpointId: result.insertedId.toString(),
        checkpoint: {
          id: result.insertedId.toString(),
          name: checkpoint.name,
          tag: checkpoint.tag,
          description: checkpoint.description,
          additionalInstructions: checkpoint.additionalInstructions,
          attributes: checkpoint.attributes,
          prerequisites: checkpoint.prerequisites || [],
          completed: false,
          executionOrder
        }
      });
    } else {
      return NextResponse.json({ error: "Failed to create checkpoint" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating checkpoint:", error);
    return NextResponse.json({ error: "Failed to create checkpoint" }, { status: 500 });
  }
}

const updateGoalsChanged = async (userId: string, agentId: string, authorization: string) => {
  const url = process.env.NEXT_PUBLIC_REACT_AGENT_URL + "/internal/goals-changed";

  const params = {
    user_id: userId,
    agent_id: agentId
  };

  const headers = {
    "Content-Type": "application/json",
    "Authorization": authorization
  };

  try {
    await axios.post(url, params, { headers });
  } catch (error) { }
}

// PUT - Update existing checkpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, checkpoint, bot_id = "default_bot" } = body;

    if (!id || !checkpoint) {
      return NextResponse.json({ error: "Checkpoint ID and data required" }, { status: 400 });
    }

    // Authenticate user
    const authorization = request.headers.get("authorization");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/is-auth`,
      {
        headers: {
          Authorization: authorization ?? "",
        },
      },
    );

    const authData = await response.json();
    if (!authData?.data?.is_auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.data.user.ID;

    const client = new MongoClient(MONGO_URI!);
    await client.connect();
    const db = client.db(MONGO_DB_NAME);

    const updateDoc = {
      checkpoint_name: checkpoint.name,
      tag: checkpoint.tag,
      description: checkpoint.description,
      additional_instructions: checkpoint.additionalInstructions,
      attributes: checkpoint.attributes.map((attr: any) => ({
        _id: new ObjectId(), // Always generate new ObjectId for attributes
        label: attr.label,
        type: attr.type,
        required: attr.required,
        instructions: attr.instructions,
        value: null,
        collected: false
      })),
      prerequisites: checkpoint.prerequisites || [],
      updated_at: new Date()
    };

    const result = await db.collection("checkpoints").updateOne(
      {
        _id: new ObjectId(id),
        bot_id
      },
      { $set: updateDoc }
    );

    await client.close();

    if (result.matchedCount > 0) {
      return NextResponse.json({
        success: true,
        checkpoint: {
          id,
          name: checkpoint.name,
          tag: checkpoint.tag,
          description: checkpoint.description,
          additionalInstructions: checkpoint.additionalInstructions,
          attributes: checkpoint.attributes,
          prerequisites: checkpoint.prerequisites || []
        }
      });
    } else {
      return NextResponse.json({ error: "Checkpoint not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating checkpoint:", error);
    return NextResponse.json({ error: "Failed to update checkpoint" }, { status: 500 });
  }
}

// DELETE - Delete checkpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const botId = searchParams.get("bot_id") || "default_bot";

    if (!id) {
      return NextResponse.json({ error: "Checkpoint ID required" }, { status: 400 });
    }

    // Authenticate user
    const authorization = request.headers.get("authorization");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/is-auth`,
      {
        headers: {
          Authorization: authorization ?? "",
        },
      },
    );

    const authData = await response.json();
    if (!authData?.data?.is_auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.data.user.ID;

    const client = new MongoClient(MONGO_URI!);
    await client.connect();
    const db = client.db(MONGO_DB_NAME);

    const result = await db.collection("checkpoints").deleteOne({
      _id: new ObjectId(id),
      bot_id: botId
    });

    await client.close();

    if (result.deletedCount > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Checkpoint not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting checkpoint:", error);
    return NextResponse.json({ error: "Failed to delete checkpoint" }, { status: 500 });
  }
}