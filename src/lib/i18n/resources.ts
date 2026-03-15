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
					"Automatic deduction is already active. Add suggestions and notebook updates to let the engine cross-check the table.",
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
					"Manual notes and automatic deduction now work together. The engine replays suggestion history, flags conflicts, and surfaces unresolved leads.",
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
			engine: {
				title: "Automatic deduction engine",
				description:
					"The solver replays your notebook and suggestion history to explain confirmed deductions, open leads, and contradictions.",
				live: "Derived live from notebook state and suggestion history.",
				stats: {
					deductions: "Deductions",
					leads: "Open leads",
					conflicts: "Conflicts",
				},
				sections: {
					conflicts: "Conflicts to resolve",
					recent: "Recent deductions",
					leads: "Open leads",
				},
				empty: {
					noConflicts: "No contradictions detected.",
					noDeductions:
						"No automatic deductions yet. Add suggestions or mark known cards to unlock the engine.",
					noLeads: "No unresolved leads right now.",
				},
				rules: {
					suggestionSkippedPlayer:
						"Entry {{index}} rules out {{player}} for {{card}} before the disprover.",
					suggestionNoDisprover:
						"Entry {{index}} rules out {{player}} for {{card}} because nobody disproved the suggestion.",
					disproverSingleCandidate:
						"Entry {{index}} leaves {{player}} with only {{card}} as a possible disproving card.",
					singlePossibleOwnerPlayer: "Only {{player}} can still hold {{card}}.",
					singlePossibleOwnerEnvelope:
						"Only the envelope can still hold {{card}}.",
					singleEnvelopeCandidate:
						"{{card}} is the only remaining {{category}} candidate for the envelope.",
					playerReachedMaxHand:
						"{{player}} already reached the maximum hand size of {{handSize}}, so {{card}} cannot belong to them.",
					playerReachedMinPossible:
						"{{player}} must still hold {{handSize}} cards, so {{card}} is forced into their hand.",
					handRangeForcedOwned:
						"Across every valid hand for {{player}} ({{minHand}}-{{maxHand}} cards), {{card}} is always present.",
					handRangeForcedImpossible:
						"Across every valid hand for {{player}} ({{minHand}}-{{maxHand}} cards), {{card}} is never present.",
					globalAssignmentOwnedPlayer:
						"Across all valid full-table assignments, {{player}} must hold {{card}}.",
					globalAssignmentOwnedEnvelope:
						"Across all valid full-table assignments, the envelope must hold {{card}}.",
					globalAssignmentImpossible:
						"Across all valid full-table assignments, {{column}} cannot hold {{card}}.",
				},
				evidence: {
					suggestion: "Based on suggestion entry {{index}}.",
					cell: "{{card}} for {{column}} is already marked {{status}}.",
					handSizeLimitMax:
						"{{player}} already accounts for the maximum hand size of {{handSize}} cards.",
					handSizeLimitMin:
						"{{player}} must still account for {{handSize}} cards.",
					handRange:
						"{{player}} has {{count}} valid hands left within the {{minHand}}-{{maxHand}} card range.",
					globalSupport:
						"Across the remaining valid table assignments, {{card}} only fits in: {{columns}}.",
				},
				leads: {
					disproverCandidates:
						"Entry {{index}} means {{player}} must hold one of: {{cards}}.",
					playerHandRange:
						"Entries {{entries}} narrow {{player}} to {{cards}} across {{count}} valid hands within the {{minHand}}-{{maxHand}} card range.",
				},
				conflicts: {
					ruleConflictImpossible:
						"{{card}} was inferred impossible for {{column}}, but that cell is already marked owned.",
					ruleConflictOwned:
						"{{card}} was inferred owned by {{column}}, but that cell is already marked impossible.",
					multipleOwners:
						"{{card}} is marked owned in multiple places: {{columns}}.",
					noPossibleOwner: "{{card}} has no remaining possible location.",
					multipleEnvelopeCards:
						"More than one {{category}} is marked in the envelope: {{cards}}.",
					noEnvelopeCandidate:
						"No {{category}} can still be placed in the envelope.",
					suggestionDisproverHasNoCandidate:
						"Entry {{index}} says {{player}} disproved the suggestion, but none of those cards can still belong to them.",
					playerExceedsMaxHand:
						"{{player}} is marked as owning {{count}} cards, which exceeds the maximum hand size of {{maxHand}}.",
					playerBelowMinPossible:
						"{{player}} can only still hold {{count}} possible cards, but must have at least {{minHand}}.",
					playerHasNoValidHand:
						"No valid hand remains for {{player}} within the {{minHand}}-{{maxHand}} card range.",
					noGlobalAssignment:
						"No complete table assignment satisfies the current notebook, hand sizes, and suggestion history.",
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
					"La deduzione automatica e gia attiva. Aggiungi suggerimenti e aggiorna il taccuino per far controllare il tavolo al motore.",
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
				title: "Segui il gioco e risolvi il caso.",
				description:
					"Appunti manuali e deduzione automatica ora lavorano insieme. Il motore rilegge la cronologia, segnala conflitti e mostra gli indizi ancora aperti.",
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
			engine: {
				title: "Motore di deduzione automatica",
				description:
					"Il solver rilegge taccuino e cronologia dei suggerimenti per spiegare deduzioni confermate, indizi aperti e contraddizioni.",
				live: "Calcolato in tempo reale da taccuino e cronologia suggerimenti.",
				stats: {
					deductions: "Deduzioni",
					leads: "Indizi aperti",
					conflicts: "Conflitti",
				},
				sections: {
					conflicts: "Conflitti da risolvere",
					recent: "Deduzioni recenti",
					leads: "Indizi aperti",
				},
				empty: {
					noConflicts: "Nessuna contraddizione rilevata.",
					noDeductions:
						"Nessuna deduzione automatica ancora. Aggiungi suggerimenti o marca carte note per sbloccare il motore.",
					noLeads: "Nessun indizio aperto in questo momento.",
				},
				rules: {
					suggestionSkippedPlayer:
						"Il turno {{index}} esclude {{player}} da {{card}} prima del giocatore che ha smentito.",
					suggestionNoDisprover:
						"Il turno {{index}} esclude {{player}} da {{card}} perche nessuno ha smentito il suggerimento.",
					disproverSingleCandidate:
						"Il turno {{index}} lascia a {{player}} solo {{card}} come possibile carta per smentire.",
					singlePossibleOwnerPlayer:
						"Solo {{player}} puo ancora avere {{card}}.",
					singlePossibleOwnerEnvelope:
						"Solo la busta puo ancora contenere {{card}}.",
					singleEnvelopeCandidate:
						"{{card}} e l'unico {{category}} rimasto per la busta.",
					playerReachedMaxHand:
						"{{player}} ha gia raggiunto il massimo di {{handSize}} carte, quindi {{card}} non puo appartenergli.",
					playerReachedMinPossible:
						"{{player}} deve ancora avere {{handSize}} carte, quindi {{card}} entra forzatamente nella sua mano.",
					handRangeForcedOwned:
						"In ogni mano valida per {{player}} (da {{minHand}} a {{maxHand}} carte), {{card}} compare sempre.",
					handRangeForcedImpossible:
						"In ogni mano valida per {{player}} (da {{minHand}} a {{maxHand}} carte), {{card}} non compare mai.",
					globalAssignmentOwnedPlayer:
						"In tutti gli assetti validi del tavolo, {{player}} deve avere {{card}}.",
					globalAssignmentOwnedEnvelope:
						"In tutti gli assetti validi del tavolo, la busta deve contenere {{card}}.",
					globalAssignmentImpossible:
						"In tutti gli assetti validi del tavolo, {{column}} non puo avere {{card}}.",
				},
				evidence: {
					suggestion: "Basato sul turno {{index}}.",
					cell: "{{card}} per {{column}} e gia segnata come {{status}}.",
					handSizeLimitMax:
						"{{player}} copre gia la dimensione massima della mano di {{handSize}} carte.",
					handSizeLimitMin:
						"{{player}} deve ancora coprire {{handSize}} carte.",
					handRange:
						"{{player}} ha ancora {{count}} mani valide nell'intervallo di {{minHand}}-{{maxHand}} carte.",
					globalSupport:
						"Negli assetti validi rimasti del tavolo, {{card}} puo stare solo in: {{columns}}.",
				},
				leads: {
					disproverCandidates:
						"Il turno {{index}} significa che {{player}} deve avere una tra: {{cards}}.",
					playerHandRange:
						"I turni {{entries}} restringono {{player}} a {{cards}} attraverso {{count}} mani valide nell'intervallo di {{minHand}}-{{maxHand}} carte.",
				},
				conflicts: {
					ruleConflictImpossible:
						"{{card}} e stata dedotta come impossibile per {{column}}, ma quella cella e gia segnata come posseduta.",
					ruleConflictOwned:
						"{{card}} e stata dedotta come posseduta da {{column}}, ma quella cella e gia segnata come impossibile.",
					multipleOwners:
						"{{card}} risulta posseduta in piu posizioni: {{columns}}.",
					noPossibleOwner: "{{card}} non ha piu nessuna posizione possibile.",
					multipleEnvelopeCards:
						"Piu di un {{category}} risulta nella busta: {{cards}}.",
					noEnvelopeCandidate:
						"Nessun {{category}} puo piu finire nella busta.",
					suggestionDisproverHasNoCandidate:
						"Il turno {{index}} dice che {{player}} ha smentito il suggerimento, ma nessuna di quelle carte puo piu appartenergli.",
					playerExceedsMaxHand:
						"{{player}} risulta proprietario di {{count}} carte, oltre il massimo consentito di {{maxHand}}.",
					playerBelowMinPossible:
						"{{player}} puo ancora avere solo {{count}} carte possibili, ma deve averne almeno {{minHand}}.",
					playerHasNoValidHand:
						"Non esiste piu nessuna mano valida per {{player}} nell'intervallo {{minHand}}-{{maxHand}} carte.",
					noGlobalAssignment:
						"Nessun assetto completo del tavolo soddisfa il taccuino attuale, le dimensioni delle mani e la cronologia dei suggerimenti.",
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
				entry: "Turno {{index}}",
				add: "Aggiungi suggerimento",
				suggesterPlayer: "È il turno di",
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
				green: "Reverendo Green",
				mustard: "Colonnello Mustard",
				peacock: "Signora Peacock",
				plum: "Professor Plum",
				scarlet: "Miss Scarlett",
				white: "Mrs White",
				candlestick: "Candeliere",
				dagger: "Pugnale",
				leadPipe: "Tubo di piombo",
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
					"Automatische Deduktion ist bereits aktiv. Fuge Vorschlage und Notizbuch-Updates hinzu, damit die Engine den Tisch neu auswertet.",
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
					"Manuelle Notizen und automatische Deduktion arbeiten jetzt zusammen. Die Engine liest die Vorschlagshistorie neu, meldet Konflikte und zeigt offene Spuren.",
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
			engine: {
				title: "Automatische Deduktions-Engine",
				description:
					"Der Solver liest Notizbuch und Vorschlagshistorie neu, um bestatigte Deduktionen, offene Spuren und Widerspruche zu erklaren.",
				live: "Live aus Notizbuchstatus und Vorschlagshistorie berechnet.",
				stats: {
					deductions: "Deduktionen",
					leads: "Offene Spuren",
					conflicts: "Konflikte",
				},
				sections: {
					conflicts: "Konflikte zum Auflosen",
					recent: "Letzte Deduktionen",
					leads: "Offene Spuren",
				},
				empty: {
					noConflicts: "Keine Widerspruche erkannt.",
					noDeductions:
						"Noch keine automatische Deduktion. Erfasse Vorschlage oder markiere bekannte Karten, um die Engine zu aktivieren.",
					noLeads: "Zurzeit keine offenen Spuren.",
				},
				rules: {
					suggestionSkippedPlayer:
						"Eintrag {{index}} schliesst {{player}} fur {{card}} vor dem widerlegenden Spieler aus.",
					suggestionNoDisprover:
						"Eintrag {{index}} schliesst {{player}} fur {{card}} aus, weil niemand den Vorschlag widerlegt hat.",
					disproverSingleCandidate:
						"Eintrag {{index}} lasst {{player}} nur noch {{card}} als mogliche Widerlegungskarte.",
					singlePossibleOwnerPlayer:
						"Nur {{player}} kann {{card}} noch besitzen.",
					singlePossibleOwnerEnvelope:
						"Nur der Umschlag kann {{card}} noch enthalten.",
					singleEnvelopeCandidate:
						"{{card}} ist der einzige verbleibende {{category}}-Kandidat fur den Umschlag.",
					playerReachedMaxHand:
						"{{player}} hat bereits die maximale Handgrose von {{handSize}} Karten erreicht, daher kann {{card}} nicht dort liegen.",
					playerReachedMinPossible:
						"{{player}} muss noch {{handSize}} Karten halten, daher wird {{card}} erzwungen.",
					handRangeForcedOwned:
						"In jeder gultigen Hand fur {{player}} ({{minHand}}-{{maxHand}} Karten) ist {{card}} immer enthalten.",
					handRangeForcedImpossible:
						"In jeder gultigen Hand fur {{player}} ({{minHand}}-{{maxHand}} Karten) kommt {{card}} nie vor.",
					globalAssignmentOwnedPlayer:
						"In allen gultigen Gesamtzuordnungen muss {{player}} {{card}} besitzen.",
					globalAssignmentOwnedEnvelope:
						"In allen gultigen Gesamtzuordnungen muss der Umschlag {{card}} enthalten.",
					globalAssignmentImpossible:
						"In allen gultigen Gesamtzuordnungen kann {{column}} {{card}} nicht besitzen.",
				},
				evidence: {
					suggestion: "Basiert auf Eintrag {{index}}.",
					cell: "{{card}} fur {{column}} ist bereits als {{status}} markiert.",
					handSizeLimitMax:
						"{{player}} erreicht bereits die maximale Handgrose von {{handSize}} Karten.",
					handSizeLimitMin:
						"{{player}} muss noch {{handSize}} Karten abdecken.",
					handRange:
						"{{player}} hat noch {{count}} gultige Hande im Bereich von {{minHand}} bis {{maxHand}} Karten.",
					globalSupport:
						"In den verbleibenden gultigen Gesamtzuordnungen passt {{card}} nur noch zu: {{columns}}.",
				},
				leads: {
					disproverCandidates:
						"Eintrag {{index}} bedeutet, dass {{player}} eine der folgenden Karten besitzen muss: {{cards}}.",
					playerHandRange:
						"Die Eintrage {{entries}} begrenzen {{player}} auf {{cards}} bei {{count}} gultigen Handen im Bereich von {{minHand}} bis {{maxHand}} Karten.",
				},
				conflicts: {
					ruleConflictImpossible:
						"{{card}} wurde fur {{column}} als unmoglich abgeleitet, aber diese Zelle ist bereits als vorhanden markiert.",
					ruleConflictOwned:
						"{{card}} wurde {{column}} als vorhanden zugeordnet, aber diese Zelle ist bereits als unmoglich markiert.",
					multipleOwners:
						"{{card}} ist an mehreren Stellen als vorhanden markiert: {{columns}}.",
					noPossibleOwner:
						"{{card}} hat keinen moglichen verbleibenden Ort mehr.",
					multipleEnvelopeCards:
						"Mehr als ein {{category}} ist im Umschlag markiert: {{cards}}.",
					noEnvelopeCandidate:
						"Kein {{category}} kann mehr im Umschlag liegen.",
					suggestionDisproverHasNoCandidate:
						"Eintrag {{index}} sagt, dass {{player}} den Vorschlag widerlegt hat, aber keine dieser Karten kann noch zu dieser Person gehoren.",
					playerExceedsMaxHand:
						"{{player}} ist mit {{count}} Karten markiert und uberschreitet damit die maximale Handgrose von {{maxHand}}.",
					playerBelowMinPossible:
						"{{player}} kann nur noch {{count}} mogliche Karten halten, braucht aber mindestens {{minHand}}.",
					playerHasNoValidHand:
						"Fur {{player}} bleibt keine gultige Hand mehr im Bereich von {{minHand}} bis {{maxHand}} Karten.",
					noGlobalAssignment:
						"Keine vollstandige Tischzuordnung erfullt das aktuelle Notizbuch, die HandgroBen und den Vorschlagsverlauf.",
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
