import contactModel from "../db/models/Contact.js";


export const getContacts = () => contactModel.find();

export const getContactByID = contactId => contactModel.findOne({_id: contactId});