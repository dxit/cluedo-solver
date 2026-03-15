import { allCards, cardsByCategory, getCardCategory } from "./cards";
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

type UnresolvedSuggestionConstraint = {
	suggestionNumber: number;
	cards: Card[];
};

type PlayerHandAnalysis = {
	ownedCards: Card[];
	possibleCards: Card[];
	candidateCards: Card[];
	totalValidHands: number;
	cardAppearanceCount: Record<Card, number>;
	unresolvedConstraints: UnresolvedSuggestionConstraint[];
};

type GlobalAssignmentConstraint = {
	suggestionNumber: number;
	playerIndex: number;
	cardIndices: number[];
};

type GlobalAssignmentState = {
	assignedMask: number;
	playerCounts: number[];
	envelopeMask: number;
	satisfiedMask: bigint;
};

type GlobalAssignmentAnalysis = {
	hasSolution: boolean;
	supportedColumnsByCard: Record<Card, NotebookColumnKey[]>;
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
	  }
	| {
			kind: "globalSupport";
			card: Card;
			columnKeys: NotebookColumnKey[];
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
	  }
	| {
			id: string;
			rule: "globalAssignmentOwned";
			status: "owned";
			card: Card;
			columnKey: NotebookColumnKey;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			rule: "globalAssignmentImpossible";
			status: "impossible";
			card: Card;
			columnKey: NotebookColumnKey;
			evidence?: DeductionEvidence[];
	  };

