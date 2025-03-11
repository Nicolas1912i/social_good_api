import {Contact} from "../../../domain/entities/contact";

export interface ContactDataSource {
    createCollection(contact: Contact[]): Promise<boolean>;
    getAll(): Promise<Contact[]>;
}
