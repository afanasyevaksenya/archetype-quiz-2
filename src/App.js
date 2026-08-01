import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   CONFIGURATION
   ───────────────────────────────────────────────────────── */
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/YOUR_LINK_HERE";
const PRICE_DISPLAY = "$9.99";
const SITE_URL = "https://your-quiz-site.vercel.app";

/* ── WARM SAND PALETTE ───────────────────────────────────*/
const C = {
  card: "rgba(255,248,228,.58)",
  cardSel: "rgba(220,195,148,.42)",
  border: "rgba(154,117,53,.25)",
  borderSel: "#9a7535",
  gold: "#9a7535",
  goldDim: "#b89550",
  ink: "#2c2010",
  body: "#5a4730",
  muted: "#8a7550",
  accent: "rgba(154,117,53,.12)",
  line: "rgba(154,117,53,.2)",
  firstStep: "rgba(210,180,120,.28)",
};

/* ── ARCHETYPE DATA ──────────────────────────────────────*/
const RES = {
  F: {
    name: "THE FREE SPIRIT",
    sub: "Your Dominant Archetype",
    sym: "◯",
    tagline:
      "Your independence is your greatest gift — and your avoidance is your hidden shadow.",
    pattern:
      "You unconsciously equate commitment with losing yourself. You leave situations — jobs, relationships, places — right when they ask you to go deeper. This is not weakness; it is a survival pattern your psyche developed early. But it is now costing you the depth, stability, and belonging you quietly crave.",
    insight:
      "Real freedom is chosen — not fled to. The shift is from 'I leave to stay safe' to 'I stay when it matters and go when I genuinely choose.' Noticing that difference is where your transformation begins.",
    habits: [
      "Pause before leaving or resetting. Ask: 'Am I moving toward something — or away from fear?'",
      "Practice staying in one uncomfortable situation five minutes longer than you normally would.",
      "Before making an exit decision, write down what you are actually feeling.",
    ],
    personal: [
      "Choose one relationship to invest in intentionally this week — call, visit, show up",
      "Create one daily anchor ritual: morning tea, a short walk, ten minutes of writing",
      "Say yes to one invitation you would normally decline",
      "When restlessness hits, name it before acting on it",
    ],
    professional: [
      "Identify one project you have been avoiding committing to — make one small commitment today",
      "Stay in one meeting or conversation longer than feels comfortable",
      "Find one colleague to invest in consistently over the next month",
      "Ask yourself weekly: What am I building here, and does it genuinely matter to me?",
    ],
    first:
      "Tonight, write down one thing you have been running from. Just name it. That is enough for now.",
  },
  C: {
    name: "THE CREATOR",
    sub: "Your Dominant Archetype",
    sym: "✦",
    tagline:
      "What you make carries more weight than you allow yourself to believe.",
    pattern:
      "You have an extraordinarily rich inner world — and you unconsciously protect it by not fully releasing it. Perfectionism, procrastination, and self-doubt are three faces of the same fear: that what you make will not be enough. The work stays inside, incomplete, or hidden — and the world never receives what only you could offer.",
    insight:
      "The shift from unconscious to conscious Creator is simple but not easy: you stop waiting for the work to be ready and start releasing it. Completion is an act of courage. Done and shared will always change more lives than perfect and private.",
    habits: [
      "Name perfectionism when it shows up: 'There is my inner critic — I see you.'",
      "Set one 'done is better than perfect' deadline per day and honour it.",
      "Complete one small creative act daily — even ten minutes of making counts.",
    ],
    personal: [
      "Share something you have made with one trusted person this week — not for approval, just for connection",
      "Create without a goal once a week: write, draw, cook, make something just because",
      "Notice when you compare your work to others — replace it with: What is mine to make right now?",
      "Celebrate finishing, not just quality — completion is the win",
    ],
    professional: [
      "Send that draft, share that idea, submit that proposal — do the one thing you have been 'almost' doing",
      "Block 30 protected minutes of creation time daily — non-negotiable",
      "Share a work-in-progress with a colleague before it is perfect",
      "Track your output this week, not just outcomes: what did you actually make?",
    ],
    first:
      "Identify the one project you have been 'almost ready' to start or share. Give it a 7-day deadline. Tell one person today.",
  },
  G: {
    name: "THE GLOBAL NOMAD",
    sub: "Your Dominant Archetype",
    sym: "⊕",
    tagline: "You have mapped the world. The next frontier is within.",
    pattern:
      "You instinctively seek new horizons — cities, projects, people — and you genuinely grow from each. But your unconscious pattern is using external change to avoid internal work. You have learned a great deal about the world. The deeper question is: what have you learned about yourself in stillness?",
    insight:
      "Your greatest growth is no longer out there — it is in the capacity to go deep where you already are. This does not mean stopping. It means adding depth to your breadth. Roots do not slow you down. They make your movement meaningful.",
    habits: [
      "Ask yourself honestly: 'Am I moving toward something — or away from something?'",
      "Practice being fully present in your current place for one week before looking for the next thing.",
      "Identify one area where you have been 'about to go deeper' for years. Start there.",
    ],
    personal: [
      "Choose one relationship to go genuinely deeper in — have one real conversation about something that matters",
      "Start a short daily reflection: ten minutes inward instead of outward",
      "Create one small root: a plant, a neighbourhood walk, a regular café",
      "Allow yourself to be bored for five minutes without reaching for your phone",
    ],
    professional: [
      "Identify your deepest professional skill and commit to going ten times deeper in it this month",
      "Stay in one role or project long enough to see it fully through",
      "Share what you know: teach, write, or document your accumulated experience",
      "Build one long-term professional relationship — invest over months, not just meetings",
    ],
    first:
      "Choose one place, project, or relationship you are currently in. Commit to staying with it — going deeper — for 30 days.",
  },
  E: {
    name: "THE EMPATH",
    sub: "Your Dominant Archetype",
    sym: "◐",
    tagline:
      "Feeling deeply is your superpower. Losing yourself is your pattern.",
    pattern:
      "You feel everything around you, and you have likely spent years being the person everyone else processes through. Your unconscious habit is absorbing other people's emotional states and making them your responsibility. This is not empathy — it is self-erasure. It leaves you exhausted, under-expressed, and quietly resentful of the very people you love.",
    insight:
      "True emotional intelligence includes knowing where you end and where someone else begins. The shift is from 'I feel what you feel' to 'I can be with you without carrying it for you.' That distinction is the boundary between empathy and dissolution — and it changes everything.",
    habits: [
      "After emotional interactions, check in with yourself: 'Is this feeling mine — or did I absorb it?'",
      "Practice saying 'I understand' instead of immediately trying to fix, carry, or absorb.",
      "Before giving to others in any interaction, name one thing you yourself need.",
    ],
    personal: [
      "Identify one relationship where you give significantly more than you receive — have one honest conversation about it",
      "Schedule weekly time that is completely yours — no helping, no listening, just being",
      "Say no to one request this week without over-explaining",
      "Write your own feelings down daily — not others', yours",
    ],
    professional: [
      "Stop carrying the emotional climate of your team alone — it is not your role to regulate everyone around you",
      "Express one professional opinion or need clearly in your next meeting",
      "Notice where you over-perform emotionally at work and the cost it carries",
      "Ask for something you need from a colleague or manager once this week",
    ],
    first:
      "Today, before you ask how everyone else is doing — ask yourself how you are. Write down the honest answer.",
  },
  S: {
    name: "THE SOVEREIGN",
    sub: "Your Dominant Archetype",
    sym: "◆",
    tagline:
      "You build extraordinary things. What you avoid building is vulnerability.",
    pattern:
      "You are a natural builder — of businesses, systems, results, and visions. But your unconscious pattern is using achievement to avoid being known. You construct impressive things to feel safe, worthy, and in control. The cost is that your most important relationships — including your relationship with yourself — remain at the surface.",
    insight:
      "The most powerful thing a Sovereign can build is the capacity to be known — not just respected. Real leadership, real success, and real life happen in the space between achievements. That space is called presence — and it begins the moment you stop optimising and start experiencing.",
    habits: [
      "Notice when you shift into strategy mode during emotional conversations. Pause and feel instead.",
      "Ask yourself weekly: What am I actually building — and is it what I truly want?",
      "Identify one area of life you have been optimising instead of living.",
    ],
    personal: [
      "Spend 15 minutes daily without a task, agenda, or screen — just being with yourself",
      "Tell one person in your life something true about how you are actually feeling",
      "Make one decision this week based purely on what you want, not what is strategic",
      "Invest in one relationship with zero agenda: no networking, no benefit — just presence",
    ],
    professional: [
      "In your next team interaction, listen more than you speak",
      "Identify one thing you are working on that genuinely excites you — not impresses others",
      "Delegate one task this week and resist the urge to redo it",
      "Acknowledge someone on your team specifically and sincerely this week",
    ],
    first:
      "Block 20 minutes today with nothing scheduled — no phone, no work. Sit. Notice what comes up. That is the beginning.",
  },
};

