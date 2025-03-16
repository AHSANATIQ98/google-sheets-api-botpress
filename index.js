const express = require('express');
const { google } = require('googleapis');
const app = express();
const PORT = process.env.PORT || 3000;
const creds = require('./google-service-account.json');

app.use(express.json());

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheetId = '1JKft1hr-A6GIXD9G-T8PEySPTgbCJzSjjeUtebM5SlE';
const range = 'Sheet1!A2:C';

app.post('/add-meeting', async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[name, phone, email]],
      },
    });

    res.status(200).send({ message: 'Data added to Google Sheets ✅' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to add data' });
  }
});

app.get('/', (req, res) => {
  res.send('Google Sheets API is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
