import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: 'DATABASE_POOL',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('Attempting to connect to PostgreSQL...');

        const pool = new Pool({
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          user: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
        });

        try {
          await pool.connect(); // Test connection
          console.log('Connected to PostgreSQL!');
        } catch (error) {
          console.error('Failed to connect to PostgreSQL:', error);
          throw error; // Let NestJS handle the failure
        }

        return pool;
      },
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
