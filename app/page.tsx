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
  { name: "Зефирное облако", color: "#f64f9a", image: "/dress-up/rose-princess.png", ballImage: "/ball-rose.png" },
  { name: "Лавандовая мечта", color: "#9b72e8", image: "/dress-up/lavender-princess.png", ballImage: "/ball-lavender.png" },
  { name: "Небесный вальс", color: "#6dbcf0", image: "/dress-up/sky-princess.png", ballImage: "/ball-sky.png" },
];
const accessories = [
  { name: "Колье с сердцем", note: "розовое золото", className: "necklace" },
  { name: "Звёздная тиара", note: "лунные кристаллы", className: "tiara" },
  { name: "Жемчужное колье", note: "королевский жемчуг", className: "choker" },
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
  const chooseDress = (index: number) => {
    setDress(index);
    setResult(index === targetDress ? null : "try");
  };
  const checkLook = () => setResult(dress === targetDress && accessory === targetAccessory ? "win" : "try");

  if (result === "win") return <GameFinale image={dresses[dress].ballImage} title="Барби танцует с Кеном!" subtitle={`Барби отправилась на бал в выбранном платье «${dresses[dress].name}».`} dancing onReplay={() => { setDress(0); setAccessory(null); setResult(null); }} />;

  return <div className="royal-game">
    <div className="royal-sky" aria-hidden="true"><span>✦</span><span>✧</span><span>⋆</span><span>✦</span></div>
    <div className="royal-head"><div className="royal-kicker">—　♛　—<small>ИГРА 01</small></div><h2>Королевский образ</h2><p>Помоги Барби собраться на Лунный бал</p></div>
    <div className="mission"><span className="mission-icon">✉</span><div><b>Приглашение из дворца</b><p>Дресс-код: <strong>лавандовое платье</strong> и <strong>сияющая тиара</strong></p></div><div className="mission-progress">{dress === targetDress ? "●" : "○"}{accessory === targetAccessory ? "●" : "○"}<small>образ</small></div></div>
    <div className="royal-layout">
      <div className="princess-frame">
        <img key={dresses[dress].image} src={asset(dresses[dress].image)} alt={`Барби в образе «${dresses[dress].name}»`} />
        {accessory !== null && <span className={`worn-accessory ${accessories[accessory].className}`} aria-label={accessories[accessory].name} />}
        <div className="look-label"><span>ТВОЙ ОБРАЗ</span><b>{dresses[dress].name}</b></div>
      </div>
      <div className="closet">
        <div className="choice-title"><span>✦</span><h3>Платье</h3><span>✦</span></div>
        <div className="dress-options">{dresses.map((d, i) => <button className={dress === i ? "selected" : ""} key={d.name} onClick={() => chooseDress(i)}><img src={asset(d.image)} alt="" /><span><b>{d.name}</b><small>{i === 0 ? "розовый шёлк" : i === 1 ? "лунные кристаллы" : "звёздный атлас"}</small></span><i>{dress === i ? "✓" : ""}</i></button>)}</div>
        <div className="choice-title accessories-title"><span>✦</span><h3>Аксессуар</h3><span>✦</span></div>
        <div className="accessory-showcase">
          <img src={asset("/royal-jewelry.png")} alt="Реалистичные королевские колье и тиара" />
          {accessories.map((a, i) => <button className={accessory === i ? "selected" : ""} key={a.name} onClick={() => { setAccessory(i); setResult(null); }} aria-label={`Выбрать аксессуар «${a.name}»`} aria-pressed={accessory === i}><span>{accessory === i ? "✓ Выбрано" : a.name}</span></button>)}
        </div>
        <button className="royal-finish" onClick={checkLook}>Отправить на бал <span>✦</span></button>
      </div>
    </div>
    {result && <div className={`royal-result ${result}`}>{result === "win" ? <><b>Идеальное попадание! ✦✦✦</b><span>Барби готова к Лунному балу</span></> : <><b>Почти готово!</b><span>Загляни в приглашение и проверь обе детали образа</span></>}</div>}
  </div>;
}

