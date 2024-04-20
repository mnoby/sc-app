<script setup>
import DialogPreview from './DialogPreview.vue'

const props = defineProps(['data', 'products', 'isMainPage'])
const emit = defineEmits(["mainPageClose"])
const isOpen=ref(false)

const parseOrder=ref({
  regular: '',
  package: '',
  summary: '',
})

const getProductByType=isPackage=> {  
  return new Promise((resolve, reject) => {
    let name = props.products.filter(prod=> {
      return prod.data.package == isPackage
    })
    resolve(name)
  })
}

// Function for Merge and Count both product_name and qty of order_details
const getOrderSummary=(regularOrder, packageOrder)=>{
  let rawJoin=[]
  const packages = packageOrder
  const regular = regularOrder

  //Loop for package product
  for(let i=0; i < packages.length; i++){
    const component = packages[i].components

    // Loop for each package component
    for(let j=0; j < component.length; j++){
      rawJoin.push({ product_name: component[j], qty: parseInt(packages[i].qty) })
    }
  }

  // Merging the duplicated variable in rawJoin and summ the qty
  regular.forEach((data=> {
    rawJoin.push({ product_name: data.product_name, qty: parseInt(data.qty) })
  }))

  const mergeAndCount = rawJoin.reduce((a, c) => {
    const obj = a.find(obj => obj.product_name === c.product_name)
    if (!obj) {
      a.push(c)
    } else {
      obj.qty += c.qty
    }
    
    return a
  }, [])

  sortArrObj(mergeAndCount, 'product_name')
  
  return parseOrder.value['summary'] = mergeAndCount

}

// Function for defining the order detail by its type and attaching components property into it
const parseOrderDetails=items=>{
  const itemState=[false, true]
 
  return itemState.forEach(state=> {

    // get product Type inside the Order details and store the values into separate variable
    getProductByType(state).then(res => {
      const temp =[]

      res.forEach(data =>{
        const obj = items.find(obj => obj.product_name === data.data.name)

        if(obj){
          // add component object into order details
          obj.components = data.data.components
          temp.push(obj)
        }
        
        return temp
      })
      if(state){
        parseOrder.value['package'] = temp
      }else{
        parseOrder.value['regular'] = temp
      }
    }).then(() => {
      getOrderSummary(parseOrder.value['regular'], parseOrder.value['package'])
    })
  })
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const sortArrObj = (arrObj, sortBy, asc=true) => {
  if(asc){
    return  arrObj.sort(
      (prop1, prop2) => 
        (prop1[sortBy] > prop2[sortBy]) ? 1 : (prop1[sortBy] < prop2[sortBy]) ? -1 : 0)
  } 
  else{
    arrObj.sort(
      (prop1, prop2) => 
        (prop1[sortBy] < prop2[sortBy]) ? 1 : (prop1[sortBy] > prop2[sortBy]) ? -1 : 0)

  }
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
    {{ isOpen }}
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
            @click="isOpen=!isOpen; parseOrderDetails(props.data.data.order_details)"
          >
            View
          </VListItemTitle>
        </VListItem>

        <!-- 👉 Edit -->
        <VListItem link>
          <VListItemTitle
            class="text-subtitle-2 text-primary"
            @click="emit('mainPageClose')"
          >
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

  <!-- OrderForm Component -->
  <!--
    <OrderForm
    v-model=""
    :edit-flow="isEdit"
    :order-data="props.data.data"
    />
  -->
          
  <!-- Dialog Preview Component -->
  <DialogPreview
    :dialog-preview="isOpen"
    :parse-order="parseOrder"
    @modal-close="isOpen=!isOpen"
  />
</template>
