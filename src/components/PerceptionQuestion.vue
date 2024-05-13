<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <p v-if="question" class="text-center">Iedomājieties, ka stāvat pie <strong>{{
            question.object1.name_where
          }}</strong> un
          esat vērsts pret
          <strong>{{ question.object2.name_to }}</strong>.
          Norādiet uz <strong>{{ question.object3.name_point_to }}?</strong>.</p>
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
    if (sessionStorage.getItem('questions') && sessionStorage.getItem('currentQuestionIndex')) {
      this.questions = JSON.parse(sessionStorage.getItem('questions'));
      this.currentQuestionIndex = parseInt(sessionStorage.getItem('currentQuestionIndex'));
      this.loadCurrentQuestion();  // Šī funkcija tiek izsaukta, lai ielādētu jautājumu pēc indeksa
    } else {
      this.fetchQuestions();
    }
  },
  methods: {
    fetchQuestions() {
      axios.get(import.meta.env.VITE_DJANGO_SERVER_URL + 'perceptiontest/question_ids/')
          .then(response => {
            this.questions = response.data;
            sessionStorage.setItem('questions', JSON.stringify(this.questions));
            sessionStorage.setItem('currentQuestionIndex', '0'); // Sākotnēji uzstādīt indeksu uz 0
            this.loadCurrentQuestion();
          })
          .catch(error => {
            console.error("Error fetching question IDs:", error);
            this.message = 'Diemžēl notika kļūda jautājumu ielādēšanā.';
          });
    },

    loadNextQuestion() {
      this.currentQuestionIndex++; // Palielināt indeksu pirms jautājuma ielādes
      if (this.currentQuestionIndex < this.questions.length) {
        sessionStorage.setItem('currentQuestionIndex', this.currentQuestionIndex.toString()); // Atjaunināt indeksu sessionStorage
        this.loadCurrentQuestion();
      } else {
        this.endTest();
      }
    },
    endTest() {
      this.message = "Paldies, ka piedalījāties testā!";
      this.question = null;
      this.$emit('test-completed');
    },

    loadCurrentQuestion() {
      const questionId = this.questions[this.currentQuestionIndex].id;
      axios.get(`${import.meta.env.VITE_DJANGO_SERVER_URL}perceptiontest/question/${questionId}/`)
          .then(response => {
            this.question = response.data;
            this.degrees = 0;
            this.startTime = Date.now();
          })
          .catch(error => {
            console.error("Error fetching the question:", error);
            this.message = 'Diemžēl notika kļūda jautājuma ielādēšanā.';
          });
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

#app > div > div > div.mb-5 > div > div > div.d-flex.justify-content-center > div:nth-child(1) > div > div > div > div > span > span {
  display: none;
}
</style>
