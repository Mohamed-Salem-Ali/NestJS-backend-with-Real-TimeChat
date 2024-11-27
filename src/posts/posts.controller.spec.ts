import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { NotFoundException } from '@nestjs/common';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            createPost: jest.fn(),
            getAllPosts: jest.fn(),
            getPostById: jest.fn(),
            updatePost: jest.fn(),
            deletePost: jest.fn(),
            getPostsByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        content: 'Post content',
        userId: 1,
      };
      const result = { id: 1, ...createPostDto, createdAt: new Date() };

      jest.spyOn(service, 'createPost').mockResolvedValue(result);

      expect(await controller.createPost(createPostDto)).toEqual(result);
    });

    it('should throw an error when creation fails', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        content: 'Post content',
        userId: 1,
      };
      jest
        .spyOn(service, 'createPost')
        .mockRejectedValue(new Error('Post creation failed'));

      try {
        await controller.createPost(createPostDto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Post creation failed');
      }
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const posts = [
        { id: 1, title: 'Post 1', content: 'Content 1', userId: 1 },
        { id: 2, title: 'Post 2', content: 'Content 2', userId: 2 },
      ];
      jest.spyOn(service, 'getAllPosts').mockResolvedValue(posts);

      expect(await controller.getAllPosts()).toEqual(posts);
    });
  });

  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const post = { id: 1, title: 'Post 1', content: 'Content 1', userId: 1 };
      jest.spyOn(service, 'getPostById').mockResolvedValue(post);

      expect(await controller.getPostById('1')).toEqual(post);
    });

    it('should throw an error if post not found', async () => {
      jest
        .spyOn(service, 'getPostById')
        .mockRejectedValue(new NotFoundException('Post not found'));

      try {
        await controller.getPostById('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Post not found');
      }
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const updatedPost = {
        id: 1,
        title: 'Updated Title',
        content: 'Updated Content',
        userId: 1,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'updatePost').mockResolvedValue(updatedPost);

      expect(await controller.updatePost('1', updatePostDto)).toEqual(
        updatedPost,
      );
    });

    it('should throw an error if post not found for update', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      jest
        .spyOn(service, 'updatePost')
        .mockRejectedValue(new NotFoundException('Post not found'));

      try {
        await controller.updatePost('1', updatePostDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Post not found');
      }
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      const post = {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        userId: 1,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'deletePost').mockResolvedValue(post);

      expect(await controller.deletePost('1')).toEqual(post);
    });

    it('should throw an error if post not found for deletion', async () => {
      jest
        .spyOn(service, 'deletePost')
        .mockRejectedValue(new NotFoundException('Post not found'));

      try {
        await controller.deletePost('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Post not found');
      }
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
      jest.spyOn(service, 'getPostsByUserId').mockResolvedValue(posts);

      expect(await controller.getPostsByUserId(1)).toEqual(posts);
    });

    it('should return an empty array if no posts found for user', async () => {
      jest.spyOn(service, 'getPostsByUserId').mockResolvedValue([]);

      expect(await controller.getPostsByUserId(1)).toEqual([]);
    });
  });
});
