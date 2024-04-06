<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import ProductForm from '@/views/pages/products/ProductForm.vue';
import ProductList from '@/views/pages/products/ProductList.vue';
import { useStore } from 'vuex';

const store = useStore()
const isMainPageValue = computed(() => store.state.isMainPage)

// Console log the value of isMainPage
console.log('isMainPage value:', isMainPageValue.value)

// const isMainPage= ref(true)

const newProduct = () => {
  // isMainPage.value= false
  store.commit('setMainPage', false)
  console.log('isMainPage value:', isMainPageValue.value)
}

const backToProductList = () => {
  // isMainPage.value= true
  store.commit('setMainPage', true)
}
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <!-- 👉 Horizontal Form -->
        <VCard title="Products">

            <!-- ========================== MAIN CONTENT =================================-->
          <VCardText v-if="isMainPageValue">
            <div class="d-flex justify-end mb-2">
              <VBtn
              class
                type="submit"
                size="small"
                @click="newProduct"
              >
                <VIcon icon="bx-book-add" class="mr-1"/>
                Add Product
              </VBtn>
            </div>
            <ProductList />
          </VCardText>

          <VCardText v-else>
            <ProductForm />
          </VCardText>


          <!-- ============ BACK BUTTON =================================-->
          <div v-if="!isMainPageValue">
            <VBtn
              color="primary"
              variant="tonal"
              @click="backToProductList"
            >
              Back to Product List
            </VBtn>
          </div>
        </VCard>
      </VCol>





      <!-- ========================================================================================= -->
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
