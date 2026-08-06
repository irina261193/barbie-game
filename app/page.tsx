"use client";

import { useMemo, useState } from "react";

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
  { name: "Корона мечты", icon: "👑", className: "crown" },
  { name: "Звёздная тиара", icon: "💎", className: "tiara" },
  { name: "Бант принцессы", icon: "🎀", className: "bow" },
];
const jewels = ["💖", "🌙", "⭐", "👑", "💎", "🌸"];

export default function Home() {
  const [active, setActive] = useState<GameId | null>(null);
  const [search, setSearch] = useState("");
  const [favorite, setFavorite] = useState(false);

  const visible = games.filter((g) => `${g.title} ${g.desc}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="На главную"><span className="brand-crown">♛</span><span><b>Barbie Games</b><small>princess world</small></span></a>
        <nav aria-label="Главная навигация"><a className="active" href="#top">Главная</a><a href="#games">Игры</a><a href="#games">Новинки</a><a href="#games">Избранное</a></nav>
        <label className="search"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск игр..." aria-label="Найти игру" /><span>⌕</span></label>
        <button className={`heart ${favorite ? "liked" : ""}`} onClick={() => setFavorite(!favorite)} aria-label="Избранное">♛</button>
      </header>

      <div className="showcase" id="top">
        <section className="hero">
          <div className="sparkles" aria-hidden="true">✦　✧　⋆　　　✦　　♡　✧</div>
          <h1>Мир волшебных игр</h1>
          <p>Играй, мечтай, создавай!</p>
        </section>

        <section className="games-section" id="games">
        <div className="cards">
          {visible.map((game, index) => (
            <article className="card" key={game.id} id={index === 0 ? "new" : undefined}>
              <button className="card-cover" onClick={() => setActive(game.id)} aria-label={`Открыть игру ${game.title}`}>
                <img src={game.image} alt="" />
                <span className="tag">Новинка</span>
              </button>
              <div className="card-body"><h3>{game.title}</h3><p>{game.desc}</p><button onClick={() => setActive(game.id)}><span className="gamepad">✦</span> Играть</button></div>
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
  const [dress, setDress] = useState(0);
  const [accessory, setAccessory] = useState<number | null>(null);
  const [result, setResult] = useState<"win" | "try" | null>(null);
  const targetDress = 1;
  const targetAccessory = 1;
  const checkLook = () => setResult(dress === targetDress && accessory === targetAccessory ? "win" : "try");

  return <div className="royal-game">
    <div className="royal-sky" aria-hidden="true"><span>✦</span><span>✧</span><span>⋆</span><span>✦</span></div>
    <div className="royal-head"><div className="royal-kicker">—　♛　—<small>ИГРА 01</small></div><h2>Королевский образ</h2><p>Помоги Барби собраться на Лунный бал</p></div>
    <div className="mission"><span className="mission-icon">✉</span><div><b>Приглашение из дворца</b><p>Дресс-код: <strong>лавандовое платье</strong> и <strong>сияющая тиара</strong></p></div><div className="mission-progress">{dress === targetDress ? "●" : "○"}{accessory === targetAccessory ? "●" : "○"}<small>образ</small></div></div>
    <div className="royal-layout">
      <div className="princess-frame">
        <img key={dresses[dress].image} src={dresses[dress].image} alt={`Барби в образе «${dresses[dress].name}»`} />
        {accessory !== null && <span className={`worn-accessory ${accessories[accessory].className}`}>{accessories[accessory].icon}</span>}
        <div className="look-label"><span>ТВОЙ ОБРАЗ</span><b>{dresses[dress].name}</b></div>
      </div>
      <div className="closet">
        <div className="choice-title"><span>✦</span><h3>Платье</h3><span>✦</span></div>
        <div className="dress-options">{dresses.map((d, i) => <button className={dress === i ? "selected" : ""} key={d.name} onClick={() => { setDress(i); setResult(null); }}><img src={d.image} alt="" /><span><b>{d.name}</b><small>{i === 0 ? "розовый шёлк" : i === 1 ? "лунные кристаллы" : "звёздный атлас"}</small></span><i>{dress === i ? "✓" : ""}</i></button>)}</div>
        <div className="choice-title accessories-title"><span>✦</span><h3>Аксессуар</h3><span>✦</span></div>
        <div className="accessory-options">{accessories.map((a, i) => <button className={accessory === i ? "selected" : ""} key={a.name} onClick={() => { setAccessory(i); setResult(null); }}><span>{a.icon}</span><b>{a.name}</b>{accessory === i && <i>✓</i>}</button>)}</div>
      </div>
    </div>
    {result && <div className={`royal-result ${result}`}>{result === "win" ? <><b>Идеальное попадание! ✦✦✦</b><span>Барби готова к Лунному балу</span></> : <><b>Почти готово!</b><span>Загляни в приглашение и проверь обе детали образа</span></>}</div>}
    <button className="royal-finish" onClick={checkLook}>На бал! <span>✦</span></button>
  </div>;
}

function GemsGame() {
  const initial = useMemo(() => Array.from({ length: 16 }, (_, i) => jewels[(i * 5 + 3) % jewels.length]), []);
  const [board, setBoard] = useState(initial); const [score, setScore] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [message, setMessage] = useState("Найди две одинаковые фигурки");
  const pick = (index: number) => { if (selected === null) { setSelected(index); setMessage("Теперь найди такую же"); return; } if (selected === index) { setSelected(null); return; } if (board[selected] === board[index]) { const next = [...board]; const replacements = ["💖", "🌙", "⭐", "👑", "💎", "🌸"]; next[selected] = replacements[Math.floor(Math.random() * replacements.length)]; next[index] = replacements[Math.floor(Math.random() * replacements.length)]; setBoard(next); setScore(score + 20); setMessage("Волшебная пара! +20 очков ✦"); } else setMessage("Почти! Попробуй другую пару"); setSelected(null); };
  return <div className="mini-game gems-game"><div className="game-top"><span>ИГРА 02</span><h2>Магические самоцветы</h2><p>{message}</p></div><div className="score">СЧЁТ <b>{score}</b></div><div className="jewel-board">{board.map((j, i) => <button key={i} onClick={() => pick(i)} className={selected === i ? "selected" : ""}>{j}</button>)}</div><div className="goal">Собери 100 очков, чтобы зажечь королевскую звезду {score >= 100 ? "🌟" : "☆"}</div></div>;
}

function PuppyGame() {
  const [care, setCare] = useState<string[]>([]); const actions = [{ id: "wash", label: "Искупать", icon: "🫧" }, { id: "brush", label: "Расчесать", icon: "🪮" }, { id: "bow", label: "Надеть бант", icon: "🎀" }];
  const doCare = (id: string) => !care.includes(id) && setCare([...care, id]);
  return <div className="mini-game puppy-game"><div className="game-top"><span>ИГРА 03</span><h2>Салон для щенка</h2><p>{care.length === 3 ? "Ура! Пушинка сияет от счастья!" : "Позаботься о Пушинке — выполни три шага"}</p></div><div className="pet-stage"><div className="bubbles">{care.includes("wash") && "○　◌　○　◌"}</div><div className={`puppy ${care.length === 3 ? "happy" : ""}`}>{care.includes("bow") && <span className="pet-bow">🎀</span>}🐶</div><div className="love">{"♥".repeat(care.length)}{"♡".repeat(3 - care.length)}</div></div><div className="care-actions">{actions.map((a) => <button key={a.id} className={care.includes(a.id) ? "done" : ""} onClick={() => doCare(a.id)}><span>{care.includes(a.id) ? "✓" : a.icon}</span>{a.label}</button>)}</div></div>;
}
