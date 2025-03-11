import {ContactRepository} from "../interfaces/repositories/contact-repository";
import {ContactDataSource} from "../../data/interfaces/data-sources/contact-data-source";
import {Contact} from "../entities/contact";

export class ContactRepositoryImpl implements ContactRepository {
    contactDataSource: ContactDataSource;

    constructor(contactDataSource: ContactDataSource) {
        this.contactDataSource = contactDataSource;
    }

    async createContact(contact: Contact): Promise<boolean> {
        return await this.contactDataSource.create(contact);
    }

    async getContacts(): Promise<Contact[]> {
        return await this.contactDataSource.getAll();
    }
}