import React from 'react';
import { sanitizeHtml } from '../utils/sanitize';

const NoteCard = ({ note, onDelete, onArchive, onView }) => {
  return (
    <div className="note-card" onClick={() => onView(note.id)}>
      <h3 className="note-title">{sanitizeHtml(note.title)}</h3>
      <div className="note-body" dangerouslySetInnerHTML={{
        __html: sanitizeHtml(note.body?.substring(0, 150))
      }} />
      <div className="note-footer">
        <button onClick={(e) => { e.stopPropagation(); onArchive(note.id); }}>Arsip</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>Hapus</button>
      </div>
    </div>
  );
};

export default NoteCard;