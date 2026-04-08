import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { saveNote, deleteNote } from '../store/notesSlice';
import type { RootState } from '../store';
import './WallCalendar.css';

/* ═══════════════════════════════════════════════════
   DATA — Themes & Holidays
═══════════════════════════════════════════════════ */
const MONTHS = [
  { name: 'January', accent: '#3b82f6', accentRgb: '59,130,246', hero: 'https://picsum.photos/id/29/600/800', quote: 'In the depth of winter, I finally learned that within me there lay an invincible summer.', author: 'Albert Camus' },
  { name: 'February', accent: '#ec4899', accentRgb: '236,72,153', hero: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80', quote: 'The best things in the world cannot be seen — they must be felt with the heart.', author: 'Helen Keller' },
  { name: 'March', accent: '#10b981', accentRgb: '16,185,129', hero: 'https://picsum.photos/id/10/600/800', quote: 'Spring is the time of plans and projects.', author: 'Leo Tolstoy' },
  { name: 'April', accent: '#f97316', accentRgb: '249,115,22', hero: 'https://picsum.photos/id/54/600/800', quote: 'April hath put a spirit of youth in everything.', author: 'William Shakespeare' },
  { name: 'May', accent: '#8b5cf6', accentRgb: '139,92,246', hero: 'https://picsum.photos/id/137/600/800', quote: 'The world is full of magical things patiently waiting for our senses to grow sharper.', author: 'W.B. Yeats' },
  { name: 'June', accent: '#eab308', accentRgb: '234,179,8', hero: 'https://picsum.photos/id/75/600/800', quote: 'And so with the sunshine and the great bursts of leaves, I had that familiar conviction.', author: 'F. Scott Fitzgerald' },
  { name: 'July', accent: '#ef4444', accentRgb: '239,68,68', hero: 'https://picsum.photos/id/248/600/800', quote: 'Rest is not idleness; to lie sometimes on the grass is not to waste time.', author: 'John Lubbock' },
  { name: 'August', accent: '#0ea5e9', accentRgb: '14,165,233', hero: 'https://picsum.photos/id/13/600/800', quote: 'In every walk with nature one receives far more than he seeks.', author: 'John Muir' },
  { name: 'September', accent: '#a855f7', accentRgb: '168,85,247', hero: 'https://picsum.photos/id/122/600/800', quote: 'September: it was the most beautiful of words.', author: 'Thomas Wolfe' },
  { name: 'October', accent: '#ea580c', accentRgb: '234,88,12', hero: 'https://picsum.photos/id/129/600/800', quote: 'October is a symphony of permanence and change.', author: 'Bonaro Overstreet' },
  { name: 'November', accent: '#64748b', accentRgb: '100,116,139', hero: 'https://picsum.photos/id/11/600/800', quote: 'Autumn carries more gold in its pocket than all the other seasons.', author: 'Jim Bishop' },
  { name: 'December', accent: '#06b6d4', accentRgb: '6,182,212', hero: 'https://picsum.photos/id/16/600/800', quote: 'What good is warmth without cold to give it sweetness?', author: 'John Steinbeck' },
];

const HOLIDAYS: Record<string, string> = {
  '01-01': 'New Year', '02-14': 'Valentine\'s Day', '12-25': 'Christmas', '10-31': 'Halloween'
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const slideVariants = {
  enter: (dir: number) => ({
    rotateX: dir > 0 ? 0 : 140, // Prev month falls from flipped over the top
    scale: dir > 0 ? 0.95 : 1,  // Next month scales slightly from behind
    opacity: 0,
    z: dir > 0 ? -100 : 100 // Proper 3D stacking
  }),
  center: {
    rotateX: 0,
    scale: 1,
    opacity: 1,
    z: 0
  },
  exit: (dir: number) => ({
    rotateX: dir > 0 ? 140 : 0, // Next month causes current to flip UP and back
    scale: dir > 0 ? 1 : 0.95,  // Prev month causes current to sit back
    opacity: 0,
    z: dir > 0 ? 100 : -100 // Flipper stays in front, fading page goes back
  })
};

const popoverVariants = {
  hidden: { y: 60, opacity: 0, scale: 0.9 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring' as const, bounce: 0.25, duration: 0.5 } },
  exit: { y: 60, opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const modalVariants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(10px)', transition: { duration: 0.3 } },
  exit: { opacity: 0, backdropFilter: 'blur(0px)' }
};

// Utils
function dateStr(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function sameDay(a: Date | null, b: Date | null) { return a && b ? a.toDateString() === b.toDateString() : false; }
function getDays(y: number, m: number) {
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ date: new Date(y, m - 1, prevDays - i), curr: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(y, m, d), curr: true });
  while (cells.length < 42) {
    const dayVal = cells.length - firstDay - daysInMonth + 1;
    cells.push({ date: new Date(y, m + 1, dayVal), curr: false });
  }
  return cells;
}

export default function WallCalendar() {
  const today = useMemo(() => new Date(), []);
  const [dark, setDark] = useState(true);

  // Month Nav
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [dir, setDir] = useState(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const theme = MONTHS[month];
  const cells = useMemo(() => getDays(year, month), [year, month]);

  // Redux integration
  const dispatch = useDispatch();
  const allNotes = useSelector((state: RootState) => state.notes.records);

  // Drag Selection
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // View States
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], ['-3%', '3%']);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], ['-3%', '3%']);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  // Extract Mini Timeline
  const eventsThisMonth = useMemo(() => {
    return Object.values(allNotes).filter(note => {
      const startStr = note.id.split('_')[0];
      const startYear = parseInt(startStr.split('-')[0]);
      const startMonth = parseInt(startStr.split('-')[1]) - 1;
      return startYear === year && startMonth === month;
    }).sort((a, b) => a.id.localeCompare(b.id));
  }, [allNotes, year, month]);

  // Current Range Key Setup
  const activeKey = useMemo(() => {
    if (!dragStart || !dragEnd) return null;
    const [s, e] = dragStart <= dragEnd ? [dragStart, dragEnd] : [dragEnd, dragStart];
    return `${dateStr(s)}_${dateStr(e)}`;
  }, [dragStart, dragEnd]);

  const activeNoteItem = activeKey ? allNotes[activeKey] : null;

  // Local popover active note state so input reacts immediately
  const [activeNoteTitle, setActiveNoteTitle] = useState('');
  const [activeNoteText, setActiveNoteText] = useState('');

  const formatRangeText = (s: Date, e: Date) => {
    const diff = Math.round(Math.abs(e.getTime() - s.getTime()) / 864e5) + 1;
    if (diff === 1) return s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${diff} days)`;
  };

  const currentRangeLabel = useMemo(() => {
    if (!dragStart || !dragEnd) return '';
    const [s, e] = dragStart <= dragEnd ? [dragStart, dragEnd] : [dragEnd, dragStart];
    return formatRangeText(s, e);
  }, [dragStart, dragEnd]);

  // Sync Redux -> Local State when activeKey changes
  useEffect(() => {
    if (activeKey) {
      if (activeNoteItem) {
        setActiveNoteTitle(activeNoteItem.title);
        setActiveNoteText(activeNoteItem.text);
      } else {
        setActiveNoteTitle('');
        setActiveNoteText('');
      }
    }
  }, [activeKey, activeNoteItem]);

  // Nav Actions
  const chgMonth = (delta: number) => {
    setDir(delta);
    setCurrentDate(new Date(year, month + delta, 1));
  };

  // ──── Mouse & Touch Listeners ────
  useEffect(() => {
    const handleGlobalUp = () => { setIsDragging(false); isDraggingRef.current = false; };
    window.addEventListener('mouseup', handleGlobalUp);
    return () => window.removeEventListener('mouseup', handleGlobalUp);
  }, []);

  const handleDown = (d: Date) => {
    setDragStart(d);
    dragStartRef.current = d;
    setDragEnd(d);
    setIsDragging(true);
    isDraggingRef.current = true;
    setPopoverOpen(false);
  };

  const handleEnter = (d: Date) => {
    setHoverDate(d);
    if (isDraggingRef.current) setDragEnd(d);
  };

  const handleUp = (d: Date) => {
    if (isDraggingRef.current) {
      setDragEnd(d);
      setIsDragging(false);
      isDraggingRef.current = false;
      setPopoverOpen(true); // Open the modern popover
    }
  };

  // Mobile Touch Support
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.hasAttribute('data-date')) {
      const ds = target.getAttribute('data-date');
      if (ds) {
        // Find if this date is inside our generated cells
        handleEnter(new Date(ds));
      }
    }
  };

  const getRangeState = (d: Date) => {
    const s = dragStart;
    const e = dragEnd || dragStart;
    if (!s || !e) return { start: false, end: false, inRange: false };
    const min = s <= e ? s : e;
    const max = s > e ? s : e;
    const inRange = d >= min && d <= max;
    return { start: sameDay(d, min), end: sameDay(d, max), inRange };
  };

  const hoveredNote = useMemo(() => {
    if (!hoverDate) return null;
    const ds = hoverDate.getTime();
    for (const key in allNotes) {
      const [startStr, endStr] = key.split('_');
      const [sy, sm, sd] = startStr.split('-');
      const [ey, em, ed] = endStr.split('-');
      const noteStart = new Date(Number(sy), Number(sm) - 1, Number(sd)).getTime();
      const noteEnd = new Date(Number(ey), Number(em) - 1, Number(ed)).getTime();
      if (ds >= noteStart && ds <= noteEnd) {
        return allNotes[key];
      }
    }
    return null;
  }, [hoverDate, allNotes]);

  const notesInViewDates = useMemo(() => {
    const dates = new Set<string>();
    Object.values(allNotes).forEach(note => {
      const [startStr, endStr] = note.id.split('_');
      const [sy, sm, sd] = startStr.split('-');
      const [ey, em, ed] = endStr.split('-');
      let curr = new Date(Number(sy), Number(sm) - 1, Number(sd));
      const end = new Date(Number(ey), Number(em) - 1, Number(ed));
      while (curr.getTime() <= end.getTime()) {
        dates.add(curr.toISOString());
        curr.setDate(curr.getDate() + 1);
      }
    });
    return dates;
  }, [allNotes]);

  return (
    <div className={`wc-root ${dark ? 'dk' : 'lt'}`} style={{
      '--ac': theme.accent,
      '--ac-glow': `rgba(${theme.accentRgb}, 0.15)`,
      '--ac-light': `${theme.accent}aa`
    } as React.CSSProperties}>

      {/* Ambient background blur */}
      <div className="wc-ambient-glow">
        <div className="wc-glow-blob wc-blob-1" style={{ background: theme.accent }} />
        <div className="wc-glow-blob wc-blob-2" style={{ background: theme.accent }} />
      </div>

      {/* Top Controls */}
      <div className="wc-floating-controls">
        <button 
          className="wc-control-btn view-notes-btn" 
          onClick={() => {
            try {
              dateInputRef.current?.showPicker();
            } catch {
              dateInputRef.current?.focus();
            }
          }}
          style={{ position: 'relative' }}
        >
          <span className="wc-btn-icon">📅</span> Jump
          <input 
            type="date" 
            ref={dateInputRef}
            style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', bottom: 0, left: 0, border: 'none', padding: 0 }}
            onChange={(e) => {
              if (e.target.value) {
                const parts = e.target.value.split('-');
                if (parts.length === 3) {
                  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                  setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
                }
              }
            }}
          />
        </button>
        <button className="wc-control-btn view-notes-btn" onClick={() => setModalOpen(true)}>
          <span className="wc-btn-icon">📋</span> Saved Notes
        </button>
        <button className="wc-control-btn" onClick={() => setDark(!dark)}>
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="wc-layout"
        onTouchMove={handleTouchMove}
        style={{ touchAction: isDragging ? 'none' : 'auto' }}>

        {/* ONLY The Calendar Card exists in flow, Popover is absolute */}
        <div className="wc-card" onMouseMove={handleMouseMove}>
          <div className="wc-spiral-top">
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="wc-coil" />)}
          </div>

          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              className="wc-month-slide"
              key={currentDate.toISOString()}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, type: "spring", bounce: 0.25 }}
              style={{ transformOrigin: "top center" }}
            >
              <motion.div
                className="wc-hero"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, { offset }) => {
                  const swipe = offset.x;
                  if (swipe < -50) chgMonth(1);
                  else if (swipe > 50) chgMonth(-1);
                }}
              >
                <div className="wc-hero-img-container" style={{ background: theme.accent }}>
                  <motion.img
                    key={theme.hero}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loadedImages[theme.name] ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    onLoad={() => setLoadedImages(prev => ({ ...prev, [theme.name]: true }))}
                    style={{ x: parallaxX, y: parallaxY, scale: 1.1 }}
                    src={theme.hero}
                    alt={theme.name}
                    className="wc-hero-img"
                    draggable={false}
                  />
                </div>
                <div className="wc-hero-overlay" />
                <div className="wc-hero-content" style={{ pointerEvents: 'none' }}>
                  <AnimatePresence mode="wait">
                    {activeKey ? (
                      <motion.div key="live" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="wc-live-context">
                        <div className="wc-badge" style={{ background: theme.accent }}>Selected Range</div>
                        <h2 className="wc-quote-text" style={{ fontStyle: 'normal', fontSize: '24px' }}>{currentRangeLabel}</h2>
                        {activeNoteItem ? (
                          <div className="wc-context-preview">
                            <strong>{activeNoteItem.title || 'Untitled Note'}</strong>
                            <p>{activeNoteItem.text}</p>
                          </div>
                        ) : (
                          <span className="wc-quote-author" style={{ opacity: 0.6 }}>Add notes to this date range...</span>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div key="fallback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="wc-fallback-context">
                        <div className="wc-badge" style={{ background: theme.accent }}>{year}</div>
                        <h2 className="wc-quote-text">"{theme.quote}"</h2>
                        <span className="wc-quote-author">— {theme.author}</span>

                        {eventsThisMonth.length > 0 && (
                          <div className="wc-mini-timeline">
                            <div className="wc-mt-title">Upcoming this month</div>
                            {eventsThisMonth.slice(0, 2).map(e => (
                              <div key={e.id} className="wc-mt-item">
                                <div className="wc-mt-dot" style={{ background: theme.accent, boxShadow: `0 0 8px ${theme.accent}` }} />
                                <div className="wc-mt-text">
                                  <span className="wc-mt-time">{e.timeLabel.split(' - ')[0]}</span>
                                  <strong>{e.title || 'Saved Event'}</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <div className="wc-body">
                <div className="wc-nav">
                  <div className="wc-header">
                    <h1 className="wc-month-title">{theme.name} {year}</h1>
                    <p className="wc-header-subinfo" style={{ fontSize: '11px', opacity: 0.6, margin: 0 }}>
                      {eventsThisMonth.length} event{eventsThisMonth.length !== 1 ? 's' : ''} this month
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="wc-nav-btn glass-btn" onClick={() => chgMonth(-1)}>←</button>
                    <button className="wc-nav-btn glass-btn" onClick={() => chgMonth(1)}>→</button>
                  </div>
                </div>

                <div className="wc-grid-container">
                  <div className="wc-grid wc-grid-header">
                    {DAY_NAMES.map((d, i) => <div key={i} className="wc-dh">{d}</div>)}
                  </div>
                  <div className="wc-grid" onMouseLeave={() => setHoverDate(null)}>
                    {cells.map((c) => {
                      const isHover = hoverDate?.getTime() === c.date.getTime();
                      const state = getRangeState(c.date);
                      const isToday = sameDay(c.date, new Date());

                      const k = `${c.date.getFullYear()}-${c.date.getMonth()}-${c.date.getDate()}`;
                      const hKey = `${String(c.date.getMonth() + 1).padStart(2, '0')}-${String(c.date.getDate()).padStart(2, '0')}`;
                      const hol = HOLIDAYS[hKey];
                      const isWeekend = c.date.getDay() === 0 || c.date.getDay() === 6;
                      const hasNote = notesInViewDates.has(c.date.toISOString());

                      return (
                        <div
                          key={k}
                          data-date={c.date.toISOString()}
                          className={`wc-cell ${c.curr ? '' : 'outside'} ${isHover ? 'hover' : ''} ${state.inRange ? 'in-range' : ''} ${state.start ? 'range-start' : ''} ${state.end ? 'range-end' : ''} ${isWeekend ? 'is-weekend' : ''} ${hol ? 'holiday' : ''}`}
                          onMouseDown={(e) => { e.preventDefault(); handleDown(c.date); }}
                          onMouseEnter={() => handleEnter(c.date)}
                          onMouseUp={() => handleUp(c.date)}
                          onTouchStart={(e) => { e.preventDefault(); handleDown(c.date); }}
                          onTouchEnd={() => handleUp(c.date)}
                        >
                          <div className={`wc-cell-wrap ${isToday ? 'today' : ''}`}>
                            {c.date.getDate()}
                            {hol && <div className="wc-hol-dot" />}
                            {hasNote && <div className="wc-note-dot" style={{ background: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }} />}

                            {/* Tooltip */}
                            <AnimatePresence>
                              {isHover && !isDragging && (
                                <motion.div
                                  className={`wc-tooltip ${hoveredNote ? 'has-note' : ''}`}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  {hoveredNote ? (
                                    <>
                                      <div className="wc-tt-title">{hoveredNote.title || 'Saved Note'}</div>
                                      {hoveredNote.text && <div className="wc-tt-desc">{hoveredNote.text}</div>}
                                    </>
                                  ) : (
                                    hol ? hol : c.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div> {/* End of wc-card */}

        {/* Sleek Popover attached to the bottom area of the Calendar */}
        <AnimatePresence>
          {popoverOpen && activeKey && (
            <motion.div
              className="wc-popover active"
              variants={popoverVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="wc-popover-notch" />
              <button className="wc-popover-close" onClick={() => {
                setPopoverOpen(false);
                setDragStart(null);
                setDragEnd(null);
              }}>✕</button>
              <div className="wc-popover-header">
                📝 <span className="wc-popover-range">{currentRangeLabel}</span>
              </div>

              <div className="wc-tags">
                {['Event', 'Task', 'Highlight'].map(t => (
                  <span key={t} className="wc-tag" onClick={() => setActiveNoteTitle(`${t} ${activeNoteTitle}`)}>{t}</span>
                ))}
              </div>

              <input
                type="text"
                className="wc-note-input wc-note-title-input"
                placeholder="What's happening?"
                value={activeNoteTitle}
                onChange={e => setActiveNoteTitle(e.target.value)}
              />
              <textarea
                className="wc-note-input wc-note-desc-input"
                placeholder="Details, links, location..."
                value={activeNoteText}
                onChange={e => setActiveNoteText(e.target.value)}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="wc-save-btn"
                  style={{ background: 'transparent', color: 'var(--txt)', border: '1px solid var(--border-strong)' }}
                  onClick={() => {
                    setPopoverOpen(false);

                    setDragStart(null);
                    setDragEnd(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="wc-save-btn"
                  onClick={() => {
                    if (activeKey) {
                      dispatch(saveNote({ id: activeKey, title: activeNoteTitle, text: activeNoteText, timeLabel: currentRangeLabel }));
                    }
                    setPopoverOpen(false);

                    setDragStart(null);
                    setDragEnd(null);
                  }}
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* VIEW SAVED NOTES MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="wc-modal-backdrop"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="wc-modal-content"
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.4 } }}
            >
              <button className="wc-modal-close" onClick={() => setModalOpen(false)}>✕</button>
              <h2 className="wc-modal-title">Saved Notes</h2>
              <div className="wc-modal-list">
                {Object.values(allNotes).length === 0 ? (
                  <p className="wc-modal-empty">You haven't saved any notes yet.</p>
                ) : (
                  Object.values(allNotes).map(note => (
                    <div key={note.id} className="wc-saved-item">
                      <div className="wc-si-header">
                        <span className="wc-si-time">{note.timeLabel}</span>
                        <button className="wc-btn-delete" onClick={() => dispatch(deleteNote(note.id))}>Delete</button>
                      </div>
                      <h4 className="wc-si-title">{note.title || 'Untitled Note'}</h4>
                      <p className="wc-si-text">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
