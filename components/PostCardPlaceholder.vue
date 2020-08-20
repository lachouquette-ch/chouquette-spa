<template>
  <content-placeholders centered class="card post-card-placeholder">
    <content-placeholders-img />
    <content-placeholders-text :lines="1" />
  </content-placeholders>
</template>

<script></script>

<style lang="scss" scoped>
.post-card-placeholder {
  width: 300px;
  height: 300px;
  padding: 10px;
  margin: 30px;

  .vue-content-placeholders-img {
    height: 75%;
  }
}
</style>
