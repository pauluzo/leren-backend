const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');

// configure the .env values
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());

const uri = process.env.DB;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log("MongoDB connection established successfully");
});

const userRouter = require("./routes/users");

app.use('/users', userRouter);

app.listen(port || 3000, () => {
  console.log(`Server is running on port: ${port}`);
});

