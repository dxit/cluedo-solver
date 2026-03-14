import { createFileRoute, Link } from "@tanstack/react-router";

import DeductionPanel from "#/components/game/deduction-panel";
import NotebookTable from "#/components/game/notebook-table";
import SuggestionForm from "#/components/game/suggestion-form";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { getDeductionResult } from "#/lib/cluedo/deduction";
import { useTranslation } from "#/lib/i18n/provider";
import { useGameStore } from "#/stores/game-store";

export const Route = createFileRoute("/$locale/game/$gameId")({
	component: GamePage,
});

function GamePage() {
	const { gameId, locale } = Route.useParams();
	const { t } = useTranslation();
	const { addSuggestion, games, isHydrated, setNotebookStatus } =
		useGameStore();
	const game = games[gameId];

	if (!isHydrated) {
		return (
			<main className="page-wrap px-4 py-10">
				<Card className="island-shell border-[var(--line)] bg-transparent py-0 shadow-none">
					<CardContent className="px-6 py-10 text-center text-[var(--sea-ink-soft)]">
						{t("common.loadingNotebook")}
					</CardContent>
				</Card>
			</main>
		);
	}

	if (!game) {
		return (
			<main className="page-wrap px-4 py-10">
				<Card className="island-shell border-[var(--line)] bg-transparent py-0 shadow-none">
					<CardHeader className="px-6 pt-6">
						<CardTitle className="text-2xl text-[var(--sea-ink)]">
							{t("game.notFoundTitle")}
						</CardTitle>
						<CardDescription className="text-[var(--sea-ink-soft)]">
							{t("game.notFoundDescription")}
						</CardDescription>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<Button asChild>
							<Link to="/$locale/new-game" params={{ locale }}>
								{t("common.createNewGame")}
							</Link>
						</Button>
					</CardContent>
				</Card>
			</main>
		);
	}

	const userPlayer =
		game.players.find((player) => player.id === game.userPlayerId) ??
		game.players[0];
	const playerNameById = Object.fromEntries(
		game.players.map((player) => [player.id, player.name]),
	);
	const suggestionHistory = [...game.suggestions].reverse();
	const deductionResult = getDeductionResult(game);

	return (
		<main className="page-wrap px-4 pb-12 pt-8">
			<Card className="setup-hero island-shell mb-6 border-[var(--line)] bg-transparent py-0 shadow-none">
				<CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
					<div>
						<p className="island-kicker mb-2">{t("game.kicker")}</p>
						<h1 className="display-title m-0 text-4xl text-[var(--sea-ink)] sm:text-5xl">
							{t("game.title")}
						</h1>
						<p className="mt-3 max-w-3xl text-[var(--sea-ink-soft)]">
							{t("game.description")}
						</p>
					</div>
					<Button
						asChild
						variant="outline"
						className="soft-button-surface rounded-full"
					>
						<Link to="/$locale/new-game" params={{ locale }}>
							{t("common.startAnotherGame")}
						</Link>
					</Button>
				</CardContent>
				<CardContent className="px-6 pb-6 pt-0">
					<div className="grid gap-4 md:grid-cols-3">
						<div className="metric-tile">
							<CardDescription className="text-[var(--sea-ink-soft)]">
								{t("game.youArePlayingAs")}
							</CardDescription>
							<CardTitle className="mt-3 text-2xl text-[var(--sea-ink)]">
								{userPlayer.name}
							</CardTitle>
						</div>
						<div className="metric-tile">
							<CardDescription className="text-[var(--sea-ink-soft)]">
								{t("game.playersAtTable")}
							</CardDescription>
							<CardTitle className="metric-value mt-3 text-[var(--sea-ink)]">
								{game.players.length}
							</CardTitle>
						</div>
						<div className="metric-tile">
							<CardDescription className="text-[var(--sea-ink-soft)]">
								{t("game.suggestionsLogged")}
							</CardDescription>
							<CardTitle className="metric-value mt-3 text-[var(--sea-ink)]">
								{game.suggestions.length}
							</CardTitle>
						</div>
					</div>
				</CardContent>
			</Card>

			<section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
				<Card className="island-shell border-[var(--line)] bg-transparent py-0 shadow-none">
					<CardHeader className="px-6 pt-6">
						<CardTitle className="text-2xl text-[var(--sea-ink)]">
							{t("notebook.title")}
						</CardTitle>
						<CardDescription className="text-[var(--sea-ink-soft)]">
							{t("notebook.description")}
						</CardDescription>
						{deductionResult.deducedCellCount > 0 ? (
							<p className="mt-3 text-sm font-medium text-[var(--kicker)]">
								{t("notebook.autoHint", {
									count: deductionResult.deducedCellCount,
								})}
							</p>
						) : null}
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<NotebookTable
							cards={game.cards}
							players={game.players}
							notebook={deductionResult.notebook}
							sources={deductionResult.sources}
							reasons={deductionResult.reasons}
							onStatusChange={(card, columnKey, status) =>
								setNotebookStatus(game.id, card, columnKey, status)
							}
						/>
					</CardContent>
				</Card>

				<div className="grid gap-6">
					<Card className="island-shell border-[var(--line)] bg-transparent py-0 shadow-none">
						<CardHeader className="px-6 pt-6">
							<CardTitle className="text-2xl text-[var(--sea-ink)]">
								{t("suggestion.title")}
							</CardTitle>
							<CardDescription className="text-[var(--sea-ink-soft)]">
								{t("suggestion.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="px-6 pb-6">
							<SuggestionForm
								players={game.players}
								onSubmit={(suggestion) => {
									void addSuggestion(game.id, suggestion);
								}}
							/>
						</CardContent>
					</Card>

					<DeductionPanel players={game.players} result={deductionResult} />

					<Card className="island-shell border-[var(--line)] bg-transparent py-0 shadow-none">
						<CardHeader className="px-6 pt-6">
							<CardTitle className="text-2xl text-[var(--sea-ink)]">
								{t("suggestion.historyTitle")}
							</CardTitle>
							<CardDescription className="text-[var(--sea-ink-soft)]">
								{t("suggestion.historyDescription")}
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-3 px-6 pb-6">
							{suggestionHistory.length === 0 ? (
								<div className="empty-entry-surface rounded-2xl border border-dashed border-[var(--line)] p-4 text-sm text-[var(--sea-ink-soft)]">
									{t("suggestion.empty")}
								</div>
							) : (
								suggestionHistory.map((suggestion, index) => {
									const entryNumber = suggestionHistory.length - index;
									const suggesterName =
										playerNameById[suggestion.suggesterPlayerId] ?? "";
									const disproverName = suggestion.disproverPlayerId
										? (playerNameById[suggestion.disproverPlayerId] ?? "")
										: "";

									return (
										<div
											key={suggestion.id}
											className="setup-note history-entry-surface p-4"
										>
											<p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--kicker)]">
												{t("suggestion.entry", { index: entryNumber })}
											</p>
											<p className="mb-0 mt-2 text-sm leading-7 text-[var(--sea-ink-soft)]">
												{suggestion.disproverPlayerId
													? t("suggestion.disprovedSentence", {
															suggester: suggesterName,
															suspect: t(`cards.${suggestion.suspect}`),
															weapon: t(`cards.${suggestion.weapon}`),
															room: t(`cards.${suggestion.room}`),
															disprover: disproverName,
														})
													: t("suggestion.noDisproverSentence", {
															suggester: suggesterName,
															suspect: t(`cards.${suggestion.suspect}`),
															weapon: t(`cards.${suggestion.weapon}`),
															room: t(`cards.${suggestion.room}`),
														})}
											</p>
										</div>
									);
								})
							)}
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	);
}
