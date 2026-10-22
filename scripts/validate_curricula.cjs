// Validation script for C++, Java, and Python curricula
const fs = require('fs');
const path = require('path');

const curriculaDir = path.join(__dirname, '..', 'src', 'data', 'curricula');
const cpp = JSON.parse(fs.readFileSync(path.join(curriculaDir, 'cpp.json'), 'utf8'));
const java = JSON.parse(fs.readFileSync(path.join(curriculaDir, 'java.json'), 'utf8'));
const python = JSON.parse(fs.readFileSync(path.join(curriculaDir, 'python.json'), 'utf8'));

console.log('--- CURRICULUM VALIDATION REPORT ---');

let passed = true;

// 1. Day count checks
if (cpp.length !== 180) { console.error('FAIL: C++ day count != 180:', cpp.length); passed = false; }
if (java.length !== 180) { console.error('FAIL: Java day count != 180:', java.length); passed = false; }
if (python.length !== 180) { console.error('FAIL: Python day count != 180:', python.length); passed = false; }

// 2. Day sequence check
function checkSequence(name, list) {
  for (let i = 0; i < 180; i++) {
    if (list[i].dayNumber !== i + 1 || list[i].id !== i + 1) {
      console.error(`FAIL: ${name} day out of sequence at index ${i}: expected ${i+1}, got dayNumber ${list[i].dayNumber}, id ${list[i].id}`);
      passed = false;
    }
  }
}
checkSequence('C++', cpp);
checkSequence('Java', java);
checkSequence('Python', python);

// 3. Task ID uniqueness across ALL curricula
const allTaskIds = new Set();
let totalTasks = 0;
let dupTaskIds = 0;

[...cpp, ...java, ...python].forEach(day => {
  day.tasks.forEach(t => {
    totalTasks++;
    if (allTaskIds.has(t.id)) {
      console.error(`FAIL: Duplicate task ID: ${t.id} in day ${day.dayNumber}`);
      dupTaskIds++;
      passed = false;
    }
    allTaskIds.add(t.id);
  });
});

console.log(`Checked ${totalTasks} total tasks across all 3 tracks. Unique task IDs: ${allTaskIds.size}. Duplicates: ${dupTaskIds}`);

// 4. Duplicate title check within each track
function checkDuplicateTitles(name, list) {
  const titles = new Set();
  list.forEach(d => {
    const norm = d.title.toLowerCase().trim();
    if (titles.has(norm)) {
      console.error(`FAIL: Duplicate title in ${name}: "${d.title}" on Day ${d.dayNumber}`);
      passed = false;
    }
    titles.add(norm);
  });
}
checkDuplicateTitles('Java', java);
checkDuplicateTitles('Python', python);

// 5. Check for placeholder / vague tasks
const placeholderWords = ['placeholder', 'todo', 'tbd', 'study java', 'learn dsa', 'learn python', 'generic task'];
function checkPlaceholders(name, list) {
  list.forEach(d => {
    if (!d.title || d.title.trim().length < 3) {
      console.error(`FAIL: Empty or short title in ${name} Day ${d.dayNumber}`);
      passed = false;
    }
    if (!d.focus || d.focus.trim().length < 3) {
      console.error(`FAIL: Empty or short focus in ${name} Day ${d.dayNumber}`);
      passed = false;
    }
    d.tasks.forEach(t => {
      const lower = t.title.toLowerCase();
      placeholderWords.forEach(w => {
        if (lower === w) {
          console.error(`FAIL: Placeholder task in ${name} Day ${d.dayNumber}: "${t.title}"`);
          passed = false;
        }
      });
      if (t.title.trim().length < 5) {
        console.error(`FAIL: Suspiciously short task in ${name} Day ${d.dayNumber}: "${t.title}"`);
        passed = false;
      }
    });
  });
}
checkPlaceholders('Java', java);
checkPlaceholders('Python', python);

// 6. Check that Phase 1 contains language fundamentals and later phases contain CS core & interviews
function checkPedagogy(name, list, langKey) {
  const phase1 = list.slice(0, 30);
  const phase4 = list.slice(120, 150);
  const phase5 = list.slice(150, 170);
  const phase6 = list.slice(170, 180);

  const phase1Text = JSON.stringify(phase1).toLowerCase();
  if (!phase1Text.includes(langKey)) {
    console.error(`FAIL: ${name} phase 1 does not mention ${langKey}`);
    passed = false;
  }

  const phase4Text = JSON.stringify(phase4).toLowerCase();
  if (!phase4Text.includes('dbms') || !phase4Text.includes('os') || !phase4Text.includes('sql') || !phase4Text.includes('networks')) {
    console.error(`FAIL: ${name} phase 4 missing CS core`);
    passed = false;
  }

  const phase5Text = JSON.stringify(phase5).toLowerCase();
  if (!phase5Text.includes('interview') || !phase5Text.includes('aptitude') || !phase5Text.includes('resume')) {
    console.error(`FAIL: ${name} phase 5 missing interview prep`);
    passed = false;
  }

  const phase6Text = JSON.stringify(phase6).toLowerCase();
  if (!phase6Text.includes('assessment') || !phase6Text.includes('mock') || !phase6Text.includes('placement')) {
    console.error(`FAIL: ${name} phase 6 missing placement simulations`);
    passed = false;
  }
}
checkPedagogy('Java', java, 'java');
checkPedagogy('Python', python, 'python');

if (passed) {
  console.log('SUCCESS: All 10 curriculum validation criteria PASSED!');
  console.log(`Java tasks count: ${java.reduce((acc, d) => acc + d.tasks.length, 0)} across 180 days.`);
  console.log(`Python tasks count: ${python.reduce((acc, d) => acc + d.tasks.length, 0)} across 180 days.`);
  console.log(`C++ tasks count: ${cpp.reduce((acc, d) => acc + d.tasks.length, 0)} across 180 days.`);
} else {
  console.error('FAIL: One or more validation criteria failed.');
  process.exit(1);
}
