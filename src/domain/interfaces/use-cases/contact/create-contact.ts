import {Contact} from "../../../entities/contact";

export interface CreateContactsUseCase {
    execute(contact: Contact[]): Promise<boolean>;
}
