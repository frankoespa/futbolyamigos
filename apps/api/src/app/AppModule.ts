import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/AuthModule';
import { UserModule } from '../user/UserModule';
import { MongooseModule } from '@nestjs/mongoose';
import * as Autopopulate from 'mongoose-autopopulate'
import { SharedModule } from '../shared/SharedModule';
import { DbModule } from '../db/DbModule';
import { RoleModule } from '../role/RoleModule';
import { TorneoModule } from '../torneo/TorneoModule';
import { CanchaModule } from '../cancha/CanchaModule';
import { EquipoModule } from '../equipo/EquipoModule';
import { JugadorModule } from '../jugador/JugadorModule';
import { PartidoModule } from '../partido/PartidoModule';
import { GolModule } from '../gol/GolModule';
import { TarjetaModule } from '../tarjeta/TarjetaModule';
import { SancionModule } from '../sancion/SancionModule';

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
        RoleModule,
        TorneoModule,
        CanchaModule,
        EquipoModule,
        JugadorModule,
        PartidoModule,
        GolModule,
        TarjetaModule,
        SancionModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
