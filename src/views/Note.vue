<template>
  <div class="page_note">
    <form @submit.prevent="saveNote" class="note">
      <div class="note_header">
        <label class="note_header_input_name">
          <span>Name</span>
          <input @change="editNoteName" ref="noteNameEl" type="text" v-model="noteName" placeholder="Potion ingredients">
        </label>
      </div>
      <div class="note_body">
        <h2>Todo list</h2>
        <ul class="note_todo">
          <app-task @deleteTask="modalShowDeleteTask" v-for="task in tasks" :task-id="task.id" :key="task.id"></app-task>
        </ul>
        <form @submit.prevent="addNewTask" class="note_todo_new">
          <input type="text" v-model="newTask" placeholder="New task... again?">
          <button :disabled="!newTask">
            <app-icon icon="mdAdd"></app-icon>
          </button>
        </form>
        <div class="note_bttns">
          <div class="note_bttns_save_wrap">
            <span v-if="!modeNew" :class="{'is-visible': isNoteSaved}" class="note_bttns_save_notification">Saved</span>
            <button class="bttn bttn-primary" type="submit">{{ modeNew ? 'Add' : 'Save' }}</button>
          </div>
          <button type="button" class="bttn bttn-danger" @click="modalShowDeleteNote" v-if="!modeNew">Delete</button>
        </div>
      </div>
    </form>
    <div class="note_controls">
      <div class="note_controls_wrap">
        <button @click="modalShowCancelNote" class="note_controls_item note_controls_item_cancel bttn bttn-round bttn-plain">
          <app-icon icon="mdClose"></app-icon>
        </button>
        <button v-if="historyCurrent > 1" @click="undo" class="note_controls_item note_controls_item_undo bttn bttn-round bttn-plain">
          <app-icon icon="iosUndo"></app-icon>
        </button>
        <button v-if="historyCurrent < historyCount" @click="redo" class="note_controls_item note_controls_item_redo bttn bttn-round bttn-plain">
          <app-icon icon="iosRedo"></app-icon>
        </button>
      </div>
    </div>
    <app-modal 
      @closeModal="modalHideDeleteTask" @confirm="deleteTask" @reject="modalHideDeleteTask"
      v-show="isModalDeleteTaskActive" text="Delete this task?" ok="Delete" no="Keep it">
    </app-modal>
    <app-modal 
      @closeModal="modalHideCancelNote" @confirm="cancelNote" @reject="modalHideCancelNote"
      v-show="isModalCancelNoteActive" text="Leave and discard any change?" ok="Discard" no="Stay">
    </app-modal>
    <app-modal 
      @closeModal="modalHideDeleteNote" @confirm="deleteNote" @reject="modalHideDeleteNote"
      v-show="isModalDeleteNoteActive" :text="`Delete this note?`" ok="Delete" no="Cancel">
    </app-modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue'
import Task from '@/components/Task.vue'
import Icons from '@/components/Icons.vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  created() {
    if(this.id)
    {
      this.modeNew = false;
      this.$store.dispatch('setNote', this.id);
    }
    else
    {
      this.modeNew = true;
      this.newNoteId = uuidv4();
      this.$store.dispatch('newNote', this.newNoteId);
    }
  },
  data() {
    return {
      newTask: null,
      isModalDeleteTaskActive: false,
      isModalCancelNoteActive: false,
      isModalDeleteNoteActive: false
    }
  },
  props: ['id'],
  computed: {
    noteId() {
      return this.id ? this.id : this.newNoteId
    },
    isNoteModified() {
      return this.$store.state.noteModified;
    },
    isNoteSaved() {
      return this.$store.state.noteSaved;
    },
    noteName: {
      get() {
        this.isNoteNameEmpty = false;
        return this.$store.state.note.name;
      },
      set(value) {
        this.$store.dispatch('updateName', value)
      }
    },
    tasks() {
      return this.$store.state.note.tasks;
    },
    historyCurrent() {
      return this.$store.state.noteHistoryCurrent;
    },
    historyCount() {
      return this.$store.state.noteHistory.length;
    }
  },
  components: {
    appTask: Task,
    appModal: Modal,
    appIcon: Icons
  },
  methods: {
    modalShowDeleteTask(taskId) {
      this.isModalDeleteTaskActive = true;
      this.deleteTaskId = taskId;
    },
    modalHideDeleteTask() {
      this.isModalDeleteTaskActive = false;
      this.deleteTaskId = null;
    },
    deleteTask() {
      this.$store.dispatch('deleteTask', this.deleteTaskId);
      this.modalHideDeleteTask();
    },

    modalShowCancelNote() {
      if(this.isNoteModified)
      {
        this.isModalCancelNoteActive = true;
      }
      else
      {
        this.cancelNote();
      }
    },
    modalHideCancelNote() {
      this.isModalCancelNoteActive = false;
    },
    editNoteName() {
      this.$store.dispatch('pushHistory');
    },
    saveNote() {
      if(!this.noteName)
      {
        this.$refs.noteNameEl.focus();
        return;
      }
      this.$store.dispatch('saveNote', this.noteId);
      if(this.modeNew)
      {
        this.$router.push({name: 'home'});
      }
    },
    cancelNote() {
      this.modalHideCancelNote();
      this.$router.push({name: 'home'});
    },
    modalShowDeleteNote() {
      this.isModalDeleteNoteActive = true;
    },
    modalHideDeleteNote() {
      this.isModalDeleteNoteActive = false;
    },
    deleteNote() {
      this.$store.dispatch('deleteNote', this.noteId);
      this.$router.push({name: 'home'});
      this.modalHideDeleteNote();
    },

    addNewTask() {
      const taskInfo = {
        noteId: this.noteId,
        text: this.newTask
      }
      this.$store.dispatch('addNewTask', taskInfo);
      this.newTask = null;
    },

    undo() {
      this.$store.dispatch('undoHistory');
    },
    redo() {
      this.$store.dispatch('redoHistory');
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('cancelNote');
    next();
  }
}
</script>

