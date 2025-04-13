import createHttpError from "http-errors";
import { getContacts, getContactByID } from "../services/Contacts.js";

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
