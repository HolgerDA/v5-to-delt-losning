// updateMaterials.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/update-materials', (req, res) => {
  const { Id, attributeValue } = req.body;
  console.log(`Update Materials modtaget - Internal ID: ${Id}, Attribute Value: ${attributeValue}`);
  res.send('Update Materials er kørt');
});

// Vælg en anden port end Webhook-modtageren (fx 3001)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Update Materials-service kører på port ${PORT}`);
});
