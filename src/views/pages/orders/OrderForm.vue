<!-- eslint-disable promise/no-nesting -->
<script setup>
import CityService from '@/services/CityService'
import DeliveryService from '@/services/DeliveryService'
import OrderService from '@/services/OrderService'
import ProductService from '@/services/ProductService'
import { v4 as uuidv4 } from 'uuid'
import { VCardText } from 'vuetify/lib/components/index.mjs'

const YYYYMMDD = new Date().toISOString()
const timestamp = new Date().toLocaleString()
const splitDate= YYYYMMDD.substring(0, 10).split('-')

const fullYYYY = `${splitDate[0]}`
const fullMMDD = `${splitDate[1]}${splitDate[2]}`

console.log(uuidv4().substring(0, 4))

const orderDetailsFields = ref([
  { 
    productName: '', 
    price: '', 
    quantity: '', 
    subtotal: '',  
  },
])

const orderData = ref({
  orderNumber: 'TBD',
  customerDetails: {
    customerName: '',
    phoneNumber: '',
    address: '',
    city: '',
    cityCode: '',
  },  

  deliveryName: '',
  note: '',
})

watch( () => orderData.value.orderDetails,
  count => {
    console.log(`count is: ${count}`)
  })


const deliveryTypes = ref()
const products=ref()
const cities=ref()
const cityNames=ref()
const productNames=ref()
const orderCount=ref()

// Fetch Datas from DB on Mounted
onMounted(async () => {
  try {

    //Get Cities Data
    const resCity = await CityService.getAll().get()

    cities.value = resCity.docs.map(doc => ({ id: doc.id, cityName: doc.data().name }))
    cityNames.value = resCity.docs.map(doc => (doc.data().name))

    //Get delivery_types Data
    const resDelivery = await DeliveryService.getAll().get()

    deliveryTypes.value = resDelivery.docs.map(doc => (doc.data().name))
    
    //Get Latest Order Number
    const resOrder = await OrderService.getLatest('order_no', 'desc', 1).get()

    orderCount.value = resOrder.docs.map(doc => (doc.data().order_no ))
    
    //Get Products Data
    const resProduct = await ProductService.getAll('name').get()

    products.value = resProduct.docs.map(doc => ({ productName: doc.data().name, productPrice: doc.data().price }))
    productNames.value = resProduct.docs.map(doc => (doc.data().name))

    // Parse Order Number
    orderNumberParser(orderCount.value)

  } catch (error) {
    console.error('Error fetching delivery options: ', error)
  }
})

// ============================  SAVE ORDER FLOW ============================
const saveOrder = () => {
  const orderDetArray=[]
  let total = 0
  let x = 0

  // remapping the order details objects name as the payload
  for (let idx in orderDetailsFields.value){
    const order = orderDetailsFields.value[idx]
    let y =  order.subtotal
    total = x + y
    x= total
    orderDetArray.push({ product_name: order.productName, price: order.price, qty: parseInt(order.quantity), subtotal: order.subtotal })
  }
  console.log(`orderDetArray ${JSON.stringify(orderDetArray)}`)

  
  var data = {
    order_no: orderData.value.orderNumber,
    customer_details: {
      name: orderData.value.customerDetails.customerName,
      phone: orderData.value.customerDetails.phoneNumber,
      address: orderData.value.customerDetails.address,
      city: orderData.value.customerDetails.city,
    },
    order_details: orderDetArray,
    delivery_types: orderData.value.deliveryName,
    note: orderData.value.note,
    total: total,
    order_date: timestamp,
    active: true,
  }

  OrderService.create(data)
    .then(() => {
      console.log("Created new item successfully!")
      console.log(orderData.value.orderNumber)
    })
    .catch(e => {
      console.log(e)
    })  
}
  

// ============================  END SAVE ORDER FLOW ============================


// ============= ADD ORDER orderDetailsFields =============================== 

// Parsing Order Number
const orderNumberParser = number => {
  const splitNumber =number.toString().split('-')
  const  nextNumber = parseInt(splitNumber[3]) + 1

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

  orderData.value.customerDetails.cityCode = findCity.id
}

const generateNewOrderNumber = cityName => {
// Parse the Latest Order Number
  getCityCode(cityName)
  console.log(`city length >>> ${orderData.value.customerDetails.cityCode}`)

  const cityCode = orderData.value.customerDetails.cityCode
  if(orderData.value.customerDetails.cityCode.length > 0 ){
    orderData.value.orderNumber = `${fullYYYY}-${fullMMDD}-${cityCode}-${orderCount.value.parsed}`
  } else {
    orderData.value.orderNumber = `${fullYYYY}-${fullMMDD}-undefined-${orderCount.value.parsed}`
  }

}


// Method to add a new field
const addField = () => {
  orderDetailsFields.value.push({ productName: '', price: '', quantity: '', subtotal: '' })
  console.log(`Length orderDetails field ${orderDetailsFields.value.length}`)
}

