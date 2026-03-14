import { rooms, suspects, weapons } from "./constants";
import type { Card, CardCategory } from "./types";

export const allCards = [
	...suspects,
	...weapons,
	...rooms,
] as const satisfies readonly Card[];

const suspectSet = new Set<Card>(suspects);
const weaponSet = new Set<Card>(weapons);

export const cardsByCategory = {
	suspect: suspects,
	weapon: weapons,
	room: rooms,
} as const satisfies Record<CardCategory, readonly Card[]>;

export function getCardCategory(card: Card): CardCategory {
	if (suspectSet.has(card)) {
		return "suspect";
	}

	if (weaponSet.has(card)) {
		return "weapon";
	}

	return "room";
}
