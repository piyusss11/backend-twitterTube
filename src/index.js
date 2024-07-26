import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`server is running at port :${port}`);
    });
  })
  .catch((err) => console.log(`mongo db connection failed - ${err.message}`));

/*
import express from "express";
const app = express(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("err:" + error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`app is listening on ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
})();
*/
