import {CreateImportJSONActivityRequestImportDataInner, GetContactById200Response} from "ctct-api-client";

export interface ContactRepository {
    createCollection(contact: Array<CreateImportJSONActivityRequestImportDataInner>, accessToken: string): Promise<string>;
    getContacts(accessToken: string): Promise<GetContactById200Response[]>;
    getUploadStatus(accessToken: string, activityId: string): Promise<string>;
}
