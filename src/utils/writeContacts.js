import fs from "node:fs/promises";
import { PATH_DB } from '../constants/contacts.js';

export const writeContacts = updatedContacts => fs.writeFile(PATH_DB, JSON.stringify(updatedContacts, null, 2));
