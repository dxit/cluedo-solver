import { createFileRoute } from "@tanstack/react-router";
import LocaleRedirectPage from "#/components/LocaleRedirectPage";

export const Route = createFileRoute("/about")({
	component: AboutRedirectPage,
});

function AboutRedirectPage() {
	return <LocaleRedirectPage targetPath="/new-game" />;
}
