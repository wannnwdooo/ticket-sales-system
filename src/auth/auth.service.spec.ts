import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Config } from '../infrastructure/config';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { compareEncryptedData } from '../utils';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { LoginDto } from './dto';
import { Role } from './enums';
import { Tokens } from './types';

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  compareEncryptedData: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUserService = () => ({
    findOneByEmail: jest.fn(),
    update: jest.fn(),
  });

  const mockJwtService = () => ({
    signAsync: jest.fn(),
  });

  const mockConfig = {
    jwt: {
      access: 'accessSecret',
      refresh: 'refreshSecret',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useFactory: mockUserService },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: Config, useValue: mockConfig },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);

    // Mock the compareEncryptedData function
    (compareEncryptedData as jest.Mock).mockImplementation((raw, hashed) => {
      return raw === 'password' && hashed === 'hashedPassword';
    });
  });

  it('should return tokens and user', async () => {
    const user: User = {
      id: '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: Role.USER,
      refreshToken: '',
      bookings: [],
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const tokens: Tokens = {
      accessToken: ACCESS_TOKEN,
      refreshToken: REFRESH_TOKEN,
    };

    userService.findOneByEmail.mockResolvedValueOnce(user);
    jwtService.signAsync
      .mockResolvedValueOnce(tokens.accessToken)
      .mockResolvedValueOnce(tokens.refreshToken);

    const dto: LoginDto = { email: 'test@example.com', password: 'password' };
    const result = await authService.login(dto);

    expect(result).toEqual({
      tokens,
      user: expect.objectContaining({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
    });

    expect(userService.findOneByEmail).toHaveBeenCalledWith(dto.email);
    expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
  });
});
