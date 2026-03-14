import { AlertTriangle, ArrowRightLeft, Sparkles } from "lucide-react";

import type { DeductionResult } from "#/lib/cluedo/deduction";
import type { Player } from "#/lib/cluedo/types";
import { useTranslation } from "#/lib/i18n/provider";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	formatDeductionConflict,
	formatDeductionLead,
	formatDeductionStep,
} from "./deduction-copy";

type DeductionPanelProps = {
	players: Player[];
	result: DeductionResult;
};

function StatTile({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof Sparkles;
	label: string;
	value: number;
}) {
	return (
		<div className="metric-tile">
			<div className="flex items-center gap-2 text-[var(--kicker)]">
				<Icon className="size-4" aria-hidden="true" />
				<p className="island-kicker m-0">{label}</p>
			</div>
			<p className="metric-value mt-3">{value}</p>
		</div>
	);
}

export default function DeductionPanel({
	players,
	result,
}: DeductionPanelProps) {
	const { t } = useTranslation();
	const highlightedSteps =
		result.steps.filter((step) => step.status === "owned").length > 0
			? result.steps
					.filter((step) => step.status === "owned")
					.slice(-5)
					.reverse()
			: result.steps.slice(-5).reverse();
	const visibleLeads = result.leads.slice(0, 4);
	const visibleConflicts = result.conflicts.slice(0, 4);

	return (
		<Card className="island-shell border-[var(--line)] bg-transparent py-0 shadow-none">
			<CardHeader className="px-6 pt-6">
				<CardTitle className="text-2xl text-[var(--sea-ink)]">
					{t("engine.title")}
				</CardTitle>
				<CardDescription className="text-[var(--sea-ink-soft)]">
					{t("engine.description")}
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-5 px-6 pb-6">
				<div className="grid gap-3 sm:grid-cols-3">
					<StatTile
						icon={Sparkles}
						label={t("engine.stats.deductions")}
						value={result.deducedCellCount}
					/>
					<StatTile
						icon={ArrowRightLeft}
						label={t("engine.stats.leads")}
						value={result.leads.length}
					/>
					<StatTile
						icon={AlertTriangle}
						label={t("engine.stats.conflicts")}
						value={result.conflicts.length}
					/>
				</div>

				<section className="grid gap-3">
					<div className="flex items-center gap-2">
						<AlertTriangle
							className="size-4 text-[var(--status-impossible-text)]"
							aria-hidden="true"
						/>
						<h3 className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
							{t("engine.sections.conflicts")}
						</h3>
					</div>
					{visibleConflicts.length > 0 ? (
						<div className="grid gap-3">
							{visibleConflicts.map((conflict) => (
								<div
									key={conflict.id}
									className="rounded-2xl border border-[var(--status-impossible-border)] bg-[var(--status-impossible-bg)] p-4 text-sm leading-7 text-[var(--status-impossible-text)]"
								>
									{formatDeductionConflict(conflict, players, t)}
								</div>
							))}
						</div>
					) : (
						<div className="setup-note text-sm text-[var(--sea-ink-soft)]">
							{t("engine.empty.noConflicts")}
						</div>
					)}
				</section>

				<section className="grid gap-3">
					<div className="flex items-center gap-2">
						<Sparkles
							className="size-4 text-[var(--kicker)]"
							aria-hidden="true"
						/>
						<h3 className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
							{t("engine.sections.recent")}
						</h3>
					</div>
					{highlightedSteps.length > 0 ? (
						<div className="grid gap-3">
							{highlightedSteps.map((step) => (
								<div
									key={step.id}
									className="setup-note text-sm leading-7 text-[var(--sea-ink-soft)]"
								>
									{formatDeductionStep(step, players, t)}
								</div>
							))}
						</div>
					) : (
						<div className="setup-note text-sm text-[var(--sea-ink-soft)]">
							{t("engine.empty.noDeductions")}
						</div>
					)}
				</section>

				<section className="grid gap-3">
					<div className="flex items-center gap-2">
						<ArrowRightLeft
							className="size-4 text-[var(--kicker)]"
							aria-hidden="true"
						/>
						<h3 className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
							{t("engine.sections.leads")}
						</h3>
					</div>
					{visibleLeads.length > 0 ? (
						<div className="grid gap-3">
							{visibleLeads.map((lead) => (
								<div
									key={lead.id}
									className="setup-note text-sm leading-7 text-[var(--sea-ink-soft)]"
								>
									{formatDeductionLead(lead, players, t)}
								</div>
							))}
						</div>
					) : (
						<div className="setup-note text-sm text-[var(--sea-ink-soft)]">
							{t("engine.empty.noLeads")}
						</div>
					)}
				</section>

				<p className="m-0 text-xs uppercase tracking-[0.18em] text-[var(--kicker)]">
					{t("engine.live")}
				</p>
			</CardContent>
		</Card>
	);
}
