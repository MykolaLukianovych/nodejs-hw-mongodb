import contactModel from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { sortList } from '../constants/index.js';

export const getContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = '_contactId',
  sortOrder = sortList[0],
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactModel.find({ userId });

  if (userId) {
    contactsQuery.where('userId').equals(userId);
  }

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const totalItems = await contactModel.countDocuments(
    contactsQuery.getFilter(),
  );

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactByID = async (contactId, userId) => {
  const contact = await contactModel.findOne({
    _id: contactId,
    userId: userId,
  });
  return contact;
};

export const addContact = (payload) => contactModel.create(payload);

export const updateContact = async (
  contactIdAndUserId,
  payload,
  optoins = {},
) => {
  const updatedContact = await contactModel.findOneAndUpdate(
    contactIdAndUserId,
    payload,
    {
      new: true,
      runValidators: true,
      includeResultMetadata: true,
    },
  );

  if (!updatedContact || !updatedContact.value) return null;

  return {
    data: updatedContact,
  };
};

export const deleteContact = async (contactId, userId) =>
  contactModel.findOneAndDelete({ _id: contactId, userId });
