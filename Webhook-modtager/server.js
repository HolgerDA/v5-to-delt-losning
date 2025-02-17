const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Brug PORT fra miljøvariablen eller standardport 8080
const PORT = process.env.PORT || 8080;

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
        // Da UpdateMaterials-servicen kører på port 8080 ifølge logs, benyt denne port
        const updateMaterialsPort = 8080;
        const updateMaterialsUrl = `http://resilient-serenity.railway.internal:${updateMaterialsPort}/update-materials`;
        console.log(`Kald til UpdateMaterials-service: ${updateMaterialsUrl}`);
        
        const response = await axios.post(updateMaterialsUrl, {
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
