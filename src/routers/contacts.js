import { Router } from 'express';
import {
  addContactController,
  deleteContactController,
  getContactByIDController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../middlewars/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/', controllerWrapper(getContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  controllerWrapper(getContactByIDController),
);

contactsRouter.post(
  '/',
  validateBody(contactAddSchema),
  controllerWrapper(addContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  controllerWrapper(patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  controllerWrapper(deleteContactController),
);

export default contactsRouter;
