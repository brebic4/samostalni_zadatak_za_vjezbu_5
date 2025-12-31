<template>
  <div class="max-w-4xl mx-auto p-8">
    <button
      @click="$router.push('/')"
      class="mb-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer"
    >
      ← Natrag na popis
    </button>

    <div v-if="loading" class="text-center text-gray-500">Učitavanje...</div>

    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <div v-else class="bg-white rounded-xl shadow p-6">
      <h1 class="text-2xl font-bold text-orange-500 mb-4">
        {{ pizza.naziv }}
      </h1>

      <img :src="pizza.slika_url" :alt="pizza.naziv" class="w-full max-w-md mb-6 rounded-lg" />

      <h2 class="font-semibold mb-2">Sastojci:</h2>
      <ul class="list-disc list-inside mb-4">
        <li v-for="s in pizza.sastojci" :key="s">
          {{ s }}
        </li>
      </ul>

      <h2 class="font-semibold mb-2">Cijene:</h2>
      <ul>
        <li v-for="(cijena, velicina) in pizza.cijene" :key="velicina">
          {{ velicina }} – €{{ cijena }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const pizza = ref(null)
const loading = ref(true)
const error = ref('')

async function fetchPizza() {
  try {
    const naziv = route.params.naziv
    const response = await axios.get(`http://localhost:3000/pizze/${naziv}`)
    pizza.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Greška pri dohvaćanju pizze.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPizza)
</script>
