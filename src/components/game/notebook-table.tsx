import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { Button } from "#/components/ui/button";
import { getCardCategory } from "#/lib/cluedo/cards";
import { envelopeColumnId } from "#/lib/cluedo/constants";
import type {
	Card,
	CardCategory,
	NotebookSourcesState,
	NotebookState,
	NotebookStatus,
	NotebookStatusSource,
	Player,
} from "#/lib/cluedo/types";
import { useTranslation } from "#/lib/i18n/provider";
import { cn } from "#/lib/utils";

type NotebookTableProps = {
	cards: Card[];
	players: Player[];
	notebook: NotebookState;
	sources: NotebookSourcesState;
	onStatusChange: (
		card: Card,
		columnKey: string,
		status: NotebookStatus,
	) => void;
};

type NotebookRow = {
	card: Card;
};

const categoryOrder: CardCategory[] = ["suspect", "weapon", "room"];

const statusCycle: Record<NotebookStatus, NotebookStatus> = {
	unknown: "owned",
	owned: "impossible",
	impossible: "unknown",
};

const statusLabel: Record<NotebookStatus, string> = {
	unknown: "?",
	owned: "✓",
	impossible: "✗",
};

const statusTone: Record<NotebookStatus, string> = {
	unknown:
		"border-[rgba(23,58,64,0.12)] bg-white/70 text-[var(--sea-ink-soft)] hover:border-[rgba(50,143,151,0.26)] hover:bg-[rgba(79,184,178,0.12)]",
	owned:
		"border-[rgba(47,106,74,0.22)] bg-[rgba(47,106,74,0.14)] text-[var(--palm)] hover:bg-[rgba(47,106,74,0.2)]",
	impossible:
		"border-[rgba(160,65,52,0.18)] bg-[rgba(160,65,52,0.12)] text-[rgb(132,58,48)] hover:bg-[rgba(160,65,52,0.16)] dark:text-[rgb(255,193,182)]",
};

function getNextStatus(
	status: NotebookStatus,
	source: NotebookStatusSource,
): NotebookStatus {
	if (source === "deduced" && status !== "unknown") {
		return status === "impossible" ? "owned" : "impossible";
	}

	return statusCycle[status];
}

function NotebookStatusButton({
	card,
	columnKey,
	status,
	source,
	ariaLabel,
	autoDeductionLabel,
	onStatusChange,
}: {
	card: Card;
	columnKey: string;
	status: NotebookStatus;
	source: NotebookStatusSource;
	ariaLabel: string;
	autoDeductionLabel: string;
	onStatusChange: NotebookTableProps["onStatusChange"];
}) {
	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			className={cn(
				"relative h-9 min-w-12 rounded-full border px-3 font-semibold shadow-none",
				statusTone[status],
				source === "deduced" &&
					"border-dashed ring-1 ring-inset ring-[rgba(50,143,151,0.28)] after:absolute after:-right-1 after:-top-1 after:size-2.5 after:rounded-full after:bg-[var(--lagoon-deep)] after:content-['']",
			)}
			onClick={() => onStatusChange(card, columnKey, getNextStatus(status, source))}
			aria-label={ariaLabel}
			title={source === "deduced" ? autoDeductionLabel : undefined}
		>
			{statusLabel[status]}
		</Button>
	);
}

