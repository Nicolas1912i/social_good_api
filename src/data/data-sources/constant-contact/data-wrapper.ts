import {CreateImportJSONActivityRequestImportDataInner} from "ctct-api-client";

export interface DataWrapper {
    getAll(): Promise<Array<CreateImportJSONActivityRequestImportDataInner>>;
    createCollection(contacts: Array<CreateImportJSONActivityRequestImportDataInner>): Promise<boolean>;
}
