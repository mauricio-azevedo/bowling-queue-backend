import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateAdminCredentials(phone: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Admin user not found');
    }
    // Compare the password (assuming you store hashed passwords)
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

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
