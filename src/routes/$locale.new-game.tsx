import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import {
	maxPlayers,
	minPlayers,
	rooms,
	suspects,
	weapons,
} from "#/lib/cluedo/constants";
import {
	createGameSetupSchema,
	type GameSetupValidationMessages,
} from "#/lib/cluedo/validation";
import { useTranslation } from "#/lib/i18n/provider";
import { useGameStore } from "#/stores/game-store";

export const Route = createFileRoute("/$locale/new-game")({
	component: NewGamePage,
});

function getErrorText(error: unknown) {
	if (typeof error === "string") {
		return error;
	}

	if (
		error &&
		typeof error === "object" &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message;
	}

	return "Invalid value.";
}

function FieldErrors({
	errors,
	show,
}: {
	errors: ReadonlyArray<unknown>;
	show: boolean;
}) {
	if (!show || errors.length === 0) {
		return null;
	}

	return (
		<p className="mt-2 text-sm text-[var(--error-text)]">
			{getErrorText(errors[0])}
		</p>
	);
}

function createPlayerNames(
	count: number,
	getDefaultPlayerName: (index: number) => string,
) {
	return Array.from({ length: count }, (_, index) =>
		getDefaultPlayerName(index),
	);
}

function resizePlayerNames(
	currentNames: string[],
	count: number,
	getDefaultPlayerName: (index: number) => string,
) {
	return Array.from(
		{ length: count },
		(_, index) => currentNames[index] ?? getDefaultPlayerName(index),
	);
}

function NewGamePage() {
	const { locale } = Route.useParams();

	return <LocalizedNewGamePage key={locale} locale={locale} />;
}

