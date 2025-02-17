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

    // Hvis "Materials" er en af de opdaterede attributter, kaldes Update Materials servicen:
    if (UpdatedAttributes.includes('Materials')) {
      try {
        // Send en POST-anmodning til Update Materials-service (brug den lokale sti)
        await axios.post('https://resilient-serenity.up.railway.app/update-materials', {
          Id,
          attributeValue: UpdatedAttributes
        });
        
        console.log('Update Materials-servicen er blevet kaldt.');
      } catch (error) {
        console.error('Fejl ved kald af Update Materials-servicen:', error);
      }
    }
  }

  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook-modtageren kører på port ${PORT}`);
});
