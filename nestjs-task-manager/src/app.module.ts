import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dirname, join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { User } from './auth/user.entity';
import { Status } from './status/status.entity';
import { Task } from './tasks/task.entity';
import { TaskStatus } from './tasks/task-status.enum';
import { StatusModule } from './status/status.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'../..', 'client', 'dist')
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema:configValidationSchema,
      isGlobal: true,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => {
        return {
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username:configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        // entities: [dirname + './tasks/task.entity{.ts,.js}'],
        entities: [User, Status, Task],
        synchronize: true,
        }
      }
    }),
    AuthModule,
    StatusModule
  ],
})
export class AppModule {}
