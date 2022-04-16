import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Document, Model, Types } from 'mongoose';
import { DomainBase } from '../../global/base/domain/DomainBase';

@Injectable()
export class DocumentLoaderDomainService {
    constructor (@InjectConnection() private connection: Connection) {}

    Create<T extends Document, D extends DomainBase<T>> (nameModel: string, type: new (document: T) => D): D {
        const T_Model: Model<T> = this.connection.model(nameModel);
        const document = new T_Model();
        return new type(document);
    }

    async GetById<T extends Document, D extends DomainBase<T>> (nameModel: string, type: new (document: T) => D, id: number | Types.ObjectId): Promise<D> {
        const T_Model: Model<T> = this.connection.model(nameModel);
        const document = await T_Model.findById(id).exec();
        return document ? new type(document) : null;
    }

    Query<T extends Document> (nameModel: string): Model<T> {
        const T_Model: Model<T> = this.connection.model<T>(nameModel);
        return T_Model;
    }

}