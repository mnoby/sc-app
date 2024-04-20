<script setup>
const prop = defineProps(['dialogPreview', 'parseOrder'])

const emit = defineEmits(["modalClose"])
const open=ref(['Regular', 'Package'])
const isOpen = ref(false)
const target = ref(null)
const expandState=ref(true)
const expandState2=ref(true)
const subExpandState2=ref({})

// const subExpandState2=ref(true)
const expandState3=ref(true)

onClickOutside(target, ()=>emit('modalClose'))

watch(() => prop.dialogPreview, () => {
  isOpen.value = prop.dialogPreview
})


const subExpandState2Switcher=index=>{
  if(!subExpandState2.value[index]==undefined){
    subExpandState2.value[index] = true
  } else {
    subExpandState2.value[index] = !subExpandState2.value[index]
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
      class="rounded-lg pa-4"
    >
      <VRow>
        <!-- Regular Items Col -->
        <VCol
          cols="12"
          md="6"
          sm="12"
          xs="12"
        >
          <!-- Button Regular Items -->
          <div class="w-50">
            <VBtn
              variant="text"
              density="compact"
              size="small"
              class="font-weight-medium"
              :ripple="false"
              @click="expandState = !expandState"
            >
              Regular Items
              <VIcon
                :icon="expandState? 'bx-bxs-up-arrow' : 'bx-bxs-down-arrow' "
                size="15px"
                end
              />
            </VBtn>
            <VDivider class="w-100" />
          </div>

          <!-- Regular Items List -->
          <VExpandTransition>
            <VList
              v-show="expandState"
              v-if="prop.parseOrder.regular.length"
              lines="one"
            >
              <VListItemTitle
                v-for="(item) in prop.parseOrder.regular"
                :key="item.product_name"
                :ripple="false"
                class="text-subtitle-2 text-high-emphasis text-capitalize"
              >
                <VRow class="h-10 ms-1">
                  <VCol cols="9">
                    {{ item.product_name }}
                  </VCol>
                  <VCol cols="1">
                    <span class="font-weight-black"> {{ item.qty }}  </span> 
                  </VCol>
                  <VCol
                    cols="1"
                    class="ps-1"
                  >
                    <span> pack </span>
                  </VCol>
                </VRow>
              </VListItemTitle>
            </VList>

            <VList
              v-show="expandState"
              v-else
              lines="one"
            >
              <VListItemTitle
                :ripple="false"
                class="ms-2 text-error text-subtitle-2 text-high-emphasis text-capitalize"
              >
                Not Available
              </VListItemTitle>
            </VList>
          </VExpandTransition>
        </VCol>

        <!-- Package Item Col -->
        <VCol
          cols="12"
          md="6"
          sm="12"
          xs="12"
        >
          <!-- Button Package Items -->
          <div class="w-50">
            <VBtn
              variant="text"
              density="compact"
              size="small"
              class="font-weight-medium"
              :ripple="false"
              @click="expandState2 = !expandState2"
            >
              Package Items
              <VIcon
                :icon="expandState2? 'bx-bxs-up-arrow' : 'bx-bxs-down-arrow' "
                size="15px"
                end
              />
            </VBtn>
            <VDivider class="w-100" />
          </div>

          <!-- Package Items List -->
          <VExpandTransition>
            <VList
              v-show="expandState2"
              v-if="prop.parseOrder.package.length"
              lines="one"
            >
              <VListItemTitle
                v-for="(item, idx) in prop.parseOrder.package"
                :key="idx"
                :ripple="false"
                class="text-subtitle-2 text-high-emphasis text-capitalize"
              >
                <!-- SUBList Package Item -->
                <VBtn
                  variant="text"
                  density="compact"
                  size="small"
                  width="100vw"
                  class=" text-primary font-weight-medium justify-start"
                  color="black"
                  :ripple="false"
                  :append-icon="subExpandState2[idx]? 'bx-chevron-up' : 'bx-chevron-down' "
                  @click="subExpandState2Switcher(idx)"
                >
                  <VRow>
                    <VCol>
                      {{ item.product_name }}
                    </VCol>
                    <VCol cols="1">
                      <span class="font-weight-black"> {{ item.qty }}  </span> 
                    </VCol>
                    <VCol
                      cols="3"
                      class="ps-1"
                    >
                      <span> pack </span>
                    </VCol>
                  </VRow>
                </VBtn>
                  
                <VExpandTransition>
                  <VList
                    v-show="subExpandState2[idx]"
                    v-if="prop.parseOrder.package.length"
                    lines="one"
                  >
                    <VListItemTitle
                      v-for="(comp,idx) in item.components"
                      :key="idx"
                      :ripple="false"
                      class="text-subtitle-2 text-high-emphasis text-capitalize"
                    >
                      <VRow class="h-10 ms-3">
                        <VCol cols="9">
                          {{ comp }}
                        </VCol>
                      </VRow>
                    </VListItemTitle>
                    <VDivider />
                  </VList>
                </VExpandTransition>
              </VListItemTitle>
            </VList>

            <VList
              v-show="expandState2"
              v-else
              lines="one"
            >
              <VListItemTitle
                :ripple="false"
                class="ms-2 text-error text-subtitle-2 text-high-emphasis text-capitalize"
              >
                Not Available
              </VListItemTitle>
            </VList>
          </VExpandTransition>
        </VCol>

        <!-- Summary Item Col -->
        <VCol
          cols="12"
          md="6"
          sm="12"
          xs="12"
        >
          <!-- Button Summary Items -->
          <div class="w-50">
            <VBtn
              variant="text"
              density="compact"
              size="small"
              class="font-weight-medium"
              :ripple="false"
              @click="expandState3 = !expandState3"
            >
              Summary Items
              <VIcon
                :icon="expandState3? 'bx-bxs-up-arrow' : 'bx-bxs-down-arrow'"
                size="15px"
                end
              />
            </VBtn>
            <VDivider class="w-100" />
          </div>

          <!-- Summary Items List -->
          <VExpandTransition>
            <VList
              v-show="expandState3"
              lines="one"
            >
              <VListItemTitle
                v-for="(item,idx) in prop.parseOrder.summary"
                :key="idx"
                :ripple="false"
                class="text-subtitle-2 text-high-emphasis text-capitalize"
              >
                <VRow class="ms-1">
                  <VCol cols="9">
                    {{ item.product_name }}
                  </VCol>
                  <VCol cols="1">
                    <span class="font-weight-black"> {{ item.qty }}  </span>
                  </VCol>
                  <VCol
                    cols="1"
                    class="ps-1"
                  >
                    <span> pack </span>
                  </VCol>
                </VRow>
              </VListItemTitle>
            </VList>
          </VExpandTransition>
        </VCol>
      </VRow>

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
