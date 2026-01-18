import { IsEmail, IsString, MinLength } from "class-validator";
import { LoginRequest, LoginResponse } from "../login";

export class LoginHTTPRequest implements LoginRequest {
    @IsEmail()
    public readonly email!: string;

    @IsString()
    @MinLength(8)
    public readonly password!: string;
}

export class LoginHTTPResponse implements LoginResponse {
    public readonly access_token!: string;
    public readonly token_type!: string;
    public readonly expires_in!: number;
}
