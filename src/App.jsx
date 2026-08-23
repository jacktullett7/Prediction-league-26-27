import { useState } from "react";
import { Trophy, Calendar, Zap, Target, Square, Users, MessageSquare } from "lucide-react";
import data from "./data.js";

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d + (d.length === 10 ? "T00:00" : ""));
  if (isNaN(date)) return d;
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function fmtDeadline(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function daysUntil(d) {
  const date = new Date(d);
  if (isNaN(date)) return null;
  return Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
}

export default function App() {
  const [openScorer, setOpenScorer] = useState(null);
  const [openCard, setOpenCard] = useState(null);
  const [openBonus, setOpenBonus] = useState(null);
  const [openWildcard, setOpenWildcard] = useState(null);

  const players = [...data.players].sort((a, b) => a.name.localeCompare(b.name));
  const standings = [...data.players].sort((a, b) => b.points - a.points);
  const playerName = (id) => data.players.find((p) => p.id === id)?.name || "—";

  return (
    <div style={{ minHeight: "100vh", background: "var(--chalk)", fontFamily: "Inter, sans-serif", color: "var(--ink)", paddingBottom: 64 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@500;700&display=swap');
        :root {
          --navy: #182B49;
          --amber: #D97B2B;
          --chalk: #F5F3EE;
          --ink: #1B1E24;
          --card: #F0C93B;
          --line: #DCD8CC;
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        .disp { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; }
        .mono { font-family: 'Roboto Mono', monospace; }
        .eyebrow { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #6b6a5e; }
        select { font-family: 'Inter', sans-serif; border: 1px solid var(--line); border-radius: 6px; padding: 8px 10px; background: #fff; font-size: 14px; }
        select:focus { outline: 2px solid var(--amber); outline-offset: 1px; }
        .row-line + .row-line { border-top: 1px solid var(--line); }
        @media (prefers-reduced-motion: no-preference) {
          .fade-in { animation: fadeIn 0.4s ease both; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "var(--navy)", color: "#F6F4EC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 20px 0" }}>
          <h1 className="disp" style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{data.leagueName}</h1>
        </div>

        {/* SCOREBOARD HERO */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 28px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center",
            background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "22px 24px"
          }}>
            <div>
              <div className="eyebrow" style={{ color: "#C7CEDA" }}>Gameweek</div>
              <div className="mono" style={{ fontSize: 56, fontWeight: 700, color: "var(--card)", lineHeight: 1 }}>
                {String(data.gameweek.number).padStart(2, "0")}
              </div>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.15)", paddingLeft: 24 }}>
              <div className="eyebrow" style={{ color: "#C7CEDA" }}>Picks deadline</div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>{data.gameweek.deadline ? fmtDeadline(data.gameweek.deadline) : "TBC"}</div>
              {data.gameweek.deadline && daysUntil(data.gameweek.deadline) !== null && (
                <div style={{ fontSize: 13, color: "#C7CEDA", marginTop: 2 }}>
                  {daysUntil(data.gameweek.deadline) > 0
                    ? `${daysUntil(data.gameweek.deadline)} day${daysUntil(data.gameweek.deadline) === 1 ? "" : "s"} to go`
                    : daysUntil(data.gameweek.deadline) === 0 ? "Today" : "Deadline passed"}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>

        {/* PREDICTIONS OF THE WEEK */}
        {data.predictionsOfWeek && data.predictionsOfWeek.length > 0 && (
          <section style={{ marginTop: 28, background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 18px" }} className="fade-in">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <MessageSquare size={15} color="var(--amber)" />
              <h2 className="disp" style={{ fontSize: 14, margin: 0 }}>Predictions of the week</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {data.predictionsOfWeek.map((p) => (
                <div key={p.id} className="row-line" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>{playerName(p.playerId)}</span>
                  <span className="mono" style={{ fontSize: 13.5, color: "var(--amber)", fontWeight: 700 }}>{p.prediction}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TABLE + TOP SCORER */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 28 }} className="fade-in">
          <section style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
              <Trophy size={16} color="var(--amber)" />
              <h2 className="disp" style={{ fontSize: 15, margin: 0 }}>League table</h2>
            </div>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 70px", padding: "8px 18px", fontSize: 11 }} className="eyebrow">
                <span>Pos</span><span>Player</span><span style={{ textAlign: "right" }}>Pts</span>
              </div>
              {standings.map((p, i) => {
                const pos = i + 1;
                const total = standings.length;
                const isPrize = pos <= 5;
                const isRelegation = pos > total - 3;
                const posColor = isRelegation ? "#C23B3B" : isPrize ? "var(--amber)" : "#8a897c";
                return (
                  <div key={p.id} className="row-line" style={{ display: "grid", gridTemplateColumns: "40px 1fr 70px", alignItems: "center", padding: "10px 18px", gap: 8 }}>
                    <span className="mono" style={{ fontWeight: 700, color: posColor }}>{pos}</span>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                    <span className="mono" style={{ textAlign: "right", fontWeight: 700 }}>{p.points}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section style={{ background: "var(--navy)", color: "#fff", borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 200 }}>
              <Zap size={16} color="var(--card)" />
              <h2 className="disp" style={{ fontSize: 14, margin: 0 }}>Top scorer, last week</h2>
            </div>
            {data.topScorer.playerId ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <div className="disp" style={{ fontSize: 28, fontWeight: 700 }}>{playerName(data.topScorer.playerId)}</div>
                <div className="mono" style={{ fontSize: 15, color: "var(--card)" }}>{data.topScorer.points} pts · GW{data.topScorer.week}</div>
              </div>
            ) : (
              <div style={{ fontSize: 14, color: "#C7CEDA" }}>No result yet — check back after gameweek 1.</div>
            )}
          </section>
        </div>

        {/* THIS WEEK'S PREDICTIONS */}
        <section style={{ marginTop: 20, background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "16px 18px" }} className="fade-in">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Calendar size={16} color="var(--amber)" />
            <h2 className="disp" style={{ fontSize: 15, margin: 0 }}>This week's predictions</h2>
          </div>
          <div style={{ fontSize: 12.5, color: "#6b6a5e", marginBottom: 12 }}>Gameweek {data.gameweek.number} fixtures</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {data.fixtures.map((f) => (
              <div key={f.id} className="row-line" style={{ padding: "10px 4px" }}>
                {f.home || f.away ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
                    <span>{f.home || "TBC"}</span>
                    <span className="mono" style={{ color: "#b0aea1" }}>–</span>
                    <span>{f.away || "TBC"}</span>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", fontSize: 13.5, color: "#b0aea1", fontStyle: "italic" }}>Released soon</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CUPS */}
        <section style={{ marginTop: 20, background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "16px 18px" }} className="fade-in">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Calendar size={16} color="var(--amber)" />
            <h2 className="disp" style={{ fontSize: 15, margin: 0 }}>Cup dates</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {data.cups.map((c) => (
              <div key={c.id} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "10px 14px", minWidth: 200 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                <div className="mono" style={{ fontSize: 13, color: "var(--amber)" }}>{fmtDate(c.date)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WILDCARDS EXPLAINER */}
        <section style={{ marginTop: 20 }} className="fade-in">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Target size={16} color="var(--amber)" />
            <h2 className="disp" style={{ fontSize: 15, margin: 0 }}>Wildcards explained</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {data.wildcards.map((w) => (
              <div key={w.id} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{w.name}</div>
                <div style={{ fontSize: 13.5, color: "#4a4a42", lineHeight: 1.5 }}>{w.description}</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--amber)", marginTop: 8 }}>{w.total}× per player</div>
              </div>
            ))}
          </div>
        </section>

        {/* WILDCARD TRACKER */}
        <section style={{ marginTop: 20, background: "#fff", border: "1px solid var(--line)", borderRadius: 10, overflow: "auto" }} className="fade-in">
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
            <Users size={16} color="var(--amber)" />
            <h2 className="disp" style={{ fontSize: 15, margin: 0 }}>Wildcards remaining</h2>
          </div>
          <div style={{ padding: 18 }}>
            <select style={{ maxWidth: 280, width: "100%" }} value={openWildcard || ""} onChange={(e) => setOpenWildcard(e.target.value || null)}>
              <option value="">Select a player…</option>
              {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {openWildcard && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>{playerName(openWildcard)}'s wildcards remaining</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.wildcards.map((w) => {
                    const remaining = data.wildcardRemaining[openWildcard]?.[w.id] ?? 0;
                    return (
                      <li key={w.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, maxWidth: 360 }}>
                        <span style={{ color: "#6b6a5e" }}>{w.name}</span>
                        <span className="mono" style={{ fontWeight: 700, color: remaining === 0 ? "#b0aea1" : "var(--amber)" }}>
                          {remaining}<span style={{ color: "#b0aea1", fontWeight: 500 }}>/{w.total}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* GOALSCORER PICKS */}
        <section style={{ marginTop: 20, background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "16px 18px" }} className="fade-in">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Target size={16} color="var(--amber)" />
            <h2 className="disp" style={{ fontSize: 15, margin: 0 }}>Goalscorer picks</h2>
          </div>
          <select style={{ maxWidth: 280, width: "100%" }} value={openScorer || ""} onChange={(e) => setOpenScorer(e.target.value || null)}>
            <option value="">Select a player…</option>
            {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {openScorer && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{playerName(openScorer)}'s goalscorer picks</div>
              {(data.goalscorerPicks[openScorer] || []).length ? (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {[...(data.goalscorerPicks[openScorer] || [])].sort((a, b) => a.localeCompare(b)).map((name, idx) => (
                    <li key={idx} style={{ fontSize: 14, fontWeight: 600, color: "var(--amber)" }}>{name}</li>
                  ))}
                </ul>
              ) : (
                <span style={{ color: "#b0aea1", fontSize: 13 }}>No picks yet</span>
              )}
            </div>
          )}
        </section>

        {/* YELLOW CARD PICKS */}
        <section style={{ margin: "20px 0 8px", background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "16px 18px" }} className="fade-in">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Square size={14} color="var(--card)" fill="var(--card)" />
            <h2 className="disp" style={{ fontSize: 15, margin: 0 }}>Yellow card picks</h2>
          </div>
          <select style={{ maxWidth: 280, width: "100%" }} value={openCard || ""} onChange={(e) => setOpenCard(e.target.value || null)}>
            <option value="">Select a player…</option>
            {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {openCard && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{playerName(openCard)}'s yellow card picks</div>
              {(data.yellowCardPicks[openCard] || []).length ? (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {[...(data.yellowCardPicks[openCard] || [])].sort((a, b) => a.localeCompare(b)).map((name, idx) => (
                    <li key={idx} style={{ fontSize: 14, fontWeight: 600, color: "#8A6D00" }}>{name}</li>
                  ))}
                </ul>
              ) : (
                <span style={{ color: "#b0aea1", fontSize: 13 }}>No picks yet</span>
              )}
            </div>
          )}
        </section>

        {/* PRE-SEASON BONUS PREDICTIONS */}
        <section style={{ margin: "20px 0 8px", background: "#fff", border: "1px solid var(--line)", borderRadius: 10, overflow: "auto" }} className="fade-in">
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Trophy size={16} color="var(--amber)" />
              <h2 className="disp" style={{ fontSize: 15, margin: 0 }}>Pre-season bonus predictions</h2>
            </div>
            <div style={{ fontSize: 12.5, color: "#6b6a5e", marginTop: 4 }}>10 points per correct prediction, added once each competition ends — 50 points max.</div>
          </div>
          <div style={{ padding: 18 }}>
            <select style={{ maxWidth: 280, width: "100%" }} value={openBonus || ""} onChange={(e) => setOpenBonus(e.target.value || null)}>
              <option value="">Select a player…</option>
              {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {openBonus && (() => {
              const pred = data.preSeasonPredictions[openBonus] || { pl: "", champ: "", faCup: "", leagueCup: "", ucl: "" };
              const fields = [["pl", "Premier League"], ["champ", "Championship"], ["faCup", "FA Cup"], ["leagueCup", "League Cup"], ["ucl", "Champions League"]];
              return (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>{playerName(openBonus)}'s bonus predictions</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {fields.map(([key, label]) => (
                      <li key={key} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, maxWidth: 360 }}>
                        <span style={{ color: "#6b6a5e" }}>{label}</span>
                        <span style={{ fontWeight: 700, color: pred[key] ? "var(--amber)" : "#b0aea1" }}>{pred[key] || "—"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        </section>
      </main>
    </div>
  );
}
