// test suite that includes some unit tests for the methods in your UsersService.
// Note that it uses mocking for the PrismaService to isolate the service being tested

// Key Points:
// Mocking PrismaService: The PrismaService is mocked to ensure that no actual database calls are made during testing.
// bcrypt Hashing: Since password hashing is asynchronous, it is included in the tests where password handling is relevant.
// Test Methods: Each public method in the UsersService is tested, ensuring its behavior matches the expected functionality.

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2a$10$mockedHashedPassword'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return a response DTO', async () => {
      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      // Mock bcrypt.hash to return a consistent hashed password
      const hashedPassword = '$2a$10$mockedHashedPassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        createdTime: mockUser.createdAt,
      });
    });
  });

  describe('findUserByEmailOrUsername', () => {
    it('should find a user by email or username', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: '123456789',
        createdAt: new Date('12/12/2015'),
      };

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser);

      const result = await service.findUserByEmailOrUsername(
        'test@example.com',
        'testuser',
      );

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: 'test@example.com' }, { username: 'testuser' }],
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return a response DTO', async () => {
      const updateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
        password: 'newpassword',
      };
      // Mock bcrypt.hash to return a consistent hashed password
      const hashedPassword = '$2a$10$mockedHashedPassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      const mockUser = {
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
        password: hashedPassword,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.user, 'update').mockResolvedValue(mockUser);

      const result = await service.updateUser(1, updateUserDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateUserDto,
          password: hashedPassword,
        },
      });
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        createdTime: mockUser.createdAt,
      });
    });
  });

  describe('getUserById', () => {
    it('should find a user by ID', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: '123456789',
        createdAt: new Date('12/12/2015'),
      };

      jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue(mockUser);

      const result = await service.getUserById(1);

      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: '123456789',
        createdAt: new Date('12/12/2015'),
      };

      jest.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser);

      const result = await service.deleteUser(1);

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllPostsByUserId', () => {
    it('should retrieve all posts by a user ID', async () => {
      const mockPosts = [
        { title: 'Post 1', content: 'Content 1', createdAt: new Date() },
        { title: 'Post 2', content: 'Content 2', createdAt: new Date() },
      ];
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: '123456789',
        createdAt: new Date('12/12/2015'),
        posts: mockPosts,
      };

      jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue(mockUser);

      const result = await service.getAllPostsByUserId(1);

      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          username: true,
          email: true,
          posts: {
            orderBy: { createdAt: 'asc' },
            select: {
              title: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