// Method to remove a field at a given index
const removeField = index => {
  orderDetailsFields.value.splice(index, 1)
  console.log(`Length orderDetails field ${orderDetailsFields.value.length}`)

}

// ============= END ADD ORDER orderDetailsFields =============================== 

// for debugginf purpose
const idx = index => {
  console.log(`Index :`, index)
}

// Only NUmber Allowed Function
const checkDigit = () => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault()
  }
}

// Store selected Product Price
const updatePrice = (selectedProductName, idx) => {  
  if(selectedProductName!= null && selectedProductName!=''){

    console.log(`selected prodcut >>>> ${JSON.stringify(selectedProductName)}`)
    
    const selectedProduct = products.value.find(product => product.productName == selectedProductName)
    
    orderDetailsFields.value[idx].price = selectedProduct.productPrice
  }else {
    orderDetailsFields.value[idx].price = '0'
  }
}

const calculateSubTotal = (price, quantity, idx) => {
  if(quantity && price ){
    orderDetailsFields.value[idx].subtotal = parseInt(price) * parseInt(quantity)
  } else if(quantity == ''){
    orderDetailsFields.value[idx].subtotal = 0 * parseInt(price)
  }else {
    orderDetailsFields.value[idx].subtotal = 0 * parseInt(quantity)
  }
}


const debuggerBtn = () => {
  console.log(`order detail >>>> ${JSON.stringify(orderDetailsFields.value)}`)

}

const formatNumber = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
</script>

<template>
  <VBtn
    type="debug"
    size="small"
    color="success"
    @click="debuggerBtn"
  >
    <VIcon icon="bx-add-to-queue" />
    <span class="ms-2">Check Order Details</span>
  </VBtn> 
  

  <VForm @submit.prevent="">
    <VRow class="mx-2">
      <!-- 👉 Order Number -->
      <VCol
        cols="12"
        md="6"
        sm="12"
      >
        <VTextField
          v-model="orderData.orderNumber"
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
          v-model="orderData.customerDetails.customerName"
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
          v-model="orderData.customerDetails.phoneNumber"
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
          v-model="orderData.customerDetails.address"
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
          v-model="orderData.customerDetails.city"
          clearable
          label="City"
          placeholder="Pick City"
          :items="cityNames"
          @update:model-value="generateNewOrderNumber(orderData.customerDetails.city)"
        />
      </VCol>

      <!-- 👉 Delivery Options -->
      <VCol
        cols="12"
        md="6"
        sm="6"
      >
        <VAutocomplete
          v-model="orderData.deliveryName"
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
  
      <!-- ===================== ITEMS SECTION ========================= -->
      <VCardText>
        <!-- 👉 Add Item -->
        <div class="d-flex justify-end mb-4">
          <VBtn
            type="addItem"
            size="small"
            color="success"
            @click="addField"
          >
            <VIcon icon="bx-add-to-queue" />
            <span class="ms-2">Add Item</span>
          </VBtn>
        </div>

        <!-- ============== Looping the orderDetailsFields ======================== -->              
        <div
          v-for="(field, index) in orderDetailsFields"
          :key="index"
        >
          <VCard
            variant="outlined"
            color="#3949AB"
            elevation="12"
            class="d-flex flex-wrap mb-4"
          >
            <VRow class="flex-1-0 pa-3">
              <!-- 👉 Pick Product -->
              <VCol
                cols="9"
                md="5"
                sm="4"
              >
                <VAutocomplete
                  v-model="field.productName"
                  label="Product Name"
                  placeholder="Please Pick"
                  clearable
                  :items="productNames"
                  @update:model-value="updatePrice(field.productName, index); calculateSubTotal(field.price, field.quantity, index)"
                /> 
              </VCol>

              <!-- 👉 Price -->
              <VCol
                cols="9"
                md="2"
                sm="4"
              >
                <VTextField
                  v-model="field.price"
                  label="Price"
                  placeholder="0"
                  active
                  disabled
                />
              </VCol>
              
              
              <!-- 👉 Quantity -->
              <VCol
                cols="9"
                md="2"
                sm="4"
              >
                <VTextField
                  v-model="field.quantity"
                  label="Qty"
                  placeholder="0"
                  aria-disabled="true"
                  @keydown="checkDigit"
                  @keyup="calculateSubTotal(field.price, field.quantity, index)"
                />
              </VCol>

              <!-- 👉 SubTotal -->
              <VCol
                cols="9"
                md="3"
                sm="4"
              >
                <VTextField
                  v-model="field.subtotal"
                  label="SubTotal"
                  placeholder=""
                  active
                  disabled
                />
              </VCol>
            </VRow>

            <div>
              <VBtn
                v-if="index > 0"
                block
                type="deleteItem"
                size="small"
                class="rounded-s-0 h-100"
                color="error"
                @click="removeField"
              >
                <VIcon icon="bx-basket" />
              </VBtn>
            </div>
          </VCard>
        </div>
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
</template>
