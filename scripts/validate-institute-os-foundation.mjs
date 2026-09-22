import {
  COURSE_TRANSITIONS,
  CREDENTIAL_TRANSITIONS,
  PROGRAM_TRANSITIONS,
  COURSE_STATES,
  CREDENTIAL_STATES,
  PROGRAM_STATES,
  canTransition
} from '../src/lib/institute/domain.ts';

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(new Set(PROGRAM_STATES).size === PROGRAM_STATES.length, 'Duplicate program state.');
assert(new Set(COURSE_STATES).size === COURSE_STATES.length, 'Duplicate course state.');
assert(new Set(CREDENTIAL_STATES).size === CREDENTIAL_STATES.length, 'Duplicate credential state.');
assert(!canTransition(PROGRAM_TRANSITIONS, 'DRAFT', 'ACTIVE').allowed, 'Program DRAFT -> ACTIVE must be rejected.');
assert(!canTransition(COURSE_TRANSITIONS, 'DRAFT', 'RELEASED').allowed, 'Course DRAFT -> RELEASED must be rejected.');
assert(!canTransition(CREDENTIAL_TRANSITIONS, 'ELIGIBLE', 'ISSUED').allowed, 'Credential ELIGIBLE -> ISSUED must be rejected.');
assert(canTransition(CREDENTIAL_TRANSITIONS, 'ISSUED', 'REGISTERED').allowed, 'Credential ISSUED -> REGISTERED must be allowed.');
assert(!canTransition(CREDENTIAL_TRANSITIONS, 'REVOKED', 'VERIFIABLE').allowed, 'Credential REVOKED -> VERIFIABLE must be rejected.');

if (failures.length) {
  console.error('Institute OS foundation validation FAILED');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('Institute OS foundation validation PASS');
console.log('B1/B2/B3 foundation: state-transition guards and institutional object contracts are present.');
