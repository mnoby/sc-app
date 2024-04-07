<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import Modal from '@/layouts/components/Modal.vue'
import ProductService from '@/services/ProductService'
import modalPict from '@images/cards/illustration-john-dark.png'
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
  <VTable
    v-if="isMainPageValue"
    height="250"
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
          <div class="d-md-flex gap-x-2">
            <VBtn
              type="updateProduct"
              size="small"
              color="warning"
              @click="updateProduct(product.product_id, product.product_name, product.product_price)"
            >
              <VIcon icon="bx-pencil" />
            </VBtn>

            
            <VBtn
              type="deleteProduct"
              size="small"
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
      <VImg
        :src="modalPict"
        height="100px"
      />
      <div v-if="!isConfirmed">
        Are You Sure Delete <h4>{{ deletedData.name }} ?</h4>
      </div>

      <div v-else>
        <h2>Success!</h2>
      </div>
    </template>
    <template #footer>
      <div
        v-if="!isConfirmed"
        class="d-md-flex gap-x-10"
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
        <h4> {{ deletedData.name }}</h4> has been Deleted !
      </div>
    </template>
  </Modal>
</template>
