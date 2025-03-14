import {GetContactById200Response} from "ctct-api-client";

export interface GetAllContactsUseCase {
    execute(accessToken: string): Promise<GetContactById200Response[]>;
}