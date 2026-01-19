export interface BankAccount {
    readonly id: number;
    readonly userId: number;
    readonly accountNumber: string;
    readonly balance: number;
    readonly currency: string;
    readonly createdAt: string;
}

export interface GetAccountsRequest {}

export interface GetAccountsResponse {
    readonly accounts: BankAccount[];
}
