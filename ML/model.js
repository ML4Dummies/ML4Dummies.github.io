import GLOBALS from "../config.js"

export default class Model {

  constructor() {
    this.model = tf.sequential();
    this.modelDict = null;
    this.stop_requested = false;

    document.getElementById("create-model").onclick = this.createModel.bind(this);
    document.getElementById("train").onclick = this.trainModel.bind(this);
    document.getElementById("download").onclick = this.downloadModel.bind(this);
    document.getElementById("loadModel").onclick = this.uploadModel.bind(this);
    document.getElementById("stop").onclick = () => {this.stop_requested = true};

  }

  createModel() {

    // Create a sequential mode
    let modelSection = GLOBALS.modelSection;
    this.modelDict = modelSection.parseLayers();

    let dataSection = GLOBALS.dataSection;

    for (let key in this.modelDict) {
      let num = this.modelDict[key].value;
      let activ = this.modelDict[key].activation;
      if (key == 'layer-1') {
        this.model.add(tf.layers.dense({ units: num, activation: activ, inputShape: [dataSection.inputCols.length] }));
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


    if (options_dict['shuffle']){
      let indices = [...Array(inputs.shape[0]).keys()];
      tf.util.shuffle(indices);
      inputs = inputs.gather(indices, 0);
      labels = labels.gather(indices, 0);
    }
    

    return await this.model.fit(inputs, labels, {
      batchSize,
      epochs,
      validationSplit:Number(document.getElementById("val-split").value),
      callbacks: 
      [tfvis.show.fitCallbacks({ name: 'Training Performance' }, tfvis_metrics, { height: 200, callbacks: ['onEpochEnd'] }),
      { onEpochEnd: this.testCallback },
      // { onTrainEnd: testModel },
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



}
