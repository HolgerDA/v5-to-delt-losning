// Webhook-modtager/server.js
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Brug Railway's interne adresse til at kalde Update Materials-servicen.
// Her antages det, at Update Materials servicen lytter på port 3000.
const UPDATE_MATERIALS_SERVICE_URL = process.env.UPDATE_MATERIALS_SERVICE_URL || 'http://v4-to-delt-losning.railway.internal:3000';

app.post('/webhook', async (req, res) => {
  console.log('Fuld payload modtaget:', JSON.stringify(req.body, null, 2));

  const { VariantChanges } = req.body;
  if (Array.isArray(VariantChanges) && VariantChanges.length > 0) {
    const { Id, UpdatedAttributes } = VariantChanges[0];
    console.log(`For varianten: ${Id}, er der sket en opdatering i attributten: ${UpdatedAttributes}`);

    if (UpdatedAttributes.includes('Materials')) {
      try {
        // Sender data til Update Materials-servicen via den interne adresse
        const response = await axios.post(
          `${UPDATE_MATERIALS_SERVICE_URL}/updateMaterials`,
          { Id, UpdatedAttributes }
        );
        console.log('Response fra Update Materials service:', response.data);
      } catch (error) {
        console.error('Fejl ved kald til Update Materials service:', error.message);
      }
    }
  }

  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook-modtager kører på port ${PORT}`);
});
