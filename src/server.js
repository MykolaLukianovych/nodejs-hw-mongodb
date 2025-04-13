import express from "express";
import cors from "cors";
import { getEnvVar } from "./utils/getEnvVar.js";
import { logger } from "./middlewars/logger.js";
import { notFoundHandler } from "./middlewars/notFoundHandler.js";
import { errorHandler } from "./middlewars/errorHandler.js";
import contactsRouter from "./routers/contacts.js";

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(logger);

    app.use("/contacts", contactsRouter);

    app.use("/contacts/:contactId", contactsRouter);

    app.use(notFoundHandler);

    app.use(errorHandler);

    const port = Number(getEnvVar("PORT", 3000));
    app.listen(port, () => console.log(`Server is running on port ${port}`));
};