import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://vj193:Rutgers%402025@hackhers.lwqyd.mongodb.net/?retryWrites=true&w=majority&appName=Hackhers";

export default async function handler(req, res) {
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db("HerMap");
    const collection = database.collection("HerMaps_Reports");

    const docs = await collection.find({}).toArray();

    // Transform data to match frontend structure
    const transformed = docs.map(doc => ({
      id: doc.Id, // MongoDB uses 'Id' with uppercase I
      name: doc.name,
      location: doc.location,
      floors: doc.floor.map(f => ({ // MongoDB uses 'floor' array
        level: f.level,
        accessibility: f.accessibility,
        vendingMachine: f.sendingsharing, // Field name fix
        status: {
          pads: f.status.pass, // Map 'pass' to 'pads'
          tampons: f.status.response, // Map 'response' to 'tampons'
          lastUpdated: f.lastUpdated,
          waterFilter: f.waterFilter
        }
      }))
    }));

    res.status(200).json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
}