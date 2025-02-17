// UpdateMaterials/Funktion.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/funktion', (req, res) => {
  const { Id, attributeValue } = req.body;
  console.log(`Funktion modtaget - Internal ID: ${Id}, Attribute Value: ${attributeValue}`);
  res.send('Funktion er kørt');
});

// Her kører service på en port (f.eks. 3001)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`UpdateMaterials-service kører på port ${PORT}`);
});
