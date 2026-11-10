import type { Cert, Job, Quest, SideQuest, Stat, Win } from "./types";

const GH = "https://github.com/CfRadar/";

export const QUESTS: Quest[] = [
  { k: "l", r: "LEGENDARY", t: "NovaCPP", m: "Framework development | May 2026 to now",
    d: "A full-stack C++17 framework that compiles declarative UI components and REST routes into one executable. Hot reload in about 1 second over Server-Sent Events, SQLite WAL persistence, optional Redis sessions and native WinHTTP and OpenSSL transport.",
    s: "1,800+ npm downloads, 9 GitHub stars", g: ["C++17", "SSE", "SQLite WAL", "Redis", "CMake"],
    l: "https://nova-documentation.vercel.app/", n: "READ THE DOCS", c: GH + "NovaCPP" },
  { k: "e", r: "EPIC", t: "NebulaOS", m: "Team lead, full-stack | June 2026",
    d: "An operating system in your browser: an in-memory virtual file system backed by MongoDB, a POSIX-like terminal with 10 commands, a code editor, a file manager and live multiplayer cursors over Socket.IO.",
    s: "Backend owner on a 2-person team", g: ["React", "Node.js", "MongoDB", "Socket.IO"],
    l: "https://nebula-os-sable.vercel.app/", n: "OPEN THE DEMO" },
  { k: "e", r: "EPIC", t: "SmartAid", m: "Full-stack | Google Solution Challenge | Apr to May 2026",
    d: "A crisis-relief platform that ingests aid listings with SerpAPI and cron jobs, merges duplicates with a similarity heuristic and verifies users by email OTP plus JWT.",
    s: "30+ verified users on the platform", g: ["React 19", "TypeScript", "MongoDB", "SerpAPI"],
    c: GH + "GoogleSolnProject" },
  { k: "e", r: "EPIC", t: "Adaptive Traffic Signal Control", m: "Machine learning | April 2026",
    d: "A Deep Q-Network agent learns to time signals at 4-way intersections, tested across 3 traffic-density tiers inside a custom OpenEnv simulation.",
    s: "Live on Hugging Face Spaces", g: ["Python", "PyTorch", "DQN", "Docker"],
    l: "https://huggingface.co/spaces/CfRadar/TrafficLightEnv", n: "OPEN THE DEMO", c: GH + "TrafficLightRLEnvironment" },
  { k: "r", r: "RARE", t: "Y-Melodies", m: "Full-stack | May 2026",
    d: "A browser music player built on YouTube search and playback, with a persistent player that survives navigation. De-duplicated requests plus an in-memory cache cut repeat search API usage.",
    s: "90% fewer repeat API calls", g: ["YouTube API", "Caching", "React", "Node.js"],
    l: "https://y-melody.vercel.app/", n: "OPEN THE DEMO", c: GH + "Y-Melody" },
  { k: "r", r: "RARE", t: "SoulDuel", m: "Full-stack and game logic | September 2026",
    d: "A real-time multiplayer boss arena in the browser: Socket.IO state sync, a modular Null Overseer boss engine with projectile, beam and hazard managers, JWT auth, leaderboards and time trials.",
    s: "Live matches, boss phases and rankings", g: ["React 19", "Socket.IO", "Node.js", "MongoDB"],
    c: GH + "soul-frontend" },
  { k: "r", r: "RARE", t: "Minesweeper Bot", m: "Computer vision and algorithms | October 2026",
    d: "A Python bot that finds Google’s canvas Minesweeper board, reads it with OpenCV template matching, solves it with an exact constraint-satisfaction solver and computes probabilities for forced guesses.",
    s: "Covered by a Pytest suite", g: ["Python", "OpenCV", "CSP", "Pytest"], c: GH + "Minesweeper" },
  { k: "r", r: "RARE", t: "ResourceManager", m: "Backend and database | October 2026",
    d: "A lab-equipment sharing platform for universities: 7 SQL migrations, node-cron audit jobs for reminders, overdue items and no-shows, and a Python FastAPI matcher that pairs requests with labs.",
    s: "7 migrations, 5 automated audit jobs", g: ["Node.js", "Knex", "FastAPI", "SQL"], c: GH + "ResourceManager" },
];

