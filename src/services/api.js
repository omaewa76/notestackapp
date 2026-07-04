import { storage } from '../utils/storage';
import {
  getAllNotes as apiGetAllNotes,
  getArchivedNotes as apiGetArchivedNotes,
  createNote as apiCreateNote,
  deleteNoteById as apiDeleteNote,
  getNoteById as apiGetNote,
  archiveNoteById as apiArchiveNote,
  unarchiveNoteById as apiUnarchiveNote,
} from '../utils/network-data';

class ApiService {
  getToken() {
    return storage.getToken();
  }

  isAuthenticated() {
    return storage.isAuthenticated();
  }

  getCurrentUser() {
    return storage.getUser();
  }

  async getAllNotes() {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated', notes: [] };

    const result = await apiGetAllNotes();
    if (!result.error) {
      return { success: true, notes: result.notes };
    }
    return { success: false, error: result.message, notes: [] };
  }

  async getArchivedNotes() {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated', notes: [] };

    const result = await apiGetArchivedNotes();
    if (!result.error) {
      return { success: true, notes: result.notes };
    }
    return { success: false, error: result.message, notes: [] };
  }

  async getNote(id) {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated' };

    const result = await apiGetNote(id);
    if (!result.error) {
      return { success: true, note: result.note };
    }
    return { success: false, error: result.message };
  }

  async addNote(noteData) {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated' };

    const result = await apiCreateNote(noteData);
    if (!result.error) {
      return { success: true, note: result.note };
    }
    return { success: false, error: result.message };
  }

  async deleteNote(id) {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated' };

    const result = await apiDeleteNote(id);
    if (!result.error) {
      return { success: true };
    }
    return { success: false, error: result.message };
  }

  async archiveNote(id) {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated' };

    const result = await apiArchiveNote(id);
    if (!result.error) {
      return { success: true };
    }
    return { success: false, error: result.message };
  }

  async unarchiveNote(id) {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated' };

    const result = await apiUnarchiveNote(id);
    if (!result.error) {
      return { success: true };
    }
    return { success: false, error: result.message };
  }
}

export const api = new ApiService();