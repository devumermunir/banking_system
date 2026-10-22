require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");
const port = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error("Failed to connect to database:", error);
});
