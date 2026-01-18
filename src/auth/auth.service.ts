import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { AuthServicePort } from "./domain/auth_service.port";
import {
    RegisterUserGrpcRequest,
    RegisterUserGrpcResponse,
} from "./contracts/grpc/register_user.request";
import {
    LoginGrpcRequest,
    LoginGrpcResponse,
} from "./contracts/grpc/login.request";

@Injectable()
export class AuthServiceGrpcAdapter implements OnModuleInit, AuthServicePort {
    private authService!: AuthServicePort;

    constructor(@Inject("SSO_SERVICE") private client: ClientGrpc) {}

    onModuleInit() {
        this.authService =
            this.client.getService<AuthServicePort>("AuthService");
    }

    register(
        registerDto: RegisterUserGrpcRequest,
    ): Promise<RegisterUserGrpcResponse> {
        return this.authService.register(registerDto);
    }

    login(loginDto: LoginGrpcRequest): Promise<LoginGrpcResponse> {
        return this.authService.login(loginDto);
    }

    getPublicKey() {
        return this.authService.getPublicKey({});
    }
}
