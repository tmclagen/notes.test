<template>
  <li class="note_todo_item" :class="{'is-done': isTaskDone}">
    <label class="note_todo_item_checkbox">
      <input type="checkbox" v-model="isTaskDone">
      <span></span>
    </label>
    <input ref="taskTextInput" @keydown.enter.prevent="$event.target.blur()" @blur="editMode = false" @change="editTaskText"
           class="note_todo_item_text note_todo_item_text_input" 
           v-show="editMode" v-model="taskText">
    <p class="note_todo_item_text" v-show="!editMode" v-text="taskText"></p>
    <button type="button" class="note_todo_item_bttn note_todo_item_bttn_edit" @click="turnOnEditMode">
      <app-icon icon="mdCreate"></app-icon>
    </button>
    <button type="button" class="note_todo_item_bttn note_todo_item_bttn_delete" @click="deleteTask">
      <app-icon icon="mdClose"></app-icon>
    </button>
  </li>
</template>

<script>
import Icons from '@/components/Icons.vue'

export default {
  data() {
    return {
      editMode: false
    }
  },
  computed: {
    task() {
      return this.$store.state.note.tasks.find(item => item.id == this.taskId)
    },
    taskText: {
      get() {
        return this.task.text;
      },
      set(value) {
        this.$store.dispatch('updateTaskText', {
          id: this.taskId,
          text: value
        });
      }
    },
    isTaskDone: {
      get() {
        return this.task.done;
      },
      set(value) {
        this.$store.dispatch('updateTaskStatus', {
          id: this.taskId,
          done: value
        });
      }
    }
  },
  props: ['task-id'],
  components: {
    appIcon: Icons
  },
  methods: {
    turnOnEditMode() {
      this.editMode = true;
      setTimeout(() => {
        this.$refs.taskTextInput.focus();
      }, 10)
    },
    deleteTask() {
      this.$emit('deleteTask', this.taskId);
    },
    editTaskText() {
      this.$store.dispatch('pushHistory');
    }
  }
}
</script>

<style>
.note_todo_item
{
  align-items: center;
  display: flex;
  padding: 5px 0;
}
.note_todo_item_checkbox
{
  cursor: pointer;
  flex-shrink: 0;
  margin-right: 15px;
}
.note_todo_item_checkbox input
{
  display: none;
}
.note_todo_item_checkbox span
{
  border: 2px solid currentColor;
  border-radius: 50%;
  color: hsla(0, 0%, 0%, .35);
  display: block;
  height: 20px;
  position: relative;
  transition: .075s ease-out;
  width: 20px;
}
.note_todo_item_checkbox span::before,
.note_todo_item_checkbox span::after
{
  background-color: #fff;
  content: "";
  display: block;
  left: -6px;
  margin: 0 auto;
  position: absolute;
  transform-origin: center bottom;
  transition: .15s ease-out;
  right: 0;
  width: 2px;
}
.note_todo_item_checkbox span::before
{
  bottom: 6px;
  height: 5px;
  transform: rotate(-45deg) scaleY(0);
}
.note_todo_item_checkbox span::after
{
  bottom: 5px;
  height: 13px;
  transform: rotate(45deg) scaleY(0);
}
.note_todo_item_checkbox input:checked + span
{
  background-color: currentColor;
  color: var(--color-accent);
}
.note_todo_item_checkbox input:checked + span::before
{
  transform: rotate(-45deg) scaleY(1);
}
.note_todo_item_checkbox input:checked + span::after
{
  transform: rotate(45deg) scaleY(1);
}

.note_todo_item.is-done .note_todo_item_text
{
  opacity: .35;
  text-decoration: line-through;
}
.note_todo_item_text
{
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 20px;
  margin-right: auto;
  min-height: 20px;
  outline: none;
  padding: 0;
  width: 100%;
}
.note_todo_item_text_input
{
  box-shadow: 0 2px 0 0 var(--color-accent);
}

.note_todo_item_bttn
{
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  box-sizing: initial;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 24px;
  justify-content: center;
  opacity: 0;
  outline: 0;
  padding: 10px;
  transition: .075s ease-out;
  width: 24px;
}
.note_todo_item:hover .note_todo_item_bttn
{
  opacity: .2;
}
.note_todo_item:hover .note_todo_item_bttn:hover,
.note_todo_item:hover .note_todo_item_bttn:focus
{
  opacity: .5;
}
.note_todo_item_bttn_delete
{
  margin-right: -10px;
}
.note_todo_item_bttn svg
{
  height: 100%;
  width: 100%;
}
.note_todo_item_bttn_edit svg
{
  height: 90%;
  width: 90%;
}
</style>