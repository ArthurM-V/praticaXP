const test = require('node:test');
const assert = require('node:assert/strict');
const { dateKey, createHabit, isCompleted, toggleHabit, getProgress } = require('./app');

const TODAY = '2026-10-29';

test('cria um hábito com nome normalizado', () => {
  const habit = createHabit('  Ler   livros  ', '1');
  assert.equal(habit.name, 'Ler livros');
  assert.deepEqual(habit.completedDates, []);
});

test('rejeita nomes inválidos', () => {
  assert.throws(() => createHabit(' ', '1'));
  assert.throws(() => createHabit('a'.repeat(51), '1'));
});

test('marcar e desmarcar hábito não modifica a lista original', () => {
  const initial = [createHabit('Beber água', '1')];
  const marked = toggleHabit(initial, '1', TODAY);
  assert.equal(isCompleted(marked[0], TODAY), true);
  assert.equal(isCompleted(initial[0], TODAY), false);
  const unmarked = toggleHabit(marked, '1', TODAY);
  assert.equal(isCompleted(unmarked[0], TODAY), false);
});

test('progresso considera apenas as conclusões de hoje', () => {
  const habits = [createHabit('Ler', '1'), createHabit('Caminhar', '2')];
  const doneYesterday = toggleHabit(habits, '1', '2026-10-28');
  const doneToday = toggleHabit(doneYesterday, '2', TODAY);
  assert.deepEqual(getProgress(doneToday, TODAY), { completed: 1, total: 2, percent: 50 });
});

test('lista vazia retorna progresso zero', () => {
  assert.deepEqual(getProgress([], TODAY), { completed: 0, total: 0, percent: 0 });
});

test('data usa calendário local', () => {
  assert.equal(dateKey(new Date(2026, 9, 29)), TODAY);
});
