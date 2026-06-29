export type AccountType = "user" | "admin";

export type AccountOption = {
    type: AccountType;
    title: string;
    description: string;
    href: string;
};