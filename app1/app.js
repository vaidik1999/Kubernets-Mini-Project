const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { default: axios } = require("axios");
const app = express();
const csvWriter = require("csv-writer").createArrayCsvWriter;

app.use(bodyParser.json());

const createJSON = (data) => {
  const rows = data.split('\n');
  const result = rows.map((row) => row.split(',').map((ele) => ele.trim()));
  return result;
};

app.post('/store-file', (req, res) => {
  const { file, data } = req.body;

  if (!file) {
    return res.json({ file: null, error: 'Invalid JSON input.' });
  }

  const filePath = `/Vaidik_PV_dir/${file}`;
  const writer = csvWriter({
    path: filePath,
  });

  writer.writeRecords(createJSON(data))
    .then(() => {
      console.log('CSV file generated successfully');
      res.json({ file, message: 'Success.' });
    })
    .catch((err) => {
      console.error('Error generating CSV file:', err);
      res.json({ file, error: 'Error while storing the file to the storage.' });
    });
});

app.post('/calculate', async (req, res) => {
  // const { file, product } = req.body;
  console.log('trying to call 2nd container');
  
  await axios
    .post('http://app2-service:3000/calculate-total', {
      file: req.body.file,
      product: req.body.product
    })
    .then(({ data }) => {
      console.log(data)
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

const PORT = 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

