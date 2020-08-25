<template>
  <content-placeholders centered class="card fiche-placeholder">
    <div class="card-header p-0">
      <content-placeholders-img />
    </div>
    <div class="card-body">
      <content-placeholders-text :lines="5" />
    </div>
    <div class="card-footer">
      <content-placeholders-text :lines="1" />
    </div>
  </content-placeholders>
</template>

<script></script>

<style lang="scss" scoped>
.fiche-placeholder {
  width: 330px;
  height: 500px;

  .vue-content-placeholders-img {
    height: 200px;
  }
}
</style>
