
<template>
  <div class="card">
    <Accordion :multiple="true"  class="w-full">
  <AccordionTab header="Products">
   <router-link to="/products">
    <Button label="View All" icon="pi pi-building" class="menu-button"></Button>
  </router-link>
  </AccordionTab>
    </Accordion>
    <router-link :to="{name: 'Checkout'}">
      <Button label="Checkout"  class="menu-button mt-5"></Button>
    </router-link> 
  </div>
</template>

<script setup>
import TieredMenu from "primevue/tieredmenu"
import Accordion from "primevue/accordion"
import AccordionTab from "primevue/accordiontab"
import Button from "primevue/button";
          

</script>
<style scoped>
.p-accordion-content {
padding: 13px;
}
.menu-button {
background: none;
color: inherit;
width: 100%;
margin-bottom: 10px;
}
</style>