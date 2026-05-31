import { useState, useEffect, useRef } from "react";
import logo from "./assets/logo.png";
import {
  FaCheckCircle, FaLaptopCode, FaCommentDots, FaFire,
  FaBrain, FaChartLine, FaUser, FaTachometerAlt, FaBook,
  FaDumbbell, FaMicrophone, FaShieldAlt, FaSignOutAlt,
  FaRocket, FaTrophy, FaCalendarAlt, FaMicrophoneSlash
} from "react-icons/fa";
import axios from "axios";

// ─── API Base ──────────────────────────────────────────────────────────────────
const API_BASE = "https://ai-interview-prep-yyl4.onrender.com";
const AI = axios.create({ baseURL: API_BASE + "/api/ai" });

// ─── Static Data ───────────────────────────────────────────────────────────────
const TOPICS_DATA = [
  { title: "DSA", icon: "🧮", desc: "Arrays, Linked List, Trees, Graphs, DP", color: "#3b82f6", tag: "Core" },
  { title: "DBMS", icon: "🗄️", desc: "Normalization, SQL, Transactions, Joins", color: "#10b981", tag: "Core" },
  { title: "Operating System", icon: "⚙️", desc: "CPU Scheduling, Deadlocks, Memory Management", color: "#f59e0b", tag: "Core" },
  { title: "Computer Networks", icon: "🌐", desc: "OSI Model, TCP/IP, Routing, HTTP", color: "#8b5cf6", tag: "Core" },
  { title: "HR Interview", icon: "🤝", desc: "Communication, Resume, Confidence Building", color: "#ec4899", tag: "Soft Skills" },
];

const TOPIC_QUESTIONS = {
  DSA: [
    { question: "What is an Array?", answer: "An array is a linear data structure that stores elements in contiguous memory locations.", difficulty: "Easy" },
    { question: "Explain Stack and Queue.", answer: "Stack follows LIFO (Last In First Out) while Queue follows FIFO (First In First Out).", difficulty: "Medium" },
  ],
  DBMS: [
    { question: "What is Normalization?", answer: "Normalization is the process of organizing data to reduce redundancy and improve data integrity.", difficulty: "Medium" },
    { question: "What is a Primary Key?", answer: "A Primary Key uniquely identifies each record in a database table.", difficulty: "Easy" },
  ],
  "Operating System": [
    { question: "What is a Process?", answer: "A process is a program in execution with its own memory space and resources.", difficulty: "Easy" },
    { question: "What is Deadlock?", answer: "Deadlock occurs when two or more processes wait indefinitely for resources held by each other.", difficulty: "Medium" },
  ],
  "Computer Networks": [
    { question: "What is the OSI Model?", answer: "The OSI Model is a 7-layer framework for understanding how different protocols interact in a network.", difficulty: "Medium" },
    { question: "What is TCP/IP?", answer: "TCP/IP is the core communication protocol suite of the internet, handling data transmission and addressing.", difficulty: "Hard" },
  ],
  "HR Interview": [
    { question: "Tell me about yourself.", answer: "Structure your answer around: background, relevant skills, and why you're a good fit for this role.", difficulty: "Easy" },
    { question: "Why should we hire you?", answer: "Highlight your unique skills, experience, and how you'll add value to the team and organization.", difficulty: "Easy" },
  ],
};

