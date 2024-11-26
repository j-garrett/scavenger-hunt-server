import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HuntsModule } from './hunts/hunts.module';
import { Hunt } from './hunts/entities/hunt.entity';

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
          entities: [Hunt],
          subscribers: [],
          migrations: [],
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    HuntsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