export default function NotebookTable({
	cards,
	players,
	notebook,
	sources,
	onStatusChange,
}: NotebookTableProps) {
	const { t } = useTranslation();
	const rows = useMemo<NotebookRow[]>(
		() =>
			cards.map((card) => ({
				card,
			})),
		[cards],
	);

	const columns = useMemo<ColumnDef<NotebookRow>[]>(
		() => [
			{
				accessorKey: "card",
				header: t("notebook.card"),
				cell: ({ row }) => (
					<div className="min-w-44">
						<p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
							{t(`cards.${row.original.card}`)}
						</p>
					</div>
				),
			},
			...players.map<ColumnDef<NotebookRow>>((player) => ({
				id: player.id,
				header: () => (
					<div className="text-center">
						<p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
							{player.name}
						</p>
						{player.isUser ? (
							<p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--kicker)]">
								{t("notebook.you")}
							</p>
						) : null}
					</div>
				),
				cell: ({ row }) => (
					<div className="flex justify-center">
						<NotebookStatusButton
							card={row.original.card}
							columnKey={player.id}
							status={notebook[row.original.card]?.[player.id] ?? "unknown"}
							source={sources[row.original.card]?.[player.id] ?? "manual"}
							ariaLabel={t("notebook.setStatus", {
								card: t(`cards.${row.original.card}`),
								column: player.name,
								status: t(
									`notebook.status.${getNextStatus(
										notebook[row.original.card]?.[player.id] ?? "unknown",
										sources[row.original.card]?.[player.id] ?? "manual",
									)}`,
								),
							})}
							autoDeductionLabel={t("notebook.autoDeduction")}
							onStatusChange={onStatusChange}
						/>
					</div>
				),
			})),
			{
				id: envelopeColumnId,
				header: () => (
					<div className="text-center">
						<p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
							{t("notebook.envelope")}
						</p>
						<p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--sea-ink-soft)]">
							{t("notebook.solution")}
						</p>
					</div>
				),
				cell: ({ row }) => (
					<div className="flex justify-center">
						<NotebookStatusButton
							card={row.original.card}
							columnKey={envelopeColumnId}
							status={
								notebook[row.original.card]?.[envelopeColumnId] ?? "unknown"
							}
							source={
								sources[row.original.card]?.[envelopeColumnId] ?? "manual"
							}
							ariaLabel={t("notebook.setStatus", {
								card: t(`cards.${row.original.card}`),
								column: t("notebook.envelope"),
								status: t(
									`notebook.status.${getNextStatus(
										notebook[row.original.card]?.[envelopeColumnId] ?? "unknown",
										sources[row.original.card]?.[envelopeColumnId] ?? "manual",
									)}`,
								),
							})}
							autoDeductionLabel={t("notebook.autoDeduction")}
							onStatusChange={onStatusChange}
						/>
					</div>
				),
			},
		],
		[players, notebook, onStatusChange, sources, t],
	);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	const rowsByCategory = useMemo<Record<CardCategory, Row<NotebookRow>[]>>(
		() => ({
			suspect: table
				.getRowModel()
				.rows.filter((row) => getCardCategory(row.original.card) === "suspect"),
			weapon: table
				.getRowModel()
				.rows.filter((row) => getCardCategory(row.original.card) === "weapon"),
			room: table
				.getRowModel()
				.rows.filter((row) => getCardCategory(row.original.card) === "room"),
		}),
		[table],
	);

	return (
		<div className="overflow-hidden rounded-[1.5rem] border border-[var(--line)]">
			<div className="overflow-x-auto">
				<table className="min-w-full border-separate border-spacing-0">
					<thead className="bg-[rgba(255,255,255,0.74)]">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="border-b border-[var(--line)] px-4 py-3 text-left align-middle first:sticky first:left-0 first:z-10 first:bg-[rgba(255,255,255,0.94)]"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</th>
								))}
							</tr>
						))}
					</thead>
					{categoryOrder.map((category) => (
						<tbody key={category}>
							<tr className="bg-[rgba(79,184,178,0.08)]">
								<td
									colSpan={columns.length}
									className="border-b border-[var(--line)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--kicker)]"
								>
									{t(`categories.${category}s`)}
								</td>
							</tr>
							{rowsByCategory[category].map((row) => (
								<tr
									key={row.id}
									className="bg-[rgba(255,255,255,0.44)] even:bg-[rgba(255,255,255,0.24)]"
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="border-b border-[var(--line)] px-4 py-3 align-middle first:sticky first:left-0 first:bg-[color-mix(in_oklab,var(--surface-strong)_84%,white_16%)]"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					))}
				</table>
			</div>
		</div>
	);
}