const HR_QUESTIONS = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "What is your biggest weakness?",
  "Why should we hire you?",
  "Where do you see yourself in 5 years?",
  "Tell me about a challenge you overcame.",
  "Why do you want to work here?",
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-base:       #060a12;
    --bg-surface:    #0a0f1e;
    --bg-elevated:   #0e1526;
    --bg-card:       rgba(14, 22, 42, 0.85);
    --border:        rgba(148,163,184,0.07);
    --border-hover:  rgba(148,163,184,0.14);
    --border-active: rgba(99,130,255,0.3);
    --blue:          #4f7cff;
    --blue-dark:     #2952e3;
    --blue-glow:     rgba(79,124,255,0.12);
    --indigo:        #6366f1;
    --cyan:          #22d3ee;
    --green:         #10b981;
    --purple:        #7c6ff7;
    --amber:         #f59e0b;
    --pink:          #ec4899;
    --red:           #ef4444;
    --navy-glow:     rgba(30,50,120,0.25);
    --text-primary:  #eef2ff;
    --text-secondary:#8899bb;
    --text-muted:    #3d4f6e;
    --font:          'Sora', system-ui, sans-serif;
    --mono:          'JetBrains Mono', monospace;
    --radius-sm:     10px;
    --radius-md:     13px;
    --radius-lg:     18px;
    --radius-xl:     22px;
    --sidebar-w:     232px;
    --topbar-h:      64px;
    --glass-bg:      rgba(14, 22, 42, 0.7);
    --glass-border:  rgba(148,163,184,0.08);
    --shadow-card:   0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3);
    --shadow-hover:  0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(79,124,255,0.08);
  }

  html, body, #root { height: 100%; background: var(--bg-base); }
  body {
    font-family: var(--font); color: var(--text-primary); overflow: hidden;
    letter-spacing: -0.01em;
    background-image:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(30,50,120,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(99,102,241,0.08) 0%, transparent 60%);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .app { display: flex; height: 100vh; animation: fadeIn 0.35s ease; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--bg-surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 20px 14px; gap: 2px;
    overflow-y: auto; flex-shrink: 0;
    backdrop-filter: blur(20px);
  }
  .sidebar::-webkit-scrollbar { width: 3px; }
  .sidebar::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.1); border-radius: 99px; }

  .sidebar-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 10px 18px;
    border-bottom: 1px solid var(--border); margin-bottom: 10px;
  }
  .sidebar-brand img { width: 34px; height: 34px; border-radius: 10px; }
  .sidebar-brand-name {
    font-size: 16px; font-weight: 700;
    background: linear-gradient(135deg, #a5b4fc 0%, #7dd3fc 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.4px;
  }

  .nav-section-label {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.4px; color: var(--text-muted); padding: 14px 10px 5px;
  }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: var(--radius-sm);
    cursor: pointer; font-size: 13px; font-weight: 500;
    color: var(--text-secondary); transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    user-select: none; border: 1px solid transparent;
    line-height: 1;
  }
  .nav-item:hover {
    color: var(--text-primary);
    background: rgba(148,163,184,0.05);
    border-color: var(--border);
    transform: translateX(2px);
  }
  .nav-item.active {
    color: #c7d2fe;
    background: linear-gradient(135deg, rgba(79,124,255,0.16) 0%, rgba(99,102,241,0.1) 100%);
    border-color: rgba(99,102,241,0.22);
    font-weight: 600;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
  }
  .nav-item .nav-icon { font-size: 13px; width: 18px; display: flex; justify-content: center; opacity: 0.85; }
  .nav-item.active .nav-icon { opacity: 1; }

  /* ── MAIN AREA ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    height: var(--topbar-h); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 16px;
    background: rgba(10,15,30,0.9); flex-shrink: 0;
    backdrop-filter: blur(16px);
  }
  .topbar-search {
    flex: 1; max-width: 380px;
    background: rgba(14,21,38,0.8);
    border: 1px solid var(--border); border-radius: var(--radius-md);
    padding: 9px 15px; color: var(--text-primary); font-size: 13px;
    font-family: var(--font); outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    letter-spacing: -0.01em;
  }
  .topbar-search:focus {
    border-color: rgba(79,124,255,0.45);
    background: rgba(16,24,44,0.95);
    box-shadow: 0 0 0 3px rgba(79,124,255,0.08);
  }
  .topbar-search::placeholder { color: var(--text-muted); font-size: 12.5px; }
  .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
  .topbar-avatar {
    display: flex; align-items: center; gap: 9px;
    background: rgba(14,21,38,0.8); border: 1px solid var(--border);
    border-radius: var(--radius-md); padding: 6px 14px 6px 8px;
    cursor: pointer; font-size: 13px; font-weight: 600;
    transition: all 0.2s; letter-spacing: -0.01em;
  }
  .topbar-avatar:hover {
    border-color: var(--border-hover);
    background: rgba(20,30,56,0.9);
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }
  .avatar-circle {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #4f7cff, #7c6ff7);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 10.5px; font-weight: 700; color: #fff;
    box-shadow: 0 0 0 2px rgba(79,124,255,0.2);
  }

  .page-content {
    flex: 1; overflow-y: auto; padding: 28px 32px; background: var(--bg-base);
  }
  }
  .page-content::-webkit-scrollbar { width: 5px; }
  .page-content::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.1); border-radius: 99px; }

  .card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: 20px 22px;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-card);
  }
  .card:hover {
    border-color: var(--border-hover);
    box-shadow: var(--shadow-hover);
    transform: translateY(-1px);
  }

  .page-title {
    font-size: 24px; font-weight: 700; letter-spacing: -0.6px; margin-bottom: 4px;
    animation: fadeInUp 0.4s ease both;
  }
  .page-subtitle {
    font-size: 13.5px; color: var(--text-secondary); margin-bottom: 24px; font-weight: 400;
    animation: fadeInUp 0.4s 0.06s ease both;
  }

  .welcome-banner {
    background: linear-gradient(135deg, #0d1a3e 0%, #111d4a 35%, #151a52 60%, #1a1245 100%);
    border-radius: var(--radius-xl); padding: 30px 34px; margin-bottom: 24px;
    position: relative; overflow: hidden;
    border: 1px solid rgba(99,102,241,0.18);
    box-shadow: 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
    animation: fadeInUp 0.4s ease both;
  }
  .welcome-banner::before {
    content: ''; position: absolute; top: -80px; right: -80px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    border-radius: 50%;
  }
  .welcome-banner::after {
    content: ''; position: absolute; bottom: -60px; left: 30%;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(79,124,255,0.07) 0%, transparent 70%);
    border-radius: 50%;
  }
  .welcome-title {
    font-size: 23px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.4px;
  }
  .welcome-sub { font-size: 13.5px; color: rgba(255,255,255,0.6); margin-bottom: 22px; font-weight: 400; }
  .welcome-actions { display: flex; gap: 10px; flex-wrap: wrap; }

  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: var(--radius-sm);
    font-size: 12.5px; font-weight: 600; cursor: pointer;
    border: none; font-family: var(--font);
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    letter-spacing: -0.01em;
  }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-primary {
    background: rgba(255,255,255,0.95); color: #1e3578;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }
  .btn-primary:hover {
    background: #fff; transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
  .btn-ghost {
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
  }
  .btn-ghost:hover {
    background: rgba(255,255,255,0.13);
    border-color: rgba(255,255,255,0.2);
    transform: translateY(-2px) scale(1.02);
  }
  .btn-blue {
    background: linear-gradient(135deg, #4f7cff 0%, #3d6ae0 100%); color: #fff;
    box-shadow: 0 2px 12px rgba(79,124,255,0.3);
  }
  .btn-blue:hover:not(:disabled) {
    background: linear-gradient(135deg, #5f8cff 0%, #4d7af0 100%);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(79,124,255,0.4);
  }
  .btn-green {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff;
    box-shadow: 0 2px 12px rgba(16,185,129,0.25);
  }
  .btn-green:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(16,185,129,0.35);
  }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: 18px 20px;
    display: flex; align-items: center; gap: 14px;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-card);
  }
  .stat-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }
  .stat-icon {
    width: 42px; height: 42px; border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0;
  }
  .stat-value {
    font-size: 26px; font-weight: 700; letter-spacing: -0.8px;
    line-height: 1;
  }
  .stat-label {
    font-size: 11.5px; color: var(--text-secondary); font-weight: 500;
    margin-top: 3px; letter-spacing: 0.01em;
  }

  .dashboard-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; margin-bottom: 24px; }

  .progress-bar-track {
    flex: 1; height: 5px;
    background: rgba(148,163,184,0.07);
    border-radius: 99px; overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.9s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 0 6px currentColor;
  }

  .topics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .topic-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: 22px;
    cursor: pointer; transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    position: relative; overflow: hidden;
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-card);
  }
  .topic-card:hover {
    border-color: rgba(99,102,241,0.25);
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }
  .topic-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--accent-color, var(--blue)); opacity: 0.8;
    border-radius: 99px 99px 0 0;
  }
  .topic-icon { font-size: 26px; margin-bottom: 10px; }
  .topic-title { font-size: 16px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.3px; }
  .topic-desc { font-size: 12.5px; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.55; }
  .topic-progress-row { display: flex; align-items: center; gap: 10px; }
  .topic-pct { font-size: 11.5px; font-weight: 600; }
  .tag-pill {
    display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 99px;
    font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px;
    background: rgba(148,163,184,0.07); color: var(--text-secondary); margin-bottom: 10px;
    border: 1px solid rgba(148,163,184,0.08);
  }

  .question-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: 20px; margin-bottom: 12px;
    cursor: pointer; transition: all 0.22s;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 12px rgba(0,0,0,0.25);
  }
  .question-card:hover { border-color: rgba(79,124,255,0.25); background: rgba(16,26,52,0.75); }
  .question-card.expanded { border-color: rgba(79,124,255,0.35); }

  .diff-badge { display: inline-flex; padding: 2px 8px; border-radius: 99px; font-size: 10.5px; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.2px; }
  .diff-easy   { background: rgba(16,185,129,0.12); color: #34d399; }
  .diff-medium { background: rgba(245,158,11,0.12);  color: #fbbf24; }
  .diff-hard   { background: rgba(239,68,68,0.12);   color: #f87171; }

  .question-text { font-size: 14.5px; font-weight: 600; margin-bottom: 0; letter-spacing: -0.2px; }
  .answer-box {
    margin-top: 14px; padding: 14px 16px;
    background: rgba(79,124,255,0.04); border-radius: var(--radius-sm);
    border-left: 2px solid rgba(79,124,255,0.5);
    font-size: 13.5px; line-height: 1.72; color: var(--text-secondary);
  }
  .mark-done-btn {
    margin-top: 12px; padding: 6px 14px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: transparent;
    color: var(--text-secondary); font-size: 11.5px; font-weight: 600;
    cursor: pointer; font-family: var(--font); transition: all 0.2s;
  }
  .mark-done-btn:hover { border-color: var(--green); color: var(--green); }
  .mark-done-btn.done { border-color: rgba(16,185,129,0.4); color: #34d399; background: rgba(16,185,129,0.07); }

  .practice-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .practice-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: 26px;
    cursor: pointer; transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    position: relative; overflow: hidden;
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-card);
  }
  .practice-card:hover {
    border-color: rgba(99,102,241,0.25);
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }
  .practice-card-icon { font-size: 30px; margin-bottom: 14px; }
  .practice-card-title { font-size: 17px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.3px; }
  .practice-card-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.55; }

  .mock-container { max-width: 720px; }
  .mock-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .timer-badge {
    display: flex; align-items: center; gap: 8px;
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-md); padding: 8px 16px;
    font-size: 19px; font-weight: 700; font-family: var(--mono);
    backdrop-filter: blur(10px);
    letter-spacing: 0.05em;
  }
  .timer-badge.urgent { border-color: rgba(239,68,68,0.35); color: #f87171; }
  .question-counter {
    font-size: 12.5px; color: var(--text-muted);
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-md); padding: 8px 16px;
    backdrop-filter: blur(10px);
  }
  .mock-question-card {
    background: var(--glass-bg);
    border: 1px solid rgba(79,124,255,0.18);
    border-radius: var(--radius-xl); padding: 28px; margin-bottom: 18px;
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 24px rgba(0,0,0,0.35);
  }
  .mock-q-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #7c9fff; margin-bottom: 10px; }
  .mock-q-text { font-size: 17px; font-weight: 700; line-height: 1.55; letter-spacing: -0.3px; }
  .mock-answer-area {
    width: 100%; background: rgba(14,21,38,0.8); border: 1px solid var(--border);
    border-radius: var(--radius-md); padding: 14px 16px;
    color: var(--text-primary); font-size: 13.5px; font-family: var(--font);
    resize: vertical; min-height: 130px; outline: none;
    transition: border-color 0.22s, box-shadow 0.22s; margin-bottom: 14px;
    line-height: 1.65;
  }
  .mock-answer-area:focus {
    border-color: rgba(79,124,255,0.4);
    box-shadow: 0 0 0 3px rgba(79,124,255,0.07);
  }
  .feedback-card {
    background: linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.03) 100%);
    border: 1px solid rgba(16,185,129,0.18); border-radius: var(--radius-lg);
    padding: 18px 20px; margin-top: 14px; font-size: 13.5px; line-height: 1.72; color: var(--text-secondary);
  }
  .feedback-label { font-size: 11px; font-weight: 700; color: #34d399; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.8px; }

  .quiz-option {
    background: rgba(14,21,38,0.7); border: 1px solid var(--border);
    border-radius: var(--radius-md); padding: 13px 18px; cursor: pointer;
    font-size: 13.5px; font-weight: 500; transition: all 0.2s; margin-bottom: 10px;
    display: flex; align-items: center; gap: 12px;
    backdrop-filter: blur(8px);
  }
  .quiz-option:hover { border-color: var(--border-hover); background: rgba(20,30,56,0.8); }
  .quiz-option.selected { border-color: rgba(79,124,255,0.5); background: rgba(79,124,255,0.1); color: #c7d2fe; }
  .quiz-option.correct  { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.08); color: #34d399; }
  .quiz-option.wrong    { border-color: rgba(239,68,68,0.35); background: rgba(239,68,68,0.08); color: #f87171; }
  .option-letter {
    width: 24px; height: 24px; border-radius: 50%; background: rgba(148,163,184,0.08);
    display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0;
  }

  .feedback-analytics-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl); padding: 24px 26px; margin-bottom: 16px;
    transition: all 0.25s; position: relative; overflow: hidden;
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-card);
  }
  .feedback-analytics-card:hover { border-color: var(--border-hover); transform: translateY(-1px); }
  .score-ring {
    width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 19px; font-weight: 700; flex-shrink: 0; position: relative;
  }
  .feedback-title { font-size: 16.5px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.3px; }
  .feedback-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.55; }
  .feedback-tag { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; }

  .progress-overview { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .topic-progress-row { margin-bottom: 20px; }
  .topic-progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .topic-progress-name { font-size: 13.5px; font-weight: 600; }
  .topic-progress-count { font-size: 12.5px; color: var(--text-muted); font-family: var(--mono); }
  .progress-track-lg {
    height: 7px; background: rgba(148,163,184,0.06);
    border-radius: 99px; overflow: hidden;
  }
  .progress-fill-lg {
    height: 100%; border-radius: 99px;
    transition: width 1s cubic-bezier(0.4,0,0.2,1); position: relative;
  }
  .progress-fill-lg::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    animation: shimmer 2.5s ease-in-out infinite;
  }
  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

  .profile-banner {
    background: linear-gradient(135deg, #08101f 0%, #0f1535 50%, #130d30 100%);
    border: 1px solid rgba(99,102,241,0.14); border-radius: var(--radius-xl);
    padding: 32px; display: flex; align-items: center; gap: 24px;
    margin-bottom: 24px; position: relative; overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .profile-avatar-lg {
    width: 72px; height: 72px;
    background: linear-gradient(135deg, #4f7cff, #7c6ff7);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 700; flex-shrink: 0; color: #fff;
    border: 2px solid rgba(255,255,255,0.12);
    box-shadow: 0 0 0 4px rgba(79,124,255,0.15);
  }
  .profile-name { font-size: 21px; font-weight: 700; letter-spacing: -0.4px; }
  .profile-role { font-size: 13.5px; color: var(--text-secondary); margin-top: 2px; }
  .skill-pill {
    display: inline-flex; padding: 5px 12px;
    background: rgba(79,124,255,0.08); border: 1px solid rgba(79,124,255,0.18);
    border-radius: 99px; font-size: 11.5px; font-weight: 600; color: #a5b4fc; margin: 4px;
  }

  .auth-overlay {
    position: fixed; inset: 0; background: var(--bg-base);
    display: flex; align-items: center; justify-content: center; z-index: 100;
  }
  .auth-wrapper {
    display: grid; grid-template-columns: 1fr 1fr;
    width: 900px; max-width: 95vw;
    background: rgba(10,15,30,0.95);
    border: 1px solid rgba(99,102,241,0.15);
    border-radius: 24px; overflow: hidden; min-height: 520px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    backdrop-filter: blur(20px);
  }
  .auth-left {
    background: linear-gradient(135deg, #080f22 0%, #0d1235 50%, #0c0a28 100%);
    padding: 48px 40px; display: flex; flex-direction: column; position: relative; overflow: hidden;
    border-right: 1px solid rgba(99,102,241,0.12);
  }
  .auth-left::before {
    content: ''; position: absolute; width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(79,124,255,0.12) 0%, transparent 70%);
    top: -100px; right: -100px; border-radius: 50%;
  }
  .auth-left-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 60px; }
  .auth-left-brand img { width: 36px; border-radius: 10px; }
  .auth-left-title { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.25; margin-bottom: 16px; }
  .auth-left-sub { font-size: 13.5px; color: rgba(255,255,255,0.55); line-height: 1.65; }
  .auth-features { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
  .auth-feature-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(255,255,255,0.65); }
  .auth-feature-dot { width: 5px; height: 5px; background: #7c9fff; border-radius: 50%; flex-shrink: 0; }

  .auth-right { padding: 48px 40px; display: flex; flex-direction: column; justify-content: center; }
  .auth-title { font-size: 21px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.4px; }
  .auth-subtitle { font-size: 13px; color: var(--text-secondary); margin-bottom: 28px; }
  .auth-toggle {
    display: flex; background: rgba(14,21,38,0.8);
    border-radius: var(--radius-sm); padding: 3px; margin-bottom: 24px;
    border: 1px solid var(--border);
  }
  .auth-toggle-btn {
    flex: 1; padding: 7px; border-radius: 8px; border: none; background: none;
    font-family: var(--font); font-size: 13px; font-weight: 600;
    cursor: pointer; color: var(--text-muted); transition: all 0.2s;
  }
  .auth-toggle-btn.active {
    background: rgba(20,30,56,0.9); color: var(--text-primary);
    box-shadow: 0 1px 4px rgba(0,0,0,0.35);
  }

  .form-group { margin-bottom: 14px; }
  .form-label {
    font-size: 11px; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;
    display: block; text-transform: uppercase; letter-spacing: 0.6px;
  }
  .form-input {
    width: 100%; background: rgba(14,21,38,0.8); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 11px 14px;
    color: var(--text-primary); font-size: 13.5px; font-family: var(--font);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus {
    border-color: rgba(79,124,255,0.5);
    box-shadow: 0 0 0 3px rgba(79,124,255,0.07);
  }
  .form-input::placeholder { color: var(--text-muted); }
  .auth-submit {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, #4f7cff, #3d5fe0);
    border: none; border-radius: var(--radius-sm); color: #fff;
    font-size: 13.5px; font-weight: 700; font-family: var(--font); cursor: pointer; margin-top: 6px;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 2px 12px rgba(79,124,255,0.3);
  }
  .auth-submit:hover {
    background: linear-gradient(135deg, #5f8cff, #4d7af0);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79,124,255,0.4);
  }
  .auth-error { color: #f87171; font-size: 12.5px; margin-top: 8px; }

  .activity-item {
    display: flex; align-items: center; gap: 12px; padding: 11px 0;
    border-bottom: 1px solid rgba(148,163,184,0.06); font-size: 13px;
    transition: opacity 0.2s;
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    box-shadow: 0 0 6px currentColor;
  }

  .rec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .rec-card {
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: 18px; cursor: pointer;
    transition: all 0.22s;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 12px rgba(0,0,0,0.25);
  }
  .rec-card:hover { border-color: rgba(79,124,255,0.25); transform: translateY(-2px); }
  .rec-badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 700; margin-bottom: 8px; }
  .badge-easy   { background: rgba(16,185,129,0.12); color: #34d399; }
  .badge-medium { background: rgba(245,158,11,0.12);  color: #fbbf24; }
  .badge-hard   { background: rgba(239,68,68,0.12);   color: #f87171; }
  .rec-title { font-size: 13.5px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.2px; }
  .rec-desc  { font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.45; }

  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  .section-title {
    font-size: 15px; font-weight: 700; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px; letter-spacing: -0.2px;
  }
  .results-screen { text-align: center; padding: 40px 20px; }
  .results-score { font-size: 62px; font-weight: 800; letter-spacing: -2px; }

  /* AI loading spinner */
  .ai-spinner {
    display: inline-block; width: 34px; height: 34px;
    border: 2.5px solid rgba(79,124,255,0.12); border-top-color: #4f7cff;
    border-radius: 50%; animation: _spin 0.75s linear infinite;
  }
  @keyframes _spin { to { transform: rotate(360deg); } }

  .ai-loading-block {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 280px; gap: 14px;
  }
  .ai-loading-text { font-size: 13.5px; color: var(--text-secondary); }

  /* Code block */
  .code-block {
    background: rgba(148,163,184,0.03); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 12px 14px;
    font-family: var(--mono); font-size: 12px; color: #67e8f9;
    white-space: pre-wrap; overflow-x: auto; margin-top: 8px;
    line-height: 1.65;
  }

  /* HR improvement card */
  .improvement-card {
    background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15);
    border-radius: var(--radius-lg); padding: 16px 18px; margin-top: 14px;
  }
  .improvement-label { font-size: 10.5px; font-weight: 700; color: #34d399; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.6px; }

  /* Mock report card */
  .report-card {
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl); padding: 28px; margin-bottom: 16px;
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-card);
  }
