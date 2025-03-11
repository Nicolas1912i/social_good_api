export interface Contact {
    firstName: string;
    lastName: string;
    systemRecordId: string;
    dateChanged: Date;
    email: string;
    emailAddressDateChanged: Date;
    todayVisitor: boolean;
    todayVisitorDateChanged: Date;
    addressLine1: string;
    addressLine2: string;
    addressCity: string;
    addressZip: string;
    addressState: string;
    addressCountry: string;
    phoneNumber: string;
    phoneDateChanged: Date;
}