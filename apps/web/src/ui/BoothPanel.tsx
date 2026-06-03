import { useEffect, useRef, useState } from "react";
import type { Meeting } from "@immersive/shared";
import { listMeetings, createMeeting, deleteMeeting } from "../api";
import { getDeveloper, FIRST_DEVELOPER } from "../scene/developers";
import type { Developer } from "../scene/developers";

/* -------------------------------------------------------------------------- */
/*  Inline Google Meet scheduler (revealed from the panel CTA)                */
/* -------------------------------------------------------------------------- */

function defaultStart(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function MeetScheduler({ dev }: { dev: Developer }) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(defaultStart());
  const [attendees, setAttendees] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-seed whenever a different developer's booth is shown.
  useEffect(() => {
    setTitle(`${dev.name} — Investor Meeting`);
    setAttendees(dev.contact);
  }, [dev.id, dev.name, dev.contact]);

  const refresh = () => {
    listMeetings()
      .then(setMeetings)
      .catch((e) => setError(String(e)));
  };
  useEffect(refresh, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await createMeeting({
        title,
        startTime: new Date(startTime).toISOString(),
        attendees: attendees.split(",").map((a) => a.trim()).filter(Boolean),
      });
      refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteMeeting(id);
      refresh();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div className="bp-meet-form">
      <form onSubmit={onSubmit}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Start
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <label>
          Attendees (comma-separated emails)
          <input
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder="alice@example.com, bob@example.com"
          />
        </label>
        <button type="submit" className="bp-submit" disabled={busy}>
          {busy ? "Scheduling…" : "Schedule Meet"}
        </button>
      </form>

      {error && <p className="bp-error">{error}</p>}

      {meetings.length > 0 && (
        <div className="bp-meetings">
          <h4>Upcoming ({meetings.length})</h4>
          <ul>
            {meetings.map((m) => (
              <li key={m.id}>
                <div className="bp-meeting-info">
                  <strong>{m.title}</strong>
                  <span>{new Date(m.startTime).toLocaleString()}</span>
                  <a href={m.meetLink} target="_blank" rel="noreferrer">
                    {m.meetLink}
                  </a>
                </div>
                <button className="bp-del" onClick={() => onDelete(m.id)} aria-label="Delete meeting">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  BoothPanel — floating, non-blocking developer details                    */
/* -------------------------------------------------------------------------- */

export interface BoothPanelProps {
  /** Developer to show; null closes the panel (slides out). */
  developerId: string | null;
  onClose: () => void;
}

/**
 * A floating glassmorphism panel that slides in from the right with a
 * developer's full profile. It never covers or dims the 3D scene — the rest of
 * the viewport stays fully visible and interactive — so visitors keep
 * exploring while reading. Only one panel is ever shown; selecting another
 * booth swaps the content in place.
 */
export function BoothPanel({ developerId, onClose }: BoothPanelProps) {
  const open = developerId !== null;

  // Keep showing the last developer's content while the panel slides out, so
  // the close animation doesn't flash empty.
  const [shownId, setShownId] = useState<string | null>(developerId);
  const [meetOpen, setMeetOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (developerId !== null) {
      setShownId(developerId);
      setMeetOpen(false); // collapse the scheduler when switching booths
      scrollRef.current?.scrollTo({ top: 0 });
    }
  }, [developerId]);

  const dev = getDeveloper(shownId ?? FIRST_DEVELOPER.id);

  return (
    <aside
      className={`booth-panel ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      style={{ ["--accent" as string]: dev.color }}
    >
      <button className="bp-close" onClick={onClose} aria-label="Close panel">
        ✕
      </button>

      <div className="bp-scroll" ref={scrollRef}>
        <header className="bp-head">
          <div className="bp-logo">{dev.monogram}</div>
          <div className="bp-head-text">
            <h2 className="bp-name">{dev.name}</h2>
            <span className="bp-tagline">{dev.tagline}</span>
          </div>
        </header>

        <div className="bp-location">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
            />
          </svg>
          {dev.location}
        </div>

        <p className="bp-desc">{dev.description}</p>

        <section className="bp-section">
          <h3 className="bp-h3">Featured Projects</h3>
          <ul className="bp-projects">
            {dev.projects.map((p) => (
              <li key={p.name}>
                <span className="bp-proj-name">{p.name}</span>
                <span className="bp-proj-meta">
                  {p.type} · <em>{p.status}</em>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bp-section">
          <h3 className="bp-h3">Gallery</h3>
          <div className="bp-gallery">
            {dev.gallery.map((g, i) => (
              <div key={i} className="bp-tile" style={{ backgroundImage: g.gradient }}>
                <span>{g.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bp-section">
          <h3 className="bp-h3">Contact</h3>
          <div className="bp-contact">
            <a href={`mailto:${dev.contact}`}>{dev.contact}</a>
            <a href={`tel:${dev.phone.replace(/\s+/g, "")}`}>{dev.phone}</a>
            <a href={`https://${dev.website}`} target="_blank" rel="noreferrer">
              {dev.website}
            </a>
          </div>
        </section>

        <section className="bp-section bp-meet">
          <button
            className="bp-meet-btn"
            onClick={() => setMeetOpen((o) => !o)}
            aria-expanded={meetOpen}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M15 8.5V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2.5l4 3.5V5l-4 3.5Z" />
            </svg>
            {meetOpen ? "Hide scheduler" : "Schedule Google Meet"}
          </button>
          {meetOpen && <MeetScheduler dev={dev} />}
        </section>
      </div>
    </aside>
  );
}
