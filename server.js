const express = require('express');
const app = express();

// Gør det muligt at læse JSON-body fra webhooks
app.use(express.json());

app.post('/webhook', (req, res) => {
  
  // Udpak webhook-indholdet (hvis det eksisterer)
  const { VariantChanges } = req.body;
  if (Array.isArray(VariantChanges) && VariantChanges.length > 0) {
    const { Id, UpdatedAttributes } = VariantChanges[0];
    console.log(`For varianten: ${Id}, er der sket en opdatering i attributten: ${UpdatedAttributes}`);
  }

  // Send svar tilbage
  res.status(200).send('OK');
});

// Brug PORT fra miljøvariabler eller standardport 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveren kører på port ${PORT}`);
});
