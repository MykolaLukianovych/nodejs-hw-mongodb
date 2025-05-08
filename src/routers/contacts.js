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
import { authenticate } from '../middlewars/authenticate.js';
import upload from '../middlewars/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', controllerWrapper(getContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  controllerWrapper(getContactByIDController),
);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactAddSchema),
  controllerWrapper(addContactController),
);

contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
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
