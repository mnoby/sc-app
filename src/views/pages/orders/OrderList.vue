<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import ActionMenu from '@/layouts/components/ActionMenu.vue'
import DialogNotif from '@/layouts/components/DialogNotif.vue'
import OrderService from '@/services/OrderService'
import ProductService from '@/services/ProductService'

// const prop = defineProps(['isMainPage'])
const emit = defineEmits(['mainPageClose', 'isEdit'])
const modalProp=ref({})
const search=ref()
const products=ref([])
const orders=ref([])
const notifState=ref(false)
const editClicked=ref(false)

const parseOrder=ref({
  regular: '',
  package: '',
  summary: '',
})

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
  { key: 'data.total', title: 'Bill (Rp)' },
  { key: 'data.paid', title: 'Payment Status' },
])

watch( () => editClicked.value, () => {
  // console.log(`prop main page >>> ${editClicked.value}`)

  // emit('mainPageClose')
  // emit('isEdit', editSelectedVal.value )

  // prop.isMainPage=false
})
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
  })
}

const updateOrder=order=>{
  editClicked.value=true
  emit('isEdit', order)
  emit('mainPageClose')
}

const deleteProduct=order=>{
  modalProp.value.action='Deleted'
  modalProp.value.data=order.data.order_no
  OrderService.delete(order.id).then(()=> {
    notifState.value=true
  })
}

const updateBillStat=orders=>{
  const stat = !orders.data.paid

  modalProp.value.action='Updated'
  modalProp.value.setBill=true
  modalProp.value.data=orders.data.order_no
  OrderService.update(orders.id, { paid: stat }).then(()=> {
    notifState.value=true
  })
}

const formatNumber = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const modalClose=()=>{
  notifState.value=false
  getOrders()
}

// for debugginf purpose
const debuggerBtn = () => {
  const a= [{ "qty": "2", "price": "225000", "product_name": "Hampers A", "subtotal": 450000 }, { "qty": "2", "price": "225000", "product_name": "Hampers B", "subtotal": 450000 }]

  getPackTotal()
}

const debuggerBtn2 = () => {
  getOrderSummary(parseOrder.value['regular'], parseOrder.value['package'])
  
}
</script>

<template>
  <VRow>
    <VCol cols="12">
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
              Bill (Rp)
            </div>
          </template>

          <template #header.data.paid>
            <div class="text-end text-primary">
              Status
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


          <!-- <<<<<<<<<<<<<<< Dots Vertical Menus >>>>>>>>>>>>>>> -->
          <template #item.actions="{ item }">
            <VButton
              type="submit"
              color="warning"
              variant="tonal"
              class="ma-0"
            >
              <ActionMenu
                :data="item"
                :products="products"
                @main-page-close="updateOrder(item)"
                @approve-delete="deleteProduct(item)"
                @approve-update="updateBillStat(item)"
              />
            </VButton>
          </template>
          <!-- <<<<<<<<<<<<<<< Dots Vertical Menus END >>>>>>>>>>>>>>> -->
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>

  <!-- Dialog Notif -->
  <DialogNotif
    :modal-open="notifState"
    @modal-close="modalClose"
  >
    <template #modal-content>
      <VIcon
        class="me-0"
        color="success"
        icon="mdi-check-circle-outline"
        size="164"
      />
    </template>
    <template #modal-subcontent>
      <h2>
        YEAY !!!
      </h2>
      <span class="text-subtitle-1 mb-0 pa-0"> {{ modalProp.data }} </span> <br>
      <span class="mt-0 pt-0">{{ modalProp.setBill? 'Bill Status' : '' }} has been {{ modalProp.action }} Successfully !</span>
    </template>
  </DialogNotif>
</template>


