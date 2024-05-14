<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">

        <CanvasImage class="row justify-content-center"/>
        <p v-if="question">Iedomājieties, ka stāvat pie <strong>{{ question.object1.name }}</strong> un esat vērsts pret
          <strong>{{ question.object2.name }}</strong>.
          Norādiet uz <strong>{{ question.object3.name }}</strong>.</p>
        <div class="d-flex flex-column align-items-center "><p v-if="question" style="height: 0px;">

          zieds</p>

          <p style="height: 0px;
        position: relative;
        top: 132px;
        z-index: 100;" v-if="question">stop zīme</p>
        </div>
        <div class="d-flex justify-content-center">

          <degree-picker active-color="black" :modelValue="degrees" width="220px"
                         @update:modelValue="degrees = $event" step="360"></degree-picker>
          <div class="vl"></div>
        </div>
        <div class="row align-items-center mt-2">
          <div class="col">
            <input disabled type="number" class="form-control" v-model.number="degrees" :disabled="!question" min="0"
                   max="360"
                   placeholder="Ievadi leņķi (0-360)"/>
          </div>
          <div class="col-auto">
            <button class="btn btn-secondary" @click="submitAnswer" :disabled="!question || degrees === null">Izmēģināt
              atbildi
            </button>
          </div>
        </div>
        <p v-if="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {DegreePicker} from "degree-picker";
import "degree-picker/dist/style.css";
import ImageCanvas from "@/components/CanvasImage.vue";
import CanvasImage from "@/components/CanvasImage.vue";

export default {
  components: {CanvasImage, ImageCanvas, DegreePicker},
  data() {
    return {
      question: {
        id: 1,
        object1: {name: "stop zīmes", x: 172, y: 125},
        object2: {name: "ziedu", x: 190, y: 366},
        object3: {name: "māju", x: 83, y: 240},
        correct_angle: 41
      },
      degrees: 0,
      message: '',
    };
  },
  mounted() {
    // this.drawImages();
  },
  methods: {
    submitAnswer() {
      if (this.degrees < 0 || this.degrees > 360) {
        this.message = 'Lūdzu, ievadiet derīgu leņķi no 0 līdz 360 grādiem.';
        return;
      }
      this.message = `Jūs ievadījāt ${this.degrees} grādus. Pareizā atbilde ir starp 26 un 56 grādiem`;
    }
  }
}
</script>

<style scoped>
.imageCanvas {
  max-width: 100%;
  height: auto;
  aspect-ratio: 800 / 600;
  display: block;
  margin: 0 auto;
}

.vl {
  border-left: 2px solid black;
  height: 103px;
  position: absolute;
  z-index: 2;
  margin-top: 10px;
}

</style>
