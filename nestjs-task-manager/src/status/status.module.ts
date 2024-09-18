import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { Status } from './status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
     TypeOrmModule.forFeature([Status]),
     AuthModule
  ],
  controllers: [StatusController],
  providers: [StatusService]
})
export class StatusModule {}
