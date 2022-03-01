import { registerDecorator, ValidationOptions, ValidationArguments, isString} from 'class-validator';

export function OptionalString(validationOptions?: ValidationOptions) {
	return function(object: Record<string, any>, propertyName: string): void {
		registerDecorator({
			name: 'OptionalString',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [propertyName],
			options: {
				always: validationOptions?.always,
				context: validationOptions?.context,
				each: validationOptions?.each,
				groups: validationOptions?.groups,
				message: validationOptions?.message ?? 'El campo $property es opcional y debe ser de tipo texto'
			},
			validator: {
				validate(value: any, args: ValidationArguments) {
					if (typeof value === 'string') {
						value = value.trim().length === 0 ? null : value.trim();
						args.object[args.property] = value;
					}

                    if (typeof value === 'undefined') {
                        value = null;
                        args.object[args.property] = null;
                    }

					return isString(value) || value === null;
				}
			}
		});
	};
}
