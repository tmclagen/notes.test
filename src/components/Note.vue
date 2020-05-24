<template>
  <section class="note note_item">
    <div class="note_item_header">
      <h2>{{ note.name }}</h2>
      <router-link class="note_item_header_bttn note_item_header_bttn_edit" :to="notePath">
        <app-icon icon="mdCreate"></app-icon>
      </router-link>
      <button @click="deleteNote" class="note_item_header_bttn note_item_header_bttn_delete">
        <app-icon icon="mdClose"></app-icon>
      </button>
    </div>
    <div class="note_item_body" v-if="tasks.length">
      <ul class="note_item_todo">
        <li class="note_item_todo_item" :class="{'is-done': item.done}" v-for="item in tasks" :key="item.id">
          {{ item.text }}
        </li>
      </ul>
      <router-link class="note_item_todo_bttn_remain" :to="notePath" v-if="tasksRemain > 0">
        +{{ tasksRemain }} more task{{ tasksRemain == 1 ? '' : 's' }} to do
      </router-link>
    </div>
  </section>
</template>

<script>
import Icons from '@/components/Icons.vue'

export default {
  data() {
    return {
      tasksPreviewLimit: 3,
      tasksRemain: 0,
      notePath: {
        name: 'note', 
        params: { 
          id: this.note.id 
        }
      }
    }
  },
  props: ['note'],
  computed: {
    tasks() {
      const tasks = this.note.tasks;
      const tasksPreview = [];
      const countTasks = tasks.length;
      for(let i = 0; i < countTasks; i++)
      {
        if(i >= this.tasksPreviewLimit)
        {
          break;
        }
        tasksPreview.push(tasks[i]);
      }

      this.tasksRemain = countTasks - this.tasksPreviewLimit;
      return tasksPreview;
    }
  },
  methods: {
    deleteNote() {
      this.$emit('deleteNote', this.note.id);
    }
  },
  components: {
    appIcon: Icons
  }
}
</script>

<style>
.note
{
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 3px 25px 1px hsla(0, 0%, 0%, .055),
              0 15px 60px 5px hsla(0,0% ,0% , .035);
  max-width: 450px;
  width: 100%;
}
.note_item:not(:last-of-type)
{
  margin-bottom: 15px;
}
.note_item_header
{
  align-items: center;
  color: var(--color-accent);
  display: flex;
  font-family: var(--font-accent);
  font-size: 20px;
  font-weight: 600;
  padding: 10px 30px;
  text-transform: lowercase;
}
.note_item_header h2
{
  margin-right: auto;
}
.note_item_header_bttn
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
.note_item:hover .note_item_header_bttn
{
  opacity: .2;
}
.note_item:hover .note_item_header_bttn:hover,
.note_item:hover .note_item_header_bttn:focus
{
  opacity: .5;
}
.note_item_header_bttn svg
{
  height: 100%;
  width: 100%;
}
.note_item_header_bttn_edit svg
{
  height: 90%;
  width: 90%;
}
.note_item_header_bttn_delete
{
  margin-right: -10px;
}
.note_item_body
{
  padding: 0 30px 30px;
}
.note_item_todo
{
  margin-bottom: 15px;
}
.note_item_todo_item
{
  align-items: center;
  display: flex;
  padding: .5em 0;
}
.note_item_todo_item.is-done
{
  opacity: .35;
  text-decoration: line-through;
}
.note_item_todo_item::before
{
  background-color: var(--color-accent);
  border-radius: 50%;
  content: "";
  height: 6px;
  margin-right: 10px;
  width: 6px;
}
.note_item_todo_bttn_remain
{
  border-bottom: 1px solid currentColor;
  color: var(--color-accent);
  /* opacity: .4;
  color: #000; */
  text-decoration: none;
}
</style>