/* ── QUESTIONS ───────────────────────────────────────────*/
const Qs = [
  {
    q: "Close your eyes for a moment. When you picture your best possible life five years from now — what's the very first image that appears?",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Wide Open Space",
        d: "Complete freedom — no fixed schedule, no restrictions, life entirely on my own terms",
      },
      {
        k: "C",
        sym: "✦",
        t: "The Work",
        d: "Something I've created exists in the world and it genuinely matters to people",
      },
      {
        k: "G",
        sym: "⊕",
        t: "New Ground",
        d: "A completely different place, culture, or context I haven't explored yet",
      },
      {
        k: "E",
        sym: "◐",
        t: "Deep Connection",
        d: "A relationship or community where I feel truly seen, known, and understood",
      },
    ],
  },
  {
    q: "When life gets uncomfortable or uncertain, what do you most often do?",
    a: [
      {
        k: "C",
        sym: "✦",
        t: "Channel it",
        d: "I turn the discomfort into something — I write, make, or create from it",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Change the scene",
        d: "I find a new environment, plan a trip, or shift to something different",
      },
      {
        k: "E",
        sym: "◐",
        t: "Feel it through",
        d: "I sit with it and let myself feel everything — often with someone I trust",
      },
      {
        k: "S",
        sym: "◆",
        t: "Fix it",
        d: "I identify what's wrong, make a plan, and take action immediately",
      },
    ],
  },
  {
    q: "People in your life most consistently recognise you for...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Your honesty",
        d: "You say what others are too careful or afraid to say out loud",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Your perspective",
        d: "Your broad experience gives you a view on life that few others carry",
      },
      {
        k: "E",
        sym: "◐",
        t: "Your presence",
        d: "People feel deeply heard and understood when they are with you",
      },
      {
        k: "S",
        sym: "◆",
        t: "Your clarity",
        d: "You quickly cut through noise and see exactly what needs to happen",
      },
    ],
  },
  {
    q: "When you face a major life decision, your first instinct is to...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Trust your gut",
        d: "Move on instinct — you'll figure the details out as you go",
      },
      {
        k: "C",
        sym: "✦",
        t: "Find the meaning",
        d: "Look deeper into what this decision is really asking of you",
      },
      {
        k: "E",
        sym: "◐",
        t: "Feel it first",
        d: "Sit with the emotions until something becomes genuinely clear",
      },
      {
        k: "S",
        sym: "◆",
        t: "Map it out",
        d: "List the options, weigh the outcomes carefully, then decide",
      },
    ],
  },
  {
    q: "What feels most like 'home' to you?",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Freedom",
        d: "Any situation where I am completely free to be exactly who I am",
      },
      {
        k: "C",
        sym: "✦",
        t: "My work",
        d: "The space where I create — when I'm making something, I feel at home",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Movement",
        d: "Being in transit — airports, new cities, the spaces in between",
      },
      {
        k: "S",
        sym: "◆",
        t: "What I've built",
        d: "The career, the life, the structure I have intentionally created",
      },
    ],
  },
  {
    q: "Which pattern keeps repeating in your life — even when you don't want it to?",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "I outgrow quickly",
        d: "I arrive, connect, flourish — then feel the pull to move on and start over",
      },
      {
        k: "C",
        sym: "✦",
        t: "I hide what I make",
        d: "I create something meaningful, then undervalue or withhold it from the world",
      },
      {
        k: "G",
        sym: "⊕",
        t: "I'm always the bridge",
        d: "I connect different worlds and people — but rarely settle in one place fully",
      },
      {
        k: "E",
        sym: "◐",
        t: "I lose myself in others",
        d: "I absorb the emotions around me and forget what I myself am feeling",
      },
    ],
  },
  {
    q: "When you're stressed or overwhelmed, what do you reach for first?",
    a: [
      {
        k: "C",
        sym: "✦",
        t: "Making something",
        d: "Creating — cooking, writing, building — always brings me back to myself",
      },
      {
        k: "G",
        sym: "⊕",
        t: "A change of scene",
        d: "Physical movement or a new environment is the reset I need",
      },
      {
        k: "E",
        sym: "◐",
        t: "Someone to talk to",
        d: "Processing with people I trust helps me understand what I actually feel",
      },
      {
        k: "S",
        sym: "◆",
        t: "Problem-solving",
        d: "Breaking the problem down and taking back control helps me feel stable",
      },
    ],
  },
  {
    q: "What do you most want — but find the hardest to ask for?",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Space",
        d: "To live on my own terms without having to explain or justify it",
      },
      {
        k: "G",
        sym: "⊕",
        t: "New experiences",
        d: "To keep expanding — more cultures, places, and ways of living",
      },
      {
        k: "E",
        sym: "◐",
        t: "To be truly seen",
        d: "Real intimacy — someone who understands me at the deepest level",
      },
      {
        k: "S",
        sym: "◆",
        t: "Recognition",
        d: "To be genuinely respected for what I have built and the vision I carry",
      },
    ],
  },
  {
    q: "Which image speaks to something real in you right now?",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "An empty road at dawn",
        d: "Solitary, open, no destination fixed — completely and quietly free",
      },
      {
        k: "C",
        sym: "✦",
        t: "A studio, early morning",
        d: "A work in progress, lamp lit, something being made in focused silence",
      },
      {
        k: "E",
        sym: "◐",
        t: "Two people, deep in conversation",
        d: "Total honesty — being fully known and knowing fully in return",
      },
      {
        k: "S",
        sym: "◆",
        t: "A city skyline at first light",
        d: "Something vast, structured, purposeful — and somehow yours to shape",
      },
    ],
  },
  {
    q: "People consistently come to you when they need...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "The truth",
        d: "You say the honest thing that others are carefully dancing around",
      },
      {
        k: "C",
        sym: "✦",
        t: "A new perspective",
        d: "You help people see possibilities they could not reach on their own",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Real-world context",
        d: "Your range of experience gives a perspective that most people simply don't have",
      },
      {
        k: "S",
        sym: "◆",
        t: "Clear direction",
        d: "You cut through noise and find the right path forward quickly",
      },
    ],
  },
  {
    q: "Which version of yourself do you privately wish you had become?",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "The one who walked away",
        d: "Who left what wasn't right without guilt and never looked back",
      },
      {
        k: "C",
        sym: "✦",
        t: "The one who made the thing",
        d: "Who created without waiting for permission and put their work into the world",
      },
      {
        k: "G",
        sym: "⊕",
        t: "The one who went everywhere",
        d: "Who explored without hesitation and let the world genuinely shape them",
      },
      {
        k: "E",
        sym: "◐",
        t: "The one who loved fully",
        d: "Who gave themselves completely to love and was met with equal depth",
      },
    ],
  },
  {
    q: "Your honest relationship with structure and routine is...",
    a: [
      {
        k: "C",
        sym: "✦",
        t: "Complicated",
        d: "Structure can help me create — but it can also quietly stifle me",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Minimal",
        d: "I work best without fixed routines — life is too varied and fluid for that",
      },
      {
        k: "E",
        sym: "◐",
        t: "Emotionally guided",
        d: "I organise time around people and meaningful moments, not systems",
      },
      {
        k: "S",
        sym: "◆",
        t: "Essential",
        d: "Clear systems and daily routines are how I perform at my best",
      },
    ],
  },
  {
    q: "The wound you carry most quietly — the one you rarely name out loud — is...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Conditional belonging",
        d: "Love and acceptance always came with unspoken rules I couldn't meet without losing myself",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Never quite at home",
        d: "I have never felt fully settled — anywhere, or with anyone",
      },
      {
        k: "E",
        sym: "◐",
        t: "Too much for people",
        d: "My depth and sensitivity has consistently pushed the people I most wanted to stay away",
      },
      {
        k: "S",
        sym: "◆",
        t: "Softness wasn't safe",
        d: "Being vulnerable was treated as weakness early on — so I learned to protect myself with armour",
      },
    ],
  },
  {
    q: "The word that has quietly driven your choices since childhood is...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Free",
        d: "A pull toward complete autonomy that came before anything else",
      },
      {
        k: "C",
        sym: "✦",
        t: "Make",
        d: "An urge to create that arrived before you even knew what you were creating",
      },
      {
        k: "E",
        sym: "◐",
        t: "Feel",
        d: "You have always processed life through emotion before logic or strategy",
      },
      {
        k: "S",
        sym: "◆",
        t: "Build",
        d: "A constant drive to make something real, lasting, and genuinely yours",
      },
    ],
  },
  {
    q: "If you could have lived in a different era or taken a completely different path, it would be...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "A wandering philosopher",
        d: "Moving freely, following ideas, untethered by convention or fixed address",
      },
      {
        k: "C",
        sym: "✦",
        t: "A pioneering artist",
        d: "Creating ahead of your time — even if no one fully understood it yet",
      },
      {
        k: "G",
        sym: "⊕",
        t: "A great explorer",
        d: "Mapping the unmapped, translating between cultures, always in motion",
      },
      {
        k: "S",
        sym: "◆",
        t: "An empire builder",
        d: "Constructing something that outlasted you — systems, cities, legacies",
      },
    ],
  },
  {
    q: "The future that feels like it's genuinely calling you forward feels like...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Finally mine",
        d: "Completely on my own terms — uncategorizable and unmistakably me",
      },
      {
        k: "C",
        sym: "✦",
        t: "A body of work",
        d: "Something building in the world because I chose to bring it through",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Borderless",
        d: "Multi-cultural, mobile, fluid — belonging everywhere and nowhere at once",
      },
      {
        k: "E",
        sym: "◐",
        t: "Real connection",
        d: "A life structured around genuine relationships and honest emotional truth",
      },
    ],
  },
  {
    q: "Your deepest fear about not changing — about staying exactly as you are — is...",
    a: [
      {
        k: "C",
        sym: "✦",
        t: "Dying with it inside me",
        d: "Leaving this life without having made what was living inside me all along",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Getting left behind",
        d: "The world keeps expanding and growing while I remain fixed in one place",
      },
      {
        k: "E",
        sym: "◐",
        t: "Never being truly met",
        d: "Connecting with many people across my life but never being genuinely known by any",
      },
      {
        k: "S",
        sym: "◆",
        t: "Building the wrong thing",
        d: "Realising I spent my one life executing someone else's vision in someone else's name",
      },
    ],
  },
  {
    q: "Your most honest relationship — the one that needs no audience — is with...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Solitude",
        d: "Alone is where I am most completely and reliably myself",
      },
      {
        k: "G",
        sym: "⊕",
        t: "The next horizon",
        d: "There is always a direction that feels more true and alive than where I am standing",
      },
      {
        k: "E",
        sym: "◐",
        t: "My feelings",
        d: "My emotional body tells me the truth before my mind has finished catching up",
      },
      {
        k: "S",
        sym: "◆",
        t: "My drive",
        d: "My ambition understands me with more precision than most people in my life do",
      },
    ],
  },
  {
    q: "If your inner world had one defining symbol, it would be...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "An open road",
        d: "No fixed endpoint, always beginning again, infinite possibility ahead",
      },
      {
        k: "C",
        sym: "✦",
        t: "A mirror",
        d: "Something that reflects, reveals, and shows what lives beneath the surface",
      },
      {
        k: "E",
        sym: "◐",
        t: "A deep well",
        d: "Quiet, ancient, containing more depth than most people will ever fully see",
      },
      {
        k: "S",
        sym: "◆",
        t: "A tower",
        d: "Built deliberately, pointing upward, visible and purposeful from a distance",
      },
    ],
  },
  {
    q: "The legacy that quietly matters most to you is...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Showing what freedom looks like",
        d: "Living so freely and visibly that others feel genuine permission to do the same",
      },
      {
        k: "C",
        sym: "✦",
        t: "A body of work that outlasts me",
        d: "Something that still moves or changes people long after I have gone",
      },
      {
        k: "G",
        sym: "⊕",
        t: "A broader understanding",
        d: "Having seen and translated the world in a way that helped others see it more clearly",
      },
      {
        k: "S",
        sym: "◆",
        t: "Real change at scale",
        d: "Having built or shifted something that genuinely and measurably mattered",
      },
    ],
  },
  {
    q: "Your inner opposite — the shadow side you most resist — would look like...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Someone deeply rooted",
        d: "Settled, fully committed, belonging in one place without restlessness",
      },
      {
        k: "C",
        sym: "✦",
        t: "A methodical executor",
        d: "Disciplined, systematic, entirely comfortable in routine and precision",
      },
      {
        k: "G",
        sym: "⊕",
        t: "A deep introvert",
        d: "Still, interior-focused, exploring the inner world more than the outer one",
      },
      {
        k: "E",
        sym: "◐",
        t: "Someone entirely self-sufficient",
        d: "Fully independent, emotionally self-contained, needing no one to feel whole",
      },
    ],
  },
  {
    q: "For you, real and lasting change most often happens through...",
    a: [
      {
        k: "C",
        sym: "✦",
        t: "Creating something",
        d: "Externalising the inner world into something real, tangible, and visible",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Moving somewhere",
        d: "A new place, culture, or context shifts my perspective on everything",
      },
      {
        k: "E",
        sym: "◐",
        t: "Feeling it fully",
        d: "Going all the way into the emotion until something genuinely lifts or shifts",
      },
      {
        k: "S",
        sym: "◆",
        t: "Making a clear decision",
        d: "A definitive, conscious choice followed by immediate and committed action",
      },
    ],
  },
  {
    q: "The question your life keeps asking you — the one you cannot escape — is...",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "What would you do if nothing was holding you back?",
        d: "The question of total freedom — and whether you are brave enough to choose it",
      },
      {
        k: "G",
        sym: "⊕",
        t: "Where haven't you been yet?",
        d: "In the world outside — or in the unexplored territory within yourself",
      },
      {
        k: "E",
        sym: "◐",
        t: "Who do you love — and are you letting yourself be loved back?",
        d: "The question of real intimacy — giving and receiving in equal measure",
      },
      {
        k: "S",
        sym: "◆",
        t: "What are you building — and does it deserve this one life?",
        d: "The question of purpose — whether what you are constructing is truly yours",
      },
    ],
  },
  {
    q: "Which statement feels most honestly true for you right now?",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "I need space more than I need company",
        d: "Solitude restores me in a way connection currently cannot",
      },
      {
        k: "C",
        sym: "✦",
        t: "I need to make something more than I need to plan it",
        d: "The creating matters more than the strategy around it",
      },
      {
        k: "E",
        sym: "◐",
        t: "I need to be heard more than I need to be advised",
        d: "What I want most right now is real presence — not solutions",
      },
      {
        k: "S",
        sym: "◆",
        t: "I need direction more than I need comfort",
        d: "I am ready to move — I just need clarity on where",
      },
    ],
  },
  {
    q: "Standing at the edge of your next chapter, what do you hear inside you?",
    a: [
      {
        k: "F",
        sym: "◯",
        t: "Go. Just go.",
        d: "Stop waiting for permission or the perfect moment. Move.",
      },
      {
        k: "C",
        sym: "✦",
        t: "Make it. Now.",
        d: "The world has been patiently waiting for what only you can create",
      },
      {
        k: "G",
        sym: "⊕",
        t: "There is more. Go find it.",
        d: "There is more world, more self, more life than you have yet allowed yourself",
      },
      {
        k: "S",
        sym: "◆",
        t: "Build what only you can build.",
        d: "The blueprint has always been inside you. The time is now.",
      },
    ],
  },
];

