<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import ProductService from '@/services/ProductService'
import { useStore } from 'vuex'

const store = useStore()
const isMainPageValue = computed(() => store.state.isMainPage)


const productData=ref([])
const updateData=ref()
const updated=ref(false)

onMounted(async () => {
  try {
    
    const response = await ProductService.getAll().get()

    productData.value = response.docs.map(doc => ({ product_id: doc.id, product_name: doc.data().p_name, product_price: doc.data().p_price }))

    // console.log(`HAHAHA ${JSON.stringify(productData.value)}`

  } catch (error) {
    console.error('Error fetching delivery options: ', error)
  }

})

const updateProduct=(productId, productName, productPrice)=>{

  console.log (`Id >>>>>>>>>>>> ${productId}`)
  updated.value= true

  let data = {
    productName: productName,
    productPrice: productPrice,
  }
  store.commit('setMainPage', false)
  updateData.value = data
  console.log(`TAAAAAA >>>> ${JSON.stringify(updateData.value)}`)
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
          {{ product.product_price }}
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
            >
              <VIcon icon="bx-trash" />
            </VBtn>
          </div>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
