import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { Partido } from "../schema/PartidoSchema";
import { PartidoDomain } from "../domain/PartidoDomain";
import { PartidoRepository } from "../repository/PartidoRepository";
import { RegistrarPartidoDTO } from "../dtos/RegistrarPartidoDTO";
import { Messages, PartidoResultadoDataView, RegistrarPartidoVM, RegistrarGolVM, RegistrarSancionVM, LineaTabla } from "@futbolyamigos/data";
import { Types, Connection } from "mongoose";
import { Equipo } from "../../equipo/schema/EquipoSchema";
import { ValidationException } from "../../global/base/exceptions/ValidationException";
import { InjectConnection } from "@nestjs/mongoose";
import { EquipoDomain } from "../../equipo/domain/EquipoDomain";
import { RegistrarPartidoVO } from "../valueObjects/RegistrarPartidoVO";
import { Cancha } from "../../cancha/schema/CanchaSchema";
import { CanchaDomain } from "../../cancha/domain/CanchaDomain";
import { Torneo } from "../../torneo/schema/TorneoSchema";
import { TorneoDomain } from "../../torneo/domain/TorneoDomain";
import { Gol } from "../../gol/schema/GolSchema";
import { GolDomain } from "../../gol/domain/GolDomain";
import { Jugador } from "../../jugador/schema/JugadorSchema";
import { JugadorDomain } from "../../jugador/domain/JugadorDomain";
import { RegistrarGolVO } from "../../gol/valueObjects/RegistrarGolVO";
import { Sancion } from "../../sancion/schema/SancionSchema";
import { SancionDomain } from "../../sancion/domain/SancionDomain";
import { RegistrarSancionVO } from "../../sancion/valueObjects/RegistrarSancionVO";
import { Tarjeta } from "../../tarjeta/schema/TarjetaSchema";
import { TarjetaDomain } from "../../tarjeta/domain/TarjetaDomain";
import { TorneoCompuesto } from "../../compuesto/schema/TorneoCompuestoSchema";
import { TorneoCompuestoDomain } from "../../compuesto/domain/TorneoCompuestoDomain";

@Injectable()
export class PartidoLogic {

    constructor (
        private readonly partidoRepository: PartidoRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private connection: Connection) {}

