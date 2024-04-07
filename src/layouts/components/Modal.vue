<script setup>
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(["modalClose"])

const target = ref(null)

onClickOutside(target, ()=>emit('modalClose'))
</script>

<template>
  <div
    v-if="isOpen"
    class="modal-mask"
  >
    <div class="modal-wrapper">
      <div
        ref="target"
        class="modal-container"
      >
        <div class="modal-header">
          <slot name="header">
            <div>
              <button @click.stop="emit('modalClose')">
                <VIcon icon="bx-x-circle" />
              </button>
            </div>
          </slot>
        </div>
        <div class="modal-body">
          <slot name="content">
            default content
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            default footer
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 50%);
  block-size: 100vh;
  inline-size: 100vw;
  inset-block-start: 0;
  inset-inline-start: 0;
}

.modal-container {
  position: relative;
  border-radius: 20px;
  background-color: #fff;
  block-size: 80%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 33%);
  inline-size: 80%;
  margin-block: 35vh;
  margin-inline: auto;
  max-block-size: 320px;
  max-inline-size: 320px;
  padding-block: 20px;
  padding-inline: 30px;
}

.modal-header {
  text-align: end;
}

.modal-body {
  padding-block: 10px;
}

.modal-body,
.modal-footer {
  text-align: center;
}
</style>
