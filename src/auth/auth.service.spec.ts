//This test file includes test cases for the register, login, and googleLogin methods.
//These tests use Jest and mock dependencies like UsersService and JwtService.
// Key Notes:
// Mocks: Dependencies (UsersService and JwtService) are mocked using Jest to isolate the AuthService.
// Coverage: The tests cover normal and edge cases for all key methods (register, login, and googleLogin).
// Execution: Run the tests using Jest with npm run test.
// Let me know if you'd like additional functionality or refinements!

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<jest.Mocked<UsersService>>;
  let jwtService: Partial<jest.Mocked<JwtService>>;

  beforeEach(async () => {
    usersService = {
      findUserByEmailOrUsername: jest.fn(),
      createUser: jest.fn(),
      getUserByUsername: jest.fn(),
      getUserByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const newUser = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      const createdUser = {
        id: 1,
        email: newUser.email,
        username: newUser.username,
        createdTime: new Date(),
      };

      usersService.findUserByEmailOrUsername.mockResolvedValue(null); // User doesn't exist
      usersService.createUser.mockResolvedValue(createdUser);

      const result = await authService.register(newUser);
      expect(usersService.findUserByEmailOrUsername).toHaveBeenCalledWith(
        newUser.email,
        newUser.username,
      );
      expect(usersService.createUser).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(createdUser);
    });

    it('should throw an error if user already exists', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123456789',
        createdAt: new Date('12/12/2015'),
      };
      const existingUser = {
        id: 1,
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        createdAt: newUser.createdAt,
      };

      usersService.findUserByEmailOrUsername.mockResolvedValue(existingUser);

      await expect(authService.register(newUser)).rejects.toThrow(
        'User already exists with the same email or username',
      );
      expect(usersService.findUserByEmailOrUsername).toHaveBeenCalledWith(
        newUser.email,
        newUser.username,
      );
    });
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const username = 'testuser';
      const password = 'password123';
      const user = {
        id: 1,
        username,
        email: 'testuser@example.com',
        createdAt: new Date(),
        password: await bcrypt.hash(password, 10),
      };

      usersService.getUserByUsername.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('valid-jwt-token');

      const result = await authService.login(username, password);
      expect(usersService.getUserByUsername).toHaveBeenCalledWith(username);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.id,
      });
      expect(result).toEqual({ access_token: 'valid-jwt-token' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const user = {
        id: 1,
        username,
        email: 'testuser@example.com',
        createdAt: new Date(),
        password: await bcrypt.hash('password123', 10),
      };

      usersService.getUserByUsername.mockResolvedValue(user);

      await expect(authService.login(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.getUserByUsername).toHaveBeenCalledWith(username);
    });
  });

  describe('googleLogin', () => {
    it('should return an access token for an existing Google user', async () => {
      const googleUser = {
        email: 'googleuser@example.com',
        firstName: 'Google',
        lastName: 'User',
      };
      const existingUser = {
        id: 1,
        email: googleUser.email,
        username: 'existinguser',
        password: '', // Empty password to avoid hashing
        createdAt: new Date(),
      };

      usersService.getUserByEmail.mockResolvedValue(existingUser);
      jwtService.sign.mockReturnValue('valid-jwt-token');

      const result = await authService.googleLogin({ user: googleUser });
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(
        googleUser.email,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: existingUser.username,
        sub: existingUser.id,
      });
      expect(result).toEqual({
        message: 'User Info Already Registerd',
        user: existingUser,
        access_token: 'valid-jwt-token',
      });
    });

    it('should create a new user for a Google user not in the database', async () => {
      const googleUser = {
        email: 'newgoogleuser@example.com',
        firstName: 'New',
        lastName: 'User',
      };
      const newUser = {
        email: googleUser.email,
        username: 'NewUser',
        password: '',
      };
      const createdUser = {
        id: 2,
        email: newUser.email,
        username: newUser.username,
        createdTime: new Date(),
      };

      usersService.getUserByEmail.mockResolvedValue(null); // User not found
      usersService.createUser.mockResolvedValue(createdUser);
      jwtService.sign.mockReturnValue('valid-jwt-token');

      const result = await authService.googleLogin({ user: googleUser });
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(
        googleUser.email,
      );
      expect(usersService.createUser).toHaveBeenCalledWith(newUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: createdUser.username,
        sub: createdUser.id,
      });
      expect(result).toEqual({
        message: 'New User Info from Google login',
        user: createdUser,
        access_token: 'valid-jwt-token',
      });
    });

    it('should throw UnauthorizedException if no Google user is provided', async () => {
      await expect(authService.googleLogin({ user: null })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
