<!-- eslint-disable promise/no-nesting -->
<script setup>
import CityService from '@/services/CityService'
import DeliveryService from '@/services/DeliveryService'
import OrderService from '@/services/OrderService'
import ProductService from '@/services/ProductService'
import { VCardText } from 'vuetify/lib/components/index.mjs'

const YYYYMMDD = new Date().toISOString()
const splitDate= YYYYMMDD.substring(0, 10).split('-')

const fullYYYY = `${splitDate[0]}`
const fullMMDD = `${splitDate[1]}${splitDate[2]}`

const orderDetails = ref([
  { 
    product_name: null, 
    price: '', 
    qty: '', 
    subtotal: '',  
  },
])

const orderData = ref({
  order_no: 'TBD',
  customer_details: {
    name: '',
    phone: '',
    address: '',
    city: null,
  },
  order_details: orderDetails.value,
  delivery_type: null,
  note: '',
  total: '',
  order_date: new Date(),
  active: true,
  paid: false,
})

watch( () => orderData.value.orderDetails,
  count => {
    console.log(`count is: ${count}`)
  })


const deliveryTypes = ref()
const products=ref()
const cities=ref()
const cityNames=ref()
const cityCode=ref()
const productNames=ref()
const orderCount=ref()
const isModalOpened = ref(false)
const dialog=ref(false)
const dialog2=ref(false)
const dialog3=ref(false)

// Fetch Datas from DB on Mounted
onMounted(async () => {
  //Get Cities Data
  await CityService.getAll().get().then(res => {
    cities.value = res.docs.map(doc => ({ id: doc.id, cityName: doc.data().name }))
    cityNames.value = res.docs.map(doc => (doc.data().name))
  })

  //Get delivery_types Data
  await DeliveryService.getAll().get().then(res => {
    deliveryTypes.value = res.docs.map(doc => (doc.data().name))
  })
    
  //Get Products Data
  await ProductService.getAll('name').get().then(res => {
    products.value = res.docs.map(doc => ({ productName: doc.data().name, productPrice: doc.data().price }))
    productNames.value = res.docs.map(doc => (doc.data().name))
  })

  // Fetch Orders Data
  getOrders()

})

const openModal = () => {
  isModalOpened.value = true
}

const closeModal = () => {
  isModalOpened.value = false
}

// Send Order Data to Database
const saveOrder = () => {
  OrderService.create(orderData.value)
    .then(() => {
      dialog.value = true
      console.log("Created new item successfully!")

      //reset all fields
      refreshField()
    })
    .catch(e => {
      console.log(e)
    })  

}

//Fetch Orders From DB
const getOrders = () => {
  //Get Latest Order Number
  OrderService.getLatest('order_date', 'desc', 1).get().then(res => {
    orderCount.value = res.docs.map(doc => (doc.data().order_no ))
  }).then(() => {
    // Parse Order Number
    orderNumberParser(orderCount.value)
  })


}

// Parsing Order Number
const orderNumberParser = number => {
  let nextNumber = 0
  if(number.length > 0){
    const splitNumber =number.toString().split('-')

    nextNumber = parseInt(splitNumber[3]) + 1
  } else {
    nextNumber = 1
  }

  if (nextNumber.toString.length == 1){
    orderCount.value.parsed = `000${nextNumber}`
  } else if (nextNumber.toString.length == 2){
    orderCount.value.parsed = `00${nextNumber}`
  } else if(nextNumber.toString.length == 3){
    orderCount.value.parsed = `0${nextNumber}`
  } else {
    orderCount.value.parsed = nextNumber
  }
}

// Find City Code
const getCityCode = cityName => {
  const findCity = cities.value.find(city => city.cityName == cityName)

  cityCode.value = findCity.id
}

