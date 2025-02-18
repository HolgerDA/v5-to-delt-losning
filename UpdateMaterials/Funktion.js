const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Miljøvariabler og konstanter
const PORT = process.env.PORT || 8080;
const PIM_API_KEY = process.env.PIM_API_KEY;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_GRAPHQL_URL = 'https://umage-development-b2c.myshopify.com/admin/api/2023-01/graphql.json';
const META_NAMESPACE = 'custom';
const META_KEY = 'materials';

app.post('/update-materials', async (req, res) => {
  console.log('--- UpdateMaterials-service modtog en request ---');
  try {
    const { Id, attributeValue } = req.body;
    console.log(`Modtog ID = ${Id}, attributeValue = ${attributeValue}`);

    // Kør hovedprocessen
    const result = await main(Id, attributeValue);
    
    res.send('UpdateMaterials-service har behandlet anmodningen og opdateret Shopify');
  } catch (error) {
    console.error('Fejl i hovedprocessen:', error);
    res.status(500).send('Der opstod en fejl under behandlingen');
  }
});

/********************************************************
 * Hjælpefunktioner fra Kode 2
 ********************************************************/

function formatMaterialList(materialsArray) {
  if (materialsArray.length === 0) return '';
  if (materialsArray.length === 1) return materialsArray[0];
  if (materialsArray.length === 2) return materialsArray.join(' og ');

  const allButLast = materialsArray.slice(0, -1).join(', ');
  const last = materialsArray[materialsArray.length - 1];
  return `${allButLast} og ${last}`;
}

async function getVariantDataFromPIM(variantId, attributeValue) {
  const pimUrl = `https://api.umage.cloud16.structpim.com/variants/${variantId}/attributevalues`;

  try {
    const response = await axios.get(pimUrl, {
      headers: { Authorization: PIM_API_KEY }
    });

    const { Values } = response.data;
    console.log('Fuldt PIM-svar:', JSON.stringify(response.data, null, 2));

    // Hent ShopifyVariantID og materialer
    const shopifyVariantID = Values?.ShopifyVariantID;
    let enMaterials = [];

    if (Values[attributeValue]?.VariantMaterial) {
      Values[attributeValue].VariantMaterial.forEach(material => {
        const enEntry = material.Name.find(item => item.CultureCode === 'en-GB');
        if (enEntry?.Data) enMaterials.push(enEntry.Data);
      });
    }

    return {
      shopifyVariantID,
      formattedMaterials: formatMaterialList(enMaterials)
    };
  } catch (error) {
    console.error('PIM API fejl:', error.response?.data || error.message);
    throw new Error('Kunne ikke hente data fra PIM');
  }
}

async function updateVariantMetafield(shopifyVariantID, materialString) {
  try {
    const variantGID = `gid://shopify/ProductVariant/${shopifyVariantID}`;
    const mutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { id namespace key value type }
          userErrors { field message }
        }
      }
    `;

    const variables = {
      metafields: [{
        ownerId: variantGID,
        namespace: META_NAMESPACE,
        key: META_KEY,
        type: 'single_line_text_field',
        value: materialString
      }]
    };

    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({ query: mutation, variables })
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL fejl: ${JSON.stringify(data.errors)}`);
    }
    if (data.data.metafieldsSet.userErrors?.length > 0) {
      throw new Error(`Metafield fejl: ${JSON.stringify(data.data.metafieldsSet.userErrors)}`);
    }

    console.log('Metafield opdateret succesfuldt');
  } catch (error) {
    console.error('Shopify opdateringsfejl:', error.message);
    throw new Error('Kunne ikke opdatere Shopify');
  }
}

async function main(variantId, attributeValue) {
  try {
    // 1) Hent data fra PIM
    const { shopifyVariantID, formattedMaterials } = await getVariantDataFromPIM(variantId, attributeValue);
    
    if (!shopifyVariantID) {
      throw new Error('Manglende Shopify Variant ID');
    }

    // 2) Opdater Shopify
    await updateVariantMetafield(shopifyVariantID, formattedMaterials);
    console.log('Proces gennemført succesfuldt');
  } catch (error) {
    console.error('Fejl i hovedprocessen:', error.message);
    throw error;
  }
}

app.listen(PORT, '::', () => {
  console.log(`UpdateMaterials-service kører på [::]:${PORT}`);
});