    async Registrar (registrarPartidoDTO: RegistrarPartidoDTO): Promise<void> {

        const torneoDomainPersisted = await this.documentLoaderService.GetById<Torneo, TorneoDomain>(Torneo.name, TorneoDomain, registrarPartidoDTO.TorneoID);

        if (!torneoDomainPersisted)
            throw new ValidationException(Messages.NoSeEncuentraElTorneo)

        if (torneoDomainPersisted.Doc.Finalizado)
        {
            throw new ValidationException(Messages.ElTorneoSeEncuentraFinalizado);
        }

        const equipoLocalDomainPersisted = await this.documentLoaderService.GetById<Equipo, EquipoDomain>(Equipo.name, EquipoDomain, registrarPartidoDTO.EquipoLocalID);

        if (!equipoLocalDomainPersisted && registrarPartidoDTO.EquipoLocalID)
            throw new ValidationException(Messages.NoSeEncuentraElEquipoLocal)

        const equipoVisitanteDomainPersisted = await this.documentLoaderService.GetById<Equipo, EquipoDomain>(Equipo.name, EquipoDomain, registrarPartidoDTO.EquipoVisitanteID);

        if (!equipoVisitanteDomainPersisted && registrarPartidoDTO.EquipoVisitanteID)
            throw new ValidationException(Messages.NoSeEncuentraElEquipoVisitante)

        const canchaDomainPersisted = await this.documentLoaderService.GetById<Cancha, CanchaDomain>(Cancha.name, CanchaDomain, registrarPartidoDTO.CanchaID);

        if (!canchaDomainPersisted && registrarPartidoDTO.CanchaID)
            throw new ValidationException(Messages.NoSeEncuentraLaCancha)

        let partidoDomain = await this.partidoRepository.FindWithId(registrarPartidoDTO._id);

        if (!partidoDomain && registrarPartidoDTO._id)
            throw new ValidationException(Messages.NoSeEncuentraElPartido)

        const vo: RegistrarPartidoVO = {
            Fecha: registrarPartidoDTO.Fecha,
            EquipoLocalDomain: equipoLocalDomainPersisted,
            EquipoVisitanteDomain: equipoVisitanteDomainPersisted,
            CanchaDomain: canchaDomainPersisted,
            TorneoDomain: torneoDomainPersisted,
            ResultadoLocal: registrarPartidoDTO.ResultadoLocal,
            ResultadoVisitante: registrarPartidoDTO.ResultadoVisitante,
            NroFecha: registrarPartidoDTO.NroFecha
        }

        const session = await this.connection.startSession();

        try
        {

            session.startTransaction();

            if (partidoDomain)
            {
                partidoDomain.Registrar(vo);
                await partidoDomain.Save({ session });

            } else
            {
                partidoDomain = this.documentLoaderService.Create<Partido, PartidoDomain>(Partido.name, PartidoDomain);
                partidoDomain.Registrar(vo);
                await partidoDomain.Save({ session });

            }

            const golesLocalCreated: Types.ObjectId[] = [];

            for (const golLocal of registrarPartidoDTO.GolesEquipoLocal)
            {
                let golDomain = await this.documentLoaderService.GetById<Gol, GolDomain>(Gol.name, GolDomain, golLocal._id);

                const vo: RegistrarGolVO = {
                    PartidoDomain: partidoDomain,
                    TorneoDomain: torneoDomainPersisted,
                    EquipoDomain: equipoLocalDomainPersisted,
                    JugadorDomain: await this.documentLoaderService.GetById<Jugador, JugadorDomain>(Jugador.name, JugadorDomain, golLocal.JugadorID),
                    Cantidad: golLocal.Cantidad

                }

                if (!golDomain)
                {

                    golDomain = await this.documentLoaderService.Create<Gol, GolDomain>(Gol.name, GolDomain);

                    golDomain.Registrar(vo)

                    await golDomain.Save({ session });
                } else
                {
                    golDomain.Registrar(vo)

                    await golDomain.Save({ session });

                }

                golesLocalCreated.push(new Types.ObjectId(golDomain.Doc._id));
            }

            const golesVisitanteCreated: Types.ObjectId[] = [];

            for (const golVisitante of registrarPartidoDTO.GolesEquipoVisitante)
            {
                let golDomain = await this.documentLoaderService.GetById<Gol, GolDomain>(Gol.name, GolDomain, golVisitante._id);

                const vo: RegistrarGolVO = {
                    PartidoDomain: partidoDomain,
                    TorneoDomain: torneoDomainPersisted,
                    EquipoDomain: equipoVisitanteDomainPersisted,
                    JugadorDomain: await this.documentLoaderService.GetById<Jugador, JugadorDomain>(Jugador.name, JugadorDomain, golVisitante.JugadorID),
                    Cantidad: golVisitante.Cantidad

                }

                if (!golDomain)
                {

                    golDomain = await this.documentLoaderService.Create<Gol, GolDomain>(Gol.name, GolDomain);

                    golDomain.Registrar(vo)

                    await golDomain.Save({ session });
                } else
                {
                    golDomain.Registrar(vo)

                    await golDomain.Save({ session });

                }

                golesVisitanteCreated.push(new Types.ObjectId(golDomain.Doc._id))
            }

            if (registrarPartidoDTO.GolesEquipoLocal.length === 0)
            {
                const cantGolesLocalPersisted = await this.documentLoaderService
                    .Query<Gol>(Gol.name)
                    .countDocuments({
                        Partido: new Types.ObjectId(partidoDomain.Doc._id),
                        Equipo: new Types.ObjectId(equipoLocalDomainPersisted.Doc._id)
                    }, { session })
                    .exec();
                if (cantGolesLocalPersisted > 0)
                    await this.documentLoaderService
                        .Query<Gol>(Gol.name)
                        .deleteMany({
                            Partido: new Types.ObjectId(partidoDomain.Doc._id),
                            Equipo: new Types.ObjectId(equipoLocalDomainPersisted.Doc._id)
                        }, { session })
                        .exec()
            } else
            {
                await this.documentLoaderService
                    .Query<Gol>(Gol.name)
                    .deleteMany({
                        _id: { $nin: golesLocalCreated },
                        Partido: new Types.ObjectId(partidoDomain.Doc._id),
                        Equipo: new Types.ObjectId(equipoLocalDomainPersisted.Doc._id)
                    }, { session })
                    .exec()
            }

            if (registrarPartidoDTO.GolesEquipoVisitante.length === 0)
            {
                const cantGolesVisitantePersisted = await this.documentLoaderService
                    .Query<Gol>(Gol.name)
                    .countDocuments({
                        Partido: new Types.ObjectId(partidoDomain.Doc._id),
                        Equipo: new Types.ObjectId(equipoVisitanteDomainPersisted.Doc._id)
                    }, { session })
                    .exec();

                if (cantGolesVisitantePersisted > 0)
                    await this.documentLoaderService
                        .Query<Gol>(Gol.name)
                        .deleteMany({
                            Partido: new Types.ObjectId(partidoDomain.Doc._id),
                            Equipo: new Types.ObjectId(equipoVisitanteDomainPersisted.Doc._id)
                        }, { session })
                        .exec()
            } else
            {
                await this.documentLoaderService
                    .Query<Gol>(Gol.name)
                    .deleteMany({
                        _id: { $nin: golesVisitanteCreated },
                        Partido: new Types.ObjectId(partidoDomain.Doc._id),
                        Equipo: new Types.ObjectId(equipoVisitanteDomainPersisted.Doc._id)
                    }, { session })
                    .exec()
            }

            const sancionesLocalCreated: Types.ObjectId[] = [];

            for (const sancionLocal of registrarPartidoDTO.SancionesEquipoLocal)
            {
                let sancionDomain = await this.documentLoaderService.GetById<Sancion, SancionDomain>(Sancion.name, SancionDomain, sancionLocal._id);

                const vo: RegistrarSancionVO = {
                    PartidoDomain: partidoDomain,
                    TorneoDomain: torneoDomainPersisted,
                    EquipoDomain: equipoLocalDomainPersisted,
                    JugadorDomain: await this.documentLoaderService.GetById<Jugador, JugadorDomain>(Jugador.name, JugadorDomain, sancionLocal.JugadorID),
                    TarjetaDomain: await this.documentLoaderService.GetById<Tarjeta, TarjetaDomain>(Tarjeta.name, TarjetaDomain, sancionLocal.TarjetaID),
                    TotalFechas: sancionLocal.TotalFechas

                }

                if (!sancionDomain)
                {

                    sancionDomain = await this.documentLoaderService.Create<Sancion, SancionDomain>(Sancion.name, SancionDomain);

                    sancionDomain.Registrar(vo)

                    await sancionDomain.Save({ session });
                } else
                {
                    sancionDomain.Registrar(vo)

                    await sancionDomain.Save({ session });

                }

                sancionesLocalCreated.push(new Types.ObjectId(sancionDomain.Doc._id));
            }

            const sancionesVisitanteCreated: Types.ObjectId[] = [];

            for (const sancionVisitante of registrarPartidoDTO.SancionesEquipoVisitante)
            {
                let sancionDomain = await this.documentLoaderService.GetById<Sancion, SancionDomain>(Sancion.name, SancionDomain, sancionVisitante._id);

                const vo: RegistrarSancionVO = {
                    PartidoDomain: partidoDomain,
                    TorneoDomain: torneoDomainPersisted,
                    EquipoDomain: equipoVisitanteDomainPersisted,
                    JugadorDomain: await this.documentLoaderService.GetById<Jugador, JugadorDomain>(Jugador.name, JugadorDomain, sancionVisitante.JugadorID),
                    TarjetaDomain: await this.documentLoaderService.GetById<Tarjeta, TarjetaDomain>(Tarjeta.name, TarjetaDomain, sancionVisitante.TarjetaID),
                    TotalFechas: sancionVisitante.TotalFechas

                }

                if (!sancionDomain)
                {

                    sancionDomain = await this.documentLoaderService.Create<Sancion, SancionDomain>(Sancion.name, SancionDomain);

                    sancionDomain.Registrar(vo)

                    await sancionDomain.Save({ session });
                } else
                {
                    sancionDomain.Registrar(vo)

                    await sancionDomain.Save({ session });

                }

                sancionesVisitanteCreated.push(new Types.ObjectId(sancionDomain.Doc._id));
            }

            if (registrarPartidoDTO.SancionesEquipoLocal.length === 0)
            {
                const cantSancionesLocalPersisted = await this.documentLoaderService
                    .Query<Sancion>(Sancion.name)
                    .countDocuments({
                        Partido: new Types.ObjectId(partidoDomain.Doc._id),
                        Equipo: new Types.ObjectId(equipoLocalDomainPersisted.Doc._id)
                    }, { session })
                    .exec();
                if (cantSancionesLocalPersisted > 0)
                    await this.documentLoaderService
                        .Query<Sancion>(Sancion.name)
                        .deleteMany({
                            Partido: new Types.ObjectId(partidoDomain.Doc._id),
                            Equipo: new Types.ObjectId(equipoLocalDomainPersisted.Doc._id)
                        }, { session })
                        .exec()
            } else
            {
                await this.documentLoaderService
                    .Query<Sancion>(Sancion.name)
                    .deleteMany({
                        _id: { $nin: sancionesLocalCreated },
                        Partido: new Types.ObjectId(partidoDomain.Doc._id),
                        Equipo: new Types.ObjectId(equipoLocalDomainPersisted.Doc._id)
                    }, { session })
                    .exec()
            }

            if (registrarPartidoDTO.SancionesEquipoVisitante.length === 0)
            {
                const cantSancionesVisitantePersisted = await this.documentLoaderService
                    .Query<Sancion>(Sancion.name)
                    .countDocuments({
                        Partido: new Types.ObjectId(partidoDomain.Doc._id),
                        Equipo: new Types.ObjectId(equipoVisitanteDomainPersisted.Doc._id)
                    }, { session })
                    .exec();
                if (cantSancionesVisitantePersisted > 0)
                    await this.documentLoaderService
                        .Query<Sancion>(Sancion.name)
                        .deleteMany({
                            Partido: new Types.ObjectId(partidoDomain.Doc._id),
                            Equipo: new Types.ObjectId(equipoVisitanteDomainPersisted.Doc._id)
                        }, { session })
                        .exec()
            } else
            {
                await this.documentLoaderService
                    .Query<Sancion>(Sancion.name)
                    .deleteMany({
                        _id: { $nin: sancionesVisitanteCreated },
                        Partido: new Types.ObjectId(partidoDomain.Doc._id),
                        Equipo: new Types.ObjectId(equipoVisitanteDomainPersisted.Doc._id)
                    }, { session })
                    .exec()
            }

            await session.commitTransaction();

            await session.endSession();

        } catch (error)
        {
            await session.abortTransaction();

            throw new ValidationException(error.message);
        }

    }

