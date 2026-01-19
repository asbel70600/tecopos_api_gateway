import { IsInt, IsPositive } from "class-validator";
import { Type } from "class-transformer";
import { GetAccountsRequest } from "../../domain/bank_account";

export class GetAccountsHttpRequest implements GetAccountsRequest {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    readonly userId!: number;
}
