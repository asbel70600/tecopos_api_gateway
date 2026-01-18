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
import {
    GetAccountsHttpRequest,
    GetAccountByIdHttpRequest,
} from "./contracts/http/bank_account.dto";
import {
    GetOperationsHttpRequest,
    CreateOperationHttpRequest,
} from "./contracts/http/operation.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("banking")
@UseGuards(JwtAuthGuard)
export class BankingController {
    constructor(
        private readonly bankingServiceGrpc: BankingServiceGrpcAdapter,
    ) {}

    @Get("accounts")
    async getAccounts(@Request() req: any) {
        try {
            const userId = req.user.sub; // Extract from JWT
            return await this.bankingServiceGrpc.getAccounts({ userId });
        } catch (error: any) {
            this.handleGrpcError(error);
        }
    }

    @Get("accounts/:accountId")
    async getAccountById(
        @Param("accountId") accountId: string,
        @Request() req: any,
    ) {
        try {
            const userId = req.user.sub;
            return await this.bankingServiceGrpc.getAccountById({
                accountId: parseInt(accountId, 10),
                userId,
            });
        } catch (error: any) {
            this.handleGrpcError(error);
        }
    }

    @Get("operations")
    async getOperations(
        @Query() query: GetOperationsHttpRequest,
        @Request() req: any,
    ) {
        try {
            const userId = req.user.sub;
            return await this.bankingServiceGrpc.getOperations({
                ...query,
                userId,
            });
        } catch (error: any) {
            this.handleGrpcError(error);
        }
    }

    @Post("operations")
    async createOperation(
        @Body() body: CreateOperationHttpRequest,
        @Request() req: any,
    ) {
        try {
            const userId = req.user.sub;
            return await this.bankingServiceGrpc.createOperation({
                ...body,
                userId,
            });
        } catch (error: any) {
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
