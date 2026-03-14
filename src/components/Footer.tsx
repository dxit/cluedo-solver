import { Button } from "#/components/ui/button";
import { useTranslation } from "#/lib/i18n/provider";

export default function Footer() {
	const year = new Date().getFullYear();
	const { t } = useTranslation();

	return (
		<footer className="site-footer mt-16 px-4 pb-12 pt-8 text-[var(--sea-ink-soft)]">
			<div className="page-wrap footer-panel flex flex-col items-center justify-between gap-4 rounded-[1.8rem] px-5 py-5 text-center sm:flex-row sm:px-6 sm:text-left">
				<div>
					<p className="m-0 text-sm">
						&copy; {year} {t("footer.name")}. {t("footer.rights")}
					</p>
					<p className="island-kicker mt-2">{t("footer.builtWith")}</p>
				</div>
				<Button asChild variant="outline" className="rounded-full bg-white/65">
					<a
						href="https://github.com/dxit/cluedo-solver"
						target="_blank"
						rel="noreferrer"
					>
						{t("footer.goToGithub")}
					</a>
				</Button>
			</div>
		</footer>
	);
}
