<script setup>
import ProductService from '@/services/ProductService'
import { useStore } from 'vuex'

let modalTxt=''
const store = useStore()
const dialog=ref(false)
const isPackage = ref(false)
const products=ref([])
const updateValues =store.state.updateValues

const productData = ref({
  name: '',
  price: '',
  package: false,
  components: [],
})

if (updateValues != null){
  isPackage.value=updateValues.details.package
  productData.value = updateValues.details
}


onMounted(async () => {
  try{
    // call function to fetch products Data from DB
    getProducts()
  }catch(error){
    console.error('Error fetching Products: ', error)
  }
})


const checks = () => {
  console.log(`components >>> ${JSON.stringify(productData.value.components)}`)
  console.log(`package >>> ${productData.value.package}`)
}


//fetch Products Data From DB
const getProducts = () => {
  ProductService.getAll('name').where('package', '==', false).get().then(res => {
    products.value = res.docs.map(doc => ({ name: doc.data().name, price: doc.data().price }))
  })
}

const saveProduct = () => {
// ============================  SAVE ORDER FLOW ============================
  if (updateValues== null){
    modalTxt = 'Added'

    ProductService.create(productData.value)
      .then(() => {
        dialog.value=true
      })
  } else{
    modalTxt = 'Updated'
    ProductService.update(updateValues.id, productData.value).then(() => {
      dialog.value=true
    })
  }
}
    
const resetForm = () => { 
  productData.value = {
    name: '',
    price: '',
    package: false,
    components: [],
  }
  getProducts()
  dialog.value=false
}

// ============================  END SAVE ORDER FLOW ============================
const checkDigit = () => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault()
  }
}
</script>

<template>
  <!--
    <VBtn
    text="check"
    @click="checks"
    />
  -->

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
              placeholder="0"
              persistent-placeholder
              @keydown="checkDigit"
            />
          </VCol>

          <VCol
            cols="12"
            md="12"
            class="my-6"
          >          
            <div>
              <VCheckbox
                v-model="productData.package"
                color="success"
                label="Package"
              />
            </div>
          </VCol>

          <VCol
            cols="12"
            md="3"
            :hidden="!productData.package"
          >
            <label for="components">Components</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
            :hidden="!productData.package"
          >
            <!-- Components of Non-Regular Products -->
            <VAutocomplete
              v-model="productData.components"
              :items="products"
              item-value="name"
              chips
              closable-chips
              hide-selected
              multiple
            >
              <template #chip="{ props, item }">
                <VChip
                  v-bind="props"
                  :text="item.raw.name"
                  color="primary"
                />
              </template>
                
              <template #item="{ props, item }">
                <VListItem
                  v-bind="props"
                  :title="item.raw.name"
                />
              </template>
            </VAutocomplete>
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
    
  <!--
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
  -->
  <!-- ////////////////////// MODAL ///////////////// -->
  <div class="text-center">
    <VDialog
      v-model="dialog"
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
              @click="resetForm"
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
            <h2 class="text-uppercase mb-2">
              yeay !!!
            </h2>
            <span class="text-h6">{{ productData.name }}</span> 
            <br> has been  
            <span class="text-uppercase"> {{ modalTxt }} </span>
          </div>
        </template>
      </VCard>
    </VDialog>
  </div>
</template>
