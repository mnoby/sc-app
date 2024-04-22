<script setup>
import DialogConfirmation from './DialogConfirmation.vue'
import DialogPreview from './DialogPreview.vue'

const props = defineProps(['data', 'products', 'isMainPage'])
const emit = defineEmits(['mainPageClose', 'approveDelete', 'approveUpdate'])
const isOpen=ref({})
const menus=ref(['View', 'Edit', 'Delete', 'Set Bill'])

const parseOrder=ref({
  regular: '',
  package: '',
  summary: '',
})

const openModal=menu=>{
  if(!isOpen.value[menu]){
    isOpen.value[menu]=true
  } else{
    isOpen.value[menu]=!isOpen.value[menu]
  }
}

const actions=menu=>{
  if(menu=='View'){
    parseOrderDetails(props.data.data.order_details)
  } else if (menu=='Edit'){
    emit('mainPageClose')
  }
}

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
    class="ma-0"
  >
    <VIcon
      size="large"
      icon="bx-dots-vertical-rounded"
      color="warning"
    />
    <!-- 👉 SECTION Menu -->
    <VMenu
      activator="parent"
      width="80px"
      location="end"
      offset="5px"
    >
      <VList class="py-0">
        <!-- 👉 View -->
        <div
          v-for="(menu, idx) in menus"
          :key="idx"
        >
          <VDivider
            v-if="menu=='Set Bill'"
            class="my-2"
          />
          <VListItem link>
            <VListItemTitle
              class="text-subtitle-2 text-wrap"
              :class="[menu=='Delete'? 'text-error' : 'text-primary'], [menu=='Set Bill'? 'text-warning' : 'text-primary']"
              @click="openModal(menu); actions(menu)"
            >
              {{ menu=='Set Bill' ? props.data.data.paid? `${menu} Unpaid`: `${menu} Paid` : menu }}
            </VListItemTitle>
          </VListItem>
        </div>
      </VList>
    </VMenu>
    <!-- !SECTION -->
  </VButton>
  
  <!-- 👉 Dialog Preview Component -->
  <DialogPreview
    :preview-state="isOpen['View']"
    :parse-order="parseOrder"
    @modal-close="isOpen['View']=!isOpen['View']"
  />

  <!-- 👉 Dialog Delete Confirmation Component -->
  <DialogConfirmation
    :confirmation-state="isOpen['Delete']"
    @modal-close="isOpen['Delete']=!isOpen['Delete']"
    @approve-clicked="isOpen['Delete']=!isOpen['Delete']; emit('approveDelete')"
  >
    <template #confirm-text>
      Remove <br>
      <span class=" text-body-2 mb-0 pa-0 font-weight-black text-warning"> {{ props.data.data.order_no }}  </span> <br>
      <span> form Order List ?</span>
    </template>
  </DialogConfirmation>

  <!-- 👉 Dialog Set Bill Confirmation Component -->
  <DialogConfirmation
    :confirmation-state="isOpen['Set Bill']"
    @modal-close="isOpen['Set Bill']=!isOpen['Set Bill']"
    @approve-clicked="isOpen['Set Bill']=!isOpen['Set Bill']; emit('approveUpdate')"
  >
    <template #confirm-text>
      Update Bill of <br>
      <span class=" text-body-2 mb-0 pa-0 font-weight-black text-warning"> {{ props.data.data.order_no }}  </span> <br>
      <span> as {{ props.data.data.paid? `Unpaid`: `Paid` }} ?</span>
    </template>
  </DialogConfirmation>
</template>
