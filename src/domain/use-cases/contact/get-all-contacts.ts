import {GetAllContactsUseCase} from "../../interfaces/use-cases/contact/get-all-contacts";
import {ContactRepository} from "../../interfaces/repositories/contact-repository";
import {GetContactById200Response} from "ctct-api-client";

export class GetAllContacts implements GetAllContactsUseCase {
    contactRepository: ContactRepository;

    constructor(contactRepository: ContactRepository) {
        this.contactRepository = contactRepository;
    }

    async execute(accessToken: string): Promise<GetContactById200Response[]> {
        return await this.contactRepository.getContacts(accessToken);
    }
}