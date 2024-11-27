// import {
//     BadRequestException,
//     Inject,
//     Injectable,
//     NotFoundException,
//   } from '@nestjs/common';
//   import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
//   import { Pool } from 'pg';
//   import * as bcrypt from 'bcrypt';
//   import { PrismaService } from 'src/prisma/prisma.service';
//   import { Prisma } from '@prisma/client';
//   @Injectable()
//   export class UsersService {
//     constructor(
//         @Inject('DATABASE_POOL') private pool: Pool,
//       private prisma: PrismaService,
//     ) {}
//     async createUser(createUserDto: CreateUserDto) {
//       const { username, email, password } = createUserDto;
//       const result = await this.pool.query(
//         'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
//         [username, email, password],
//       );
//       return result.rows[0];
//     }
//     async getUsers() {
//       const result = await this.pool.query('SELECT * FROM users');
//       return result.rows;
//     }
//     async getUser(id: number) {
//       const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [
//         id,
//       ]);
//       return result.rows[0];
//     }
//     async update(id: number, UpdateUserDto: UpdateUserDto) {
//       // Check if updateUserDto is empty
//       if (!UpdateUserDto || Object.keys(UpdateUserDto).length === 0) {
//         throw new BadRequestException('No fields provided for update');
//       }
//       const fields = [];
//       const values = [];

//       let index = 1;
//       if (UpdateUserDto.username) {
//         fields.push(`username = $${index++}`);
//         values.push(UpdateUserDto.username);
//       }
//       if (UpdateUserDto.email) {
//         fields.push(`email = $${index++}`);
//         values.push(UpdateUserDto.email);
//       }
//       if (UpdateUserDto.password) {
//         fields.push(`password = $${index++}`);
//         values.push(UpdateUserDto.password);
//       }

//       if (fields.length === 0) {
//         throw new Error('No fields to update');
//       }
//       const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
//       values.push(id);
//       const result = await this.pool.query(query, values);
//       if (result.rows.length === 0)
//         throw new NotFoundException(`User with id ${id} not found`);
//       return result.rows[0];
//     }
//     async delete(id: number) {
//       await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
//       return { message: `User with id ${id} deleted successfully` };
//     }
//     async getUserByUsername(username: string) {
//       const result = await this.pool.query(
//         'SELECT * FROM users where username = $1',
//         [username],
//       );
//       if (result.rows.length === 0)
//         throw new NotFoundException(`User with username "${username}" not found`);
//       return result.rows[0];
//     }
//     async getUserByEmail(email: string) {
//       const result = await this.pool.query(
//         'SELECT * FROM users where email = $1',
//         [email],
//       );
//       if (result.rows.length === 0)
//         throw new NotFoundException(`User with username "${email}" not found`);
//       return result.rows[0];
//   }
// async updatePost(id: number, UpdatePostDto: UpdatePostDto) {
//     // Check if updateUserDto is empty
//     if (!UpdatePostDto || Object.keys(UpdatePostDto).length === 0) {
//       throw new BadRequestException('No fields provided for update');
//     }
//     const fields = [];
//     const values = [];
//     let index = 1;
//     if (UpdatePostDto.title) {
//       fields.push(`title = $${index++}`);
//       values.push(UpdatePostDto.title);
//     }
//     if (UpdatePostDto.content) {
//       fields.push(`content = $${index++}`);
//       values.push(UpdatePostDto.content);
//     }
//     if (fields.length === 0) {
//       throw new Error('No fields to update');
//     }
//     const query = `UPDATE posts SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
//     values.push(id);
//     const result = await this.pool.query(query, values);
//     if (result.rows.length === 0)
//       throw new NotFoundException(`Post with id ${id} not found`);
//     return result.rows[0];
//   }
// }
