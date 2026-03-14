export type Suspect =
	| "green"
	| "mustard"
	| "peacock"
	| "plum"
	| "scarlet"
	| "white";

export type Weapon =
	| "candlestick"
	| "dagger"
	| "leadPipe"
	| "revolver"
	| "rope"
	| "wrench";

export type Room =
	| "kitchen"
	| "ballroom"
	| "conservatory"
	| "diningRoom"
	| "billiardRoom"
	| "library"
	| "lounge"
	| "hall"
	| "study";

export type Card = Suspect | Weapon | Room;

export type CardCategory = "suspect" | "weapon" | "room";

export type Player = {
	id: string;
	name: string;
	order: number;
	isUser: boolean;
};

export type Suggestion = {
	id: string;
	suggesterPlayerId: string;
	suspect: Suspect;
	weapon: Weapon;
	room: Room;
	disproverPlayerId: string | null;
	createdAt: string;
};

export type SuggestionInput = Omit<Suggestion, "createdAt" | "id">;

export type NotebookStatus = "owned" | "impossible" | "unknown";

export type NotebookColumnKey = string;

export type NotebookState = Record<
	Card,
	Record<NotebookColumnKey, NotebookStatus>
>;

export type GameSetup = {
	playerCount: number;
	playerNames: string[];
	userPlayerIndex: number;
};

export type Game = {
	id: string;
	createdAt: string;
	players: Player[];
	userPlayerId: string;
	cards: Card[];
	suggestions: Suggestion[];
	notebook: NotebookState;
};
