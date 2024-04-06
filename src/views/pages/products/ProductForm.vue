<script setup>
import ProductService from '@/services/ProductService'

const submitted=ref(false)
let productData = {
  productName: '',
  productPrice: '',
}

// ============================  SAVE ORDER FLOW ============================
const saveProduct = () => {
  var data = {
    p_name: productData.productName,
    p_price: parseInt(productData.productPrice),
  }

  ProductService.create(data)
    .then(() => {
      console.log("Created new item successfully!")

      // console.log(productData.productName)
      submitted.value= true
      

      // this.submitted = true
    })
    .catch(e => {
      console.log(e)
    })
}
    
const newProduct = () => {
  submitted.value= false,
  productData = {
    productName: '',
    productPrice: '',
  }
  productDataLocal.value = productData
}

// ============================  END SAVE ORDER FLOW ============================
const productDataLocal = ref(productData)

const checkDigit = () => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault()
  }
}
</script>

<template>
  <VForm
    v-if="!submitted"
    @submit.prevent="saveProduct"
  >
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
              v-model="productDataLocal.productName"
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
              v-model="productDataLocal.productPrice"
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
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Save
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          type="reset"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>

  <div v-else>
    <h4>{{ productData.productName }} has been Added Successfully!</h4>
    <VCol
      offset-md="3"
      cols="12"
      md="9"
      class="d-flex gap-4"
    >
      <VBtn
        type="submit"
        @click="newProduct"
      >
        Add More Product
      </VBtn>
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Lihat Product
      </VBtn>
    </VCol>
  </div>
</template>
