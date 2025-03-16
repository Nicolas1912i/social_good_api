import { ContactRepository } from "../interfaces/repositories/contact-repository";
import { ContactDataSource } from "@data/interfaces/data-sources/contact-data-source";
import {
  CreateImportJSONActivityRequestImportDataInner,
  GetContactById200Response,
} from "ctct-api-client";

export class ContactRepositoryImpl implements ContactRepository {
  contactDataSource: ContactDataSource;

  constructor(contactDataSource: ContactDataSource) {
    this.contactDataSource = contactDataSource;
  }

  async createCollection(
    contacts: Array<CreateImportJSONActivityRequestImportDataInner>,
    accessToken: string,
  ): Promise<string> {
    return await this.contactDataSource.createCollection(contacts, accessToken);
  }

  async getContacts(accessToken: string): Promise<GetContactById200Response[]> {
    return await this.contactDataSource.getAll(accessToken);
  }

  async getUploadStatus(
    accessToken: string,
    activityId: string,
  ): Promise<string> {
    return await this.contactDataSource.getUploadStatus(
      accessToken,
      activityId,
    );
  }
}
