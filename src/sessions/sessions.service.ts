import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './sessions.schema';
import { randomBytes } from 'crypto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  private CreateTokens() {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), //15min
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30days
    };
  }

  async createSession(userId: string) {
    const tokens = this.CreateTokens();
    return this.sessionModel.create({ userId, ...tokens });
  }

  async deleteSession(sessiondId: string) {
    await this.sessionModel.deleteOne({ _id: sessiondId });
  }

  async findSession(sessionId: string, refreshToken: string) {
    return this.sessionModel.findOne({ _id: sessionId, refreshToken }).exec();
  }
}
