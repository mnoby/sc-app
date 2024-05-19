<script setup>
import OrderService from '@/services/OrderService'
import ProductService from '@/services/ProductService'
import VueApexCharts from 'vue3-apexcharts'

import { hexToRgb } from '@layouts/utils'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const orders=ref([])
const products=ref([])
const productPacks=ref([])
const orderStatistics=ref()

// kesusahan memanggil order Sumamry

onMounted(async () => {
  // try{
  getProducts()
  getOrders()

  // } catch (error) {
  //   console.error('Error fetching Data: ', error)
  // }
})


//fetch Products Data From DB
const getProducts = () => {
  ProductService.getAll('name').get().then(res => {
    products.value = res.docs.map(doc => (doc.data() ))
  })
}

//fetch Orders Data From DB
const getOrders = () => {
  OrderService.getAll('order_no', 'asc').where('active', '==', true).get().then(res => {
    orders.value = res.docs.map(doc => (doc.data() ))
  })
}

const getProductByType=()=> {  
  return new Promise((resolve, reject) => {
    const status=[false, true]
    const temp={}

    status.forEach((stat => {
      temp[stat]=[]
      products.value.filter(prod=> {
        if(prod.package == stat) {
          temp[stat].push(prod) 
        }
      })

      // console.log(`temp >> ${JSON.stringify(temp)}`)

    }))

    // console.log(`name >> ${JSON.stringify(temp)}`)
    // return temp

    resolve(temp)
  })

  
}

const regularProductSummary=()=>{
  const rawDatas=[]

  //Check whether orders Data contains isPackage == false
  getProductByType().then(res => {
    res.false.forEach(product => {
      orders.value.forEach(order => {
        const result = order.order_details.find(prod_name => prod_name.product_name == product.name)
    
        if(result){
          // add component object into order details
          rawDatas.push({ product_name: result.product_name, qty: parseInt(result.qty), isPackage: false })
      
          // obj.components = data.data.components
          // temp.push(obj)
        }
      })
      
      
    })

    res.true.forEach(product => {
      orders.value.forEach(order => {
        const result = order.order_details.find(prod_name => prod_name.product_name == product.name)
    
        if(result){
          // add component object into order details
          // console.log(`result >> ${JSON.stringify(result)}`)
          for(let i=0; i < result.components.length; i++){
            rawDatas.push({ product_name: result.components[i], qty: parseInt(result.qty), isPackage: true })
          }

          // obj.components = data.data.components
          // temp.push(obj)
        }
      })
      
      
    })
  }).then(() => {
    const mergeAndCount = rawDatas.reduce((a, c) => {
      const obj = a.find(obj => obj.product_name === c.product_name)
      if (!obj) {
        a.push({ product_name: c.product_name, price: c.price, qty: c.qty })
      } else {
        obj.qty += c.qty
      }
    
      return a
    }, [])

    
    console.log(`MERGED >>> ${JSON.stringify(mergeAndCount)}`)
    
    return sortArrObj(mergeAndCount, 'product_name')

    // console.log(`stst >> ${JSON.stringify(orderStatistics.value = mergeAndCount)}`)
    
    // orderStatistics.value = mergeAndCount
    r
  })
}

const totalOrderPerProduct=()=>{
  // return new Promise((resolve, reject) => {
  const rawJoin=[]
  

  orders.value.forEach(order => {
    order.order_details.forEach(detail => {
      
      return rawJoin.push({ product_name: detail.product_name, price: parseInt(detail.price), qty: parseInt(detail.qty) })
    })
  })
  
  return mergeAndCount(rawJoin)

  //   resolve(mergeAndCount(rawJoin))
  // })
}

// const totalPack=()=> {
//   let total = 0
//   const result = totalOrderPerProduct()

//   console.log(`ALALALA >>> ${JSON.stringify(result)}`)

//   result.forEach(item => {
//     total += item.qty

//   })

//   return total
// }

const packPieChart=product=>{
  let qty=0
  const array = []
  const result = totalOrderPerProduct()

  product.forEach(product => {
    const search = result.find(prod=> prod.product_name == product.name)
    if( search != undefined){
      qty =  search.qty
    }
    array.push(qty)
  })
  
  return array
}

const productQtyTotal=products=>{
  let qty=0

  const result = totalOrderPerProduct()
  const search = result.find(prod=> prod.product_name == products.name)

  if( search != undefined){
    qty =  search.qty
  }
  
  productPacks.value.push(qty)
  
  return qty
  
}

const productPriceTotal=products=>{
  let total=0
  const result = totalOrderPerProduct()
  const search = result.find(prod=> prod.product_name == products.name)

  if( search != undefined){
    total =  search.price * search.qty
  }
  
  return total
}

const mergeAndCount=data=> {

  return data.reduce((a, c) => {
    const obj = a.find(obj => obj.product_name === c.product_name)
    if (!obj) {
      a.push(c)
    } else {
      obj.qty += c.qty
    }
    
    return a
  }, [])
}

const totalOrdered=product=> {
  let finalRes
  console.log(`ESSSSS >> ${JSON.stringify(orderStatistics.value)}`)

  orderStatistics.value.forEach(order => {

    const result = order.product_name.find(prod_name => prod_name == product.name)
  
    if(result){
      return finalRes = result.qty
    } else {
      return finalRes
    }
  })
  
  return finalRes
}

