<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import OrderService from '@/services/OrderService'
import ProductService from '@/services/ProductService'
import { useStore } from 'vuex'

const store = useStore()
const deletedData = ref()
const products=ref([])
const productRegular=ref()
const productPackage=ref()
const orderSum=ref([])
const orders=ref([])
const dialog=ref(false)
const dialog2=ref(false)
const dialogPreview=ref(false)
const search=ref()
const open=ref(['Regular', 'Package'])

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
    console.log(`orders >>>> ${JSON.stringify(orders.value.length)}`)
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

const getProductByType=isPackage=> {
  return new Promise((resolve, reject) => {
    let name=[]
    products.value.forEach(prod => {
      if(prod.data.package == isPackage){
        name.push(prod)
      }
    })
  
    resolve(name)
  })
}

const getComponents=selectedPackage=>{
  return new Promise((resolve, reject) => {
    const abc = selectedPackage

    console.log(`abc >>> ${JSON.stringify(abc)}`)
    abc.forEach((item, idx, a)=> {
      ProductService.getWhere('name', '==', item.product_name).get().then(res => {
        res.forEach(doc => {
          abc[idx].components = doc.data().components
          productPackage.value = abc
        })

        // productPackage.value = abc
        console.log(`YAYAYAYA >>> ${JSON.stringify(productPackage.value)}`)

      })
      
    })
    
    resolve(productPackage.value)
  })
  
}

const getPackTotal=()=>{
  console.log(`prod reg >>> ${JSON.stringify(productRegular.value.length)}`)
  console.log(`prod pack >>> ${JSON.stringify(productPackage.value[0].components.length)}`)
  let qty
  let total=0
  const packages = productPackage.value
  const regular = productRegular.value

  regular.forEach((reg, idx, a)=> {
    // qty=[]
    if(packages[idx].components.length>0){
      console.log(`comp length lebih dari 0 ${idx}`)

      // qty.push(reg.qty)
      packages[idx].components.forEach(pack=> {
        console.log(`looping si compo ${pack} -- ${reg.product_name}`)
        
        if(reg.product_name == pack){
          console.log(`product_name nya sama ${reg.product_name}`)
          if(idx == reg.length-1 ) {
            console.log(`index trakhir ni ${idx}`)

            // qty.push(packages.qty)
            total = parseInt(reg.qty)+parseInt(packages[idx].qty)
            packages[idx].components.splice( packages[idx].components.indexOf(pack), 1)
            console.log(`splice selesai ${ packages[idx].components}`)
            orderSum.value.push({ name: reg.product_name, qty: total })
            orderSum.value.push({ name: packages[idx].product_name, qty: pack.qty })
          }else{
            console.log(`aku disini`)
            total = parseInt(reg.qty)+parseInt(packages[idx].qty)
            packages[idx].components.splice( packages[idx].components.indexOf(pack), 1)
            console.log(`splice selesai ${ packages[idx].components}`)
            orderSum.value.push({ name: reg.product_name, qty: total })
          }
        }else {
          orderSum.value.push({ name: reg.product_name, qty: reg.qty })
        }
        
        // console.log(`check qty >>> ${qty}`)
      })
    } else{
      console.log(`langsung sini ahh`)
      orderSum.value.push({ name: reg.product_name, qty: reg.qty })
    }

    // for (let idx in qty){
    //   total += qty[idx]
    //   console.log(`total nya >>> ${total}`)
    // }
    
  })
  console.log(`orderSUm >>>>> ${JSON.stringify(orderSum.value)}`)
}

