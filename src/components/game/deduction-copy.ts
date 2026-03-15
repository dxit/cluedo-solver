import type { TFunction } from "i18next";

import { envelopeColumnId } from "#/lib/cluedo/constants";
import type {
	DeductionConflict,
	DeductionEvidence,
	DeductionLead,
	DeductionStep,
} from "#/lib/cluedo/deduction";
import type { Card, NotebookColumnKey, Player } from "#/lib/cluedo/types";

export type DeductionEvidenceReference = {
	id: string;
	label: string;
	href: string | null;
};

function getPlayerNameById(players: Player[]) {
	return Object.fromEntries(players.map((player) => [player.id, player.name]));
}

function getCardLabel(card: Card, t: TFunction) {
	return t(`cards.${card}`);
}

function getColumnLabel(
	columnKey: NotebookColumnKey,
	players: Player[],
	t: TFunction,
) {
	if (columnKey === envelopeColumnId) {
		return t("notebook.envelope");
	}

	const playerNameById = getPlayerNameById(players);
	return playerNameById[columnKey] ?? columnKey;
}

function formatCardList(cards: Card[], t: TFunction) {
	return cards.map((card) => getCardLabel(card, t)).join(", ");
}

function formatSuggestionNumberList(suggestionNumbers: number[]) {
	return suggestionNumbers.join(", ");
}

function formatColumnList(
	columnKeys: NotebookColumnKey[],
	players: Player[],
	t: TFunction,
) {
	return columnKeys
		.map((columnKey) => getColumnLabel(columnKey, players, t))
		.join(", ");
}

function formatDeductionEvidence(
	evidence: DeductionEvidence,
	players: Player[],
	t: TFunction,
) {
	switch (evidence.kind) {
		case "suggestion":
			return t("engine.evidence.suggestion", {
				index: evidence.suggestionNumber,
			});
		case "cell":
			return t("engine.evidence.cell", {
				card: getCardLabel(evidence.card, t),
				column: getColumnLabel(evidence.columnKey, players, t),
				status: t(`notebook.status.${evidence.status}`),
			});
		case "handSizeLimit":
			return evidence.reached === "maxOwned"
				? t("engine.evidence.handSizeLimitMax", {
						player: getColumnLabel(evidence.playerId, players, t),
						handSize: evidence.handSize,
					})
				: t("engine.evidence.handSizeLimitMin", {
						player: getColumnLabel(evidence.playerId, players, t),
						handSize: evidence.handSize,
					});
		case "handRange":
			return t("engine.evidence.handRange", {
				player: getColumnLabel(evidence.playerId, players, t),
				count: evidence.validHands,
				minHand: evidence.minHand,
				maxHand: evidence.maxHand,
			});
		case "globalSupport":
			return t("engine.evidence.globalSupport", {
				card: getCardLabel(evidence.card, t),
				columns: formatColumnList(evidence.columnKeys, players, t),
			});
	}
}

function getDeductionEvidenceId(evidence: DeductionEvidence) {
	switch (evidence.kind) {
		case "suggestion":
			return `suggestion:${evidence.suggestionNumber}`;
		case "cell":
			return `cell:${evidence.card}:${evidence.columnKey}:${evidence.status}`;
		case "handSizeLimit":
			return `hand-size:${evidence.playerId}:${evidence.reached}:${evidence.handSize}`;
		case "handRange":
			return `hand-range:${evidence.playerId}:${evidence.minHand}:${evidence.maxHand}:${evidence.validHands}`;
		case "globalSupport":
			return `global-support:${evidence.card}:${evidence.columnKeys.join(",")}`;
	}
}

export function getSuggestionEntryAnchorId(suggestionNumber: number) {
	return `suggestion-entry-${suggestionNumber}`;
}

export function getNotebookCellAnchorId(
	card: Card,
	columnKey: NotebookColumnKey,
) {
	return `notebook-cell-${card}-${columnKey}`;
}

