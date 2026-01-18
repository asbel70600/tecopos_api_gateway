import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthServiceGrpcAdapter } from "./auth.service";
import { of, from } from "rxjs";
import { ValidationPipe, BadRequestException } from "@nestjs/common";
import { RegisterUserHTTPRequest } from "./contracts/http/register_user.request";
import { LoginHTTPRequest } from "./contracts/http/login.request";

describe("AuthController", () => {
    let controller: AuthController;
    let authServiceGrpc: AuthServiceGrpcAdapter;
    let validationPipe: ValidationPipe;

    const mockAuthServiceGrpc = {
        register: jest.fn(),
        login: jest.fn(),
        getPublicKey: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthServiceGrpcAdapter,
                    useValue: mockAuthServiceGrpc,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authServiceGrpc = module.get<AuthServiceGrpcAdapter>(
            AuthServiceGrpcAdapter,
        );

        // Initialize ValidationPipe for testing
        validationPipe = new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("register", () => {
        it("should call authServiceGrpc.register with correct DTO", (done) => {
            const dto: RegisterUserHTTPRequest = {
                email: "test@example.com",
                password: "password123",
            };

            const mockResponse = { id: 1, email: "test@example.com" };
            mockAuthServiceGrpc.register.mockReturnValue(of(mockResponse));

            const result$ = from(controller.register(dto));

            result$.subscribe({
                next: (response) => {
                    expect(authServiceGrpc.register).toHaveBeenCalledWith(dto);
                    expect(authServiceGrpc.register).toHaveBeenCalledTimes(1);
                    expect(response).toEqual(mockResponse);
                    done();
                },
                error: done.fail,
            });
        });

        it("should reject invalid email format", async () => {
            const invalidDto = {
                email: "not-an-email",
                password: "password123",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: RegisterUserHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it("should reject password shorter than 8 characters", async () => {
            const invalidDto = {
                email: "test@example.com",
                password: "short",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: RegisterUserHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it("should reject missing email", async () => {
            const invalidDto = {
                password: "password123",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: RegisterUserHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it("should reject missing password", async () => {
            const invalidDto = {
                email: "test@example.com",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: RegisterUserHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it("should reject extra fields", async () => {
            const invalidDto = {
                email: "test@example.com",
                password: "password123",
                extraField: "should not be here",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: RegisterUserHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe("login", () => {
        it("should call authServiceGrpc.login with correct DTO", (done) => {
            const dto: LoginHTTPRequest = {
                email: "test@example.com",
                password: "password123",
            };

            const mockResponse = {
                access_token: "mock_jwt_token",
                token_type: "Bearer",
                expires_in: 3600,
            };
            mockAuthServiceGrpc.login.mockReturnValue(of(mockResponse));

            const result$ = from(controller.login(dto));

            result$.subscribe({
                next: (response) => {
                    expect(authServiceGrpc.login).toHaveBeenCalledWith(dto);
                    expect(authServiceGrpc.login).toHaveBeenCalledTimes(1);
                    expect(response).toEqual(mockResponse);
                    done();
                },
                error: done.fail,
            });
        });

        it("should reject invalid email format", async () => {
            const invalidDto = {
                email: "not-an-email",
                password: "password123",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: LoginHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it("should reject password shorter than 8 characters", async () => {
            const invalidDto = {
                email: "test@example.com",
                password: "short",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: LoginHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it("should reject missing email", async () => {
            const invalidDto = {
                password: "password123",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: LoginHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it("should reject missing password", async () => {
            const invalidDto = {
                email: "test@example.com",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: LoginHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it("should reject extra fields", async () => {
            const invalidDto = {
                email: "test@example.com",
                password: "password123",
                extraField: "should not be here",
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: "body",
                    metatype: LoginHTTPRequest,
                }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe("getPublicKey", () => {
        it("should call authServiceGrpc.getPublicKey and forward response", (done) => {
            const mockResponse = {
                publicKey:
                    "-----BEGIN PUBLIC KEY-----\nMOCK_KEY\n-----END PUBLIC KEY-----",
            };
            mockAuthServiceGrpc.getPublicKey.mockReturnValue(of(mockResponse));

            const result$ = from(controller.getPublicKey());

            result$.subscribe({
                next: (response) => {
                    expect(authServiceGrpc.getPublicKey).toHaveBeenCalled();
                    expect(authServiceGrpc.getPublicKey).toHaveBeenCalledTimes(
                        1,
                    );
                    expect(response).toEqual(mockResponse);
                    done();
                },
                error: done.fail,
            });
        });
    });
});
