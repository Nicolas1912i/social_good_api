import { CreateImportJSONActivityRequestImportDataInner } from "ctct-api-client";

export interface CreateContactsUseCase {
  execute(
    contact: Array<CreateImportJSONActivityRequestImportDataInner>,
    accessToken: string,
  ): Promise<string>;
}
