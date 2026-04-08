import { useState, useCallback } from 'react';
import type { DateRange } from './useDateRange';

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  rangeLabel: string;
  monthKey: string;
  rangeKey: string;
}

const STORAGE_KEY = 'wall-calendar-notes-v2';

function loadNotes(): Record<string, Note> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, Note>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function makeRangeKey(monthKey: string, range: DateRange): string {
  const s = range.start ? range.start.toISOString().split('T')[0] : 'none';
  const e = range.end ? range.end.toISOString().split('T')[0] : 'none';
  return `${monthKey}__${s}__${e}`;
}

export function useNotes(monthKey: string, range: DateRange, rangeLabel: string) {
  const [allNotes, setAllNotes] = useState<Record<string, Note>>(loadNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const rangeKey = makeRangeKey(monthKey, range);

  const currentNote = allNotes[rangeKey];
  const currentContent = currentNote?.content ?? '';

  const monthNotes = Object.values(allNotes).filter(n => n.monthKey === monthKey);

  const saveNote = useCallback((content: string, label: string) => {
    setIsSaving(true);
    const now = new Date().toISOString();
    const existing = allNotes[rangeKey];
    const updated: Note = {
      id: rangeKey,
      content,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      rangeLabel: label,
      monthKey,
      rangeKey,
    };
    const next = { ...allNotes, [rangeKey]: updated };
    saveNotes(next);
    setAllNotes(next);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 400);
  }, [allNotes, rangeKey, monthKey]);

  const deleteNote = useCallback((key: string) => {
    const next = { ...allNotes };
    delete next[key];
    saveNotes(next);
    setAllNotes(next);
  }, [allNotes]);

  const getMonthGeneralKey = () => `${monthKey}__general__general`;
  const generalNote = allNotes[getMonthGeneralKey()];
  const generalContent = generalNote?.content ?? '';

  const saveGeneralNote = useCallback((content: string) => {
    setIsSaving(true);
    const now = new Date().toISOString();
    const key = getMonthGeneralKey();
    const existing = allNotes[key];
    const updated: Note = {
      id: key,
      content,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      rangeLabel: 'General Notes',
      monthKey,
      rangeKey: key,
    };
    const next = { ...allNotes, [key]: updated };
    saveNotes(next);
    setAllNotes(next);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 400);
  }, [allNotes, monthKey]);

  return {
    currentContent,
    currentNote,
    generalContent,
    monthNotes,
    isSaving,
    lastSaved,
    saveNote,
    saveGeneralNote,
    deleteNote,
    rangeLabel,
  };
}
