// Key Points:
// Mocking Dependencies: We mock the AuthService's methods like googleLogin, register, and login so that we can isolate the logic in the controller and focus on testing its behavior.
// Testing Controller Methods:
// For googleAuthRedirect, we simulate the request object and verify the expected output.
// For register and login, we provide mock data (e.g., CreateUserDto or LoginDto) and check that the appropriate service methods are called with the correct arguments.
// The expect statements ensure that the AuthController methods return the expected responses, such as tokens or user data.
// If you want to test Google OAuth:
// Since the Google OAuth flow is usually more complicated and relies on external APIs, you would typically mock that flow as well,
// so you don't need to call Google's API during unit tests.
// This example assumes that googleAuthRedirect will return a mock result from the authService.googleLogin method.

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            googleLogin: jest
              .fn()
              .mockResolvedValue({ access_token: 'google-token' }),
            register: jest.fn().mockResolvedValue({
              id: 1,
              username: 'user1',
              email: 'user1@example.com',
            }),
            login: jest.fn().mockResolvedValue({ access_token: 'jwt-token' }),
          },
        },
        JwtService, // Mock JwtService if used in the controller
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should initiate Google OAuth2 authentication', async () => {
    // Mock the request object
    const req = {
      user: { id: 1, username: 'googleUser', email: 'googleuser@example.com' },
    };
    const result = await authController.googleAuthRedirect(req);

    // Assuming googleLogin returns a user object or JWT token
    expect(authService.googleLogin).toHaveBeenCalledWith(req);
    expect(result).toEqual({ access_token: 'google-token' });
  });

  it('should register a user successfully', async () => {
    const createUserDto: CreateUserDto = {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password',
    };
    const result = await authController.register(createUserDto);

    expect(authService.register).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual({
      id: 1,
      username: 'user1',
      email: 'user1@example.com',
    });
  });

  it('should login a user and return a JWT token', async () => {
    const loginDto: LoginDto = {
      username: 'user1',
      password: 'password',
    };
    const result = await authController.login(loginDto);

    expect(authService.login).toHaveBeenCalledWith(
      loginDto.username,
      loginDto.password,
    );
    expect(result).toEqual({ access_token: 'jwt-token' });
  });
});