`;

// ── SVG Progress Ring ──────────────────────────────────────────────────────────
function ProgressRing({ percent, size = 120, stroke = 9, color = "#3b82f6" }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const API = "https://ai-interview-prep-yyl4.onrender.com";

const fetchAnalytics = async (jwt) => {
  try {
    const res = await axios.get(API + "/api/analytics/dashboard", { headers: { Authorization: "Bearer " + jwt } });
    return res.data;
  } catch { return null; }
};

const fetchFeedback = async (jwt) => {
  try {
    const res = await axios.get(API + "/api/analytics/feedback", { headers: { Authorization: "Bearer " + jwt } });
    return res.data;
  } catch { return null; }
};

const logActivity = async (jwt, type, label, score = null, topic = null) => {
  if (!jwt || jwt.startsWith("demo-")) return;
  try {
    await axios.post(API + "/api/analytics/activity", { type, label, score, topic }, { headers: { Authorization: "Bearer " + jwt } });
  } catch (e) { console.warn("Activity log failed:", e.message); }
};

const fetchProgressDB = async (jwt) => {
  try {
    const res = await axios.get(API + "/api/progress", { headers: { Authorization: "Bearer " + jwt } });
    return res.data;
  } catch { return null; }
};

const saveProgressDB = async (jwt, completedQuestions) => {
  if (!jwt || jwt.startsWith("demo-")) return;
  try {
    await axios.post(API + "/api/progress/save", { completedQuestions }, { headers: { Authorization: "Bearer " + jwt } });
  } catch (e) { console.warn("DB sync failed:", e.message); }
};

const loadLocalProgress = (userObj) => {
  if (!userObj) return {};
  const saved = localStorage.getItem("progress_" + (userObj.email || userObj.id));
  return saved ? JSON.parse(saved) : {};
};
const saveLocalProgress = (userObj, data) => {
  if (!userObj) return;
  localStorage.setItem("progress_" + (userObj.email || userObj.id), JSON.stringify(data));
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("DSA");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Auth
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("demoUser"); return s ? JSON.parse(s) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Analytics
  const [analytics, setAnalytics] = useState({ practiceSessions: 0, feedbackReceived: 0, recentActivity: [] });
  const [feedbackData, setFeedbackData] = useState({
    technical:    { score: null, maxScore: 10, sessionCount: 0, lastUpdated: null },
    behavioral:   { score: null, maxScore: 10, sessionCount: 0, lastUpdated: null },
    coreConcepts: { score: null, maxScore: 10, sessionCount: 0, lastUpdated: null },
  });

  // Progress
  const [completedQuestions, setCompletedQuestions] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("demoUser") || "null");
      if (!savedUser) return {};
      const saved = localStorage.getItem("progress_" + (savedUser.email || savedUser.id));
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // ── AI: Topic Learning ──────────────────────────────────────────────────────
  const [topicContent, setTopicContent]   = useState(null);
  const [topicLoading, setTopicLoading]   = useState(false);
  const [topicError, setTopicError]       = useState(null);

  // ── AI: Quiz ───────────────────────────────────────────────────────────────
  const [quizStarted, setQuizStarted]             = useState(false);
  const [quizLoading, setQuizLoading]             = useState(false);
  const [aiQuizQuestions, setAiQuizQuestions]     = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex]   = useState(0);
  const [selectedOption, setSelectedOption]       = useState(null);
  const [isOptionSubmitted, setIsOptionSubmitted] = useState(false);
  const [quizScore, setQuizScore]                 = useState(0);
  const [showQuizResults, setShowQuizResults]     = useState(false);
  const [quizExplanation, setQuizExplanation]     = useState("");
  const [selectedQuizTopic, setSelectedQuizTopic] = useState("Mixed (DBMS, OS, Computer Networks, OOPs)");

  // ── AI: Daily Challenge ────────────────────────────────────────────────────
  const [challengeScore, setChallengeScore]         = useState(null);
  const [challengeStarted, setChallengeStarted]     = useState(false);
  const [challengeLoading, setChallengeLoading]     = useState(false);
  const [aiChallenge, setAiChallenge]               = useState(null);
  const [challengeCode, setChallengeCode]           = useState("");
  const [reviewLoading, setReviewLoading]           = useState(false);
  const [codeReview, setCodeReview]                 = useState(null);
  const [challengeDifficulty, setChallengeDifficulty] = useState("Medium");

  // ── AI: Mock Interview ─────────────────────────────────────────────────────
  const [mockStarted, setMockStarted]                 = useState(false);
  const [mockFinished, setMockFinished]               = useState(false);
  const [mockQLoading, setMockQLoading]               = useState(false);
  const [mockEvalLoading, setMockEvalLoading]         = useState(false);
  const [mockReportLoading, setMockReportLoading]     = useState(false);
  const [currentMockQ, setCurrentMockQ]               = useState(null);
  const [mockHistory, setMockHistory]                 = useState([]);
  const [mockScores, setMockScores]                   = useState([]);
  const [mockQuestionNum, setMockQuestionNum]         = useState(1);
  const [mockTotalQ]                                  = useState(7);
  const [mockAnswer, setMockAnswer]                   = useState("");
  const [mockEvalResult, setMockEvalResult]           = useState(null);
  const [mockFinalReport, setMockFinalReport]         = useState(null);
  const [timer, setTimer]                             = useState(120);

  // ── AI: HR Practice ────────────────────────────────────────────────────────
  const [hrQuestionIndex, setHrQuestionIndex]   = useState(0);
  const [hrAnswer, setHrAnswer]                 = useState("");
  const [hrAnalysisLoading, setHrAnalysisLoading] = useState(false);
  const [hrAnalysis, setHrAnalysis]             = useState(null);
  const [hrSessionStarted, setHrSessionStarted] = useState(false);

  // ── ON MOUNT ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken || savedToken.startsWith("demo-")) return;
    setIsLoadingProgress(true);
    Promise.all([fetchProgressDB(savedToken), fetchAnalytics(savedToken), fetchFeedback(savedToken)])
      .then(([progressData, analyticsData, feedbackResp]) => {
        if (progressData?.completedQuestions) {
          setCompletedQuestions(progressData.completedQuestions);
          setCurrentStreak(progressData.currentStreak || 0);
        }
        if (analyticsData) setAnalytics({ practiceSessions: analyticsData.practiceSessions || 0, feedbackReceived: analyticsData.feedbackReceived || 0, recentActivity: analyticsData.recentActivity || [] });
        if (feedbackResp) setFeedbackData(feedbackResp);
        setIsLoadingProgress(false);
      });
  }, []);

  // ── Save progress ──────────────────────────────────────────────────────────
  useEffect(() => {
    const currentUser = user || JSON.parse(localStorage.getItem("demoUser") || "null");
    if (!currentUser) return;
    const savedToken = localStorage.getItem("token");
    saveLocalProgress(currentUser, completedQuestions);
    saveProgressDB(savedToken, completedQuestions);
  }, [completedQuestions]);

  // ── Fetch AI topic content when TopicDetail page opens ────────────────────
  useEffect(() => {
    if (activePage === "TopicDetail" && selectedTopic) {
      setTopicContent(null);
      setTopicLoading(true);
      setTopicError(null);
      setSelectedQuestion(null);
      AI.post("/topic", { topic: selectedTopic })
        .then(res => setTopicContent(res.data.data))
        .catch(() => setTopicError("Failed to load AI content. Check your backend and Gemini API key."))
        .finally(() => setTopicLoading(false));
    }
  }, [activePage, selectedTopic]);

  // ── Mock interview timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mockStarted || mockFinished || timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [mockStarted, mockFinished, timer]);

  useEffect(() => {
    if (timer === 0 && mockStarted && !mockFinished && currentMockQ && !mockEvalLoading) {
      handleMockNextQuestion();
    }
  }, [timer]);

  // ── AUTH ───────────────────────────────────────────────────────────────────
  const handleAuth = async () => {
    setAuthError("");
    if (!authForm.email || !authForm.password) { setAuthError("Please enter your email and password."); return; }
    if (!isLoginView && !authForm.name.trim()) { setAuthError("Please enter your full name."); return; }
    try {
      const endpoint = isLoginView ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLoginView
  ? { email: authForm.email, password: authForm.password }
  : { 
      name: authForm.name, 
      email: authForm.email, 
      password: authForm.password,
      role: authForm.role || "Software Developer",
      skills: authForm.skills || []
    };
    {!isLoginView && (
  <>
    <div className="form-group">
      <label className="form-label">Your Role</label>
      <input className="form-input" placeholder="e.g. Full-Stack Developer"
        value={authForm.role || ""}
        onChange={e => setAuthForm({ ...authForm, role: e.target.value })} />
    </div>
    <div className="form-group">
      <label className="form-label">Skills (comma separated)</label>
      <input className="form-input" placeholder="React.js, Node.js, Python"
        value={authForm.skillsInput || ""}
        onChange={e => setAuthForm({ 
          ...authForm, 
          skillsInput: e.target.value,
          skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
        })} />
    </div>
  </>
)}
      const res = await axios.post("https://ai-interview-prep-yyl4.onrender.com" + endpoint, payload);
      const { token: t, user: u } = res.data;
      localStorage.setItem("token", t);
      localStorage.removeItem("demoUser");
      setToken(t); setUser(u);
      setIsLoadingProgress(true);
      const dbData = await fetchProgressDB(t);
      if (dbData?.completedQuestions) { setCompletedQuestions(dbData.completedQuestions); setCurrentStreak(dbData.currentStreak || 0); }
      else { setCompletedQuestions({}); setCurrentStreak(0); }
      const [analyticsData, feedbackResp] = await Promise.all([fetchAnalytics(t), fetchFeedback(t)]);
      if (analyticsData) setAnalytics({ practiceSessions: analyticsData.practiceSessions || 0, feedbackReceived: analyticsData.feedbackReceived || 0, recentActivity: analyticsData.recentActivity || [] });
      if (feedbackResp) setFeedbackData(feedbackResp);
      setIsLoadingProgress(false);
    } catch (err) {
      if (!err.response) {
        const demoName  = authForm.name || authForm.email.split("@")[0];
        const demoUser  = { id: "demo_" + authForm.email, name: demoName, email: authForm.email };
        const demoToken = "demo-token-" + Date.now();
        localStorage.setItem("token", demoToken);
        localStorage.setItem("demoUser", JSON.stringify(demoUser));
        setCompletedQuestions(loadLocalProgress(demoUser));
        setCurrentStreak(0); setToken(demoToken); setUser(demoUser);
        return;
      }
      setAuthError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  // ── QUIZ LOGIC (AI-powered) ────────────────────────────────────────────────
  const startAIQuiz = async () => {
    setQuizLoading(true);
    setAiQuizQuestions([]);
    try {
      const res = await AI.post("/quiz", { topic: selectedQuizTopic });
      setAiQuizQuestions(res.data.data.questions);
      setQuizStarted(true);
      setCurrentQuizIndex(0);
      setQuizScore(0);
      setSelectedOption(null);
      setIsOptionSubmitted(false);
      setShowQuizResults(false);
      setQuizExplanation("");
    } catch {
      alert("Failed to generate quiz. Is your backend running with GEMINI_API_KEY set?");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setIsOptionSubmitted(true);
    const q = aiQuizQuestions[currentQuizIndex];
    const explanation = q.explanation || "";
    setQuizExplanation(explanation);
    if (selectedOption === q.correctIndex) setQuizScore(s => s + 1);
  };

  const handleQuizNext = () => {
    if (currentQuizIndex >= aiQuizQuestions.length - 1) {
      const isLastCorrect = selectedOption === aiQuizQuestions[currentQuizIndex].correctIndex;
      const trueScore = isOptionSubmitted ? quizScore : quizScore + (isLastCorrect ? 1 : 0);
      setShowQuizResults(true);
      const now = new Date().toISOString();
      setFeedbackData(prev => ({ ...prev, coreConcepts: { score: trueScore, maxScore: aiQuizQuestions.length, sessionCount: (prev.coreConcepts?.sessionCount || 0) + 1, lastUpdated: now } }));
      setAnalytics(prev => ({ 
  ...prev, 
  practiceSessions: (prev.practiceSessions || 0) + 1,
  feedbackReceived: (prev.feedbackReceived || 0) + 1,
  recentActivity: [{ type: "quiz_completed", label: "Completed MCQ Quiz", score: trueScore, timestamp: now }, ...(prev.recentActivity || []).slice(0, 7)]
}));
      const savedToken = localStorage.getItem("token");
      logActivity(savedToken, "quiz_completed", "Completed MCQ Quiz", trueScore);
      if (savedToken && !savedToken.startsWith("demo-")) {
        axios.post(API + "/api/progress/quiz", { score: trueScore }, { headers: { Authorization: "Bearer " + savedToken } }).catch(() => {});
      }
    } else {
      setCurrentQuizIndex(i => i + 1);
      setSelectedOption(null);
      setIsOptionSubmitted(false);
      setQuizExplanation("");
    }
  };

  // ── DAILY CHALLENGE LOGIC (AI-powered) ────────────────────────────────────
  const fetchAIChallenge = async () => {
    setChallengeLoading(true);
    setAiChallenge(null);
    setCodeReview(null);
    setChallengeCode("");
    try {
      const res = await AI.post("/challenge", { difficulty: challengeDifficulty });
      setAiChallenge(res.data.data);
    } catch {
      alert("Failed to generate challenge. Is your backend running?");
    } finally {
      setChallengeLoading(false);
    }
  };

  const handleCodeReview = async () => {
    if (!challengeCode.trim()) { alert("Please write your solution first!"); return; }
    setReviewLoading(true);
    setCodeReview(null);
    try {
      const res = await AI.post("/challenge/review", { problem: aiChallenge, code: challengeCode, language: "JavaScript" });
      setCodeReview(res.data.data);
      const xp = challengeDifficulty === "Easy" ? 50 : challengeDifficulty === "Medium" ? 100 : 150;
      setChallengeScore(xp);
      const savedToken = localStorage.getItem("token");
      logActivity(savedToken, "practice_completed", "Solved Challenge: " + (aiChallenge?.title || "Daily Challenge"), null, "DSA");
      setAnalytics(prev => ({ ...prev, practiceSessions: (prev.practiceSessions || 0) + 1, recentActivity: [{ type: "practice_completed", label: "Solved: " + (aiChallenge?.title || "Daily Challenge"), score: null, timestamp: new Date().toISOString() }, ...(prev.recentActivity || []).slice(0, 7)] }));
    } catch {
      alert("Code review failed. Please try again.");
    } finally {
      setReviewLoading(false);
    }
  };

  // ── MOCK INTERVIEW LOGIC (AI-powered) ─────────────────────────────────────
  const startMockInterview = async () => {
    setMockStarted(true);
    setMockFinished(false);
    setMockHistory([]);
    setMockScores([]);
    setMockQuestionNum(1);
    setMockAnswer("");
    setMockEvalResult(null);
    setMockFinalReport(null);
    setTimer(120);
    await fetchNextMockQuestion([], 1);
  };

  const fetchNextMockQuestion = async (history, questionNum) => {
    setMockQLoading(true);
    setCurrentMockQ(null);
    setMockEvalResult(null);
    setMockAnswer("");
    try {
      const res = await AI.post("/mock/question", { history, topics: ["DSA", "DBMS", "Operating System", "Computer Networks", "HR"], questionNumber: questionNum });
      setCurrentMockQ(res.data.data);
      setTimer(120);
    } catch {
      setCurrentMockQ({ question: "Explain the difference between a process and a thread.", topic: "OS", difficulty: "Medium", expectedKeyPoints: [] });
    } finally {
      setMockQLoading(false);
    }
  };

  const handleMockSubmitAnswer = async () => {
    if (!mockAnswer.trim() || !currentMockQ) return;
    setMockEvalLoading(true);
    try {
      const res = await AI.post("/mock/evaluate", { question: currentMockQ.question, answer: mockAnswer, expectedKeyPoints: currentMockQ.expectedKeyPoints || [], topic: currentMockQ.topic });
      setMockEvalResult(res.data.data);
    } catch {
      setMockEvalResult({ score: 70, grade: "B", verdict: "Good attempt.", feedback: "You covered the main points. Keep practicing!", coveredPoints: [], missedPoints: [], improvedAnswer: "", encouragement: "Keep it up!" });
    } finally {
      setMockEvalLoading(false);
    }
  };

  const handleMockNextQuestion = async () => {
    const evalScore = mockEvalResult?.score ?? 60;
    const newScore  = { question: currentMockQ?.question, answer: mockAnswer, score: evalScore, topic: currentMockQ?.topic || "General" };
    const newScores = [...mockScores, newScore];
    setMockScores(newScores);

    const newHistory = [
      ...mockHistory,
      { role: "ai",   content: currentMockQ?.question || "" },
      { role: "user", content: mockAnswer || "(no answer)" },
    ];
    setMockHistory(newHistory);

    if (mockQuestionNum >= mockTotalQ) {
      // Generate final report
      setMockReportLoading(true);
      try {
        const res = await AI.post("/mock/report", { scores: newScores });
        setMockFinalReport(res.data.data);
      } catch {
        const avg = Math.round(newScores.reduce((a, b) => a + b.score, 0) / newScores.length);
        setMockFinalReport({ overallScore: avg, grade: avg >= 80 ? "A" : avg >= 65 ? "B" : "C", summary: "Interview completed.", strongTopics: [], weakTopics: [], recommendations: ["Keep practicing daily."], nextSteps: "Review weak areas." });
      } finally {
        setMockReportLoading(false);
      }
      setMockFinished(true);
      setMockStarted(false);

      // Save analytics
      const overallScore = Math.round(newScores.reduce((a, b) => a + b.score, 0) / newScores.length);
      const now = new Date().toISOString();
      setFeedbackData(prev => ({ ...prev, technical: { score: Math.round(overallScore / 10), maxScore: 10, sessionCount: (prev.technical?.sessionCount || 0) + 1, lastUpdated: now } }));
      setAnalytics(prev => ({ 
  ...prev, 
  practiceSessions: (prev.practiceSessions || 0) + 1,
  feedbackReceived: (prev.feedbackReceived || 0) + 1,
  recentActivity: [{ type: "mock_completed", label: "Completed Mock Interview", score: Math.round(overallScore / 10), timestamp: now }, ...(prev.recentActivity || []).slice(0, 7)]
}));
      const savedToken = localStorage.getItem("token");
      logActivity(savedToken, "mock_completed", "Completed Mock Interview", Math.round(overallScore / 10));
    } else {
      const nextNum = mockQuestionNum + 1;
      setMockQuestionNum(nextNum);
      await fetchNextMockQuestion(newHistory, nextNum);
    }
  };

  // ── HR PRACTICE LOGIC (AI-powered) ────────────────────────────────────────
  const handleHRAnalyze = async () => {
    if (!hrAnswer.trim()) { alert("Please type your answer first!"); return; }
    setHrAnalysisLoading(true);
    setHrAnalysis(null);
    try {
      const res = await AI.post("/hr/analyze", { question: HR_QUESTIONS[hrQuestionIndex], answer: hrAnswer });
      setHrAnalysis(res.data.data);
      const savedToken = localStorage.getItem("token");
      logActivity(savedToken, "hr_completed", "HR Practice: " + HR_QUESTIONS[hrQuestionIndex], res.data.data.score, "HR Interview");
      const now = new Date().toISOString();
      setFeedbackData(prev => ({ ...prev, behavioral: { score: Math.round((res.data.data.score || 70) / 10), maxScore: 10, sessionCount: (prev.behavioral?.sessionCount || 0) + 1, lastUpdated: now } }));
      setAnalytics(prev => ({ 
  ...prev, 
  practiceSessions: (prev.practiceSessions || 0) + 1,
  feedbackReceived: (prev.feedbackReceived || 0) + 1,
  recentActivity: [{ type: "hr_completed", label: "HR Practice Completed", score: null, timestamp: now }, ...(prev.recentActivity || []).slice(0, 7)]
}));
    } catch {
      alert("HR analysis failed. Please try again.");
    } finally {
      setHrAnalysisLoading(false);
    }
  };

  // ── PROGRESS CALCULATIONS ──────────────────────────────────────────────────
  const topicTotals = {
    DSA:  (TOPIC_QUESTIONS["DSA"] || []).length,
    DBMS: (TOPIC_QUESTIONS["DBMS"] || []).length,
    OS:   (TOPIC_QUESTIONS["Operating System"] || []).length,
    CN:   (TOPIC_QUESTIONS["Computer Networks"] || []).length,
    HR:   (TOPIC_QUESTIONS["HR Interview"] || []).length,
  };
  const completedCounts = {
    DSA:  completedQuestions["DSA"]?.length               || 0,
    DBMS: completedQuestions["DBMS"]?.length              || 0,
    OS:   completedQuestions["Operating System"]?.length  || 0,
    CN:   completedQuestions["Computer Networks"]?.length || 0,
    HR:   completedQuestions["HR Interview"]?.length      || 0,
  };
  const topicProgress = {
    "DSA":               topicTotals.DSA  ? Math.round((completedCounts.DSA  / topicTotals.DSA)  * 100) : 0,
    "DBMS":              topicTotals.DBMS ? Math.round((completedCounts.DBMS / topicTotals.DBMS) * 100) : 0,
    "Operating System":  topicTotals.OS   ? Math.round((completedCounts.OS   / topicTotals.OS)   * 100) : 0,
    "Computer Networks": topicTotals.CN   ? Math.round((completedCounts.CN   / topicTotals.CN)   * 100) : 0,
    "HR Interview":      topicTotals.HR   ? Math.round((completedCounts.HR   / topicTotals.HR)   * 100) : 0,
  };
  const totalCompleted  = Object.values(completedCounts).reduce((a, b) => a + b, 0);
  const totalQuestions  = Object.values(topicTotals).reduce((a, b) => a + b, 0);
  const overallPercent  = totalQuestions ? Math.min(Math.round((totalCompleted / totalQuestions) * 100), 100) : 0;
  const topicsCompleted = Object.values(topicProgress).filter(p => p === 100).length;

  const userName    = user?.name || "User";
  const userInitials = userName.slice(0, 2).toUpperCase();

  // ── LOADING SCREEN ─────────────────────────────────────────────────────────
  if (token && isLoadingProgress) {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{ position: "fixed", inset: 0, background: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div className="ai-spinner" style={{ width: 44, height: 44 }} />
          <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>Fetching your progress...</div>
        </div>
      </>
    );
  }

  // ── AUTH SCREEN ────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="auth-overlay">
          <div className="auth-wrapper">
            <div className="auth-left">
              <div className="auth-left-brand">
                <img src={logo} alt="AI Prep" />
                <span style={{ fontWeight: 800, fontSize: 16, background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Prep</span>
              </div>
              <div className="auth-left-title">Ace your next technical interview 🚀</div>
              <div className="auth-left-sub">Practice DSA, DBMS, OS, CN and HR rounds with AI-powered feedback.</div>
              <div className="auth-features">
                {["AI-powered mock interviews", "Real-time performance feedback", "Track progress across all topics", "Daily coding challenges", "DSA, DBMS, OS, CN & HR prep"].map(f => (
                  <div key={f} className="auth-feature-item"><div className="auth-feature-dot" />{f}</div>
                ))}
              </div>
            </div>
            <div className="auth-right">
              <div className="auth-title">{isLoginView ? "Welcome back" : "Create account"}</div>
              <div className="auth-subtitle">{isLoginView ? "Sign in to continue your preparation" : "Start your interview journey today"}</div>
              <div className="auth-toggle">
                <button className={`auth-toggle-btn ${isLoginView ? "active" : ""}`} onClick={() => { setIsLoginView(true); setAuthError(""); }}>Sign In</button>
                <button className={`auth-toggle-btn ${!isLoginView ? "active" : ""}`} onClick={() => { setIsLoginView(false); setAuthError(""); }}>Sign Up</button>
              </div>
              {!isLoginView && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="Your Name" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleAuth()} />
              </div>
              {authError && <div className="auth-error">⚠ {authError}</div>}
              <button className="auth-submit" onClick={handleAuth}>{isLoginView ? "Sign In" : "Create Account"}</button>
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
                Backend offline? Enter any email & password — demo mode activates automatically.
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE RENDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div>
      <div className="welcome-banner">
        <div className="welcome-title">Welcome back, {userName} 👋</div>
        <div className="welcome-sub">Ready to crush your next technical interview?</div>
        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={() => setActivePage("Topics")}>📚 Continue Learning</button>
          <button className="btn btn-ghost" onClick={() => { setMockFinished(false); setMockStarted(false); setMockFinalReport(null); setActivePage("MockInterview"); }}>🎯 Mock Interview</button>
          <button className="btn btn-ghost" onClick={() => { setAiChallenge(null); setChallengeScore(null); setCodeReview(null); setActivePage("DailyChallenge"); }}>⚡ Daily Challenge</button>
        </div>
      </div>

      <div className="stats-grid">
        {[
          { icon: "✅", label: "Topics Completed",   value: topicsCompleted,            color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
          { icon: "💻", label: "Practice Sessions",  value: analytics.practiceSessions, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          { icon: "💬", label: "Feedback Received",  value: analytics.feedbackReceived, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
          { icon: "🔥", label: "Day Streak",         value: currentStreak + " Day" + (currentStreak === 1 ? "" : "s"), color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="section-title">📈 Learning Progress</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "8px 0" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <ProgressRing percent={overallPercent} size={110} stroke={9} color="#3b82f6" />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>{overallPercent}%</span>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>Overall</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {TOPICS_DATA.map(t => {
                const pct = topicProgress[t.title] || 0;
                return (
                  <div key={t.title} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{t.title}</span>
                      <span style={{ color: t.color, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: pct + "%", background: t.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">⚡ Recent Activity</div>
          {analytics.recentActivity.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No recent activity yet — start practicing!</div>
          ) : analytics.recentActivity.slice(0, 6).map((a, idx) => {
            const actColor = { mock_completed: "#3b82f6", quiz_completed: "#f59e0b", hr_completed: "#10b981", topic_studied: "#8b5cf6", feedback_received: "#ec4899", practice_completed: "#22d3ee" }[a.type] || "#64748b";
            return (
              <div className="activity-item" key={idx}>
                <div className="activity-dot" style={{ background: actColor }} />
                <div style={{ flex: 1 }}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{a.label}</span></div>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{new Date(a.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section-title">🎯 Recommended Next Topics</div>
      <div className="rec-grid">
        {[
          { badge: "Easy", badgeClass: "badge-easy", title: "DSA Arrays", desc: "Practice basic array interview questions.", topic: "DSA" },
          { badge: "Medium", badgeClass: "badge-medium", title: "DBMS Normalization", desc: "Revise 1NF, 2NF, 3NF and BCNF concepts.", topic: "DBMS" },
          { badge: "Medium", badgeClass: "badge-medium", title: "OS Scheduling", desc: "FCFS, SJF, Round Robin scheduling.", topic: "Operating System" },
        ].map(r => (
          <div className="rec-card" key={r.title} onClick={() => { setSelectedTopic(r.topic); setActivePage("TopicDetail"); }}>
            <span className={`rec-badge ${r.badgeClass}`}>{r.badge}</span>
            <div className="rec-title">{r.title}</div>
            <div className="rec-desc">{r.desc}</div>
            <button className="btn btn-blue" style={{ fontSize: 12, padding: "6px 14px" }}>Start →</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── TOPICS PAGE ────────────────────────────────────────────────────────────
  const renderTopics = () => {
    const filtered = searchTerm
      ? TOPICS_DATA.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.desc.toLowerCase().includes(searchTerm.toLowerCase()))
      : TOPICS_DATA;
    return (
      <div>
        <div className="page-title">Interview Topics</div>
        <div className="page-subtitle">Choose a topic to start learning with AI-generated content.</div>
        <div className="topics-grid">
          {filtered.map(t => {
            const pct = topicProgress[t.title] || 0;
            return (
              <div key={t.title} className="topic-card" style={{ "--accent-color": t.color }}
                onClick={() => { setSelectedTopic(t.title); setActivePage("TopicDetail"); }}>
                <div className="tag-pill">{t.tag}</div>
                <div className="topic-icon">{t.icon}</div>
                <div className="topic-title">{t.title}</div>
                <div className="topic-desc">{t.desc}</div>
                <div className="topic-progress-row">
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: pct + "%", background: t.color }} />
                  </div>
                  <span className="topic-pct" style={{ color: t.color }}>{pct}%</span>
                </div>
                <button className="btn btn-blue" style={{ marginTop: 14, fontSize: 12, padding: "7px 16px" }}>Start Learning →</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── TOPIC DETAIL PAGE (AI-powered) ────────────────────────────────────────
  const renderTopicDetail = () => {
    const topic = TOPICS_DATA.find(t => t.title === selectedTopic);
    const done  = completedQuestions[selectedTopic] || [];

    // Loading state
    if (topicLoading) {
      return (
        <div>
          <button onClick={() => setActivePage("Topics")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, fontFamily: "var(--font)", marginBottom: 16 }}>← Back to Topics</button>
          <div className="ai-loading-block">
            <div className="ai-spinner" />
            <div className="ai-loading-text">🤖 AI is generating content for {selectedTopic}...</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>This may take 5–10 seconds</div>
          </div>
        </div>
      );
    }

    // Error state
    if (topicError) {
      return (
        <div>
          <button onClick={() => setActivePage("Topics")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, fontFamily: "var(--font)", marginBottom: 16 }}>← Back to Topics</button>
          <div className="card" style={{ maxWidth: 500, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{ color: "var(--red)", marginBottom: 8, fontWeight: 600 }}>AI Content Failed to Load</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>{topicError}</div>
            <button className="btn btn-blue" onClick={() => { setTopicError(null); setTopicLoading(true); AI.post("/topic", { topic: selectedTopic }).then(res => setTopicContent(res.data.data)).catch(() => setTopicError("Still failing. Check backend.")).finally(() => setTopicLoading(false)); }}>🔄 Retry</button>
          </div>
        </div>
      );
    }

    const content = topicContent;

    return (
      <div style={{ maxWidth: 760 }}>
        <button onClick={() => setActivePage("Topics")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, fontFamily: "var(--font)", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Topics
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div className="page-title" style={{ marginBottom: 0 }}>{topic?.icon} {selectedTopic}</div>
          <span style={{ fontSize: 11, background: "rgba(59,130,246,0.12)", color: "var(--blue)", padding: "3px 10px", borderRadius: 99, fontWeight: 700 }}>🤖 AI Generated</span>
        </div>
        <div className="page-subtitle">{content?.overview || "AI-generated interview preparation content."}</div>

        {/* Key Concepts */}
        {content?.keyConcepts?.length > 0 && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: "var(--blue)" }}>📚 Key Concepts</div>
            {content.keyConcepts.map((kc, i) => (
              <div key={i} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: i < content.keyConcepts.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{kc.concept}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 6 }}>{kc.explanation}</div>
                {kc.example && <pre className="code-block">{kc.example}</pre>}
              </div>
            ))}
          </div>
        )}

        {/* AI Interview Questions */}
        {content?.interviewQuestions?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "var(--amber)" }}>🎯 AI Interview Questions</div>
            {content.interviewQuestions.map((q, i) => {
              const isOpen = selectedQuestion === `ai-q-${i}`;
              const qKey = `ai-${selectedTopic}-${i}`;
              const isDone = (completedQuestions[selectedTopic] || []).includes(qKey);
              return (
                <div className={`question-card ${isOpen ? "expanded" : ""}`} key={i} onClick={() => setSelectedQuestion(isOpen ? null : `ai-q-${i}`)}>
                  <span className={`diff-badge diff-${(q.difficulty || "medium").toLowerCase()}`}>{q.difficulty || "Medium"}</span>
                  <div className="question-text">{q.question}</div>
                  {isOpen && (
                    <>
                      <div className="answer-box">{q.answer}</div>
                      <button className={`mark-done-btn ${isDone ? "done" : ""}`}
                        onClick={e => {
                          e.stopPropagation();
                          setCompletedQuestions(prev => {
                            const current = prev[selectedTopic] || [];
                            return isDone
                              ? { ...prev, [selectedTopic]: current.filter(x => x !== qKey) }
                              : { ...prev, [selectedTopic]: [...current, qKey] };
                          });
                          if (!isDone) { const savedToken = localStorage.getItem("token"); logActivity(savedToken, "topic_studied", "Studied " + selectedTopic, null, selectedTopic); }
                        }}>
                        {isDone ? "✅ Completed" : "Mark as Done"}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Coding Problems */}
        {content?.codingProblems?.length > 0 && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: "var(--purple)" }}>💻 Practice Problems</div>
            {content.codingProblems.map((p, i) => (
              <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < content.codingProblems.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.title}</div>
                  <span className={`diff-badge diff-${(p.difficulty || "medium").toLowerCase()}`}>{p.difficulty}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.description}</div>
                {p.hint && <div style={{ marginTop: 8, fontSize: 12, color: "var(--amber)", background: "rgba(245,158,11,0.08)", borderRadius: "var(--radius-sm)", padding: "8px 12px", borderLeft: "3px solid var(--amber)" }}>💡 Hint: {p.hint}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Important Points */}
        {content?.importantPoints?.length > 0 && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "var(--green)" }}>⚡ Important Points to Remember</div>
            {content.importantPoints.map((pt, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <span style={{ color: "var(--green)", flexShrink: 0, marginTop: 1 }}>✓</span> {pt}
              </div>
            ))}
          </div>
        )}

        {/* Fallback: static questions */}
        {!content && (
          <>
            {(TOPIC_QUESTIONS[selectedTopic] || []).map((q, i) => {
              const isDone = (completedQuestions[selectedTopic] || []).includes(i);
              const isOpen = selectedQuestion === i;
              return (
                <div className={`question-card ${isOpen ? "expanded" : ""}`} key={i} onClick={() => setSelectedQuestion(isOpen ? null : i)}>
                  <span className={`diff-badge diff-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                  <div className="question-text">{q.question}</div>
                  {isOpen && (
                    <>
                      <div className="answer-box">{q.answer}</div>
                      <button className={`mark-done-btn ${isDone ? "done" : ""}`}
                        onClick={e => { e.stopPropagation(); setCompletedQuestions(prev => { const current = prev[selectedTopic] || []; return isDone ? { ...prev, [selectedTopic]: current.filter(x => x !== i) } : { ...prev, [selectedTopic]: [...current, i] }; }); }}>
                        {isDone ? "✅ Completed" : "Mark as Done"}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  };

  // ── PRACTICE PAGE ──────────────────────────────────────────────────────────
  const renderPractice = () => (
    <div>
      <div className="page-title">Practice Arena</div>
      <div className="page-subtitle">Choose your practice mode and start training with AI.</div>
      <div className="practice-grid">
        {[
          { icon: "⚡", title: "Daily Coding Challenge", desc: "AI generates a fresh coding problem. Submit your solution for AI code review.", action: "Start Challenge", page: "DailyChallenge" },
          { icon: "🎙️", title: "Mock Interview", desc: "AI acts as a real interviewer — asks questions, evaluates answers, gives final report.", action: "Start Mock", page: "MockInterview" },
          { icon: "📝", title: "MCQ Quiz", desc: "AI generates 10 MCQs dynamically based on the topic you choose.", action: "Start Quiz", page: "Quiz" },
          { icon: "🤝", title: "HR Practice", desc: "AI analyzes your HR answers, improves communication and gives professional suggestions.", action: "Start HR Round", page: "HRPractice" },
        ].map(card => (
          <div className="practice-card" key={card.title} onClick={() => {
            if (card.page === "MockInterview") { setMockFinished(false); setMockStarted(false); setMockFinalReport(null); setMockHistory([]); setMockScores([]); setMockQuestionNum(1); setCurrentMockQ(null); setMockAnswer(""); setMockEvalResult(null); }
            if (card.page === "DailyChallenge") { setAiChallenge(null); setChallengeScore(null); setCodeReview(null); setChallengeCode(""); }
            if (card.page === "Quiz") { setQuizStarted(false); setShowQuizResults(false); setCurrentQuizIndex(0); setQuizScore(0); setSelectedOption(null); setIsOptionSubmitted(false); setAiQuizQuestions([]); setQuizExplanation(""); }
            if (card.page === "HRPractice") { setHrSessionStarted(false); setHrAnswer(""); setHrAnalysis(null); setHrQuestionIndex(0); }
            setActivePage(card.page);
          }}>
            <div className="practice-card-icon">{card.icon}</div>
            <div className="practice-card-title">{card.title}</div>
            <div className="practice-card-desc">{card.desc}</div>
            <button className="btn btn-blue">{card.action} →</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── MOCK INTERVIEW PAGE (AI-powered) ───────────────────────────────────────
  const renderMockInterview = () => {
    // Final Report Screen
    if (mockFinished) {
      if (mockReportLoading) {
        return (
          <div className="mock-container">
            <div className="ai-loading-block">
              <div className="ai-spinner" />
              <div className="ai-loading-text">🤖 AI is generating your performance report...</div>
            </div>
          </div>
        );
      }
      const report = mockFinalReport;
      const scoreColor = report?.overallScore >= 80 ? "var(--green)" : report?.overallScore >= 60 ? "var(--amber)" : "var(--red)";
      return (
        <div className="mock-container">
          <div className="report-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Interview Complete!</div>
            <div style={{ color: "var(--text-secondary)", marginBottom: 20 }}>Here's your AI-generated performance report</div>
            <div className="results-score" style={{ color: scoreColor }}>{report?.overallScore ?? "—"}/100</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: scoreColor, marginBottom: 8 }}>Grade: {report?.grade}</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 24px" }}>{report?.summary}</div>
          </div>

          {/* Topic Breakdown */}
          {report?.topicBreakdown?.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title">📊 Topic Breakdown</div>
              {report.topicBreakdown.map((t, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600 }}>{t.topic}</span>
                    <span style={{ color: t.score >= 80 ? "var(--green)" : t.score >= 60 ? "var(--amber)" : "var(--red)", fontWeight: 700 }}>{t.score}/100</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: t.score + "%", background: t.score >= 80 ? "var(--green)" : t.score >= 60 ? "var(--amber)" : "var(--red)" }} />
                  </div>
                  {t.comment && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{t.comment}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Strong / Weak */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            {report?.strongTopics?.length > 0 && (
              <div className="card">
                <div style={{ fontWeight: 700, color: "var(--green)", marginBottom: 10, fontSize: 14 }}>💪 Strong Areas</div>
                {report.strongTopics.map((t, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>✓ {t}</div>)}
              </div>
            )}
            {report?.weakTopics?.length > 0 && (
              <div className="card">
                <div style={{ fontWeight: 700, color: "var(--amber)", marginBottom: 10, fontSize: 14 }}>📌 Areas to Improve</div>
                {report.weakTopics.map((t, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>→ {t}</div>)}
              </div>
            )}
          </div>

          {/* Recommendations */}
          {report?.recommendations?.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="section-title">💡 AI Recommendations</div>
              {report.recommendations.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--blue)", flexShrink: 0 }}>{i + 1}.</span> {r}
                </div>
              ))}
              {report.nextSteps && <div style={{ marginTop: 12, fontSize: 13, color: "var(--cyan)", fontWeight: 600, borderTop: "1px solid var(--border)", paddingTop: 12 }}>🚀 Next Step: {report.nextSteps}</div>}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn btn-blue" onClick={startMockInterview}>Try Again →</button>
            <button className="btn btn-ghost" onClick={() => setActivePage("Practice")}>Back to Practice</button>
          </div>
        </div>
      );
    }

    // Start Screen
    if (!mockStarted) {
      return (
        <div className="mock-container">
          <div className="page-title">🎙️ Mock Interview</div>
          <div className="page-subtitle">AI will act as your interviewer — ask 7 questions, evaluate your answers, and give a full report.</div>
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to Begin?</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 8 }}>7 AI-generated questions from DSA, DBMS, OS, CN and HR</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>⏱ 2 minutes per question · AI feedback on every answer · Final performance report</div>
            <button className="btn btn-blue" style={{ padding: "12px 32px", fontSize: 15 }} onClick={startMockInterview}>Start Interview →</button>
          </div>
        </div>
      );
    }

    // Question Loading
    if (mockQLoading) {
      return (
        <div className="mock-container">
          <div className="ai-loading-block">
            <div className="ai-spinner" />
            <div className="ai-loading-text">🤖 AI is preparing question {mockQuestionNum}...</div>
          </div>
        </div>
      );
    }

    // Active Interview
    return (
      <div className="mock-container">
        <div className="mock-header">
          <div className="page-title" style={{ marginBottom: 0 }}>Mock Interview</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="question-counter">Q {mockQuestionNum} / {mockTotalQ}</div>
            <div className={`timer-badge ${timer <= 30 ? "urgent" : ""}`}>
              ⏱ {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
            </div>
          </div>
        </div>

        {currentMockQ && (
          <div className="mock-question-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="mock-q-label">Question {mockQuestionNum} — {currentMockQ.topic}</div>
              <span className={`diff-badge diff-${(currentMockQ.difficulty || "medium").toLowerCase()}`}>{currentMockQ.difficulty}</span>
            </div>
            <div className="mock-q-text">{currentMockQ.question}</div>
          </div>
        )}

        <textarea
          className="mock-answer-area"
          placeholder="Type your detailed answer here..."
          value={mockAnswer}
          onChange={e => setMockAnswer(e.target.value)}
          disabled={!!mockEvalResult}
        />

        {/* AI Feedback */}
        {mockEvalLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", color: "var(--text-secondary)", fontSize: 14 }}>
            <div className="ai-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Evaluating your answer...
          </div>
        )}

        {mockEvalResult && (
          <div className="feedback-card" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="feedback-label">🤖 AI Evaluation</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: mockEvalResult.score >= 80 ? "var(--green)" : mockEvalResult.score >= 60 ? "var(--amber)" : "var(--red)" }}>{mockEvalResult.score}/100</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)" }}>Grade {mockEvalResult.grade}</span>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>{mockEvalResult.verdict}</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>{mockEvalResult.feedback}</div>
            {mockEvalResult.coveredPoints?.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", marginBottom: 5, textTransform: "uppercase" }}>✓ You covered</div>
                {mockEvalResult.coveredPoints.map((p, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 3 }}>• {p}</div>)}
              </div>
            )}
            {mockEvalResult.missedPoints?.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", marginBottom: 5, textTransform: "uppercase" }}>→ You missed</div>
                {mockEvalResult.missedPoints.map((p, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 3 }}>• {p}</div>)}
              </div>
            )}
            {mockEvalResult.improvedAnswer && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(59,130,246,0.08)", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--blue)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", marginBottom: 5, textTransform: "uppercase" }}>Model Answer</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{mockEvalResult.improvedAnswer}</div>
              </div>
            )}
            {mockEvalResult.encouragement && <div style={{ marginTop: 10, fontSize: 13, color: "var(--cyan)", fontStyle: "italic" }}>{mockEvalResult.encouragement}</div>}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          {!mockEvalResult ? (
            <button className="btn btn-blue" onClick={handleMockSubmitAnswer} disabled={mockEvalLoading || !mockAnswer.trim()}>
              {mockEvalLoading ? "Evaluating..." : "Get AI Feedback"}
            </button>
          ) : (
            <button className="btn btn-blue" onClick={handleMockNextQuestion}>
              {mockQuestionNum >= mockTotalQ ? "Finish & Get Report 🏆" : "Next Question →"}
            </button>
          )}
          {!mockEvalResult && (
            <button className="btn btn-ghost" onClick={handleMockNextQuestion}>
              {mockQuestionNum >= mockTotalQ ? "Finish" : "Skip →"}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ── QUIZ PAGE (AI-powered) ─────────────────────────────────────────────────
  const renderQuiz = () => {
    if (showQuizResults) {
      return (
        <div className="card results-screen" style={{ maxWidth: 560 }}>
          <div style={{ fontSize: 40 }}>🏆</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>Quiz Complete!</div>
          <div className="results-score" style={{ color: quizScore >= aiQuizQuestions.length * 0.7 ? "var(--green)" : "var(--amber)" }}>{quizScore}/{aiQuizQuestions.length}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 8 }}>
            {quizScore === aiQuizQuestions.length ? "Perfect score! Outstanding! 🎉" : quizScore >= aiQuizQuestions.length * 0.7 ? "Great job! Keep it up." : "Review the concepts and try again."}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Topic: {selectedQuizTopic}</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn btn-blue" onClick={startAIQuiz}>Try Again</button>
            <button className="btn btn-ghost" onClick={() => setActivePage("Practice")}>Back to Practice</button>
          </div>
        </div>
      );
    }

    if (!quizStarted) {
      const quizTopics = ["Mixed (DBMS, OS, Computer Networks, OOPs)", "DBMS", "Operating Systems", "Computer Networks", "OOPs", "DSA Fundamentals", "Aptitude"];
      return (
        <div>
          <div className="page-title">MCQ Quiz</div>
          <div className="page-subtitle">AI generates 10 fresh questions every time — no repeats!</div>
          <div className="card" style={{ maxWidth: 560, padding: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12, textAlign: "center" }}>📝</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, textAlign: "center" }}>Choose a Topic</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20, justifyContent: "center" }}>
              {quizTopics.map(t => (
                <button key={t} onClick={() => setSelectedQuizTopic(t)}
                  style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", border: `1px solid ${selectedQuizTopic === t ? "var(--blue)" : "var(--border)"}`, background: selectedQuizTopic === t ? "rgba(59,130,246,0.15)" : "var(--bg-elevated)", color: selectedQuizTopic === t ? "var(--blue)" : "var(--text-secondary)", transition: "all 0.15s" }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button className="btn btn-blue" style={{ padding: "11px 28px" }} onClick={startAIQuiz} disabled={quizLoading}>
                {quizLoading ? "🤖 Generating Quiz..." : "Begin AI Quiz →"}
              </button>
            </div>
            {quizLoading && <div style={{ textAlign: "center", marginTop: 14, color: "var(--text-muted)", fontSize: 13 }}>AI is generating 10 questions on {selectedQuizTopic}...</div>}
          </div>
        </div>
      );
    }

    const q = aiQuizQuestions[currentQuizIndex];
    if (!q) return null;

    return (
      <div style={{ maxWidth: 620 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="page-title" style={{ marginBottom: 0 }}>MCQ Quiz</div>
          <div className="question-counter">Q {currentQuizIndex + 1} / {aiQuizQuestions.length}</div>
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--blue)", marginBottom: 8 }}>{q.subject || selectedQuizTopic}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5, flex: 1 }}>{q.question}</div>
            <span className={`diff-badge diff-${(q.difficulty || "medium").toLowerCase()}`}>{q.difficulty}</span>
          </div>
        </div>
        {q.options.map((opt, i) => {
          let cls = "quiz-option";
          if (isOptionSubmitted) {
            if (i === q.correctIndex) cls += " correct";
            else if (i === selectedOption && i !== q.correctIndex) cls += " wrong";
          } else if (i === selectedOption) cls += " selected";
          return (
            <div key={i} className={cls} onClick={() => !isOptionSubmitted && setSelectedOption(i)}>
              <div className="option-letter">{["A", "B", "C", "D"][i]}</div>
              {opt.replace(/^[A-D]\.\s*/, "")}
            </div>
          );
        })}
        {isOptionSubmitted && quizExplanation && (
          <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 10, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700, color: "var(--blue)" }}>💡 Explanation: </span>{quizExplanation}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {!isOptionSubmitted ? (
            <button className="btn btn-blue" onClick={handleQuizSubmit} disabled={selectedOption === null}>Submit Answer</button>
          ) : (
            <button className="btn btn-blue" onClick={handleQuizNext}>
              {currentQuizIndex >= aiQuizQuestions.length - 1 ? "See Results" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ── DAILY CHALLENGE PAGE (AI-powered) ──────────────────────────────────────
  const renderDailyChallenge = () => {
    return (
      <div style={{ maxWidth: 720 }}>
        <button onClick={() => setActivePage("Practice")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, fontFamily: "var(--font)", marginBottom: 16 }}>
          ← Back to Practice
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div className="page-title" style={{ marginBottom: 0 }}>Daily Coding Challenge</div>
          <span style={{ background: "rgba(59,130,246,0.12)", color: "var(--blue)", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", letterSpacing: 0.8 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
          </span>
        </div>
        <div className="page-subtitle">AI generates a unique problem every time. Submit your code for AI review!</div>

        {/* Difficulty + Generate */}
        {!aiChallenge && !challengeLoading && (
          <div className="card" style={{ textAlign: "center", padding: 32, marginBottom: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Choose Difficulty</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
              {["Easy", "Medium", "Hard"].map(d => (
                <button key={d} onClick={() => setChallengeDifficulty(d)}
                  style={{ padding: "8px 20px", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", border: `1px solid ${challengeDifficulty === d ? "var(--blue)" : "var(--border)"}`, background: challengeDifficulty === d ? "rgba(59,130,246,0.15)" : "var(--bg-elevated)", color: challengeDifficulty === d ? "var(--blue)" : "var(--text-secondary)", transition: "all 0.15s" }}>
                  {d}
                </button>
              ))}
            </div>
            <button className="btn btn-blue" style={{ padding: "11px 28px" }} onClick={fetchAIChallenge}>Generate Challenge →</button>
          </div>
        )}

        {challengeLoading && (
          <div className="ai-loading-block" style={{ minHeight: 200 }}>
            <div className="ai-spinner" />
            <div className="ai-loading-text">🤖 AI is generating your {challengeDifficulty} challenge...</div>
          </div>
        )}

        {/* Problem Card */}
        {aiChallenge && (
          <>
            <div className="card" style={{ marginBottom: 16, borderColor: "rgba(59,130,246,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 800 }}>{aiChallenge.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Topic: {aiChallenge.topic}</div>
                </div>
                <span className={`diff-badge diff-${aiChallenge.difficulty?.toLowerCase()}`}>{aiChallenge.difficulty}</span>
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 14 }}>{aiChallenge.description}</div>

              {aiChallenge.constraints?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>Constraints</div>
                  {aiChallenge.constraints.map((c, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>• {c}</div>)}
                </div>
              )}

              {aiChallenge.examples?.map((ex, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-sm)", padding: "12px 14px", borderLeft: "3px solid var(--blue)", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", marginBottom: 6, textTransform: "uppercase" }}>Example {i + 1}</div>
                  <pre style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
  {`Input: ${typeof ex.input === 'object' ? JSON.stringify(ex.input) : ex.input ?? ''}
Output: ${typeof ex.output === 'object' ? JSON.stringify(ex.output) : ex.output ?? ''}${ex.explanation ? `\nExplanation: ${ex.explanation}` : ''}`}
</pre>
                </div>
              ))}

              {challengeStarted && aiChallenge.hint && (
                <div style={{ background: "rgba(245,158,11,0.08)", borderRadius: "var(--radius-sm)", padding: "10px 14px", borderLeft: "3px solid var(--amber)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", marginBottom: 4, textTransform: "uppercase" }}>💡 Hint</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{aiChallenge.hint}</div>
                </div>
              )}
            </div>

            {/* Code Editor */}
            {!codeReview && (
              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Your Solution (JavaScript)</div>
                <textarea
                  className="mock-answer-area"
                  style={{ fontFamily: "var(--mono)", fontSize: 13, minHeight: 200 }}
                  placeholder={"// Write your solution here\nfunction solve() {\n  // your code\n}"}
                  value={challengeCode}
                  onChange={e => setChallengeCode(e.target.value)}
                />
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  {!challengeStarted && (
                    <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setChallengeStarted(true)}>💡 Show Hint</button>
                  )}
                  <button className="btn btn-blue" style={{ fontSize: 13 }} onClick={handleCodeReview} disabled={reviewLoading || !challengeCode.trim()}>
                    {reviewLoading ? "🤖 AI is reviewing..." : "✅ Submit for AI Review"}
                  </button>
                  <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => { setAiChallenge(null); setChallengeStarted(false); setChallengeCode(""); }}>Generate New Problem</button>
                </div>
              </div>
            )}

            {reviewLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", color: "var(--text-secondary)", fontSize: 14 }}>
                <div className="ai-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> AI is reviewing your code...
              </div>
            )}

            {/* Code Review Result */}
            {codeReview && (
              <div className="card" style={{ marginBottom: 16, borderColor: codeReview.overallScore >= 70 ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--green)" }}>🤖 AI Code Review</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: codeReview.overallScore >= 80 ? "var(--green)" : codeReview.overallScore >= 60 ? "var(--amber)" : "var(--red)" }}>{codeReview.overallScore}/100</span>
                    <span style={{ fontSize: 13, fontWeight: 700, background: "rgba(16,185,129,0.1)", color: "var(--green)", padding: "4px 10px", borderRadius: 99 }}>{codeReview.verdict}</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {[
                    { label: "Time Complexity", value: codeReview.timeComplexity, color: "var(--blue)" },
                    { label: "Space Complexity", value: codeReview.spaceComplexity, color: "var(--purple)" },
                  ].map(m => (
                    <div key={m.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-sm)", padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: m.color, fontFamily: "var(--mono)" }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {codeReview.correctness && <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 12 }}>{codeReview.correctness}</div>}

                {codeReview.strengths?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", marginBottom: 6, textTransform: "uppercase" }}>✓ Strengths</div>
                    {codeReview.strengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>• {s}</div>)}
                  </div>
                )}

                {codeReview.improvements?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", marginBottom: 6, textTransform: "uppercase" }}>→ Improvements</div>
                    {codeReview.improvements.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>• {s}</div>)}
                  </div>
                )}

                {codeReview.sampleSolution && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", marginBottom: 6, textTransform: "uppercase" }}>Optimized Solution</div>
                    <pre className="code-block">{codeReview.sampleSolution}</pre>
                  </div>
                )}

                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                  <button className="btn btn-blue" onClick={() => { setAiChallenge(null); setCodeReview(null); setChallengeCode(""); setChallengeStarted(false); }}>Generate New Challenge</button>
                  <button className="btn btn-ghost" onClick={() => setActivePage("Practice")}>Back to Practice</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // ── HR PRACTICE PAGE (AI-powered) ──────────────────────────────────────────
  const renderHRPractice = () => {
    if (!hrSessionStarted) {
      return (
        <div style={{ maxWidth: 620 }}>
          <button onClick={() => setActivePage("Practice")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, fontFamily: "var(--font)", marginBottom: 16 }}>
            ← Back to Practice
          </button>
          <div className="page-title">🤝 HR Practice</div>
          <div className="page-subtitle">AI acts as an HR interviewer — analyzes your answers and gives professional coaching.</div>
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{HR_QUESTIONS.length} HR Questions</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Practice common HR interview questions. After each answer, AI will:<br />
              score your communication · suggest improvements · show a model answer
            </div>
            <button className="btn btn-blue" style={{ padding: "11px 28px" }} onClick={() => { setHrSessionStarted(true); setHrQuestionIndex(0); setHrAnswer(""); setHrAnalysis(null); }}>
              Start HR Session →
            </button>
          </div>
        </div>
      );
    }

    const currentHrQ = HR_QUESTIONS[hrQuestionIndex];

    return (
      <div style={{ maxWidth: 720 }}>
        <button onClick={() => setActivePage("Practice")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, fontFamily: "var(--font)", marginBottom: 16 }}>
          ← Back to Practice
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div className="page-title" style={{ marginBottom: 0 }}>HR Practice</div>
          <div className="question-counter">Q {hrQuestionIndex + 1} / {HR_QUESTIONS.length}</div>
        </div>
        <div className="page-subtitle">Answer naturally. AI will give you detailed coaching.</div>

        {/* Question */}
        <div className="mock-question-card" style={{ marginBottom: 16 }}>
          <div className="mock-q-label">HR Question {hrQuestionIndex + 1}</div>
          <div className="mock-q-text">{currentHrQ}</div>
        </div>

        {/* Answer */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Your Answer</div>
          <textarea
            className="mock-answer-area"
            placeholder="Type your HR answer here..."
            value={hrAnswer}
            onChange={e => setHrAnswer(e.target.value)}
            disabled={hrAnalysisLoading || !!hrAnalysis}
          />
          {!hrAnalysis && (
            <button className="btn btn-blue" style={{ fontSize: 13 }} onClick={handleHRAnalyze} disabled={hrAnalysisLoading || !hrAnswer.trim()}>
              {hrAnalysisLoading ? "🤖 AI is analyzing..." : "🤖 Get AI Coaching"}
            </button>
          )}
          {hrAnalysisLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", color: "var(--text-secondary)", fontSize: 13 }}>
              <div className="ai-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing your communication...
            </div>
          )}
        </div>

        {/* AI Analysis Result */}
        {hrAnalysis && (
          <div>
            {/* Scores */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Overall", value: hrAnalysis.score, color: "#3b82f6" },
                { label: "Communication", value: hrAnalysis.communicationScore, color: "#10b981" },
                { label: "Content", value: hrAnalysis.contentScore, color: "#8b5cf6" },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: "center", padding: 16 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}/100</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div className="card" style={{ marginBottom: 14, borderColor: "rgba(16,185,129,0.2)" }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{hrAnalysis.verdict}</div>

              {hrAnalysis.strengths?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", marginBottom: 5, textTransform: "uppercase" }}>✓ Strengths</div>
                  {hrAnalysis.strengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 3 }}>• {s}</div>)}
                </div>
              )}
              {hrAnalysis.improvements?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", marginBottom: 5, textTransform: "uppercase" }}>→ What to Improve</div>
                  {hrAnalysis.improvements.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 3 }}>• {s}</div>)}
                </div>
              )}
              {hrAnalysis.grammarTips?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", marginBottom: 5, textTransform: "uppercase" }}>✍ Grammar & Phrasing</div>
                  {hrAnalysis.grammarTips.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 3 }}>• {s}</div>)}
                </div>
              )}
              {hrAnalysis.confidenceTips?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--cyan)", marginBottom: 5, textTransform: "uppercase" }}>💪 Confidence Tips</div>
                  {hrAnalysis.confidenceTips.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 3 }}>• {s}</div>)}
                </div>
              )}
              {hrAnalysis.keywordsToUse?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", marginBottom: 5, textTransform: "uppercase" }}>🔑 Power Words to Use</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {hrAnalysis.keywordsToUse.map((k, i) => <span key={i} className="skill-pill" style={{ fontSize: 11 }}>{k}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Improved Answer */}
            {hrAnalysis.improvedAnswer && (
              <div className="improvement-card" style={{ marginBottom: 16 }}>
                <div className="improvement-label">✨ AI-Polished Answer</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>{hrAnalysis.improvedAnswer}</div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10 }}>
              {hrQuestionIndex < HR_QUESTIONS.length - 1 ? (
                <button className="btn btn-blue" onClick={() => { setHrQuestionIndex(i => i + 1); setHrAnswer(""); setHrAnalysis(null); }}>
                  Next Question →
                </button>
              ) : (
                <button className="btn btn-green" onClick={() => { setHrSessionStarted(false); setHrAnswer(""); setHrAnalysis(null); setHrQuestionIndex(0); }}>
                  🏁 Complete Session
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => { setHrAnswer(""); setHrAnalysis(null); }}>Try This Question Again</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── FEEDBACK PAGE ──────────────────────────────────────────────────────────
  const renderFeedback = () => {
    const items = [
      { key: "technical", tag: "Technical", tagColor: "#3b82f6", title: "Technical Mock Workspace", desc: "Performance based on your mock interviews and coding practice logs.", gradient: "rgba(59,130,246,0.08)", action: "MockInterview", actionLabel: "Start Mock →", data: feedbackData.technical },
      { key: "behavioral", tag: "Behavioral", tagColor: "#10b981", title: "Behavioral HR Suite", desc: "Communication skills, STAR framework answers and conversational delivery.", gradient: "rgba(16,185,129,0.08)", action: "HRPractice", actionLabel: "Start HR Round →", data: feedbackData.behavioral },
      { key: "coreConcepts", tag: "Core CS", tagColor: "#f59e0b", title: "Core Concepts Assessment", desc: "Your DBMS, OS and CN aptitude scores across all completed quizzes.", gradient: "rgba(245,158,11,0.08)", action: "Quiz", actionLabel: "Take Quiz →", data: feedbackData.coreConcepts },
    ];
    return (
      <div>
        <div className="page-title">Feedback Analytics</div>
        <div className="page-subtitle">Track your interview performance and identify weak areas.</div>
        {items.map(item => {
          const { data, tagColor } = item;
          const score    = data?.score ?? null;
          const maxScore = data?.maxScore ?? 10;
          const sessions = data?.sessionCount ?? 0;
          const pct      = score !== null ? Math.min(Math.round((score / maxScore) * 100), 100) : 0;
          return (
            <div className="feedback-analytics-card" key={item.key} style={{ background: `linear-gradient(135deg, ${item.gradient} 0%, var(--bg-card) 100%)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="feedback-tag" style={{ color: tagColor }}>{item.tag}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{sessions > 0 ? `${sessions} session${sessions > 1 ? "s" : ""}` : "No sessions yet"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div className="score-ring" style={{ background: `${tagColor}18`, color: tagColor, border: `2px solid ${tagColor}30`, minWidth: 70 }}>
                  {score !== null ? `${score}/${maxScore}` : "—"}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="feedback-title">{item.title}</div>
                  {score !== null ? (
                    <>
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="progress-bar-track" style={{ flex: 1, maxWidth: 200 }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: tagColor }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: tagColor }}>{pct}%</span>
                      </div>
                      {data.lastUpdated && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Last attempt: {new Date(data.lastUpdated).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>}
                    </>
                  ) : (
                    <div style={{ fontSize: 13, color: "var(--amber)", fontWeight: 600, marginTop: 4 }}>⏳ No score yet — complete a session to see your analytics</div>
                  )}
                </div>
              </div>
              <div className="feedback-desc" style={{ marginTop: 14 }}>{item.desc}</div>
              <button className="btn btn-blue" style={{ marginTop: 14, fontSize: 12, padding: "7px 16px" }} onClick={() => setActivePage(item.action)}>{item.actionLabel}</button>
            </div>
          );
        })}
      </div>
    );
  };

  // ── PROGRESS PAGE ──────────────────────────────────────────────────────────
  const renderProgress = () => {
    const topicBars = [
      { name: "Data Structures & Algorithms", done: completedCounts.DSA, total: topicTotals.DSA, pct: topicProgress["DSA"], color: "#3b82f6", gradient: "linear-gradient(90deg,#3b82f6,#60a5fa)" },
      { name: "Database Management Systems",  done: completedCounts.DBMS, total: topicTotals.DBMS, pct: topicProgress["DBMS"], color: "#10b981", gradient: "linear-gradient(90deg,#10b981,#34d399)" },
      { name: "Operating Systems",            done: completedCounts.OS,   total: topicTotals.OS,   pct: topicProgress["Operating System"], color: "#f59e0b", gradient: "linear-gradient(90deg,#f59e0b,#fbbf24)" },
      { name: "Computer Networks",            done: completedCounts.CN,   total: topicTotals.CN,   pct: topicProgress["Computer Networks"], color: "#8b5cf6", gradient: "linear-gradient(90deg,#8b5cf6,#a78bfa)" },
      { name: "HR Interview",                 done: completedCounts.HR,   total: topicTotals.HR,   pct: topicProgress["HR Interview"], color: "#ec4899", gradient: "linear-gradient(90deg,#ec4899,#f472b6)" },
    ];
    return (
      <div>
        <div className="page-title">Learning Progress</div>
        <div className="page-subtitle">Track your preparation journey across all topics.</div>
        <div className="progress-overview">
          <div className="card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <ProgressRing percent={overallPercent} size={96} stroke={8} color="#3b82f6" />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <span style={{ fontSize: 18, fontWeight: 800 }}>{overallPercent}%</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#60a5fa" }}>{overallPercent}% Complete</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>Overall preparation progress</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6 }}>{totalCompleted} / {totalQuestions} tasks finished</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Topics Started", value: Object.values(completedCounts).filter(v => v > 0).length, color: "#3b82f6" },
              { label: "Concepts Done",  value: totalCompleted, color: "#10b981" },
              { label: "Quiz Score",     value: `${quizScore}/${aiQuizQuestions.length || 10}`, color: "#f59e0b" },
              { label: "Day Streak",     value: "🔥 " + currentStreak, color: "#ec4899" },
            ].map(s => (
              <div className="card" key={s.label} style={{ textAlign: "center", padding: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="section-title">📚 Topic Progress</div>
          {topicBars.map(t => (
            <div className="topic-progress-row" key={t.name}>
              <div className="topic-progress-header">
                <span className="topic-progress-name">{t.name}</span>
                <span className="topic-progress-count">{t.done} / {t.total} Tasks</span>
              </div>
              <div className="progress-track-lg">
                <div className="progress-fill-lg" style={{ width: `${t.pct || 0}%`, background: t.gradient }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── PROFILE PAGE ───────────────────────────────────────────────────────────
  const renderProfile = () => (
    <div>
      <div className="profile-banner">
        <div className="profile-avatar-lg">{userInitials}</div>
<div style={{ flex: 1 }}>
  <div className="profile-name">{userName}</div>
</div>
        <button
          onClick={() => {
            localStorage.removeItem("token"); localStorage.removeItem("demoUser");
            setToken(null); setUser(null); setCompletedQuestions({}); setCurrentStreak(0); setQuizScore(0);
            setAnalytics({ practiceSessions: 0, feedbackReceived: 0, recentActivity: [] });
            setFeedbackData({ technical: { score: null, maxScore: 10, sessionCount: 0, lastUpdated: null }, behavioral: { score: null, maxScore: 10, sessionCount: 0, lastUpdated: null }, coreConcepts: { score: null, maxScore: 10, sessionCount: 0, lastUpdated: null } });
            setActivePage("Dashboard");
          }}
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", padding: "8px 16px", borderRadius: "var(--radius-sm)", color: "#f87171", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "var(--font)", flexShrink: 0 }}>
          Sign Out
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Concepts Mastered", value: totalCompleted, color: "#60a5fa" },
          { label: "Quizzes Taken", value: quizScore > 0 ? 1 : 0, color: "#34d399" },
          { label: "Day Streak", value: "🔥 " + currentStreak, color: "#fbbf24" },
        ].map(s => (
          <div className="card" key={s.label} style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-title">🎯 Topic Progress Summary</div>
        {TOPICS_DATA.map(t => {
          const pct = topicProgress[t.title] || 0;
          return (
            <div key={t.title} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <span style={{ fontWeight: 600 }}>{t.icon} {t.title}</span>
                <span style={{ color: t.color, fontWeight: 700 }}>{pct}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: pct + "%", background: t.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // ROUTING & LAYOUT
  // ═══════════════════════════════════════════════════════════════════════════

  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "Topics",    label: "Topics",    icon: <FaBook /> },
    { id: "Practice",  label: "Practice",  icon: <FaDumbbell /> },
    { id: "Feedback",  label: "Feedback",  icon: <FaChartLine /> },
    { id: "Progress",  label: "Progress",  icon: <FaRocket /> },
    { id: "Profile",   label: "Profile",   icon: <FaUser /> },
  ];

  const pageMap = {
    Dashboard:      renderDashboard,
    Topics:         renderTopics,
    TopicDetail:    renderTopicDetail,
    Practice:       renderPractice,
    MockInterview:  renderMockInterview,
    DailyChallenge: renderDailyChallenge,
    HRPractice:     renderHRPractice,
    Quiz:           renderQuiz,
    Feedback:       renderFeedback,
    Progress:       renderProgress,
    Profile:        renderProfile,
  };

  const activeNavPage = ["TopicDetail"].includes(activePage) ? "Topics"
    : ["MockInterview", "DailyChallenge", "Quiz", "HRPractice"].includes(activePage) ? "Practice"
    : activePage;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-brand">
            <img src={logo} alt="AI Prep" />
            <span className="sidebar-brand-name">AI Prep</span>
          </div>
          <div className="nav-section-label">Navigation</div>
          {navItems.map(item => (
            <div key={item.id} className={`nav-item ${activeNavPage === item.id ? "active" : ""}`} onClick={() => setActivePage(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <div className="main">
          <div className="topbar">
            <input
              className="topbar-search"
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); if (e.target.value) setActivePage("Topics"); }}
            />
            <div className="topbar-right">
              <div className="topbar-avatar">
                <div className="avatar-circle">{userInitials}</div>
                {userName}
              </div>
            </div>
          </div>
          <div className="page-content">
            {(pageMap[activePage] || renderDashboard)()}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;