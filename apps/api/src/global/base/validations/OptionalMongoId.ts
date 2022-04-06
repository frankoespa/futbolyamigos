import { registerDecorator, ValidationOptions, isInt, isMongoId, ValidationArguments } from 'class-validator';

export function OptionalMongoId (validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            name: 'OptionalMongoId',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [propertyName],
            options: {
                always: validationOptions?.always,
                context: validationOptions?.context,
                each: validationOptions?.each,
                groups: validationOptions?.groups,
                message: validationOptions?.message ?? 'El campo $property debe contener un valor y ser de tipo Mongo Id'
            },
            validator: {
                validate (value: any, args: ValidationArguments) {
                    if (typeof value === 'undefined')
                    {
                        value = null;
                        args.object[args.property] = null;
                    }
                    return value == null || isMongoId(value);
                }
            }
        });
    };
}
