import { allCards, cardsByCategory } from "./cards";
import { envelopeColumnId } from "./constants";

import type {
	Card,
	Game,
	NotebookColumnKey,
	NotebookSourcesState,
	NotebookState,
	Player,
	Suggestion,
} from "./types";

type DeductionGame = Pick<Game, "notebook" | "players" | "suggestions">;

export type DeductionResult = {
	notebook: NotebookState;
	sources: NotebookSourcesState;
	deducedCellCount: number;
};

function getColumnKeys(players: Player[]): NotebookColumnKey[] {
	return [...players.map((player) => player.id), envelopeColumnId];
}

function createNotebookCopy(
	notebook: DeductionGame["notebook"],
	columnKeys: NotebookColumnKey[],
) {
	return Object.fromEntries(
		allCards.map((card) => [
			card,
			Object.fromEntries(
				columnKeys.map((columnKey) => [
					columnKey,
					notebook[card]?.[columnKey] ?? "unknown",
				]),
			),
		]),
	) as NotebookState;
}

function createNotebookSources(
	_notebook: DeductionGame["notebook"],
	columnKeys: NotebookColumnKey[],
) {
	return Object.fromEntries(
		allCards.map((card) => [
			card,
			Object.fromEntries(
				columnKeys.map((columnKey) => [columnKey, "manual"]),
			),
		]),
	) as NotebookSourcesState;
}

function getOrderedPlayersAfter(players: Player[], startPlayerId: string) {
	const startIndex = players.findIndex((player) => player.id === startPlayerId);

	if (startIndex === -1) {
		return [];
	}

	return Array.from({ length: players.length - 1 }, (_, offset) => {
		const playerIndex = (startIndex + offset + 1) % players.length;
		return players[playerIndex];
	});
}

function getPlayersBeforeDisprover(
	players: Player[],
	suggesterPlayerId: string,
	disproverPlayerId: string | null,
) {
	const orderedPlayers = getOrderedPlayersAfter(players, suggesterPlayerId);

	if (!disproverPlayerId) {
		return orderedPlayers;
	}

	const disproverIndex = orderedPlayers.findIndex(
		(player) => player.id === disproverPlayerId,
	);

	if (disproverIndex === -1) {
		return orderedPlayers;
	}

	return orderedPlayers.slice(0, disproverIndex);
}

function getSuggestionCards(suggestion: Suggestion): Card[] {
	return [suggestion.suspect, suggestion.weapon, suggestion.room];
}

export function getDeductionResult(game: DeductionGame): DeductionResult {
	const columnKeys = getColumnKeys(game.players);
	const resolvedNotebook = createNotebookCopy(game.notebook, columnKeys);
	const sources = createNotebookSources(game.notebook, columnKeys);
	const manualNotebook = createNotebookCopy(game.notebook, columnKeys);

	const applyImpossible = (card: Card, columnKey: NotebookColumnKey) => {
		const currentStatus = resolvedNotebook[card][columnKey];

		if (currentStatus === "impossible" || currentStatus === "owned") {
			return false;
		}

		resolvedNotebook[card][columnKey] = "impossible";

		if (manualNotebook[card][columnKey] === "unknown") {
			sources[card][columnKey] = "deduced";
		}

		return true;
	};

	const applyOwned = (card: Card, columnKey: NotebookColumnKey) => {
		const currentStatus = resolvedNotebook[card][columnKey];

		if (currentStatus === "impossible") {
			return false;
		}

		let changed = false;

		if (currentStatus !== "owned") {
			resolvedNotebook[card][columnKey] = "owned";

			if (manualNotebook[card][columnKey] === "unknown") {
				sources[card][columnKey] = "deduced";
			}

			changed = true;
		}

		for (const nextColumnKey of columnKeys) {
			if (nextColumnKey === columnKey) {
				continue;
			}

			if (applyImpossible(card, nextColumnKey)) {
				changed = true;
			}
		}

		return changed;
	};

	let hasChanges = false;
	let passCount = 0;

	do {
		hasChanges = false;
		passCount += 1;

		for (const card of allCards) {
			const ownedColumns = columnKeys.filter(
				(columnKey) => resolvedNotebook[card][columnKey] === "owned",
			);

			if (ownedColumns.length === 1) {
				if (applyOwned(card, ownedColumns[0])) {
					hasChanges = true;
				}
			}

			if (ownedColumns.length === 0) {
				const possibleColumns = columnKeys.filter(
					(columnKey) => resolvedNotebook[card][columnKey] !== "impossible",
				);

				if (possibleColumns.length === 1) {
					if (applyOwned(card, possibleColumns[0])) {
						hasChanges = true;
					}
				}
			}
		}

		for (const categoryCards of Object.values(cardsByCategory)) {
			const envelopeOwnedCards = categoryCards.filter(
				(card) => resolvedNotebook[card][envelopeColumnId] === "owned",
			);

			if (envelopeOwnedCards.length === 1) {
				for (const card of categoryCards) {
					if (card === envelopeOwnedCards[0]) {
						continue;
					}

					if (applyImpossible(card, envelopeColumnId)) {
						hasChanges = true;
					}
				}
			}

			if (envelopeOwnedCards.length === 0) {
				const possibleEnvelopeCards = categoryCards.filter(
					(card) => resolvedNotebook[card][envelopeColumnId] !== "impossible",
				);

				if (possibleEnvelopeCards.length === 1) {
					if (applyOwned(possibleEnvelopeCards[0], envelopeColumnId)) {
						hasChanges = true;
					}
				}
			}
		}

		for (const suggestion of game.suggestions) {
			const suggestionCards = getSuggestionCards(suggestion);
			const blockedPlayers = getPlayersBeforeDisprover(
				game.players,
				suggestion.suggesterPlayerId,
				suggestion.disproverPlayerId,
			);

			for (const player of blockedPlayers) {
				for (const card of suggestionCards) {
					if (applyImpossible(card, player.id)) {
						hasChanges = true;
					}
				}
			}

			if (suggestion.disproverPlayerId) {
				const candidateCards = suggestionCards.filter(
					(card) =>
						resolvedNotebook[card][suggestion.disproverPlayerId as string] !==
						"impossible",
				);

				if (candidateCards.length === 1) {
					if (applyOwned(candidateCards[0], suggestion.disproverPlayerId)) {
						hasChanges = true;
					}
				}
			}
		}
	} while (hasChanges && passCount < 50);

	const deducedCellCount = allCards.reduce((total, card) => {
		return (
			total +
			columnKeys.filter(
				(columnKey) =>
					sources[card][columnKey] === "deduced" &&
					resolvedNotebook[card][columnKey] !== "unknown",
			).length
		);
	}, 0);

	return {
		notebook: resolvedNotebook,
		sources,
		deducedCellCount,
	};
}
