import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Task } from 'src/tasks/task.entity';
import { Status } from 'src/status/status.entity';
import { TaskRepository } from 'src/tasks/tasks.repository';
import { StatusRepository } from 'src/status/status.repository';
import { AuthRepository } from './users.repository';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Task, Status]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => (
        {secret: configService.get('JWT_SECRET'),
        signOptions: {
        expiresIn: 3600
      }
     }) 
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthRepository, TaskRepository, StatusRepository],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule ]
})
export class AuthModule {}
