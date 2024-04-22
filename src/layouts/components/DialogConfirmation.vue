<script setup>
const prop = defineProps(['confirmationState'])

const emit = defineEmits(['modalClose', 'approveClicked'])
const isOpen = ref(false)

watch(() => prop.confirmationState, () => {
  console.log(`prop confirm state ${JSON.stringify(prop.confirmationState)}`)
  isOpen.value = prop.confirmationState
})
</script>

<template>
  <div class="text-center">
    <VDialog
      v-model="isOpen"
      z-index="9998"
      max-width="240"
      persistent
    >
      <VCard class="rounded-lg pa-4">
        <slot name="header-text">
          <div class="text-capitalize font-weight-black">
            please confirm
          </div>
          <VDivider
            class="border-opacity-25"
            color="#000"
          />
        </slot>
          
        <div class="text-center mt-4">
          <slot name="confirm-text">
            default confirmation text
          </slot>
            
          <slot name="confirm-btn">
            <div class="d-flex align-center justify-center gap-x-6 mt-6">
              <VBtn
                text="Yes"
                size="small"
                color="error"
                @click="emit('approveClicked')"
              /> 

              <VBtn
                text="No"
                size="small"
                color="info"
                @click="emit('modalClose')"
              /> 
            </div>
          </slot>
        </div>
      </VCard>
    </VDialog>
  </div>
</template>
