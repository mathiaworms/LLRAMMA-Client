<!-- src/components/ChatBox.vue -->
<template>
  <div>
    <textarea v-model="inputText" placeholder="Saisissez votre texte..."></textarea>
    <button @click="generateText">Générer Texte</button>
    <div v-if="generatedText !== ''">
      <h3>Résultat :</h3>
      <p>{{ generatedText }}</p>
    </div>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs';

export default {
  data() {
    return {
      inputText: '',
      generatedText: '',
      model: null,
      tokenizer: null,
    };
  },
  async created() {
    // Charger le modèle TensorFlow.js et le tokenizer au moment de la création du composant
    await this.loadModel();
    await this.loadTokenizer();
  },
  methods: {
    async loadModel() {
      const modelPath = 'http://localhost:3000/static/gpt2/tf_model.h5';

      try {
        // Charger le modèle TensorFlow.js à partir du serveur backend
        this.model = await tf.loadLayersModel(modelPath);
      } catch (error) {
        console.error('Erreur lors du chargement du modèle TensorFlow:', error);
      }
    },
    async loadTokenizer() {
      const tokenizerPath = 'http://localhost:3000/static/gpt2/tokenizer.json';

      try {
        // Charger le tokenizer à partir du serveur backend
        const response = await fetch(tokenizerPath);
        this.tokenizer = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement du tokenizer:', error);
      }
    },
    async generateText() {
      if (!this.model || !this.tokenizer) {
        console.error('Modèle ou tokenizer non chargé(s)');
        return;
      }

      try {
        // Prétraiter l'entrée avec le tokenizer
        const tokenizedInput = this.tokenizer.encode(this.inputText);

        // Faire une prédiction avec le modèle
        const tensorInput = tf.tensor([tokenizedInput]);
        const prediction = await this.model.predict(tensorInput);

        // Décoder la prédiction en texte
        const decodedPrediction = this.tokenizer.decode(Array.from(prediction.argMax(-1).dataSync()));

        // Mettre à jour l'état pour afficher le texte généré
        this.generatedText = decodedPrediction;
      } catch (error) {
        console.error('Erreur lors de la génération de texte:', error);
      }
    },
  },
};
</script>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
}
button {
  margin-top: 10px;
}
</style>
