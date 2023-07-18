import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    await this.validateCreateUserDto(dto);
    return this.usersRepository.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
  }

  private async validateCreateUserDto(dto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: dto.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists!');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials not valid!');
    }
    return user;
  }

  async getUser(dto: GetUserDto) {
    return this.usersRepository.findOne(dto);
  }
}
