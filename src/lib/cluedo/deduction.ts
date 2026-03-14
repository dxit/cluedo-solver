import { allCards, cardsByCategory } from "./cards";
import { envelopeColumnId } from "./constants";

import type {
	Card,
	CardCategory,
	Game,
	NotebookColumnKey,
	NotebookSourcesState,
	NotebookState,
	NotebookStatus,
	Player,
	Suggestion,
} from "./types";

type DeductionGame = Pick<Game, "notebook" | "players" | "suggestions">;
type DeducedNotebookStatus = Exclude<NotebookStatus, "unknown">;

type HandSizeInfo = {
	min: number;
	max: number;
	exact: number | null;
};

type PlayerHandAnalysis = {
	ownedCards: Card[];
	possibleCards: Card[];
	totalValidHands: number;
	cardAppearanceCount: Record<Card, number>;
};

export type DeductionEvidence =
	| {
			kind: "suggestion";
			suggestionNumber: number;
	  }
	| {
			kind: "cell";
			card: Card;
			columnKey: NotebookColumnKey;
			status: DeducedNotebookStatus;
	  }
	| {
			kind: "handSizeLimit";
			playerId: string;
			handSize: number;
			reached: "maxOwned" | "minPossible";
	  }
	| {
			kind: "handRange";
			playerId: string;
			minHand: number;
			maxHand: number;
			validHands: number;
	  };

export type DeductionStep =
	| {
			id: string;
			rule: "suggestionSkippedPlayer";
			status: "impossible";
			card: Card;
			columnKey: NotebookColumnKey;
			suggestionNumber: number;
			playerId: string;
			suggesterPlayerId: string;
			disproverPlayerId: string | null;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			rule: "suggestionNoDisprover";
			status: "impossible";
			card: Card;
			columnKey: NotebookColumnKey;
			suggestionNumber: number;
			playerId: string;
			suggesterPlayerId: string;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			rule: "singlePossibleOwner";
			status: "owned";
			card: Card;
			columnKey: NotebookColumnKey;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			rule: "disproverSingleCandidate";
			status: "owned";
			card: Card;
			columnKey: NotebookColumnKey;
			suggestionNumber: number;
			playerId: string;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			rule: "singleEnvelopeCandidate";
			status: "owned";
			card: Card;
			columnKey: typeof envelopeColumnId;
			category: CardCategory;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			rule: "playerReachedMaxHand";
			status: "impossible";
			card: Card;
			columnKey: NotebookColumnKey;
			playerId: string;
			handSize: number;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			rule: "playerReachedMinPossible";
			status: "owned";
			card: Card;
			columnKey: NotebookColumnKey;
			playerId: string;
			handSize: number;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			rule: "handRangeForcedOwned";
			status: "owned";
			card: Card;
			columnKey: NotebookColumnKey;
			playerId: string;
			minHand: number;
			maxHand: number;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			rule: "handRangeForcedImpossible";
			status: "impossible";
			card: Card;
			columnKey: NotebookColumnKey;
			playerId: string;
			minHand: number;
			maxHand: number;
			evidence?: DeductionEvidence[];
	  };

export type DeductionLead = {
	id: string;
	kind: "disproverCandidates";
	suggestionNumber: number;
	playerId: string;
	cards: Card[];
};

export type DeductionConflict =
	| {
			id: string;
			kind: "ruleConflict";
			card: Card;
			columnKey: NotebookColumnKey;
			attemptedStatus: DeducedNotebookStatus;
			existingStatus: DeducedNotebookStatus;
			rule: DeductionStep["rule"];
			suggestionNumber?: number;
	  }
	| {
			id: string;
			kind: "cardHasMultipleOwners";
			card: Card;
			columnKeys: NotebookColumnKey[];
	  }
	| {
			id: string;
			kind: "cardHasNoPossibleOwner";
			card: Card;
	  }
	| {
			id: string;
			kind: "multipleEnvelopeCardsInCategory";
			category: CardCategory;
			cards: Card[];
	  }
	| {
			id: string;
			kind: "noEnvelopeCandidateInCategory";
			category: CardCategory;
	  }
	| {
			id: string;
			kind: "suggestionDisproverHasNoCandidate";
			suggestionNumber: number;
			playerId: string;
			cards: Card[];
	  }
	| {
			id: string;
			kind: "playerExceedsMaxHand";
			playerId: string;
			ownedCount: number;
			maxHand: number;
	  }
	| {
			id: string;
			kind: "playerBelowMinPossible";
			playerId: string;
			possibleCount: number;
			minHand: number;
	  }
	| {
			id: string;
			kind: "playerHasNoValidHand";
			playerId: string;
			minHand: number;
			maxHand: number;
	  };

