import { Router } from 'express';
import {
  addContactController,
  deleteContactController,
  getContactByIDController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { controllerWrapper } from '../utils/controllerWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', controllerWrapper(getContactsController));

contactsRouter.get('/:contactId', controllerWrapper(getContactByIDController));

contactsRouter.post('/', controllerWrapper(addContactController));

contactsRouter.patch('/:contactId', controllerWrapper(patchContactController));

contactsRouter.delete(
  '/:contactId',
  controllerWrapper(deleteContactController),
);

export default contactsRouter;
