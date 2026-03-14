import { createFileRoute } from "@tanstack/react-router";

import LocaleRedirectPage from "#/components/LocaleRedirectPage";

export const Route = createFileRoute("/")({
	component: RootRedirectPage,
});

function RootRedirectPage() {
	return <LocaleRedirectPage targetPath="/new-game" />;
}
