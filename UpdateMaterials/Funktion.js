// funktion.js
const express = require('express');
const app = express();

app.use(express.json());

// Endpoints
app.post('/update-materials', (req, res) => {
  const { Id, attributeValue } = req.body;
  console.log(`UpdateMaterials-service: modtog ID=${Id}, attributeValue=${attributeValue}`);
  return res.status(200).send('Update Materials OK');
});

// Lyt på IPv6 (bind til "::") og brug den port, som Railway sætter i process.env.PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, '::', () => {
  console.log(`UpdateMaterials-service kører på [::]:${PORT}`);
});
