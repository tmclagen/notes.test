<template>
  <div id="app">
    <h1 class="logo"><router-link to="/">Notes</router-link></h1>
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('init');
  }
}
</script>

<style>
:root
{
  --font-accent: 'Nunito', sans-serif;
  --font-body: 'Roboto', sans-serif;
  --color-accent: hsl(150, 50%, 50%);
  --color-accent-down: hsl(150, 40%, 45%);
  --color-error: hsl(0, 65%, 55%);
  --color-error-down: hsl(0, 55%, 50%);
}
body
{
  background-color: hsla(0, 0%, 98%);
  font-family: var(--font-body);
}
#app
{
  margin: 0 25px;
}
.logo
{
  color: var(--color-accent);
  font-family: var(--font-accent);
  font-size: 30px;
  font-weight: 600;
  margin: 30px 0;
  text-align: center;
  text-transform: lowercase;
}
.logo a
{
  color: currentColor;
  text-decoration: none;
}

.bttn
{
  appearance: none;
  background: none;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-family: var(--font-accent);
  font-size: 16px;
  height: 50px;
  outline: 0;
  padding: 0 30px;
  transition: .075s ease-out;
  /* text-transform: lowercase; */
}
.bttn-round
{
  padding: 0;
  width: 50px;
}
.bttn:not(:last-child)
{
  margin-right: 5px;
}
.bttn-primary
{
  background-color: var(--color-accent);
  color: #fff;
}
.bttn-primary:hover,
.bttn-primary:focus
{
  background-color: var(--color-accent-down);
}
.bttn-danger
{
  background-color: var(--color-error);
  color: #fff;
}
.bttn-danger:hover,
.bttn-danger:focus
{
  background-color: var(--color-error-down);
}
.bttn-plain
{
  background-color: hsla(0, 0%, 0%, 0.05);
  color: hsla(0, 0%, 0%, .8);
  fill: hsla(0, 0%, 0%, .3);
  font-weight: 700;
}
.bttn-plain:hover,
.bttn-plain:focus
{
  background-color: hsla(0, 0%, 0%, 0.1);
  fill: hsla(0, 0%, 0%, .6);
}
</style>
