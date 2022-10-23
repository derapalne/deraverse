import mongoose from "mongoose";

mongoose
    .connect("mongodb://localhost/restJwt")
    .then((db) => console.log("Database connected"))
    .catch((err) => console.log(err));
