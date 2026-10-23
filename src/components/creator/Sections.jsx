/**
 * Sections — 3D-creator template layout, monochrome minimal skin.
 * Order: Hero → Marquee → About → Loadout (services) → Projects → Contact footer.
 */
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { FadeIn, Magnet, Tilt, Extrude, AnimatedText, ContactButton, GhostButton } from './primitives';
import { HeroEmblem, ShieldIcon, GamepadIcon, LockIcon, KeycapIcon } from './CyberArt';

const EMAIL = 'mailto:aasimkhan910@gmail.com';

/* ─────────────── Hero ─────────────── */

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export function HeroSection() {
  return (
    <section id="hero" className="relative h-screen flex flex-col overflow-x-clip">
      <FadeIn as="nav" delay={0} y={-20} className="relative z-20 flex justify-between px-6 md:px-10 pt-6 md:pt-8" aria-label="Primary">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="creator-nav-link text-sm md:text-lg lg:text-[1.4rem]">
            {n.label}
          </a>
        ))}
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading heading-3d w-full text-center font-black uppercase tracking-tight leading-none whitespace-nowrap text-[13vw] sm:text-[14vw] md:text-[15vw] lg:text-[16.2vw] mt-6 sm:mt-4 md:-mt-5"
        >
          Hi, i&apos;m aasim
        </FadeIn>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-6 z-10 w-[260px] sm:w-[330px] md:w-[400px] lg:w-[500px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3}>
            <HeroEmblem />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 gap-4">
        <FadeIn delay={0.35} y={20} className="flex flex-col gap-3">
          <p className="hud-line hidden sm:block">
            STATUS: <span className="text-fg">LEARNING</span>
            <span className="opacity-40 mx-2">|</span>
            LOC: <span className="text-fg">KATHMANDU, NP</span>
          </p>
          <p
            className="text-fg font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[280px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            a cybersecurity student &amp; game dev building secure, playable things
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────── Marquee (skill "item cards") ─────────────── */

const ROW_1 = [
  ['Ethical Hacking', 'SEC', '⌖'],
  ['Network Security', 'SEC', '⛨'],
  ['Burp Suite', 'SEC', '⚡'],
  ['Python', 'LANG', '◆'],
  ['JavaScript', 'LANG', '{}'],
  ['HTML / CSS', 'LANG', '</>'],
  ['Git', 'TOOL', '⑂'],
  ['VS Code', 'TOOL', '▣'],
  ['Unity', 'GAME', '◈'],
  ['C#', 'GAME', '#'],
];
const ROW_2 = [
  ['React', 'WEB', '⚛'],
  ['Node.js', 'WEB', '⬢'],
  ['MongoDB', 'WEB', '◐'],
  ['Express', 'WEB', 'ex'],
  ['MERN Stack', 'WEB', '≡'],
  ['PHP', 'LANG', 'php'],
  ['MySQL', 'WEB', '▤'],
  ['A* Pathfinding', 'GAME', '✦'],
  ['Ant Colony Opt.', 'GAME', '⁂'],
];

function ItemCard({ name, cls, glyph }) {
  return (
    <Tilt max={16} perspective={700} glare className="item-card">
      <span className="item-card__class">[{cls}]</span>
      <span className="item-card__glyph" aria-hidden="true">{glyph}</span>
      <span className="item-card__name">{name}</span>
    </Tilt>
  );
}

