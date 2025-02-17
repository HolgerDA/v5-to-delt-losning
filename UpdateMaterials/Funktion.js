const express = require('express');
const app = express();

app.use(express.json());

// Brug PORT fra miljøvariablen eller standardport 8080
const PORT = process.env.PORT || 8080;

app.post('/update-materials', (req, res) => {
  console.log('--- UpdateMaterials-service modtog en request ---');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  const { Id, attributeValue } = req.body;
  console.log(`UpdateMaterials-service: Modtog ID = ${Id}, attributeValue = ${attributeValue}`);
  
  res.send('UpdateMaterials-service har behandlet anmodningen');
});

app.listen(PORT, '::', () => {
  console.log(`UpdateMaterials-service kører på [::]:${PORT}`);
});
