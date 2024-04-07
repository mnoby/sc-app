<script setup>
import DeliveryService from '@/services/DeliveryService'
import OrderService from '@/services/OrderService'
import { VCardText } from 'vuetify/lib/components/index.mjs'

const orderData = {
  customerDetails: {
    customerName: '',
    phoneNumber: '',
    address: '',
    city: '',
  },  
  orderDetails: {
    quantity: '',
    price: '1000',
    subTotal: '2000',
    cakeOptions: 'Choose Yours',
  },
  deliveryOptions: 'By Courier',
}

// ============================  GET DELIVERY OPTIONS ============================
const selectedItem = ref(null)

// Fetch data from Firestore on component mount
let deliveryTypes = ref([])
onMounted(async () => {
  try {
    const response = await DeliveryService.getAll().get()

    deliveryTypes.value = response.docs.map(doc => (doc.data().delivery_type))
  } catch (error) {
    console.error('Error fetching delivery options: ', error)
  }
})

// ============================  END GET DELIVERY OPTIONS ============================

// ============================  SAVE ORDER FLOW ============================
const saveOrder = () => {
  var data = {
    customer_details: {
      customer_name: orderData.customerDetails.customerName,
      phone_number: orderData.customerDetails.phoneNumber,
      address: orderData.customerDetails.address,
      city: orderData.customerDetails.city,
    },
    order_details: {
      quantity: orderData.orderDetails.quantity,
      price: orderData.orderDetails.price,
      sub_total: orderData.orderDetails.subTotal,
      cake_options: orderData.orderDetails.cakeOptions,
    },
    delivery_options: orderData.orderDetails.deliveryOptions,
  }

  OrderService.create(data)
    .then(() => {
      console.log("Created new item successfully!")
      console.log(orderData.customerName)
    })
    .catch(e => {
      console.log(e)
    })
}
    
const newOrder = () => {
  this.submitted = false
  this.order = {
    customerName: '',
    phoneNumber: '',
    city: '',
    quantity: 2,
    price: 1000,
    subTotal: 2000,
    deliveryOptions: '',
    cakeOptions: '',
  }
}

// ============================  END SAVE ORDER FLOW ============================


// ============= ADD ORDER FIELDS =============================== 
const fields = ref([{ cakeOptions: '', quantity: '', price: '', subTotal: ''  }])

// Method to add a new field
const addField = () => {
  fields.value.push({ cakeOptions: '', quantity: '', price: '', subTotal: '' })
}

// Method to remove a field at a given index
const removeField = index => {
  fields.value.splice(index, 1)
}

// ============= END ADD ORDER FIELDS =============================== 

const idx = index => {
  console.log(`Index :`, index)
}

const orderDataLocal = ref(orderData)

const checkDigit = () => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault()
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VForm @submit.prevent="saveOrder">
        <VRow>
          <!-- 👉 First Name -->
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="orderDataLocal.customerName"
              label="Customer Name"
              placeholder="Fulan / Fulana"
            />
          </VCol>

          <!-- 👉 Phone Number -->
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="orderDataLocal.phoneNumber"
              label="Phone Number"
              placeholder="081234567890"
              @keydown="checkDigit"
            />
          </VCol>

          <!-- 👉 City -->
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="orderDataLocal.city"
              label="City"
              placeholder="Ponorogo"
            />
          </VCol>

          <!-- 👉 Delivery Options -->
          <VCol
            cols="12"
            md="6"
          >
            <VSelect
              v-model="orderDataLocal.deliveryOptions"
              label="Delivery Options"
              placeholder="Choose Yours"
              :items="deliveryTypes"
            />
          </VCol>
        
          <VDivider />
  
          <VCardText class="justify-center">
            <!-- 👉 Add Item -->
            <VCol
              cols="10"
              class="d-flex mb-4"
            >
              <VBtn
                type="addItem"
                size="small"
                color="warning"
                @click="addField"
              >
                <VIcon icon="bx-add-to-queue" />
                <span class="ms-2">Add Item</span>
              </VBtn>
            </VCol>

              
            <div
              v-for="(field, index) in fields"
              :key="index"
            >
              <VRow>
                <!-- 👉 Cake Options -->
                <VCol
                  cols="10"
                  md="4"
                  class="mb-3"
                >
                  <VSelect
                    v-model="orderDataLocal.cakeOptions"
                    label="Cake Options"
                    placeholder="Choose Yours"
                    :items="['Nastar Klasik', 'Nastar Klepon', 'Sagu Keju', 'Cheezy Hazelnut']"
                  />
                </VCol>

                <!-- 👉 Quantity -->
                <VCol
                  cols="10"
                  md="1"
                >
                  <VTextField
                    v-model="orderDataLocal.quantity"
                    label="Qty"
                    placeholder="0"
                    aria-disabled="true"
                    @keydown="checkDigit"
                  />
                </VCol>

                <!-- 👉 Price -->
                <VCol
                  cols="10"
                  md="2"
                >
                  <VTextField
                    v-model="orderDataLocal.price"
                    label="Price"
                    placeholder=""
                    active
                    disabled
                  />
                  <div class="flex-grow-1" />
                </VCol>

                <!-- 👉 SubTotal -->
                <VCol
                  cols="10"
                  md="2"
                >
                  <VTextField
                    v-model="orderDataLocal.subTotal"
                    label="SubTotal"
                    placeholder=""
                    active
                    disabled
                  />
                  <div class="flex-grow-1" />
                </VCol>
                <div v-if="index>0">
                  <VCol>
                    <VBtn
                      type="deleteItem"
                      class="mt-4"
                      size="small"
                      color="error"
                      @click="removeField"
                    >
                      <VIcon icon="bx-basket" />
                    </VBtn>
                  </VCol>
                </div>
              </VRow>
            </div>
          </VCardText>
      

          <VCol
            cols="12"
            class="d-flex gap-4"
          >
            <VBtn
              block
              type="submit"
            >
              Save
            </VBtn>
          </VCol>
        </VRow>
      </VForm>

      <VCardText />
    </VCol>
  </VRow>
</template>
