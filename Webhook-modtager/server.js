const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Brug port 3001 (eller process.env.PORT hvis sat)
const PORT = process.env.PORT || 3001;

app.post('/webhook', async (req, res) => {
  console.log('--- Modtaget webhook request ---');
  console.log('Full payload:', JSON.stringify(req.body, null, 2));
  
  const { VariantChanges } = req.body;
  if (Array.isArray(VariantChanges) && VariantChanges.length > 0) {
    const { Id, UpdatedAttributes } = VariantChanges[0];
    console.log(`Webhook-modtager: Variant ID = ${Id}, Updated Attributes = ${UpdatedAttributes}`);
    
    if (UpdatedAttributes.includes('Materials')) {
      try {
        console.log('Triggerer UpdateMaterials-service...');
        // Kald UpdateMaterials-servicen via den interne DNS og port 3001
        const response = await axios.post('http://resilient-serenity.railway.internal:3001/update-materials', {
          Id,
          attributeValue: UpdatedAttributes
        });
        console.log('UpdateMaterials-service svar:', response.data);
      } catch (error) {
        console.error('Fejl ved kald til UpdateMaterials-service:', error.response ? error.response.data : error.message);
      }
    } else {
      console.log('Ingen "Materials" opdatering fundet - ingen ekstern kald udført.');
    }
  } else {
    console.log('Ingen VariantChanges fundet i payload.');
  }
  
  res.status(200).send('Webhook behandlet');
});

app.listen(PORT, '::', () => {
  console.log(`Webhook-modtager kører på [::]:${PORT}`);
});
