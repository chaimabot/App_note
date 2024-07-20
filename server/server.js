// server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();

app.use(express.json()); // Assurez-vous que cette ligne est présente
app.use(cors());
app.use(morgan("tiny"));

const port = 8000;

app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

app.use("/api", router);

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Invalid database connection:", error);
  });
