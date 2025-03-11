import { Contact } from "../../../domain/entities/contact";
import { ContactDataSource } from "../../interfaces/data-sources/contact-data-source";

export class ConstantContactDataSource implements ContactDataSource {

    createCollection(contact: Contact[]): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getAll(): Promise<Contact[]> {
        throw new Error("Method not implemented.");
    }
}
