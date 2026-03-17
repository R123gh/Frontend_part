const createApp = require("../project-backend/createApp");
const connectDB = require("../project-backend/config/db");

let appPromise;

module.exports = async (req, res) => {
  try {
    if (!appPromise) {
      appPromise = (async () => {
        await connectDB();
        return createApp();
      })();
    }

    const app = await appPromise;
    return app(req, res);
  } catch (error) {
    console.error("API initialization failed:", error.message);
    res.status(500).json({ msg: "API initialization failed." });
  }
};
