import {
    Controller,
    Get,
    Post,
    Query,
    Param,
    Body,
    UseGuards,
    Request,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { BankingServiceGrpcAdapter } from "./banking.service";
import { GetAccountsHttpRequest } from "./contracts/http/bank_account.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("banking")
export class BankingController {
    constructor(
        private readonly bankingServiceGrpc: BankingServiceGrpcAdapter,
    ) {}

    @Get("accounts")
    async getAccounts(@Request() req: any) {
        try {
            return await this.bankingServiceGrpc.GetAccounts({});
        } catch (error: any) {
            console.log("ERROR");
            console.log(error);
            this.handleGrpcError(error);
        }
    }

    private handleGrpcError(error: any): never {
        const code = error?.code;
        const message =
            error?.details || error?.message || "Internal server error";

        switch (code) {
            case 3:
                throw new HttpException(message, HttpStatus.BAD_REQUEST);
            case 5:
                throw new HttpException(message, HttpStatus.NOT_FOUND);
            case 7:
                throw new HttpException(message, HttpStatus.FORBIDDEN);
            case 16:
                throw new HttpException(message, HttpStatus.UNAUTHORIZED);
            default:
                throw new HttpException(
                    message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
        }
    }
}
