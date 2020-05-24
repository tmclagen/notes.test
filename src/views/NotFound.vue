<template>
  <div class="page_notfound">
    <h2>Ooops<span>404 The page was not found</span></h2>
  </div>
</template>

<style>
  .page_notfound
  {
    align-items: center;
    display: flex;
    justify-content: center;
    min-height: calc(100vh - 250px);
  }
  .page_notfound h2
  {
    color: hsla(0, 0%, 0%, .35);
    font-family: var(--font-accent);
    font-size: 70px;
    text-align: center;
  }
  .page_notfound h2 span
  {
    display: block;
    font-size: 30px;
    margin-top: 20px;
  }
</style>
