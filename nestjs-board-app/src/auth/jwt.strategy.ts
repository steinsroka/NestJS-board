import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository, // Token이 유효한지 확인 후, Payload의 유저 이름으로 DB객체를 가져오기 위해 Repository injection 사용
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // bearer token 타입으로 넘어갈거임
    });
  }

  async validate(payload) {
    const { username } = payload;
    const user: User = await this.userRepository.findOne({ username }); // payload 로 온 데이터가 db에 있는지?

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

/**
 * 각각의 미들웨어가 불러지는 순서
 * middleware -> guard -> interceptor (before) -> pipe -> controller -> service
 * -> controller -> interceptor (affter) -> filter (if applicable) -> client
 */
