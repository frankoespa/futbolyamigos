import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { Partido } from "../schema/PartidoSchema";
import { PartidoDomain } from "../domain/PartidoDomain";
import { PartidoRepository } from "../repository/PartidoRepository";
import { RegistrarPartidoDTO } from "../dtos/RegistrarPartidoDTO";
import { Messages, PartidoResultadoDataView, RegistrarPartidoVM, RegistrarGolVM } from "@futbolyamigos/data";
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

@Injectable()
export class PartidoLogic {

    constructor (
        private readonly partidoRepository: PartidoRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private connection: Connection) {}

    async Registrar (registrarPartidoDTO: RegistrarPartidoDTO): Promise<void> {

        const torneoDomainPersisted = await this.documentLoaderService.GetById<Torneo, TorneoDomain>(Torneo.name, TorneoDomain, registrarPartidoDTO.TorneoID);

        if (!torneoDomainPersisted && registrarPartidoDTO.TorneoID)
            throw new ValidationException(Messages.NoSeEncuentraElTorneo)

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
            ResultadoVisitante: registrarPartidoDTO.ResultadoVisitante
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
            ResultadoVisitante: p.Doc.ResultadoVisitante
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
            }))
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
                .deleteMany({ Partido: id }, { session })
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
}