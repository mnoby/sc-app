<script setup>
import OrderForm from '@/views/pages/orders/OrderForm.vue'
import OrderList from '@/views/pages/orders/OrderList.vue'

const isMainPage = ref(true)
const isEdit = ref(false)
const editVal = ref()

const getEditValue = order => {
  isEdit.value=true

  editVal.value=order
}

watch( () => isMainPage.value, () => {
  // console.log(`is edit order.vue >>> ${isEdit.value}`)
  // console.log(`isMainPage order.vue >>> ${isMainPage.value}`)

  // prop.isMainPage=false
})
</script>

<template>
  <VRow class="mx-0 px-0">      
    <!-- 👉 Multiple Column -->
    <VCol cols="12">
      <VCard class="px-0 mx-0">
        <!-- ============ BACK BUTTON ================================= -->
          
        
        <VBtn
          v-if="!isMainPage"
          block
          class="rounded-b-0"
          color="primary"
          text=" Go to Order List"
          prepend-icon="bx-bxs-chevron-left-circle"
          @click="isMainPage=true; isEdit=false"
        />
        <VCardTitle> Order Menu</VCardTitle>
          
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
              icon="bx-bxs-cart-add"
              class="mr-1"
              size="24px"
            />
            Add Order
          </VBtn>
        </div>

        <div v-else>
          <VCol
            col="12"
            class="px-0 pb-0"
          >
            <OrderForm
              :edit="isEdit"
              :edit-value="editVal"
              @main-page-close="isMainPage=true"
            />
          </VCol>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>