<style>
.page_note
{
  align-items: flex-start;
  display: flex;
  left: 25px;
  margin: 50px auto;
  position: relative;
  max-width: 500px;
}
.note_controls
{
  left: 100%;
  position: sticky;
  top: 0;
  transform: translateX(30px);
  width: fit-content;
}
.note_controls_wrap
{
  display: flex;
  flex-direction: column;
  max-width: 450px;
  width: 100%;
}
.note_controls_item
{
  align-items: center;
  display: flex;
  justify-content: center;
}
.note_controls_item.bttn
{
  margin-right: 0;
}
.note_controls_item:not(:last-child)
{
  margin-bottom: 5px;
}
.note_controls_item svg
{
  height: 24px;
  width: 24px;
}
.note_controls_item_undo svg,
.note_controls_item_redo svg
{
  height: 20px;
  width: 20px;
}

@media screen and (max-width: 650px)
{
  .page_note
  {
    left: 0;
    max-width: 450px;
    padding-bottom: 70px;
  }
  .note_controls
  {
    background: white;
    bottom: 0;
    box-shadow: 0 3px 25px 1px hsla(0, 0%, 0%, .055), 0 15px 60px 5px hsla(0,0% ,0% , .035);
    box-sizing: border-box;
    left: 0;
    padding: 0 25px;
    position: fixed;
    top: auto;
    transform: none;
    width: 100%;
  }
  .note_controls_wrap
  {
    box-sizing: border-box;
    flex-direction: row;
    margin: 0 auto;
    padding: 5px 30px;
  }
  .note_controls_item:not(:last-child)
  {
    margin-bottom: 0;
    margin-right: 5px;
  }
  .note_controls_item_cancel
  {
    margin-left: auto;
    order: 1;
  }
}


.note_header
{
  padding: 30px;
}
.note_header_input_name span
{
  display: block;
  margin-bottom: 5px;
  opacity: .35;
}
.note_header_input_name input
{
  background-color: hsla(0, 0%, 0%, .025);
  border: 2px solid transparent;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: var(--font-accent);
  font-size: 20px;
  font-weight: 600;
  outline: none;
  padding: 10px 15px;
  text-transform: lowercase;
  width: 100%;
}
.note_header_input_name input:focus
{
  border-color: var(--color-accent);
}

.note_body
{
  padding: 0 30px 30px;
}
.note_body h2
{
  opacity: .35;
}
.note_todo_new
{
  margin-top: 15px;
  position: relative;
}
.note_todo_new input
{
  background-color: hsla(0, 0%, 0%, .025);
  border: 2px solid transparent;
  border-radius: 25px;
  box-sizing: border-box;
  font-family: var(--font-body);
  font-size: 1rem;
  height: 50px;
  outline: none;
  padding: 0 50px 0 15px;
  transition: .075s ease-out;
  width: 100%;
}
.note_todo_new input:focus
{
  border-color: var(--color-accent);
}
.note_todo_new button
{
  appearance: none;
  background: var(--color-accent);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  fill: #fff;
  height: 40px;
  outline: none;
  right: 5px;
  position: absolute;
  top: 5px;
  transition: .075s ease-out;
  width: 40px;
}
.note_todo_new button:disabled
{
  background-color: hsla(0, 0%, 0%, 0.1);
  cursor: default;
  fill: hsla(0, 0%, 0%, .3);
}
.note_todo_new button svg
{
  height: 24px;
  width: 24px;
}

.note_bttns
{
  display: flex;
  padding: 30px 0;
}
.note_bttns_save_wrap
{
  position: relative;
  margin-right: 5px;
}
.note_bttns_save_wrap .bttn
{
  position: relative;
}
.note_bttns_save_notification
{
  display: block!important;
  color: var(--color-accent);
  line-height: 25px;
  opacity: 0;
  position: absolute;
  text-align: center;
  top: 0;
  visibility: hidden;
  width: 100%;
}
.note_bttns_save_notification.is-visible
{
  animation: savedNote 2s forwards;
  visibility: visible;
}
@keyframes savedNote {
  0%
  {
    opacity: 0;
  }
  25%
  {
    opacity: 1;
    transform: translate(0, -100%);
  }
  75%
  {
    opacity: 1;
    transform: translate(0, -100%);
  }
  100%
  {
    opacity: 0;
    transform: translate(0, -100%);
  }
}
</style>
