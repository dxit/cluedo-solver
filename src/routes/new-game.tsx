import { createFileRoute } from "@tanstack/react-router";

import LocaleRedirectPage from "#/components/LocaleRedirectPage";

export const Route = createFileRoute("/new-game")({
	component: NewGameRedirectPage,
});

function NewGameRedirectPage() {
	return <LocaleRedirectPage />;
}
