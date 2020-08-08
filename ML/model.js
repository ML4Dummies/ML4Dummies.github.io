import GLOBALS from "../config.js"

export default class Model {

  constructor() {
    this.model = tf.sequential();
    this.modelDict = null;
    this.stop_requested = false;
    this.visor = tfvis.visor();
    this.visor.close();

   
    document.getElementById("train").onclick = () => {GLOBALS.modelSection.makeModel(); this.trainModel(), this.visor.open()}; //reseting model every time we train
    document.getElementById("download").onclick = this.downloadModel.bind(this);
    document.getElementById("stop").onclick = () => {this.stop_requested = true};
    document.getElementById("visualize").onclick = () => {this.visor.toggle()};

  }

  createModel(modelDict) {
    this.model=tf.sequential();
    // Create a sequential mode
   let num_features = GLOBALS.dataSection.inputCols.length;

    for (let key in modelDict) {
      let num = modelDict[key].value;
      let activ = modelDict[key].activation;
      if (key == 'layer-1') {
        this.model.add(tf.layers.dense({ units: num, activation: activ, inputShape: [num_features] }));
      }
      else {
        this.model.add(tf.layers.dense({ units: num, activation: activ }));
      }
    }

    console.log('Model Summary:')
    this.model.summary()

  }


  async trainModel() {
    let mode= GLOBALS.mode
    this.stop_requested = false
    let trainOptions = GLOBALS.trainOptionsSection
    let inputs = GLOBALS.dataset.normalizedTrain
    let labels = GLOBALS.dataset.trainLabels
    let options_dict = trainOptions.get_train_options()
    let learningRate = Number(options_dict["learning-rate"]);

    console.log("Training...")
    // model=createModel();
    if (mode == "Regression") {
      var loss_ = trainOptions.lossRegressionList[Number(options_dict['loss'])][0];
      var metrics_ = ['mse'];
      var tfvis_metrics = ['loss', "val_loss"];
      console.log("Reg")
    } else {
      var loss_ = trainOptions.lossClassificationList[Number(options_dict['loss'])][0];
      var metrics_ = ['accuracy'];
      var tfvis_metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    }

      
    this.model.compile({
      optimizer: trainOptions.optimList[Number(options_dict['optimizer'])][0](learningRate),
      loss: loss_,
      metrics: metrics_,
    });

    const batchSize = Number(options_dict['batch-size']);
    const epochs = Number(options_dict['epochs']);
    

    return await this.model.fit(inputs, labels, {
      batchSize,
      epochs,
      validationSplit:Number(document.getElementById("val-split").value),
      callbacks: 
      [tfvis.show.fitCallbacks({ name: 'Training Performance' }, tfvis_metrics, { height: 200, callbacks: ['onEpochEnd'] }),
      { onEpochEnd: this.testCallback },
      { onTrainEnd: () => {if(GLOBALS.dataset.normalizedTest.size != 0) this.testModel()} },
      { onBatchEnd: () => this.model.stopTraining = this.stop_requested }]

    });
  }

  testCallback() {
    console.log("Training")
  }

  async downloadModel() {
    await this.model.save('downloads://my-model');
  }

  
  async uploadModel() {
    this.model=tf.sequential();
    console.log("Uploading model ...")
    const uploadJSONInput = document.getElementById('fileuploadModelJson');
    const uploadWeightsInput = document.getElementById('fileuploadModelBin');

    this.model = await tf.loadLayersModel(tf.io.browserFiles(
      [uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
    
      console.log("Model uploaded")
  }

  predict(predict_data) {

    let mode = GLOBALS.mode;
    let pred = this.model.predict(predict_data);

    if (mode == "Classification") {
      pred = pred.argMax(1);
      // console.log(pred)
      //document.getElementById("console").appendChild(document.createTextNode("Accuracy: "+accuracy.toString())) 
    }
    console.log(pred.dataSync())
    return pred.dataSync()

  }

  testModel() {

    let inputs = GLOBALS.dataset.normalizedTest
    console.log("TestData:",inputs)
    let labels = GLOBALS.dataset.testLabels.squeeze()
  
    tf.tidy(() => {
      const values = this.model.predict(inputs);
  
      if (GLOBALS.mode == "Classification") {
        let pred = values.argMax(1);
        let result = pred.equal(labels.argMax(1));
        let accuracy = result.sum().dataSync()[0] / result.shape[0];
        //document.getElementById("console").appendChild(document.createTextNode("Accuracy: "+accuracy.toString()));
        document.getElementById("console").innerHTML = "Accuracy: " + accuracy.toString();

      } else if (GLOBALS.mode == "Regression") {
        let error = tf.losses.meanSquaredError(labels, values.squeeze())
        // document.getElementById("console").appendChild(document.createTextNode("Error: "+ error.dataSync().toString()));
        document.getElementById("console").innerHTML = "Error: " + error.dataSync().toString();
      }
  
    });
  
  }
  



}
