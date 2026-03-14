import { createFileRoute } from "@tanstack/react-router";

import LocaleRedirectPage from "#/components/LocaleRedirectPage";

export const Route = createFileRoute("/game/$gameId")({
	component: GameRedirectPage,
});

function GameRedirectPage() {
	return <LocaleRedirectPage />;
}
