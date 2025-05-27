// src/lib/users.js
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
  } catch (error) {
    if (error.code === 'ENOENT') {
      users = [];
      await saveUsers();
    } else {
      users = [];
    }
  }
}

async function saveUsers() {
  await ensureDataDirExists();
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('[users.js saveUsers] Error saving users:', error);
  }
}

const usersLoadedPromise = loadUsers();

usersLoadedPromise.catch(initialLoadError => {
  console.error('[users.js] Critical error during initial user load promise:', initialLoadError);
});

export async function createUser({ email, password, name }) {
  await usersLoadedPromise;
  if (!password || password.length < 6) throw new Error('Password is required and must be at least 6 characters long.');
  if (!email || !/\S+@\S+\.\S+/.test(email)) throw new Error('A valid email is required.');

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    console.warn(`[users.js createUser - DEV MODE] User with email ${email} already exists. Proceeding to create another entry for testing.`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: crypto.randomBytes(16).toString('hex'),
    email,
    passwordHash,
    name: name || email.split('@')[0],
    resetToken: null,
    resetTokenExpiry: null,
  };
  users.push(newUser);
  await saveUsers();
  const { passwordHash: _removedPasswordHash, ...userToReturn } = newUser;
  return userToReturn;
}

export async function findUserByEmail(email) {
  await usersLoadedPromise;
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
  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex > -1) {
    const token = crypto.randomBytes(32).toString('hex');
    users[userIndex].resetToken = token;
    users[userIndex].resetTokenExpiry = Date.now() + 3600000;
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
    } catch (hashError) {
        console.error('[users.js updateUserPassword] Error hashing new password:', hashError);
        throw new Error('Failed to hash new password.');
    }
  }
  return false;
}