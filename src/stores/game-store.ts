import {
	createContext,
	createElement,
	type PropsWithChildren,
	startTransition,
	useContext,
	useEffect,
	useState,
} from "react";

import { allCards } from "#/lib/cluedo/cards";
import { envelopeColumnId } from "#/lib/cluedo/constants";

import type {
	Card,
	Game,
	GameSetup,
	NotebookState,
	NotebookStatus,
	Player,
	Suggestion,
	SuggestionInput,
} from "#/lib/cluedo/types";

const storageKey = "cluedo-solver.games.v2";

type GameStoreContextValue = {
	games: Record<string, Game>;
	isHydrated: boolean;
	createGame: (setup: GameSetup) => Game;
	addSuggestion: (
		gameId: string,
		suggestion: SuggestionInput,
	) => Suggestion | null;
	setNotebookStatus: (
		gameId: string,
		card: Card,
		columnKey: string,
		status: NotebookStatus,
	) => void;
};

const GameStoreContext = createContext<GameStoreContextValue | null>(null);

function createId(prefix: string) {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return `${prefix}_${crypto.randomUUID()}`;
	}

	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function createPlayers(setup: GameSetup): Player[] {
	return setup.playerNames.map((name, index) => ({
		id: createId("player"),
		name: name.trim(),
		order: index,
		isUser: index === setup.userPlayerIndex,
	}));
}

function createNotebookState(players: Player[]): NotebookState {
	return Object.fromEntries(
		allCards.map((card) => [
			card,
			Object.fromEntries([
				...players.map((player) => [player.id, "unknown" as const]),
				[envelopeColumnId, "unknown" as const],
			]),
		]),
	) as NotebookState;
}

function buildGame(setup: GameSetup): Game {
	const players = createPlayers(setup);
	const userPlayer = players[setup.userPlayerIndex] ?? players[0];

	return {
		id: createId("game"),
		createdAt: new Date().toISOString(),
		players,
		userPlayerId: userPlayer.id,
		cards: [...allCards],
		suggestions: [],
		notebook: createNotebookState(players),
	};
}

export function GameStoreProvider({ children }: PropsWithChildren) {
	const [games, setGames] = useState<Record<string, Game>>({});
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		try {
			const storedGames = window.localStorage.getItem(storageKey);

			if (storedGames) {
				setGames(JSON.parse(storedGames) as Record<string, Game>);
			}
		} finally {
			setIsHydrated(true);
		}
	}, []);

	useEffect(() => {
		if (!isHydrated) {
			return;
		}

		const persistGames = () => {
			window.localStorage.setItem(storageKey, JSON.stringify(games));
		};

		if (typeof window.requestIdleCallback === "function") {
			const idleCallbackId = window.requestIdleCallback(persistGames);

			return () => {
				window.cancelIdleCallback(idleCallbackId);
			};
		}

		const timeoutId = window.setTimeout(persistGames, 0);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [games, isHydrated]);

	const createGame = (setup: GameSetup) => {
		const game = buildGame(setup);
		setGames((currentGames) => ({
			...currentGames,
			[game.id]: game,
		}));
		return game;
	};

	const addSuggestion = (gameId: string, suggestion: SuggestionInput) => {
		const nextSuggestion: Suggestion = {
			...suggestion,
			id: createId("suggestion"),
			createdAt: new Date().toISOString(),
		};

		let wasAdded = false;

		setGames((currentGames) => {
			const game = currentGames[gameId];

			if (!game) {
				return currentGames;
			}

			wasAdded = true;

			return {
				...currentGames,
				[gameId]: {
					...game,
					suggestions: [...game.suggestions, nextSuggestion],
				},
			};
		});

		return wasAdded ? nextSuggestion : null;
	};

	const setNotebookStatus: GameStoreContextValue["setNotebookStatus"] = (
		gameId,
		card,
		columnKey,
		status,
	) => {
		startTransition(() => {
			setGames((currentGames) => {
				const game = currentGames[gameId];

				if (!game) {
					return currentGames;
				}

				if (game.notebook[card]?.[columnKey] === status) {
					return currentGames;
				}

				return {
					...currentGames,
					[gameId]: {
						...game,
						notebook: {
							...game.notebook,
							[card]: {
								...game.notebook[card],
								[columnKey]: status,
							},
						},
					},
				};
			});
		});
	};

	return createElement(
		GameStoreContext.Provider,
		{
			value: {
				games,
				isHydrated,
				createGame,
				addSuggestion,
				setNotebookStatus,
			},
		},
		children,
	);
}

export function useGameStore() {
	const context = useContext(GameStoreContext);

	if (!context) {
		throw new Error("useGameStore must be used inside GameStoreProvider.");
	}

	return context;
}
