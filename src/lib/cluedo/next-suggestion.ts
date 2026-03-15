import { envelopeColumnId, rooms, suspects, weapons } from "./constants";

import type { DeductionResult } from "./deduction";
import type {
	Card,
	Game,
	NotebookColumnKey,
	Player,
	SuggestionInput,
} from "./types";

export type SuggestedCombination = {
	id: string;
	suggestion: SuggestionInput;
	score: number;
	envelopeCandidateCount: number;
	ownerAmbiguity: number;
	playerPressureCount: number;
};

function getFallbackColumns(
	card: Card,
	players: Player[],
	notebook: DeductionResult["notebook"],
) {
	const columns = [
		...players.map((player) => player.id),
		envelopeColumnId,
	] satisfies NotebookColumnKey[];

	return columns.filter((columnKey) => notebook[card][columnKey] !== "impossible");
}

function getSupportedColumns(
	card: Card,
	players: Player[],
	result: Pick<DeductionResult, "notebook" | "supportedColumnsByCard">,
) {
	const supportedColumns = result.supportedColumnsByCard[card];

	if (supportedColumns.length > 0) {
		return supportedColumns;
	}

	return getFallbackColumns(card, players, result.notebook);
}

function createExactSuggestionKey(
	suspect: SuggestionInput["suspect"],
	weapon: SuggestionInput["weapon"],
	room: SuggestionInput["room"],
) {
	return `${suspect}:${weapon}:${room}`;
}

function getCardSignalScore(
	card: Card,
	userPlayerId: string,
	players: Player[],
	result: Pick<DeductionResult, "notebook" | "supportedColumnsByCard">,
) {
	const supportedColumns = getSupportedColumns(card, players, result);
	const envelopeCandidateCount = supportedColumns.includes(envelopeColumnId) ? 1 : 0;
	const playerPressureCount = supportedColumns.filter(
		(columnKey) => columnKey !== userPlayerId && columnKey !== envelopeColumnId,
	).length;
	const ownerAmbiguity = Math.max(0, supportedColumns.length - 1);
	const isKnownUserCard = result.notebook[card][userPlayerId] === "owned";
	const score =
		envelopeCandidateCount * 6 +
		ownerAmbiguity * 2 +
		playerPressureCount * 2 -
		(isKnownUserCard ? 3 : 0);

	return {
		score,
		envelopeCandidateCount,
		ownerAmbiguity,
		playerPressureCount,
	};
}

export function getNextSuggestionRecommendations(
	game: Pick<Game, "players" | "suggestions" | "userPlayerId">,
	result: Pick<DeductionResult, "notebook" | "supportedColumnsByCard">,
	limit = 3,
): SuggestedCombination[] {
	const userPlayer = game.players.find(
		(player) => player.id === game.userPlayerId,
	);

	if (!userPlayer) {
		return [];
	}

	const exactSuggestionKeys = new Set(
		game.suggestions.map((suggestion) =>
			createExactSuggestionKey(
				suggestion.suspect,
				suggestion.weapon,
				suggestion.room,
			),
		),
	);

	const recommendations: SuggestedCombination[] = [];

	for (const suspect of suspects) {
		const suspectSignal = getCardSignalScore(
			suspect,
			userPlayer.id,
			game.players,
			result,
		);

		for (const weapon of weapons) {
			const weaponSignal = getCardSignalScore(
				weapon,
				userPlayer.id,
				game.players,
				result,
			);

			for (const room of rooms) {
				const roomSignal = getCardSignalScore(
					room,
					userPlayer.id,
					game.players,
					result,
				);
				const playerPressureCount = new Set(
					[suspect, weapon, room].flatMap((card) =>
						getSupportedColumns(card, game.players, result).filter(
							(columnKey) =>
								columnKey !== userPlayer.id && columnKey !== envelopeColumnId,
						),
					),
				).size;
				const exactRepeatPenalty = exactSuggestionKeys.has(
					createExactSuggestionKey(suspect, weapon, room),
				)
					? 5
					: 0;
				const score =
					suspectSignal.score +
					weaponSignal.score +
					roomSignal.score +
					playerPressureCount * 2 -
					exactRepeatPenalty;

				recommendations.push({
					id: `suggestion-advice:${suspect}:${weapon}:${room}`,
					suggestion: {
						suggesterPlayerId: userPlayer.id,
						suspect,
						weapon,
						room,
						disproverPlayerId: null,
					},
					score,
					envelopeCandidateCount:
						suspectSignal.envelopeCandidateCount +
						weaponSignal.envelopeCandidateCount +
						roomSignal.envelopeCandidateCount,
					ownerAmbiguity:
						suspectSignal.ownerAmbiguity +
						weaponSignal.ownerAmbiguity +
						roomSignal.ownerAmbiguity,
					playerPressureCount,
				});
			}
		}
	}

	return recommendations
		.sort((left, right) => {
			return (
				right.score - left.score ||
				right.envelopeCandidateCount - left.envelopeCandidateCount ||
				right.playerPressureCount - left.playerPressureCount ||
				right.ownerAmbiguity - left.ownerAmbiguity ||
				left.id.localeCompare(right.id)
			);
		})
		.slice(0, limit);
}