const PHRASES = [
  "Identifying your pattern…",
  "Reading the depth…",
  "Mapping your archetype…",
  "Processing your responses…",
  "Preparing your guideline…",
];

function isUnlocked() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("unlocked") === "true";
}
function goToCheckout() {
  const returnUrl = `${SITE_URL}?unlocked=true`;
  window.location.href = `${STRIPE_PAYMENT_LINK}?success_url=${encodeURIComponent(
    returnUrl
  )}`;
}

/* ── APP ─────────────────────────────────────────────────*/
export default function App() {
  const [screen, setScreen] = useState("intro");
  const [qi, setQi] = useState(0);
  const [scores, setScores] = useState({ F: 0, C: 0, G: 0, E: 0, S: 0 });
  const [sel, setSel] = useState(null);
  const [vis, setVis] = useState(true);
  const [pi, setPi] = useState(0);
  const [paid, setPaid] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setPaid(isUnlocked());
  }, []);
  useEffect(() => {
    if (screen !== "loading") return;
    const id = setInterval(() => setPi((p) => (p + 1) % PHRASES.length), 850);
    return () => clearInterval(id);
  }, [screen]);

  const next = () => {
    if (!sel) return;
    const ns = { ...scores, [sel]: scores[sel] + 1 };
    setScores(ns);
    setVis(false);
    setTimeout(() => {
      if (qi < Qs.length - 1) {
        setQi(qi + 1);
        setSel(null);
        setVis(true);
      } else {
        setScreen("loading");
        setTimeout(() => setScreen("results"), 3000);
      }
    }, 340);
  };

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const restart = () => {
    setScreen("intro");
    setQi(0);
    setScores({ F: 0, C: 0, G: 0, E: 0, S: 0 });
    setSel(null);
    setVis(true);
    setName("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500&family=Inter:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:#e4d8b8;min-height:100%;}
        .card{transition:all .25s ease;cursor:pointer;user-select:none;}
        .card:hover{border-color:#9a7535!important;background:rgba(220,195,148,.32)!important;transform:translateY(-3px);box-shadow:0 10px 28px rgba(120,85,20,.13)!important;}
        .card.s{border-color:#9a7535!important;background:rgba(220,195,148,.42)!important;transform:translateY(-2px);box-shadow:0 8px 22px rgba(120,85,20,.16)!important;}
        .btn{transition:all .25s;cursor:pointer;outline:none;font-family:'Cinzel',serif;}
        .btn:hover:not(:disabled){background:rgba(154,117,53,.15)!important;border-color:#9a7535!important;color:#6a4e18!important;}
        .btn:disabled{opacity:.28;cursor:default;}
        .btn-pay{transition:all .25s;cursor:pointer;outline:none;font-family:'Cinzel',serif;}
        .btn-pay:hover{background:#7a5a18!important;transform:translateY(-1px);box-shadow:0 8px 24px rgba(120,85,20,.3)!important;}
        .name-input{width:100%;background:rgba(255,248,225,.7);border:1px solid rgba(154,117,53,.3);border-radius:4px;padding:14px 18px;font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:300;color:#2c2010;outline:none;transition:all .25s;backdrop-filter:blur(4px);}
        .name-input::placeholder{color:rgba(138,117,80,.5);font-style:italic;}
        .name-input:focus{border-color:#9a7535;background:rgba(255,248,225,.9);box-shadow:0 0 0 3px rgba(154,117,53,.08);}
        .fade{transition:opacity .32s ease,transform .32s ease;}
        .fi{opacity:1;transform:translateY(0);}
        .fo{opacity:0;transform:translateY(-10px);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.12}50%{opacity:.6}}
        @keyframes breathe{0%,100%{opacity:.42}50%{opacity:.82}}
        .breathe{animation:breathe 2.8s ease-in-out infinite;}
        .ru{animation:fadeUp .6s ease forwards;opacity:0;}
        .d1{animation-delay:.04s}.d2{animation-delay:.18s}.d3{animation-delay:.32s}
        .d4{animation-delay:.46s}.d5{animation-delay:.60s}.d6{animation-delay:.74s}.d7{animation-delay:.88s}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(154,117,53,.22);border-radius:2px}
        .step-dot{width:5px;height:5px;border-radius:50%;background:#9a7535;flex-shrink:0;margin-top:6px;opacity:.7}
        .blur-lock{filter:blur(5px);pointer-events:none;user-select:none;opacity:.5;}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(150deg,#ede5ce 0%,#e2d4b0 50%,#d8c9a0 100%)",
          color: C.ink,
          fontFamily: "'Inter',sans-serif",
          overflowX: "hidden",
        }}
      >
        {screen === "intro" && <Intro onStart={() => setScreen("theory")} />}
        {screen === "theory" && <Theory onStart={() => setScreen("name")} />}
        {screen === "name" && (
          <NameScreen
            name={name}
            setName={setName}
            onStart={() => setScreen("quiz")}
          />
        )}
        {screen === "quiz" && (
          <Quiz
            q={Qs[qi]}
            num={qi + 1}
            total={Qs.length}
            sel={sel}
            onSel={setSel}
            onNext={next}
            vis={vis}
          />
        )}
        {screen === "loading" && <Loading phrase={PHRASES[pi]} />}
        {screen === "results" && (
          <Results
            r={RES[sorted[0][0]]}
            sec={RES[sorted[1][0]]}
            paid={paid}
            name={name}
            onRestart={restart}
          />
        )}
      </div>
    </>
  );
}

/* ── INTRO ───────────────────────────────────────────────*/
function Intro({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 28px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%,rgba(255,245,210,.5) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <p
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 8,
          letterSpacing: 6,
          color: C.gold,
          textTransform: "uppercase",
          marginBottom: 36,
          opacity: 0.8,
        }}
      >
        Jungian Archetype Mapping
      </p>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(32px,6vw,58px)",
          fontWeight: 300,
          lineHeight: 1.1,
          color: C.ink,
          marginBottom: 6,
        }}
      >
        Archetype &
      </h1>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(32px,6vw,58px)",
          fontWeight: 300,
          fontStyle: "italic",
          lineHeight: 1.1,
          color: C.gold,
          marginBottom: 32,
        }}
      >
        Life Change
      </h1>
      <div
        style={{
          width: 40,
          height: 1,
          background: C.gold,
          margin: "0 auto 32px",
          opacity: 0.4,
        }}
      />
      <p
        style={{
          fontSize: 15.5,
          lineHeight: 1.85,
          color: C.body,
          maxWidth: 460,
          marginBottom: 16,
          fontWeight: 300,
        }}
      >
        Identify the unconscious archetype that shapes your behavior — then
        learn to transform it into a tool for conscious, intentional living.
      </p>
      <p
        style={{
          fontSize: 13,
          lineHeight: 1.9,
          color: C.muted,
          maxWidth: 380,
          marginBottom: 20,
          fontStyle: "italic",
        }}
      >
        25 questions · Jungian depth psychology · Practical life guidance
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 16,
          maxWidth: 360,
          textAlign: "left",
        }}
      >
        {[
          "Your dominant archetype and hidden pattern",
          "How to break self-sabotaging unconscious habits",
          "Daily steps for personal and professional change",
        ].map((t, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: C.gold,
                flexShrink: 0,
                marginTop: 7,
                opacity: 0.8,
              }}
            />
            <p
              style={{
                fontSize: 13,
                color: C.body,
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              {t}
            </p>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "rgba(255,248,225,.6)",
          border: `1px solid rgba(154,117,53,.3)`,
          borderRadius: 6,
          padding: "12px 24px",
          marginBottom: 40,
          backdropFilter: "blur(4px)",
        }}
      >
        <p style={{ fontSize: 12.5, color: C.body, fontWeight: 300 }}>
          Quiz is{" "}
          <strong style={{ fontWeight: 500, color: C.ink }}>free</strong> · Full
          personal guideline unlocks for{" "}
          <strong style={{ fontWeight: 500, color: C.gold }}>
            {PRICE_DISPLAY}
          </strong>
        </p>
      </div>
      <button
        className="btn"
        onClick={onStart}
        style={{
          background: "rgba(255,248,225,.6)",
          border: `1px solid rgba(154,117,53,.45)`,
          color: C.gold,
          padding: "14px 52px",
          fontSize: 8.5,
          letterSpacing: 5,
          textTransform: "uppercase",
          backdropFilter: "blur(4px)",
        }}
      >
        Begin the Quiz
      </button>
    </div>
  );
}