    async ObtenerTodos (): Promise<PartidoResultadoDataView[]> {

        const partidos = await this.partidoRepository.ReadAll();

        return partidos.map<PartidoResultadoDataView>(p => ({
            _id: p.Doc._id,
            Fecha: p.Doc.Fecha,
            NombreTorneo: p.Doc.Torneo.Nombre,
            NroCancha: p.Doc.Cancha ? p.Doc.Cancha.Identificador : null,
            NombreEquipoLocal: p.Doc.EquipoLocal.Nombre,
            NombreEquipoVisitante: p.Doc.EquipoVisitante.Nombre,
            ResultadoLocal: p.Doc.ResultadoLocal,
            ResultadoVisitante: p.Doc.ResultadoVisitante,
            NroFecha: p.Doc.NroFecha
        }))
    }

    async ObtenerTodosPorTorneo (torneoID: Types.ObjectId): Promise<PartidoResultadoDataView[]> {

        const partidos = await this.partidoRepository.ObtenerTodosPorTorneo(torneoID);

        return partidos.map<PartidoResultadoDataView>(p => ({
            _id: p._id,
            Fecha: p.Fecha,
            NombreTorneo: p.Torneo.Nombre,
            NroCancha: p.Cancha ? p.Cancha.Identificador : null,
            NombreEquipoLocal: p.EquipoLocal.Nombre,
            NombreEquipoVisitante: p.EquipoVisitante.Nombre,
            ResultadoLocal: p.ResultadoLocal,
            ResultadoVisitante: p.ResultadoVisitante,
            NroFecha: p.NroFecha
        }))
    }

