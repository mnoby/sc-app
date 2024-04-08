<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import Modal from '@/layouts/components/Modal.vue'
import ProductService from '@/services/ProductService'
import { useStore } from 'vuex'

const store = useStore()
const isModalOpened = ref(false)
const isConfirmed = ref(false)
const deletedData = ref()
const productData=ref([])
const isMainPageValue = computed(() => store.state.isMainPage)

onMounted(async () => {
  try {
    const response = await ProductService.getAll().get()

    productData.value = response.docs.map(doc => ({ product_id: doc.id, product_name: doc.data().p_name, product_price: doc.data().p_price }))
  } catch (error) {
    console.error('Error fetching delivery options: ', error)
  }
})

const closeModal = () => {
  isModalOpened.value = false
  window.location.reload()
}

const updateProduct=(productId, productName, productPrice)=>{
  let data = {
    id: productId,
    details: {
      productName: productName,
      productPrice: productPrice,
    },
  }
  store.commit('setMainPage', false)
  store.commit('setUpdateValues', data)
  console.log('udpateValues From List productList:', JSON.stringify(store.state.updateValues))

  
  console.log (`Id >>>>>>>>>>>> ${productId}`)
  console.log(`YAAAA ${JSON.stringify(data)}`)

}

const openModal = (productId, productName) => {
  isModalOpened.value = true
  deletedData.value={
    id: productId,
    name: productName,
  }
}

const deleteProduct=productId=>{
  ProductService.delete(productId)
  console.log(`Product ${productId} Deleted Successfully`)
  isConfirmed.value = true
}

const formatNumber = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
</script>

<template>
  <VCol
    cols="12"
    class="pt-0 py-0"
  >
    <VTable
      v-if="isMainPageValue"
      height="300"
      fixed-header
    >
      <thead>
        <tr>
          <th class="text-uppercase">
            Product Name
          </th>
          <th>
            Price(Rp)
          </th>
          <th />
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(product) in productData"
          :key="product.product_id"
        >
          <td>
            {{ product.product_name }}
          </td>
          <td class="text-center">
            {{ formatNumber(product.product_price) }}
          </td>
          <td>
            <div class="d-flex align-center justify-center w-55 gap-x-2">
              <VBtn
                type="updateProduct"
                size="x-small"
                color="warning"
                @click="updateProduct(product.product_id, product.product_name, product.product_price)"
              >
                <VIcon icon="bx-pencil" />
              </VBtn>

              <VDivider vertical />
            
              <VBtn
                type="deleteProduct"
                size="x-small"
                color="error"
                @click="openModal(product.product_id, product.product_name)"
              >
                <VIcon icon="bx-trash" />
              </VBtn>
            </div>
          </td>
        </tr>
      </tbody>
    </VTable>

    <Modal
      :is-open="isModalOpened"
      name="first-modal"
      @modal-close="closeModal"
    >
      <template #header />
      <template #content>
        <div v-if="!isConfirmed">
          <VIcon
            class="mb-6"
            color="warning"
            icon="mdi-help-circle-outline"
            size="128"
          />

          <br>
          Are You Sure Delete <h4>{{ deletedData.name }} ?</h4>
        </div>

        <div v-else>
          <VAvatar
            color="primary"
            variant="tonal"
            size="50"
            class="mb-4"
          >
            <VIcon
              size="2rem"
              icon="bx-check-circle"
            />
          </VAvatar>
        </div>
      </template>
      <template #footer>
        <div
          v-if="!isConfirmed"
          class="d-flex  align-center justify-center gap-x-10"
        >
          <VBtn
            type="submit"
            size="small"
            color="error"
            @click="deleteProduct(deletedData.id)"
          >
            YES
          </VBtn>

          <VBtn
            type="submit"
            size="small"
            color="info"
            @click="closeModal"
          >
            NO
          </VBtn>
        </div>
        <div v-else>
          <h2> {{ deletedData.name }}</h2> has been Deleted !
        </div>
      </template>
    </Modal>
  </VCol>
</template>