/* ── THEORY ──────────────────────────────────────────────*/
function Theory({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 28px",
      }}
    >
      <div style={{ maxWidth: 580, width: "100%", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            letterSpacing: 6,
            color: C.gold,
            textTransform: "uppercase",
            marginBottom: 28,
            opacity: 0.8,
          }}
        >
          Before You Begin
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(22px,4vw,34px)",
            fontWeight: 300,
            lineHeight: 1.2,
            color: C.ink,
            marginBottom: 6,
          }}
        >
          What Is a
        </h2>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(22px,4vw,34px)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1.2,
            color: C.gold,
            marginBottom: 30,
          }}
        >
          Jungian Archetype?
        </h2>
        <div
          style={{
            width: 40,
            height: 1,
            background: C.gold,
            margin: "0 auto 32px",
            opacity: 0.35,
          }}
        />
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.95,
            color: C.body,
            fontWeight: 300,
            textAlign: "left",
          }}
        >
          Carl Jung, the Swiss psychiatrist and founder of analytical
          psychology, believed that beneath our conscious personality lies a
          deeper structure he called the{" "}
          <em
            style={{
              color: C.ink,
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 16,
            }}
          >
            collective unconscious
          </em>{" "}
          — a universal layer of the psyche shared by all humans. Within it live
          the{" "}
          <strong style={{ color: C.ink, fontWeight: 500 }}>archetypes</strong>:
          timeless patterns of thought, feeling, and behavior that silently
          shape how we make decisions, relate to others, and respond to life's
          challenges. Each of us is unconsciously dominated by one or two of
          these archetypes — running on behavioral autopilot rather than making
          genuine conscious choices. When you identify which archetype is most
          active in you, you bring it from the unconscious into the light of
          awareness. And that shift — from automatic reaction to deliberate
          choice — is precisely where real, lasting personal change becomes
          possible.
        </p>
        <div style={{ height: 1, background: C.line, margin: "32px 0" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 40,
            textAlign: "left",
          }}
        >
          {[
            "The quiz ahead maps your dominant archetype through 25 behavioral questions",
            "There are no right or wrong answers — choose what feels most honest",
            "Your result includes a practical guideline for real life change",
          ].map((t, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: C.gold,
                  flexShrink: 0,
                  marginTop: 7,
                  opacity: 0.6,
                }}
              />
              <p
                style={{
                  fontSize: 13,
                  color: C.muted,
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}
              >
                {t}
              </p>
            </div>
          ))}
        </div>
        <button
          className="btn"
          onClick={onStart}
          style={{
            background: "rgba(255,248,225,.6)",
            border: `1px solid rgba(154,117,53,.45)`,
            color: C.gold,
            padding: "14px 52px",
            fontSize: 8.5,
            letterSpacing: 5,
            textTransform: "uppercase",
            backdropFilter: "blur(4px)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* ── NAME SCREEN ─────────────────────────────────────────*/
function NameScreen({ name, setName, onStart }) {
  const inputRef = useRef(null);
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);
  const handleKey = (e) => {
    if (e.key === "Enter" && name.trim()) onStart();
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 28px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%,rgba(255,245,210,.45) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div
          style={{
            fontSize: 28,
            color: C.gold,
            marginBottom: 24,
            opacity: 0.55,
          }}
        >
          ◎
        </div>

        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            letterSpacing: 6,
            color: C.gold,
            textTransform: "uppercase",
            marginBottom: 20,
            opacity: 0.8,
          }}
        >
          A Personal Journey
        </p>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(24px,4vw,38px)",
            fontWeight: 300,
            lineHeight: 1.2,
            color: C.ink,
            marginBottom: 8,
          }}
        >
          Before we begin —
        </h2>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(24px,4vw,38px)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1.2,
            color: C.gold,
            marginBottom: 32,
          }}
        >
          what is your name?
        </h2>

        <div
          style={{
            width: 40,
            height: 1,
            background: C.gold,
            margin: "0 auto 36px",
            opacity: 0.35,
          }}
        />

        <p
          style={{
            fontSize: 13.5,
            lineHeight: 1.8,
            color: C.muted,
            marginBottom: 32,
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          Your results will be personalised for you.
        </p>

        <input
          ref={inputRef}
          className="name-input"
          type="text"
          placeholder="Enter your first name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKey}
          maxLength={40}
          style={{ marginBottom: 24, textAlign: "center", letterSpacing: 1 }}
        />

        <button
          className="btn"
          onClick={onStart}
          disabled={!name.trim()}
          style={{
            background: name.trim()
              ? "rgba(255,248,225,.65)"
              : "rgba(255,248,225,.3)",
            border: `1px solid ${
              name.trim() ? "rgba(154,117,53,.5)" : "rgba(154,117,53,.18)"
            }`,
            color: name.trim() ? C.gold : C.muted,
            padding: "13px 50px",
            fontSize: 8,
            letterSpacing: 5,
            textTransform: "uppercase",
            backdropFilter: "blur(4px)",
            display: "block",
            width: "100%",
          }}
        >
          {name.trim()
            ? `Begin, ${name.trim().split(" ")[0]}`
            : "Begin the Quiz"}
        </button>

        <p
          style={{
            fontSize: 11.5,
            color: C.muted,
            marginTop: 16,
            fontWeight: 300,
            opacity: 0.7,
          }}
        >
          Press Enter to continue
        </p>
      </div>
    </div>
  );
}

