import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
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
        try {
            return this.authServiceGrpc.register(dto);
        } catch (error: unknown) {
            this.handleGrpcError(error);
        }
    }

    @Post("login")
    login(@Body() dto: LoginHTTPRequest): Promise<LoginHTTPResponse> {
        try {
            return this.authServiceGrpc.login(dto);
        } catch (error: unknown) {
            this.handleGrpcError(error);
        }
    }

    // @Get("public-key")
    // getPublicKey(): Promise<GetPublicKeyResponse> {
    //        try {
    //    return this.authServiceGrpc.getPublicKey();
    //     } catch (error: any) {
    //         this.handleGrpcError(error);
    //     }
    // }

    private handleGrpcError(error: any): never {
        const code = error?.code;
        const message =
            error?.details || error?.message || "Internal server error";

        switch (code) {
            case 3:
                throw new HttpException(message, HttpStatus.BAD_REQUEST);
            case 6:
                throw new HttpException(message, HttpStatus.CONFLICT);
            case 16:
                throw new HttpException(message, HttpStatus.UNAUTHORIZED);
            case 7:
                throw new HttpException(message, HttpStatus.FORBIDDEN);
            case 5:
                throw new HttpException(message, HttpStatus.NOT_FOUND);
            default:
                throw new HttpException(
                    message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
        }
    }
}