export const SIDE_QUESTS: SideQuest[] = [
  { t: "Marketplace Keyword Agent", d: "Multi-agent SEO and deterministic title engine for Amazon, Myntra, Flipkart and Meesho listings.", g: ["FastAPI", "React", "Playwright"], l: GH + "ClothScrapper", n: "CODE" },
  { t: "PromptFlow", d: "Manifest V3 Chrome extension that runs multi-prompt image batches inside ChatGPT and auto-downloads results.", g: ["JavaScript", "MV3"], l: GH + "GPTImage", n: "CODE" },
  { t: "Tax-Loss Harvesting Dashboard", d: "Portfolio tax view with harvesting suggestions and live CoinGecko prices, built for the KoinX assessment.", g: ["React", "TypeScript", "Express"], l: GH + "KoinXAssign", n: "CODE" },
  { t: "SheetFill", d: "Fills Flipkart .xlsm listing workbooks without breaking embedded VBA macros.", g: ["Python", "FastAPI", "openpyxl"], l: GH + "SheetFill", n: "CODE" },
  { t: "Terminal Warrior", d: "Terminal game engine in C++17 with a state machine, enemy spawning and audio triggers.", g: ["C++17", "CMake"], l: GH + "Keyboard-Warrior", n: "CODE" },
  { t: "SheCanFoundation", d: "Non-profit site with scroll-driven canvas animation and responsive storytelling.", g: ["React 19", "Framer Motion"], l: GH + "SheCanFoundation-Project", n: "CODE" },
  { t: "GestureControl", d: "Hand-landmark tracking that maps gestures to keystrokes and mouse moves.", g: ["Python", "OpenCV", "MediaPipe"] },
  { t: "Interactive 3D Portfolio", d: "Three.js portfolio with shaders and a project showcase.", g: ["Three.js", "R3F"], l: "https://portfolio-taupe-eight-10.vercel.app/", n: "OPEN" },
];

export const SKILLS: Record<string, string[]> = {
  "Languages": ["C++17", "C", "Python", "TypeScript", "JavaScript", "SQL", "Bash", "HTML5/CSS3"],
  "Web": ["React 19", "Node.js", "Express", "FastAPI", "Next.js", "Tailwind CSS", "Socket.IO", "REST APIs", "JWT", "WebSockets"],
  "Systems": ["CMake", "SQLite WAL", "Redis", "OpenSSL", "WinHTTP", "SSE", "Virtual FS", "Multi-threading", "esbuild"],
  "AI and Vision": ["PyTorch", "OpenCV", "DQN", "Gymnasium", "MediaPipe", "Constraint solving", "Pandas", "NumPy"],
  "Tools": ["Git", "GitHub", "Docker", "Linux", "Postman", "Vite", "Vercel", "MongoDB", "PostgreSQL", "Pytest", "Hugging Face"],
  "Core CS": ["Data Structures", "Algorithms", "OOP", "Operating Systems", "DBMS", "Computer Networks"],
};

export const STATS: Stat[] = [
  ["DSA SOLVED", "350+", 8],
  ["NPM DOWNLOADS", "1,800+", 8],
  ["HACKATHONS LED", "8+", 8],
  ["STUDENTS TAUGHT", "80+", 6],
  ["CODEFORCES MAX", "1077", 5],
];

