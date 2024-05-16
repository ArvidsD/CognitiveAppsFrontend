<template>
  <div class="enter-id">
    <p>
      <strong>AR LIELAJIEM BURTIEM</strong> - dzimtās pilsētas pirmie 3 burti, vārda pirmais burts, uzvārda pirmais
      burts un telefona numura 2 pēdējie cipari.
    </p>
    <p>
      Piemērs:
      Ģirts Ābele, dzimis Jelgavā, tel nr. 29784452 >> kods <strong>JELĢĀ52</strong>
    </p>
    <input :value="customId" @input="updateCustomId" type="text" class="form-control" placeholder="Ievadiet kodu">
  </div>
</template>

<script>
export default {
  props: {
    customId: {
      type: String,
      default: ''
    }
  },
  methods: {
    updateCustomId(event) {
      const uppercasedValue = event.target.value.toUpperCase();
      this.$emit('update:customId', uppercasedValue);
    }
  }
}
</script>

<style scoped>
.enter-id {
  margin-bottom: 20px;
}

input {
  text-transform: uppercase; /* Automatically transforms the input to uppercase */
}
</style>
