import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/AuthModule';
import { UserModule } from '../user/UserModule';
import { MongooseModule } from '@nestjs/mongoose';
import * as Autopopulate from 'mongoose-autopopulate'
import { SharedModule } from '../shared/SharedModule';
import { DbModule } from '../db/DbModule';
import { RoleModule } from '../role/RoleModule';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                connectionFactory: (connection: { plugin: any }): any => {
                    connection.plugin(Autopopulate);
                    return connection;
                },
                uri: configService.get<string>('MONGODB_URI')
            }),
            inject: [ConfigService]
        }),
        AuthModule,
        UserModule,
        SharedModule,
        DbModule,
        RoleModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
