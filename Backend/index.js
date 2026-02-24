import dotenv from "dotenv";
import { app } from "./src/app.js";
import connectDB from "./src/config/db.js";
import { createDefaultAdmin } from "./src/utils/createAdmin.js";


dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    createDefaultAdmin();
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
      
    });
  })
  .catch((error) => {
    console.error("MONGO db connection failed !!!", error);
  });
