import { LoginRequest, LoginResponse } from "../contracts/login";
import { GetPublicKeyResponse } from "../contracts/public_key";
import {
    RegisterUserRequest,
    RegisterUserResponse,
} from "../contracts/register_user";

export interface AuthServicePort {
    register(data: RegisterUserRequest): Promise<RegisterUserResponse>;
    login(data: LoginRequest): Promise<LoginResponse>;
    getPublicKey(data: {}): Promise<GetPublicKeyResponse>;
}
