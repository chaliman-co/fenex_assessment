
<template>
  <DataTable @row-select="router.push(`/products/${$event.data.product._id}`)" v-if="!loading && cart.length > 0"
    :value="cart" selectionMode="single" dataKey="_id">
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="text-xl text-900 font-bold">Products</span>
      </div>
    </template>
    <Column field="product.name" header="Name"></Column>
    <Column field="product.category.name" header="Category"></Column>
    <Column header="Image">
      <template #body="slotProps">
        <img :src="`${apiBaseUrl}${slotProps.data.product.imageUrl}`" class="w-6rem shadow-2 border-round" height="80" />
      </template>
    </Column>
    <Column field="product.price" header="Price">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.product.price) }}
      </template>
    </Column>
    <Column field="quantity" header="Quantity"></Column>
    <template #footer> In total there are {{ cart.length }} products. </template>
  </DataTable>
  <div v-if="!cart.length" class="text-center text-3xl font-bold">No products in cart.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import { useStore } from 'vuex';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const router = useRouter()
const store = useStore()
const cart = computed(() => store.state.cart)

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

</script>
<style>
.p-datatable-table {
  margin: auto;
  min-width: 60% !important;
}

@media screen and (max-width: 800px) {
  .p-datatable-table {
    min-width: 90% !important;
  }
}
</style>