export const resources = {
	en: {
		translation: {
			appName: "Cluedo Solver",
			language: {
				label: "Language",
				en: "English",
				it: "Italiano",
				de: "Deutsch",
				switch: "Switch language to {{language}}",
			},
			nav: {
				home: "Home",
				newGame: "New Game",
				about: "About",
			},
			theme: {
				auto: "Auto",
				dark: "Dark",
				light: "Light",
				autoLabel: "Theme mode: auto (system). Click to switch to light mode.",
				modeLabel: "Theme mode: {{mode}}. Click to switch mode.",
			},
			common: {
				goHome: "Go to setup",
				startGame: "Start new game",
				createGame: "Create game",
				buildingGame: "Building game...",
				backToOverview: "Back to overview",
				startAnotherGame: "Start another game",
				createNewGame: "Create a new game",
				loadingNotebook: "Loading your saved notebook...",
				saving: "Saving...",
			},
			rootRedirect: {
				kicker: "Redirect",
				title: "Opening Cluedo Solver.",
				description: "Redirecting you to the localized app.",
			},
			home: {
				kicker: "Deduction Notebook",
				title: "Keep every clue in one place and solve faster.",
				description:
					"Cluedo Solver is a lightweight companion app for tracking players, suggestions, and the notebook state of each card while you play.",
				projectDetails: "Project details",
				stackKicker: "Build Stack",
				stackItems: [
					"TanStack Start powers routing and the overall app shell.",
					"TanStack Form handles setup and suggestion forms.",
					"TanStack Table renders the notebook with dynamic player columns.",
				],
				features: [
					{
						title: "Clean Setup Flow",
						description:
							"Create a game with validated player count, names, and your seat.",
					},
					{
						title: "Notebook Matrix",
						description:
							"Track each card against every player plus the envelope.",
					},
					{
						title: "Suggestion Log",
						description:
							"Record who suggested what and who disproved it turn by turn.",
					},
					{
						title: "Deduction Ready",
						description:
							"The data model is set up for automatic rule-based deduction next.",
					},
				],
			},
			about: {
				kicker: "About",
				title: "A small deduction app with a clear path forward.",
				description:
					"This project focuses on a clean core domain: card types, validated game setup, notebook state, and suggestion history. The next step is deduction logic that can infer ownership and envelope cards from the observations already stored in the app.",
			},
			setup: {
				kicker: "Setup",
				title: "Start a new Cluedo notebook.",
				description:
					"Set the table once, then track suggestions, cross off impossible cards, and keep the envelope in sight.",
				whatThisGeneratesTitle: "What this generates",
				whatThisGeneratesBody:
					"A game record with players, the full deck, an empty suggestion log, and a notebook matrix for each card.",
				currentRulesTitle: "Current rules",
				currentRulesBody:
					"This first version captures setup and observations. Automated deduction can layer on top of the same store next.",
				formTitle: "Game setup",
				formDescription:
					"Choose player count, name everyone at the table, then select your seat.",
				playerCount: "Number of players",
				playerCountHelp: "Supported range: {{min}} to {{max}} players.",
				playerName: "Player {{index}}",
				playerDefaultName: "Player {{index}}",
				selectYourPlayer: "Select your player",
				selectYourPlayerPlaceholder: "Choose your player",
			},
			game: {
				kicker: "Notebook",
				title: "Track the table, then solve the case.",
				description:
					"Manual notes are live now. Deduction rules can build directly on the saved suggestions and notebook statuses next.",
				notFoundTitle: "Game not found",
				notFoundDescription:
					"This notebook is missing from local storage or has not been created yet.",
				youArePlayingAs: "You are playing as",
				playersAtTable: "Players at the table",
				suggestionsLogged: "Suggestions logged",
			},
			notebook: {
				title: "Notebook table",
				description:
					"Click each cell to cycle through unknown, owned, and impossible.",
				autoHint: "Automatic deduction filled {{count}} notebook cells.",
				autoDeduction: "Automatic deduction",
				card: "Card",
				envelope: "Envelope",
				solution: "Solution",
				you: "You",
				groupLabel: "{{category}}",
				setStatus: "Set {{card}} for {{column}} to {{status}}",
				status: {
					unknown: "unknown",
					owned: "owned",
					impossible: "impossible",
				},
			},
			suggestion: {
				title: "Log a suggestion",
				description:
					"Record each turn as it happens so deductions can replay the table state later.",
				historyTitle: "Suggestion history",
				historyDescription: "Most recent entries appear first.",
				empty: "No suggestions yet. Add the first one from the form above.",
				entry: "Entry {{index}}",
				add: "Add suggestion",
				suggesterPlayer: "Suggester player",
				suggesterPlaceholder: "Pick a player",
				suspect: "Suspect",
				suspectPlaceholder: "Pick a suspect",
				weapon: "Weapon",
				weaponPlaceholder: "Pick a weapon",
				room: "Room",
				roomPlaceholder: "Pick a room",
				disprover: "Who disproved",
				disproverPlaceholder: "Pick a player or nobody",
				nobody: "Nobody",
				disprovedSentence:
					"{{suggester}} suggested {{suspect}}, {{weapon}}, and {{room}}. {{disprover}} disproved it.",
				noDisproverSentence:
					"{{suggester}} suggested {{suspect}}, {{weapon}}, and {{room}}. No one disproved it.",
				validation: {
					suggesterRequired: "Choose who made the suggestion.",
					disproverRequired:
						"Choose who disproved the suggestion or select nobody.",
					disproverCannotBeSuggester:
						"The suggester cannot disprove their own suggestion.",
				},
			},
			validation: {
				minPlayers: "Cluedo needs at least {{count}} players.",
				maxPlayers: "Classic Cluedo supports up to {{count}} players.",
				playerNameRequired: "Enter a player name.",
				playerNameLength: "Keep player names under 25 characters.",
				playerNamesUnique: "Player names must be unique.",
				playerNamesComplete: "Provide a name for every player in this game.",
				userPlayerRequired: "Choose which player is you.",
			},
			categories: {
				suspect: "suspect",
				weapon: "weapon",
				room: "room",
				suspects: "Suspects",
				weapons: "Weapons",
				rooms: "Rooms",
			},
			cards: {
				green: "Reverend Green",
				mustard: "Colonel Mustard",
				peacock: "Mrs. Peacock",
				plum: "Professor Plum",
				scarlet: "Miss Scarlett",
				white: "Mrs. White",
				candlestick: "Candlestick",
				dagger: "Dagger",
				leadPipe: "Lead Piping",
				revolver: "Revolver",
				rope: "Rope",
				wrench: "Spanner",
				kitchen: "Kitchen",
				ballroom: "Ballroom",
				conservatory: "Conservatory",
				diningRoom: "Dining Room",
				billiardRoom: "Billiard Room",
				library: "Library",
				lounge: "Lounge",
				hall: "Hall",
				study: "Study",
			},
			notFound: {
				kicker: "404",
				title: "This clue doesn't lead anywhere.",
				description: "The route you requested does not exist in this notebook.",
			},
			footer: {
				rights: "All rights reserved.",
				builtWith: "Open-source Cluedo notebook built with TanStack Start",
				name: "Daniele De Matteo",
				followTanStack: "Follow TanStack on X",
				goToGithub: "Open cluedo-solver on GitHub",
			},
		},
	},
	it: {
		translation: {
			appName: "Cluedo Solver",
			language: {
				label: "Lingua",
				en: "English",
				it: "Italiano",
				de: "Deutsch",
				switch: "Passa la lingua a {{language}}",
			},
			nav: {
				home: "Home",
				newGame: "Nuova partita",
				about: "Info",
			},
			theme: {
				auto: "Auto",
				dark: "Scuro",
				light: "Chiaro",
				autoLabel:
					"Tema automatico (sistema). Clicca per passare al tema chiaro.",
				modeLabel: "Tema: {{mode}}. Clicca per cambiare modalita.",
			},
			common: {
				goHome: "Vai al setup",
				startGame: "Avvia una nuova partita",
				createGame: "Crea partita",
				buildingGame: "Creazione partita...",
				backToOverview: "Torna alla panoramica",
				startAnotherGame: "Avvia un'altra partita",
				createNewGame: "Crea una nuova partita",
				loadingNotebook: "Caricamento del taccuino salvato...",
				saving: "Salvataggio...",
			},
			rootRedirect: {
				kicker: "Redirect",
				title: "Apertura di Cluedo Solver.",
				description: "Reindirizzamento alla versione localizzata.",
			},
			home: {
				kicker: "Taccuino deduttivo",
				title:
					"Raccogli ogni indizio in un solo posto e risolvi piu in fretta.",
				description:
					"Cluedo Solver e un'app di supporto leggera per tracciare giocatori, suggerimenti e stato del taccuino di ogni carta mentre giochi.",
				projectDetails: "Dettagli del progetto",
				stackKicker: "Stack tecnico",
				stackItems: [
					"TanStack Start gestisce routing e shell applicativa.",
					"TanStack Form gestisce setup e modulo dei suggerimenti.",
					"TanStack Table renderizza il taccuino con colonne dinamiche per i giocatori.",
				],
				features: [
					{
						title: "Setup pulito",
						description:
							"Crea una partita con numero giocatori, nomi e posto al tavolo validati.",
					},
					{
						title: "Matrice del taccuino",
						description:
							"Traccia ogni carta rispetto a ogni giocatore e alla busta.",
					},
					{
						title: "Registro suggerimenti",
						description:
							"Registra turno per turno chi ha suggerito cosa e chi ha smentito.",
					},
					{
						title: "Pronto per la deduzione",
						description:
							"Il modello dati e gia pronto per le regole di deduzione automatica.",
					},
				],
			},
			about: {
				kicker: "Info",
				title: "Una piccola app deduttiva con una direzione chiara.",
				description:
					"Questo progetto punta su un dominio pulito: tipi di carte, setup validato, stato del taccuino e cronologia dei suggerimenti. Il passo successivo e la logica deduttiva che infersce proprieta e carte nella busta a partire dalle osservazioni gia salvate.",
			},
			setup: {
				kicker: "Setup",
				title: "Avvia un nuovo taccuino di Cluedo.",
				description:
					"Imposta il tavolo una sola volta, poi annota i suggerimenti, escludi le carte impossibili e tieni d'occhio la busta.",
				whatThisGeneratesTitle: "Cosa viene creato",
				whatThisGeneratesBody:
					"Una partita con giocatori, mazzo completo, registro suggerimenti vuoto e matrice del taccuino per ogni carta.",
				currentRulesTitle: "Regole attuali",
				currentRulesBody:
					"Questa prima versione raccoglie setup e osservazioni. La deduzione automatica puo essere aggiunta in seguito sullo stesso store.",
				formTitle: "Configurazione partita",
				formDescription:
					"Scegli il numero di giocatori, assegna un nome a tutti e seleziona il tuo posto.",
				playerCount: "Numero di giocatori",
				playerCountHelp:
					"Intervallo supportato: da {{min}} a {{max}} giocatori.",
				playerName: "Giocatore {{index}}",
				playerDefaultName: "Giocatore {{index}}",
				selectYourPlayer: "Seleziona il tuo giocatore",
				selectYourPlayerPlaceholder: "Scegli il tuo giocatore",
			},
			game: {
				kicker: "Taccuino",
				title: "Segui il tavolo e risolvi il caso.",
				description:
					"Gli appunti manuali sono gia attivi. Le regole di deduzione potranno usare direttamente suggerimenti salvati e stati del taccuino.",
				notFoundTitle: "Partita non trovata",
				notFoundDescription:
					"Questo taccuino non esiste nel local storage oppure non e stato ancora creato.",
				youArePlayingAs: "Stai giocando come",
				playersAtTable: "Giocatori al tavolo",
				suggestionsLogged: "Suggerimenti registrati",
			},
			notebook: {
				title: "Tabella del taccuino",
				description:
					"Clicca ogni cella per alternare sconosciuto, posseduta e impossibile.",
				autoHint:
					"La deduzione automatica ha compilato {{count}} celle del taccuino.",
				autoDeduction: "Deduzione automatica",
				card: "Carta",
				envelope: "Busta",
				solution: "Soluzione",
				you: "Tu",
				groupLabel: "{{category}}",
				setStatus: "Imposta {{card}} per {{column}} su {{status}}",
				status: {
					unknown: "sconosciuta",
					owned: "posseduta",
					impossible: "impossibile",
				},
			},
			suggestion: {
				title: "Registra un suggerimento",
				description:
					"Salva ogni turno nel momento in cui accade, cosi la deduzione potra ricostruire lo stato del tavolo in seguito.",
				historyTitle: "Cronologia suggerimenti",
				historyDescription: "Gli inserimenti piu recenti compaiono per primi.",
				empty:
					"Nessun suggerimento ancora. Aggiungi il primo dal modulo qui sopra.",
				entry: "Voce {{index}}",
				add: "Aggiungi suggerimento",
				suggesterPlayer: "Giocatore che suggerisce",
				suggesterPlaceholder: "Seleziona un giocatore",
				suspect: "Sospettato",
				suspectPlaceholder: "Seleziona un sospettato",
				weapon: "Arma",
				weaponPlaceholder: "Seleziona un'arma",
				room: "Stanza",
				roomPlaceholder: "Seleziona una stanza",
				disprover: "Chi ha smentito",
				disproverPlaceholder: "Seleziona un giocatore o nessuno",
				nobody: "Nessuno",
				disprovedSentence:
					"{{suggester}} ha suggerito {{suspect}}, {{weapon}} e {{room}}. {{disprover}} ha smentito.",
				noDisproverSentence:
					"{{suggester}} ha suggerito {{suspect}}, {{weapon}} e {{room}}. Nessuno ha smentito.",
				validation: {
					suggesterRequired: "Seleziona chi ha fatto il suggerimento.",
					disproverRequired:
						"Seleziona chi ha smentito il suggerimento oppure scegli nessuno.",
					disproverCannotBeSuggester:
						"Chi suggerisce non puo anche smentire il proprio suggerimento.",
				},
			},
			validation: {
				minPlayers: "Cluedo richiede almeno {{count}} giocatori.",
				maxPlayers: "Il Cluedo classico supporta fino a {{count}} giocatori.",
				playerNameRequired: "Inserisci un nome giocatore.",
				playerNameLength: "Mantieni i nomi dei giocatori sotto i 25 caratteri.",
				playerNamesUnique: "I nomi dei giocatori devono essere unici.",
				playerNamesComplete:
					"Inserisci un nome per ogni giocatore di questa partita.",
				userPlayerRequired: "Scegli quale giocatore sei tu.",
			},
			categories: {
				suspect: "sospettato",
				weapon: "arma",
				room: "stanza",
				suspects: "Sospettati",
				weapons: "Armi",
				rooms: "Stanze",
			},
			cards: {
				green: "Dottor Verde",
				mustard: "Colonnello Mustard",
				peacock: "Signora Pavone",
				plum: "Professor Plum",
				scarlet: "Miss Scarlett",
				white: "Signora Bianchi",
				candlestick: "Candeliere",
				dagger: "Pugnale",
				leadPipe: "Spranga",
				revolver: "Rivoltella",
				rope: "Corda",
				wrench: "Chiave inglese",
				kitchen: "Cucina",
				ballroom: "Sala da ballo",
				conservatory: "Veranda",
				diningRoom: "Sala da pranzo",
				billiardRoom: "Sala del biliardo",
				library: "Biblioteca",
				lounge: "Salotto",
				hall: "Anticamera",
				study: "Studio",
			},
			notFound: {
				kicker: "404",
				title: "Questo indizio non porta da nessuna parte.",
				description: "La rotta richiesta non esiste in questo taccuino.",
			},
			footer: {
				rights: "Tutti i diritti riservati.",
				builtWith: "Taccuino Cluedo open source costruito con TanStack Start",
				name: "Daniele De Matteo",
				followTanStack: "Segui TanStack su X",
				goToGithub: "Apri cluedo-solver su GitHub",
			},
		},
	},
	de: {
		translation: {
			appName: "Cluedo Solver",
			language: {
				label: "Sprache",
				en: "English",
				it: "Italiano",
				de: "Deutsch",
				switch: "Sprache auf {{language}} wechseln",
			},
			nav: {
				home: "Start",
				newGame: "Neues Spiel",
				about: "Info",
			},
			theme: {
				auto: "Auto",
				dark: "Dunkel",
				light: "Hell",
				autoLabel:
					"Themenmodus: automatisch (System). Klicken, um zu hell zu wechseln.",
				modeLabel: "Themenmodus: {{mode}}. Klicken, um den Modus zu wechseln.",
			},
			common: {
				goHome: "Zum Setup",
				startGame: "Neues Spiel starten",
				createGame: "Spiel erstellen",
				buildingGame: "Spiel wird erstellt...",
				backToOverview: "Zur Ubersicht",
				startAnotherGame: "Weiteres Spiel starten",
				createNewGame: "Neues Spiel erstellen",
				loadingNotebook: "Gespeichertes Notizbuch wird geladen...",
				saving: "Wird gespeichert...",
			},
			rootRedirect: {
				kicker: "Weiterleitung",
				title: "Cluedo Solver wird geoffnet.",
				description: "Du wirst zur lokalisierten App weitergeleitet.",
			},
			home: {
				kicker: "Deduktions-Notizbuch",
				title: "Halte jeden Hinweis an einem Ort fest und lose schneller.",
				description:
					"Cluedo Solver ist eine leichte Begleit-App, um Spieler, Verdachte und den Notizbuchstatus jeder Karte wahrend des Spiels festzuhalten.",
				projectDetails: "Projektdetails",
				stackKicker: "Technischer Stack",
				stackItems: [
					"TanStack Start steuert Routing und die App-Shell.",
					"TanStack Form verwaltet Spielsetup und Vorschlagsformulare.",
					"TanStack Table rendert das Notizbuch mit dynamischen Spielerspalten.",
				],
				features: [
					{
						title: "Sauberer Setup-Flow",
						description:
							"Erstelle ein Spiel mit validierter Spielerzahl, Namen und deinem Sitzplatz.",
					},
					{
						title: "Notizbuch-Matrix",
						description:
							"Verfolge jede Karte gegenuber jedem Spieler und dem Umschlag.",
					},
					{
						title: "Vorschlagsprotokoll",
						description:
							"Halte Zug fur Zug fest, wer was vorgeschlagen und widerlegt hat.",
					},
					{
						title: "Bereit fur Deduktion",
						description:
							"Das Datenmodell ist bereits fur automatische Deduktionsregeln vorbereitet.",
					},
				],
			},
			about: {
				kicker: "Info",
				title: "Eine kleine Deduktions-App mit klarer Ausbaurichtung.",
				description:
					"Dieses Projekt konzentriert sich auf einen sauberen Kernbereich: Kartentypen, validiertes Spielsetup, Notizbuchstatus und Vorschlagshistorie. Der nachste Schritt ist eine Deduktionslogik, die Besitzverhaltnisse und Umschlagkarten aus den bereits gespeicherten Beobachtungen ableitet.",
			},
			setup: {
				kicker: "Setup",
				title: "Starte ein neues Cluedo-Notizbuch.",
				description:
					"Richte den Tisch einmal ein, protokolliere dann Vorschlage, markiere unmogliche Karten und behalte den Umschlag im Blick.",
				whatThisGeneratesTitle: "Was erzeugt wird",
				whatThisGeneratesBody:
					"Ein Spiel mit Spielern, vollem Deck, leerem Vorschlagsprotokoll und einer Notizbuchmatrix fur jede Karte.",
				currentRulesTitle: "Aktueller Stand",
				currentRulesBody:
					"Diese erste Version erfasst Setup und Beobachtungen. Automatische Deduktion kann danach auf demselben Store aufbauen.",
				formTitle: "Spielsetup",
				formDescription:
					"Wahle die Spielerzahl, gib allen am Tisch einen Namen und markiere deinen Platz.",
				playerCount: "Anzahl der Spieler",
				playerCountHelp: "Unterstutzter Bereich: {{min}} bis {{max}} Spieler.",
				playerName: "Spieler {{index}}",
				playerDefaultName: "Spieler {{index}}",
				selectYourPlayer: "Deinen Spieler auswahlen",
				selectYourPlayerPlaceholder: "Deinen Spieler auswahlen",
			},
			game: {
				kicker: "Notizbuch",
				title: "Behalte den Tisch im Blick und lose den Fall.",
				description:
					"Manuelle Notizen funktionieren bereits. Deduktionsregeln konnen als Nächstes direkt auf den gespeicherten Vorschlagen und Notizbuchstatus aufbauen.",
				notFoundTitle: "Spiel nicht gefunden",
				notFoundDescription:
					"Dieses Notizbuch fehlt im lokalen Speicher oder wurde noch nicht erstellt.",
				youArePlayingAs: "Du spielst als",
				playersAtTable: "Spieler am Tisch",
				suggestionsLogged: "Erfasste Vorschlage",
			},
			notebook: {
				title: "Notizbuch-Tabelle",
				description:
					"Klicke auf jede Zelle, um zwischen unbekannt, vorhanden und unmoglich zu wechseln.",
				autoHint:
					"Die automatische Deduktion hat {{count}} Notizbuchzellen ausgefullt.",
				autoDeduction: "Automatische Deduktion",
				card: "Karte",
				envelope: "Umschlag",
				solution: "Losung",
				you: "Du",
				groupLabel: "{{category}}",
				setStatus: "Setze {{card}} fur {{column}} auf {{status}}",
				status: {
					unknown: "unbekannt",
					owned: "vorhanden",
					impossible: "unmoglich",
				},
			},
			suggestion: {
				title: "Vorschlag erfassen",
				description:
					"Halte jeden Zug direkt fest, damit die Deduktion den Tischzustand spater nachvollziehen kann.",
				historyTitle: "Vorschlagsverlauf",
				historyDescription: "Neueste Eintrage stehen zuerst.",
				empty: "Noch keine Vorschlage. Trage oben den ersten Vorschlag ein.",
				entry: "Eintrag {{index}}",
				add: "Vorschlag hinzufugen",
				suggesterPlayer: "Vorschlagender Spieler",
				suggesterPlaceholder: "Spieler auswahlen",
				suspect: "Verdachtige Person",
				suspectPlaceholder: "Verdachtige Person auswahlen",
				weapon: "Waffe",
				weaponPlaceholder: "Waffe auswahlen",
				room: "Raum",
				roomPlaceholder: "Raum auswahlen",
				disprover: "Wer hat widerlegt",
				disproverPlaceholder: "Spieler oder niemand auswahlen",
				nobody: "Niemand",
				disprovedSentence:
					"{{suggester}} schlug {{suspect}}, {{weapon}} und {{room}} vor. {{disprover}} hat widerlegt.",
				noDisproverSentence:
					"{{suggester}} schlug {{suspect}}, {{weapon}} und {{room}} vor. Niemand hat widerlegt.",
				validation: {
					suggesterRequired: "Wahle aus, wer den Vorschlag gemacht hat.",
					disproverRequired:
						"Wahle aus, wer den Vorschlag widerlegt hat, oder niemand.",
					disproverCannotBeSuggester:
						"Der vorschlagende Spieler kann den eigenen Vorschlag nicht widerlegen.",
				},
			},
			validation: {
				minPlayers: "Cluedo braucht mindestens {{count}} Spieler.",
				maxPlayers:
					"Das klassische Cluedo unterstutzt hochstens {{count}} Spieler.",
				playerNameRequired: "Gib einen Spielernamen ein.",
				playerNameLength: "Spielernamen sollten unter 25 Zeichen bleiben.",
				playerNamesUnique: "Spielernamen mussen eindeutig sein.",
				playerNamesComplete:
					"Gib fur jeden Spieler in diesem Spiel einen Namen an.",
				userPlayerRequired: "Wahle aus, welcher Spieler du bist.",
			},
			categories: {
				suspect: "verdachtige person",
				weapon: "waffe",
				room: "raum",
				suspects: "Verdachtige Personen",
				weapons: "Waffen",
				rooms: "Raume",
			},
			cards: {
				green: "Reverend Grun",
				mustard: "Oberst von Gatow",
				peacock: "Baronin von Porz",
				plum: "Professor Bloom",
				scarlet: "Fraulein Gloria",
				white: "Frau Weiss",
				candlestick: "Leuchter",
				dagger: "Dolch",
				leadPipe: "Heizungsrohr",
				revolver: "Pistole",
				rope: "Seil",
				wrench: "Rohrzange",
				kitchen: "Kuche",
				ballroom: "Musikzimmer",
				conservatory: "Wintergarten",
				diningRoom: "Speisezimmer",
				billiardRoom: "Billardzimmer",
				library: "Bibliothek",
				lounge: "Salon",
				hall: "Eingangshalle",
				study: "Arbeitszimmer",
			},
			notFound: {
				kicker: "404",
				title: "Dieser Hinweis fuhrt nirgendwohin.",
				description:
					"Die angeforderte Route existiert in diesem Notizbuch nicht.",
			},
			footer: {
				rights: "Alle Rechte vorbehalten.",
				builtWith: "Open-Source-Cluedo-Notizbuch mit TanStack Start gebaut",
				name: "Daniele De Matteo",
				followTanStack: "TanStack auf X folgen",
				goToGithub: "cluedo-solver auf GitHub offnen",
			},
		},
	},
} as const;

export type TranslationResource = typeof resources.en.translation;
