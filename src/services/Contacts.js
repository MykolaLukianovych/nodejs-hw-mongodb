import contactModel from '../db/models/Contact.js';

export const getContacts = () => contactModel.find();

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
