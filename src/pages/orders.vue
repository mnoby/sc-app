<script setup>
import OrderForm from '@/views/pages/orders/OrderForm.vue'
import OrderList from '@/views/pages/orders/OrderList.vue'
import { useStore } from 'vuex'

const store = useStore()
const isMainPageValue = computed(() => store.state.isMainPage)

const newOrder = () => {
  // isMainPage.value= false
  store.commit('setMainPage', false)
  console.log('isMainPage value:', isMainPageValue.value)
}

const backToOrderList = () => {
  // isMainPage.value= true
  store.commit('setMainPage', true)

  // store.commit('setUpdateValues', undefined)

  console.log('isMainPage value Back:', isMainPageValue.value)

  // console.log('udpateValies value Back:', JSON.stringify(store.state.updateValues))
}

onMounted(async () => {
  try {
    store.commit('setMainPage', true)
    store.commit('setUpdateValues', undefined)
    console.log('isMainPage value:', isMainPageValue.value)

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
          <div v-if="isMainPageValue">
            <OrderList />
            <VBtn
              block
              class="rounded-t-0"
              type="submit"
              @click="newOrder"
            >
              <VIcon
                icon="bx-book-add"
                class="mr-2"
              />
              Add Order
            </VBtn>
          </div>

          <VCardText v-else>
            <VCol col="12">
              <OrderForm />
            </VCol>
          </VCardText>

          <!-- ============ BACK BUTTON ================================= -->
          
          <VBtn
            v-if="!isMainPageValue"
            block
            class="rounded-t-0"
            color="primary"
            text=" Back to Product List"
            @click="backToOrderList"
          />
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
