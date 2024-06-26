import http from "http";
import dbConnect from "../src/app/config/dbConnect/db.connect";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const server = http.createServer(app);

const port: string | number = process.env.PORT || 5000;
const main = async () => {
  try {
    await dbConnect();
    server.listen(port, async () => {
      console.log(`Db Running  ${port}`);
    });
  } catch (e) {
    console.log("Database Error");
    console.log(e);
  }
};

main();

process.on("unhandledRejection", () => {
  console.log(`😢😢😢😢😢😢😢😢😢😢 unhandledRejection   ... shutdown now`);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", () => {
  console.log(`😢😢😢😢😢😢😢😢😢😢 UncaughtException ... shutdown now`);
  process.exit(1);
});
