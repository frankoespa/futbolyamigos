import { registerDecorator, ValidationOptions, isInt, isBoolean, isDateString, ValidationArguments } from 'class-validator';

export function OptionalDate (validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            name: 'OptionalDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [propertyName],
            options: {
                always: validationOptions?.always,
                context: validationOptions?.context,
                each: validationOptions?.each,
                groups: validationOptions?.groups,
                message: validationOptions?.message ?? 'El campo $property es opcional y debe ser de tipo fecha'
            },
            validator: {
                validate (value: any, args: ValidationArguments) {
                    if (typeof value === 'undefined')
                    {
                        value = null;
                        args.object[args.property] = null;
                    }
                    return value == null || isDateString(value);
                }
            }
        });
    };
}
