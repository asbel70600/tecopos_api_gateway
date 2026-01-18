import { Controller, Post, Body } from "@nestjs/common";
import {
    RegisterUserHTTPRequest,
    RegisterUserHTTPResponse,
} from "./contracts/http/register_user.request";
import {
    LoginHTTPRequest,
    LoginHTTPResponse,
} from "./contracts/http/login.request";
import { AuthServiceGrpcAdapter } from "./auth.service";
// import { GetPublicKeyResponse } from "./contracts/public_key";

@Controller("auth")
export class AuthController {
    constructor(private readonly authServiceGrpc: AuthServiceGrpcAdapter) {}

    @Post("register")
    register(
        @Body() dto: RegisterUserHTTPRequest,
    ): Promise<RegisterUserHTTPResponse> {
        return this.authServiceGrpc.register(dto);
    }

    @Post("login")
    login(@Body() dto: LoginHTTPRequest): Promise<LoginHTTPResponse> {
        return this.authServiceGrpc.login(dto);
    }

    // @Get("public-key")
    // getPublicKey(): Promise<GetPublicKeyResponse> {
    //     return this.authServiceGrpc.getPublicKey();
    // }
}