const generateNewOrderNumber = cityName => {
// Parse the Latest Order Number
  getCityCode(cityName)
  if(cityCode.value.length > 0 ){
    orderData.value.order_no = `${fullYYYY}-${fullMMDD}-${cityCode.value}-${orderCount.value.parsed}`
  } else {
    orderData.value.order_no = `${fullYYYY}-${fullMMDD}-undefined-${orderCount.value.parsed}`
  }
}

// Method to add a new field
const addField = () => {
  orderDetails.value.push({ product_name: null, price: '', qty: '', subtotal: '' })
}

// Method to remove a field at a given index
const removeField = index => {
  orderDetails.value.splice(index, 1)
}

// for debugginf purpose
const idx = index => {
  console.log(`Index :`, index)
}

// Only Number Allowed Function
const checkDigit = () => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault()
  }
}

// Store selected Product Price
const updatePrice = (selectedProductName, idx) => {  
  if(selectedProductName!= null && selectedProductName!=''){
    const selectedProduct = products.value.find(product => product.productName == selectedProductName)
  
    orderDetails.value[idx].price = selectedProduct.productPrice
  }else {
    orderDetails.value[idx].price = '0'
  }
}

const calculateSubTotal = (price, quantity, idx ) => {
  if(quantity && price ){
    orderDetails.value[idx].subtotal = parseInt(price) * parseInt(quantity)
  } else if(quantity == ''){
    orderDetails.value[idx].subtotal = 0 * parseInt(price)
  }else {
    orderDetails.value[idx].subtotal = 0 * parseInt(quantity)
  }

  calculateTotal(orderDetails.value)
}

const calculateTotal = srcObj => {
  let total = 0
  let x=0, y = 0

  for (let idx in srcObj){
    const order = srcObj[idx]

    y = order.subtotal
    total = x + y
    x= total
  }
  orderData.value.total= total
}

const refreshField = () => {
  getOrders()
  orderDetails.value = [{ 
    product_name: null, 
    price: '', 
    qty: '', 
    subtotal: '',  
  }]
  
  orderData.value = {
    order_no: 'TBD',
    customer_details: {
      name: '',
      phone: '',
      address: '',
      city: null,
    },
    order_details: orderDetails.value,
    delivery_type: null,
    note: '',
    total: '',
  }
}

const debuggerBtn = () => {
  console.log(`order detail >>>> ${JSON.stringify(orderDetails.value)}`)

}

const formatNumber = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
</script>

