import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/UserModule';
import { AuthController } from './controllers/AuthController';
import { LocalStrategy } from './strategies/LocalStrategy';
import { AuthLogic } from './providers/AuthLogic';
import { JwtStrategy } from './strategies/JwtStrategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET_API'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION_TIME_API')}s`
                },
            }),
        })],
    providers: [AuthLogic, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
