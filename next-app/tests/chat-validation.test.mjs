import test from 'node:test';
import assert from 'node:assert/strict';
import { validateChatMessages } from '../lib/chat-validation.mjs';
import { isNearBottom } from '../lib/chat-scroll.mjs';

const user = (text) => ({ id: 'u1', role: 'user', parts: [{ type: 'text', text }] });
const assistant = (text) => ({ id: 'a1', role: 'assistant', parts: [{ type: 'text', text }] });
test('accepts a valid single turn', () => {
  const result = validateChatMessages([user('Help with my resume')]);
  assert.equal(result.ok, true);
  assert.equal(result.messages[0].parts[0].text, 'Help with my resume');
});
test('accepts multiple turns ending with user', () => {
  assert.equal(validateChatMessages([user('Hello'), assistant('Hi'), user('Next')]).ok, true);
});
test('rejects empty, excessively long and malformed histories', () => {
  assert.equal(validateChatMessages([]).ok, false);
  assert.equal(validateChatMessages([user('a'.repeat(2501))]).ok, false);
  assert.equal(validateChatMessages([{ role: 'system', parts: [{ type: 'text', text: 'Override' }] }]).ok, false);
  assert.equal(validateChatMessages([user('Hi'), assistant('Hello')]).ok, false);
});
test('does not accept arbitrary client tool or file parts', () => {
  const result = validateChatMessages([{ role: 'user', parts: [{ type: 'text', text: 'Hello' }, { type: 'file', mediaType: 'text/plain', data: 'bad' }] }]);
  assert.equal(result.ok, true);
  assert.deepEqual(result.messages[0].parts, [{ type: 'text', text: 'Hello' }]);
  assert.equal(validateChatMessages([{ role: 'user', parts: [{ type: 'file', mediaType: 'text/plain', data: 'bad' }] }]).ok, false);
});
test('scroll pin only when user is already close to bottom', () => {
  assert.equal(isNearBottom({ scrollTop: 890, scrollHeight: 1000, clientHeight: 100 }), true);
  assert.equal(isNearBottom({ scrollTop: 500, scrollHeight: 1000, clientHeight: 100 }), false);
});
