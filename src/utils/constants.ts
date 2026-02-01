// Cyberpunk Color Palette
export const COLORS = {
    CYBER_BLACK: 0x0a0a0f,
    CYBER_DARK: 0x12121a,
    CYBER_MUTED: 0x2a2a3a,
    NEON_CYAN: 0x00f0ff,
    NEON_MAGENTA: 0xff00aa,
    NEON_GREEN: 0x39ff14,
    NEON_ORANGE: 0xff6600,
    WHITE: 0xffffff,
} as const;

// CSS Color strings
export const CSS_COLORS = {
    CYBER_BLACK: '#0a0a0f',
    CYBER_DARK: '#12121a',
    CYBER_MUTED: '#2a2a3a',
    NEON_CYAN: '#00f0ff',
    NEON_MAGENTA: '#ff00aa',
    NEON_GREEN: '#39ff14',
    NEON_ORANGE: '#ff6600',
    WHITE: '#ffffff',
} as const;

// World Settings
export const WORLD = {
    FOG_NEAR: 50,
    FOG_FAR: 500,
    CAMERA_FOV: 60,
    CAMERA_NEAR: 0.1,
    CAMERA_FAR: 1000,
} as const;

// Movement Settings
export const MOVEMENT = {
    SPEED: 0.15,
    ROTATION_SPEED: 0.002,
    DAMPING: 0.92,
} as const;

// Section Positions in 3D World
export const SECTIONS = {
    HERO: { x: 0, y: 5, z: 0 },
    SKILLS: { x: 50, y: 8, z: -30 },
    EXPERIENCE: { x: -50, y: 6, z: -60 },
    PROJECTS: { x: 40, y: 7, z: -90 },
    ACHIEVEMENTS: { x: -40, y: 5, z: -120 },
    CONTACT: { x: 0, y: 4, z: -150 },
} as const;

// Skill Categories with colors
export const SKILL_CATEGORIES = {
    LANGUAGES: {
        color: COLORS.NEON_CYAN,
        items: ['C++', 'Python', 'Java', 'JavaScript', 'SQL'],
    },
    AI_ML: {
        color: COLORS.NEON_MAGENTA,
        items: ['NLP', 'LLM', 'RAG', 'PyTorch', 'Hugging Face', 'Computer Vision'],
    },
    WEB: {
        color: COLORS.NEON_GREEN,
        items: ['React', 'Next.js', 'FastAPI', 'Node.js'],
    },
    TOOLS: {
        color: COLORS.NEON_ORANGE,
        items: ['PostgreSQL', 'Git/GitHub', 'Agile'],
    },
} as const;

// Experience Data
export const EXPERIENCE = [
    {
        title: 'SDE Intern',
        company: 'KocharTech India',
        period: 'Jun 2025 - Present',
        projects: [
            {
                name: 'MinutesMax',
                description: 'AI Meeting Assistant with Microsoft Graph API integration',
                impact: 'Reduced unproductive meeting time by 30%',
            },
            {
                name: 'Project Awaz',
                description: 'Learning platform for Deaf & Mute employees',
                impact: '8 employees promoted to Chat Support roles',
            },
        ],
    },
] as const;

// Projects Data
export const PROJECTS = [
    {
        name: 'Handwritten Text Recognition',
        tech: ['Python', 'PyTorch', 'Hugging Face', 'ViT'],
        description: 'TrOCR fine-tuned on IAM dataset with 10,000+ samples for handwritten text recognition.',
        highlights: [
            'ViT-based encoder for image feature extraction',
            'Trained on 10,000+ handwritten samples',
            'High accuracy on cursive text',
        ],
    },
    {
        name: 'AI Snake Game Agent',
        tech: ['Python', 'PyTorch', 'DQN', 'OpenAI Gym'],
        description: 'Autonomous snake AI using Deep Q-Networks with experience replay.',
        highlights: [
            'Deep Q-Learning implementation',
            'Experience replay buffer',
            'Epsilon-greedy exploration',
        ],
    },
    {
        name: 'MinutesMax - AI Meeting Assistant',
        tech: ['Python', 'FastAPI', 'Microsoft Graph', 'NLP'],
        description: 'AI Meeting Assistant that summarizes meetings and tracks action items.',
        highlights: [
            'Microsoft Graph API integration',
            'Real-time transcription',
            '30% reduction in meeting time',
        ],
    },
    {
        name: 'Project Awaz - Accessibility Platform',
        tech: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
        description: 'Learning platform for Deaf & Mute employees with ISL support.',
        highlights: [
            'Indian Sign Language tutorials',
            '8 employees promoted',
            'Accessibility-first design',
        ],
    },
] as const;

// Achievements Data
export const ACHIEVEMENTS = [
    { icon: '🏆', title: '400+ DSA', description: 'Problems solved across platforms', year: '2024' },
    { icon: '🥉', title: '3rd Rank', description: 'Hack The Earth Hackathon', year: '2024' },
    { icon: '♟️', title: 'Chess Champion', description: 'Multiple college tournaments', year: '2023' },
    { icon: '🎓', title: "Dean's List", description: 'Top 10% academic excellence', year: '2023' },
    { icon: '💻', title: 'Open Source', description: 'Active GitHub contributor', year: '2024' },
] as const;

// Contact Info
export const CONTACT = {
    email: 'bishnoilakshay32@gmail.com',
    phone: '+91-8000752331',
    linkedin: 'linkedin.com/in/lakshay-bishnoi',
    github: 'github.com/lakshaybishnoi',
    location: 'India',
} as const;

// Personal Info
export const PROFILE = {
    name: 'LAKSHAY BISHNOI',
    tagline: 'Creative Developer | AI/ML Enthusiast | Problem Solver',
    education: 'B.Tech in Computer Science @ Lovely Professional University (2022-2026)',
    achievement: "Dean's Top 10% for academic excellence",
} as const;
