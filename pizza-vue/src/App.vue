<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import ConfirmOrder from './components/ConfirmOrder.vue'

const prikaziConfirm = ref(false)
const confirmPoruka = ref('')
const confirmTip = ref('')

function prikaziStatus({ type, message }) {
  confirmTip.value = type
  confirmPoruka.value = message
  prikaziConfirm.value = true
}

function zatvoriConfirm() {
  prikaziConfirm.value = false
  confirmPoruka.value = ''
  confirmTip.value = ''
}
</script>

<template>
  <Header />
  <router-view @order-status="prikaziStatus" />
  <ConfirmOrder
    v-if="prikaziConfirm"
    :type="confirmTip"
    :message="confirmPoruka"
    @close="zatvoriConfirm"
  />
</template>
