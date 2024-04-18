<script setup>
import ProductService from '@/services/ProductService'
import DialogPreview from './DialogPreview.vue'


const props = defineProps(['data', 'products'])

const isOpen=ref(false)
const productRegular=ref()
const productPackage=ref()

const getProductByType=isPackage=> {
  return new Promise((resolve, reject) => {
    let name=[]
    props.products.forEach(prod => {
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
</script>

<template>
  <VButton
    type="submit"
    color="warning"
    variant="tonal"
    class="ma-0"
  >
    <!-- {{ props.data }} -->
    <VIcon
      size="large"
      icon="bx-dots-vertical-rounded"
      color="warning"
    />
    <!-- SECTION Menu -->
    <VMenu
      activator="parent"
      width="80px"
      location="bottom end"
      offset="5px"
    >
      <VList>
        <!-- 👉 View -->
        <VListItem link>
          <VListItemTitle
            class="text-subtitle-2 text-primary"
            @click="isOpen=true; getOrderDetails(props.data.data.order_details)"
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
          <VListItemTitle class="text-subtitle-2 text-warning">
            Set Bill
          </VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
    <!-- !SECTION -->
  </VButton>
  {{ isOpen }}
  <DialogPreview
    :dialog-preview="isOpen"
    :package="productPackage"
    :regular="productRegular"
    @modal-close="isOpen=false"
  />
</template>
