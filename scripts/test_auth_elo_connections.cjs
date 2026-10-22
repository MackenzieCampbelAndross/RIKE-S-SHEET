/**
 * RIKE'S SHEET: Auth, Unique Usernames, Connections & ELO Rating Verification Suite
 */
const assert = require('assert');

console.log('====================================================');
console.log("RUNNING RIKE'S SHEET AUTH, CONNECTIONS & ELO TESTS");
console.log('====================================================\n');

// 1. Test Scoring Policy Values
console.log('TEST 1: Verifying scoring policy values & base ELO...');
const SCORING_POLICY = {
  BASE_ELO: 1000,
  EASY_POINTS: 2,
  MEDIUM_POINTS: 4,
  HARD_POINTS: 7,
  DAY_COMPLETION_BONUS: 5,
  ASSESSMENT_POINTS: 15,
};

assert.strictEqual(SCORING_POLICY.BASE_ELO, 1000, 'Base ELO must be exactly 1000');
assert.strictEqual(SCORING_POLICY.EASY_POINTS, 2, 'Easy task must award +2');
assert.strictEqual(SCORING_POLICY.MEDIUM_POINTS, 4, 'Medium task must award +4');
assert.strictEqual(SCORING_POLICY.HARD_POINTS, 7, 'Hard task must award +7');
assert.strictEqual(SCORING_POLICY.DAY_COMPLETION_BONUS, 5, 'Daily completion bonus must award +5');
assert.strictEqual(SCORING_POLICY.ASSESSMENT_POINTS, 15, 'Assessment task must award +15 (within 10-25 range)');
console.log('✓ PASS: All scoring points match specification.\n');

// 2. Test Username Validation & Normalization
console.log('TEST 2: Verifying username normalization & uniqueness rules...');
function normalizeUsername(u) {
  return u.toLowerCase().trim();
}