const getOrderDetails=items=>{

  // Get Regular Item in Selected Row
  let regular=[]
  getProductByType(false).then(res => {
    items.forEach(item => {
      for(let idx in res){
        if(item.product_name == res[idx].data.name){
          regular.push(item)
          
          return
        }
      }
    })
  }).then(()=> {
    productRegular.value = regular
    console.log(`productRegular >>>>> ${JSON.stringify(productRegular.value)}`)
  })

  // Get Packae Item in Selected Row
  let packages=[]
  getProductByType(true).then(res => {
    items.forEach(item => {
      for(let idx in res){
        if(item.product_name == res[idx].data.name){
          packages.push(item)
          
          return
        }
      }
    })
  }).then(()=> {
    getComponents(packages)

    // productPackage.value=res

    // console.log(`productPackage >>>>> ${JSON.stringify(productPackage.value)}`)

     
 


  })
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

// for debugginf purpose
const debuggerBtn = () => {
  const a= [{ "qty": "2", "price": "225000", "product_name": "Hampers A", "subtotal": 450000 }, { "qty": "2", "price": "225000", "product_name": "Hampers B", "subtotal": 450000 }]


  // console.log(`order detail >>>> ${JSON.stringify(orderDetails.value)}`)
  // console.log(`products >>>> ${dialogPreview.value}`)
  getComponents(a)
  getPackTotal()
}

const debuggerBtn2 = () => {
  const a= [{ "qty": "2", "price": "225000", "product_name": "Hampers A", "subtotal": 450000 }, { "qty": "2", "price": "225000", "product_name": "Hampers B", "subtotal": 450000 }]


  // console.log(`order detail >>>> ${JSON.stringify(orderDetails.value)}`)
  // console.log(`products >>>> ${dialogPreview.value}`)
  // getComponents(a)
  getPackTotal()
}
</script>

<template>
  <!-- DEBUG BUTTOn -->
  <VBtn
    type="debug"
    size="small"
    color="success"
    @click="debuggerBtn"
  >
    <VIcon icon="bx-add-to-queue" />
    <span class="ms-2">DEBUG</span>
  </VBtn> 
  <!-- DEBUG BUTTOn END -->

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


          <!-- <<<<<<<<<<<<<<< Dots Vertical Menus >>>>>>>>>>>>>>> -->
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
                location="bottom"
                offset-y="5px"
                transition="slide-x-transition"
              >
                <VList class="border-sm">
                  <!-- 👉 View -->
                  <VListItem link>
                    <VListItemTitle
                      class="text-subtitle-2 text-primary"
                      @click="dialogPreview=true; getOrderDetails(orders[7].data.order_details)"
                    >
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
          <!-- <<<<<<<<<<<<<<< Dots Vertical Menus END >>>>>>>>>>>>>>> -->
        </VDataTable>
      </VCard>

      <!--  <<<<<<<<<<<<<<<<<<< MODAL >>>>>>>>>>>>>>>>>>>  -->
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

        <!-- DIALOG PREVIEW -->
        <VCard>
          <VDialog
            v-model="dialogPreview"
            max-width="720px"
          >
            <VCard class="rounded-lg">
              <template #text>
                <!--
                  close Button 
                  <VCardActions class="py-0 px-0">
                  <VSpacer />
          
                  <VBtn
                  text="Close"
                  variant="text"
                  > 
                  <VIcon
                  icon="bx-x-circle"
                  color="disabled"
                  size="32"
                  @click="dialogPreview=false"
                  />
                  </VBtn>
                  </VCardActions>
                -->
                <!-- DEBUG BUTTOn -->
                <VBtn
                  type="debug"
                  size="small"
                  color="success"
                  @click="debuggerBtn2"
                >
                  <VIcon icon="bx-add-to-queue" />
                  <span class="ms-2">DEBUG</span>
                </VBtn> 
                <!-- DEBUG BUTTOn END -->
                <VContainer
                  fluid
                  class="ma-0 pa-0"
                >
                  <VList
                    v-model:opened="open"
                    class="ma-0 pa-0"
                  >
                    <VRow>
                      <VCol
                        cols="12"
                        md="6"
                        sm="12"
                        xs="12"
                      >
                        <!-- <<<<<<<<<<<<<<<<<<< REGULAR ITEM GROUP >>>>>>>>>>>>>>>>>>> -->
                        <VListGroup value="Regular">
                          <template #activator="{ props }">
                            <VListItem
                              v-bind="props"
                              title="Regular Items"
                              density="compact"
                              class="text-primary "
                            />
                          </template>

                          <VListItem
                            v-for="(item) in productRegular"
                            :key="item.order_no"
                            :ripple="false"
                            density="compact"
                            class="text-subtitle-2 py-0"
                          >
                            <VRow>
                              <VCol cols="9">
                                {{ item.product_name }}
                              </VCol>
                              <VCol cols="3">
                                {{ item.qty }} pack
                              </VCol>
                            </VRow>
                          </VListItem>
                        </VListGroup>
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                        sm="12"
                        xs="12"
                      >
                        <!-- <<<<<<<<<<<<<<<<<<< PACKAGE ITEM GROUP >>>>>>>>>>>>>>>>>>> -->
                        <VListGroup value="Package">
                          <template #activator="{ props }">
                            <VListItem
                              v-bind="props"
                              title="Package Items"
                              density="compact"
                              class="ma-0 pa-0 text-primary"
                            />
                          </template>

                          <VListGroup
                            v-for="(item) in productPackage"
                            :key="item.order_no"
                            :ripple="false"
                            :value="item.product_name"
                            density="compact"
                          >
                            <template #activator="{ props }">
                              <VListItem
                                v-bind="props"
                                density="compact"
                                class="ma-0 pa-0 text-subtitle-2"
                              >
                                <VRow>
                                  <VCol cols="8">
                                    {{ item.product_name }} 
                                  </VCol>
                                  <VCol cols="4">
                                    {{ item.qty }} pack
                                  </VCol>
                                </VRow>
                              </VListItem>
                            </template>
                            <VListItem
                              v-for="(comp) in item.components"
                              :key="comp"
                              :ripple="false"
                              density="compact"
                              class="text-caption py-0"
                            >
                              {{ comp }}
                            </VListItem>
                          </VListGroup>
                        </VListGroup>
                      </VCol>

                      <VCol
                        cols="12"
                        md="12"
                        sm="12"
                        xs="12"
                      >
                        <!-- <<<<<<<<<<<<<<<<<<< TOTAL GROUP >>>>>>>>>>>>>>>>>>> -->
                        <VListGroup value="Summary">
                          <template #activator="{ props }">
                            <VListItem
                              v-bind="props"
                              title="Summary"
                              density="compact"
                              class="text-primary "
                            />
                          </template>

                          <VListItem
                            v-for="(item) in productRegular"
                            :key="item.order_no"
                            :ripple="false"
                            density="compact"
                            class="text-subtitle-2 py-0"
                          >
                            <VRow>
                              <VCol cols="9">
                                {{ item.product_name }}
                              </VCol>
                              <VCol cols="3">
                                {{ item.qty }} pack
                              </VCol>
                            </VRow>
                          </VListItem>
                        </VListGroup>
                      </VCol>
                    </VRow>
                  </VList>
                </VContainer>

                <VCardActions>
                  <VSpacer />
                  <VBtn
                    color="blue-darken-1"
                    variant="text"
                    @click="close"
                  >
                    Close
                  </VBtn>
                </VCardActions>
              </template>
            </VCard>
          </VDialog>
        </VCard>
        <!-- DIALOG PREVIEW END -->
      </div>
      <!--  <<<<<<<<<<<<<<<<<<< MODAL END >>>>>>>>>>>>>>>>>>>  -->
    </VCol>
  </VRow>
</template>
