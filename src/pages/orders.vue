<script setup>
import OrderForm from '@/views/pages/orders/OrderForm.vue'
</script>

<template>
  <div>
    <VRow>
      <!--
        <VCol
        cols="12"
        md="6"
        >
        👉 Horizontal Form
        <VCard title="Horizontal Form">
        <VCardText>
        <DemoFormLayoutHorizontalForm />
        </VCardText>
        </VCard>
        </VCol>
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
      
      <VCol cols="12">
        <!-- 👉 Multiple Column -->
        <VCard title="Order Details">
          <VCardText>
            <OrderForm />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
