import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SessionsService } from 'src/sessions/sessions.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  async registerUser(payload: {
    name: string;
    email: string;
    password: string;
  }) {
    const isUser = await this.usersService.findByEmail(payload.email);
    if (isUser) throw new ConflictException('Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = await this.usersService.create({
      ...payload,
      password: encryptedPassword,
    });

    const userData = { ...newUser.toObject() };
    delete userData.password;
    return userData;
  }

  async loginUser(payload: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(payload.email);
    if (user === null) throw new UnauthorizedException('User not found');

    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) throw new UnauthorizedException('Unauthorized');

    return this.sessionsService.createSession(user._id.toString());
  }

  async logoutUser(sessionId: string) {
    await this.sessionsService.deleteSession(sessionId);
  }

  async refreshUsersSession(sessionId: string, refreshToken: string) {
    const session = await this.sessionsService.findSession(
      sessionId,
      refreshToken,
    );

    if (session === null) throw new UnauthorizedException('Session not found');

    if (new Date() > new Date(session.refreshTokenValidUntil)) {
      throw new UnauthorizedException('Session token expired');
    }

    await this.sessionsService.deleteSession(sessionId);
    return this.sessionsService.createSession(session.userId.toString());
  }
}
