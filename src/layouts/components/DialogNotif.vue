<script setup>
const prop = defineProps(['modalOpen'])

const emit = defineEmits(["modalClose"])
const isOpen = ref(false)
const target = ref(null)

onClickOutside(target, ()=>emit('modalClose'))

watch(() => prop.modalOpen, () => {
  isOpen.value = prop.modalOpen
})
</script>

<template>
  <div class="text-center">
    <VDialog
      v-model="isOpen"
      z-index="9999"
      max-width="320"
    >
      <VCard
        ref="target"
        class="rounded-lg border pe-0 me-0"
        border="black"
      >
        <slot name="header-action">
          <!-- close Button -->
          <div class="d-flex justify-end">
            <VBtn
              text="Close"
              variant="text"
              class="mt-2 pe-0"
              @click="emit('modalClose')"
            > 
              <VIcon
                icon="bx-x-circle"
                color="disabled"
                size="24"
              />
            </VBtn>
          </div>
        </slot>

        <div class="text-center">
          <slot name="modal-content">
            default modal-content
          </slot>
        </div>

        <div class="text-center text-subtitle-2 my-4">
          <slot name="modal-subcontent">
            default modal-subcontent
          </slot>
        </div>
      </VCard>
    </VDialog>
  </div>
</template>
