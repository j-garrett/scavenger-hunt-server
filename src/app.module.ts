import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Hunt } from './hunts/entities/hunt.entity'
import { HuntStep } from './hunts/entities/hunt-step.entity'
import { HuntStepAnswer } from './hunts/entities/hunt-step-answer.entity'
import { HuntsModule } from './hunts/hunts.module'
import { User } from './users/entities/user.entity'
import { UsersModule } from './users/users.module'

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the ConfigModule available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          // TODO: autoLoadEntities sounds dangerous for prod DB
          autoLoadEntities: true,
          database: 'scavenger',
          entities: [Hunt, HuntStep, HuntStepAnswer, User],
          host: 'localhost',
          logging: true,
          migrations: [],
          password: configService.get<string>('POSTGRES_PASSWORD'),
          port: 5432,
          subscribers: [],
          synchronize: true,
          type: 'postgres',
          username: 'postgres',
        }
      },
    }),
    HuntsModule,
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}
