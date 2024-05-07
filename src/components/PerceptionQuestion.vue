<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <p v-if="question" class="text-center">Iedomājies, ka esi <strong>{{ question.object1.name }}</strong> un
          skaties uz
          <strong>{{ question.object2.name }}</strong>,
          kādā
          leņķī atrodas <strong>{{ question.object3.name }}?</strong></p>
        <div class="d-flex flex-column align-items-center"><p v-if="question" style="height: 0px;">
          {{ question.object2.name }}</p>
          <p style="height: 0px;
        position: relative;
        top: 132px;
        z-index: 100;" v-if="question">{{ question.object1.name }}</p>
        </div>

        <div class="d-flex justify-content-center">


          <degree-picker active-color="black" :modelValue="degrees" width="220px" step="360"
                         @update:modelValue="degrees = $event"/>
          <div class="vl"></div>
        </div>
        <div class="row align-items-center mt-2 justify-content-center">
          <div class="col-auto">
            <input type="number" class="form-control hidden" v-model.number="degrees"
                   :disabled="!question" min="0" max="360"
                   placeholder="Ievadi leņķi (0-360)"/>
            <button class="btn btn-secondary" @click="submitAnswer" :disabled="!question || degrees === null">Iesniegt
              atbildi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {DegreePicker} from "degree-picker";

import "degree-picker/dist/style.css";

export default {
  components: {DegreePicker},
  data() {
    return {
      questions: [],
      currentQuestionIndex: 0,
      question: null,
      degrees: 0,
      message: '',
      startTime: Date.now(),
    };
  },
  mounted() {
    this.fetchQuestions();
  },
  methods: {
    fetchQuestions() {
      axios.get(import.meta.env.VITE_DJANGO_SERVER_URL + 'perceptiontest/question_ids/')
          .then(response => {
            this.questions = response.data;
            console.log('Loaded questions:', this.questions); // Pievienojiet šo, lai redzētu, kādas ir ielādētās vērtības
            this.loadNextQuestion();
          })
          .catch(error => {
            console.error("Error fetching question IDs:", error);
            this.message = 'Diemžēl notika kļūda jautājumu ielādēšanā.';
          });
    },

    loadNextQuestion() {
      if (this.currentQuestionIndex < this.questions.length) {
        const questionId = this.questions[this.currentQuestionIndex].id; // Pievērsiet uzmanību, kā iegūstat ID
        axios.get(`${import.meta.env.VITE_DJANGO_SERVER_URL}perceptiontest/question/${questionId}/`)
            .then(response => {
              this.question = response.data;
              this.degrees = 0;
              this.startTime = Date.now();
              this.currentQuestionIndex++; // Palielināt indeksu šeit, lai nodrošinātu, ka nākamais zvans būs jaunam jautājumam
            })
            .catch(error => {
              console.error("Error fetching the question:", error);
              this.message = 'Diemžēl notika kļūda jautājuma ielādēšanā.';
            });
      } else {
        this.message = "Paldies, ka piedalījāties testā!";
        this.question = null;
        this.$emit('test-completed');
      }
    },

    submitAnswer() {
      if (this.degrees < 0 || this.degrees > 360) {
        this.message = 'Lūdzu, ievadiet derīgu leņķi no 0 līdz 360 grādiem.';
        return;
      }

      const endTime = Date.now();
      const timeTaken = endTime - this.startTime;

      const answerData = {
        question: this.question.id,
        test_taker: sessionStorage.getItem('testTakerId'),
        time_taken: new Date(timeTaken).toISOString().substr(11, 8),
        user_angle: this.degrees,
        correct_angle: this.question.correct_angle,
      };

      axios.post(import.meta.env.VITE_DJANGO_SERVER_URL + 'perceptiontest/submit_answer/', answerData)
          .then(response => {
            this.message = "Atbilde veiksmīgi iesniegta!";
            this.loadNextQuestion(); // Turpināt ar nākamo jautājumu
          })
          .catch(error => {
            console.error("Error submitting the answer:", error);
            this.message = "Radās problēma atbildes iesniegšanā. Lūdzu, mēģiniet vēlreiz.";
          });
    }
  }
}
</script>

<style>
.vl {
  border-left: 2px solid black;
  height: 103px;
  position: absolute;
  z-index: 2;
  margin-top: 10px;
}

.hidden {
  display: none;
}
</style>
