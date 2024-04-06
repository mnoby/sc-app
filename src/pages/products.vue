<script setup>
import ProductForm from '@/views/pages/products/ProductForm.vue'
import ProductList from '@/views/pages/products/ProductList.vue'

const formActive= ref(false)

const newProduct = () => {
  formActive.value= true
}

const backToProductList = () => {
  formActive.value= false
}
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <!-- 👉 Horizontal Form -->
        <VCard title="Products">
          <VCardText v-if="!formActive">
            <div>
              <VBtn
                type="submit"
                size="small"
                @click="newProduct"
              >
                <VIcon icon="bx-book-add" />
                Add Product
              </VBtn>
            </div>

            <ProductList />
          </VCardText>
          
          <VCardText v-else>
            <ProductForm />
            <div class="d-flex flex-column align-right py-5">
              <VBtn
                color="primary"
                variant="tonal"
                @click="backToProductList"
              >
                Back to Product List
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <!--
        <VCol
        cols="12"
        md="6"
        > 
      -->
      <!-- 👉 Horizontal Form with Icons -->
      <!--
        <VCard title="Horizontal Form with Icons">
        <VCardText>
        <DemoFormLayoutHorizontalFormWithIcons />
        </VCardText>
        </VCard>
        </VCol> 
      -->
      <!--
        <VCol
        cols="12"
        md="6"
        >
        👉 Vertical Form
        <VCard title="Vertical Form">
        <VCardText>
        <DemoFormLayoutVerticalForm />
        </VCardText>
        </VCard>
        </VCol> 
      -->
      <!--
        <VCol
        cols="12"
        md="6"
        >
        👉 Vertical Form with Icons
        <VCard title="Vertical Form with Icons">
        <VCardText>
        <OrderForm />
        </VCardText>
        </VCard>
        </VCol> 
      -->
      
      <!-- <VCol cols="12"> -->
      <!-- 👉 Multiple Column -->
      <!--
        <VCard title="Products">
        <VCardText>
        <ProductForm />
        </VCardText>
        </VCard>
        </VCol> 
      -->
      <!-- </vcol> -->
    </VRow>
  </div>
</template>
