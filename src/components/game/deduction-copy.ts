import type { TFunction } from "i18next";

import { envelopeColumnId } from "#/lib/cluedo/constants";
import type {
	DeductionConflict,
	DeductionLead,
	DeductionStep,
} from "#/lib/cluedo/deduction";
import type { Card, NotebookColumnKey, Player } from "#/lib/cluedo/types";

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

function formatColumnList(
	columnKeys: NotebookColumnKey[],
	players: Player[],
	t: TFunction,
) {
	return columnKeys
		.map((columnKey) => getColumnLabel(columnKey, players, t))
		.join(", ");
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
	}
}
