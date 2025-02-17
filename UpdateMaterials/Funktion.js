const express = require('express');
const app = express();

app.use(express.json());

// Brug port 3001 (eller process.env.PORT hvis sat)
const PORT = process.env.PORT || 3001;

app.post('/update-materials', (req, res) => {
  console.log('--- UpdateMaterials-service modtog en request ---');
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  const { Id, attributeValue } = req.body;
  console.log(`UpdateMaterials-service: Modtog ID = ${Id}, attributeValue = ${attributeValue}`);
  
  res.send('UpdateMaterials-service har behandlet anmodningen');
});

app.listen(PORT, '::', () => {
  console.log(`UpdateMaterials-service kører på [::]:${PORT}`);
});
