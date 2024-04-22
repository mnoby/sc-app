<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import ProductForm from '@/views/pages/products/ProductForm.vue'
import ProductList from '@/views/pages/products/ProductList.vue'
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isMainPageValue = computed(() => store.state.isMainPage)

// Console log the value of isMainPage 

// const isMainPage= ref(true)


const checks = () => {
  console.log('udpateValies value idle:', JSON.stringify(store.state.updateValues))

}

const newProduct = () => {
  // isMainPage.value= false
  store.commit('setMainPage', false)
}

const backToProductList = () => {
  // isMainPage.value= true
  store.commit('setMainPage', true)
  store.commit('setUpdateValues', undefined)
}

onMounted(async () => {
  try {
    store.commit('setMainPage', true)
    store.commit('setUpdateValues', undefined)
  } catch (error) {
    console.error('Error fetching delivery options: ', error)
  }
})
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <!-- 👉 Horizontal Form -->
        <VCard>
          <!-- ============ BACK BUTTON ================================= -->
          
          <VBtn
            v-if="!isMainPageValue"
            class="rounded-b-0"
            color="primary"
            prepend-icon="bx-bxs-chevron-left-circle"
            block
            @click="backToProductList"
          >
            Go to Product List
          </VBtn>

          <VCardTitle> Product Menu </VCardTitle>
          <!-- ========================== MAIN CONTENT ================================= -->
          <div v-if="isMainPageValue">
            <ProductList />
            <VBtn
              block
              class="rounded-t-0"
              type="submit"
              @click="newProduct"
            >
              <VIcon
                icon="bx-bxs-plus-circle"
                class="mr-2"
              />
              Add Product
            </VBtn>
          </div>

          <div v-else>
            <VCol col="12">
              <ProductForm />
            </VCol>
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
