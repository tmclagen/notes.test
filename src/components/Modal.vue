<template>
  <div class="modal">
    <div class="modal_overlay" @click="closeModal"></div>
    <div class="modal_box">
      <h3>{{text}}</h3>
      <div class="modal_buttons">
        <button @click="confirm" class="bttn bttn-danger">{{ok}}</button>
        <button @click="reject" class="bttn bttn-plain">{{no}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['text', 'ok', 'no'],
  methods: {
    closeModal() {
      this.$emit('closeModal');
    },
    confirm() {
      this.$emit('confirm');
    },
    reject() {
      this.$emit('reject');
    }
  }
}
</script>

<style>
.modal
{
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  padding: 25px;
  position: fixed;
  top: 0;
  width: 100%;
}
.modal_overlay
{
  background-color: hsla(0, 0%, 0%, .7);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
.modal_box
{
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 3px 25px 1px hsla(0, 0%, 0%, .055),
              0 15px 60px 5px hsla(0,0% ,0% , .035);
  box-sizing: border-box;
  max-width: 450px;
  padding: 30px;
  position: relative;
  width: 100%;
}
.modal_box h3
{
  color: var(--color-error);
  font-family: var(--font-accent);
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 30px;

}
.modal_buttons
{
  display: flex;
  justify-content: flex-end;
}
</style>