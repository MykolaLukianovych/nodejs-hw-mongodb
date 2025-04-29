import contactModel from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { sortList } from '../constants/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_contactId',
  sortOrder = sortList[0],
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactModel.find();

  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const totalItems = await contactModel.find().countDocuments();

  const data = await contactModel
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    ...paginationData,
  };
};

export const getContactByID = (contactId) =>
  contactModel.findOne({ _id: contactId });

export const addContact = (payload) => contactModel.create(payload);

export const updateContact = async (_id, payload) => {
  const updatedContact = await contactModel.findOneAndUpdate({ _id }, payload, {
    new: true,
    runValidators: true,
    includeResultMetadata: true,
  });

  if (!updatedContact || !updatedContact.value) return null;

  return {
    data: updatedContact,
  };
};

export const deleteContact = (contactId) =>
  contactModel.findOneAndDelete({ _id: contactId });
