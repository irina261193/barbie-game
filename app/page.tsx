"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export const dynamic = "force-static";

type GameId = "dress" | "gems" | "puppy";

const games = [
  { id: "dress" as const, title: "Королевский образ", desc: "Создай наряд для самого волшебного бала", image: "/games/princess-ball.png", tag: "НОВИНКА", icon: "✦" },
  { id: "gems" as const, title: "Магические самоцветы", desc: "Собирай сияющие пары и зажигай звёзды", image: "/games/magic-gems.png", tag: "ПОПУЛЯРНО", icon: "◆" },
  { id: "puppy" as const, title: "Салон для щенка", desc: "Искупай, расчеши и наряди своего друга", image: "/games/puppy-salon.png", tag: "МИЛОТА", icon: "♥" },
];

const dresses = [
  { name: "Зефирное облако", color: "#f64f9a", image: "/dress-up/rose-princess.png" },
  { name: "Лавандовая мечта", color: "#9b72e8", image: "/dress-up/lavender-princess.png" },
  { name: "Небесный вальс", color: "#6dbcf0", image: "/dress-up/sky-princess.png" },
];
const accessories = [
  { name: "Корона мечты", note: "золотое сияние", icon: "👑", className: "crown" },
  { name: "Звёздная тиара", note: "лунные кристаллы", icon: "💎", className: "tiara" },
  { name: "Бант принцессы", note: "розовый шёлк", icon: "🎀", className: "bow" },
];
const jewels = ["💖", "🌙", "⭐", "👑", "💎", "🌸"];

export default function Home() {
  const asset = (path: string) => `.${path}`;
  const [active, setActive] = useState<GameId | null>(null);
  const [search, setSearch] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const music = new Audio(new URL("./shimmer-loop.mp3", window.location.href).href);
    music.loop = true;
    music.volume = 0.28;
    musicRef.current = music;
    const startMusic = () => void music.play().then(() => setMusicOn(true)).catch(() => undefined);
    window.addEventListener("pointerdown", startMusic, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startMusic);
      music.pause();
      musicRef.current = null;
    };
  }, []);

  const visible = games.filter((g) => `${g.title} ${g.desc}`.toLowerCase().includes(search.toLowerCase()));
  const openGame = (id: GameId) => {
    const click = new Audio(new URL("./button-click-short-gentle-close.mp3", window.location.href).href);
    click.volume = 0.65;
    void click.play().catch(() => undefined);
    setActive(id);
  };
  const toggleMusic = () => {
    const music = musicRef.current;
    if (!music) return;
    if (music.paused) void music.play().then(() => setMusicOn(true)).catch(() => undefined);
    else { music.pause(); setMusicOn(false); }
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="На главную"><span className="brand-crown">♛</span><span><b>Barbie Games</b><small>princess world</small></span></a>
        <nav aria-label="Главная навигация"><a className="active" href="#top">Главная</a><a href="#games">Игры</a><a href="#games">Новинки</a><a href="#games">Избранное</a></nav>
        <label className="search"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск игр..." aria-label="Найти игру" /><span>⌕</span></label>
        <button className="music-toggle" onClick={toggleMusic} aria-label={musicOn ? "Выключить музыку" : "Включить музыку"} aria-pressed={musicOn}>{musicOn ? "♪" : "♩"}</button>
        <button className={`heart ${favorite ? "liked" : ""}`} onClick={() => setFavorite(!favorite)} aria-label="Избранное">♛</button>
      </header>

      <div className="showcase" id="top" style={{ backgroundImage: `url('${asset("/hero-castle-v2.png")}')` }}>
        <section className="hero">
          <div className="sparkles" aria-hidden="true">✦　✧　⋆　　　✦　　♡　✧</div>
          <h1>Мир волшебных игр</h1>
          <p>Играй, мечтай, создавай!</p>
        </section>

        <section className="games-section" id="games">
        <div className="cards">
          {visible.map((game, index) => (
            <article className="card" key={game.id} id={index === 0 ? "new" : undefined}>
              <button className={`card-cover card-cover-${game.id}`} onClick={() => openGame(game.id)} aria-label={`Открыть игру ${game.title}`}>
                <img src={asset(game.image)} alt={`Аватар игры «${game.title}»`} />
                <span className="tag">Новинка</span>
              </button>
              <div className="card-body"><h3>{game.title}</h3><p>{game.desc}</p><button onClick={() => openGame(game.id)}><span className="gamepad">✦</span> Играть</button></div>
            </article>
          ))}
        </div>
        {visible.length === 0 && <div className="empty">По такому запросу игр пока нет. Попробуй другое слово ✦</div>}
        </section>
      </div>

      <footer><div className="footer-brand">♛ DreamPlay</div><p>Три маленьких мира — бесконечно много радости.</p><span>Сделано с ♥ и щепоткой волшебства</span></footer>
      {active && <GameModal game={active} onClose={() => setActive(null)} />}
    </main>
  );
}

