import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
// npm install mongodb
// npm install @types/mongodb --save-dev

const uri = "mongodb://localfirst:MqtBvsKOWybMCrra@localfirstcluster-shard-00-02.udxax.mongodb.net/localfirst?ssl=true&authSource=admin";

// Create a global variable to hold the MongoDB client
let client: MongoClient;

// Function to initialize the client
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      socketTimeoutMS: 30000,
    });
    await client.connect();
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await client.db("admin").command({ ping: 1 });
    return NextResponse.json("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}


// Handles PUT requests to add a customer
export async function PUT(request: NextRequest) {
  const body = await request.json();
  console.log("Received data: ", body);

  // Connect to the database
  await connectToDatabase();

  const { userId, note } = body;

  const userObjectId = new ObjectId(userId);

  // Perform the update operation (only update the note field)
  const updateResult = await client
    .db("localfirst")
    .collection("users")
    .updateOne(
      { _id: userObjectId }, // Filter: find the user by their ID
      { $set: { note } } // Update operation: only update the note
    );

  if (updateResult.modifiedCount === 0) {
    return NextResponse.json({ message: 'No user found or no changes made' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Customer updated successfully' });

}



