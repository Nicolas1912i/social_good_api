import {Contact} from "../../entities/contact";

export interface ContactRepository {
    createCollection(contact: Contact[]): Promise<boolean>;
    getContacts(): Promise<Contact[]>;
}
