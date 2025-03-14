import {CreateContactsUseCase} from "../../interfaces/use-cases/contact/create-contact";
import {ContactRepository} from "../../interfaces/repositories/contact-repository";
import {CreateImportJSONActivityRequestImportDataInner} from "ctct-api-client";

export class CreateContact implements CreateContactsUseCase {
    contactRepository: ContactRepository;

    constructor(contactRepository: ContactRepository) {
        this.contactRepository = contactRepository;
    }

    async execute(contacts: Array<CreateImportJSONActivityRequestImportDataInner>, accessToken: string): Promise<string> {
        return await this.contactRepository.createCollection(contacts, accessToken);
    }
}
