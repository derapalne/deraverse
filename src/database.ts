import mongoose from "mongoose";
import config from "./utils/config.js";

mongoose
    .connect(config.MONGO_DB_URL)
    .then((db) => console.log("Database connected"))
    .catch((err) => console.log(err));