function GemsGame() {
  const deck = useMemo(() => [...jewels, ...jewels].map((gem, id) => ({ gem, id })).sort((a, b) => ((a.id * 7) % 11) - ((b.id * 7) % 11)), []);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(45);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState<"ready" | "playing" | "lost">("ready");
  const [message, setMessage] = useState("Найди 6 пар за 45 секунд и сохрани все сердечки");
  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => setTime((value) => {
      if (value <= 1) { window.clearInterval(timer); setStatus("lost"); setMessage("Время закончилось!"); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [status]);
  useEffect(() => {
    if (open.length !== 2 || status !== "playing") return;
    const timer = window.setTimeout(() => {
      const [first, second] = open;
      if (deck[first].gem === deck[second].gem) {
        setMatched((items) => [...items, deck[first].gem]);
        setMessage("Волшебная пара! Звезда зажглась ✦");
      } else {
        setLives((value) => { if (value <= 1) { setStatus("lost"); setMessage("Сердечки закончились!"); return 0; } return value - 1; });
        setMessage("Не совпало — минус одно сердечко");
      }
      setOpen([]);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [open, deck, status]);
  const pick = (index: number) => {
    if (status !== "playing" || open.length === 2 || open.includes(index) || matched.includes(deck[index].gem)) return;
    setOpen((items) => [...items, index]);
    if (open.length === 1) setMoves((value) => value + 1);
  };
  const start = () => { setOpen([]); setMatched([]); setMoves(0); setTime(45); setLives(3); setStatus("playing"); setMessage("Челлендж начался — ищи пары!"); };
  if (matched.length === jewels.length) return <GameFinale image="/victory.png" title="Челлендж пройден!" subtitle={`Ты нашла все пары за ${moves} ходов. Осталось ${time} секунд и ${lives} сердечка!`} onReplay={start} />;
  return <div className="mini-game gems-game"><div className="game-top"><span>ЧЕЛЛЕНДЖ 02</span><h2>Магические самоцветы</h2><p>{message}</p></div><div className={`challenge-timer ${time <= 10 ? "danger" : ""}`}>⏱ <b>{time}</b></div><div className="challenge-lives" aria-label={`${lives} жизни`}>{[0,1,2].map(i => <i className={i < lives ? "alive" : ""} key={i}>♥</i>)}</div><div className="score">ПАРЫ <b>{matched.length}/6</b><small>{moves} ходов</small></div><div className="jewel-board memory-jewels">{deck.map((card, i) => { const shown = open.includes(i) || matched.includes(card.gem); return <button disabled={status !== "playing"} key={card.id} onClick={() => pick(i)} className={`${shown ? "revealed" : ""} ${matched.includes(card.gem) ? "matched" : ""}`}><span>✦</span><b>{card.gem}</b></button>; })}</div><div className="goal">Найди все пары до конца времени <span>{jewels.map((_, i) => <i className={i < matched.length ? "lit" : ""} key={i}>★</i>)}</span></div>{status !== "playing" && <div className="challenge-cover"><b>{status === "lost" ? "Челлендж не пройден" : "Готова к челленджу?"}</b><span>{status === "lost" ? "Попробуй ещё раз и запоминай карточки" : "45 секунд · 3 сердечка · 6 пар"}</span><button onClick={start}>{status === "lost" ? "Повторить" : "Начать челлендж"}</button></div>}</div>;
}

function PuppyGame() {
  const [care, setCare] = useState<string[]>([]);
  const [atBall, setAtBall] = useState(false);
  const actions = [
    { id: "wash", label: "Искупать", icon: "🛁", note: "Смыть всю грязь" },
    { id: "brush", label: "Расчесать", icon: "🪮", note: "Причесать шерстку" },
    { id: "dress", label: "Одеть щенка", icon: "🧥", note: "Надеть жилетку" },
  ];
  const doCare = (id: string) => {
    if (actions[care.length]?.id === id) setCare([...care, id]);
  };
  const puppyStates = ["./puppy-dirty-shaggy.png", "./puppy-clean-shaggy.png", "./puppy-clean-groomed.png", "./dog-in-jacket.png"];

  if (atBall) return <GameFinale image="/barbie-and-ken.png" title="Барби, Кен и Пушинка танцуют!" subtitle="Нарядная Пушинка оказалась на королевском балу и танцует вместе с Барби и Кеном." puppy dancing onReplay={() => { setCare([]); setAtBall(false); }} />;

  return <div className="puppy-game">
    <div className="puppy-reference-screen">
      <div className={`puppy-stage stage-${care.length}`}>
        <img src={puppyStates[care.length]} alt={care.length === 0 ? "Грязный лохматый щенок" : care.length === 1 ? "Чистый лохматый щенок" : care.length === 2 ? "Чистый причесанный щенок" : "Чистый причесанный щенок в розовой куртке"} />
        <div className="puppy-status">{care.length === 0 ? "Пушинке нужен уход" : care.length === 1 ? "Чисто! Теперь расчеши" : care.length === 2 ? "Причесано! Осталась жилетка" : "Пушинка в жилетке и готова к балу!"}</div>
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

function GameFinale({ image, title, subtitle, onReplay, puppy = false, dancing = false, lookImage, lookLabel }: { image: string; title: string; subtitle: string; onReplay: () => void; puppy?: boolean; dancing?: boolean; lookImage?: string; lookLabel?: string }) {
  return <div className={`game-finale ${dancing ? "dancing-finale" : ""}`}>
    <img className="finale-scene" src={`.${image}`} alt={title} />
    <div className="finale-shade" />
    {dancing && <div className="dance-magic" aria-hidden="true"><i>✦</i><i>♪</i><i>✧</i><i>♫</i><i>✦</i></div>}
    {puppy && <div className="finale-puppy"><img src="./dog-in-jacket.png" alt="Нарядная Пушинка в жилетке на балу" /><span>Пушинка</span></div>}
    {lookImage && <div className="finale-look"><img src={`.${lookImage}`} alt={`Выбранный образ: ${lookLabel}`} /><span>{lookLabel}</span></div>}
    <div className="finale-copy"><span>✦ ПОБЕДА ✦</span><h2>{title}</h2><p>{subtitle}</p><button onClick={onReplay}>Играть ещё раз</button></div>
  </div>;
}
