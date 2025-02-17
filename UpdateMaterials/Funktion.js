const express = require('express');
const app = express();

app.use(express.json());

// Endpoint til at modtage "Materials"-opdatering
app.post('/updateMaterials', (req, res) => {
  const { Id, UpdatedAttributes } = req.body;
  console.log(`UpdateMaterials-service modtog data: 
  - VariantId: ${Id} 
  - Attributter: ${UpdatedAttributes}`);

  // Her kan du lægge yderligere logik (databaseopdatering, API-kald osv.)

  res.status(200).send(`OK - Modtog ID=${Id} med attributter=${UpdatedAttributes}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Update Materials Service kører på port ${PORT}`);
});
