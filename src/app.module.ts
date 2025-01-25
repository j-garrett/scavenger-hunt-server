import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from './auth/auth.module'
import { Hunt } from './hunts/entities/hunt.entity'
import { HuntStep } from './hunts/entities/hunt-step.entity'
import { HuntStepAnswer } from './hunts/entities/hunt-step-answer.entity'
import { HuntsModule } from './hunts/hunts.module'
import { UserEntity } from './users/entities/user.entity'
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
        const isTest = configService.get<string>('NODE_ENV') === 'test'
        console.log('isTest:', isTest)
        return {
          autoLoadEntities: true,
          database: isTest
            ? ':memory:'
            : configService.get<string>('POSTGRES_DB'),
          entities: [Hunt, HuntStep, HuntStepAnswer, UserEntity],
          logging: !isTest,
          synchronize: true,
          type: isTest ? 'sqlite' : 'postgres',
          ...(isTest
            ? {}
            : {
                host: configService.get<string>('POSTGRES_HOST'),
                password: configService.get<string>('POSTGRES_PASSWORD'),
                port: configService.get<number>('POSTGRES_PORT'),
                username: configService.get<string>('POSTGRES_USER'),
              }),
        }
      },
    }),
    HuntsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