    async ObtenerPorId (id: Types.ObjectId): Promise<RegistrarPartidoVM> {

        const partidoDomain = await this.partidoRepository.FindWithId(id);

        if (!partidoDomain) throw new ValidationException(Messages.NoSeEncuentraElPartido);

        const golesEquipoLocal = await this.documentLoaderService
            .Query<Gol>(Gol.name)
            .find(
                {
                    Partido: new Types.ObjectId(partidoDomain.Doc._id),
                    Equipo: new Types.ObjectId(partidoDomain.Doc.EquipoLocal._id)
                }
            )
            .exec()

        const golesEquipoVisitante = await this.documentLoaderService
            .Query<Gol>(Gol.name)
            .find(
                {
                    Partido: new Types.ObjectId(partidoDomain.Doc._id),
                    Equipo: new Types.ObjectId(partidoDomain.Doc.EquipoVisitante._id)
                }
            )
            .exec()

        const sancionesEquipoLocal = await this.documentLoaderService
            .Query<Sancion>(Sancion.name)
            .find(
                {
                    Partido: new Types.ObjectId(partidoDomain.Doc._id),
                    Equipo: new Types.ObjectId(partidoDomain.Doc.EquipoLocal._id)
                }
            )
            .exec()

        const sancionesEquipoVisitante = await this.documentLoaderService
            .Query<Sancion>(Sancion.name)
            .find(
                {
                    Partido: new Types.ObjectId(partidoDomain.Doc._id),
                    Equipo: new Types.ObjectId(partidoDomain.Doc.EquipoVisitante._id)
                }
            )
            .exec()

        return {
            _id: partidoDomain.Doc._id,
            Fecha: partidoDomain.Doc.Fecha,
            TorneoID: partidoDomain.Doc.Torneo._id,
            CanchaID: partidoDomain.Doc.Cancha ? partidoDomain.Doc.Cancha._id : null,
            EquipoLocalID: partidoDomain.Doc.EquipoLocal._id,
            EquipoVisitanteID: partidoDomain.Doc.EquipoVisitante._id,
            ResultadoLocal: partidoDomain.Doc.ResultadoLocal,
            ResultadoVisitante: partidoDomain.Doc.ResultadoVisitante,
            GolesEquipoLocal: golesEquipoLocal.map<RegistrarGolVM>(g => ({
                _id: g._id,
                JugadorID: g.Jugador._id,
                Cantidad: g.Cantidad,
                Nombre: `${g.Jugador.Nombres} ${g.Jugador.Apellidos}`
            })),
            GolesEquipoVisitante: golesEquipoVisitante.map<RegistrarGolVM>(g => ({
                _id: g._id,
                JugadorID: g.Jugador._id,
                Cantidad: g.Cantidad,
                Nombre: `${g.Jugador.Nombres} ${g.Jugador.Apellidos}`
            })),
            SancionesEquipoLocal: sancionesEquipoLocal.map<RegistrarSancionVM>(s => ({
                _id: s._id,
                JugadorID: s.Jugador._id,
                Nombre: `${s.Jugador.Nombres} ${s.Jugador.Apellidos}`,
                TarjetaID: s.Tarjeta._id,
                TotalFechas: s.TotalFechas
            })),
            SancionesEquipoVisitante: sancionesEquipoVisitante.map<RegistrarSancionVM>(s => ({
                _id: s._id,
                JugadorID: s.Jugador._id,
                Nombre: `${s.Jugador.Nombres} ${s.Jugador.Apellidos}`,
                TarjetaID: s.Tarjeta._id,
                TotalFechas: s.TotalFechas
            })),
            NroFecha: partidoDomain.Doc.NroFecha
        }
    }

