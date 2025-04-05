import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAdminByPhone(phone: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({
      where: { phone },
    });

    if (user && user.role === 'admin') {
      return user;
    }
    return null;
  }
}
