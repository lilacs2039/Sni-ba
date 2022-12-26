<script setup lang="ts">
import { ref, reactive } from "vue";

const props = defineProps({
  text: String,
  icon: String,
});
</script>

<template>
  <button class="icon-text-button shadow">
    <img class="icon-text-icon" :src="icon" />
    {{ text }}
  </button>

  <!-- <button class="icon-button shadow">
    <img :src="icon" />
    <div class="mask">{{ caption }}</div>
  </button> -->
</template>

<style>
.icon-text-button {
  display: inline-block;
  border-radius: 5%; /* 角丸       */
  font-size: 18pt; /* 文字サイズ */
  text-align: center; /* 文字位置   */
  cursor: pointer; /* カーソル   */
  padding: 12px 12px; /* 余白       */
  background: var(--button-color);
  /* color: #ffffff;  */
  line-height: 1em; /* 1行の高さ  */
  transition: 0.3s; /* なめらか変化 */
  border: 2px solid #000; /*#4da6ff*/
}
.icon-text-button:hover {
  box-shadow: none; /* カーソル時の影消去 */
  color: #4da6ff; /* 背景色     */
  background: #ffffff; /* 文字色     */
}
.icon-text-icon{
  vertical-align: middle;
}
</style>
