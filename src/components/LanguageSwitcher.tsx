import { useNavigate, useRouterState } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import {
	appLocales,
	buildLocalizedPath,
	persistPreferredLocale,
} from "#/lib/i18n/locales";
import { useActiveLocale, useTranslation } from "#/lib/i18n/provider";

export default function LanguageSwitcher() {
	const navigate = useNavigate();
	const locale = useActiveLocale();
	const location = useRouterState({
		select: (state) => state.location,
	});
	const { t } = useTranslation();

	return (
		<div
			role="group"
			className="flex items-center gap-1 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] p-1"
			aria-label={t("language.label")}
		>
			{appLocales.map((nextLocale) => {
				const label = t(`language.${nextLocale}`);

				return (
					<Button
						key={nextLocale}
						type="button"
						size="sm"
						variant={nextLocale === locale ? "default" : "ghost"}
						className="rounded-full px-3"
						aria-label={t("language.switch", { language: label })}
						onClick={() => {
							persistPreferredLocale(nextLocale);
							void navigate({
								href: `${buildLocalizedPath(
									location.pathname,
									nextLocale,
								)}${location.searchStr}${location.hash}`,
								replace: true,
							});
						}}
					>
						{label}
					</Button>
				);
			})}
		</div>
	);
}
