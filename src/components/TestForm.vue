<template>
  <EnterIdComponent v-if="showEnterId" :customId="form.custom_id" :error="errors.custom_id"
                    @update:customId="updateCustomId" @clear-error="clearError('custom_id')" class="mb-3"/>
  <div>
    <h1 class="text-center">Uzdevums</h1>
    <p>
      <ul>
        <li>Tests sastāv no 12 uzdevumiem.</li>
        <li>Katrā no uzdevumiem Jūs redzēsiet attēlu ar objektiem un apli, kurā jāatzīmē leņķis starp 3 dažiem dotā
          attēla objektiem.
        </li>
        <li>Vajadzēs iztēloties, ka stāvat pie viena no dotā attēla objektiem (nosaukts apļa centrā) un esat vērsts pret
          citu objektu (nosaukts apļa augšpusē).
        </li>
        <li>Jūsu uzdevums būs atzīmēt leņķi uz riņķa līnijas, parādot virzienu uz trešo objektu attiecībā no sevis.</li>
      </ul>
    </p>

    <h2 class="text-center">Testa piemērs</h2>
    <TutorialQuestion class="mb-3"/>


    <form @submit.prevent="submitForm">
      <div class="text-center">
        <button type="submit" class="btn btn-secondary mb-5">Sākt Testu</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import TutorialQuestion from "@/components/TutorialQuestion.vue";
import EnterIdComponent from "@/components/EnterIdComponent.vue";
import {useRoute} from 'vue-router';
import {ref, onMounted} from 'vue';

export default {
  components: {TutorialQuestion, EnterIdComponent},
  emits: ['form-submitted'],
  setup(props, {emit}) {
    const form = ref({
      takenTest: 'Perception test',
      session_id: '',
      custom_id: '',
    });
    const showEnterId = ref(false);
    const route = useRoute();
    const errors = ref({});
    onMounted(() => {
      showEnterId.value = route.query.enter_id === 'true';
      const customId = route.query.custom_id || '';
      if (customId) {
        form.value.custom_id = customId;
      }
    });
    const clearError = (field) => {
      errors.value[field] = '';
    };

    const validateForm = () => {
      let isValid = true;
      errors.value = {};

      if (showEnterId.value && !form.value.custom_id) {
        errors.value.custom_id = 'Šis lauks ir obligāts!';
        isValid = false;
        window.scrollTo({top: 0, behavior: 'smooth'});
      }

      return isValid;
    };
    const updateCustomId = (value) => {
      form.value.custom_id = value;
    };

    const submitForm = () => {
      if (!validateForm()) {
        return;
      }
      const customId = route.query.custom_id || form.value.custom_id;
      form.value.custom_id = customId;
      sessionStorage.clear();
      form.value.session_id = `sess-${Date.now()}`;

      const apiUrl = import.meta.env.VITE_DJANGO_SERVER_URL + 'perceptiontest/testtaker/';

      axios.post(apiUrl, form.value)
          .then(response => {
            sessionStorage.setItem('testTakerId', response.data.id);
            if (customId) {
              sessionStorage.setItem('customId', customId);
            }
            emit('form-submitted');
          })
          .catch(error => {
            console.error("There was an error submitting the form:", error);
          });
    };

    return {
      form,
      showEnterId,
      updateCustomId,
      clearError,
      validateForm,
      submitForm,
      errors
    };
  }
}
</script>

<style>
/* Add any styles you need here */
</style>
