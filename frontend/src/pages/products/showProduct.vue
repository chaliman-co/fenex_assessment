<template>
  
  <Card class="m-auto mt-3 sm:w-full md:w-8">
    <template #title>
      <h1 class="text-center">{{ product.name }}</h1>
      <img class="h-20rem w-4 m-auto block" :src="`${apiBaseUrl}${product.imageUrl}`">
    </template>
    <template #content>
      <table>
        <tbody>
          <tr>
            <th>Name:</th>
            <td>{{product.name}}</td>
          </tr>
          <tr>
            <th>Category:</th>
            <td>{{ product.category.name }}</td>
          </tr>
          <tr>
            <th>Price:</th>
            <td>{{product.price}}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template #footer>
      <div class="flex justify-content-around">
  <Button v-if="profile && !inCart" @click="addToCart" label="Add To Cart"></Button>
  <Button v-if="profile && inCart" @click="removeFromCart" label="Remove From Cart"></Button>
  <Button v-if="isAdmin" label="Manage" @click="router.push(`${route.path}/update`)"></Button>
      </div>

    </template>
  </Card>
</template>
<script setup>
import { computed } from 'vue';
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import Card from "primevue/card"
import Button from "primevue/button";
import { errorNotification, successNotification } from '../../util';

const route = useRoute()
const router = useRouter()
const store = useStore()
const profile = computed(state => store.state.profile)
const product = computed(() => store.state.currentProduct)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const isAdmin = computed(() => store.state.profile && store.state.profile.role === 'admin')
const inCart = computed(() => store.state.cart.find(item => item.product._id === product.value._id))

function addToCart() {
  const quantity = Number(prompt("Please enter quantity"))
  if (isNaN(quantity)) errorNotification("Quantity Invalid")
  else {
    store.commit("add_to_cart", {product: product.value, quantity})
  successNotification("Added To Cart!")
  }
}
function removeFromCart() {
  store.commit("remove_from_cart", product.value)
  successNotification("Removed From Cart!")
}
</script>