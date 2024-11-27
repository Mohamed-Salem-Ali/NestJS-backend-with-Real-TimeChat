import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  async createPost(createPostDto: CreatePostDto) {
    const newPost = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        userId: createPostDto.userId,
      },
    });

    return newPost;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    try {
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: { ...updatePostDto },
      });
      return updatedPost;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
      throw error; // Handle other errors
    }
  }

  async getAllPosts() {
    return this.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        userId: true,
      },
    });
  }

  async getPostById(id: number) {
    return this.prisma.post.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        userId: true,
      },
    });
  }

  async deletePost(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
  async getPostsByUserId(userId: number) {
    return this.prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
