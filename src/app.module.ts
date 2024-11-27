import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HuntsModule } from './hunts/hunts.module';
import { Hunt } from './hunts/entities/hunt.entity';
import { HuntStepAnswer } from './hunts/entities/hunt-step-answer.entity';
import { HuntStep } from './hunts/entities/hunt-step.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the ConfigModule available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: 'scavenger',
          synchronize: true,
          logging: true,
          entities: [Hunt, HuntStep, HuntStepAnswer, User],
          subscribers: [],
          migrations: [],
          // TODO: autoLoadEntities sounds dangerous for prod DB
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    HuntsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