<template>
  <!--
    <VBtn
    type="debug"
    size="small"
    color="success"
    @click="debuggerBtn"
    >
    <VIcon icon="bx-add-to-queue" />
    <span class="ms-2">Check Order Details</span>
    </VBtn>  
  -->  

  <VForm @submit.prevent="">
    <VRow class="mx-2">
      <!-- 👉 Order Number -->
      <VCol
        cols="12"
        md="12"
        sm="12"
      >
        <VTextField
          v-model="orderData.order_no"
          label="Order Number"
          variant="solo"
          disabled
        />
      </VCol>

      <!-- 👉 First Name -->
      <VCol
        cols="12"
        md="6"
        sm="6"
      >
        <VTextField
          v-model="orderData.customer_details.name"
          label="Customer Name"
          placeholder="Fulan / Fulana"
        />
      </VCol>

      <!-- 👉 Phone Number -->
      <VCol
        cols="12"
        md="6"
        sm="6"
      >
        <VTextField
          v-model="orderData.customer_details.phone"
          label="Phone Number"
          placeholder="081234567890"
          @keydown="checkDigit"
        />
      </VCol>

      <!-- 👉 Address -->
      <VCol
        cols="12"
        md="6"
        sm="6"
      >
        <VTextField
          v-model="orderData.customer_details.address"
          label="Address"
        />
      </VCol>

      <!-- 👉 City -->
      <VCol
        cols="12"
        md="6"
        sm="6"
      >
        <VAutocomplete
          v-model="orderData.customer_details.city"
          clearable
          label="City"
          placeholder="Pick City"
          :items="cityNames"
          @update:model-value="generateNewOrderNumber(orderData.customer_details.city)"
        />
      </VCol>

      <!-- 👉 Delivery Options -->
      <VCol
        cols="12"
        md="6"
        sm="6"
      >
        <VAutocomplete
          v-model="orderData.delivery_type"
          clearable
          label="Delivery Options"
          placeholder="Choose Yours"
          :items="deliveryTypes"
        />
      </VCol>

      <!-- 👉 Note -->
      <VCol
        cols="12"
        md="6"
        sm="6"
      >
        <VTextField
          v-model="orderData.note"
          label="Note"
        />
      </VCol>
    
      <VDivider
        :thickness="2"
        class="mt-5 border-opacity-25"
        color="#000"
      />
      
      <!-- 👉 Add Item -->
      <div class="d-flex justify-end mt-4 w-100">
        <VBtn
          type="addItem"
          size="small"
          color="success"
          class="rounded-e-0"
          @click="addField"
        >
          <VIcon icon="bx-add-to-queue" />
          <span class="ms-2">Add Item</span>
        </VBtn>
      </div>
      <!-- ===================== ITEMS SECTION ========================= -->
     
      <VCardText>
        <!-- ============== Looping the orderDetails ======================== -->              
        <VRow>
          <VCol
            v-for="(field, index) in orderDetails"
            :key="index"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <VCard 
              variant="outlined"
              color="#3949AB"
              elevation="12"
              class="ms-1 me-2 mb-2"
            >
              <VRow class="pa-3">
                <!-- 👉 Pick Product -->
                <VCol
                  cols="12"
                  md="12"
                  sm="12"
                >
                  <VAutocomplete
                    v-model="field.product_name"
                    label="Product Name"
                    placeholder="Please Pick"
                    clearable
                    density="compact"
                    :items="productNames"
                    @update:model-value="updatePrice(field.product_name, index); calculateSubTotal(field.price, field.qty, index)"
                  />
                </VCol>

                <!-- 👉 Price -->
                <VCol
                  cols="12"
                  md="8"
                  sm="8"
                >
                  <VTextField
                    v-model="field.price"
                    label="Price"
                    placeholder="0"
                    density="compact"
                    active
                    disabled
                  />
                </VCol>
              
                <!-- 👉 Quantity -->
                <VCol
                  cols="12"
                  md="4"
                  sm="4"
                >
                  <VTextField
                    v-model="field.qty"
                    label="Qty"
                    placeholder="0"
                    density="compact"
                    @keydown="checkDigit"
                    @keyup="calculateSubTotal(field.price, field.qty, index)"
                  />
                </VCol>
              </VRow>
            
              <div class="pa-3">
                <!-- 👉 SubTotal -->
                <VLabel
                  v-model="field.subtotal"
                  :class="$vuetify.display.mdAndUp? 'text-base' : 'text-caption'"
                >
                  <h4>Subtotal:</h4> &#8287; {{ formatNumber(field.subtotal) }}
                </VLabel>
              </div>
              <div>
                <VBtn
                  v-if="index > 0"
                  block
                  type="deleteItem"
                  size="small"
                  class="rounded-t-0 w-100"
                  color="error"
                  @click="removeField(index)"
                >
                  <VIcon icon="bx-basket" />
                </VBtn>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VRow>
    <VBtn
      block
      class="d-flex y-0 rounded-t-0"
      type="submit"
      @click="saveOrder"
    >
      Save
    </VBtn>
  </VForm>

  <!-- ////////////////////// MODAL ///////////////// -->

  <div class="text-center">
    <VDialog
      v-model="dialog"
      z-index="9999"
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
              @click="dialog = false"
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
            <h2> {{ orderData.order_no }} </h2>
            <span>has been Created Successfully !</span>
          </div>
        </template>
      </VCard>
    </VDialog>
  </div>
</template>
