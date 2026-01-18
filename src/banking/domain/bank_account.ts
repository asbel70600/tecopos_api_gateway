export interface BankAccount {
    readonly id: number;
    readonly userId: number;
    readonly accountNumber: string;
    readonly balance: number;
    readonly currency: string;
    readonly createdAt: string;
}

export interface GetAccountsRequest {
    readonly userId: number;
}

export interface GetAccountsResponse {
    readonly accounts: BankAccount[];
}

export interface GetAccountByIdRequest {
    readonly accountId: number;
    readonly userId: number;
}

export interface GetAccountByIdResponse {
    readonly account: BankAccount;
}
