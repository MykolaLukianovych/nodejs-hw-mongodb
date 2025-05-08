import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parceSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import {
  getContacts,
  getContactByID,
  addContact,
  updateContact,
  deleteContact,
} from '../services/Contacts.js';
import { contactSortFields } from '../db/models/Contact.js';

export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, contactSortFields);
  const userId = req.user._id;
  const filter = parseFilterParams(req.query);
  const contacts = await getContacts({
    userId,
    ...paginationParams,
    ...sortParams,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

export const getContactByIDController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactByID(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw createHttpError(400, 'User is not authenticated');
  }

  const photo = req.file?.path || '';

  const contact = await addContact({ ...req.body, userId, photo });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw createHttpError(400, 'User is not authenticated');
  }

  const { contactId } = req.params;
  const contactIdAndUserId = { userId, _id: contactId };

  const photo = req.file?.path;
  const updateData = photo ? { ...req.body, photo } : req.body;

  const result = await updateContact(contactIdAndUserId, updateData);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data.value,
  });
};

export const deleteContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
