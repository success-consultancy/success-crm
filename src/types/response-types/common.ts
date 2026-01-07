export interface ResponseType {
    count: number;
    rows: Person[];
}

export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    files: any;
    passport: number;
    issueDate: string;
    expiryDate: string;
    email: string;
    phone: string;
    dob: string;
}