function getDeductionEvidenceHref(evidence: DeductionEvidence) {
	switch (evidence.kind) {
		case "suggestion":
			return `#${getSuggestionEntryAnchorId(evidence.suggestionNumber)}`;
		case "cell":
			return `#${getNotebookCellAnchorId(evidence.card, evidence.columnKey)}`;
		case "handSizeLimit":
		case "handRange":
		case "globalSupport":
			return null;
	}
}

export function formatDeductionStep(
	step: DeductionStep,
	players: Player[],
	t: TFunction,
) {
	switch (step.rule) {
		case "suggestionSkippedPlayer":
			return t("engine.rules.suggestionSkippedPlayer", {
				index: step.suggestionNumber,
				player: getColumnLabel(step.playerId, players, t),
				card: getCardLabel(step.card, t),
			});
		case "suggestionNoDisprover":
			return t("engine.rules.suggestionNoDisprover", {
				index: step.suggestionNumber,
				player: getColumnLabel(step.playerId, players, t),
				card: getCardLabel(step.card, t),
			});
		case "disproverSingleCandidate":
			return t("engine.rules.disproverSingleCandidate", {
				index: step.suggestionNumber,
				player: getColumnLabel(step.playerId, players, t),
				card: getCardLabel(step.card, t),
			});
		case "singlePossibleOwner":
			if (step.columnKey === envelopeColumnId) {
				return t("engine.rules.singlePossibleOwnerEnvelope", {
					card: getCardLabel(step.card, t),
				});
			}

			return t("engine.rules.singlePossibleOwnerPlayer", {
				player: getColumnLabel(step.columnKey, players, t),
				card: getCardLabel(step.card, t),
			});
		case "singleEnvelopeCandidate":
			return t("engine.rules.singleEnvelopeCandidate", {
				card: getCardLabel(step.card, t),
				category: t(`categories.${step.category}`),
			});
		case "playerReachedMaxHand":
			return t("engine.rules.playerReachedMaxHand", {
				player: getColumnLabel(step.playerId, players, t),
				handSize: step.handSize,
				card: getCardLabel(step.card, t),
			});
		case "playerReachedMinPossible":
			return t("engine.rules.playerReachedMinPossible", {
				player: getColumnLabel(step.playerId, players, t),
				handSize: step.handSize,
				card: getCardLabel(step.card, t),
			});
		case "handRangeForcedOwned":
			return t("engine.rules.handRangeForcedOwned", {
				player: getColumnLabel(step.playerId, players, t),
				card: getCardLabel(step.card, t),
				minHand: step.minHand,
				maxHand: step.maxHand,
			});
		case "handRangeForcedImpossible":
			return t("engine.rules.handRangeForcedImpossible", {
				player: getColumnLabel(step.playerId, players, t),
				card: getCardLabel(step.card, t),
				minHand: step.minHand,
				maxHand: step.maxHand,
			});
		case "globalAssignmentOwned":
			if (step.columnKey === envelopeColumnId) {
				return t("engine.rules.globalAssignmentOwnedEnvelope", {
					card: getCardLabel(step.card, t),
				});
			}

			return t("engine.rules.globalAssignmentOwnedPlayer", {
				player: getColumnLabel(step.columnKey, players, t),
				card: getCardLabel(step.card, t),
			});
		case "globalAssignmentImpossible":
			return t("engine.rules.globalAssignmentImpossible", {
				column: getColumnLabel(step.columnKey, players, t),
				card: getCardLabel(step.card, t),
			});
	}
}

export function formatDeductionLead(
	lead: DeductionLead,
	players: Player[],
	t: TFunction,
) {
	switch (lead.kind) {
		case "disproverCandidates":
			return t("engine.leads.disproverCandidates", {
				index: lead.suggestionNumber,
				player: getColumnLabel(lead.playerId, players, t),
				cards: formatCardList(lead.cards, t),
			});
		case "playerHandRange":
			return t("engine.leads.playerHandRange", {
				entries: formatSuggestionNumberList(lead.suggestionNumbers),
				player: getColumnLabel(lead.playerId, players, t),
				cards: formatCardList(lead.cards, t),
				count: lead.validHands,
				minHand: lead.minHand,
				maxHand: lead.maxHand,
			});
	}
}

