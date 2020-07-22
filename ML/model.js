import GLOBALS from "../config.js"

export default class Model {

    constructor() {
        this.model = tf.sequential();
        this.modelDict = null;
        
        document.getElementById("create-model").onclick = this.createModel.bind(this);
    }

    createModel() {

        // Create a sequential mode
        let modelSection = GLOBALS.modelSection;
        this.modelDict= modelSection.parseLayers();

        let dataset = GLOBALS.dataset;
        

        for(let key in this.modelDict){
          let num = this.modelDict[key].value;
          let activ = this.modelDict[key].activation;
          if(key=='layer-1'){
            this.model.add(tf.layers.dense({units: num, activation: activ, inputShape: [dataset.inputCols.length]}));
          }
          else{
            this.model.add(tf.layers.dense({units: num, activation: activ}));
          }
        }
      
        console.log('Model Summary:')
        this.model.summary()

      }


}