function LocalizedNewGamePage({ locale }: { locale: string }) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { createGame } = useGameStore();
	const defaultPlayerCount = 4;
	const getDefaultPlayerName = (index: number) =>
		t("setup.playerDefaultName", { index: index + 1 });
	const validationMessages = useMemo<GameSetupValidationMessages>(
		() => ({
			minPlayers: t("validation.minPlayers", { count: minPlayers }),
			maxPlayers: t("validation.maxPlayers", { count: maxPlayers }),
			playerNameRequired: t("validation.playerNameRequired"),
			playerNameLength: t("validation.playerNameLength"),
			playerNamesUnique: t("validation.playerNamesUnique"),
			playerNamesComplete: t("validation.playerNamesComplete"),
			userPlayerRequired: t("validation.userPlayerRequired"),
		}),
		[t],
	);
	const gameSetupSchema = useMemo(
		() => createGameSetupSchema(validationMessages),
		[validationMessages],
	);

	const form = useForm({
		defaultValues: {
			playerCount: defaultPlayerCount,
			playerNames: createPlayerNames(defaultPlayerCount, getDefaultPlayerName),
			userPlayerIndex: 0,
		},
		validators: {
			onChange: gameSetupSchema,
			onSubmit: gameSetupSchema,
		},
		onSubmit: async ({ value }) => {
			const game = createGame(value);
			await navigate({
				to: "/$locale/game/$gameId",
				params: { locale, gameId: game.id },
			});
		},
	});

	const playerNames = useStore(form.store, (state) => state.values.playerNames);
	const submissionAttempts = useStore(
		form.store,
		(state) => state.submissionAttempts,
	);
	const notebookGroups = [
		{ count: suspects.length, label: t("categories.suspects") },
		{ count: weapons.length, label: t("categories.weapons") },
		{ count: rooms.length, label: t("categories.rooms") },
	];

	return (
		<main className="page-wrap px-4 pb-12 pt-8">
			<section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)]">
				<Card className="setup-hero island-shell border-[var(--line)] bg-transparent py-0 shadow-none">
					<CardHeader className="gap-4 px-7 pt-7 sm:px-8 sm:pt-8">
						<div className="flex flex-wrap gap-2">
							<span className="case-chip">{t("setup.kicker")}</span>
							<span className="case-chip" data-tone="subtle">
								{t(`language.${locale}`)}
							</span>
						</div>
						<CardTitle className="display-title max-w-3xl text-5xl leading-[0.95] text-[var(--sea-ink)] sm:text-6xl">
							{t("setup.title")}
						</CardTitle>
						<CardDescription className="max-w-2xl text-base leading-7 text-[var(--sea-ink-soft)] sm:text-lg">
							{t("setup.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-5 px-7 pb-7 text-sm text-[var(--sea-ink-soft)] sm:px-8 sm:pb-8">
						<div className="grid gap-3 sm:grid-cols-3">
							{notebookGroups.map((group) => (
								<article key={group.label} className="metric-tile">
									<p className="island-kicker m-0">{group.label}</p>
									<p className="metric-value mt-3">{group.count}</p>
								</article>
							))}
						</div>
						<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)]">
							<div className="grid gap-4">
								<div className="setup-note">
									<p className="m-0 font-semibold text-[var(--sea-ink)]">
										{t("setup.whatThisGeneratesTitle")}
									</p>
									<p className="mb-0 mt-2">
										{t("setup.whatThisGeneratesBody")}
									</p>
								</div>
								<div className="setup-note">
									<p className="m-0 font-semibold text-[var(--sea-ink)]">
										{t("setup.currentRulesTitle")}
									</p>
									<p className="mb-0 mt-2">{t("setup.currentRulesBody")}</p>
								</div>
							</div>
							<aside className="setup-note flex flex-col justify-between gap-5">
								<div>
									<p className="island-kicker m-0">{t("setup.formTitle")}</p>
									<p className="mb-0 mt-3 leading-7 text-[var(--sea-ink-soft)]">
										{t("setup.formDescription")}
									</p>
								</div>
								<div className="space-y-4">
									<div className="h-px bg-[var(--line)]" />
									<p className="m-0 text-sm leading-7 text-[var(--sea-ink-soft)]">
										{t("setup.playerCountHelp", {
											min: minPlayers,
											max: maxPlayers,
										})}
									</p>
									<Button
										asChild
										variant="outline"
										className="soft-button-surface w-full rounded-full"
									>
										<a
											href="https://github.com/dxit/cluedo-solver"
											target="_blank"
											rel="noreferrer"
										>
											{t("footer.goToGithub")}
										</a>
									</Button>
								</div>
							</aside>
						</div>
					</CardContent>
				</Card>

				<Card className="form-panel island-shell border-[var(--line)] bg-transparent py-0 shadow-none">
					<CardHeader className="gap-3 px-6 pt-7 sm:px-7">
						<span className="case-chip w-fit" data-tone="subtle">
							{t("common.createGame")}
						</span>
						<CardTitle className="text-2xl text-[var(--sea-ink)]">
							{t("setup.formTitle")}
						</CardTitle>
						<CardDescription className="text-[var(--sea-ink-soft)]">
							{t("setup.formDescription")}
						</CardDescription>
					</CardHeader>
					<CardContent className="px-6 pb-7 sm:px-7">
						<form
							className="grid gap-5"
							onSubmit={(event) => {
								event.preventDefault();
								event.stopPropagation();
								void form.handleSubmit();
							}}
						>
							<form.Field name="playerCount">
								{(field) => (
									<div className="setup-note">
										<Label
											htmlFor="player-count"
											className="mb-2 block text-sm font-semibold text-[var(--sea-ink)]"
										>
											{t("setup.playerCount")}
										</Label>
										<Input
											id="player-count"
											type="number"
											min={minPlayers}
											max={maxPlayers}
											value={field.state.value}
											className="field-surface"
											onBlur={field.handleBlur}
											onChange={(event) => {
												const rawValue = Number.parseInt(
													event.target.value,
													10,
												);
												const nextCount = Number.isNaN(rawValue)
													? minPlayers
													: Math.min(
															maxPlayers,
															Math.max(minPlayers, rawValue),
														);

												field.handleChange(nextCount);
												form.setFieldValue("playerNames", (currentNames) =>
													resizePlayerNames(
														currentNames,
														nextCount,
														getDefaultPlayerName,
													),
												);
												form.setFieldValue("userPlayerIndex", (currentIndex) =>
													Math.min(currentIndex, nextCount - 1),
												);
											}}
										/>
										<p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
											{t("setup.playerCountHelp", {
												min: minPlayers,
												max: maxPlayers,
											})}
										</p>
										<FieldErrors
											errors={field.state.meta.errors}
											show={
												field.state.meta.isTouched || submissionAttempts > 0
											}
										/>
									</div>
								)}
							</form.Field>

							<div className="grid gap-4 sm:grid-cols-2">
								{playerNames.map((_, index) => {
									const fieldName = `playerNames[${index}]` as const;

									return (
										<form.Field key={fieldName} name={fieldName}>
											{(field) => (
												<div className="setup-note soft-note-panel p-4">
													<Label
														htmlFor={fieldName}
														className="mb-2 block text-sm font-semibold text-[var(--sea-ink)]"
													>
														{t("setup.playerName", { index: index + 1 })}
													</Label>
													<Input
														id={fieldName}
														value={field.state.value}
														className="field-surface"
														onBlur={field.handleBlur}
														onChange={(event) =>
															field.handleChange(event.target.value)
														}
													/>
													<FieldErrors
														errors={field.state.meta.errors}
														show={
															field.state.meta.isTouched ||
															submissionAttempts > 0
														}
													/>
												</div>
											)}
										</form.Field>
									);
								})}
							</div>

							<form.Field name="userPlayerIndex">
								{(field) => (
									<div className="setup-note">
										<Label className="mb-2 block text-sm font-semibold text-[var(--sea-ink)]">
											{t("setup.selectYourPlayer")}
										</Label>
										<Select
											value={String(field.state.value)}
											onValueChange={(value) =>
												field.handleChange(Number(value))
											}
										>
											<SelectTrigger className="field-surface w-full">
												<SelectValue
													placeholder={t("setup.selectYourPlayerPlaceholder")}
												/>
											</SelectTrigger>
											<SelectContent className="bg-background text-foreground">
												{playerNames.map((name, index) => {
													const seatKey = `seat-${index + 1}`;

													return (
														<SelectItem key={seatKey} value={String(index)}>
															{name.trim() || getDefaultPlayerName(index)}
														</SelectItem>
													);
												})}
											</SelectContent>
										</Select>
										<FieldErrors
											errors={field.state.meta.errors}
											show={
												field.state.meta.isTouched || submissionAttempts > 0
											}
										/>
									</div>
								)}
							</form.Field>

							<form.Subscribe
								selector={(state) => ({
									canSubmit: state.canSubmit,
									isSubmitting: state.isSubmitting,
								})}
							>
								{({ canSubmit, isSubmitting }) => (
									<Button
										type="submit"
										disabled={!canSubmit || isSubmitting}
										className="h-11 rounded-full text-sm font-semibold shadow-[0_18px_36px_rgba(23,58,64,0.18)]"
									>
										{isSubmitting
											? t("common.buildingGame")
											: t("common.createGame")}
									</Button>
								)}
							</form.Subscribe>
						</form>
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
