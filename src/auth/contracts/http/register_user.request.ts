import { IsEmail, IsString, MinLength } from "class-validator";
import { RegisterUserRequest, RegisterUserResponse } from "../register_user";

export class RegisterUserHTTPRequest implements RegisterUserRequest {
    @IsEmail()
    public readonly email!: string;

    @IsString()
    @MinLength(8)
    public readonly password!: string;
}

export class RegisterUserHTTPResponse implements RegisterUserResponse {
    public readonly id!: number;
    public readonly email!: string;
}
