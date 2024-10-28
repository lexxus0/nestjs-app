import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SessionsService } from 'src/sessions/sessions.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.schema';
import { Session } from 'src/sessions/sessions.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let sessionsService: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: SessionsService,
          useValue: {
            createSession: jest.fn(),
            deleteSession: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    sessionsService = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('registerUser', () => {
    it('should create a new user', async () => {
      const payload = {
        email: 'test@example.com',
        name: 'Test',
        password: 'password',
      };
      const encryptedPassword = await bcrypt.hash(payload.password, 10);

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue({
        _id: 'userId',
        ...payload,
        password: encryptedPassword,
      } as Partial<User> as User);

      const result = await authService.registerUser(payload);
      expect(result).toHaveProperty('email', payload.email);
      expect(usersService.create).toHaveBeenCalledWith({
        ...payload,
        password: encryptedPassword,
      });
    });

    it('should throw conflict exception if email is already in use', async () => {
      const payload = {
        email: 'test@example.com',
        name: 'Test',
        password: 'password',
      };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        _id: 'userId',
        ...payload,
      } as Partial<User> as User);

      await expect(authService.registerUser(payload)).rejects.toThrowError(
        'Email in use',
      );
    });
  });

  describe('loginUser', () => {
    it('should login a user with correct credentials', async () => {
      const payload = { email: 'test@example.com', password: 'password' };
      const user = {
        _id: 'userId',
        email: payload.email,
        password: await bcrypt.hash(payload.password, 10),
      };

      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(user as Partial<User> as User);
      jest.spyOn(sessionsService, 'createSession').mockResolvedValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      } as Partial<Session> as Session);

      const result = await authService.loginUser(payload);
      expect(result).toHaveProperty('accessToken');
      expect(sessionsService.createSession).toHaveBeenCalledWith(
        user._id.toString(),
      );
    });

    it('should throw unauthorized exception for incorrect credentials', async () => {
      const payload = { email: 'test@example.com', password: 'wrongPassword' };
      const user = {
        _id: 'userId',
        email: payload.email,
        password: await bcrypt.hash('correctPassword', 10),
      };

      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(user as Partial<User> as User);

      await expect(authService.loginUser(payload)).rejects.toThrowError(
        'Unauthorized',
      );
    });
  });
});
