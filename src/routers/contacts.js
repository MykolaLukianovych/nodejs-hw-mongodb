import { Router } from "express";
import { getContactByIDController, getContactsController } from "../controllers/contacts.js";
import { controllerWrapper } from "../utils/controllerWrapper.js";


const contactsRouter = Router();

contactsRouter.get("/", controllerWrapper(getContactsController));

contactsRouter.get("/:contactId", controllerWrapper(getContactByIDController));

export default contactsRouter;