export function formatDeductionConflict(
	conflict: DeductionConflict,
	players: Player[],
	t: TFunction,
) {
	switch (conflict.kind) {
		case "ruleConflict":
			if (conflict.attemptedStatus === "impossible") {
				return t("engine.conflicts.ruleConflictImpossible", {
					card: getCardLabel(conflict.card, t),
					column: getColumnLabel(conflict.columnKey, players, t),
					index: conflict.suggestionNumber,
				});
			}

			return t("engine.conflicts.ruleConflictOwned", {
				card: getCardLabel(conflict.card, t),
				column: getColumnLabel(conflict.columnKey, players, t),
				index: conflict.suggestionNumber,
			});
		case "cardHasMultipleOwners":
			return t("engine.conflicts.multipleOwners", {
				card: getCardLabel(conflict.card, t),
				columns: formatColumnList(conflict.columnKeys, players, t),
			});
		case "cardHasNoPossibleOwner":
			return t("engine.conflicts.noPossibleOwner", {
				card: getCardLabel(conflict.card, t),
			});
		case "multipleEnvelopeCardsInCategory":
			return t("engine.conflicts.multipleEnvelopeCards", {
				category: t(`categories.${conflict.category}`),
				cards: formatCardList(conflict.cards, t),
			});
		case "noEnvelopeCandidateInCategory":
			return t("engine.conflicts.noEnvelopeCandidate", {
				category: t(`categories.${conflict.category}`),
			});
		case "suggestionDisproverHasNoCandidate":
			return t("engine.conflicts.suggestionDisproverHasNoCandidate", {
				index: conflict.suggestionNumber,
				player: getColumnLabel(conflict.playerId, players, t),
				cards: formatCardList(conflict.cards, t),
			});
		case "playerExceedsMaxHand":
			return t("engine.conflicts.playerExceedsMaxHand", {
				player: getColumnLabel(conflict.playerId, players, t),
				count: conflict.ownedCount,
				maxHand: conflict.maxHand,
			});
		case "playerBelowMinPossible":
			return t("engine.conflicts.playerBelowMinPossible", {
				player: getColumnLabel(conflict.playerId, players, t),
				count: conflict.possibleCount,
				minHand: conflict.minHand,
			});
		case "playerHasNoValidHand":
			return t("engine.conflicts.playerHasNoValidHand", {
				player: getColumnLabel(conflict.playerId, players, t),
				minHand: conflict.minHand,
				maxHand: conflict.maxHand,
			});
		case "noGlobalAssignment":
			return t("engine.conflicts.noGlobalAssignment");
	}
}

export function getDeductionEvidenceReferencesFromList(
	evidence: DeductionEvidence[] | undefined,
	players: Player[],
	t: TFunction,
): DeductionEvidenceReference[] {
	return (
		evidence?.map((item) => ({
			id: getDeductionEvidenceId(item),
			label: formatDeductionEvidence(item, players, t),
			href: getDeductionEvidenceHref(item),
		})) ?? []
	);
}

export function getDeductionEvidenceReferences(
	step: DeductionStep,
	players: Player[],
	t: TFunction,
) {
	return getDeductionEvidenceReferencesFromList(step.evidence, players, t);
}

export function formatDeductionEvidenceList(
	step: DeductionStep,
	players: Player[],
	t: TFunction,
) {
	return getDeductionEvidenceReferences(step, players, t).map(
		(reference) => reference.label,
	);
}

export function formatDeductionExplanation(
	step: DeductionStep,
	players: Player[],
	t: TFunction,
) {
	return [
		formatDeductionStep(step, players, t),
		...formatDeductionEvidenceList(step, players, t),
	].join("\n");
}
