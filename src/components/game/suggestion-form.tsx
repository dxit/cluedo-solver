import { useForm, useStore } from "@tanstack/react-form";
import { useMemo } from "react";
import { z } from "zod";

import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { rooms, suspects, weapons } from "#/lib/cluedo/constants";
import { useTranslation } from "#/lib/i18n/provider";

import type { Player, SuggestionInput } from "#/lib/cluedo/types";

type SuggestionFormProps = {
	players: Player[];
	onSubmit: (suggestion: SuggestionInput) => void;
};

function createSuggestionFormSchema(messages: {
	suggesterRequired: string;
	disproverRequired: string;
	disproverCannotBeSuggester: string;
}) {
	return z
		.object({
			suggesterPlayerId: z.string().min(1, messages.suggesterRequired),
			suspect: z.enum(suspects),
			weapon: z.enum(weapons),
			room: z.enum(rooms),
			disproverPlayerId: z.string().min(1, messages.disproverRequired),
		})
		.superRefine((value, ctx) => {
			if (
				value.disproverPlayerId !== "none" &&
				value.disproverPlayerId === value.suggesterPlayerId
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: messages.disproverCannotBeSuggester,
					path: ["disproverPlayerId"],
				});
			}
		});
}

type SuggestionFormValues = {
	suggesterPlayerId: string;
	suspect: (typeof suspects)[number];
	weapon: (typeof weapons)[number];
	room: (typeof rooms)[number];
	disproverPlayerId: string;
};

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

function SelectField({
	label,
	value,
	placeholder,
	options,
	onChange,
	errors,
	showErrors,
}: {
	label: string;
	value: string;
	placeholder: string;
	options: Array<{ label: string; value: string }>;
	onChange: (value: string) => void;
	errors: ReadonlyArray<unknown>;
	showErrors: boolean;
}) {
	return (
		<div>
			<Label className="mb-2 block text-sm font-semibold text-[var(--sea-ink)]">
				{label}
			</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="field-surface w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="bg-background text-foreground">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldErrors errors={errors} show={showErrors} />
		</div>
	);
}

export default function SuggestionForm({
	players,
	onSubmit,
}: SuggestionFormProps) {
	const { t } = useTranslation();
	const firstPlayerId = players[0]?.id ?? "";
	const initialValues: SuggestionFormValues = {
		suggesterPlayerId: firstPlayerId,
		suspect: suspects[0],
		weapon: weapons[0],
		room: rooms[0],
		disproverPlayerId: "none",
	};
	const suggestionFormSchema = useMemo(
		() =>
			createSuggestionFormSchema({
				suggesterRequired: t("suggestion.validation.suggesterRequired"),
				disproverRequired: t("suggestion.validation.disproverRequired"),
				disproverCannotBeSuggester: t(
					"suggestion.validation.disproverCannotBeSuggester",
				),
			}),
		[t],
	);

	const form = useForm({
		defaultValues: initialValues,
		validators: {
			onSubmit: suggestionFormSchema,
		},
		onSubmit: ({ value }) => {
			onSubmit({
				suggesterPlayerId: value.suggesterPlayerId,
				suspect: value.suspect,
				weapon: value.weapon,
				room: value.room,
				disproverPlayerId:
					value.disproverPlayerId === "none" ? null : value.disproverPlayerId,
			});
			form.reset(initialValues);
		},
	});

	const submissionAttempts = useStore(
		form.store,
		(state) => state.submissionAttempts,
	);

	const playerOptions = players.map((player) => ({
		label: player.name,
		value: player.id,
	}));
	const selectedSuggesterPlayerId = useStore(
		form.store,
		(state) => state.values.suggesterPlayerId,
	);
	const disproverOptions = useMemo(() => {
		const suggesterIndex = players.findIndex(
			(player) => player.id === selectedSuggesterPlayerId,
		);

		if (suggesterIndex === -1) {
			return playerOptions;
		}

		return Array.from({ length: players.length - 1 }, (_, offset) => {
			const playerIndex = (suggesterIndex + offset + 1) % players.length;
			const player = players[playerIndex];

			return {
				label: player.name,
				value: player.id,
			};
		});
	}, [playerOptions, players, selectedSuggesterPlayerId]);

	return (
		<form
			className="grid gap-4"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				void form.handleSubmit();
			}}
		>
			<form.Field name="suggesterPlayerId">
				{(field) => (
					<SelectField
						label={t("suggestion.suggesterPlayer")}
						value={field.state.value}
						placeholder={t("suggestion.suggesterPlaceholder")}
						options={playerOptions}
						onChange={(value) => {
							field.handleChange(value);
							form.setFieldValue("disproverPlayerId", (currentValue) =>
								currentValue === value ? "none" : currentValue,
							);
						}}
						errors={field.state.meta.errors}
						showErrors={field.state.meta.isTouched || submissionAttempts > 0}
					/>
				)}
			</form.Field>

			<div className="grid gap-4 md:grid-cols-3">
				<form.Field name="suspect">
					{(field) => (
						<SelectField
							label={t("suggestion.suspect")}
							value={field.state.value}
							placeholder={t("suggestion.suspectPlaceholder")}
							options={suspects.map((suspect) => ({
								label: t(`cards.${suspect}`),
								value: suspect,
							}))}
							onChange={(value) =>
								field.handleChange(value as SuggestionFormValues["suspect"])
							}
							errors={field.state.meta.errors}
							showErrors={field.state.meta.isTouched || submissionAttempts > 0}
						/>
					)}
				</form.Field>

				<form.Field name="weapon">
					{(field) => (
						<SelectField
							label={t("suggestion.weapon")}
							value={field.state.value}
							placeholder={t("suggestion.weaponPlaceholder")}
							options={weapons.map((weapon) => ({
								label: t(`cards.${weapon}`),
								value: weapon,
							}))}
							onChange={(value) =>
								field.handleChange(value as SuggestionFormValues["weapon"])
							}
							errors={field.state.meta.errors}
							showErrors={field.state.meta.isTouched || submissionAttempts > 0}
						/>
					)}
				</form.Field>

				<form.Field name="room">
					{(field) => (
						<SelectField
							label={t("suggestion.room")}
							value={field.state.value}
							placeholder={t("suggestion.roomPlaceholder")}
							options={rooms.map((room) => ({
								label: t(`cards.${room}`),
								value: room,
							}))}
							onChange={(value) =>
								field.handleChange(value as SuggestionFormValues["room"])
							}
							errors={field.state.meta.errors}
							showErrors={field.state.meta.isTouched || submissionAttempts > 0}
						/>
					)}
				</form.Field>
			</div>

			<form.Field name="disproverPlayerId">
				{(field) => (
					<SelectField
						label={t("suggestion.disprover")}
						value={field.state.value}
						placeholder={t("suggestion.disproverPlaceholder")}
						options={[
							{ label: t("suggestion.nobody"), value: "none" },
							...disproverOptions,
						]}
						onChange={(value) => field.handleChange(value)}
						errors={field.state.meta.errors}
						showErrors={field.state.meta.isTouched || submissionAttempts > 0}
					/>
				)}
			</form.Field>

			<form.Subscribe
				selector={(state) => ({
					canSubmit: state.canSubmit,
					isSubmitting: state.isSubmitting,
				})}
			>
				{({ canSubmit, isSubmitting }) => (
					<Button type="submit" disabled={!canSubmit || isSubmitting}>
						{isSubmitting ? t("common.saving") : t("suggestion.add")}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
