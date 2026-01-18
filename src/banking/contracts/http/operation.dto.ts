import {
    IsInt,
    IsPositive,
    IsString,
    IsNumber,
    IsOptional,
    IsIn,
} from "class-validator";
import { Type } from "class-transformer";
import {
    GetOperationsRequest,
    CreateOperationRequest,
} from "../../domain/operation";

export class GetOperationsHttpRequest implements GetOperationsRequest {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    readonly accountId!: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    readonly userId!: number;

    @IsOptional()
    @IsString()
    readonly startDate?: string;

    @IsOptional()
    @IsString()
    readonly endDate?: string;

    @IsOptional()
    @IsString()
    readonly operationType?: string;
}

export class CreateOperationHttpRequest implements CreateOperationRequest {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    readonly accountId!: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    readonly userId!: number;

    @IsString()
    @IsIn(["deposit", "withdrawal", "transfer", "payment"])
    readonly type!: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    readonly amount!: number;

    @IsString()
    readonly description!: string;
}
