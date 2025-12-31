<template>
  <!-- Overlay -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <!-- Modal -->
    <div
      class="w-full max-w-sm bg-slate-800 rounded-xl p-6 border border-slate-600 shadow-xl text-center"
    >
      <h3
        :class="[
          'text-lg font-semibold mb-3',
          type === 'success' ? 'text-green-400' : 'text-red-400',
        ]"
      >
        {{ type === 'success' ? 'Potvrđeno' : 'Greška...' }}
      </h3>

      <p class="text-white text-sm mb-6">
        {{ message }}
      </p>

      <button
        @click="$emit('close')"
        class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg cursor-pointer"
      >
        U redu
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String, // 'success' | 'error'
    required: true,
  },
})

defineEmits(['close'])
</script>
