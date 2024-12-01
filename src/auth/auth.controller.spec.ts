import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UserViewDto } from '../user/dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { LoginDto, RegistrationDto } from './dto';
import { Role } from './enums';
import { Tokens } from './types';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    authService = {
      registration: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      refresh: jest.fn(),
    };

    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('registration', () => {
    it('should register a user and return a success message', async () => {
      const registrationDto: RegistrationDto = {
        email: 'test@example.com',
        password: 'password',
      };
      authService.registration?.mockResolvedValueOnce(undefined);

      const result = await authController.registration(registrationDto);

      expect(result).toEqual({
        message: 'You have successfully registered. Now you can log in',
      });
      expect(authService.registration).toHaveBeenCalledWith(registrationDto);
    });
  });

  describe('login', () => {
    it('should log in a user and set tokens in cookies', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const tokens: Tokens = {
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
      };
      const user: UserViewDto = {
        id: '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
        email: 'test@example.com',
        role: Role.USER,
        transactions: [],
        bookings: [],
      };
      authService.login?.mockResolvedValueOnce({ tokens, user });

      const result = await authController.login(
        loginDto,
        mockResponse as Response,
      );

      expect(result).toEqual(user);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        ACCESS_TOKEN,
        tokens.accessToken,
        expect.any(Object),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN,
        tokens.refreshToken,
        expect.any(Object),
      );
    });
  });

  describe('logout', () => {
    it('should log out a user and clear cookies', async () => {
      const userId = '19fbf0b3-66f5-48d9-bbf0-b366f588d985';
      authService.logout?.mockResolvedValueOnce(undefined);

      const result = await authController.logout(
        mockResponse as Response,
        userId,
      );

      expect(result).toEqual({ message: 'You have successfully logged out' });
      expect(authService.logout).toHaveBeenCalledWith(userId);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(ACCESS_TOKEN);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN, {
        path: '**/auth/refresh',
      });
    });
  });

  describe('refresh', () => {
    it('should refresh tokens and set new ones in cookies', async () => {
      const userId = '1';
      const refreshToken = 'refreshToken';
      const tokens: Tokens = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };
      authService.refresh?.mockResolvedValueOnce(tokens);

      const result = await authController.refresh(
        refreshToken,
        userId,
        mockResponse as Response,
      );

      expect(result).toEqual({ message: 'New pair of tokens issued' });
      expect(authService.refresh).toHaveBeenCalledWith(refreshToken, userId);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        ACCESS_TOKEN,
        tokens.accessToken,
        expect.any(Object),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN,
        tokens.refreshToken,
        expect.any(Object),
      );
    });
  });
});
