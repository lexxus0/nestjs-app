import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './sessions.schema';

describe('SessionsService', () => {
  let sessionsService: SessionsService;
  let sessionModel: Model<Session>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getModelToken(Session.name),
          useValue: {
            create: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    sessionsService = module.get<SessionsService>(SessionsService);
    sessionModel = module.get<Model<Session>>(getModelToken(Session.name));
  });

  it('should be defined', () => {
    expect(sessionsService).toBeDefined();
  });

  describe('createSession', () => {
    it('should create a new session', async () => {
      const userId = 'userId';
      const sessionData = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest.spyOn(sessionModel, 'create').mockResolvedValue(sessionData as any);

      const result = await sessionsService.createSession(userId);
      expect(result).toEqual(sessionData);
      expect(sessionModel.create).toHaveBeenCalled();
    });
  });

  describe('deleteSession', () => {
    it('should delete a session by id', async () => {
      const sessionId = 'sessionId';
      jest
        .spyOn(sessionModel, 'deleteOne')
        .mockResolvedValue({ deletedCount: 1 } as any);

      await sessionsService.deleteSession(sessionId);
      expect(sessionModel.deleteOne).toHaveBeenCalledWith({ _id: sessionId });
    });
  });
});
