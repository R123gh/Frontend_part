const connectDB = require("./config/db");
const createApp = require("./createApp");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