const packTotal=product=>{
  let total = 0
  const orderPerProduct = totalOrderPerProduct()

  product.forEach(product => {
    const search = orderPerProduct.find(order=> order.product_name == product.name)
    if( search != undefined){
      total += search.qty
    }
  })
  
  return total
}

const income=product=>{
  let total=0
  const orderPerProduct = totalOrderPerProduct()

  product.forEach(product => {
    const search = orderPerProduct.find(order=> order.product_name == product.name)
    if( search != undefined){
      total +=  search.price * search.qty
    }

  })  
  
  return total
}

const totalRatio=product=>{
  let totalOrder = 0 
  const orderPerProduct = totalOrderPerProduct()

  // sum qty of all orders
  orderPerProduct.forEach(order => {
    totalOrder += order.qty
  })


  // sum qty of specific orderType
  const particularTotal = packTotal(product)

  // percentage formula
  const ratio = (particularTotal / totalOrder)*100
  
  return `${ratio}%`
}

const formatNumber = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// const series = [0, 0, 0, 5, 0, 2, 2]

// const series = productPacks.value

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const disabledTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['disabled-opacity'] })`
  const primaryTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['high-emphasis-opacity'] })`
  
  return {
    chart: {
      sparkline: { enabled: true },
      animations: { enabled: false },
    },
    stroke: {
      width: 6,
      colors: [currentTheme.surface],
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },

    // labels: [
    //   'Fashion',
    //   'Electronic',
    //   'Sports',
    //   'Decor',
    // ],
    labels: products.value.filter(info => info.package == false).map(info => info.name),
    

    colors: [
      currentTheme.success,
      currentTheme.primary,
      currentTheme.secondary,
      currentTheme.info,
    ],
    grid: {
      padding: {
        top: -7,
        bottom: 5,
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '80%',
          labels: {
            show: true,
            name: {
              offsetY: 17,
              fontSize: '13px',
              color: disabledTextColor,
              fontFamily: 'Public Sans',
            },
            value: {
              offsetY: -17,
              fontSize: '24px',
              color: primaryTextColor,
              fontFamily: 'Public Sans',
            },
            total: {
              show: true,
              label: 'of Orders',
              fontSize: '14px',
              formatter: () => totalRatio(products.value.filter(info => info.package == false)),
              color: disabledTextColor,
              fontFamily: 'Public Sans',
            },
          },
        },
      },
    },
  }
})

const orderss = [
  {
    amount: '82.5k',
    title: 'Electronic',
    avatarColor: 'primary',
    subtitle: 'Mobile, Earbuds, TV',
    avatarIcon: 'bx-mobile-alt',
  },
  {
    amount: '23.8k',
    title: 'Fashion',
    avatarColor: 'success',
    subtitle: 'Tshirt, Jeans, Shoes',
    avatarIcon: 'bx-closet',
  },
  {
    amount: 849,
    title: 'Decor',
    avatarColor: 'info',
    subtitle: 'Fine Art, Dining',
    avatarIcon: 'bx-home',
  },
  {
    amount: 99,
    title: 'Sports',
    avatarColor: 'secondary',
    subtitle: 'Football, Cricket Kit',
    avatarIcon: 'bx-football',
  },
]

const moreList = [
  {
    title: 'Share',
    value: 'Share',
  },
  {
    title: 'Refresh',
    value: 'Refresh',
  },
  {
    title: 'Update',
    value: 'Update',
  },
]

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
  <VCard>
    <VCardItem class="pb-3">
      <VCardTitle class="mb-1">
        Regular Order Statistics
      </VCardTitle>
      <VCardSubtitle> <b>IDR</b> {{ formatNumber(income(products.filter(stat => stat.package == false))) }} Total Sales</VCardSubtitle>
      <VBtn
        type="addItem"
        size="small"
        text="debug"
        color="success"
        class="rounded-e-0"
        @click="totalRatio(products.filter(info => info.package == false))"
      />
      <template #append>
        <div class="me-n3 mt-n8">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="flex-grow-1">
          <h4 class="text-h4 mb-1">
            {{ packTotal(products.filter(stat => stat.package == false)) }}
          </h4>
          <span>Total Packs</span>
        </div>

        <div>
          <VueApexCharts
            type="donut"
            :height="125"
            width="105"
            :options="chartOptions"
            :series="packPieChart(products.filter(info => info.package == false))"
          />
        </div>
      </div>

      <VList class="card-list mt-7">
        <VListItem
          v-for="product in products.filter(info => info.package == false)"
          :key="product.product_name"
        >
          <template #prepend>
            <VAvatar
              rounded
              variant="tonal"
              color="info"
            >
              <VIcon icon="bx-bxs-cake" />
            </VAvatar>
          </template>

          <VListItemTitle class="mb-1">
            {{ product.name }}
          </VListItemTitle>
          <VListItemSubtitle class="text-disabled">
            <b>IDR</b> {{ formatNumber(productPriceTotal(product)) }}
          </VListItemSubtitle>

          <template #append>
            <span> {{ productQtyTotal(product) }} </span>
            <VSpacer class="ms-2" />
            <span class="text-caption"> Pack</span>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 21px;
}
</style>


