import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { SancionRepository } from "../repository/SancionRepository";
import { Connection, Types } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { Jugador } from "../../jugador/schema/JugadorSchema";
import { JugadorDomain } from "../../jugador/domain/JugadorDomain";
import { Tarjetas, LineaSancionadoVM } from "@futbolyamigos/data";
import { Partido } from "../../partido/schema/PartidoSchema";
import { Sancion } from "../schema/SancionSchema";

@Injectable()
export class SancionLogic {

    constructor (
        private readonly sancionRepository: SancionRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private readonly connection: Connection) {}

    public async ObtenerSancionados (torneoID: Types.ObjectId): Promise<LineaSancionadoVM[]> {

        const tablaSancionados: LineaSancionadoVM[] = [];

        const listaIDsJugadoresSancionadosDelTorneo = await this.sancionRepository
            .Query()
            .find({
                Torneo: new Types.ObjectId(torneoID)
            })
            .distinct('Jugador')
            .exec();

        let IDsJugadoresSancionadosDelTorneo: string[] = [];
        IDsJugadoresSancionadosDelTorneo = [...new Set([...listaIDsJugadoresSancionadosDelTorneo.map(i => i.toString())])];

        for (const jugadorSancionadoID of IDsJugadoresSancionadosDelTorneo)
        {
            const jugador = await this.documentLoaderService.GetById<Jugador, JugadorDomain>(Jugador.name, JugadorDomain, new Types.ObjectId(jugadorSancionadoID));

            const listaIDsEquiposDelJugador = await this.sancionRepository
                .Query()
                .find({
                    Torneo: new Types.ObjectId(torneoID),
                    Jugador: new Types.ObjectId(jugadorSancionadoID)
                })
                .distinct('Equipo')
                .exec();

            let IDsEquiposDelJugador: string[] = [];
            IDsEquiposDelJugador = [...new Set([...listaIDsEquiposDelJugador.map(i => i.toString())])];

            for (const equipoSancionadoID of IDsEquiposDelJugador)
            {
                let sanciones = await this.sancionRepository
                    .Query()
                    .find({
                        Torneo: new Types.ObjectId(torneoID),
                        Jugador: new Types.ObjectId(jugadorSancionadoID),
                        Equipo: new Types.ObjectId(equipoSancionadoID)
                    })
                    .exec();

                sanciones = sanciones.sort((a, b) => b.Partido.NroFecha - a.Partido.NroFecha);

                if (sanciones.length > 0 &&
                    (sanciones[0].Tarjeta._id === Tarjetas.Roja || sanciones[0].Tarjeta._id === Tarjetas.RojaDobleAmarilla))
                {
                    const sancionParaAnalizar: Sancion = sanciones[0];
                    let ultimaFechaJugada: number = null;

                    const partidosJugados = await this.documentLoaderService
                        .Query<Partido>(Partido.name)
                        .find({
                            Torneo: new Types.ObjectId(torneoID),
                            ResultadoLocal: {
                                $ne: null
                            },
                            ResultadoVisitante: {
                                $ne: null
                            },
                            $or: [
                                {
                                    EquipoLocal: sancionParaAnalizar.Equipo._id
                                },
                                {
                                    EquipoVisitante: sancionParaAnalizar.Equipo._id
                                }
                            ]
                        })
                        .sort({
                            NroFecha: -1
                        })
                        .exec();

                    ultimaFechaJugada = partidosJugados.length == 0 ? null : partidosJugados[0].NroFecha;

                    const esSancionCumplida: boolean = ultimaFechaJugada >= (sancionParaAnalizar.Partido.NroFecha + sancionParaAnalizar.TotalFechas);

                    if (esSancionCumplida) break;

                    const fechasRestantes: number = Math.abs(ultimaFechaJugada - (sancionParaAnalizar.Partido.NroFecha + sancionParaAnalizar.TotalFechas));

                    const fechasCumplidas: number = sancionParaAnalizar.TotalFechas - fechasRestantes;

                    tablaSancionados.push({
                        NroLinea: tablaSancionados.length + 1,
                        NombreJugador: `${jugador.Doc.Nombres} ${jugador.Doc.Apellidos}`,
                        NombreEquipo: sancionParaAnalizar.Equipo.Nombre,
                        FechasCumplidas: fechasCumplidas,
                        FechasRestantes: fechasRestantes,
                        TotalFechas: sancionParaAnalizar.TotalFechas,
                        Descripcion: `Sancionado por tarjeta roja (Fecha Nro. ${sancionParaAnalizar.Partido.NroFecha})`
                    })
                } else if (sanciones.length > 0 &&
                    (sanciones[0].Tarjeta._id === Tarjetas.Amarilla))
                {
                    const sancionDeAmarillaParaAnalizar: Sancion = sanciones[0];

                    const totalTarjetasAmarillas: number = sanciones.filter(s => s.Tarjeta._id === Tarjetas.Amarilla).length;

                    if ((totalTarjetasAmarillas % 5) === 0)
                    {
                        let ultimaFechaJugada: number = null;

                        const partidosJugados = await this.documentLoaderService
                            .Query<Partido>(Partido.name)
                            .find({
                                Torneo: new Types.ObjectId(torneoID),
                                ResultadoLocal: {
                                    $ne: null
                                },
                                ResultadoVisitante: {
                                    $ne: null
                                },
                                $or: [
                                    {
                                        EquipoLocal: sancionDeAmarillaParaAnalizar.Equipo._id
                                    },
                                    {
                                        EquipoVisitante: sancionDeAmarillaParaAnalizar.Equipo._id
                                    }
                                ]
                            })
                            .sort({
                                NroFecha: -1
                            })
                            .exec();

                        ultimaFechaJugada = partidosJugados.length == 0 ? null : partidosJugados[0].NroFecha;

                        const esSancionCumplida: boolean = ultimaFechaJugada >= (sancionDeAmarillaParaAnalizar.Partido.NroFecha + 1);

                        if (esSancionCumplida) break;

                        const fechasRestantes: number = Math.abs(ultimaFechaJugada - (sancionDeAmarillaParaAnalizar.Partido.NroFecha + 1));

                        const fechasCumplidas: number = 1 - fechasRestantes;


                        tablaSancionados.push({
                            NroLinea: tablaSancionados.length + 1,
                            NombreJugador: `${jugador.Doc.Nombres} ${jugador.Doc.Apellidos}`,
                            NombreEquipo: sancionDeAmarillaParaAnalizar.Equipo.Nombre,
                            FechasCumplidas: fechasCumplidas,
                            FechasRestantes: fechasRestantes,
                            TotalFechas: 1,
                            Descripcion: `Sancionado por acumulación de 5 tarjetas amarillas (Fecha Nro. ${sancionDeAmarillaParaAnalizar.Partido.NroFecha})`
                        })
                    }

                }
            }

        }

        tablaSancionados.sort((a, b) => b.NroLinea - a.NroLinea);

        return tablaSancionados;
    }


}