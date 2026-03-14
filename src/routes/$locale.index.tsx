import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/$locale/new-game",
			params: { locale: params.locale },
			replace: true,
		});
	},
	component: LocaleIndexRedirectPage,
});

function LocaleIndexRedirectPage() {
	return null;
}
