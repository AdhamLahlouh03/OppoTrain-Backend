// src/services/authService.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { db, doc, getDoc } = (() => {
  try {
    const { db: adminDb } = require('../config/firebase-admin'); 
    return {
      db: adminDb,
      doc: (dbOrPath, col, id) => adminDb.collection(col).doc(id),
      getDoc: async (ref) => await ref.get()
    };
  } catch (e) {
    const fb = require('../config/firebase');
    return { db: fb.db, doc: fb.doc, getDoc: fb.getDoc };
  }
})();

const hasFetch = typeof fetch === 'function';

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'change_me';
    this.jwtExpiry = process.env.JWT_EXPIRY || '24h';
    this.apiKey = process.env.FIREBASE_API_KEY;
    if (!this.apiKey) console.warn('[authService] Missing FIREBASE_API_KEY in .env');
  }

  signToken(payload) {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiry });
  }

  async loginAdmin(email, password) {
    if (!email || !password) throw new Error('email and password are required');
    if (!hasFetch) throw new Error('Node 18+ required (built-in fetch)');

    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Invalid credentials');
    }
    const data = await res.json();
    const uid = data.localId;

    const adminRef = doc(db, 'admins', uid);
    const adminSnap = await getDoc(adminRef);
    const exists = adminSnap.exists ? adminSnap.exists : adminSnap._fieldsProto !== undefined; // دعم web/admin
    if (!exists) throw new Error('Not authorized (not an admin)');

    const token = this.signToken({ uid, email, role: 'admin' });
    const profile = adminSnap.data ? adminSnap.data() : adminSnap._fieldsProto; // للتوافق

    return {
      token,
      user: { uid, email, role: 'admin', profile }
    };
  }

  validateToken(token) {
    return jwt.verify(token, this.jwtSecret);
  }
}

module.exports = new AuthService();
