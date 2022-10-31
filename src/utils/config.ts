import "dotenv/config";

export default  {
    PORT: process.env.PORT || 4000,
    MONGO_DB_URL: process.env.MONGO_DB_URL || "mongodb://localhost/deraverse"
}