import createHttpError from "http-errors";
import { getContacts, getContactByID, addContact, updateContact, deleteContact} from "../services/Contacts.js";

export const getContactsController = async (req, res) => {

    const data = await getContacts();
    res.json({
        status: 200,
        message: "Successfully found contacts",
        data,
    });
};


export const getContactByIDController = async (req, res) => {
    
     const { contactId } = req.params;

    const data = await getContactByID(contactId);

    if (!data) {
      throw createHttpError(404, "Contact not found");
    };

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}`,
        data,
    });   
};

export const addContactController = async (req, res) => {
    const data = await addContact(req.body);
    
    res.status(201).json({
		status: 201,
		message: "Successfully created a contact!",
		data,
    });
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) {
          throw createHttpError(404, "Contact not found");
    };

    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result.data.value,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const data = await deleteContact(contactId);

    if (!data) {
      throw createHttpError(404, "Contact not found");
    };

    res.status(204).send();
};