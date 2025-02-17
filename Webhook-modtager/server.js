// Webhook-modtager/server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Eksempel på webhook endpoint
app.post('/webhook', async (req, res) => {
  const { VariantChanges } = req.body;
  if (Array.isArray(VariantChanges) && VariantChanges.length > 0) {
    const { Id, UpdatedAttributes } = VariantChanges[0];
    console.log(`Webhook-modtager: ID=${Id}, attributter=${UpdatedAttributes}`);
    
    // Tjek om "Materials" er opdateret
    if (UpdatedAttributes.includes('Materials')) {
      try {
        // Her kalder vi UpdateMaterials-servicen via private networking
        // Eksempel: http://<SERVICE_NAME>.railway.internal:<PORT>/update-materials
        // Brug den interne DNS du ser i Railway: "resilient-serenity.railway.internal" og den port servicen lytter på.
        const serviceHostname = 'resilient-serenity.railway.internal';
        const servicePort = '3001'; // eller process.env.UPDATE_MATERIALS_PORT, hvis du har sat det dynamisk
        
        // Lav POST-anmodning
        await axios.post(`http://${serviceHostname}:${servicePort}/update-materials`, {
          Id,
          attributeValue: UpdatedAttributes
        });
        
        console.log('UpdateMaterials-service kaldt via Private Networking.');
      } catch (error) {
        console.error('Fejl ved kald til UpdateMaterials-service:', error.message);
      }
    }
  }
  res.status(200).send('OK');
});

// Lyt på IPv6
const PORT = process.env.PORT || 3000;
app.listen(PORT, '::', () => {
  console.log(`Webhook-modtager kører på [::]:${PORT}`);
});
