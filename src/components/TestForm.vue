<template>
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

    <TutorialQuestion class="mb-5"/>


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
import {useRoute} from 'vue-router';

export default {
  components: {TutorialQuestion},
  data() {
    return {
      form: {
        takenTest: 'Perception test',
        session_id: '',
        custom_id: '',
      }
    };
  },

  methods: {
    submitForm() {
      const customId = this.$route.query.custom_id || '';
      this.form.custom_id = customId;
      sessionStorage.clear();
      this.form.session_id = `sess-${Date.now()}`;

      const apiUrl = import.meta.env.VITE_DJANGO_SERVER_URL + 'perceptiontest/testtaker/';

      axios.post(apiUrl, this.form)
          .then(response => {
            sessionStorage.setItem('testTakerId', response.data.id);
            if (customId) {
              sessionStorage.setItem('customId', customId);
            }
            this.$emit('form-submitted');
          })
          .catch(error => {
            console.error("There was an error submitting the form:", error);
          });
    }
  }
}
</script>

<style>

</style>
