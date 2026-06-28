import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUp,
  Check,
  Copy,
  FileText,
  FolderOpen,
  KeyRound,
  Plus,
  RotateCcw,
  Settings,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const documents = [
  {
    title: "Lagos tenancy law",
    type: "Legal",
    status: "Ready",
    body: "Notices, tenant obligations, and recovery procedures.",
  },
  {
    title: "Founder SAFE draft",
    type: "Finance",
    status: "Ready",
    body: "Valuation cap, conversion terms, and investor rights.",
  },
  {
    title: "Technical onboarding notes",
    type: "Technical",
    status: "Processing",
    body: "Setup decisions, rollout notes, and ownership history.",
  },
];

const settingsRows = [
  { icon: UserRound, label: "Profile", value: "Name and email" },
  { icon: KeyRound, label: "Password reset", value: "Send reset link" },
  { icon: Settings, label: "Preferences", value: "Conversation history on" },
];

function useAppear(start: number, duration = 28) {
  const frame = useCurrentFrame();

  return {
    opacity: interpolate(frame, [start, start + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
    transform: `translateY(${interpolate(frame, [start, start + duration], [34, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })}px)`,
  };
}

function appearAt(frame: number, start: number, duration = 24) {
  return {
    opacity: interpolate(frame, [start, start + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
    transform: `translateY(${interpolate(frame, [start, start + duration], [20, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })}px)`,
  };
}

function revealText(text: string, frame: number, start: number, end: number) {
  const count = Math.floor(
    interpolate(frame, [start, end], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  return text.slice(0, count);
}

function Stage({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const textStyle = useAppear(4);
  const frameStyle = useAppear(18);

  return (
    <AbsoluteFill className="scene">
      <div className="scene-grid" />
      <div className="scene-inner">
        <div className="scene-copy" style={textStyle}>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="scene-frame" style={frameStyle}>
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function BrowserBar({ label }: { label: string }) {
  return (
    <div className="browser-bar">
      <div className="browser-dots">
        <span />
        <span />
        <span />
      </div>
      <div className="browser-label">{label}</div>
    </div>
  );
}

function Pill({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <span className={dark ? "pill pill-dark" : "pill"}>{children}</span>;
}

function MiniButton({
  children,
  icon: Icon,
  inverse,
}: {
  children: ReactNode;
  icon?: LucideIcon;
  inverse?: boolean;
}) {
  return (
    <div className={inverse ? "mini-button mini-button-inverse" : "mini-button"}>
      {Icon ? <Icon size={18} /> : null}
      <span>{children}</span>
    </div>
  );
}

function LandingScene() {
  return (
    <Stage
      eyebrow="Doc Explain"
      subtitle="A focused frontend for uploading documents, asking questions, and keeping every answer tied to the source."
      title="Ask the file. Keep the source."
    >
      <div className="hero-shell">
        <BrowserBar label="doc-explain.local" />
        <div className="hero-content">
          <div>
            <Pill dark>
              <FileText size={18} />
              Grounded answers
            </Pill>
            <h2>Ask the file. Keep the source.</h2>
            <p>
              Turn long PDFs, notes, contracts, and images into a clean document
              workspace.
            </p>
            <div className="button-row">
              <MiniButton inverse icon={UploadCloud}>
                Start with a document
              </MiniButton>
              <MiniButton icon={FolderOpen}>Open dashboard</MiniButton>
            </div>
          </div>
          <ProductPanel />
        </div>
      </div>
    </Stage>
  );
}

function ProductPanel() {
  return (
    <div className="product-panel">
      <div className="product-sidebar">
        <div className="sidebar-title">
          <FolderOpen size={20} />
          Library
        </div>
        {documents.map((document, index) => (
          <div className={index === 0 ? "doc-row doc-row-active" : "doc-row"} key={document.title}>
            <FileText size={20} />
            <div>
              <strong>{document.title}</strong>
              <span>{document.type}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="product-main">
        <Pill>Selected file</Pill>
        <h3>Lagos tenancy law</h3>
        <p>
          A law covering tenancy agreements, notices, landlord obligations, and
          recovery procedures.
        </p>
        <div className="facts">
          <span>Legal</span>
          <span>37 chunks</span>
          <span>92 percent</span>
        </div>
      </div>
    </div>
  );
}

function DashboardScene() {
  return (
    <Stage
      eyebrow="Dashboard"
      subtitle="Every file becomes a readable card with title, status, classification, and quick access to its document chat."
      title="Documents stay organized before the first question."
    >
      <div className="app-window">
        <BrowserBar label="/dashboard" />
        <div className="dashboard-layout">
          <aside className="dark-nav">
            <div className="logo-mark">DE</div>
            <div className="nav-item nav-active">
              <FileText size={18} />
              Documents
            </div>
            <div className="nav-item">
              <Settings size={18} />
              Settings
            </div>
          </aside>
          <main className="dashboard-main">
            <div className="dashboard-top">
              <div>
                <Pill>Dashboard</Pill>
                <h2>Document workspace</h2>
                <p>Open one file to ask focused questions.</p>
              </div>
              <MiniButton inverse icon={Plus}>Add new</MiniButton>
            </div>
            <div className="stats-grid">
              {[
                ["Documents", "3"],
                ["Ready", "2"],
                ["Processing", "1"],
                ["Classes", "3"],
              ].map(([label, value]) => (
                <div className="stat-card" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="doc-grid">
              {documents.map((document) => (
                <DocumentCard key={document.title} {...document} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </Stage>
  );
}

function DocumentCard({
  body,
  status,
  title,
  type,
}: {
  body: string;
  status: string;
  title: string;
  type: string;
}) {
  return (
    <div className="document-card">
      <div className="card-head">
        <div className="file-icon">
          <FileText size={22} />
        </div>
        <Pill dark={status === "Ready"}>{status}</Pill>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="card-foot">
        <Pill>{type}</Pill>
        <span>Open</span>
      </div>
    </div>
  );
}

function ChatScene() {
  const frame = useCurrentFrame();
  const question = "Can the landlord collect rent yearly?";
  const answer =
    "The document says advance rent limits depend on the tenancy type. It separates yearly rent from shorter tenancy arrangements, and points back to the notice rules before a demand can be made.";
  const typedQuestion = revealText(question, frame, 70, 150);
  const streamedAnswer = revealText(answer, frame, 230, 455);
  const hasSentQuestion = frame >= 165;
  const showSearching = frame >= 185 && frame < 235;
  const showAssistant = frame >= 230;
  const showCompleteActions = frame >= 470;
  const showRetryExample = frame >= 540;

  return (
    <Stage
      eyebrow="Document chat"
      subtitle="The demo now follows the real flow: previous messages load, the user types, the question is sent, and the answer streams back in place."
      title="Watch the document chat work."
    >
      <div className="chat-window">
        <BrowserBar label="/dashboard/documents/:documentId" />
        <div className="chat-page">
          <div className="chat-header">
            <Pill>Document</Pill>
            <h2>Lagos tenancy law</h2>
            <p>Previous conversation restored</p>
          </div>
          <div className="chat-thread">
            <div className="history-row" style={appearAt(frame, 18)}>
              <div className="history-label">Earlier</div>
              <div className="history-message">
                What is this document mainly about?
              </div>
              <div className="history-answer">
                It covers tenancy agreements, landlord obligations, notices,
                and recovery procedures in Lagos State.
              </div>
            </div>

            {hasSentQuestion ? (
              <div className="user-message" style={appearAt(frame, 165, 18)}>
                {question}
              </div>
            ) : null}

            {showSearching ? (
              <div className="streaming-status" style={appearAt(frame, 185, 14)}>
                <SearchPulse />
                Searching indexed chunks
              </div>
            ) : null}

            {showAssistant ? (
              <div className="assistant-stack" style={appearAt(frame, 230, 18)}>
                <div className="assistant-message">
                  {streamedAnswer}
                  {showCompleteActions ? (
                    <span>[chunk 12]</span>
                  ) : (
                    <span className="stream-cursor">|</span>
                  )}
                </div>

                {showCompleteActions ? (
                  <>
                    <div className="message-actions" style={appearAt(frame, 470, 18)}>
                      <Copy size={18} />
                      <Check size={18} />
                    </div>
                    <div className="source-box" style={appearAt(frame, 490, 18)}>
                      Source: demand or receive rent in excess of the permitted
                      period...
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}

            {showRetryExample ? (
              <div className="retry-box" style={appearAt(frame, 540, 18)}>
                Response failed.
                <RotateCcw size={16} />
              </div>
            ) : null}
          </div>
          <div className={typedQuestion && !hasSentQuestion ? "composer composer-active" : "composer"}>
            <span>
              {hasSentQuestion
                ? "Ask anything about this document"
                : typedQuestion || "Ask anything about this document"}
              {typedQuestion && !hasSentQuestion ? <b className="typing-cursor">|</b> : null}
            </span>
            <div>
              <ArrowUp size={22} />
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
}

function SearchPulse() {
  const frame = useCurrentFrame();
  const scale = interpolate(frame % 32, [0, 16, 31], [0.85, 1.05, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span className="search-pulse" style={{ transform: `scale(${scale})` }}>
      <FileText size={16} />
    </span>
  );
}

function SettingsScene() {
  return (
    <Stage
      eyebrow="Settings"
      subtitle="The authenticated area includes the account tools users expect: profile, password reset, preferences, and sign out."
      title="The dashboard feels complete."
    >
      <div className="settings-window">
        <BrowserBar label="/dashboard/settings" />
        <div className="settings-layout">
          <section className="settings-card large">
            <div className="settings-title">
              <UserRound size={22} />
              <div>
                <h3>Profile</h3>
                <p>Account details shown inside the workspace.</p>
              </div>
            </div>
            <div className="input-grid">
              <div className="fake-input">
                <span>Full name</span>
                <strong>Doc Explain User</strong>
              </div>
              <div className="fake-input">
                <span>Email address</span>
                <strong>user@example.com</strong>
              </div>
            </div>
            <MiniButton inverse icon={Check}>Save profile</MiniButton>
          </section>

          <section className="settings-card">
            {settingsRows.map((row) => (
              <div className="settings-row" key={row.label}>
                <row.icon size={22} />
                <div>
                  <strong>{row.label}</strong>
                  <span>{row.value}</span>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </Stage>
  );
}

function ClosingScene() {
  return (
    <AbsoluteFill className="closing-scene">
      <div className="scene-grid" />
      <div className="closing-card">
        <ShieldCheck size={54} />
        <p className="eyebrow">Doc Explain</p>
        <h1>The source stays in the room.</h1>
        <p>
          Upload, review, ask, copy, retry, and return to previous document
          conversations from one black-and-white workspace.
        </p>
      </div>
    </AbsoluteFill>
  );
}

export function DocExplainDemo() {
  return (
    <AbsoluteFill className="video-root">
      <Audio src={staticFile("demo/demo-voice.m4a")} />
      <Sequence durationInFrames={270} from={0}>
        <LandingScene />
      </Sequence>
      <Sequence durationInFrames={280} from={270}>
        <DashboardScene />
      </Sequence>
      <Sequence durationInFrames={850} from={550}>
        <ChatScene />
      </Sequence>
      <Sequence durationInFrames={300} from={1400}>
        <SettingsScene />
      </Sequence>
      <Sequence durationInFrames={280} from={1700}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
}
