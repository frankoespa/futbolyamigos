import { registerDecorator, ValidationOptions, isEnum, ValidationArguments } from 'class-validator';

export function OptionalEnum(entity: Record<string, any>, validationOptions?: ValidationOptions) {
	return function(object: Record<string, any>, propertyName: string): void {
        const values = Object.values(entity).filter((p) => typeof p === 'number');
        let messageValues = '[';
		values.forEach((n, i, array) => {
            messageValues += `${(n as number).toString()}`;
            if (i == (array.length - 1)) {
                messageValues += ']'
            } else {
                messageValues += '-'
            }
        });

		registerDecorator({
			name: 'OptionalEnum',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [propertyName],
			options: {
				always: validationOptions?.always,
				context: validationOptions?.context,
				each: validationOptions?.each,
				groups: validationOptions?.groups,
				message: validationOptions?.message ?? `El campo $property es opcional, debe ser uno de los siguientes valores: ${messageValues} y ser de tipo número`
			},
			validator: {
				validate(value: any, args: ValidationArguments) {

                    if (typeof value === 'undefined') {
                        value = null;
                        args.object[args.property] = null;
                    }

					return isEnum(value, entity) || value === null;
				}
			}
		});
	};
}
