// user.dto.ts
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsInt,
  IsDate,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateUserDto {
  @IsInt()
  @IsOptional() // Optional if auto-generated by the database
  id?: number;

  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @MaxLength(20, { message: 'Username can be a maximum of 20 characters' })
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])?[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number. Special characters are optional. The password should be at least 8 characters long.',
    },
  )
  @ApiProperty({ description: 'The password for the user account' })
  password: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @IsDate()
  @IsOptional()
  createdTime?: Date;
}

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @MaxLength(20, { message: 'Username can be a maximum of 20 characters' })
  @ApiProperty({ description: 'The new username of the user' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ description: 'The new email of the user' })
  email?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])?[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number. Special characters are optional. The password should be at least 8 characters long.',
    },
  )
  @ApiProperty({ description: 'The new password for the user account' })
  password?: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ description: 'The username for login' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ description: 'The password for login' })
  password: string;
}
export class UserResponseDto {
  @IsInt()
  id: number;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsDate()
  createdTime?: Date;
}
