<template>
  <div class="page_home">
    <div class="note_list" v-if="notes.length">
      <app-note @deleteNote="modalShowDeleteNote" v-for="note in notes" :key="note.id" :note="note" />
    </div>
    <div class="note_list is-empty" v-else>
      <p>I'm jealous of your free time.</p>
      <p>Wanna busy yourself by creating a new note?</p>
      <div class="note_list_arrow">
        <svg viewBox="1.988 170.807 419.563 84.709" xmlns="http://www.w3.org/2000/svg">
          <path vector-effect="non-scaling-stroke" d="M 1.988 170.807 C 1.988 170.807 174.866 293.423 417.935 230.823" />
          <line vector-effect="non-scaling-stroke" x1="416.668" y1="234.414" x2="381.05" y2="216.21" transform="matrix(0.981627, -0.19081, 0.19081, 0.981627, -35.66354, 80.245934)"/>
          <line vector-effect="non-scaling-stroke" x1="420.141" y1="234.081" x2="384.524" y2="252.285" transform="matrix(0.981627, -0.19081, 0.19081, 0.981627, -39.009686, 81.237061)"/>
        </svg>
      </div>
    </div>
    <router-link class="note_bttn_add" :to="{name: 'noteAdd'}">
      <app-icon icon="mdAdd"></app-icon>
    </router-link>
    <app-modal 
      @closeModal="modalHideDeleteNote" @confirm="deleteNote" @reject="modalHideDeleteNote"
      v-show="isModalDeleteNoteActive" :text="`Delete this note?`" ok="Delete" no="Cancel">
    </app-modal>
  </div>
</template>

<script>
import Note from '@/components/Note.vue'
import Modal from '@/components/Modal.vue'
import Icons from '@/components/Icons.vue'

export default {
  data() {
    return {
      isModalDeleteNoteActive: false
    }
  },
  computed: {
    notes() {
      return this.$store.state.notes.map(note => {
        return {
          ...note,
          tasks: [
            ...this.$store.state.tasks.filter(task => note.id == task.noteId)
          ]
        };
      });
    }
  },
  methods: {
    modalShowDeleteNote(noteId) {
      this.isModalDeleteNoteActive = true;
      this.deleteNoteId = noteId;
    },
    modalHideDeleteNote() {
      this.isModalDeleteNoteActive = false;
      this.deleteNoteId = null;
    },
    deleteNote() {
      this.$store.dispatch('deleteNote', this.deleteNoteId);
      this.modalHideDeleteNote();
    }
  },
  components: {
    appNote: Note,
    appIcon: Icons,
    appModal: Modal
  }
}
</script>

<style>
.page_home
{
  margin: 0 auto;
  max-width: 450px;
}
.note_list
{
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 50px 0;
}
.note_list.is-empty
{
  color: hsla(0, 0%, 0%, .35);
  display: block;
  font-family: var(--font-accent);
  font-size: 30px;
  margin: 100px 0;
  position: relative;
  text-align: center;
}
.note_list.is-empty p:not(:last-of-type)
{
  margin-bottom: 1em;
}
.note_list_arrow
{
  margin-top: 15px;
  position: absolute;
  right: 0;
  width: 200px;
}
.note_list_arrow svg
{
  display: block;
  fill: none;
  stroke: hsl(0, 0%, 70%);
  stroke-width: 2px;
  width: 100%;
}
.note_bttn_add
{
  align-items: center;
  background-color: var(--color-accent);
  border-radius: 50%;
  bottom: 50px;
  box-shadow: 0 1px 5px 1px hsla(0, 0%, 0%, .15), 
              0 5px 20px 3px hsla(0,0% ,0% , .125);
  display: flex;
  fill: #fff;
  height: 50px;
  justify-content: center;
  left: 100%;
  margin-top: -100px;
  position: sticky;
  transform: translateX(80px);
  width: 50px;
}
.note_bttn_add svg
{
  height: 24px;
  width: 24px;
}
@media screen and (max-width: 650px)
{
  .note_bttn_add
  {
    margin-top: -25px;
    transform: translateX(0);
  }
}
</style>
