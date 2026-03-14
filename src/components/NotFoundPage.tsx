import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { useActiveLocale, useTranslation } from "#/lib/i18n/provider";

export default function NotFoundPage() {
	const locale = useActiveLocale();
	const { t } = useTranslation();

	return (
		<main className="page-wrap px-4 py-10">
			<section className="island-shell rounded-[2rem] px-6 py-10 sm:px-8">
				<p className="island-kicker mb-2">{t("notFound.kicker")}</p>
				<h1 className="display-title m-0 text-4xl text-[var(--sea-ink)] sm:text-5xl">
					{t("notFound.title")}
				</h1>
				<p className="mt-4 max-w-2xl text-[var(--sea-ink-soft)]">
					{t("notFound.description")}
				</p>
				<div className="mt-6 flex flex-wrap gap-3">
					<Button asChild>
						<Link to="/$locale/new-game" params={{ locale }}>
							{t("common.goHome")}
						</Link>
					</Button>
					<Button asChild variant="outline" className="soft-button-surface">
						<a
							href="https://github.com/dxit/cluedo-solver"
							target="_blank"
							rel="noreferrer"
						>
							{t("footer.goToGithub")}
						</a>
					</Button>
				</div>
			</section>
		</main>
	);
}
