import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RoundsModule } from './rounds/rounds.module';
import { UserRepository } from './users/users.repository';
import { RoundRepository } from './rounds/rounds.repository';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';

@Module({
  imports:  [TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 1234,
      username: 'postgres', 
      password: 'postgres', 
      database: 'postgres', 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }), UsersModule, RoundsModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
