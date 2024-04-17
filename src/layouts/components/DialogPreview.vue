<script setup>
const prop = defineProps(['dialogPreview', 'package', 'regular'])

const emit = defineEmits(["modallose"])
const open=ref(['Regular', 'Package'])
const isOpen = ref(false)
const target = ref(null)

onClickOutside(target, ()=>emit('modalClose'))

watch(() => prop.dialogPreview, () => {
  isOpen.value = prop.dialogPreview
})
</script>

<template>
  <VCard>
    <VDialog
      ref="target"
      v-model="isOpen"
      max-width="720px"
    >
      <VCard class="rounded-lg">
        <template #text>
          <!--
            close Button 
            <VCardActions class="py-0 px-0">
            <VSpacer />
          
            <VBtn
            text="Close"
            variant="text"
            > 
            <VIcon
            icon="bx-x-circle"
            color="disabled"
            size="32"
            @click="emit('modalClose')"
            />
            </VBtn>
            </VCardActions>
          -->
        
          <VContainer
            fluid
            class="ma-0 pa-0"
          >
            <VList
              v-model:opened="open"
              class="ma-0 pa-0"
            >
              <VRow>
                <VCol
                  cols="12"
                  md="6"
                  sm="12"
                  xs="12"
                >
                  <!-- <<<<<<<<<<<<<<<<<<< REGULAR ITEM GROUP >>>>>>>>>>>>>>>>>>> -->
                  <VListGroup value="Regular">
                    <template #activator="{ props }">
                      <VListItem
                        v-bind="props"
                        title="Regular Items"
                        density="compact"
                        class="text-primary "
                      />
                    </template>

                    <VListItem
                      v-for="(item) in prop.regular"
                      :key="item.order_no"
                      :ripple="false"
                      density="compact"
                      class="text-subtitle-2 py-0"
                    >
                      <VRow>
                        <VCol cols="9">
                          {{ item.product_name }}
                        </VCol>
                        <VCol cols="3">
                          {{ item.qty }} pack
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VListGroup>
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                  sm="12"
                  xs="12"
                >
                  <!-- <<<<<<<<<<<<<<<<<<< PACKAGE ITEM GROUP >>>>>>>>>>>>>>>>>>> -->
                  <VListGroup value="Package">
                    <template #activator="{ props }">
                      <VListItem
                        v-bind="props"
                        title="Package Items"
                        density="compact"
                        class="ma-0 pa-0 text-primary"
                      />
                    </template>

                    <VListGroup
                      v-for="(item) in prop.package"
                      :key="item.order_no"
                      :ripple="false"
                      :value="item.product_name"
                      density="compact"
                    >
                      <template #activator="{ props }">
                        <VListItem
                          v-bind="props"
                          density="compact"
                          class="ma-0 pa-0 text-subtitle-2"
                        >
                          <VRow>
                            <VCol cols="8">
                              {{ item.product_name }} 
                            </VCol>
                            <VCol cols="4">
                              {{ item.qty }} pack
                            </VCol>
                          </VRow>
                        </VListItem>
                      </template>
                      <VListItem
                        v-for="(comp) in item.components"
                        :key="comp"
                        :ripple="false"
                        density="compact"
                        class="text-caption py-0"
                      >
                        {{ comp }}
                      </VListItem>
                    </VListGroup>
                  </VListGroup>
                </VCol>

                <VCol
                  cols="12"
                  md="12"
                  sm="12"
                  xs="12"
                >
                  <!-- <<<<<<<<<<<<<<<<<<< TOTAL GROUP >>>>>>>>>>>>>>>>>>> -->
                  <VListGroup value="Summary">
                    <template #activator="{ props }">
                      <VListItem
                        v-bind="props"
                        title="Summary"
                        density="compact"
                        class="text-primary "
                      />
                    </template>

                    <VListItem
                      v-for="(item) in productRegular"
                      :key="item.order_no"
                      :ripple="false"
                      density="compact"
                      class="text-subtitle-2 py-0"
                    >
                      <VRow>
                        <VCol cols="9">
                          {{ item.product_name }}
                        </VCol>
                        <VCol cols="3">
                          {{ item.qty }} pack
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VListGroup>
                </VCol>
              </VRow>
            </VList>
          </VContainer>

          <VCardActions>
            <VSpacer />
            <VBtn
              color="blue-darken-1"
              variant="text"
              @click="emit('modalClose')"
            >
              Close
            </VBtn>
          </VCardActions>
        </template>
      </VCard>
    </VDialog>
  </VCard>
</template>
