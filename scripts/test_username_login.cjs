const { createClient } = require('@supabase/supabase-js');
const assert = require('assert');

const SUPABASE_URL = 'https://ircqebbpasebdbwdegim.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyY3FlYmJwYXNlYmRid2RlZ2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2ODQyNjQsImV4cCI6MjEwODI2MDI2NH0.vr_uaj090ZdWySgmIE51YZP5mbsx6gHpL9HuObEMQjI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log('====================================================');
  console.log('TESTING USERNAME LOGIN & EMAIL LOOKUP RPC');
  console.log('====================================================');

  // Test 1: Query existing username 'mouli'
  console.log('TEST 1: Resolving username "mouli"...');
  const { data: mouliEmail, error: err1 } = await supabase.rpc('get_email_by_username', {
    p_username: 'mouli',
  });
  assert(!err1, 'RPC failed: ' + JSON.stringify(err1));
  assert.strictEqual(mouliEmail, 'mouleeswaran0824@gmail.com');
  console.log('✓ PASS: Resolved "mouli" ->', mouliEmail);

  // Test 2: Query with leading @: '@mouli'
  console.log('TEST 2: Resolving handle "@mouli"...');
  const { data: atMouliEmail, error: err2 } = await supabase.rpc('get_email_by_username', {
    p_username: '@mouli',
  });
  assert(!err2, 'RPC failed: ' + JSON.stringify(err2));
  assert.strictEqual(atMouliEmail, 'mouleeswaran0824@gmail.com');
  console.log('✓ PASS: Resolved "@mouli" ->', atMouliEmail);

  // Test 3: Query with uppercase and whitespace: '  MoULi  '
  console.log('TEST 3: Resolving case & whitespace "  MoULi  "...');
  const { data: caseMouliEmail, error: err3 } = await supabase.rpc('get_email_by_username', {
    p_username: '  MoULi  ',
  });
  assert(!err3, 'RPC failed: ' + JSON.stringify(err3));
  assert.strictEqual(caseMouliEmail, 'mouleeswaran0824@gmail.com');
  console.log('✓ PASS: Resolved "  MoULi  " ->', caseMouliEmail);

  // Test 4: Query another user 'bigmac'
  console.log('TEST 4: Resolving username "bigmac"...');
  const { data: bigmacEmail, error: err4 } = await supabase.rpc('get_email_by_username', {
    p_username: 'bigmac',
  });
  assert(!err4, 'RPC failed: ' + JSON.stringify(err4));
  assert.strictEqual(bigmacEmail, 'macc.andross@gmail.com');
  console.log('✓ PASS: Resolved "bigmac" ->', bigmacEmail);

  // Test 5: Query nonexistent user
  console.log('TEST 5: Resolving nonexistent user...');
  const { data: nonExistent, error: err5 } = await supabase.rpc('get_email_by_username', {
    p_username: 'this_user_does_not_exist_xyz123',
  });
  assert(!err5, 'RPC failed: ' + JSON.stringify(err5));
  assert.strictEqual(nonExistent, null);
  console.log('✓ PASS: Nonexistent user returns null.');

  console.log('====================================================');
  console.log('ALL USERNAME LOGIN TESTS PASSED SUCCESSFULLY! (5/5)');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
