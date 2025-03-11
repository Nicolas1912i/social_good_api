import { Contact } from "../../../domain/entities/contact";

export interface DataWrapper {
    getAll(): Promise<Contact[]>;
    createCollection(contacts: Contact[]): Promise<boolean>;
}
