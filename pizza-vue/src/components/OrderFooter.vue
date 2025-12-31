<style></style>

<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-slate-700 backdrop-blur-sm border-t border-slate-600 shadow-xl p-4 sm:p-6 text-white"
  >
    <div
      class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 sm:gap-6"
    >
      <!-- Slika pizze i naziv -->
      <div
        class="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 w-full sm:w-auto"
      >
        <img
          :src="odabranaPizza.slika_url"
          alt="slika ovdje"
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md shadow-black/40"
        />
        <div>
          <h3 class="font-bold tracking-wide text-base sm:text-lg text-orange-400">
            {{ odabranaPizza.naziv }}
          </h3>
        </div>
      </div>
      <!-- Odabir veličina + cijene -->
      <div
        class="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto"
      >
        <button
          v-for="(cijena, velicina) in odabranaPizza.cijene"
          :key="velicina"
          :class="[
            'px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base hover:bg-orange-500 hover:text-white transition-all cursor-pointer',
            odabranaVelicina === velicina
              ? 'bg-orange-500 text-white'
              : 'bg-slate-600/40 text-white',
          ]"
          @click="odabranaVelicina = velicina"
        >
          {{ velicina }} – {{ cijena }}
        </button>
      </div>
      <!-- Odabir količine -->
      <div class="flex items-center justify-center space-x-2 w-full sm:w-auto">
        <button
          @click="kolicina > 1 ? kolicina-- : (kolicina = 1)"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
        >
          -
        </button>
        <div
          class="px-3 py-1 bg-slate-600/40 backdrop-blur-sm rounded-md border border-slate-500 text-sm sm:text-base"
        >
          {{ kolicina }}
        </div>
        <button
          @click="kolicina++"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
        >
          +
        </button>
      </div>
      <div
        class="w-full sm:w-auto text-center font-semibold text-lg text-orange-400 tracking- wide"
      >
        Ukupno: {{ ukupna_cijena_stavke || '0.00' }}€
      </div>
      <button
        @click="dodajUNarudzbu()"
        class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
      >
        Dodaj u košaricu
      </button>

      <div
        v-if="narucene_pizze.length"
        class="w-full max-w-60 mx-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600 space-y-3"
      >
        <h4 class="text-white font-semibold text-base">Podaci za dostavu</h4>

        <input
          v-model="ime"
          type="text"
          placeholder="Ime"
          class="w-full px-3 py-2 rounded-md bg-slate-700 border border-slate-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          v-model="adresa"
          type="text"
          placeholder="Adresa"
          class="w-full px-3 py-2 rounded-md bg-slate-700 border border-slate-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          v-model="telefon"
          type="text"
          placeholder="Broj telefona"
          class="w-full px-3 py-2 rounded-md bg-slate-700 border border-slate-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        @click="posaljiNarudzbu"
        :disabled="!formaJeValidna || narucene_pizze.length == 0"
        class="bg-orange-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-xl"
      >
        Naruči
      </button>
    </div>
    <button
      class="absolute top-2 right-2 text-slate-300 hover:text-white text-xl font-bold cursor-pointer"
      @click="emit('close')"
    >
      x
    </button>
    <div
      v-if="narucene_pizze.length"
      class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-600"
    >
      <h4 class="font-semibold text-lg text-white mb-2">Stavke u košarici:</h4>
      <ul class="space-y-2">
        <li
          v-for="(stavka, index) in narucene_pizze"
          :key="index"
          class="flex items-center justify-between bg-slate-700/50 rounded-md p-2"
        >
          <div class="text-white text-sm">
            {{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}
          </div>

          <div class="flex items-center space-x-3">
            <div class="text-orange-400 font-semibold text-sm">
              {{ (stavka.cijena * stavka.kolicina).toFixed(2) }}€
            </div>

            <!-- GUMB ZA BRISANJE -->
            <button
              @click="ukloniStavku(index)"
              class="text-red-400 hover:text-red-500 cursor-pointer font-bold text-lg leading-none"
              title="Ukloni stavku"
            >
              X
            </button>
          </div>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'

const props = defineProps({ odabranaPizza: { type: Object, required: true } })
const emit = defineEmits(['close', 'order-status'])

const narucene_pizze = ref([])
const odabranaVelicina = ref('mala')
const kolicina = ref(1)
const ime = ref('')
const adresa = ref('')
const telefon = ref('')

// reset podataka za dostavu kada se prikaže forma
watch(
  () => narucene_pizze.value.length,
  (newLength, oldLength) => {
    // forma se upravo prikazala (0 → 1)
    if (oldLength === 0 && newLength == 1) {
      ime.value = ''
      adresa.value = ''
      telefon.value = ''
    }
  },
)

// provjera podataka dostave
const formaJeValidna = computed(() => {
  if (!ime.value || !adresa.value || !telefon.value) {
    return false
  }

  // telefon mora imati bar 6 brojeva
  if (telefon.value.length < 6) {
    return false
  }

  return true
})

const ukupna_cijena_stavke = computed(() => {
  const cijenaPoKomadu = props.odabranaPizza.cijene[odabranaVelicina.value]
  return (cijenaPoKomadu * kolicina.value).toFixed(2)
})

function dodajUNarudzbu() {
  const novaStavka = {
    naziv: props.odabranaPizza.naziv,
    velicina: odabranaVelicina.value,
    kolicina: kolicina.value,
    cijena: props.odabranaPizza.cijene[odabranaVelicina.value],
  }
  narucene_pizze.value.push(novaStavka)
  console.log('Naručene pizze:', narucene_pizze.value)
}

async function posaljiNarudzbu() {
  try {
    const pizzeZaBackend = narucene_pizze.value.map((stavka) => ({
      naziv: stavka.naziv,
      velicina: stavka.velicina,
      kolicina: stavka.kolicina,
    }))

    const odgovor = await axios.post('http://localhost:3000/narudzbe', {
      ime: ime.value,
      adresa: adresa.value,
      telefon: telefon.value,
      narucene_pizze: pizzeZaBackend,
    })

    // Poruka s Expressa
    emit('order-status', {
      type: 'success',
      message: odgovor.data.message,
    })

    // reset
    narucene_pizze.value = []
    ime.value = ''
    adresa.value = ''
    telefon.value = ''
  } catch (error) {
    console.error(error)

    emit('order-status', {
      type: 'error',
      message: error.response?.data?.message || 'Došlo je do greške pri slanju narudžbe.',
    })
  }
}

function ukloniStavku(index) {
  const potvrdaBrisanja = confirm('Jeste li sigurni da želite ukloniti ovu stavku iz košarice?')

  if (potvrdaBrisanja) {
    narucene_pizze.value.splice(index, 1)
  }
}
</script>
