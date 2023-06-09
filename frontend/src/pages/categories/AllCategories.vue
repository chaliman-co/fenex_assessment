
<template>
  <DataTable v-if="loading" :value="skeletonCategories">
    <Column header="name">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
  </DataTable>
  <DataTable @row-select="router.push(`/categories/${$event.data._id}`)" v-if="!loading && categories.length > 0"
    :value="categories" showGridlines selectionMode="single" dataKey="_id">
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="text-xl text-900 font-bold">Categories</span>
      </div>
    </template>
    <Column field="name" header="Name"></Column>
    <template #footer> In total there are {{ categories.length}} categories. </template>
  </DataTable>
  <div v-if="!loading && !categories.length" class="text-center text-3xl font-bold">No categories found.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Skeleton from "primevue/skeleton"
import { useStore } from 'vuex';
import { errorNotification, getFromApi, handleErrors } from '../../util';

const router = useRouter()
const store = useStore()
const categories = computed(() => store.state.categories)
const loading = ref(true)
const skeletonCategories = [];
for (let i = 0; i < 5; i++) skeletonCategories.push({ })
onMounted(async () => {
  if (!categories.value.length) {
    try {
      const response = await getFromApi("/categories");
      if (response.failed) handleErrors(response)
      else {
        store.commit("set_categories", response.data)
      }
    } catch (err) {
      errorNotification("Network Error. Refresh to reload data")
    } finally {
      loading.value = false;
    }
  }
  loading.value = false

});

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

</script>
<style>
.p-datatable-table {
  margin: auto;
  min-width: 40% !important;
}

@media screen and (max-width: 800px) {
  .p-datatable-table {
    min-width: 90% !important;
  }
}
</style>