import Vue from 'vue'
import Vuex from 'vuex'
import { v4 as uuidv4 } from 'uuid'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notes: {},
    tasks: {},
    note: null,
    noteHistory: [],
    noteHistoryCurrent: null,
    noteSaved: false,
    noteModified: false
  },
  mutations: {
    init(state, payload) {
      state.notes = payload.notes;
      state.tasks = payload.tasks;
    },
    setNote(state, noteId) {
      const note = {
        ...state.notes.find(item => item.id == noteId),
        tasks: [
          ...state.tasks.filter(item => item.noteId == noteId)
        ]
      };
      // Deep clone it so it wouldn't affect the original state
      state.note = JSON.parse(JSON.stringify(note));
    },
    newNote(state, noteId) {
      state.note = {
        id: noteId,
        name: null,
        tasks: []
      };
    },
    saveNote(state, noteId) {
      const notes = state.notes;
      const note = notes.find(item => item.id == noteId);
      if(note)
      {
        note.name = state.note.name;
        note.id = state.note.id;
      }
      else
      {
        notes.unshift({
          name: state.note.name,
          id: state.note.id
        });
      }

      const tasks = state.tasks;
      const tasksUpd = tasks.filter(item => item.noteId != noteId);
      tasks.length = 0;
      tasks.push(...tasksUpd);
      tasks.push(...state.note.tasks);
    },
    deleteNote(state, noteId) {
      const notes = state.notes;
      const note = notes.find(item => item.id == noteId);
      const noteIndex = notes.indexOf(note);
      notes.splice(noteIndex, 1);

      const tasks = state.tasks;
      const tasksUpd = tasks.filter(item => item.noteId != noteId);
      tasks.length = 0;
      tasks.push(...tasksUpd);
    },
    cancelNote(state) {
      state.note = null;
      state.noteHistory = [];
    },
    toggleSaveNoteNotification(state, status) {
      state.noteSaved = status;
    },
    updateName(state, name) {
      state.note.name = name;
    },
    updateTaskText(state, task) {
      const taskItem = state.note.tasks.find(item => item.id == task.id);
      taskItem.text = task.text;
    },
    updateTaskStatus(state, task) {
      const taskItem = state.note.tasks.find(item => item.id == task.id);
      taskItem.done = task.done;
    },
    addNewTask(state, taskInfo) {
      const task = {
        id: uuidv4(),
        noteId: taskInfo.noteId,
        text: taskInfo.text,
        done: false
      };
      state.note.tasks.push(task);
    },
    deleteTask(state, taskId) {
      const tasks = state.note.tasks;
      const task = tasks.find(item => item.id == taskId);
      const taskIndex = tasks.indexOf(task);
      tasks.splice(taskIndex, 1);
    },
    pushHistory(state) {
      // Deep clone the note so we wouldn't change the history. You're a wizard, Harry!
      const notePrint = JSON.parse(JSON.stringify(state.note));
      const historyCurrent = state.noteHistoryCurrent;
      const historyCount = state.noteHistory.length;

      state.noteHistory.splice(historyCurrent, historyCount - historyCurrent, notePrint);

      state.noteHistoryCurrent = historyCount + 1; // we've added one entry
    },
    undoHistory(state) {
      if(state.noteHistoryCurrent == 1)
      {
        return;
      }
      state.noteHistoryCurrent--;
    },
    redoHistory(state) {
      if(state.noteHistoryCurrent == state.noteHistory.length)
      {
        return;
      }
      state.noteHistoryCurrent++;
    },
    shiftHistory(state) {
      // Deep clone
      let notePrint = state.noteHistory[state.noteHistoryCurrent - 1]; // zero-based arrays
      notePrint = JSON.parse(JSON.stringify(notePrint));

      state.note = notePrint;
    },
    noteModified(state, status) {
      state.noteModified = status;
    }
  },
  actions: {
    init({ commit }) {
      let notes = localStorage.getItem('notes');
      if(notes)
      {
        notes = JSON.parse(notes);
      }
      else
      {
        notes = [
          {
            id: 1,
            name: 'Groceries shopping'
          },
          {
            id: 2,
            name: 'Santa\'s chores'
          },
          {
            id: 3,
            name: 'Sleep'
          }
        ];
      }

      let tasks = localStorage.getItem('tasks');
      if(tasks)
      {
        tasks = JSON.parse(tasks);
      }
      else
      {
        tasks = [
          {
            id: 1,
            noteId: 1,
            text: 'Bread',
            done: false
          },
          {
            id: 2,
            noteId: 1,
            text: 'Almond milk',
            done: false
          },
          {
            id: 3,
            noteId: 1,
            text: 'Dog biscuits',
            done: false
          },
          {
            id: 4,
            noteId: 1,
            text: 'Pineapple',
            done: false
          },
          {
            id: 5,
            noteId: 1,
            text: 'More bread to the god of bread',
            done: false
          },
          {
            id: 6,
            noteId: 2,
            text: 'Feed the deer',
            done: false
          },
          {
            id: 7,
            noteId: 2,
            text: 'Compliment the elves',
            done: false
          },
          {
            id: 8,
            noteId: 2,
            text: 'Check kids reputation',
            done: false
          },
          {
            id: 9,
            noteId: 2,
            text: 'Read kids letters',
            done: false
          },
          {
            id: 10,
            noteId: 2,
            text: 'Chimney workout',
            done: false
          },
          {
            id: 11,
            noteId: 2,
            text: 'Bake cookies',
            done: false
          },
          {
            id: 12,
            noteId: 3,
            text: 'at work',
            done: true
          },
          {
            id: 13,
            noteId: 3,
            text: 'in school',
            done: true
          },
          {
            id: 14,
            noteId: 3,
            text: 'at the wedding',
            done: false
          },
          {
            id: 15,
            noteId: 3,
            text: 'in apocalypse',
            done: false
          }
        ];
      }

      commit('init', {notes, tasks});
    },
    saveToLocalStorage({ state }) {
      localStorage.setItem('notes', JSON.stringify(state.notes));
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },

    saveNote({ commit, dispatch }, noteId) {
      commit('saveNote', noteId);
      commit('toggleSaveNoteNotification', true);
      commit('noteModified', false);
      dispatch('saveToLocalStorage');

      setTimeout(() => {
        commit('toggleSaveNoteNotification', false);
      }, 2000);
    },
    deleteNote({ commit, dispatch }, noteId) {
      commit('deleteNote', noteId);
      commit('noteModified', false);
      dispatch('saveToLocalStorage');
    },
    cancelNote({ commit }) {
      commit('cancelNote');
      commit('noteModified', false);
    },
    setNote({ commit, dispatch }, noteId) {
      commit('setNote', noteId);
      dispatch('pushHistory');
      commit('noteModified', false);
    },
    newNote({ commit, dispatch }, noteId) {
      commit('newNote', noteId);
      dispatch('pushHistory');
      commit('noteModified', false);
    },

    updateName({ commit }, name) {
      commit('updateName', name);
    },

    updateTaskText({ commit }, task) {
      commit('updateTaskText', task);
    },
    updateTaskStatus({ commit, dispatch }, task) {
      commit('updateTaskStatus', task);
      dispatch('pushHistory');
    },
    addNewTask({ commit, dispatch }, taskInfo) {
      commit('addNewTask', taskInfo);
      dispatch('pushHistory');
    },
    deleteTask({ commit, dispatch }, taskId) {
      commit('deleteTask', taskId);
      dispatch('pushHistory');
    },

    pushHistory({ commit }) {
      commit('pushHistory');
      commit('noteModified', true);
    },
    undoHistory({ commit }) {
      commit('undoHistory');
      commit('shiftHistory');
      commit('noteModified', true);
    },
    redoHistory({ commit }) {
      commit('redoHistory');
      commit('shiftHistory');
      commit('noteModified', true);
    }
  },
  modules: {
  }
})
