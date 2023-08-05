const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
const csvParser = require('csv-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/calculate-total', (req, res) => {
  const filePath = `../Vaidik_PV_dir/${req.body.file}`;
  let sum = 0;

  if (!req.body.file) {
    return res.json({ file: null, error: 'Invalid JSON input.' });
  }
  try {
    if (fs.existsSync(filePath)) {

      if (isCSV(filePath)) {
        const stream = fs.createReadStream(filePath)
          .pipe(csvParser());

        stream.on('data', (row) => {
          if (row.product === req.body.product) {
            sum += parseInt(row.amount);
          }
        });

        stream.on('end', () => {
          return res.json({
            file: req.body.file,
            sum: sum.toString(),
          });
        });

        stream.on('error', (error) => {
          console.error(error);
          return res.json({
            file: req.body.file,
            error: 'Input file not in CSV format.',
          });
        });
      } else {
        return res.json({
          file: req.body.file,
          error: 'Input file not in CSV format.',
        });
      }
    } else {
      
      res.json({
        file: req.body.file,
        error: 'File not found.',
      });
    }
  } catch (err) {
    res.json({
      file: req.body.file,
      error: 'Input file not in CSV format.',
    });
  }


});

function isCSV(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const rows = fileContent.trim().split('\n');
    

    if (rows.length === 0) {
      return false;
    }

    const headerRow = rows[0].split(',');
    if (headerRow.length !== 2) {
      return false;
    }

    const totalcol = rows[0].split(',').length;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
      if (row.length !== totalcol) {
        return false;
      }
      // if (isNaN(parseInt(row[1]))) {
      //   return false;
      // }
    }
    return true;

  } catch (error) {
    return false;
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