function GameModal({ game, onClose }: { game: GameId; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true"><button className="close" onClick={onClose} aria-label="Закрыть">×</button>{game === "dress" ? <DressGame /> : game === "gems" ? <GemsGame /> : <PuppyGame />}</section></div>;
}

function DressGame() {
  const asset = (path: string) => `.${path}`;
  const [dress, setDress] = useState(0);
  const [accessory, setAccessory] = useState<number | null>(null);
  const [result, setResult] = useState<"win" | "try" | null>(null);
  const targetDress = 1;
  const targetAccessory = 1;
  const checkLook = () => setResult("win");

  if (result === "win") return <GameFinale image="/barbie-and-ken.png" lookImage={dresses[dress].image} lookLabel={dresses[dress].name} title="Барби танцует с Кеном!" subtitle={`Барби отправилась на бал в выбранном платье «${dresses[dress].name}».`} onReplay={() => { setDress(0); setAccessory(null); setResult(null); }} />;

  return <div className="royal-game">
    <div className="royal-sky" aria-hidden="true"><span>✦</span><span>✧</span><span>⋆</span><span>✦</span></div>
    <div className="royal-head"><div className="royal-kicker">—　♛　—<small>ИГРА 01</small></div><h2>Королевский образ</h2><p>Помоги Барби собраться на Лунный бал</p></div>
    <div className="mission"><span className="mission-icon">✉</span><div><b>Приглашение из дворца</b><p>Дресс-код: <strong>лавандовое платье</strong> и <strong>сияющая тиара</strong></p></div><div className="mission-progress">{dress === targetDress ? "●" : "○"}{accessory === targetAccessory ? "●" : "○"}<small>образ</small></div></div>
    <div className="royal-layout">
      <div className="princess-frame">
        <img key={dresses[dress].image} src={asset(dresses[dress].image)} alt={`Барби в образе «${dresses[dress].name}»`} />
        {accessory !== null && <span className={`worn-accessory ${accessories[accessory].className}`}>{accessories[accessory].icon}</span>}
        <div className="look-label"><span>ТВОЙ ОБРАЗ</span><b>{dresses[dress].name}</b></div>
      </div>
      <div className="closet">
        <div className="choice-title"><span>✦</span><h3>Платье</h3><span>✦</span></div>
        <div className="dress-options">{dresses.map((d, i) => <button className={dress === i ? "selected" : ""} key={d.name} onClick={() => { setDress(i); setResult(null); }}><img src={asset(d.image)} alt="" /><span><b>{d.name}</b><small>{i === 0 ? "розовый шёлк" : i === 1 ? "лунные кристаллы" : "звёздный атлас"}</small></span><i>{dress === i ? "✓" : ""}</i></button>)}</div>
        <div className="choice-title accessories-title"><span>✦</span><h3>Аксессуар</h3><span>✦</span></div>
        <div className="accessory-options">{accessories.map((a, i) => <button className={`${accessory === i ? "selected" : ""} accessory-${a.className}`} key={a.name} onClick={() => { setAccessory(i); setResult(null); }}><span className="accessory-gem">{a.icon}</span><span className="accessory-copy"><b>{a.name}</b><small>{a.note}</small></span>{accessory === i && <i>✓</i>}</button>)}</div>
      </div>
    </div>
    {result && <div className={`royal-result ${result}`}>{result === "win" ? <><b>Идеальное попадание! ✦✦✦</b><span>Барби готова к Лунному балу</span></> : <><b>Почти готово!</b><span>Загляни в приглашение и проверь обе детали образа</span></>}</div>}
    <button className="royal-finish" onClick={checkLook}>Отправить на бал <span>✦</span></button>
  </div>;
}

function GemsGame() {
  const initial = useMemo(() => Array.from({ length: 16 }, (_, i) => jewels[(i * 5 + 3) % jewels.length]), []);
  const [board, setBoard] = useState(initial); const [score, setScore] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [message, setMessage] = useState("Найди две одинаковые фигурки");
  const pick = (index: number) => { if (selected === null) { setSelected(index); setMessage("Теперь найди такую же"); return; } if (selected === index) { setSelected(null); return; } if (board[selected] === board[index]) { const next = [...board]; const replacements = ["💖", "🌙", "⭐", "👑", "💎", "🌸"]; next[selected] = replacements[Math.floor(Math.random() * replacements.length)]; next[index] = replacements[Math.floor(Math.random() * replacements.length)]; setBoard(next); setScore(score + 20); setMessage("Волшебная пара! +20 очков ✦"); } else setMessage("Почти! Попробуй другую пару"); setSelected(null); };
  if (score >= 100) return <GameFinale image="/victory.png" title="Победа!" subtitle="Ты собрала 100 очков и зажгла королевскую звезду!" onReplay={() => { setBoard(initial); setScore(0); setSelected(null); setMessage("Найди две одинаковые фигурки"); }} />;
  return <div className="mini-game gems-game"><div className="game-top"><span>ИГРА 02</span><h2>Магические самоцветы</h2><p>{message}</p></div><div className="score">СЧЁТ <b>{score}</b></div><div className="jewel-board">{board.map((j, i) => <button key={i} onClick={() => pick(i)} className={selected === i ? "selected" : ""}>{j}</button>)}</div><div className="goal">Собери 100 очков, чтобы зажечь королевскую звезду {score >= 100 ? "🌟" : "☆"}</div></div>;
}

function PuppyGame() {
  const [care, setCare] = useState<string[]>([]);
  const [atBall, setAtBall] = useState(false);
  const actions = [
    { id: "wash", label: "Искупать", icon: "🛁", note: "Смыть всю грязь" },
    { id: "brush", label: "Расчесать", icon: "🪮", note: "Причесать шерстку" },
    { id: "bow", label: "Надеть бант", icon: "🎀", note: "Нарядить на бал" },
  ];
  const doCare = (id: string) => {
    if (actions[care.length]?.id === id) setCare([...care, id]);
  };

  if (atBall) return <GameFinale image="/barbie-and-ken.png" title="Пушинка на королевском балу!" subtitle="За 100 очков нарядная Пушинка отправилась на бал вместе с Барби и Кеном." puppy onReplay={() => { setCare([]); setAtBall(false); }} />;

  return <div className="puppy-game">
    <div className="puppy-reference-screen">
      <div className={`puppy-stage stage-${care.length}`}>
        <img src={care.length === 0 ? "./a-dirty-dog.png" : care.length < 3 ? "./games/puppy-salon.png" : "./a-dog.png"} alt={care.length === 0 ? "Грязный лохматый щенок" : care.length === 1 ? "Чистый щенок" : care.length === 2 ? "Чистый причесанный щенок" : "Чистый причесанный щенок с бантом"} />
        <div className="puppy-status">{care.length === 0 ? "Пушинке нужен уход" : care.length === 1 ? "Чисто! Теперь расчеши" : care.length === 2 ? "Причесано! Остался бант" : "Пушинка готова к балу!"}</div>
      </div>
      <div className="puppy-score">СЧЁТ <b>{care.length * 30}</b></div>
      <div className="puppy-actions">
        {actions.map((action, index) => <button key={action.id} disabled={index !== care.length} className={`${care.includes(action.id) ? "done" : ""} ${index === care.length ? "current" : ""}`} onClick={() => doCare(action.id)} aria-label={`${action.label}, +30 очков`} aria-pressed={care.includes(action.id)}>
          <span className="puppy-action-icon">{action.icon}</span><b>{care.includes(action.id) ? "Выполнено ✓" : action.label}</b><small>{care.includes(action.id) ? "+30 очков" : action.note}</small>
        </button>)}
      </div>
      {care.length === 3 && <button className="puppy-ball-button" onClick={() => setAtBall(true)}>На бал! <span>+10</span></button>}
      <p className={`puppy-complete ${care.length === 3 ? "show" : ""}`} aria-live="polite">Пушинка готова! ✨</p>
    </div>
  </div>;
}

function GameFinale({ image, title, subtitle, onReplay, puppy = false, lookImage, lookLabel }: { image: string; title: string; subtitle: string; onReplay: () => void; puppy?: boolean; lookImage?: string; lookLabel?: string }) {
  return <div className="game-finale">
    <img className="finale-scene" src={`.${image}`} alt={title} />
    <div className="finale-shade" />
    {puppy && <div className="finale-puppy"><img src="./a-dog.png" alt="Нарядная Пушинка на балу" /><span>Пушинка</span></div>}
    {lookImage && <div className="finale-look"><img src={`.${lookImage}`} alt={`Выбранный образ: ${lookLabel}`} /><span>{lookLabel}</span></div>}
    <div className="finale-copy"><span>✦ ПОБЕДА ✦</span><h2>{title}</h2><p>{subtitle}</p><button onClick={onReplay}>Играть ещё раз</button></div>
  </div>;
}