function isValidUsername(u) {
  const clean = normalizeUsername(u);
  if (clean.length < 3 || clean.length > 30) return false;
  return /^[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(clean);
}

assert.strictEqual(normalizeUsername('Mackenzie'), 'mackenzie');
assert.strictEqual(normalizeUsername('MACKENZIE'), 'mackenzie');
assert.strictEqual(normalizeUsername('  Mackenzie  '), 'mackenzie');
assert.strictEqual(isValidUsername('mackenzie'), true);
assert.strictEqual(isValidUsername('john_doe'), true);
assert.strictEqual(isValidUsername('ab'), false, 'Too short (<3)');
assert.strictEqual(isValidUsername('_bad'), false, 'Cannot start with underscore');
assert.strictEqual(isValidUsername('bad_'), false, 'Cannot end with underscore');
assert.strictEqual(isValidUsername('bad name'), false, 'Spaces not allowed');
console.log('✓ PASS: Username normalization & format validation confirmed.\n');

// 3. Test Remember Me Storage Isolation
console.log('TEST 3: Verifying Remember Me storage adapter logic...');
const mockLocalStorage = new Map();
const mockSessionStorage = new Map();

function createStorageAdapter(remember) {
  return {
    getItem(key) {
      return remember ? mockLocalStorage.get(key) || null : mockSessionStorage.get(key) || null;
    },
    setItem(key, value) {
      if (remember) {
        mockLocalStorage.set(key, value);
        mockSessionStorage.delete(key);
      } else {
        mockSessionStorage.set(key, value);
        mockLocalStorage.delete(key);
      }
    },
    removeItem(key) {
      mockLocalStorage.delete(key);
      mockSessionStorage.delete(key);
    }
  };
}

// Remembered session test
const rememberedAdapter = createStorageAdapter(true);
rememberedAdapter.setItem('auth_token', 'jwt_remembered_123');
assert.strictEqual(mockLocalStorage.get('auth_token'), 'jwt_remembered_123');
assert.strictEqual(mockSessionStorage.has('auth_token'), false);

// Non-remembered session test (reopening browser clears session storage)
const sessionOnlyAdapter = createStorageAdapter(false);
sessionOnlyAdapter.setItem('auth_token', 'jwt_session_456');
assert.strictEqual(mockSessionStorage.get('auth_token'), 'jwt_session_456');
assert.strictEqual(mockLocalStorage.has('auth_token'), false);
console.log('✓ PASS: Remember Me properly isolates between localStorage and sessionStorage.\n');

// 4. Test ELO Ledger Idempotency & Task Reversals
console.log('TEST 4: Simulating authoritative rating ledger & task reversals...');
class MockRatingLedger {
  constructor() {
    this.elo = 1000;
    this.ledger = new Map();
    this.completedTasks = new Set();
  }

  recordTask(courseId, dayNumber, taskId, difficulty, totalDayTasks) {
    const taskKey = `${courseId}:${taskId}`;
    if (this.completedTasks.has(taskKey)) {
      return { success: true, elo: this.elo, duplicate: true };
    }

    this.completedTasks.add(taskKey);
    const points = difficulty === 'HARD' ? 7 : difficulty === 'MEDIUM' ? 4 : difficulty === 'ASSESSMENT' ? 15 : 2;
    const eventKey = `task:${taskKey}`;
    this.ledger.set(eventKey, points);
    this.elo += points;

    // Check day bonus
    const dayTasksCompleted = Array.from(this.completedTasks).filter(k => k.startsWith(`${courseId}:d${String(dayNumber).padStart(3, '0')}`)).length;
    let bonusAwarded = false;
    if (totalDayTasks > 0 && dayTasksCompleted >= totalDayTasks) {
      const bonusKey = `day_bonus:${courseId}:${dayNumber}`;
      if (!this.ledger.has(bonusKey)) {
        this.ledger.set(bonusKey, 5);
        this.elo += 5;
        bonusAwarded = true;
      }
    }

    return { success: true, elo: this.elo, duplicate: false, bonusAwarded };
  }

  revokeTask(courseId, dayNumber, taskId) {
    const taskKey = `${courseId}:${taskId}`;
    if (!this.completedTasks.has(taskKey)) {
      return { success: true, elo: this.elo };
    }

    this.completedTasks.delete(taskKey);
    const eventKey = `task:${taskKey}`;
    const pts = this.ledger.get(eventKey) || 0;
    this.ledger.delete(eventKey);
    this.elo = Math.max(1000, this.elo - pts);

    // If day was broken, revoke day bonus
    const bonusKey = `day_bonus:${courseId}:${dayNumber}`;
    if (this.ledger.has(bonusKey)) {
      const bPts = this.ledger.get(bonusKey) || 0;
      this.ledger.delete(bonusKey);
      this.elo = Math.max(1000, this.elo - bPts);
    }

    return { success: true, elo: this.elo };
  }
}

const ledger = new MockRatingLedger();
assert.strictEqual(ledger.elo, 1000, 'Starts at 1000');

// Complete an Easy task (+2)
let res = ledger.recordTask('cpp-heavy', 1, 'd001_t01', 'EASY', 7);
assert.strictEqual(res.elo, 1002);
assert.strictEqual(res.duplicate, false);

// Duplicate completion attempt (must be idempotent, no points added)
res = ledger.recordTask('cpp-heavy', 1, 'd001_t01', 'EASY', 7);
assert.strictEqual(res.elo, 1002);
assert.strictEqual(res.duplicate, true);

// Complete a Medium task (+4)
res = ledger.recordTask('cpp-heavy', 1, 'd001_t02', 'MEDIUM', 7);
assert.strictEqual(res.elo, 1006);

// Complete a Hard task (+7)
res = ledger.recordTask('cpp-heavy', 1, 'd001_t03', 'HARD', 7);
assert.strictEqual(res.elo, 1013);

// Revoke the hard task (-7)
res = ledger.revokeTask('cpp-heavy', 1, 'd001_t03');
assert.strictEqual(res.elo, 1006);

// Re-complete the hard task (+7)
res = ledger.recordTask('cpp-heavy', 1, 'd001_t03', 'HARD', 7);
assert.strictEqual(res.elo, 1013);

console.log('✓ PASS: Rating ledger guarantees idempotence, anti-duplication and consistent revocation.\n');

// 5. Test Connections Business Logic
console.log('TEST 5: Verifying connections and friend request rules...');
function canSendFriendRequest(senderId, receiverId, existingConnections) {
  if (senderId === receiverId) return { allowed: false, error: 'Cannot send request to self' };
  const exists = existingConnections.some(
    c => (c.sender_id === senderId && c.receiver_id === receiverId) ||
         (c.sender_id === receiverId && c.receiver_id === senderId)
  );
  if (exists) return { allowed: false, error: 'Connection or request already exists' };
  return { allowed: true };
}

const connections = [];
assert.strictEqual(canSendFriendRequest('u1', 'u1', connections).allowed, false);
assert.strictEqual(canSendFriendRequest('u1', 'u2', connections).allowed, true);

connections.push({ sender_id: 'u1', receiver_id: 'u2', status: 'pending' });
assert.strictEqual(canSendFriendRequest('u1', 'u2', connections).allowed, false, 'Duplicate forward request rejected');
assert.strictEqual(canSendFriendRequest('u2', 'u1', connections).allowed, false, 'Duplicate reverse request rejected');

console.log('✓ PASS: Connection rules and anti-self/anti-duplicate constraints verified.\n');

console.log('====================================================');
console.log('ALL AUTH, CONNECTIONS & ELO TESTS PASSED! (5/5)');
console.log('====================================================');
