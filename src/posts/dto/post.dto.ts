// src/posts/dto/create-post.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  @ApiProperty({ description: 'The title of the post' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty({ description: 'The content of the post' }) 
  content: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'The Id for user who write the post' })
  userId: number;  // Assumes userId is required to associate the post with a user
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(100)
  @ApiPropertyOptional({ description: 'The  new title of the post' })
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @ApiPropertyOptional({ description: 'The  new content of the post' })
  content?: string;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The new Id for user who write the post' })
  userId?: number;  // Optional userId in case you want to reassign the post to a different user
}