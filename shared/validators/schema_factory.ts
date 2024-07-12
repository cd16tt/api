import vine, { SimpleMessagesProvider, VineValidator } from '@vinejs/vine';
import { Infer, SchemaTypes, ValidationMessages } from '@vinejs/vine/types';

const defaultMessages: ValidationMessages = {
	required: 'Le champs {{ field }} est obligatoire.',
};

export const SchemaFactory = {
	create<S extends SchemaTypes>(schema: S, messages?: ValidationMessages) {
		const compiledSchema = vine.compile(schema);

		compiledSchema.messagesProvider = new SimpleMessagesProvider(Object.assign(defaultMessages, messages ?? {}));

		return compiledSchema;
	},
};

export type InferSchema<T extends VineValidator<SchemaTypes, Record<string, string>>> = Infer<T>;
