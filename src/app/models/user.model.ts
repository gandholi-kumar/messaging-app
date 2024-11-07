export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    company: Company;
}

interface Company {
    name: string;
}

