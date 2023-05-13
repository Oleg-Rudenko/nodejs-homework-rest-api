const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");
const Joi = require("joi");
require("colors");

const contactsPath = path.join(__dirname, "contacts.json");

const contactSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(contacts);
  } catch (error) {
    console.log(`Error: ${error.message}`.red);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return contacts.filter(({ id }) => id === contactId);
  } catch (error) {
    console.log(`Error: ${error.message}`.red);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contactToRemove = contacts.find(({ id }) => id === contactId);
    if (!contactToRemove) {
      return null;
    }
    const newContacts = contacts.filter(({ id }) => id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2), {
      encoding: "utf-8",
    });

    return newContacts;
  } catch (error) {
    console.log(`Error: ${error.message}`.red);
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = await contactSchema.validateAsync(body);
    const contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    const updatedContacts = [newContact, ...contacts];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2), {
      encoding: "utf-8",
    });
    return newContact;
  } catch (error) {
    console.log(`Error: ${error.message}`.red);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = await contactSchema.validateAsync(body);
    const contacts = await listContacts();
    const contactToUpdate = contacts.find(
      (contact) => contact.id === contactId
    );
    if (!contactToUpdate) {
      return null;
    }
    const otherContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    const updatedContact = {
      ...contactToUpdate,
      name,
      email,
      phone,
    };
    const contactsToSave = [...otherContacts, updatedContact];
    await fs.writeFile(contactsPath, JSON.stringify(contactsToSave, null, 2), {
      encoding: "utf-8",
    });
    return updatedContact;
  } catch (error) {
    console.log(`Error: ${error.message}`.red);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