/* ── QUIZ ────────────────────────────────────────────────*/
function Quiz({ q, num, total, sel, onSel, onNext, vis }) {
  const pct = ((num - 1) / total) * 100;
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: 800,
        margin: "0 auto",
        padding: "0 20px",
      }}
    >
      <div style={{ paddingTop: 28, paddingBottom: 16, flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 8,
              letterSpacing: 4,
              color: C.muted,
              textTransform: "uppercase",
            }}
          >
            {num} of {total}
          </span>
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 8,
              letterSpacing: 2,
              color: C.gold,
              opacity: 0.7,
            }}
          >
            {Math.round(pct)}%
          </span>
        </div>
        <div
          style={{
            height: 2,
            background: "rgba(154,117,53,.15)",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(to right,#c8a055,#9a7535)",
              borderRadius: 2,
              transition: "width .5s ease",
            }}
          />
        </div>
      </div>
      <div
        className={`fade ${vis ? "fi" : "fo"}`}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingBottom: 24,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "28px 8px 36px",
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(17px,2.8vw,24px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.65,
              color: C.ink,
              maxWidth: 580,
              margin: "0 auto",
            }}
          >
            &ldquo;{q.q}&rdquo;
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 13,
            flex: 1,
          }}
        >
          {q.a.map((ans, i) => (
            <div
              key={i}
              className={`card ${sel === ans.k ? "s" : ""}`}
              onClick={() => onSel(ans.k)}
              style={{
                border: `1px solid ${sel === ans.k ? C.borderSel : C.border}`,
                borderRadius: 6,
                padding: "22px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 10,
                background: sel === ans.k ? C.cardSel : C.card,
                boxShadow:
                  sel === ans.k
                    ? "0 8px 22px rgba(120,85,20,.15)"
                    : "0 2px 10px rgba(100,70,20,.07)",
                backdropFilter: "blur(6px)",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  color: sel === ans.k ? C.gold : "#c4a86a",
                  lineHeight: 1,
                  transition: "color .25s",
                }}
              >
                {ans.sym}
              </span>
              <p
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 7.5,
                  letterSpacing: 3,
                  color: sel === ans.k ? C.gold : C.muted,
                  textTransform: "uppercase",
                  transition: "color .25s",
                }}
              >
                {ans.t}
              </p>
              <div
                style={{
                  width: 24,
                  height: 1,
                  background:
                    sel === ans.k
                      ? "rgba(154,117,53,.45)"
                      : "rgba(154,117,53,.18)",
                  transition: "background .25s",
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: C.body,
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                {ans.d}
              </p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", paddingTop: 24, flexShrink: 0 }}>
          <button
            className="btn"
            onClick={onNext}
            disabled={!sel}
            style={{
              background: sel
                ? "rgba(255,248,225,.65)"
                : "rgba(255,248,225,.3)",
              border: `1px solid ${
                sel ? "rgba(154,117,53,.5)" : "rgba(154,117,53,.18)"
              }`,
              color: sel ? C.gold : C.muted,
              padding: "12px 46px",
              fontSize: 8,
              letterSpacing: 5,
              textTransform: "uppercase",
              backdropFilter: "blur(4px)",
            }}
          >
            {num === total ? "See My Archetype" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── LOADING ─────────────────────────────────────────────*/
function Loading({ phrase }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div className="breathe" style={{ fontSize: 32, color: C.gold }}>
        ◎
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: C.gold,
              opacity: 0.5,
              animation: `pulse 1.5s ease-in-out ${i * 0.28}s infinite`,
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 7.5,
          letterSpacing: 5,
          color: C.muted,
          textTransform: "uppercase",
          minHeight: 18,
        }}
      >
        {phrase}
      </p>
    </div>
  );
}

/* ── RESULTS ─────────────────────────────────────────────*/
function Results({ r, sec, paid, name, onRestart }) {
  const firstName = name.trim().split(" ")[0];
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "56px 22px 80px" }}>
      <div className="ru d1" style={{ textAlign: "center", marginBottom: 36 }}>
        {firstName && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 15,
              fontStyle: "italic",
              color: C.muted,
              marginBottom: 16,
              fontWeight: 300,
            }}
          >
            {firstName}, here is what the map reveals.
          </p>
        )}
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 7.5,
            letterSpacing: 6,
            color: C.muted,
            textTransform: "uppercase",
            marginBottom: 22,
          }}
        >
          Your Dominant Archetype
        </p>
        <div
          className="breathe"
          style={{ fontSize: 42, color: C.gold, marginBottom: 14 }}
        >
          {r.sym}
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(20px,4vw,34px)",
            fontWeight: 600,
            letterSpacing: 4,
            color: C.ink,
            marginBottom: 10,
          }}
        >
          {r.name}
        </h1>
        <div
          style={{
            width: 40,
            height: 1,
            background: C.gold,
            margin: "0 auto 18px",
            opacity: 0.35,
          }}
        />
        <p
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 18,
            fontStyle: "italic",
            color: C.gold,
            fontWeight: 300,
            lineHeight: 1.55,
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          &ldquo;{r.tagline}&rdquo;
        </p>
      </div>

      <div className="ru d2" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 11, color: C.gold, opacity: 0.8 }}>◈</span>
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 7.5,
              letterSpacing: 4,
              color: C.gold,
              textTransform: "uppercase",
            }}
          >
            Your Unconscious Pattern
          </p>
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 7,
              color: C.goldDim,
              marginLeft: "auto",
              background: "rgba(255,248,225,.6)",
              border: `1px solid rgba(154,117,53,.2)`,
              borderRadius: 3,
              padding: "2px 8px",
              letterSpacing: 2,
            }}
          >
            FREE
          </span>
        </div>
        <p
          style={{
            fontSize: 14.5,
            lineHeight: 1.9,
            color: C.body,
            fontWeight: 300,
          }}
        >
          {r.pattern}
        </p>
      </div>

      <div style={{ height: 1, background: C.line, marginBottom: 28 }} />

      {paid ? (
        <PaidContent r={r} sec={sec} name={name} onRestart={onRestart} />
      ) : (
        <PaywallGate r={r} name={name} />
      )}
    </div>
  );
}

