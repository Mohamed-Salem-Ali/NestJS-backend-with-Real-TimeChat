import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

import { User } from '@prisma/client';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user in the database using Prisma
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword, // Save the hashed password
      },
    });

    // Map user data to UserResponseDto and return it
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdTime: user.createdAt,
    };
  }

  async findUserByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Check if a password was provided for update
    const hashedPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10) // Hash the new password if provided
      : undefined; // If no password is provided, leave it as undefined

    // Update user in the database
    const updatedUser = await this.prisma.user.update({
      where: { id }, // Find the user by ID
      data: {
        ...updateUserDto, // Spread all other fields from the DTO
        ...(hashedPassword && { password: hashedPassword }), // Only update password if provided
      },
    });

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      createdTime: updatedUser.createdAt,
    };
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
  }

  async getUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
  async getAllPostsByUserId(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        username: true,
        email: true,
        posts: {
          orderBy: { createdAt: 'asc' },
          select: {
            title: true, // Select only the title of the post
            content: true, // Select only the content of the post
            createdAt: true, // Select only the creation date of the post
          },
        },
      },
    });
  }
}
