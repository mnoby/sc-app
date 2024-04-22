<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import ProductService from '@/services/ProductService'
import { useStore } from 'vuex'

const store = useStore()
const isModalOpened = ref(false)
const isConfirmed = ref(false)
const deletedData = ref()
const products=ref([])
const isMainPageValue = computed(() => store.state.isMainPage)
const dialog=ref(false)
const dialog2=ref(false)

onMounted(async () => {
  try{
    getProducts()
  } catch (error) {
    console.error('Error fetching Products: ', error)
  }
})

//fetch Products Data From DB
const getProducts = () => {
  ProductService.getAll('name').get().then(res => {
    products.value = res.docs.map(doc => ({ id: doc.id, name: doc.data().name, price: doc.data().price, package: doc.data().package, components: doc.data().components }))
  })
}

const updateProduct=product=>{
  let data = {
    id: product.id,
    details: {
      name: product.name,
      price: product.price,
      package: product.package,
      components: product.components,
    },
  }
  store.commit('setMainPage', false)
  store.commit('setUpdateValues', data)

  // console.log('udpateValues From List productList:', JSON.stringify(store.state.updateValues))
  // console.log(`YAAAA ${JSON.stringify(data)}`)
}

const getDeletedData = (productId, productName) => {
  deletedData.value={
    id: productId,
    name: productName,
  }
  dialog.value = true
}

const deleteProduct=productId=>{
  ProductService.delete(productId)
  dialog2.value=true
}

const reload = () =>{
  products.value=''
  getProducts()
  dialog.value=false
  dialog2.value=false
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
          v-for="(product) in products"
          :key="product.id"
        >
          <td>
            {{ product.name }}
          </td>
          <td class="text-center">
            {{ formatNumber(product.price) }}
          </td>
          <td>
            <div class="d-flex align-center justify-center w-55 gap-x-2">
              <VBtn
                type="updateProduct"
                size="x-small"
                color="warning"
                @click="updateProduct(product)"
              >
                <VIcon icon="bx-pencil" />
              </VBtn>

              <VDivider vertical />
              <!-- 
                <VBtn
                type="deleteProduct"
                size="x-small"
                color="error"
                @click="openModal(product.id, product.name)"
                >
                <VIcon icon="bx-trash" />
                </VBtn>
              -->

              <VBtn
                type="deleteProduct"
                size="x-small"
                color="error"
                @click="getDeletedData(product.id, product.name)"
              >
                <VIcon icon="bx-trash" />
              </VBtn>
            </div>
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCol>

  <!-- ////////////////////// MODAL ///////////////// -->
  <div class="text-center">
    <VDialog
      v-model="dialog"
      z-index="9999"
      max-width="240"
    >
      <VCard class="rounded-lg">
        <template #text>
          <div class="text-capitalize">
            please confirm
          </div>
          <VDivider
            class="border-opacity-25"
            color="#000"
          />
          <div class="text-center mt-4">
            <span class="text-body-2">Remove </span> <br>
            <span class="text-subtitle-1 text-decoration-underline"> {{ deletedData.name }}</span> ?
            
            
            <div class="d-flex align-center justify-center gap-x-6 mt-6">
              <VBtn
                text="Yes"
                size="small"
                color="error"
                @click="deleteProduct(deletedData.id)"
              /> 

              <VBtn
                text="No"
                size="small"
                color="info"
                @click="dialog2 = false; dialog = false"
              /> 
            </div>
          </div>
        </template>
      </VCard>
    </VDialog>

    <!-- DIALOG 2 -->
    <VDialog
      v-model="dialog2"
      max-width="320"
    >
      <VCard class="rounded-lg">
        <template #text>
          <!-- close Button -->
          <VCardActions class="py-0 px-0">
            <VSpacer />
          
            <VBtn
              text="Close"
              variant="text"
              @click="reload"
            > 
              <VIcon
                icon="bx-x-circle"
                color="disabled"
                size="32"
              />
            </VBtn>
          </VCardActions>

          <!-- Success Icon -->
          <div class="text-center mt-4">
            <VIcon
              class="mb-4"
              color="success"
              icon="mdi-check-circle-outline"
              size="128"
            />
            <h2> {{ deletedData.name }} </h2>
            <span>has been Deleted !</span>
          </div>
        </template>
      </VCard>
    </VDialog>
  </div>
</template>
