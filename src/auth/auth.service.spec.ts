import { Test, TestingModule } from "@nestjs/testing";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable, of } from "rxjs";
import { RegisterUserRequest } from "./contracts/register_user";
import { LoginRequest } from "./contracts/login";
import { AuthServiceGrpcAdapter } from "./auth.service";
import { from } from "rxjs";

describe("AuthServiceGrpc", () => {
    let service: AuthServiceGrpcAdapter;
    let mockClientGrpc: ClientGrpc;

    // biome-ignore: lint/suspicious/noExplicitAny: it's a test
    let mockAuthService: any;

    beforeEach(async () => {
        // Mock the gRPC auth service methods
        mockAuthService = {
            register: jest
                .fn()
                .mockReturnValue(of({ id: 1, email: "test@example.com" })),
            login: jest.fn().mockReturnValue(
                of({
                    access_token: "mock_token",
                    token_type: "Bearer",
                    expires_in: 3600,
                }),
            ),
            getPublicKey: jest
                .fn()
                .mockReturnValue(of({ publicKey: "mock_public_key" })),
        };

        // Mock ClientGrpc
        // biome-ignore: lint/suspicious/noExplicitAny
        mockClientGrpc = {
            getService: jest.fn().mockReturnValue(mockAuthService),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthServiceGrpcAdapter,
                {
                    provide: "SSO_SERVICE",
                    useValue: mockClientGrpc,
                },
            ],
        }).compile();

        service = module.get<AuthServiceGrpcAdapter>(AuthServiceGrpcAdapter);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("onModuleInit", () => {
        it("should call client.getService with correct service name", () => {
            service.onModuleInit();
            expect(mockClientGrpc.getService).toHaveBeenCalledWith(
                "AuthService",
            );
        });
    });

    describe("register", () => {
        it("should call the gRPC register method and not fail", (done) => {
            const dto: RegisterUserRequest = {
                email: "test@example.com",
                password: "password123",
            };

            service.onModuleInit(); // Initialize the service
            const result$ = from(service.register(dto));

            result$.subscribe({
                next: (response) => {
                    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
                    expect(response).toBeDefined();
                    done();
                },
                error: done.fail,
            });
        });
    });

    describe("login", () => {
        it("should call the gRPC login method and not fail", (done) => {
            const dto: LoginRequest = {
                email: "test@example.com",
                password: "password123",
            };

            service.onModuleInit(); // Initialize the service
            const result$ = from(service.login(dto));

            result$.subscribe({
                next: (response) => {
                    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
                    expect(response).toBeDefined();
                    done();
                },
                error: done.fail,
            });
        });
    });

    describe("error handling", () => {
        describe("register", () => {
            it("should handle gRPC errors", (done) => {
                const dto: RegisterUserRequest = {
                    email: "test@example.com",
                    password: "password123",
                };

                const mockError = new Error("gRPC connection failed");
                mockAuthService.register.mockReturnValue(
                    new Observable((subscriber) => {
                        subscriber.error(mockError);
                    }),
                );

                service.onModuleInit();
                const result$ = from(service.register(dto));

                result$.subscribe({
                    next: () => done.fail("Should have thrown an error"),
                    error: (error) => {
                        expect(error).toBe(mockError);
                        done();
                    },
                });
            });
        });

        describe("login", () => {
            it("should handle gRPC errors", (done) => {
                const dto: LoginRequest = {
                    email: "test@example.com",
                    password: "password123",
                };

                const mockError = new Error("Authentication failed");
                mockAuthService.login.mockReturnValue(
                    new Observable((subscriber) => {
                        subscriber.error(mockError);
                    }),
                );

                service.onModuleInit();
                const result$ = from(service.login(dto));

                result$.subscribe({
                    next: () => done.fail("Should have thrown an error"),
                    error: (error) => {
                        expect(error).toBe(mockError);
                        done();
                    },
                });
            });
        });

        describe("service unavailable", () => {
            it("should handle service unavailable errors on register", (done) => {
                const dto: RegisterUserRequest = {
                    email: "test@example.com",
                    password: "password123",
                };

                const unavailableError = new Error(
                    "14 UNAVAILABLE: Connection refused",
                );
                mockAuthService.register.mockReturnValue(
                    new Observable((subscriber) => {
                        subscriber.error(unavailableError);
                    }),
                );

                service.onModuleInit();
                const result$ = from(service.register(dto));

                result$.subscribe({
                    next: () => done.fail("Should have thrown an error"),
                    error: (error) => {
                        expect(error.message).toContain("UNAVAILABLE");
                        done();
                    },
                });
            });
        });
    });
});
