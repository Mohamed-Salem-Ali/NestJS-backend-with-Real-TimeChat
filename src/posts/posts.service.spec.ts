import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createPost', () => {
    it('should create a post and return it', async () => {
      const createPostDto = {
        title: 'Post Title',
        content: 'Post Content',
        userId: 1,
      };
      const newPost = { id: 1, ...createPostDto, createdAt: new Date() };

      jest.spyOn(prisma.post, 'create').mockResolvedValue(newPost);

      const result = await service.createPost(createPostDto);
      expect(prisma.post.create).toHaveBeenCalledWith({
        data: { ...createPostDto },
      });
      expect(result).toEqual(newPost);
    });
  });

  describe('updatePost', () => {
    it('should update and return the post', async () => {
      const id = 1;
      const updatePostDto = {
        title: 'Updated Post Title',
        content: 'Updated Content',
        userId: 1,
      };
      const updatedPost = { id, ...updatePostDto, createdAt: new Date() };

      jest.spyOn(prisma.post, 'update').mockResolvedValue(updatedPost);

      const result = await service.updatePost(id, updatePostDto);
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id },
        data: { ...updatePostDto },
      });
      expect(result).toEqual(updatedPost);
    });

    it('should throw NotFoundException if post is not found', async () => {
      const id = 999;
      const updatePostDto = {
        title: 'Updated Post Title',
        content: 'Updated Content',
      };

      jest
        .spyOn(prisma.post, 'update')
        .mockRejectedValueOnce({ code: 'P2025' });

      await expect(service.updatePost(id, updatePostDto)).rejects.toThrowError(
        new NotFoundException(`Post with id ${id} not found`),
      );
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const posts = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          userId: 1,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Post 2',
          content: 'Content 2',
          userId: 1,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prisma.post, 'findMany').mockResolvedValue(posts);

      const result = await service.getAllPosts();
      expect(prisma.post.findMany).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });
  });

  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const post = {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        userId: 1,
        createdAt: new Date(),
      };
      jest.spyOn(prisma.post, 'findUniqueOrThrow').mockResolvedValue(post);

      const result = await service.getPostById(1);
      expect(prisma.post.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, title: true, content: true, userId: true },
      });
      expect(result).toEqual(post);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const id = 1;
      const post = {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        userId: 1,
        createdAt: new Date(),
      };
      jest.spyOn(prisma.post, 'delete').mockResolvedValue(post);

      await service.deletePost(id);
      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('getPostsByUserId', () => {
    it('should return posts by user ID', async () => {
      const posts = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          userId: 1,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Post 2',
          content: 'Content 2',
          userId: 1,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prisma.post, 'findMany').mockResolvedValue(posts);

      const result = await service.getPostsByUserId(1);
      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(posts);
    });
  });
});
