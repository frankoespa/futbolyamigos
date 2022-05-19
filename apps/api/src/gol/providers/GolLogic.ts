import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { GolRepository } from "../repository/GolRepository";
import { Connection, Types } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { LineaGoleadorVM } from "@futbolyamigos/data";
import { JugadorDomain } from "../../jugador/domain/JugadorDomain";
import { Jugador } from "../../jugador/schema/JugadorSchema";
import { Equipo } from "../../equipo/schema/EquipoSchema";
import { EquipoDomain } from "../../equipo/domain/EquipoDomain";

@Injectable()
export class GolLogic {

    constructor (
        private readonly golRepository: GolRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private readonly connection: Connection) {}

    async ObtenerGoleadores (torneoID: Types.ObjectId): Promise<LineaGoleadorVM[]> {

        const tablaGoleadores: LineaGoleadorVM[] = [];

        const listaIDsJugadoresDelTorneo = await this.golRepository
            .Query()
            .find({
                Torneo: new Types.ObjectId(torneoID)
            })
            .distinct('Jugador')
            .exec();

        let IDsJugadoresDelTorneo: string[] = [];
        IDsJugadoresDelTorneo = [...new Set([...listaIDsJugadoresDelTorneo.map(i => i.toString())])];

        for (const jugadorID of IDsJugadoresDelTorneo)
        {

            const jugador = await this.documentLoaderService.GetById<Jugador, JugadorDomain>(Jugador.name, JugadorDomain, new Types.ObjectId(jugadorID));

            const listaIDsEquiposDelTorneo = await this.golRepository
                .Query()
                .find({
                    Torneo: new Types.ObjectId(torneoID),
                    Jugador: new Types.ObjectId(jugadorID)
                })
                .distinct('Equipo')
                .exec();

            let IDsEquiposDelTorneo: string[] = [];
            IDsEquiposDelTorneo = [...new Set([...listaIDsEquiposDelTorneo.map(i => i.toString())])];

            for (const equipoID of IDsEquiposDelTorneo)
            {
                let CANTIDAD = 0;

                const equipo = await this.documentLoaderService.GetById<Equipo, EquipoDomain>(Equipo.name, EquipoDomain, new Types.ObjectId(equipoID));

                const listaGoles = await this.golRepository
                    .Query()
                    .find({
                        Torneo: new Types.ObjectId(torneoID),
                        Jugador: new Types.ObjectId(jugadorID),
                        Equipo: new Types.ObjectId(equipoID)
                    })
                    .exec();

                listaGoles.forEach(i => {
                    CANTIDAD += i.Cantidad
                })

                tablaGoleadores.push({
                    Posicion: tablaGoleadores.length + 1,
                    NombreJugador: `${jugador.Doc.Nombres} ${jugador.Doc.Apellidos}`,
                    NombreEquipo: equipo.Doc.Nombre,
                    Cantidad: CANTIDAD
                })

            }

        }

        tablaGoleadores.sort((a, b) => b.Cantidad - a.Cantidad);

        tablaGoleadores.forEach((l, index) => {
            l.Posicion = index + 1
        })

        return tablaGoleadores;

    }


}