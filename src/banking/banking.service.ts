import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { BankingServicePort } from "./domain/banking_service.port";
import {
    GetAccountsGrpcRequest,
    GetAccountsGrpcResponse,
    GetAccountByIdGrpcRequest,
    GetAccountByIdGrpcResponse,
} from "./contracts/grpc/bank_account";
import {
    GetOperationsGrpcRequest,
    GetOperationsGrpcResponse,
    CreateOperationGrpcRequest,
    CreateOperationGrpcResponse,
} from "./contracts/grpc/operation";

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

    getAccounts(
        request: GetAccountsGrpcRequest,
    ): Promise<GetAccountsGrpcResponse> {
        return this.bankingService.getAccounts(request);
    }

    getAccountById(
        request: GetAccountByIdGrpcRequest,
    ): Promise<GetAccountByIdGrpcResponse> {
        return this.bankingService.getAccountById(request);
    }

    getOperations(
        request: GetOperationsGrpcRequest,
    ): Promise<GetOperationsGrpcResponse> {
        return this.bankingService.getOperations(request);
    }

    createOperation(
        request: CreateOperationGrpcRequest,
    ): Promise<CreateOperationGrpcResponse> {
        return this.bankingService.createOperation(request);
    }
}
