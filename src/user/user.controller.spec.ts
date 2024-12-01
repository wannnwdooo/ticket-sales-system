import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../auth/enums';
import { AddRoleDto, UserViewDto } from './dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findAll: jest.fn(),
      findOneById: jest.fn(),
      setRole: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users: UserViewDto[] = [
        {
          id: '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
          email: 'test@example.com',
          role: Role.USER,
          transactions: [],
          bookings: [],
        },
      ];
      userService.findAll?.mockResolvedValue(users);

      const result = await userController.getUsers();
      expect(result).toEqual(users);
      expect(userService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUser', () => {
    it('should return a single user', async () => {
      const user: UserViewDto = {
        id: '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
        email: 'test@example.com',
        role: Role.USER,
        transactions: [],
        bookings: [],
      };
      userService.findOneById?.mockResolvedValue(user);

      const result = await userController.getUser('1');
      expect(result).toEqual(user);
      expect(userService.findOneById).toHaveBeenCalledWith('1');
      expect(userService.findOneById).toHaveBeenCalledTimes(1);
    });
  });

  describe('setRole', () => {
    it('should update the role of a user', async () => {
      const updatedUser: UserViewDto = {
        id: '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
        email: 'test@example.com',
        role: Role.USER,
        transactions: [],
        bookings: [],
      };
      const dto: AddRoleDto = { role: Role.ADMIN };
      userService.setRole?.mockResolvedValue(updatedUser);

      const result = await userController.setRole(
        dto,
        '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
      );
      expect(result).toEqual(updatedUser);
      expect(userService.setRole).toHaveBeenCalledWith(
        dto,
        '19fbf0b3-66f5-48d9-bbf0-b366f588d985',
      );
      expect(userService.setRole).toHaveBeenCalledTimes(1);
    });
  });
});
