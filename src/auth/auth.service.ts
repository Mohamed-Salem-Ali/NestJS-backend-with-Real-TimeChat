import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UserResponseDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log('Registering user...');
    const existingUser = await this.usersService.findUserByEmailOrUsername(
      createUserDto.email,
      createUserDto.username,
    );
    if (existingUser) {
      throw new Error('User already exists with the same email or username');
    }
    return await this.usersService.createUser(createUserDto);
  }

  async login(username: string, password: string): Promise<any> {
    this.logger.log(`Logging in user: ${username}`);
    const user = await this.usersService.getUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.warn(`Invalid login attempt for user: ${username}`);
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  // Improved Google login method
  async googleLogin(req): Promise<any> {
    if (!req.user) {
      this.logger.warn('No user from Google login');
      throw new UnauthorizedException('No user from Google login');
    } // Check if the user already exists in your database
    const existingUser = await this.usersService.getUserByEmail(req.user.email);
    if (existingUser) {
      // If the user exists, return a JWT token
      const payload = { username: existingUser.username, sub: existingUser.id };
      return {
        message: 'User Info Already Registerd',
        user: existingUser,
        access_token: this.jwtService.sign(payload),
      };
    } else {
      // If the user does not exist, create a new user
      const newUser: CreateUserDto = {
        email: req.user.email,
        username: req.user.firstName + req.user.lastName, // Adjust as necessary
        password: '', // Password is not used for social login
      };
      const createdUser = await this.usersService.createUser(newUser);
      const payload = {
        username: createdUser.username,
        sub: createdUser.id,
      };
      return {
        message: 'New User Info from Google login',
        user: createdUser,
        access_token: this.jwtService.sign(payload),
      };
    }
  }
}
