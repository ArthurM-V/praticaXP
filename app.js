
  function dateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function createHabit(name, id) {
    const trimmed = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '';
    if (trimmed.length < 2 || trimmed.length > 50) {
      throw new Error('O hábito deve ter entre 2 e 50 caracteres.');
    }
    return { id: String(id), name: trimmed, completedDates: [] };
  }

  function isCompleted(habit, date) {
    return Array.isArray(habit.completedDates) && habit.completedDates.includes(date);
  }

  function toggleHabit(habits, id, date) {
    return habits.map(habit => {
      if (habit.id !== id) return habit;
      const dates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
      return {
        ...habit,
        completedDates: dates.includes(date) ? dates.filter(d => d !== date) : [...dates, date]
      };
    });
  }

  function getProgress(habits, date) {
    const completed = habits.filter(habit => isCompleted(habit, date)).length;
    return { completed, total: habits.length, percent: habits.length ? Math.round((completed / habits.length) * 10) : 0 };
  }



const HabitUtils = { dateKey, createHabit, isCompleted, toggleHabit, getProgress };

function habitTracker() {
  const storageKey = 'habit-tracker-xp-v1';
  const today = HabitUtils.dateKey();
  const starter = [
    HabitUtils.createHabit('Beber água', 'starter-water'),
    HabitUtils.createHabit('Ler por 20 minutos', 'starter-read'),
    HabitUtils.createHabit('Praticar atividade física', 'starter-move')
  ];

  return {
    habits: [],
    newHabit: '',
    filter: 'all',
    error: '',
    today,

    init() {
      try {
        const stored = localStorage.getItem(storageKey);
        const parsed = stored === null ? starter : JSON.parse(stored);
        this.habits = Array.isArray(parsed) ? parsed.filter(h =>
          h && typeof h.id === 'string' && typeof h.name === 'string' && Array.isArray(h.completedDates)
        ) : starter;
      } catch (_err) {
        this.habits = starter;
      }
      this.persist();
    },

    get progress() {
      return HabitUtils.getProgress(this.habits, this.today);
    },

    get visibleHabits() {
      return this.filter === 'pending'
        ? this.habits.filter(h => !HabitUtils.isCompleted(h, this.today))
        : this.habits;
    },

    isCompleted(habit) {
      return HabitUtils.isCompleted(habit, this.today);
    },

    addHabit() {
      try {
        const name = this.newHabit.trim();
        if (this.habits.some(h => h.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))) {
          this.error = 'Esse hábito já está na sua lista.';
          return;
        }
        const id = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
        this.habits = [...this.habits, HabitUtils.createHabit(name, id)];
        this.newHabit = '';
        this.error = '';
        this.filter = 'all';
        this.persist();
      } catch (err) {
        this.error = err.message;
      }
    },

    toggle(id) {
      this.habits = HabitUtils.toggleHabit(this.habits, id, this.today);
      this.persist();
    },

    remove(id) {
      this.habits = this.habits.filter(h => h.id !== id);
      this.persist();
    },

    persist() {
      try { localStorage.setItem(storageKey, JSON.stringify(this.habits)); }
      catch (_err) { /* Ainda permite uso sem armazenamento disponível. */ }
    },

    get todayLabel() {
      return new Date(`${this.today}T12:00:00`).toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long'
      });
    }
  };
}


if (typeof module !== "undefined" && module.exports) {
  module.exports = HabitUtils;
}
