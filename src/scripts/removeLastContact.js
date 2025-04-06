import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";


export const removeLastContact = async () => { 
    const contactList = await readContacts();
    contactList.pop();
    await writeContacts(contactList);
};

removeLastContact();
