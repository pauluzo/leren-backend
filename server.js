const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// configure the .env values
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log("MongoDB connection established successfully");
});

app.listen(port, () => {
  console.log(`Sever is running on port: ${port}`);
});

