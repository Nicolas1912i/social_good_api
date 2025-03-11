import {ContactRepository} from "../interfaces/repositories/contact-repository";
import {ContactDataSource} from "../../data/interfaces/data-sources/contact-data-source";
import {Contact} from "../entities/contact";

export class ContactRepositoryImpl implements ContactRepository {
    contactDataSource: ContactDataSource;

    constructor(contactDataSource: ContactDataSource) {
        this.contactDataSource = contactDataSource;
    }

    async createCollection(contacts: Contact[]): Promise<boolean> {
        return await this.contactDataSource.createCollection(contacts);
    }

    async getContacts(): Promise<Contact[]> {
        return await this.contactDataSource.getAll();
    }
}
