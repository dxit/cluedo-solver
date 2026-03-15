import { Lightbulb } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import type { SuggestedCombination } from "#/lib/cluedo/next-suggestion";
import type { SuggestionInput } from "#/lib/cluedo/types";
import { useTranslation } from "#/lib/i18n/provider";

type NextSuggestionPanelProps = {
	recommendations: SuggestedCombination[];
	onApply: (suggestion: SuggestionInput) => void;
};

export default function NextSuggestionPanel({
	recommendations,
	onApply,
}: NextSuggestionPanelProps) {
	const { t } = useTranslation();

	return (
		<Card className="island-shell border-[var(--line)] bg-transparent py-0 shadow-none">
			<CardHeader className="px-6 pt-6">
				<CardTitle className="flex items-center gap-2 text-2xl text-[var(--sea-ink)]">
					<Lightbulb className="size-5 text-[var(--kicker)]" aria-hidden="true" />
					{t("suggestion.advisor.title")}
				</CardTitle>
				<CardDescription className="text-[var(--sea-ink-soft)]">
					{t("suggestion.advisor.description")}
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-3 px-6 pb-6">
				{recommendations.length > 0 ? (
					recommendations.map((recommendation) => (
						<div
							key={recommendation.id}
							className="setup-note grid gap-3 rounded-2xl border border-[var(--line)] p-4"
						>
							<div className="grid gap-1">
								<p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
									{t(`cards.${recommendation.suggestion.suspect}`)},{" "}
									{t(`cards.${recommendation.suggestion.weapon}`)},{" "}
									{t(`cards.${recommendation.suggestion.room}`)}
								</p>
								<p className="m-0 text-xs leading-6 text-[var(--sea-ink-soft)]">
									{t("suggestion.advisor.reason", {
										envelopeCount: recommendation.envelopeCandidateCount,
										playerCount: recommendation.playerPressureCount,
										ambiguityCount: recommendation.ownerAmbiguity,
									})}
								</p>
							</div>
							<div className="flex justify-end">
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="soft-button-surface"
									onClick={() => onApply(recommendation.suggestion)}
								>
									{t("suggestion.advisor.apply")}
								</Button>
							</div>
						</div>
					))
				) : (
					<div className="setup-note text-sm text-[var(--sea-ink-soft)]">
						{t("suggestion.advisor.empty")}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
