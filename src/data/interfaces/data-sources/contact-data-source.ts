import {CreateImportJSONActivityRequestImportDataInner, GetContactById200Response} from "ctct-api-client";

export interface ContactDataSource {
    createCollection(contact: Array<CreateImportJSONActivityRequestImportDataInner>, accessToken: string): Promise<string>;
    getAll(accessToken: string): Promise<GetContactById200Response[]>;
    getUploadStatus(accessToken: string, activityId: string): Promise<string>;
}
