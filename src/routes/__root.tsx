import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PwaRegistration from "../components/PwaRegistration";
import { Button } from "../components/ui/button";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import { defaultLocale, extractLocaleFromPathname } from "../lib/i18n/locales";
import {
	AppI18nProvider,
	useActiveLocale,
	useTranslation,
} from "../lib/i18n/provider";
import { GameStoreProvider } from "../stores/game-store";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "theme-color",
				content: "#173a40",
			},
			{
				name: "mobile-web-app-capable",
				content: "yes",
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes",
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default",
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Cluedo Solver",
			},
			{
				title: "Cluedo Solver",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
		],
	}),
	notFoundComponent: NotFoundPage,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const htmlLang = extractLocaleFromPathname(pathname) ?? defaultLocale;

	return (
		<html lang={htmlLang} suppressHydrationWarning>
			<head>
				<script>{THEME_INIT_SCRIPT}</script>
				<HeadContent />
			</head>
			<body
				suppressHydrationWarning
				className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]"
			>
				<PwaRegistration />
				<TanStackQueryProvider>
					<AppI18nProvider>
						<GameStoreProvider>
							<Header />
							{children}
							<Footer />
							<TanStackDevtools
								config={{
									position: "bottom-right",
								}}
								plugins={[
									{
										name: "Tanstack Router",
										render: <TanStackRouterDevtoolsPanel />,
									},
									TanStackQueryDevtools,
								]}
							/>
						</GameStoreProvider>
					</AppI18nProvider>
				</TanStackQueryProvider>
				<Scripts />
			</body>
		</html>
	);
}

function NotFoundPage() {
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
					<Button asChild variant="outline" className="bg-white/50">
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
