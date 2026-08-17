import { useState } from "react";
import { Trophy, Calendar, Zap, Target, Square, Users } from "lucide-react";
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

        {/* TABLE + TOP SCORER */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 28 }} className="fade-in">
          <section style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
              <Trophy size={16} color="var(--amber)" />
              
