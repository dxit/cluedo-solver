import type { Room, Suspect, Weapon } from "./types";

export const minPlayers = 3;
export const maxPlayers = 6;

export const envelopeColumnId = "envelope" as const;

export const suspects = [
	"green",
	"mustard",
	"peacock",
	"plum",
	"scarlet",
	"white",
] as const satisfies readonly Suspect[];

export const weapons = [
	"candlestick",
	"dagger",
	"leadPipe",
	"revolver",
	"rope",
	"wrench",
] as const satisfies readonly Weapon[];

export const rooms = [
	"kitchen",
	"ballroom",
	"conservatory",
	"diningRoom",
	"billiardRoom",
	"library",
	"lounge",
	"hall",
	"study",
] as const satisfies readonly Room[];
