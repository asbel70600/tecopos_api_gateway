import { IsInt, IsPositive } from "class-validator";
import { Type } from "class-transformer";
import {
    GetAccountsRequest,
    GetAccountByIdRequest,
} from "../../domain/bank_account";

export class GetAccountsHttpRequest implements GetAccountsRequest {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    readonly userId!: number;
}

export class GetAccountByIdHttpRequest implements GetAccountByIdRequest {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    readonly accountId!: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    readonly userId!: number;
}
