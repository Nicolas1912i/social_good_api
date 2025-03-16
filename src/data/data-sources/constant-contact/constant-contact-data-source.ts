import {ContactDataSource} from "../../interfaces/data-sources/contact-data-source";
import {
    BulkActivitiesApi,
    Configuration, ContactListsApi, ContactsApi,
    CreateImportJSONActivityRequestImportDataInner, GetContactById200Response
} from "ctct-api-client";

export class ConstantContactDataSource implements ContactDataSource {

    private getConfiguration(accessToken: string): Configuration {
        return new Configuration({accessToken: accessToken});
    }

    async createCollection(contact: Array<CreateImportJSONActivityRequestImportDataInner>, accessToken: string): Promise<string> {
        const configuration = this.getConfiguration(accessToken);
        const contactListsApi = new ContactListsApi(configuration);
        const contactListsResult = await contactListsApi.getAllLists();
        const listIds = contactListsResult.data.lists!.map(x => x.list_id);
        const bulkActivitiesApi = new BulkActivitiesApi(configuration);
        try {
            const result = await bulkActivitiesApi.createImportJSONActivity({
                import_data: contact,
                list_ids: listIds,
            });
            return result.data.activity_id!;
        } catch (error) {
            throw new Error("Failed to import JSON");
        }
    }

    async getAll(accessToken: string): Promise<GetContactById200Response[]> {
        const configuration = this.getConfiguration(accessToken);
        const contactApi = new ContactsApi(configuration);
        try {
            // @ts-ignore
            const result = await contactApi.getAllContacts(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "street_addresses,phone_numbers", undefined, undefined, 500);
            return result.data.contacts!;
        } catch (error) {
            throw new Error("Failed to retrieve contacts");
        }
    }

    async getUploadStatus(accessToken: string, activityId: string): Promise<string> {
        const configuration = this.getConfiguration(accessToken);
        const bulkActivitiesApi = new BulkActivitiesApi(configuration);
        try {
            const result = await bulkActivitiesApi.getActivityById(activityId);
            return result.data.state!;
        } catch (error) {
            throw new Error("Failed to retrieve upload status");
        }
    }
}