export type DeductionLead =
	| {
			id: string;
			kind: "disproverCandidates";
			suggestionNumber: number;
			playerId: string;
			cards: Card[];
	  }
	| {
			id: string;
			kind: "playerHandRange";
			playerId: string;
			suggestionNumbers: number[];
			cards: Card[];
			validHands: number;
			minHand: number;
			maxHand: number;
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
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			kind: "cardHasMultipleOwners";
			card: Card;
			columnKeys: NotebookColumnKey[];
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			kind: "cardHasNoPossibleOwner";
			card: Card;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			kind: "multipleEnvelopeCardsInCategory";
			category: CardCategory;
			cards: Card[];
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			kind: "noEnvelopeCandidateInCategory";
			category: CardCategory;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			kind: "suggestionDisproverHasNoCandidate";
			suggestionNumber: number;
			playerId: string;
			cards: Card[];
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			kind: "playerExceedsMaxHand";
			playerId: string;
			ownedCount: number;
			maxHand: number;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			kind: "playerBelowMinPossible";
			playerId: string;
			possibleCount: number;
			minHand: number;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			kind: "playerHasNoValidHand";
			playerId: string;
			minHand: number;
			maxHand: number;
			evidence?: DeductionEvidence[];
	  }
	| {
			id: string;
			kind: "noGlobalAssignment";
			evidence?: DeductionEvidence[];
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

function createSupportedColumnsByCard() {
	return Object.fromEntries(
		allCards.map(
			(card) =>
				[card, [] as NotebookColumnKey[]] satisfies [Card, NotebookColumnKey[]],
		),
	) as Record<Card, NotebookColumnKey[]>;
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
		evidence: [
			...(step.evidence ?? []),
			{
				kind: "cell",
				card,
				columnKey,
				status: existingStatus,
			},
		],
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

function createGlobalSupportEvidence(
	card: Card,
	columnKeys: NotebookColumnKey[],
): DeductionEvidence[] {
	return [{ kind: "globalSupport", card, columnKeys }];
}

function createPlayerStatusEvidence(
	notebook: NotebookState,
	playerId: string,
	status: DeducedNotebookStatus,
	cards: readonly Card[] = allCards,
): DeductionEvidence[] {
	return cards
		.filter((card) => notebook[card][playerId] === status)
		.map((card) => ({
			kind: "cell" as const,
			card,
			columnKey: playerId,
			status,
		}));
}

function getLeadSortValue(lead: DeductionLead) {
	switch (lead.kind) {
		case "disproverCandidates":
			return lead.suggestionNumber;
		case "playerHandRange":
			return Math.max(...lead.suggestionNumbers);
	}
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
	const unresolvedConstraints = suggestions
		.flatMap((suggestion, index) =>
			suggestion.disproverPlayerId === playerId
				? [
						{
							suggestionNumber: index + 1,
							cards: getSuggestionCards(suggestion).filter(
								(card) => notebook[card][playerId] !== "impossible",
							),
						},
					]
				: [],
		)
		.filter(({ cards }) => !cards.some((card) => ownedCardSet.has(card)))
		.map(({ suggestionNumber, cards }) => ({
			suggestionNumber,
			cards: cards.filter((card) => !ownedCardSet.has(card)),
		}));
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
		return unresolvedConstraints.every(({ cards }) =>
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

	const candidateCards = unknownPossibleCards.filter(
		(card) => cardAppearanceCount[card] > 0,
	);

	return {
		ownedCards,
		possibleCards,
		candidateCards,
		totalValidHands,
		cardAppearanceCount,
		unresolvedConstraints,
	};
}

function getCategoryIndex(category: CardCategory) {
	switch (category) {
		case "suspect":
			return 0;
		case "weapon":
			return 1;
		case "room":
			return 2;
	}
}

function createGlobalAssignmentAnalysis(
	notebook: NotebookState,
	players: Player[],
	suggestions: Suggestion[],
	columnKeys: NotebookColumnKey[],
	handSizeInfo: HandSizeInfo,
): GlobalAssignmentAnalysis {
	const supportedColumnsByCard = createSupportedColumnsByCard();
	const envelopeIndex = columnKeys.indexOf(envelopeColumnId);
	const playerIndexById = Object.fromEntries(
		players.map((player, index) => [player.id, index]),
	) as Record<string, number>;
	const cardIndexByCard = Object.fromEntries(
		allCards.map((card, index) => [card, index]),
	) as Record<Card, number>;
	const categoryIndexByCard = allCards.map((card) =>
		getCategoryIndex(getCardCategory(card)),
	);
	const domainByCardIndex = allCards.map((card) =>
		columnKeys.flatMap((columnKey, columnIndex) =>
			notebook[card][columnKey] !== "impossible" ? [columnIndex] : [],
		),
	);
	const fixedOwnerByCardIndex = allCards.map((card) => {
		const ownedColumns = columnKeys.flatMap((columnKey, columnIndex) =>
			notebook[card][columnKey] === "owned" ? [columnIndex] : [],
		);

		if (ownedColumns.length > 1) {
			return -1;
		}

		return ownedColumns[0] ?? null;
	});

	if (
		domainByCardIndex.some((domain) => domain.length === 0) ||
		fixedOwnerByCardIndex.some((ownerIndex) => ownerIndex === -1)
	) {
		return {
			hasSolution: false,
			supportedColumnsByCard,
		};
	}

	const constraints: GlobalAssignmentConstraint[] = [];
	const constraintIndicesByCardIndex = Array.from(
		{ length: allCards.length },
		() => [] as number[],
	);

	for (const [index, suggestion] of suggestions.entries()) {
		if (!suggestion.disproverPlayerId) {
			continue;
		}

		const playerIndex = playerIndexById[suggestion.disproverPlayerId];

		if (playerIndex === undefined) {
			continue;
		}

		const cardIndices = getSuggestionCards(suggestion)
			.map((card) => cardIndexByCard[card])
			.filter((cardIndex) =>
				domainByCardIndex[cardIndex].includes(playerIndex),
			);

		if (cardIndices.length === 0) {
			return {
				hasSolution: false,
				supportedColumnsByCard,
			};
		}

		const constraintIndex = constraints.length;
		constraintIndicesByCardIndex.forEach((_, cardIndex) => {
			if (cardIndices.includes(cardIndex)) {
				constraintIndicesByCardIndex[cardIndex].push(constraintIndex);
			}
		});
		constraints.push({
			suggestionNumber: index + 1,
			playerIndex,
			cardIndices,
		});
	}

	const fullAssignedMask = (1 << allCards.length) - 1;
	const memo = new Map<string, boolean>();

	const isConstraintSatisfied = (mask: bigint, constraintIndex: number) => {
		return (mask & (1n << BigInt(constraintIndex))) !== 0n;
	};

	const canAssignToOwner = (
		state: GlobalAssignmentState,
		cardIndex: number,
		ownerIndex: number,
	) => {
		if (!domainByCardIndex[cardIndex].includes(ownerIndex)) {
			return false;
		}

		if (ownerIndex === envelopeIndex) {
			const categoryBit = 1 << categoryIndexByCard[cardIndex];
			return (state.envelopeMask & categoryBit) === 0;
		}

		return state.playerCounts[ownerIndex] < handSizeInfo.max;
	};

	const applyAssignmentToState = (
		state: GlobalAssignmentState,
		cardIndex: number,
		ownerIndex: number,
	): GlobalAssignmentState | null => {
		const cardBit = 1 << cardIndex;

		if (
			(state.assignedMask & cardBit) !== 0 ||
			!canAssignToOwner(state, cardIndex, ownerIndex)
		) {
			return null;
		}

		const nextState: GlobalAssignmentState = {
			assignedMask: state.assignedMask | cardBit,
			playerCounts: [...state.playerCounts],
			envelopeMask: state.envelopeMask,
			satisfiedMask: state.satisfiedMask,
		};

		if (ownerIndex === envelopeIndex) {
			nextState.envelopeMask |= 1 << categoryIndexByCard[cardIndex];
		} else {
			nextState.playerCounts[ownerIndex] += 1;

			if (nextState.playerCounts[ownerIndex] > handSizeInfo.max) {
				return null;
			}
		}

		for (const constraintIndex of constraintIndicesByCardIndex[cardIndex]) {
			const constraint = constraints[constraintIndex];

			if (constraint.playerIndex === ownerIndex) {
				nextState.satisfiedMask |= 1n << BigInt(constraintIndex);
			}
		}

		return nextState;
	};

	const isStateFeasible = (state: GlobalAssignmentState) => {
		for (const [playerIndex] of players.entries()) {
			if (state.playerCounts[playerIndex] > handSizeInfo.max) {
				return false;
			}

			let remainingPossibleCards = 0;

			for (const [cardIndex, domain] of domainByCardIndex.entries()) {
				if ((state.assignedMask & (1 << cardIndex)) !== 0) {
					continue;
				}

				if (domain.includes(playerIndex)) {
					remainingPossibleCards += 1;
				}
			}

			if (
				state.playerCounts[playerIndex] + remainingPossibleCards <
				handSizeInfo.min
			) {
				return false;
			}
		}

		for (const [category, categoryCards] of Object.entries(cardsByCategory) as [
			CardCategory,
			readonly Card[],
		][]) {
			const categoryBit = 1 << getCategoryIndex(category);

			if ((state.envelopeMask & categoryBit) !== 0) {
				continue;
			}

			const hasRemainingEnvelopeCandidate = categoryCards.some((card) => {
				const cardIndex = cardIndexByCard[card];
				return (
					(state.assignedMask & (1 << cardIndex)) === 0 &&
					domainByCardIndex[cardIndex].includes(envelopeIndex)
				);
			});

			if (!hasRemainingEnvelopeCandidate) {
				return false;
			}
		}

		for (const [constraintIndex, constraint] of constraints.entries()) {
			if (isConstraintSatisfied(state.satisfiedMask, constraintIndex)) {
				continue;
			}

			if (state.playerCounts[constraint.playerIndex] >= handSizeInfo.max) {
				return false;
			}

			const hasRemainingCandidate = constraint.cardIndices.some(
				(cardIndex) => (state.assignedMask & (1 << cardIndex)) === 0,
			);

			if (!hasRemainingCandidate) {
				return false;
			}
		}

		return true;
	};

	const getStateKey = (state: GlobalAssignmentState) => {
		return [
			state.assignedMask,
			state.envelopeMask,
			state.playerCounts.join(","),
			state.satisfiedMask.toString(),
		].join("|");
	};

	const hasFeasibleCompletion = (state: GlobalAssignmentState): boolean => {
		const stateKey = getStateKey(state);
		const cached = memo.get(stateKey);

		if (cached !== undefined) {
			return cached;
		}

		if (!isStateFeasible(state)) {
			memo.set(stateKey, false);
			return false;
		}

		if (state.assignedMask === fullAssignedMask) {
			const allPlayersSatisfied = state.playerCounts.every(
				(count) => count >= handSizeInfo.min && count <= handSizeInfo.max,
			);
			const allEnvelopeCategoriesSatisfied = state.envelopeMask === 0b111;
			const allConstraintsSatisfied = constraints.every((_, constraintIndex) =>
				isConstraintSatisfied(state.satisfiedMask, constraintIndex),
			);
			const result =
				allPlayersSatisfied &&
				allEnvelopeCategoriesSatisfied &&
				allConstraintsSatisfied;

			memo.set(stateKey, result);
			return result;
		}

		let nextCardIndex = -1;
		let nextOwners: number[] = [];

		for (const [cardIndex] of allCards.entries()) {
			if ((state.assignedMask & (1 << cardIndex)) !== 0) {
				continue;
			}

			const feasibleOwners = domainByCardIndex[cardIndex].filter((ownerIndex) =>
				canAssignToOwner(state, cardIndex, ownerIndex),
			);

			if (feasibleOwners.length === 0) {
				memo.set(stateKey, false);
				return false;
			}

			if (nextCardIndex === -1 || feasibleOwners.length < nextOwners.length) {
				nextCardIndex = cardIndex;
				nextOwners = feasibleOwners;

				if (feasibleOwners.length === 1) {
					break;
				}
			}
		}

		for (const ownerIndex of nextOwners) {
			const nextState = applyAssignmentToState(
				state,
				nextCardIndex,
				ownerIndex,
			);

			if (nextState && hasFeasibleCompletion(nextState)) {
				memo.set(stateKey, true);
				return true;
			}
		}

		memo.set(stateKey, false);
		return false;
	};

	let initialState: GlobalAssignmentState = {
		assignedMask: 0,
		playerCounts: Array.from({ length: players.length }, () => 0),
		envelopeMask: 0,
		satisfiedMask: 0n,
	};

	for (const [constraintIndex, constraint] of constraints.entries()) {
		const fixedToPlayer = constraint.cardIndices.some(
			(cardIndex) =>
				fixedOwnerByCardIndex[cardIndex] === constraint.playerIndex,
		);

		if (fixedToPlayer) {
			initialState = {
				...initialState,
				satisfiedMask:
					initialState.satisfiedMask | (1n << BigInt(constraintIndex)),
			};
		}
	}

	for (const [cardIndex, ownerIndex] of fixedOwnerByCardIndex.entries()) {
		if (ownerIndex === null) {
			continue;
		}

		const nextState = applyAssignmentToState(
			initialState,
			cardIndex,
			ownerIndex,
		);

		if (!nextState) {
			return {
				hasSolution: false,
				supportedColumnsByCard,
			};
		}

		initialState = nextState;
	}

	if (!hasFeasibleCompletion(initialState)) {
		return {
			hasSolution: false,
			supportedColumnsByCard,
		};
	}

	for (const [cardIndex, card] of allCards.entries()) {
		const fixedOwnerIndex = fixedOwnerByCardIndex[cardIndex];

		if (fixedOwnerIndex !== null) {
			supportedColumnsByCard[card] = [columnKeys[fixedOwnerIndex]];
			continue;
		}

		supportedColumnsByCard[card] = domainByCardIndex[cardIndex]
			.filter((ownerIndex) => {
				const nextState = applyAssignmentToState(
					initialState,
					cardIndex,
					ownerIndex,
				);
				return nextState ? hasFeasibleCompletion(nextState) : false;
			})
			.map((ownerIndex) => columnKeys[ownerIndex]);
	}

	return {
		hasSolution: true,
		supportedColumnsByCard,
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

	const runGlobalAssignmentPass = () => {
		const globalAnalysis = createGlobalAssignmentAnalysis(
			resolvedNotebook,
			game.players,
			game.suggestions,
			columnKeys,
			handSizeInfo,
		);

		if (!globalAnalysis.hasSolution) {
			return false;
		}

		let globalChanged = false;

		for (const card of allCards) {
			const supportedColumns = globalAnalysis.supportedColumnsByCard[card];

			for (const columnKey of columnKeys) {
				if (supportedColumns.includes(columnKey)) {
					continue;
				}

				if (
					applyImpossible(card, columnKey, {
						id: `step:global-impossible:${card}:${columnKey}:${supportedColumns.join(",")}`,
						rule: "globalAssignmentImpossible",
						status: "impossible",
						card,
						columnKey,
						evidence: createGlobalSupportEvidence(card, supportedColumns),
					})
				) {
					globalChanged = true;
				}
			}

			if (supportedColumns.length === 1) {
				if (
					applyOwned(card, supportedColumns[0], {
						id: `step:global-owned:${card}:${supportedColumns[0]}`,
						rule: "globalAssignmentOwned",
						status: "owned",
						card,
						columnKey: supportedColumns[0],
						evidence: createGlobalSupportEvidence(card, supportedColumns),
					})
				) {
					globalChanged = true;
				}
			}
		}

		return globalChanged;
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
					evidence: createPlayerStatusEvidence(
						resolvedNotebook,
						player.id,
						"owned",
					),
				});
			}

			if (possibleCards.length < handSizeInfo.min) {
				recordConflict({
					id: `conflict:min-hand:${player.id}:${possibleCards.length}`,
					kind: "playerBelowMinPossible",
					playerId: player.id,
					possibleCount: possibleCards.length,
					minHand: handSizeInfo.min,
					evidence: createPlayerStatusEvidence(
						resolvedNotebook,
						player.id,
						"impossible",
					),
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
					evidence: [
						...createHandRangeEvidence(
							player.id,
							handSizeInfo.min,
							handSizeInfo.max,
							0,
						),
						...handAnalysis.unresolvedConstraints.map(
							({ suggestionNumber }) => ({
								kind: "suggestion" as const,
								suggestionNumber,
							}),
						),
					],
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
		if (!hasChanges && runGlobalAssignmentPass()) {
			hasChanges = true;
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
				evidence: createCardStatusEvidence(
					resolvedNotebook,
					card,
					columnKeys,
					"owned",
				),
			});
		}

		if (possibleColumns.length === 0) {
			recordConflict({
				id: `conflict:no-owner:${card}`,
				kind: "cardHasNoPossibleOwner",
				card,
				evidence: createCardStatusEvidence(
					resolvedNotebook,
					card,
					columnKeys,
					"impossible",
				),
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
				evidence: envelopeOwnedCards.map((card) => ({
					kind: "cell" as const,
					card,
					columnKey: envelopeColumnId,
					status: "owned" as const,
				})),
			});
		}

		if (possibleEnvelopeCards.length === 0) {
			recordConflict({
				id: `conflict:no-envelope:${category}`,
				kind: "noEnvelopeCandidateInCategory",
				category,
				evidence: categoryCards.map((card) => ({
					kind: "cell" as const,
					card,
					columnKey: envelopeColumnId,
					status: "impossible" as const,
				})),
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
				evidence: [
					...createSuggestionEvidence(suggestionNumber),
					...createPlayerStatusEvidence(
						resolvedNotebook,
						suggestion.disproverPlayerId,
						"impossible",
						suggestionCards,
					),
				],
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

	for (const player of game.players) {
		const handAnalysis = analyzePlayerHands(
			player.id,
			resolvedNotebook,
			game.suggestions,
			handSizeInfo,
		);

		if (
			handAnalysis.totalValidHands <= 1 ||
			handAnalysis.unresolvedConstraints.length <= 1 ||
			handAnalysis.candidateCards.length === 0
		) {
			continue;
		}

		leads.set(`lead:hand-range:${player.id}`, {
			id: `lead:hand-range:${player.id}`,
			kind: "playerHandRange",
			playerId: player.id,
			suggestionNumbers: handAnalysis.unresolvedConstraints.map(
				({ suggestionNumber }) => suggestionNumber,
			),
			cards: handAnalysis.candidateCards,
			validHands: handAnalysis.totalValidHands,
			minHand: handSizeInfo.min,
			maxHand: handSizeInfo.max,
		});
	}

	const finalGlobalAnalysis = createGlobalAssignmentAnalysis(
		resolvedNotebook,
		game.players,
		game.suggestions,
		columnKeys,
		handSizeInfo,
	);

	if (!finalGlobalAnalysis.hasSolution) {
		recordConflict({
			id: "conflict:no-global-assignment",
			kind: "noGlobalAssignment",
		});
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
			(left, right) => getLeadSortValue(right) - getLeadSortValue(left),
		),
		conflicts: [...conflicts.values()],
	};
}