export const WINS: Win[] = [
  ["LeetCode & Codeforces", "350+ DSA problems solved across platforms (handle CfRadar)"],
  ["1st place, Hackquest", "April 2026, among 20+ teams"],
  ["Rank 1, CodeQuest", "DSA competition"],
  ["3rd place, CodeConquerors", "All-India hackathon by WecodeCoders"],
  ["2nd runner-up, WebSprint", "IET DAVV, Sept 2025, built in 6 hours"],
  ["2 NPTEL certificates", "Algorithms (IIT Madras), Modern C++ (IIT Kharagpur)"],
  ["Codeforces 1077 max rating", "Handle CfRadar, 9 official rounds"],
];

export const JOBS: Job[] = [
  { title: "Frontend / React Developer Intern", meta: "SpaceFit, fitness startup | Jan to May 2026",
    bullets: [
      "Built a responsive React landing page for an AI-powered fitness platform: Lighthouse 99 Performance, 96 Accessibility, 100 Best Practices, 100 SEO.",
      "Developed membership sections for 3 pricing tiers (INR 12,000 to 24,000 a year) and a 5-location roadmap through 2030.",
    ],
    link: { href: "https://spacefit-gym-qhx1.vercel.app/", label: "Open the live demo" } },
  { title: "DSA Lead and Content Lead", meta: "GDG IET DAVV | 2025 to present",
    bullets: [
      "Ran 3 algorithm practice sessions that reached more than 80 students.",
      "Led a 4-member team writing editorials, guides and practice sets for the community.",
    ] },
  { title: "Team Lead, 8+ Hackathons", meta: "Full-stack and AI demos | 24 to 48 hour builds",
    bullets: [
      "Directed technical planning, architecture and rapid implementation to ship working demos under tight deadlines.",
      "Results include 1st place at Hackquest (April 2026, 20+ teams), 3rd place at CodeConquerors, and 2nd runner-up at WebSprint (built in 6 hours).",
    ] },
];

export const CERTS: Cert[] = [
  { label: "CLASS", title: "B.Tech, Electronics and Telecommunication", meta: "IET DAVV, Indore | 2024 to 2028",
    body: "Coursework: data structures and algorithms, OOP in C++, operating systems, databases, computer networks, AI fundamentals." },
  { label: "CERTIFICATE", title: "Design and Analysis of Algorithms", meta: "NPTEL, IIT Madras | Jan to Mar 2025", id: "ID: NPTEL25CS23S439000564" },
  { label: "CERTIFICATE", title: "Programming in Modern C++", meta: "NPTEL, IIT Kharagpur | Jan to Apr 2025", id: "ID: NPTEL25CS58S347200231" },
];

export const EMAIL_ADDRESS = "anurag312006yadav@gmail.com";
export const EMAIL_SUBJECT = "Hello Anurag | Connecting from your Portfolio";
export const EMAIL_BODY = "Hi Anurag,\n\nI came across your portfolio and wanted to reach out regarding:\n\n";

export const GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}&su=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
export const MAILTO_URL = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;

export const CONTACT_LINKS: { href: string; label: string; external: boolean }[] = [
  { href: GMAIL_URL, label: "EMAIL: ANURAG312006YADAV@GMAIL.COM", external: true },
  { href: "https://leetcode.com/u/CfRadar/", label: "LEETCODE: CFRADAR", external: true },
  { href: "https://github.com/CfRadar", label: "GITHUB: CFRADAR", external: true },
  { href: "https://www.linkedin.com/in/anurag-yadav-142774338/", label: "LINKEDIN", external: true },
  { href: "https://codeforces.com/profile/CfRadar", label: "CODEFORCES: CFRADAR", external: true },
  { href: "https://nova-documentation.vercel.app/", label: "NOVACPP DOCS", external: true },
];

export const DIALOGUES: string[] = [
  "Welcome, traveller! I build C++ frameworks, full-stack apps and tiny AI agents.",
  "My flagship project NovaCPP has passed 1,800+ npm downloads on npm and GitHub!",
  "I have led 8+ hackathon teams to podium finishes and mentor 80+ students as GDG Lead.",
  "Move your mouse to walk in the autumn woods, then press START below to explore my quests!",
];

export const WELCOME = DIALOGUES[0];
