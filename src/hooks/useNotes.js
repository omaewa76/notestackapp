import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useNotes = () => {
    const [notes, setNotes] = useState([]);
    const [archivedNotes, setArchivedNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNotes = useCallback(async () => {
        setLoading(true);
        const [notesResult, archivedResult] = await Promise.all([
            api.getAllNotes(),
            api.getArchivedNotes(),
        ]);
        if (!notesResult.error) setNotes(notesResult.notes);
        if (!archivedResult.error) setArchivedNotes(archivedResult.notes);
        setLoading(false);
    }, []);

    const addNote = useCallback(async (title, body) => {
        const result = await api.addNote({ title, body });
        if (!result.error) {
            await loadNotes();
            return { success: true, note: result.note };
        }
        return { success: false, error: result.message };
    }, [loadNotes]);

    const deleteNote = useCallback(async (id) => {
        const result = await api.deleteNote(id);
        if (!result.error) {
            setNotes(prev => prev.filter(n => n.id !== id));
            setArchivedNotes(prev => prev.filter(n => n.id !== id));
            return { success: true };
        }
        return { success: false, error: result.message };
    }, []);

    const getNote = useCallback(async (id) => {
        const result = await api.getNote(id);
        if (!result.error) return { success: true, note: result.note };
        return { success: false, error: result.message };
    }, []);

    const archiveNote = useCallback(async (id) => {
        const result = await api.archiveNote(id);
        if (!result.error) {
            await loadNotes();
            return { success: true };
        }
        return { success: false, error: result.message };
    }, [loadNotes]);

    const unarchiveNote = useCallback(async (id) => {
        const result = await api.unarchiveNote(id);
        if (!result.error) {
            await loadNotes();
            return { success: true };
        }
        return { success: false, error: result.message };
    }, [loadNotes]);

    useEffect(() => { loadNotes(); }, [loadNotes]);

    return {
        notes,
        archivedNotes,
        loading,
        error,
        addNote,
        deleteNote,
        getNote,
        archiveNote,
        unarchiveNote,
        reloadNotes: loadNotes,
    };
};