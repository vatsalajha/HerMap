import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://vj193:Rutgers%402025@hackhers.lwqyd.mongodb.net/?retryWrites=true&w=majority&appName=Hackhers";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    
    const { washroomId, floorLevel, status } = req.body;
    const database = client.db("HerMap");
    const collection = database.collection("HerMaps_Reports");

    // Update operation
    const result = await collection.updateOne(
      { 
        Id: parseInt(washroomId), // Match MongoDB's 'Id' field
        "floor.level": floorLevel // Match MongoDB's 'floor' array
      },
      { 
        $set: {
          "floor.$.status.pass": status.pads,
          "floor.$.status.response": status.tampons,
          "floor.$.status.waterFilter": status.waterFilter,
          "floor.$.status.lastUpdated": new Date().toLocaleString()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "No documents modified" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
}