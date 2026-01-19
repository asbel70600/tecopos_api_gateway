import { GetAccountsRequest, GetAccountsResponse } from "./bank_account";

export interface BankingServicePort {
    GetAccounts(request: GetAccountsRequest): Promise<GetAccountsResponse>;
}
