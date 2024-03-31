<script setup>
import { VCardText } from 'vuetify/lib/components/index.mjs'

const orderData = {
  customerName: '',
  phoneNumber: '',
  city: '',
  quantity: '',
  price: '1000',
  subTotal: '2000',
  deliveryOptions: 'By Courier',
  cakeOptions: 'Choose Yours',
}

const fields = ref([{ cakeOptions: '', quantity: '', price: '', subTotal: ''  }])

// Method to add a new field
const addField = () => {
  fields.value.push({ cakeOptions: '', quantity: '', price: '', subTotal: '' })
}

// Method to remove a field at a given index
const removeField = index => {
  fields.value.splice(index, 1)
}

const orderDataLocal = ref(structuredClone(orderData))

const checkDigit = () => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault()
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VForm @submit.prevent="() => {}">
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
              :items="['Take at Home', 'By Courier', 'Travel Group', 'Paxel']"
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
