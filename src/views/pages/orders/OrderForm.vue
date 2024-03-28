<script setup>
const orderData = {
  customerName: 'Fulan',
  phoneNumber: '081234567890',
  city: 'Ponorogo',
  deliveryOptions: 'By Courier',
}

const orderDataLocal = ref(structuredClone(orderData))
</script>

<template>
  <VCardText>
    <VForm @submit.prevent="() => {}">
      <VRow>
        <VCol cols="12">
          <VCard title="Account Details">
            <!-- 👉 First Name -->
            <VCol
              md="6"
              cols="12"
            >
              <VTextField
                v-model="orderDataLocal.customerName"
                label="Customer Name"
                placeholder="Fulan"
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
          </VCard>
        </VCol>

    
        <!-- 👉 Remember me -->
        <VCol cols="12">
          <VCheckbox
            v-model="checkbox"
            label="Remember me"
          />
        </VCol>

        <VCol
          cols="12"
          class="d-flex gap-4"
        >
          <VBtn type="submit">
            Submit
          </VBtn>

          <VBtn
            type="reset"
            color="secondary"
            variant="tonal"
          >
            Reset
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VCardText>
</template>
