import {GetAllContactsUseCase} from "../../interfaces/use-cases/contact/get-all-contacts";
import {ContactRepository} from "../../interfaces/repositories/contact-repository";
import {Contact} from "../../entities/contact";

export class GetAllContacts implements GetAllContactsUseCase {
    contactRepository: ContactRepository;

    constructor(contactRepository: ContactRepository) {
        this.contactRepository = contactRepository;
    }

    async execute(): Promise<Contact[]> {
        return await this.contactRepository.getContacts();
    }
}