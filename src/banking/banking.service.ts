import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { BankingServicePort } from "./domain/banking_service.port";
import {
    GetAccountsGrpcRequest,
    GetAccountsGrpcResponse,
} from "./contracts/grpc/bank_account";

@Injectable()
export class BankingServiceGrpcAdapter
    implements OnModuleInit, BankingServicePort
{
    private bankingService!: BankingServicePort;

    constructor(@Inject("BANKING_SERVICE") private client: ClientGrpc) {}

    onModuleInit() {
        this.bankingService =
            this.client.getService<BankingServicePort>("BankingService");
    }

    GetAccounts(
        request: GetAccountsGrpcRequest,
    ): Promise<GetAccountsGrpcResponse> {
        return this.bankingService.GetAccounts(request);
    }
}
