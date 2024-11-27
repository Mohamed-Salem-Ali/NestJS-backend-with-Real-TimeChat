import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ChatGateway } from './live-chat/chat.gateway';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the config globally accessible in all modules
    }),
    UsersModule,
    UsersModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ChatGateway],
  exports: [PrismaService],
})
export class AppModule {}
