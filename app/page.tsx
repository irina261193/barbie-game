"use client";

import { useMemo, useState } from "react";

type GameId = "dress" | "gems" | "puppy";

const games = [
  { id: "dress" as const, title: "Королевский образ", desc: "Создай наряд для самого волшебного бала", image: "/games/princess-ball.png", tag: "НОВИНКА", icon: "✦" },
  { id: "gems" as const, title: "Магические самоцветы", desc: "Собирай сияющие пары и зажигай звёзды", image: "/games/magic-gems.png", tag: "ПОПУЛЯРНО", icon: "◆" },
  { id: "puppy" as const, title: "Салон для щенка", desc: "Искупай, расчеши и наряди своего друга", image: "/games/puppy-salon.png", tag: "МИЛОТА", icon: "♥" },
];

const dresses = [
  { name: "Зефирное облако", colors: ["#ff95c8", "#ffe1ef"], emoji: "👗" },
  { name: "Лавандовая мечта", colors: ["#a886e8", "#e9ddff"], emoji: "🪻" },
  { name: "Небесный вальс", colors: ["#75c8ec", "#d9f5ff"], emoji: "🦋" },
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
        <a className="brand" href="#top" aria-label="На главную"><span className="brand-crown">♛</span><span><b>DreamPlay</b><small>мир чудес</small></span></a>
        <nav aria-label="Главная навигация"><a className="active" href="#top">Главная</a><a href="#games">Игры</a><a href="#new">Новинки</a></nav>
        <label className="search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Найти игру..." aria-label="Найти игру" /></label>
        <button className={`heart ${favorite ? "liked" : ""}`} onClick={() => setFavorite(!favorite)} aria-label="Избранное">♥</button>
      </header>

      <section className="hero" id="top">
        <div className="sparkles" aria-hidden="true">✦　⋆　✧　　　✦　　⋆　✧</div>
        <span className="eyebrow">ТВОЯ ИСТОРИЯ НАЧИНАЕТСЯ ЗДЕСЬ</span>
        <h1>Мир волшебных игр</h1>
        <p>Играй, мечтай, создавай!</p>
        <div className="hero-chips"><span>✦ 3 мини-игры</span><span>♥ Без рекламы</span><span>☁ Играй в браузере</span></div>
      </section>

      <section className="games-section" id="games">
        <div className="section-heading"><div><span>ВЫБЕРИ ПРИКЛЮЧЕНИЕ</span><h2>Во что сыграем?</h2></div><p>Каждая игра — маленький мир,<br />созданный для хорошего настроения.</p></div>
        <div className="cards">
          {visible.map((game, index) => (
            <article className="card" key={game.id} id={index === 0 ? "new" : undefined}>
              <button className="card-cover" onClick={() => setActive(game.id)} aria-label={`Открыть игру ${game.title}`}>
                <img src={game.image} alt="" />
                <span className="tag">{game.tag}</span><span className="number">0{index + 1}</span>
                <span className="play-float">▶</span>
              </button>
              <div className="card-body"><div className="card-title"><span>{game.icon}</span><h3>{game.title}</h3></div><p>{game.desc}</p><button onClick={() => setActive(game.id)}>Играть <span>→</span></button></div>
            </article>
          ))}
        </div>
        {visible.length === 0 && <div className="empty">По такому запросу игр пока нет. Попробуй другое слово ✦</div>}
      </section>

      <footer><div className="footer-brand">♛ DreamPlay</div><p>Три маленьких мира — бесконечно много радости.</p><span>Сделано с ♥ и щепоткой волшебства</span></footer>
      {active && <GameModal game={active} onClose={() => setActive(null)} />}
    </main>
  );
}

function GameModal({ game, onClose }: { game: GameId; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true"><button className="close" onClick={onClose} aria-label="Закрыть">×</button>{game === "dress" ? <DressGame /> : game === "gems" ? <GemsGame /> : <PuppyGame />}</section></div>;
}

function DressGame() {
  const [dress, setDress] = useState(0); const [crown, setCrown] = useState(false); const [done, setDone] = useState(false);
  return <div className="mini-game dress-game"><div className="game-top"><span>ИГРА 01</span><h2>Королевский образ</h2><p>Выбери платье и волшебный аксессуар</p></div><div className="dress-stage"><div className="avatar"><span className={`avatar-crown ${crown ? "show" : ""}`}>♛</span><span className="face">👩🏻</span><span className="big-dress" style={{ background: `linear-gradient(135deg,${dresses[dress].colors[0]},${dresses[dress].colors[1]})` }}>✦</span></div><div className="wardrobe"><h3>Платье</h3>{dresses.map((d, i) => <button className={dress === i ? "selected" : ""} key={d.name} onClick={() => { setDress(i); setDone(false); }}><span style={{ background: d.colors[0] }}>{d.emoji}</span>{d.name}</button>)}<h3>Аксессуар</h3><button className={crown ? "selected" : ""} onClick={() => { setCrown(!crown); setDone(false); }}><span>👑</span>Корона мечты</button><button className="finish" onClick={() => setDone(true)}>Готово! ✦</button></div></div>{done && <div className="result">Великолепно! Ты готова к королевскому балу ♛</div>}</div>;
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
