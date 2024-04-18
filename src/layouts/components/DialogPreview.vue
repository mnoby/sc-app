<script setup>
const prop = defineProps(['dialogPreview', 'package', 'regular'])

const emit = defineEmits(["modallose"])
const open=ref(['Regular', 'Package'])
const isOpen = ref(false)
const target = ref(null)
const expandState=ref(true)
const iconExpand=ref('bx-bxs-up-arrow')

onClickOutside(target, ()=>emit('modalClose'))

watch(() => prop.dialogPreview, () => {
  isOpen.value = prop.dialogPreview
})

const stateChange=()=>{
  console.log(`state >> ${expandState.value}`)
  expandState.value = !expandState.value

  if(!expandState.value){
    iconExpand.value='bx-bxs-down-arrow'
  }else{
    iconExpand.value='bx-bxs-up-arrow'
  }
}
</script>

<template>
  <VDialog
    v-model="isOpen"
    max-width="720px"
  >
    <VCard
      ref="target"
      class="rounded-lg "
    >
      <VRow>
        <VCol
          cols="10"
          md="5"
          sm="10"
          xs="10"
        > 
          <VCardItem>
            <!-- Button Regular Items -->
            <div class="w-50">
              <VBtn
                variant="text"
                density="compact"
                size="small"
                :ripple="false"
                @click="stateChange"
              >
                Regular Items
                <VIcon
                  :icon="iconExpand"
                  size="15px"
                  end
                />
              </VBtn>
              <VDivider class="w-100" />
            </div>

            <!-- Regular Items List -->
          </VCardItem>
        </VCol>
      </VRow>
      <VContainer>
        <VList v-model:opened="open">
          <VRow>
            <VCol
              cols="10"
              md="6"
              sm="10"
              xs="10"
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
                    class=" text-primary"
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
                      class=" text-subtitle-2"
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
                    class="text-caption "
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
    </VCard>
  </VDialog>
</template>