    async EliminarPorId (id: Types.ObjectId): Promise<void> {

        const partidoDomain = await this.partidoRepository.FindWithId(id);

        if (!partidoDomain) return;

        const session = await this.connection.startSession();

        try
        {

            session.startTransaction();

            await this.documentLoaderService.Query<Gol>(Gol.name)
                .deleteMany({ Partido: new Types.ObjectId(id) }, { session })
                .exec();

            await this.documentLoaderService.Query<Sancion>(Sancion.name)
                .deleteMany({ Partido: new Types.ObjectId(id) }, { session })
                .exec();

            await partidoDomain.Delete({ session: session });

            await session.commitTransaction();

            await session.endSession();

        } catch (error)
        {
            await session.abortTransaction();

            throw new ValidationException(error.message);
        }
    }

    async ObtenerTabla (torneoID: Types.ObjectId): Promise<LineaTabla[]> {

        const tabla: LineaTabla[] = [];

        const equiposComoLocalIDs = await this.documentLoaderService
            .Query<Partido>(Partido.name)
            .find({
                Torneo: new Types.ObjectId(torneoID)
            })
            .distinct('EquipoLocal')
            .exec();

        const equiposComoVisitanteIDs = await this.documentLoaderService
            .Query<Partido>(Partido.name)
            .find({
                Torneo: new Types.ObjectId(torneoID)
            })
            .distinct('EquipoVisitante')
            .exec();

        let todosLosEquiposDelTorneo: string[] = equiposComoLocalIDs.concat(equiposComoVisitanteIDs).map(i => i.toString());
        todosLosEquiposDelTorneo = [...new Set([...todosLosEquiposDelTorneo])]

        for (const equipoID of todosLosEquiposDelTorneo)
        {
            let PUNTOS = 0;
            let PARTIDOS_JUGADOS = 0;
            let PARTIDOS_GANADOS = 0;
            let PARTIDOS_PERDIDOS = 0;
            let PARTIDOS_EMPATADOS = 0;
            let GOLES_FAVOR = 0;
            let GOLES_CONTRA = 0;
            let DIFERENCIA_GOLES = 0;

            const equipo = await this.documentLoaderService.GetById<Equipo, EquipoDomain>(Equipo.name, EquipoDomain, new Types.ObjectId(equipoID));

            const totalPartidosGanados = await this.documentLoaderService
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
                            EquipoLocal: new Types.ObjectId(equipoID),
                            $expr: {
                                $gt: [
                                    "$ResultadoLocal",
                                    "$ResultadoVisitante"
                                ]
                            }
                        },
                        {
                            EquipoVisitante: new Types.ObjectId(equipoID),
                            $expr: {
                                $gt: [
                                    "$ResultadoVisitante",
                                    "$ResultadoLocal"
                                ]
                            }
                        }

                    ]
                })
                .countDocuments()
                .exec()

            const totalPartidosPerdidos = await this.documentLoaderService
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
                            EquipoLocal: new Types.ObjectId(equipoID),
                            $expr: {
                                $gt: [
                                    "$ResultadoVisitante",
                                    "$ResultadoLocal"
                                ]
                            }
                        },
                        {
                            EquipoVisitante: new Types.ObjectId(equipoID),
                            $expr: {
                                $gt: [
                                    "$ResultadoLocal",
                                    "$ResultadoVisitante"
                                ]
                            }
                        }

                    ]
                })
                .countDocuments()
                .exec()

            const totalPartidosJugados = await this.documentLoaderService
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
                            EquipoLocal: new Types.ObjectId(equipoID)
                        },
                        {
                            EquipoVisitante: new Types.ObjectId(equipoID)
                        }

                    ]
                })
                .countDocuments()
                .exec()

            const partidosComoLocal = await this.documentLoaderService
                .Query<Partido>(Partido.name)
                .find({
                    Torneo: new Types.ObjectId(torneoID),
                    ResultadoLocal: {
                        $ne: null
                    },
                    ResultadoVisitante: {
                        $ne: null
                    },
                    EquipoLocal: new Types.ObjectId(equipoID)
                })
                .exec();

            const partidosComoVisitante = await this.documentLoaderService
                .Query<Partido>(Partido.name)
                .find({
                    Torneo: new Types.ObjectId(torneoID),
                    ResultadoLocal: {
                        $ne: null
                    },
                    ResultadoVisitante: {
                        $ne: null
                    },
                    EquipoVisitante: new Types.ObjectId(equipoID)
                })
                .exec();


            partidosComoLocal.forEach(p => {
                GOLES_FAVOR += p.ResultadoLocal;
            })

            partidosComoVisitante.forEach(p => {
                GOLES_FAVOR += p.ResultadoVisitante;
            })

            partidosComoLocal.forEach(p => {
                GOLES_CONTRA += p.ResultadoVisitante;
            })

            partidosComoVisitante.forEach(p => {
                GOLES_CONTRA += p.ResultadoLocal;
            })

            PARTIDOS_EMPATADOS = totalPartidosJugados - totalPartidosGanados - totalPartidosPerdidos;
            PUNTOS = (totalPartidosGanados * 3) + PARTIDOS_EMPATADOS;
            PARTIDOS_JUGADOS = totalPartidosJugados;
            PARTIDOS_GANADOS = totalPartidosGanados;
            PARTIDOS_PERDIDOS = totalPartidosPerdidos;
            DIFERENCIA_GOLES = GOLES_FAVOR - GOLES_CONTRA

            tabla.push({
                Posicion: tabla.length + 1,
                NombreEquipo: equipo.Doc.Nombre,
                Puntos: PUNTOS,
                PartidosJugados: PARTIDOS_JUGADOS,
                PartidosGanados: PARTIDOS_GANADOS,
                PartidosPerdidos: PARTIDOS_PERDIDOS,
                PartidosEmpatados: PARTIDOS_EMPATADOS,
                GolesFavor: GOLES_FAVOR,
                GolesContra: GOLES_CONTRA,
                DiferenciaGoles: DIFERENCIA_GOLES
            })

        }

        let listaPts: number[] = [];
        const tablaFinal: LineaTabla[] = [];
        listaPts = [...new Set(tabla.map(l => l.Puntos))];
        listaPts.sort((a, b) => b - a);
        listaPts.forEach(pt => {

            tablaFinal.push(...tabla.filter(lt => lt.Puntos === pt).sort((a, b) => b.DiferenciaGoles - a.DiferenciaGoles))

        })

        tablaFinal.forEach((l, index) => {
            l.Posicion = index + 1
        })

        return tablaFinal;

    }

    async ObtenerTablaGeneral (torneoCompuestoID: Types.ObjectId): Promise<LineaTabla[]> {

        const tabla: LineaTabla[] = [];

        const torneoCompuestoDomain = await this.documentLoaderService.GetById<TorneoCompuesto, TorneoCompuestoDomain>(TorneoCompuesto.name, TorneoCompuestoDomain, torneoCompuestoID);

        if (!torneoCompuestoDomain)
            throw new ValidationException(Messages.NoSeEncuentraElTorneoCompuesto);

        const equiposComoLocalIDs = await this.documentLoaderService
            .Query<Partido>(Partido.name)
            .find({
                $or: [
                    {
                        Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                    },
                    {
                        Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                    }
                ]
            })
            .distinct('EquipoLocal')
            .exec();

        const equiposComoVisitanteIDs = await this.documentLoaderService
            .Query<Partido>(Partido.name)
            .find({
                $or: [
                    {
                        Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                    },
                    {
                        Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                    }
                ]
            })
            .distinct('EquipoVisitante')
            .exec();

        let todosLosEquiposDelTorneo: string[] = equiposComoLocalIDs.concat(equiposComoVisitanteIDs).map(i => i.toString());
        todosLosEquiposDelTorneo = [...new Set([...todosLosEquiposDelTorneo])]

        for (const equipoID of todosLosEquiposDelTorneo)
        {
            let PUNTOS = 0;
            let PARTIDOS_JUGADOS = 0;
            let PARTIDOS_GANADOS = 0;
            let PARTIDOS_PERDIDOS = 0;
            let PARTIDOS_EMPATADOS = 0;
            let GOLES_FAVOR = 0;
            let GOLES_CONTRA = 0;
            let DIFERENCIA_GOLES = 0;

            const equipo = await this.documentLoaderService.GetById<Equipo, EquipoDomain>(Equipo.name, EquipoDomain, new Types.ObjectId(equipoID));

            const totalPartidosGanados = await this.documentLoaderService
                .Query<Partido>(Partido.name)
                .find({
                    ResultadoLocal: {
                        $ne: null
                    },
                    ResultadoVisitante: {
                        $ne: null
                    },
                    $or: [
                        {
                            $or: [
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                                },
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                                }
                            ],
                            EquipoLocal: new Types.ObjectId(equipoID),
                            $expr: {
                                $gt: [
                                    "$ResultadoLocal",
                                    "$ResultadoVisitante"
                                ]
                            }
                        },
                        {
                            $or: [
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                                },
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                                }
                            ],
                            EquipoVisitante: new Types.ObjectId(equipoID),
                            $expr: {
                                $gt: [
                                    "$ResultadoVisitante",
                                    "$ResultadoLocal"
                                ]
                            }
                        }

                    ]
                })
                .countDocuments()
                .exec()

            const totalPartidosPerdidos = await this.documentLoaderService
                .Query<Partido>(Partido.name)
                .find({
                    ResultadoLocal: {
                        $ne: null
                    },
                    ResultadoVisitante: {
                        $ne: null
                    },
                    $or: [
                        {
                            $or: [
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                                },
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                                }
                            ],
                            EquipoLocal: new Types.ObjectId(equipoID),
                            $expr: {
                                $gt: [
                                    "$ResultadoVisitante",
                                    "$ResultadoLocal"
                                ]
                            }
                        },
                        {
                            $or: [
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                                },
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                                }
                            ],
                            EquipoVisitante: new Types.ObjectId(equipoID),
                            $expr: {
                                $gt: [
                                    "$ResultadoLocal",
                                    "$ResultadoVisitante"
                                ]
                            }
                        }

                    ]
                })
                .countDocuments()
                .exec()

            const totalPartidosJugados = await this.documentLoaderService
                .Query<Partido>(Partido.name)
                .find({
                    ResultadoLocal: {
                        $ne: null
                    },
                    ResultadoVisitante: {
                        $ne: null
                    },
                    $or: [
                        {
                            $or: [
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                                },
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                                }
                            ],
                            EquipoLocal: new Types.ObjectId(equipoID)
                        },
                        {
                            $or: [
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                                },
                                {
                                    Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                                }
                            ],
                            EquipoVisitante: new Types.ObjectId(equipoID)
                        }

                    ]
                })
                .countDocuments()
                .exec()

            const partidosComoLocal = await this.documentLoaderService
                .Query<Partido>(Partido.name)
                .find({
                    $or: [
                        {
                            Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                        },
                        {
                            Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                        }
                    ],
                    ResultadoLocal: {
                        $ne: null
                    },
                    ResultadoVisitante: {
                        $ne: null
                    },
                    EquipoLocal: new Types.ObjectId(equipoID)
                })
                .exec();

            const partidosComoVisitante = await this.documentLoaderService
                .Query<Partido>(Partido.name)
                .find({
                    $or: [
                        {
                            Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoApertura._id)
                        },
                        {
                            Torneo: new Types.ObjectId(torneoCompuestoDomain.Doc.TorneoClausura._id)
                        }
                    ],
                    ResultadoLocal: {
                        $ne: null
                    },
                    ResultadoVisitante: {
                        $ne: null
                    },
                    EquipoVisitante: new Types.ObjectId(equipoID)
                })
                .exec();


            partidosComoLocal.forEach(p => {
                GOLES_FAVOR += p.ResultadoLocal;
            })

            partidosComoVisitante.forEach(p => {
                GOLES_FAVOR += p.ResultadoVisitante;
            })

            partidosComoLocal.forEach(p => {
                GOLES_CONTRA += p.ResultadoVisitante;
            })

            partidosComoVisitante.forEach(p => {
                GOLES_CONTRA += p.ResultadoLocal;
            })

            PARTIDOS_EMPATADOS = totalPartidosJugados - totalPartidosGanados - totalPartidosPerdidos;
            PUNTOS = (totalPartidosGanados * 3) + PARTIDOS_EMPATADOS;
            PARTIDOS_JUGADOS = totalPartidosJugados;
            PARTIDOS_GANADOS = totalPartidosGanados;
            PARTIDOS_PERDIDOS = totalPartidosPerdidos;
            DIFERENCIA_GOLES = GOLES_FAVOR - GOLES_CONTRA

            tabla.push({
                Posicion: tabla.length + 1,
                NombreEquipo: equipo.Doc.Nombre,
                Puntos: PUNTOS,
                PartidosJugados: PARTIDOS_JUGADOS,
                PartidosGanados: PARTIDOS_GANADOS,
                PartidosPerdidos: PARTIDOS_PERDIDOS,
                PartidosEmpatados: PARTIDOS_EMPATADOS,
                GolesFavor: GOLES_FAVOR,
                GolesContra: GOLES_CONTRA,
                DiferenciaGoles: DIFERENCIA_GOLES
            })

        }

        let listaPts: number[] = [];
        const tablaFinal: LineaTabla[] = [];
        listaPts = [...new Set(tabla.map(l => l.Puntos))];
        listaPts.sort((a, b) => b - a);
        listaPts.forEach(pt => {

            tablaFinal.push(...tabla.filter(lt => lt.Puntos === pt).sort((a, b) => b.DiferenciaGoles - a.DiferenciaGoles))

        })

        tablaFinal.forEach((l, index) => {
            l.Posicion = index + 1
        })

        return tablaFinal;

    }
}