const { MongoClient } = require('mongodb');

async function listIndexes() {
  const uri = "mongodb+srv://codeduostudios:YKCbGRPp3fIaPCuD@novamente.pibypbv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; // Reemplaza con tu URI de MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client.db("myFirstDatabase").collection("images"); // Reemplaza con los nombres de tu base de datos y colección
    const indexes = await collection.indexes();
    console.log("Índices:", indexes);
  } finally {
    await client.close();
  }
}

listIndexes().catch(console.error);