export type DeductionReasonState = Record<
	Card,
	Record<NotebookColumnKey, DeductionStep | null>
>;

export type DeductionResult = {
	notebook: NotebookState;
	sources: NotebookSourcesState;
	reasons: DeductionReasonState;
	deducedCellCount: number;
	steps: DeductionStep[];
	leads: DeductionLead[];
	conflicts: DeductionConflict[];
};

function getColumnKeys(players: Player[]): NotebookColumnKey[] {
	return [...players.map((player) => player.id), envelopeColumnId];
}

function getHandSizeInfo(playerCount: number): HandSizeInfo {
	const dealtCards = allCards.length - 3;
	const min = Math.floor(dealtCards / playerCount);
	const max = Math.ceil(dealtCards / playerCount);

	return {
		min,
		max,
		exact: min === max ? min : null,
	};
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

function createNotebookSources(columnKeys: NotebookColumnKey[]) {
	return Object.fromEntries(
		allCards.map((card) => [
			card,
			Object.fromEntries(columnKeys.map((columnKey) => [columnKey, "manual"])),
		]),
	) as NotebookSourcesState;
}

function createNotebookReasons(columnKeys: NotebookColumnKey[]) {
	return Object.fromEntries(
		allCards.map((card) => [
			card,
			Object.fromEntries(columnKeys.map((columnKey) => [columnKey, null])),
		]),
	) as DeductionReasonState;
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

function getStepSuggestionNumber(step?: DeductionStep) {
	if (!step) {
		return undefined;
	}

	return "suggestionNumber" in step ? step.suggestionNumber : undefined;
}

function createRuleConflict(
	step: DeductionStep,
	card: Card,
	columnKey: NotebookColumnKey,
	attemptedStatus: DeducedNotebookStatus,
	existingStatus: DeducedNotebookStatus,
): DeductionConflict {
	return {
		id: `conflict:${step.id}:${attemptedStatus}:${existingStatus}`,
		kind: "ruleConflict",
		card,
		columnKey,
		attemptedStatus,
		existingStatus,
		rule: step.rule,
		suggestionNumber: getStepSuggestionNumber(step),
	};
}

function createSuggestionEvidence(
	suggestionNumber: number,
): DeductionEvidence[] {
	return [{ kind: "suggestion", suggestionNumber }];
}

function createCardStatusEvidence(
	notebook: NotebookState,
	card: Card,
	columnKeys: NotebookColumnKey[],
	status: DeducedNotebookStatus,
	excludedColumnKey?: NotebookColumnKey,
): DeductionEvidence[] {
	return columnKeys
		.filter((columnKey) => columnKey !== excludedColumnKey)
		.filter((columnKey) => notebook[card][columnKey] === status)
		.map((columnKey) => ({
			kind: "cell" as const,
			card,
			columnKey,
			status,
		}));
}

function createCategoryEnvelopeEvidence(
	notebook: NotebookState,
	categoryCards: readonly Card[],
	targetCard: Card,
	status: DeducedNotebookStatus,
): DeductionEvidence[] {
	return categoryCards
		.filter((card) => card !== targetCard)
		.filter((card) => notebook[card][envelopeColumnId] === status)
		.map((card) => ({
			kind: "cell" as const,
			card,
			columnKey: envelopeColumnId,
			status,
		}));
}

function createHandSizeLimitEvidence(
	playerId: string,
	handSize: number,
	reached: "maxOwned" | "minPossible",
): DeductionEvidence[] {
	return [{ kind: "handSizeLimit", playerId, handSize, reached }];
}

function createHandRangeEvidence(
	playerId: string,
	minHand: number,
	maxHand: number,
	validHands: number,
): DeductionEvidence[] {
	return [
		{
			kind: "handRange",
			playerId,
			minHand,
			maxHand,
			validHands,
		},
	];
}

function getOwnedCardsForPlayer(
	playerId: string,
	notebook: NotebookState,
): Card[] {
	return allCards.filter((card) => notebook[card][playerId] === "owned");
}

function getPossibleCardsForPlayer(
	playerId: string,
	notebook: NotebookState,
): Card[] {
	return allCards.filter((card) => notebook[card][playerId] !== "impossible");
}

function analyzePlayerHands(
	playerId: string,
	notebook: NotebookState,
	suggestions: Suggestion[],
	handSizeInfo: HandSizeInfo,
): PlayerHandAnalysis {
	const ownedCards = getOwnedCardsForPlayer(playerId, notebook);
	const ownedCardSet = new Set(ownedCards);
	const possibleCards = getPossibleCardsForPlayer(playerId, notebook);
	const unknownPossibleCards = possibleCards.filter(
		(card) => !ownedCardSet.has(card),
	);
	const unresolvedConstraintSets = suggestions
		.filter((suggestion) => suggestion.disproverPlayerId === playerId)
		.map((suggestion) => getSuggestionCards(suggestion))
		.map((cards) =>
			cards.filter((card) => notebook[card][playerId] !== "impossible"),
		)
		.filter((cards) => !cards.some((card) => ownedCardSet.has(card)))
		.map((cards) => cards.filter((card) => !ownedCardSet.has(card)));
	const minUnknownCardsNeeded = Math.max(
		0,
		handSizeInfo.min - ownedCards.length,
	);
	const maxUnknownCardsAllowed = Math.min(
		unknownPossibleCards.length,
		Math.max(0, handSizeInfo.max - ownedCards.length),
	);
	const cardAppearanceCount = Object.fromEntries(
		allCards.map((card) => [card, 0]),
	) as Record<Card, number>;
	let totalValidHands = 0;
	const selectedCards: Card[] = [];
	const selectedCardSet = new Set<Card>();

	const constraintsSatisfied = () => {
		return unresolvedConstraintSets.every((cards) =>
			cards.some((card) => selectedCardSet.has(card)),
		);
	};

	const recordValidHand = () => {
		totalValidHands += 1;

		for (const card of ownedCards) {
			cardAppearanceCount[card] += 1;
		}

		for (const card of selectedCards) {
			cardAppearanceCount[card] += 1;
		}
	};

	const exploreHands = (startIndex: number, remainingCardsToSelect: number) => {
		if (remainingCardsToSelect === 0) {
			if (constraintsSatisfied()) {
				recordValidHand();
			}

			return;
		}

		if (
			startIndex >= unknownPossibleCards.length ||
			unknownPossibleCards.length - startIndex < remainingCardsToSelect
		) {
			return;
		}

		for (
			let cardIndex = startIndex;
			cardIndex < unknownPossibleCards.length;
			cardIndex += 1
		) {
			const card = unknownPossibleCards[cardIndex];
			selectedCards.push(card);
			selectedCardSet.add(card);
			exploreHands(cardIndex + 1, remainingCardsToSelect - 1);
			selectedCards.pop();
			selectedCardSet.delete(card);
		}
	};

	for (
		let targetUnknownCardCount = minUnknownCardsNeeded;
		targetUnknownCardCount <= maxUnknownCardsAllowed;
		targetUnknownCardCount += 1
	) {
		exploreHands(0, targetUnknownCardCount);
	}

	return {
		ownedCards,
		possibleCards,
		totalValidHands,
		cardAppearanceCount,
	};
}

export function getDeductionResult(game: DeductionGame): DeductionResult {
	const columnKeys = getColumnKeys(game.players);
	const resolvedNotebook = createNotebookCopy(game.notebook, columnKeys);
	const sources = createNotebookSources(columnKeys);
	const manualNotebook = createNotebookCopy(game.notebook, columnKeys);
	const reasons = createNotebookReasons(columnKeys);
	const handSizeInfo = getHandSizeInfo(game.players.length);

	const steps: DeductionStep[] = [];
	const seenStepIds = new Set<string>();
	const conflicts = new Map<string, DeductionConflict>();
	const leads = new Map<string, DeductionLead>();

	const recordStep = (step: DeductionStep) => {
		if (seenStepIds.has(step.id)) {
			return;
		}

		seenStepIds.add(step.id);
		steps.push(step);

		if (!reasons[step.card][step.columnKey]) {
			reasons[step.card][step.columnKey] = step;
		}
	};

	const recordConflict = (conflict: DeductionConflict) => {
		conflicts.set(conflict.id, conflict);
	};

	const applyImpossible = (
		card: Card,
		columnKey: NotebookColumnKey,
		step?: DeductionStep,
	) => {
		const currentStatus = resolvedNotebook[card][columnKey];

		if (currentStatus === "impossible") {
			return false;
		}

		if (currentStatus === "owned") {
			if (step) {
				recordConflict(
					createRuleConflict(step, card, columnKey, "impossible", "owned"),
				);
			}

			return false;
		}

		resolvedNotebook[card][columnKey] = "impossible";

		if (manualNotebook[card][columnKey] === "unknown") {
			sources[card][columnKey] = "deduced";

			if (step) {
				recordStep(step);
			}
		}

		return true;
	};

	const applyOwned = (
		card: Card,
		columnKey: NotebookColumnKey,
		step?: DeductionStep,
	) => {
		const currentStatus = resolvedNotebook[card][columnKey];

		if (currentStatus === "impossible") {
			if (step) {
				recordConflict(
					createRuleConflict(step, card, columnKey, "owned", "impossible"),
				);
			}

			return false;
		}

		let changed = false;

		if (currentStatus !== "owned") {
			resolvedNotebook[card][columnKey] = "owned";

			if (manualNotebook[card][columnKey] === "unknown") {
				sources[card][columnKey] = "deduced";

				if (step) {
					recordStep(step);
				}
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
					if (
						applyOwned(card, possibleColumns[0], {
							id: `step:single-owner:${card}:${possibleColumns[0]}`,
							rule: "singlePossibleOwner",
							status: "owned",
							card,
							columnKey: possibleColumns[0],
							evidence: createCardStatusEvidence(
								resolvedNotebook,
								card,
								columnKeys,
								"impossible",
								possibleColumns[0],
							),
						})
					) {
						hasChanges = true;
					}
				}
			}
		}

		for (const [category, categoryCards] of Object.entries(cardsByCategory) as [
			CardCategory,
			readonly Card[],
		][]) {
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
					const [card] = possibleEnvelopeCards;

					if (
						applyOwned(card, envelopeColumnId, {
							id: `step:single-envelope:${category}:${card}`,
							rule: "singleEnvelopeCandidate",
							status: "owned",
							card,
							columnKey: envelopeColumnId,
							category,
							evidence: createCategoryEnvelopeEvidence(
								resolvedNotebook,
								categoryCards,
								card,
								"impossible",
							),
						})
					) {
						hasChanges = true;
					}
				}
			}
		}

		for (const [index, suggestion] of game.suggestions.entries()) {
			const suggestionNumber = index + 1;
			const suggestionCards = getSuggestionCards(suggestion);
			const blockedPlayers = getPlayersBeforeDisprover(
				game.players,
				suggestion.suggesterPlayerId,
				suggestion.disproverPlayerId,
			);

			for (const player of blockedPlayers) {
				for (const card of suggestionCards) {
					const step: DeductionStep = suggestion.disproverPlayerId
						? {
								id: `step:blocked:${suggestion.id}:${player.id}:${card}`,
								rule: "suggestionSkippedPlayer",
								status: "impossible",
								card,
								columnKey: player.id,
								suggestionNumber,
								playerId: player.id,
								suggesterPlayerId: suggestion.suggesterPlayerId,
								disproverPlayerId: suggestion.disproverPlayerId,
								evidence: createSuggestionEvidence(suggestionNumber),
							}
						: {
								id: `step:no-disprover:${suggestion.id}:${player.id}:${card}`,
								rule: "suggestionNoDisprover",
								status: "impossible",
								card,
								columnKey: player.id,
								suggestionNumber,
								playerId: player.id,
								suggesterPlayerId: suggestion.suggesterPlayerId,
								evidence: createSuggestionEvidence(suggestionNumber),
							};

					if (applyImpossible(card, player.id, step)) {
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
					if (
						applyOwned(candidateCards[0], suggestion.disproverPlayerId, {
							id: `step:single-candidate:${suggestion.id}:${candidateCards[0]}`,
							rule: "disproverSingleCandidate",
							status: "owned",
							card: candidateCards[0],
							columnKey: suggestion.disproverPlayerId,
							suggestionNumber,
							playerId: suggestion.disproverPlayerId,
							evidence: createSuggestionEvidence(suggestionNumber),
						})
					) {
						hasChanges = true;
					}
				}
			}
		}

		for (const player of game.players) {
			const ownedCards = getOwnedCardsForPlayer(player.id, resolvedNotebook);
			const possibleCards = getPossibleCardsForPlayer(
				player.id,
				resolvedNotebook,
			);

			if (ownedCards.length > handSizeInfo.max) {
				recordConflict({
					id: `conflict:max-hand:${player.id}:${ownedCards.length}`,
					kind: "playerExceedsMaxHand",
					playerId: player.id,
					ownedCount: ownedCards.length,
					maxHand: handSizeInfo.max,
				});
			}

			if (possibleCards.length < handSizeInfo.min) {
				recordConflict({
					id: `conflict:min-hand:${player.id}:${possibleCards.length}`,
					kind: "playerBelowMinPossible",
					playerId: player.id,
					possibleCount: possibleCards.length,
					minHand: handSizeInfo.min,
				});
			}

			if (ownedCards.length === handSizeInfo.max) {
				for (const card of possibleCards) {
					if (resolvedNotebook[card][player.id] === "owned") {
						continue;
					}

					if (
						applyImpossible(card, player.id, {
							id: `step:max-hand:${player.id}:${card}`,
							rule: "playerReachedMaxHand",
							status: "impossible",
							card,
							columnKey: player.id,
							playerId: player.id,
							handSize: handSizeInfo.max,
							evidence: createHandSizeLimitEvidence(
								player.id,
								handSizeInfo.max,
								"maxOwned",
							),
						})
					) {
						hasChanges = true;
					}
				}
			}

			if (possibleCards.length === handSizeInfo.min) {
				for (const card of possibleCards) {
					if (
						applyOwned(card, player.id, {
							id: `step:min-possible:${player.id}:${card}`,
							rule: "playerReachedMinPossible",
							status: "owned",
							card,
							columnKey: player.id,
							playerId: player.id,
							handSize: handSizeInfo.min,
							evidence: createHandSizeLimitEvidence(
								player.id,
								handSizeInfo.min,
								"minPossible",
							),
						})
					) {
						hasChanges = true;
					}
				}
			}

			const handAnalysis = analyzePlayerHands(
				player.id,
				resolvedNotebook,
				game.suggestions,
				handSizeInfo,
			);

			if (handAnalysis.totalValidHands === 0) {
				recordConflict({
					id: `conflict:no-valid-hand:${player.id}`,
					kind: "playerHasNoValidHand",
					playerId: player.id,
					minHand: handSizeInfo.min,
					maxHand: handSizeInfo.max,
				});
				continue;
			}

			for (const card of handAnalysis.possibleCards) {
				const appearanceCount = handAnalysis.cardAppearanceCount[card];

				if (
					appearanceCount === handAnalysis.totalValidHands &&
					resolvedNotebook[card][player.id] !== "owned"
				) {
					if (
						applyOwned(card, player.id, {
							id: `step:hand-force-owned:${player.id}:${card}`,
							rule: "handRangeForcedOwned",
							status: "owned",
							card,
							columnKey: player.id,
							playerId: player.id,
							minHand: handSizeInfo.min,
							maxHand: handSizeInfo.max,
							evidence: createHandRangeEvidence(
								player.id,
								handSizeInfo.min,
								handSizeInfo.max,
								handAnalysis.totalValidHands,
							),
						})
					) {
						hasChanges = true;
					}
				}

				if (
					appearanceCount === 0 &&
					resolvedNotebook[card][player.id] !== "impossible"
				) {
					if (
						applyImpossible(card, player.id, {
							id: `step:hand-force-impossible:${player.id}:${card}`,
							rule: "handRangeForcedImpossible",
							status: "impossible",
							card,
							columnKey: player.id,
							playerId: player.id,
							minHand: handSizeInfo.min,
							maxHand: handSizeInfo.max,
							evidence: createHandRangeEvidence(
								player.id,
								handSizeInfo.min,
								handSizeInfo.max,
								handAnalysis.totalValidHands,
							),
						})
					) {
						hasChanges = true;
					}
				}
			}
		}
	} while (hasChanges && passCount < 50);

	for (const card of allCards) {
		const ownedColumns = columnKeys.filter(
			(columnKey) => resolvedNotebook[card][columnKey] === "owned",
		);
		const possibleColumns = columnKeys.filter(
			(columnKey) => resolvedNotebook[card][columnKey] !== "impossible",
		);

		if (ownedColumns.length > 1) {
			recordConflict({
				id: `conflict:multiple-owners:${card}:${ownedColumns.join(",")}`,
				kind: "cardHasMultipleOwners",
				card,
				columnKeys: ownedColumns,
			});
		}

		if (possibleColumns.length === 0) {
			recordConflict({
				id: `conflict:no-owner:${card}`,
				kind: "cardHasNoPossibleOwner",
				card,
			});
		}
	}

	for (const [category, categoryCards] of Object.entries(cardsByCategory) as [
		CardCategory,
		readonly Card[],
	][]) {
		const envelopeOwnedCards = categoryCards.filter(
			(card) => resolvedNotebook[card][envelopeColumnId] === "owned",
		);
		const possibleEnvelopeCards = categoryCards.filter(
			(card) => resolvedNotebook[card][envelopeColumnId] !== "impossible",
		);

		if (envelopeOwnedCards.length > 1) {
			recordConflict({
				id: `conflict:multiple-envelope:${category}:${envelopeOwnedCards.join(",")}`,
				kind: "multipleEnvelopeCardsInCategory",
				category,
				cards: envelopeOwnedCards,
			});
		}

		if (possibleEnvelopeCards.length === 0) {
			recordConflict({
				id: `conflict:no-envelope:${category}`,
				kind: "noEnvelopeCandidateInCategory",
				category,
			});
		}
	}

	for (const [index, suggestion] of game.suggestions.entries()) {
		if (!suggestion.disproverPlayerId) {
			continue;
		}

		const suggestionCards = getSuggestionCards(suggestion);
		const candidateCards = suggestionCards.filter(
			(card) =>
				resolvedNotebook[card][suggestion.disproverPlayerId as string] !==
				"impossible",
		);
		const suggestionNumber = index + 1;

		if (candidateCards.length === 0) {
			recordConflict({
				id: `conflict:no-disprover-candidate:${suggestion.id}`,
				kind: "suggestionDisproverHasNoCandidate",
				suggestionNumber,
				playerId: suggestion.disproverPlayerId,
				cards: suggestionCards,
			});
			continue;
		}

		if (candidateCards.length > 1) {
			leads.set(`lead:${suggestion.id}`, {
				id: `lead:${suggestion.id}`,
				kind: "disproverCandidates",
				suggestionNumber,
				playerId: suggestion.disproverPlayerId,
				cards: candidateCards,
			});
		}
	}

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
		reasons,
		deducedCellCount,
		steps,
		leads: [...leads.values()].sort(
			(left, right) => right.suggestionNumber - left.suggestionNumber,
		),
		conflicts: [...conflicts.values()],
	};
}
