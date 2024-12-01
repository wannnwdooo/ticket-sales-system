import { plainToInstance } from 'class-transformer';
import { UserViewDto } from '../../user/dto';
import { User } from '../../user/entities/user.entity';

export function mapToViewLogin(user: User): UserViewDto {
  return plainToInstance(UserViewDto, user, {
    excludeExtraneousValues: true,
  });
}
