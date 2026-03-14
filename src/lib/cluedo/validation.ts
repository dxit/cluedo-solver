import { z } from "zod";
import type { GameSetup } from "./types";
import { maxPlayers, minPlayers } from "./constants";

export type GameSetupValidationMessages = {
	minPlayers: string;
	maxPlayers: string;
	playerNameRequired: string;
	playerNameLength: string;
	playerNamesUnique: string;
	playerNamesComplete: string;
	userPlayerRequired: string;
};

export type GameSetupFormValues = GameSetup;

export function createGameSetupSchema(messages: GameSetupValidationMessages) {
	const playerCountSchema = z
		.number()
		.int()
		.min(minPlayers, messages.minPlayers)
		.max(maxPlayers, messages.maxPlayers);

	const playerNameSchema = z
		.string()
		.trim()
		.min(1, messages.playerNameRequired)
		.max(24, messages.playerNameLength);

	const uniquePlayerNamesSchema = z
		.array(playerNameSchema)
		.min(minPlayers)
		.max(maxPlayers)
		.superRefine((names, ctx) => {
			const seenNames = new Map<string, number>();

			names.forEach((name, index) => {
				const normalizedName = name.trim().toLocaleLowerCase();
				const previousIndex = seenNames.get(normalizedName);

				if (previousIndex !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: messages.playerNamesUnique,
						path: [index],
					});
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: messages.playerNamesUnique,
						path: [previousIndex],
					});
					return;
				}

				seenNames.set(normalizedName, index);
			});
		});

	return z
		.object({
			playerCount: playerCountSchema,
			playerNames: uniquePlayerNamesSchema,
			userPlayerIndex: z.number().int().min(0),
		})
		.superRefine((value, ctx) => {
			if (value.playerNames.length !== value.playerCount) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: messages.playerNamesComplete,
					path: ["playerNames"],
				});
			}

			if (value.userPlayerIndex >= value.playerCount) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: messages.userPlayerRequired,
					path: ["userPlayerIndex"],
				});
			}
		});
}

export function validateGameSetup(
	input: GameSetupFormValues,
	messages: GameSetupValidationMessages,
) {
	return createGameSetupSchema(messages).safeParse(input);
}
