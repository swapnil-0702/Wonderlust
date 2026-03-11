const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const modifiedData = initData.map((obj) => ({
    ...obj,
    owner: "695e2a4e6d5457f98f2c0dc6"
  }));

  await Listing.insertMany(modifiedData);
  console.log("Data was initialized successfully!");
};


initDB();

