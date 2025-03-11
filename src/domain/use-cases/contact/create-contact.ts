import {CreateContactsUseCase} from "../../interfaces/use-cases/contact/create-contact";
import {ContactRepository} from "../../interfaces/repositories/contact-repository";
import {Contact} from "../../entities/contact";

export class CreateContact implements CreateContactsUseCase {
    contactRepository: ContactRepository;

    constructor(contactRepository: ContactRepository) {
        this.contactRepository = contactRepository;
    }

    async execute(contacts: Contact[]): Promise<boolean> {
        return await this.contactRepository.createCollection(contacts);
    }
}
