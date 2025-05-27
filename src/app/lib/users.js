// src/lib/users.js
// MODIFIED FOR ALLOWING DUPLICATE EMAIL REGISTRATIONS FOR TESTING
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), '.data');
const DB_PATH = path.join(dataDir, 'users.json');

let users = [];

async function ensureDataDirExists() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // console.error('[users.js] Error ensuring data directory exists:', error);
    // If dir already exists, that's fine. For other errors, log them.
    if (error.code !== 'EEXIST') {
        console.error('[users.js] Error ensuring data directory exists:', error);
    }
  }
}

async function loadUsers() {
  await ensureDataDirExists();
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    users = JSON.parse(data);
    // console.log(`[users.js loadUsers] Users loaded. Total: ${users.length}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // console.log(`[users.js loadUsers] ${DB_PATH} not found. Initializing empty.`);
      users = [];
      await saveUsers(); // Create the file if it doesn't exist
    } else {
      // console.error('[users.js loadUsers] Error loading users, initializing empty:', error);
      users = []; // Fallback to empty array on other read errors
    }
  }
}

async function saveUsers() {
  await ensureDataDirExists();
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
    // console.log(`[users.js saveUsers] Users saved.`);
  } catch (error) {
    console.error('[users.js saveUsers] Error saving users:', error);
  }
}

const usersLoadedPromise = loadUsers();

usersLoadedPromise.catch(err => {
  console.error('[users.js] Critical error during initial user load promise:', err);
});

export async function createUser({ email, password, name }) {
  await usersLoadedPromise;
  if (!password || password.length < 6) throw new Error('Password is required and must be at least 6 characters long.');
  if (!email || !/\S+@\S+\.\S+/.test(email)) throw new Error('A valid email is required.');

  // --- MODIFICATION FOR TESTING: Allow duplicate emails ---
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    // Instead of throwing an error, just log it for development.
    // The new user will still be created and added.
    console.warn(`[users.js createUser - DEV MODE] User with email ${email} already exists. Proceeding to create another entry for testing.`);
    // NOTE: findUserByEmail will find the FIRST user with this email.
    // This might lead to unexpected login behavior if passwords differ for duplicate emails.
  }
  // --- END OF MODIFICATION ---

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: crypto.randomBytes(16).toString('hex'), // Each entry will get a unique ID
    email,
    passwordHash,
    name: name || email.split('@')[0],
    resetToken: null,
    resetTokenExpiry: null,
    // Optional: add a timestamp to differentiate duplicate entries if needed for debugging
    // registeredAt: new Date().toISOString()
  };
  users.push(newUser);
  await saveUsers();
  const { passwordHash: _, ...userToReturn } = newUser;
  return userToReturn;
}

export async function findUserByEmail(email) {
  await usersLoadedPromise;
  // This will find the FIRST user matching the email in the array.
  const user = users.find(u => u.email === email);
  return user;
}

export async function verifyPassword(passwordFromLogin, storedHash) {
  if (!passwordFromLogin || !storedHash) {
    return false;
  }
  const isMatch = await bcrypt.compare(passwordFromLogin, storedHash);
  return isMatch;
}

export async function findUserById(id) {
  await usersLoadedPromise;
  if (!id) return null;
  const user = users.find(u => u.id === id);
  return user;
}

export async function setUserResetToken(email) {
  await usersLoadedPromise;
  // This will find the FIRST user matching the email.
  // If you have duplicates, this might not be the one you intend.
  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex > -1) {
    const token = crypto.randomBytes(32).toString('hex');
    users[userIndex].resetToken = token;
    users[userIndex].resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await saveUsers();
    return token;
  }
  return null;
}

export async function findUserByResetToken(token) {
  await usersLoadedPromise;
  if (!token) return null;
  const user = users.find(u => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > Date.now());
  return user;
}

export async function updateUserPassword(userId, newPassword) {
  await usersLoadedPromise;
  if (!userId || !newPassword || newPassword.length < 6) {
    throw new Error('Invalid arguments for password update.');
  }
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex > -1) {
    try {
        users[userIndex].passwordHash = await bcrypt.hash(newPassword, 10);
        users[userIndex].resetToken = null;
        users[userIndex].resetTokenExpiry = null;
        await saveUsers();
        return true;
    } catch (err) {
        throw new Error('Failed to hash new password.');
    }
  }
  return false;
}