/* ── PAID CONTENT ────────────────────────────────────────*/
function PaidContent({ r, sec, name, onRestart }) {
  const firstName = name.trim().split(" ")[0];
  return (
    <>
      <div className="ru d3" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 11, color: C.gold, opacity: 0.8 }}>◎</span>
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 7.5,
              letterSpacing: 4,
              color: C.gold,
              textTransform: "uppercase",
            }}
          >
            Your Life-Changing Shift
          </p>
        </div>
        <p
          style={{
            fontSize: 14.5,
            lineHeight: 1.9,
            color: C.body,
            fontWeight: 300,
          }}
        >
          {r.insight}
        </p>
      </div>

      <div className="ru d4" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 11, color: C.gold, opacity: 0.8 }}>◐</span>
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 7.5,
              letterSpacing: 4,
              color: C.gold,
              textTransform: "uppercase",
            }}
          >
            Transform These Habits
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {r.habits.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: C.accent,
                borderRadius: 4,
                padding: "12px 14px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 9,
                  color: C.gold,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {i + 1}.
              </span>
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.75,
                  color: C.body,
                  fontWeight: 300,
                }}
              >
                {h}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="ru d5" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 11, color: C.gold, opacity: 0.8 }}>▸</span>
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 7.5,
              letterSpacing: 4,
              color: C.gold,
              textTransform: "uppercase",
            }}
          >
            Daily Steps to Start Now
          </p>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {[
            ["Personal Life", r.personal],
            ["Professional Life", r.professional],
          ].map(([label, steps]) => (
            <div
              key={label}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: "20px 18px",
                backdropFilter: "blur(4px)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 7,
                  letterSpacing: 3,
                  color: C.goldDim,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {label}
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {steps.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 9,
                    }}
                  >
                    <div className="step-dot" />
                    <p
                      style={{
                        fontSize: 12.5,
                        lineHeight: 1.65,
                        color: C.body,
                        fontWeight: 300,
                      }}
                    >
                      {s}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="ru d6"
        style={{
          background: C.firstStep,
          border: `1px solid rgba(154,117,53,.3)`,
          borderRadius: 6,
          padding: "22px 20px",
          marginBottom: 28,
          backdropFilter: "blur(4px)",
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 7.5,
            letterSpacing: 4,
            color: C.gold,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          ▶ {firstName ? "Your First Step, " + firstName : "Your First Step"}
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 17,
            fontStyle: "italic",
            lineHeight: 1.75,
            color: C.ink,
            fontWeight: 400,
          }}
        >
          &ldquo;{r.first}&rdquo;
        </p>
      </div>

      <div
        className="ru d7"
        style={{
          background: "rgba(255,248,228,.45)",
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: "20px",
          textAlign: "center",
          marginBottom: 40,
          backdropFilter: "blur(4px)",
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 7,
            letterSpacing: 4,
            color: C.muted,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Secondary Archetype
        </p>
        <div
          style={{
            fontSize: 16,
            color: "rgba(154,117,53,.4)",
            marginBottom: 8,
          }}
        >
          {sec.sym}
        </div>
        <p
          style={{
            fontSize: 13.5,
            color: C.body,
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          A strong secondary thread of{" "}
          <span style={{ color: C.gold, fontStyle: "italic" }}>{sec.name}</span>{" "}
          runs through your responses — adding nuance and depth to how you show
          up in situations where your primary pattern is less active.
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          className="btn"
          onClick={onRestart}
          style={{
            background: "rgba(255,248,225,.4)",
            border: `1px solid rgba(154,117,53,.28)`,
            color: C.muted,
            padding: "11px 42px",
            fontSize: 7.5,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Retake the Quiz
        </button>
      </div>
    </>
  );
}

/* ── PAYWALL ─────────────────────────────────────────────*/
function PaywallGate({ r, name }) {
  const firstName = name.trim().split(" ")[0];
  return (
    <div style={{ position: "relative" }}>
      <div className="blur-lock">
        <div style={{ marginBottom: 22 }}>
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 7.5,
              letterSpacing: 4,
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ◎ Your Life-Changing Shift
          </p>
          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.9,
              color: C.body,
              fontWeight: 300,
            }}
          >
            {r.insight}
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 22,
          }}
        >
          {["Personal Life", "Professional Life"].map((l) => (
            <div
              key={l}
              style={{
                background: C.card,
                borderRadius: 6,
                padding: "20px 18px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 7,
                  letterSpacing: 3,
                  color: C.goldDim,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {l}
              </p>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 9,
                    background: "rgba(154,117,53,.1)",
                    borderRadius: 2,
                    marginBottom: 9,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(to bottom,rgba(237,229,206,0) 0%,rgba(237,229,206,.95) 28%)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "32px 28px",
            background: "rgba(255,250,235,.88)",
            border: `1px solid rgba(154,117,53,.3)`,
            borderRadius: 10,
            maxWidth: 380,
            backdropFilter: "blur(10px)",
            boxShadow: "0 16px 48px rgba(100,70,20,.14)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: C.gold,
              marginBottom: 12,
              opacity: 0.7,
            }}
          >
            ◎
          </div>
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 8,
              letterSpacing: 4,
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {firstName
              ? `Unlock Your Guideline, ${firstName}`
              : "Unlock Your Full Guideline"}
          </p>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.75,
              color: C.body,
              fontWeight: 300,
              marginBottom: 20,
            }}
          >
            Get your complete personal roadmap — life-changing insight, habit
            transformation practices, and daily steps for both your personal and
            professional life.
          </p>
          <ul
            style={{
              textAlign: "left",
              marginBottom: 22,
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}
          >
            {[
              "Your life-changing shift & insight",
              "3 habit transformation practices",
              "4 daily steps for personal life",
              "4 daily steps for professional life",
              "Your immediate first action",
              "Secondary archetype analysis",
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12.5,
                  color: C.body,
                  fontWeight: 300,
                  listStyle: "none",
                }}
              >
                <span style={{ color: C.gold, fontSize: 10, fontWeight: 600 }}>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <button
            className="btn-pay"
            onClick={goToCheckout}
            style={{
              width: "100%",
              background: C.gold,
              border: "none",
              color: "#fff8e8",
              padding: "15px 0",
              fontFamily: "'Cinzel',serif",
              fontSize: 9,
              letterSpacing: 4,
              textTransform: "uppercase",
              borderRadius: 4,
              boxShadow: "0 6px 20px rgba(120,85,20,.25)",
            }}
          >
            Unlock for {PRICE_DISPLAY}
          </button>
          <p
            style={{
              fontSize: 11,
              color: C.muted,
              marginTop: 12,
              fontWeight: 300,
            }}
          >
            Secure payment via Stripe · Instant access
          </p>
        </div>
      </div>
    </div>
  );
}
