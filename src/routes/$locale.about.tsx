import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/about")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/$locale/new-game",
			params: { locale: params.locale },
			replace: true,
		});
	},
	component: LocaleAboutRedirectPage,
});

function LocaleAboutRedirectPage() {
	return null;
}
