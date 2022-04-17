import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { Jugador } from "../schema/JugadorSchema";
import { JugadorDomain } from "../domain/JugadorDomain";
import { JugadorRepository } from "../repository/JugadorRepository";
import { RegistrarJugadorDTO } from "../dtos/RegistrarJugadorDTO";
import { DropDownVM, JugadorResultadoDataView, Messages, RegistrarJugadorVM } from "@futbolyamigos/data";
import { Types } from "mongoose";
import { ValidationException } from "../../global/base/exceptions/ValidationException";
import { Equipo } from "../../equipo/schema/EquipoSchema";
import { EquipoDomain } from "../../equipo/domain/EquipoDomain";
import { RegistrarJugadorVO } from "../valueObjects/RegistrarJugadorVO";

@Injectable()
export class JugadorLogic {

    constructor (
        private readonly jugadorRepository: JugadorRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService) {}

    async Registrar (registrarJugadorDTO: RegistrarJugadorDTO): Promise<void> {

        const jugadorDomainPersisted = await this.jugadorRepository.FindWithId(registrarJugadorDTO._id);

        let equipoDomainPersisted: EquipoDomain = null;

        if (registrarJugadorDTO.EquipoID)
        {

            equipoDomainPersisted = await this.documentLoaderService.GetById<Equipo, EquipoDomain>(Equipo.name, EquipoDomain, registrarJugadorDTO.EquipoID);

            if (!equipoDomainPersisted) throw new ValidationException(Messages.NoSeEncuentraElEquipo)

        }

        const vo: RegistrarJugadorVO = {
            Nombres: registrarJugadorDTO.Nombres,
            Apellidos: registrarJugadorDTO.Apellidos,
            FechaNacimiento: registrarJugadorDTO.FechaNacimiento,
            Dni: registrarJugadorDTO.Dni,
            Email: registrarJugadorDTO.Email,
            Telefono: registrarJugadorDTO.Telefono,
            EquipoDomain: equipoDomainPersisted
        }

        if (jugadorDomainPersisted)
        {

            if (registrarJugadorDTO.Dni !== jugadorDomainPersisted.Doc.Dni)
            {
                if (await this.jugadorRepository.YaExisteJugadorConDniSolicitado(registrarJugadorDTO.Dni))
                    throw new ValidationException(Messages.DniEnUso);
            }

            jugadorDomainPersisted.Registrar(vo);
            jugadorDomainPersisted.Save();
        } else
        {
            if (await this.jugadorRepository.YaExisteJugadorConDniSolicitado(registrarJugadorDTO.Dni))
                throw new ValidationException(Messages.DniEnUso);

            const jugadorDomain = this.documentLoaderService.Create<Jugador, JugadorDomain>(Jugador.name, JugadorDomain);
            jugadorDomain.Registrar(vo);
            await jugadorDomain.Save();

        }
    }

    async ObtenerTodos (): Promise<JugadorResultadoDataView[]> {

        const jugadores = await this.jugadorRepository.ReadAll();

        return jugadores.map<JugadorResultadoDataView>(t => ({
            _id: t.Doc._id,
            Nombres: t.Doc.Nombres,
            Apellidos: t.Doc.Apellidos,
            FechaNacimiento: t.Doc.FechaNacimiento,
            Dni: t.Doc.Dni,
            Email: t.Doc.Email,
            Telefono: t.Doc.Telefono,
            NombreEquipo: t.Doc.Equipo ? t.Doc.Equipo.Nombre : null
        }))
    }

    async ObtenerPorId (id: Types.ObjectId): Promise<RegistrarJugadorVM> {

        const jugadorDomain = await this.jugadorRepository.FindWithId(id);

        if (!jugadorDomain) throw new ValidationException(Messages.NoSeEncuentraElJugador);

        return {
            _id: jugadorDomain.Doc._id,
            Nombres: jugadorDomain.Doc.Nombres,
            Apellidos: jugadorDomain.Doc.Apellidos,
            FechaNacimiento: jugadorDomain.Doc.FechaNacimiento,
            Dni: jugadorDomain.Doc.Dni,
            Email: jugadorDomain.Doc.Email,
            Telefono: jugadorDomain.Doc.Telefono,
            EquipoID: jugadorDomain.Doc.Equipo ? jugadorDomain.Doc.Equipo._id : null
        }
    }

    async EliminarPorId (id: Types.ObjectId): Promise<void> {
        const jugadorDomain = await this.jugadorRepository.FindWithId(id);
        if (!jugadorDomain) return null;

        await jugadorDomain.Delete()
    }

    // async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {
    //     const torneos = await this.torneoRepository.ReadAll();

    //     return torneos.map<DropDownVM<Types.ObjectId>>(t => ({
    //         _id: t.Doc._id,
    //         Description: t.Doc.Nombre
    //     }))
    // }
}