import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { RegisterUserRequest } from "./contracts/register_user";
import { AuthServicePort } from "./domain/auth_service.port";
import { LoginRequest } from "./contracts/login";

@Injectable()
export class AuthServiceGrpcAdapter implements OnModuleInit, AuthServicePort {
    private authService!: AuthServicePort;

    constructor(@Inject("SSO_SERVICE") private client: ClientGrpc) {}

    onModuleInit() {
        this.authService =
            this.client.getService<AuthServicePort>("AuthService");
    }

    register(registerDto: RegisterUserRequest) {
        return this.authService.register(registerDto);
    }

    login(loginDto: LoginRequest) {
        return this.authService.login(loginDto);
    }

    getPublicKey() {
        return this.authService.getPublicKey({});
    }
}
