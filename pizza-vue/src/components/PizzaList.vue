<style></style>

<template>
  <div
    class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat"
  >
    <div class="mb-6 max-w-md">
      <input
        v-model="searchNaziv"
        @input="fetchPizze"
        type="text"
        placeholder="Pretraži pizze po nazivu..."
        class="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="pizza in pizze"
        :key="pizza.id"
        @click="odaberiPizzu(pizza)"
        :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabranaPizza?.naziv === pizza.naziv
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
      >
        <div
          class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl"
        >
          <img :src="pizza.slika_url" :alt="pizza.naziv" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{ pizza.naziv }}</h2>

            <div class="flex space-x-2">
              <div
                v-for="sastojak in pizza.sastojci"
                :key="sastojak"
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs"
              >
                <v-icon :name="ikoneSastojaka[sastojak]" />
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div
              class="flex justify-between text-gray-700"
              v-for="(cijena, velicina) in pizza.cijene"
              :key="velicina"
            >
              <span class="font-medium">{{
                velicina.charAt(0).toUpperCase() + velicina.slice(1)
              }}</span>
              <span>€{{ cijena }}</span>
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button
              @click.stop="router.push({ name: 'PizzaDetails', params: { naziv: pizza.naziv } })"
              class="text-sm bg-slate-700 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Detalji
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <OrderFooter
    v-if="odabranaPizza"
    :odabrana-pizza="odabranaPizza"
    @close="odabranaPizza = null"
    @order-status="$emit('order-status', $event)"
  />
</template>

<script setup>
import OrderFooter from './OrderFooter.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { addIcons } from 'oh-vue-icons'
import {
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  CoHotjar,
  GiMilkCarton,
  GiBellPepper,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  GiHamShank,
} from 'oh-vue-icons/icons'

addIcons(
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  GiBellPepper,
  GiHamShank,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  CoHotjar,
  GiMilkCarton,
)

const ikoneSastojaka = {
  rajčica: 'gi-tomato',
  sir: 'gi-cheese-wedge',
  gljive: 'gi-sliced-mushroom',
  bosiljak: 'io-leaf-sharp',
  paprika: 'gi-bell-pepper',
  šunka: 'gi-ham-shank',
  'feferoni ljuti': 'la-pepper-hot-solid',
  tunjevina: 'gi-canned-fish',
  'crveni luk': 'gi-garlic',
  panceta: 'fa-bacon',
  kulen: 'co-hotjar',
  vrhnje: 'gi-milk-carton',
}

const router = useRouter()
const odabranaPizza = ref(null)
const pizze = ref([])
const emit = defineEmits(['order-status'])
const searchNaziv = ref('')

function odaberiPizzu(pizza) {
  odabranaPizza.value = pizza
  console.log(odabranaPizza.value)
}

async function fetchPizze() {
  try {
    const response = await axios.get('http://localhost:3000/pizze', {
      params: {
        naziv: searchNaziv.value || undefined,
      },
    })
    pizze.value = response.data
    console.log(pizze.value)
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka o pizzama: ', error)
  }
}

onMounted(() => {
  fetchPizze()

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      odabranaPizza.value = null
    }
  })
})
</script>
