import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import accommodationsRouter from "./api/accommodations/index.js";
import usersRouter from "./api/users/index.js";
import {
  badRequestHandler,
  notFoundHandler,
  forbiddenErrorHandler,
  genericErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 3001;

// ******************************* MIDDLEWARES ****************************************
server.use(cors());
server.use(express.json());

// ******************************** ENDPOINTS *****************************************
server.use("/accommodations", accommodationsRouter);
server.use("/users", usersRouter);

// ***************************** ERROR HANDLERS ***************************************
server.use(badRequestHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
