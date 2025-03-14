import {ContactDataSource} from "../../interfaces/data-sources/contact-data-source";
import {
    BulkActivitiesApi,
    Configuration, ContactsApi,
    CreateImportJSONActivityRequestImportDataInner, GetContactById200Response
} from "ctct-api-client";

export class ConstantContactDataSource implements ContactDataSource {

    private requireSegmentation(bytes: number): boolean {
        const units = ['B', 'KB', 'MB', 'GB'];

        let unitIndex = 0;

        for (unitIndex; bytes > 1024; unitIndex++) {
            bytes /= 1024;
        }

        return units[unitIndex] == 'MB' && bytes >= 4;
    }

    private getConfiguration(accessToken: string): Configuration {
        return new Configuration({accessToken: accessToken});
    }

    async createCollection(contact: Array<CreateImportJSONActivityRequestImportDataInner>, accessToken: string): Promise<string> {
        const configuration = this.getConfiguration(accessToken);
        const contactApi = new BulkActivitiesApi(configuration);
        try {
            const result = await contactApi.createImportJSONActivity({
                import_data: contact,
                list_ids: ["a2d739ee-fc29-11ef-bfc7-fa163ea51378"]
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
            const result = await contactApi.getAllContacts();
            return result.data.contacts!;
        } catch (error) {
            throw new Error("Failed to retrieve contacts");
        }
    }
}
