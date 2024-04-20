<script setup>
import OrderForm from '@/views/pages/orders/OrderForm.vue'
import OrderList from '@/views/pages/orders/OrderList.vue'
import { useStore } from 'vuex'

const store = useStore()

// const isMainPageValue = computed(() => store.state.isMainPage)
const isMainPage = ref(true)
const isEdit = ref(false)
const editVal = ref()

// const newOrder = () => {
//   // isMainPage.value= false
//   store.commit('setMainPage', false)
//   console.log('isMainPage value:', isMainPageValue.value)
// }

const getEditValue = order => {
  console.log(`JAJAJAJA ${JSON.stringify(order)}`)
  isEdit.value=true

  editVal.value=order
}

const backToOrderList = () => {
  // isMainPage.value= true
  store.commit('setMainPage', true)

  // store.commit('setUpdateValues', undefined)

  console.log('isMainPage value Back:', isMainPageValue.value)
  console.log('isMainPage value Back:', isMainPageValue.value)

  // console.log('udpateValies value Back:', JSON.stringify(store.state.updateValues))
}

watch( () => isMainPage.value, () => {
  console.log(`is edit order.vue >>> ${isEdit.value}`)
  console.log(`isMainPage order.vue >>> ${isMainPage.value}`)

  // prop.isMainPage=false
})
onMounted(async () => {
  console.log(`is edit order.vue onmounted >>> ${isEdit.value}`)

  try {
    store.commit('setMainPage', true)
    store.commit('setUpdateValues', undefined)

    // console.log('isMainPage value:', isMainPageValue.value)
    console.log('isMainPage value:', isMainPage.value)

    // console.log('udpateValies value:', JSON.stringify(store.state.updateValues))
  } catch (error) {
    console.error('Error fetching delivery options: ', error)
  }
})
</script>

<template>
  <div>
    <VRow>      
      <VCol cols="12">
        <!-- 👉 Multiple Column -->
        <VCard title="Order Details">
          <div v-if="isMainPage">
            <OrderList
              @main-page-close="isMainPage=false"
              @is-edit="getEditValue"
            />
            <VBtn
              block
              class="rounded-t-0"
              type="submit"
              @click="isMainPage=false"
            >
              <VIcon
                icon="bx-book-add"
                class="mr-2"
              />
              Add Order {{ isEdit }}
            </VBtn>
          </div>

          <VCardText v-else>
            <VCol col="12">
              <OrderForm
                :edit="isEdit"
                :edit-value="editVal"
              />
            </VCol>
          </VCardText>

          <!-- ============ BACK BUTTON ================================= -->
          
          <VBtn
            v-if="!isMainPage"
            block
            class="rounded-t-0"
            color="primary"
            text=" Back to Product List"
            @click="isMainPage=true; isEdit=false"
          />
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
