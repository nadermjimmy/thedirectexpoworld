import { useEffect, useState } from "react";
import type { Meeting } from "@immersive/shared";
import { listMeetings, createMeeting, deleteMeeting } from "../api";
import { getDeveloper } from "../scene/developers";

function defaultStart(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  // Format for <input type="datetime-local">
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function MeetPanel({ activeDeveloper }: { activeDeveloper: string }) {
  const dev = getDeveloper(activeDeveloper);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(defaultStart());
  const [attendees, setAttendees] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-seed the form whenever a different developer's room is selected.
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
        attendees: attendees
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      });
      setAttendees("");
      refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteMeeting(id);
      refresh();
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div className="panel">
      <div className="panel-header" style={{ borderColor: dev.color }}>
        <span className="dot" style={{ background: dev.color }} />
        <h2>{dev.name}</h2>
      </div>
      <p className="hint">{dev.tagline} · schedule a Google Meet with this developer.</p>

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
        <button type="submit" disabled={busy} style={{ background: dev.color }}>
          {busy ? "Scheduling…" : "Schedule Meet"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="meetings">
        <h3>Upcoming ({meetings.length})</h3>
        {meetings.length === 0 && <p className="hint">No meetings scheduled yet.</p>}
        <ul>
          {meetings.map((m) => (
            <li key={m.id}>
              <div className="meeting-info">
                <strong>{m.title}</strong>
                <span>{new Date(m.startTime).toLocaleString()}</span>
                <a href={m.meetLink} target="_blank" rel="noreferrer">
                  {m.meetLink}
                </a>
              </div>
              <button className="del" onClick={() => onDelete(m.id)} aria-label="Delete">
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
