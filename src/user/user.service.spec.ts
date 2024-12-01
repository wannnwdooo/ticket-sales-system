import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../auth/enums';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;

  beforeEach(async () => {
    userRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
          email: 'test@example.com',
          role: Role.USER,
        },
      ];
      userRepository.find?.mockResolvedValue(users);

      const result = await userService.findAll();
      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should return a user if found', async () => {
      const user = {
        id: '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
        email: 'test@example.com',
        role: Role.USER,
      };
      userRepository.findOne?.mockResolvedValue(user);

      const result = await userService.findOneById(
        '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
      );
      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '19fbf0b3-66f5-48d9-bbf0-b366f588d985' },
        select: ['id', 'email', 'role'],
        relations: { bookings: true, transactions: true },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne?.mockResolvedValue(null);

      await expect(userService.findOneById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('setRole', () => {
    it("should update a user's role", async () => {
      const user = {
        id: '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
        email: 'test@example.com',
        role: Role.USER,
      };
      const updatedUser = { ...user, role: 'ADMIN' };
      userRepository.findOne?.mockResolvedValue(user);
      userRepository.save?.mockResolvedValue(updatedUser);

      const result = await userService.setRole(
        { role: Role.ADMIN },
        '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
      );
      expect(result).toEqual(updatedUser);
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    });
  });
});
