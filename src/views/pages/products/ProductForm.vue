<script setup>
import Modal from '@/layouts/components/Modal.vue'
import ProductService from '@/services/ProductService'
import { useStore } from 'vuex'

const isModalOpened = ref(false)
let modalTxt=''

const openModal = () => {
  isModalOpened.value = true
}

const closeModal = () => {
  isModalOpened.value = false
  refreshField()
}

const store = useStore()
const updateValues =store.state.updateValues

const submitted=ref(false)

const productData = ref({
  name: '',
  price: '',
})

if (updateValues!= null){
  productData.value = updateValues.details
}

const checks = () => {

  if (updateValues!= null){

    console.log(`PAPAPA >> ${JSON.stringify(updateValues.details)}`)
    console.log(`MAMAMA >> ${JSON.stringify(updateValues.id)}`)
    productData.value = updateValues.details
  } else{
    console.log(`Kosong Broo}`)
  }
}

const saveProduct = () => {
// ============================  SAVE ORDER FLOW ============================

  if (updateValues== null){
    modalTxt = 'Added'

    ProductService.create(productData.value)
      .then(() => {
        console.log("Created new item successfully!")
      })
      .catch(e => {
        console.log(e)
      })
  } else{
    modalTxt = 'Updated'
    ProductService.update(updateValues.id, productData.value).then(() => {
      console.log(`AJJAJAJA ${JSON.stringify(productData.value)}`)
    })
  }
  isModalOpened.value = true
  console.log(`modaTxt ${JSON.stringify(modalTxt)}`)
}
    
const refreshField = () => {
  submitted.value= false,  
  productData.value = {
    name: '',
    price: '',
  }
}

// ============================  END SAVE ORDER FLOW ============================
const checkDigit = () => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault()
  }
}
</script>

<template>
  <VForm @submit.prevent="saveProduct">
    <VRow>
      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Product Name -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="productName">Product Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="productName"
              v-model="productData.name"
              placeholder="Input Your Product Name"
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Price -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="price">Price</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="price"
              v-model="productData.price"
              placeholder="5000"
              persistent-placeholder
              @keydown="checkDigit"
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
        class="d-flex gap-4 justify-end mb-4"
      >
        <VBtn type="submit">
          Save
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
    
  <Modal
    :is-open="isModalOpened"
    name="first-modal"
    @modal-close="closeModal"
  >
    <template #header />
    <template #content>
      <VIcon
        class="mb-6"
        color="success"
        icon="mdi-check-circle-outline"
        size="128"
      />

      <h2> {{ productData.name }} </h2>
    </template>
    <template #footer>
      has been {{ modalTxt }} successfully !
    </template>
  </Modal>
</template>
