// How This Works
// Mocking the Service: The UsersService is mocked to return predefined values for each method, avoiding real database calls.
// Focus on Controller Logic: Tests ensure the controller calls the correct service methods with the right parameters and handles the responses correctly.
// Use of jest.fn(): Allows mocking and asserting calls to service methods.

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest
              .fn()
              .mockResolvedValue([
                { id: 1, username: 'user1', email: 'user1@example.com' },
              ]),
            getUserById: jest.fn().mockResolvedValue({
              id: 1,
              username: 'user1',
              email: 'user1@example.com',
            }),
            getUserByUsername: jest.fn().mockResolvedValue({
              id: 1,
              username: 'user1',
              email: 'user1@example.com',
            }),
            getUserByEmail: jest.fn().mockResolvedValue({
              id: 1,
              username: 'user1',
              email: 'user1@example.com',
            }),
            createUser: jest.fn().mockResolvedValue({
              id: 1,
              username: 'user1',
              email: 'user1@example.com',
            }),
            updateUser: jest.fn().mockResolvedValue({
              id: 1,
              username: 'updatedUser',
              email: 'user1@example.com',
            }),
            deleteUser: jest.fn().mockResolvedValue(undefined),
            getAllPostsByUserId: jest
              .fn()
              .mockResolvedValue([
                { id: 1, title: 'Post 1', content: 'Content 1', userId: 1 },
              ]),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should return all users', async () => {
    const result = await usersController.getAllUsers();
    expect(usersService.getUsers).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 1, username: 'user1', email: 'user1@example.com' },
    ]);
  });

  it('should return a user by ID', async () => {
    const id = '1';
    const result = await usersController.getUserById(id);
    expect(usersService.getUserById).toHaveBeenCalledWith(+id);
    expect(result).toEqual({
      id: 1,
      username: 'user1',
      email: 'user1@example.com',
    });
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password',
    };
    const result = await usersController.createUser(createUserDto);
    expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual({
      id: 1,
      username: 'user1',
      email: 'user1@example.com',
    });
  });

  it('should update a user by ID', async () => {
    const id = '1';
    const updateUserDto: UpdateUserDto = {
      username: 'updatedUser',
      email: 'user1@example.com',
    };
    const result = await usersController.updateUser(id, updateUserDto);
    expect(usersService.updateUser).toHaveBeenCalledWith(+id, updateUserDto);
    expect(result).toEqual({
      id: 1,
      username: 'updatedUser',
      email: 'user1@example.com',
    });
  });

  it('should delete a user by ID', async () => {
    const id = '1';
    const result = await usersController.deleteUser(id);
    expect(usersService.deleteUser).toHaveBeenCalledWith(+id);
    expect(result).toBeUndefined();
  });

  it('should return all posts by user ID', async () => {
    const id = '1';
    const result = await usersController.getAllPostsByUserId(id);
    expect(usersService.getAllPostsByUserId).toHaveBeenCalledWith(+id);
    expect(result).toEqual([
      { id: 1, title: 'Post 1', content: 'Content 1', userId: 1 },
    ]);
  });
});
