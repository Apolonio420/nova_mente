const { MongoClient } = require('mongodb');

async function searchDesigns(query) {
  // Reemplaza con tu URI de MongoDB
  const uri = "mongodb+srv://codeduostudios:YKCbGRPp3fIaPCuD@novamente.pibypbv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Reemplaza "yourDatabaseName" y "yourCollectionName" con los nombres de tu base de datos y colección
    const collection = client.db("myFirstDatabase").collection("images");
    
    const cursor = collection.find({ $text: { $search: query } });
    const results = await cursor.toArray();

    // Suponiendo que 'imagePath' es el campo donde guardas la ruta de la imagen
    return results.map(result => result.imagePath); 
  } finally {
    await client.close();
  }
}

module.exports = searchDesigns;
