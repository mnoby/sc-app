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
  <div class="pa-4 text-center">
    <VBtn
      text="Open Dialog 1"
      @click="dialog = true"
    />

    <VDialog
      v-model="dialog"
      max-width="480"
    >
      <VCard title="Dialog 1">
        <template #text>
          <VBtn
            class="my-2"
            text="Open Dialog 2"
            @click="dialog2 = true"
          />
        </template>

        <VCardActions>
          <VSpacer />

          <VBtn
            text="Close"
            variant="text"
            @click="dialog = false"
          />
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="dialog2"
      max-width="240"
    >
      <VCard title="Dialog 2">
        <template #text>
          <VBtn
            class="my-2"
            text="Open Dialog 3"
            @click="dialog3 = !dialog3"
          />
        </template>

        <VCardActions>
          <VSpacer />

          <VBtn
            text="Close"
            variant="text"
            @click="dialog2 = false"
          />
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="dialog3"
      width="auto"
    >
      <VCard title="Dialog 3">
        <VCardActions>
          <VSpacer />

          <VBtn
            text="Close"
            variant="text"
            @click="dialog3 = false"
          />
        </VCardActions>
      </VCard>
    </VDialog>
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
