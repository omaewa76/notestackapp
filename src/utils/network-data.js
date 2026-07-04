import { sanitizeObject, sanitizeEmail, sanitizeName, isValidPassword } from './sanitize';

const BASE_URL = 'https://notes-api.dicoding.dev/v1';

/** Register user dengan sanitasi input */
export async function registerUser({ name, email, password }) {
  const sanitizedName = sanitizeName(name);
  const sanitizedEmail = sanitizeEmail(email);

  if (!sanitizedName) {
    return { error: true, message: 'Nama tidak valid' };
  }
  if (!sanitizedEmail) {
    return { error: true, message: 'Email tidak valid' };
  }
  if (!isValidPassword(password)) {
    return { error: true, message: 'Password harus minimal 6 karakter' };
  }

  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: sanitizedName,
        email: sanitizedEmail,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: true, message: data.message || 'Registrasi gagal' };
    }

    return { error: false, data };
  } catch (error) {
    return { error: true, message: error.message || 'Koneksi gagal' };
  }
}

/** Login user dengan sanitasi */
export async function loginUser({ email, password }) {
  const sanitizedEmail = sanitizeEmail(email);

  if (!sanitizedEmail) {
    return { error: true, message: 'Email tidak valid' };
  }
  if (!password || typeof password !== 'string' || password.length < 1) {
    return { error: true, message: 'Password harus diisi' };
  }

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sanitizedEmail, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: true, message: data.message || 'Login gagal' };
    }

    if (data.data?.accessToken) {
      localStorage.setItem('notestack_token', data.data.accessToken);
      localStorage.setItem('notestack_user', JSON.stringify({ email: sanitizedEmail }));
    }

    return { error: false, data };
  } catch (error) {
    return { error: true, message: error.message || 'Koneksi gagal' };
  }
}

/** Helper untuk fetch dengan sanitasi */
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('notestack_token');

  let sanitizedBody = options.body;
  if (sanitizedBody && typeof sanitizedBody === 'string') {
    try {
      const bodyObj = JSON.parse(sanitizedBody);
      const sanitizedObj = sanitizeObject(bodyObj);
      sanitizedBody = JSON.stringify(sanitizedObj);
    } catch (e) {
      console.log(e);
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: sanitizedBody,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('notestack_token');
      localStorage.removeItem('notestack_user');
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

/** Get all notes */
export async function getAllNotes() {
  try {
    const data = await fetchWithAuth('/notes', { method: 'GET' });
    return { error: false, notes: data.data };
  } catch (error) {
    return { error: true, message: error.message, notes: [] };
  }
}

/** Get archived notes */
export async function getArchivedNotes() {
  try {
    const data = await fetchWithAuth('/notes/archived', { method: 'GET' });
    return { error: false, notes: data.data };
  } catch (error) {
    return { error: true, message: error.message, notes: [] };
  }
}

/** Create note dengan sanitasi konten */
export async function createNote({ title, body }) {
  const sanitizedTitle = title?.trim().substring(0, 100) || '';
  const sanitizedBody = body?.trim() || '';

  if (!sanitizedTitle) {
    return { error: true, message: 'Judul tidak boleh kosong' };
  }

  try {
    const data = await fetchWithAuth('/notes', {
      method: 'POST',
      body: JSON.stringify({ title: sanitizedTitle, body: sanitizedBody }),
    });
    return { error: false, note: data.data };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

/** Delete note */
export async function deleteNoteById(id) {
  try {
    await fetchWithAuth(`/notes/${id}`, { method: 'DELETE' });
    return { error: false };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

/** Get single note */
export async function getNoteById(id) {
  try {
    const data = await fetchWithAuth(`/notes/${id}`, { method: 'GET' });
    return { error: false, note: data.data };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

/** Archive note */
export async function archiveNoteById(id) {
  try {
    await fetchWithAuth(`/notes/${id}/archive`, { method: 'POST' });
    return { error: false };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

/** Unarchive note */
export async function unarchiveNoteById(id) {
  try {
    await fetchWithAuth(`/notes/${id}/unarchive`, { method: 'POST' });
    return { error: false };
  } catch (error) {
    return { error: true, message: error.message };
  }
}