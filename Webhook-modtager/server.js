// Webhook-modtager/server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const { VariantChanges } = req.body;

  if (Array.isArray(VariantChanges) && VariantChanges.length > 0) {
    const { Id, UpdatedAttributes } = VariantChanges[0];
    console.log(`For varianten: ${Id}, er der sket en opdatering i attributten: ${UpdatedAttributes}`);

    if (UpdatedAttributes.includes('Materials')) {
      try {
        // Brug den private networking-sti til at kalde din UpdateMaterials-service
        // Hvis din UpdateMaterials-service kører på port 3001:
        const url = 'http://resilient-serenity.railway.internal:3001/funktion';
        await axios.post(url, { Id, attributeValue: UpdatedAttributes });
        console.log('UpdateMaterials-servicen er blevet kaldt via den private netværkssti.');
      } catch (error) {
        console.error('Fejl ved kald af UpdateMaterials-servicen:', error.response?.data || error.message);
      }
    }
  }

  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook-modtageren kører på port ${PORT}`);
});
