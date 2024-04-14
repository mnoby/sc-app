<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import OrderService from '@/services/OrderService'
import ProductService from '@/services/ProductService'
import { useStore } from 'vuex'

const store = useStore()
const deletedData = ref()
const products=ref([])
const orders=ref([])
const isMainPageValue = computed(() => store.state.isMainPage)
const dialog=ref(false)
const dialog2=ref(false)
const search=ref()

const headers=ref([
  {  key: 'actions', title: '', sortable: false },
  {
    align: 'start',
    key: 'data.order_no',
    sortable: false,
    title: 'Order Number',
    
  },
  { key: 'data.customer_details.name', title: 'Name' },
  { key: 'data.delivery_type', title: 'Delivery' },
  { key: 'data.customer_details.city', title: 'City' },
  { key: 'data.total', title: 'Total (Rp)' },
  { key: 'data.paid', title: 'Payment Status' },
])

onMounted(async () => {
  try{
    getProducts()
    getOrders()
  } catch (error) {
    console.error('Error fetching Products: ', error)
  }
})

//fetch Products Data From DB
const getProducts = () => {
  ProductService.getAll('name').get().then(res => {
    products.value = res.docs.map(doc => ({ id: doc.id, data: doc.data() }))
  })
}

const getOrders = () => {
  OrderService.getAll('order_no', 'asc').where('active', '==', true).get().then(res => {
    orders.value = res.docs.map(doc => ({ id: doc.id, data: doc.data() }))
    console.log(`orders >>>> ${JSON.stringify(orders.value)}`)
  })
}

const updateProduct=product=>{
  // console.log (`Id >>>>>>>>>>>> ${product.id}`)
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
  console.log(`Product ${productId} Deleted Successfully`)
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
  <VCard flat>
    <VCardTitle class="d-flex align-center pe-2">
      <VIcon icon="bx-cart-alt" /> &nbsp; Find an Order
      <VSpacer />

      <VTextField
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="filled"
        class="text-body-1"
        flat
        hide-details
        single-line
      />
    </VCardTitle>

    <VDivider />
    <VDataTable
      v-model:search="search"
      :headers="headers"
      :items="orders"
      class="text-subtitle-2"
      density="compact"
      show-expand
    >
      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            More info about {{ item.data.customer_details.name }}
          </td>
        </tr>
        <tr>
          <td :colspan="1">
            {{ item.data.order_details[0].product_name }}
          </td>
          <td :colspan="1">
            {{ item.data.order_details[0].qty }} toples
          </td>
        </tr>
      </template>
      
      <template #header.data.order_no>
        <div class="text-start text-primary">
          {{ headers[1].title }}
        </div>
      </template>

      <template #header.data.customer_details.name>
        <div class="text-start text-primary">
          Name
        </div>
      </template>

      <template #header.data.delivery_type>
        <div class="text-start text-primary">
          Delivery
        </div>
      </template>

      <template #header.data.customer_details.city>
        <div class="text-start text-primary">
          City
        </div>
      </template>

      <template #header.data.total>
        <div class="text-start text-primary">
          Total (Rp)
        </div>
      </template>

      <template #header.data.paid>
        <div class="text-end text-primary">
          Bill
        </div>
      </template>


      <template #item.data.delivery_type="{ item }">
        {{ item.data.delivery_type }} <br>
        <div class="text-info text-caption">
          {{ item.data.note }}
        </div>
      </template>

      <template #item.data.total="{ item }">
        {{ formatNumber(item.data.total) }}
      </template>

      <template #item.data.paid="{ item }">
        <div class="text-end">
          <VChip
            :color="item.data.paid ? 'success' : 'error'"
            :text="item.data.paid ? 'Paid' : 'Unpaid'"
            class="text-uppercase"
            size="x-small"
            label
          />
        </div>
      </template>


      <!-- Misc Menus -->
      <template #item.actions="{ item }">
        <VButton
          type="submit"
          color="warning"
          variant="tonal"
          class="ma-0"
        >
          <VIcon
            size="large"
            icon="bx-dots-vertical-rounded"
            color="warning"
          />
          <!-- SECTION Menu -->
          <VMenu
            activator="parent"
            width="100px"
            location="bottom end"
            offset="5px"
            transition="slide-x-transition"
          >
            <VList class="border-sm">
              <!-- 👉 View -->
              <VListItem link>
                <VListItemTitle class="text-subtitle-2 text-primary">
                  View
                </VListItemTitle>
              </VListItem>

              <!-- 👉 Edit -->
              <VListItem link>
                <VListItemTitle class="text-subtitle-2 text-primary">
                  Edit
                </VListItemTitle>
              </VListItem>

              <!-- 👉 Delete -->
              <VListItem link>
                <VListItemTitle class="text-subtitle-2 text-error">
                  Delete
                </VListItemTitle>
              </VListItem>

              <!-- Divider -->
              <VDivider class="my-2" />

              <!-- 👉 Set Bill Status -->
              <VListItem link>
                <VListItemTitle class="text-subtitle-2 text-warning text-wrap">
                  {{ item.data.paid ? 'Set Unpaid' : 'Set Paid' }}
                </VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
          <!-- !SECTION -->
        </VButton>
      </template>
    </VDataTable>
  </VCard>

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
