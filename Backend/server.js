require("dotenv").config(); // Load environment variables FIRST

const app = require('./src/App');
const connectDB = require("./src/config/mongoose-connection");

connectDB();

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
