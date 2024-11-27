import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Use env variable in production
    });
  }

  async validate(payload: any): Promise<User> {
    console.log(payload);
    const user = await this.usersService.getUserByUsername(payload.username); // Assuming 'sub' is the user ID
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // The user will be available in the request object
  }
}