export function MarqueeSection() {
  const sectionRef = useRef(null);
  const row1 = useRef(null);
  const row2 = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const offset = (window.scrollY - s.offsetTop + window.innerHeight) * 0.3;
      if (row1.current) row1.current.style.transform = `translateX(${offset - 200}px)`;
      if (row2.current) row2.current.style.transform = `translateX(${-(offset - 200)}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tripled = (arr) => [...arr, ...arr, ...arr];

  return (
    <section ref={sectionRef} className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden" aria-label="Skills inventory">
      <p className="hud-line text-center mb-6">// INVENTORY — skills &amp; tools equipped</p>
      <div className="marquee-belt flex flex-col gap-3">
        <div ref={row1} className="flex gap-3 w-max" style={{ willChange: 'transform', marginLeft: '-100vw' }}>
          {tripled(ROW_1).map(([n, c, g], i) => <ItemCard key={i} name={n} cls={c} glyph={g} />)}
        </div>
        <div ref={row2} className="flex gap-3 w-max" style={{ willChange: 'transform', marginLeft: '-60vw' }}>
          {tripled(ROW_2).map(([n, c, g], i) => <ItemCard key={i} name={n} cls={c} glyph={g} />)}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── About ─────────────── */

const BIO =
  "I'm a Computer Science student at Herald College Kathmandu, passionate about programming and cybersecurity. I build web apps with the MERN stack and Python, make games in Unity, and spend my free time exploring ethical hacking and network security. Let's build something secure together!";

export function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-x-clip">
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[100px] sm:w-[140px] md:w-[190px] float-a">
        <Tilt global max={50} perspective={600}><Extrude><ShieldIcon className="w-full h-auto" /></Extrude></Tilt>
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[90px] sm:w-[120px] md:w-[160px] float-b">
        <Tilt global max={50} perspective={600}><Extrude><KeycapIcon className="w-full h-auto" /></Extrude></Tilt>
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] float-b">
        <Tilt global max={50} perspective={600}><Extrude><GamepadIcon className="w-full h-auto" /></Extrude></Tilt>
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[90px] sm:w-[120px] md:w-[160px] float-a">
        <Tilt global max={50} perspective={600}><Extrude><LockIcon className="w-full h-auto" /></Extrude></Tilt>
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn as="h2" delay={0} y={40} className="hero-heading heading-3d font-black uppercase leading-none tracking-tight text-center section-title">
            About me
          </FadeIn>
          <AnimatedText
            text={BIO}
            className="text-fg font-medium text-center leading-relaxed max-w-[560px]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>
        <ContactButton />
      </div>
    </section>
  );
}

/* ─────────────── Loadout (services) ─────────────── */

const LOADOUT = [
  ['Ethical Hacking', 'Learning offensive security the right way — recon, web app testing with Burp Suite, and understanding how attacks work so systems can be defended.'],
  ['Network Security', 'Exploring how networks are built, monitored, and hardened, with a focus on spotting weaknesses before someone else does.'],
  ['Full-Stack MERN', 'Building web applications end to end with MongoDB, Express, React, and Node.js — from APIs and databases to responsive interfaces.'],
  ['Game Development', 'Creating Unity games in C#, from atmospheric 3D exploration to AI-driven simulations using A* pathfinding and Ant Colony Optimisation.'],
  ['Python & Scripting', 'Writing Python for automation, tooling, and problem solving — the everyday glue for both security work and development.'],
];

export function LoadoutSection() {
  return (
    <section id="skills" className="loadout rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <FadeIn as="h2" className="heading-3d heading-3d--light text-[#0B0B0B] font-black uppercase text-center leading-none section-title mb-4">
        Loadout
      </FadeIn>
      <p className="hud-line hud-line--dark text-center mb-16 sm:mb-20 md:mb-28">// what i bring to the party</p>

      <div className="max-w-5xl mx-auto">
        {LOADOUT.map(([name, desc], i) => (
          <FadeIn
            key={name}
            delay={i * 0.1}
            className="loadout__item flex items-start gap-6 sm:gap-10 py-8 sm:py-10 md:py-12"
          >
            <span className="loadout__num heading-3d--light font-black leading-none">0{i + 1}</span>
            <div className="flex flex-col gap-2 sm:gap-3 pt-2">
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{name}</h3>
              <p className="font-light leading-relaxed max-w-2xl opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                {desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ─────────────── Projects (sticky stacking cards) ─────────────── */

const PROJECTS = [
  {
    name: 'Weather App',
    category: 'Full-Stack',
    href: 'https://github.com/aasimk910/weather-app',
    repo: 'weather-app',
    description: 'Live weather data via API with search history stored in MySQL.',
    tags: ['JavaScript', 'PHP', 'HTML/CSS', 'MySQL'],
    glyph: '☁',
  },
  {
    name: 'Purano Bhudimau',
    category: 'Unity · Horror',
    href: 'https://github.com/aasimk910/Purano_Bhudimau',
    repo: 'Purano_Bhudimau',
    description: 'A 3D horror/exploration game set in a Nepali village, with scripted events and atmospheric design.',
    tags: ['Unity', 'C#', 'Game Dev', '3D'],
    glyph: '☠',
  },
  {
    name: 'Customer Pickup',
    category: 'Unity · AI',
    href: 'https://github.com/aasimk910/A-customer-pickup-game',
    repo: 'A-customer-pickup-game',
    description: 'Delivery simulation using A* pathfinding and Ant Colony Optimisation for intelligent NPC routing.',
    tags: ['Unity', 'C#', 'A*', 'ACO'],
    glyph: '✦',
  },
  {
    name: 'Travel Buddy',
    category: 'MERN',
    href: 'https://github.com/aasimk910/Travel-Buddy',
    repo: 'Travel-Buddy',
    description: 'Discover destinations, plan itineraries, and connect with fellow travellers.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    glyph: '✈',
  },
];

function ProjectCard({ project, index, total, progress }) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const shouldReduce = useReducedMotion();
  const rotateX = useTransform(progress, [index / total, 1], [0, shouldReduce ? 0 : -(total - 1 - index) * 5]);

  return (
    <div className="h-[75vh] sm:h-[85vh] flex items-start justify-center sticky top-20 sm:top-24 md:top-32">
      <motion.article
        className="project-card w-full max-w-6xl p-4 sm:p-6 md:p-8 flex flex-col gap-5 sm:gap-6"
        style={{ scale, rotateX, transformPerspective: 1400, top: `${index * 28}px`, position: 'relative', transformOrigin: 'top center' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 110px)' }}>
              0{index + 1}
            </span>
            <div className="flex flex-col gap-1">
              <span className="hud-line">[{project.category}]</span>
              <h3 className="text-fg font-medium uppercase" style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2.2rem)' }}>{project.name}</h3>
            </div>
          </div>
          <GhostButton href={project.href} label="View Code" aria-label={`View ${project.name} on GitHub`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="project-panel p-5 sm:p-6 flex flex-col justify-between" style={{ minHeight: 'clamp(130px, 16vw, 230px)' }}>
              <p className="text-fg/80 font-light leading-relaxed" style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)' }}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map((t) => <span key={t} className="tag-chip">{t}</span>)}
              </div>
            </div>
            <div className="project-panel project-terminal p-5 sm:p-6 hidden sm:block" style={{ minHeight: 'clamp(160px, 22vw, 340px)' }}>
              <p><span className="text-fg">aasim@kali</span>:~$ git clone \</p>
              <p className="pl-4 opacity-70 break-all">github.com/aasimk910/{project.repo}</p>
              <p className="opacity-50 mt-2">Cloning into &apos;{project.repo}&apos;...</p>
              <p className="opacity-50">Receiving objects: 100% done.</p>
              <p className="mt-2"><span className="text-fg">aasim@kali</span>:~$ <span className="cursor-blink">█</span></p>
            </div>
          </div>
          <Tilt max={14} perspective={900} glare className="project-panel project-art flex items-center justify-center" aria-hidden="true">
            <span className="project-art__glyph">{project.glyph}</span>
            <span className="project-art__label">{project.repo}.exe</span>
          </Tilt>
        </div>
      </motion.article>
    </div>
  );
}

export function ProjectsSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section id="projects" className="projects-section relative z-10 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-4 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-10">
      <FadeIn as="h2" y={40} className="hero-heading heading-3d font-black uppercase leading-none tracking-tight text-center section-title">
        Projects
      </FadeIn>
      <p className="hud-line text-center mt-4">// quests completed</p>

      <div ref={ref} className="mt-10 sm:mt-16">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>

      <div className="relative z-10 flex justify-center mt-24 sm:mt-32">
        <GhostButton href="https://github.com/aasimk910?tab=repositories" label="All Repositories" />
      </div>
    </section>
  );
}

/* ─────────────── Contact footer ─────────────── */

const SOCIALS = [
  ['GitHub', 'https://github.com/aasimk910'],
  ['LinkedIn', 'https://www.linkedin.com/in/aasim-khan-a92756168/'],
  ['Instagram', 'https://www.instagram.com/_.aasimkhan/'],
  ['Twitter / X', 'https://x.com/Aasim____khan'],
  ['Facebook', 'https://www.facebook.com/aasimk910'],
  ['Discord', 'https://discord.gg/h6MEbkp7Nw'],
];

export function ContactSection() {
  return (
    <footer id="contact" className="flex flex-col items-center text-center gap-8 px-6 pt-20 pb-28 md:pt-28 md:pb-32">
      <p className="hud-line">// player 2 ready?</p>
      <FadeIn as="h2" y={40} className="hero-heading heading-3d font-black uppercase leading-none tracking-tight section-title">
        Let&apos;s talk
      </FadeIn>
      <FadeIn delay={0.15}>
        <a href={EMAIL} className="text-fg font-light hover:opacity-60 transition-opacity" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
          aasimkhan910@gmail.com
        </a>
      </FadeIn>
      <FadeIn delay={0.25}>
        <ContactButton href={EMAIL} label="Send a Message" />
      </FadeIn>
      <FadeIn delay={0.35} as="ul" className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4">
        {SOCIALS.map(([label, href]) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" className="creator-nav-link text-sm sm:text-base">
              {label}
            </a>
          </li>
        ))}
      </FadeIn>
      <p className="hud-line mt-8">© {new Date().getFullYear()} Aasim Khan · Hack ethically · GG</p>
    </footer>
  );
}
