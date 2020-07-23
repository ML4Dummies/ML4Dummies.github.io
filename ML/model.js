import GLOBALS from "../config.js"

export default class Model {

  constructor() {
    this.model = tf.sequential();
    this.modelDict = null;

    document.getElementById("create-model").onclick = this.createModel.bind(this);
    document.getElementById("train").onclick = this.trainModel.bind(this);
    
    // document.getElementById("download").onclick = this.trainModel.bind(this);
    this.stop_requested = false
    document.getElementById("stop").onclick = () => {this.stop_requested = true};
  }

  createModel() {

    // Create a sequential mode
    let modelSection = GLOBALS.modelSection;
    this.modelDict = modelSection.parseLayers();

    let dataset = GLOBALS.dataset;

    for (let key in this.modelDict) {
      let num = this.modelDict[key].value;
      let activ = this.modelDict[key].activation;
      if (key == 'layer-1') {
        this.model.add(tf.layers.dense({ units: num, activation: activ, inputShape: [dataset.inputCols.length] }));
      }
      else {
        this.model.add(tf.layers.dense({ units: num, activation: activ }));
      }
    }

    console.log('Model Summary:')
    this.model.summary()

  }


  trainModel() {
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

    return this.model.fit(inputs, labels, {
      batchSize,
      epochs
      //,
      // shuffle: options_dict['shuffle'],
      // validationSplit:Number(document.getElementById("val-split").value),
      // callbacks: 
      // [tfvis.show.fitCallbacks({ name: 'Training Performance' }, tfvis_metrics, { height: 200, callbacks: ['onEpochEnd'] }),
      // { onEpochEnd: this.testCallback },
      // // { onTrainEnd: testModel },
      // { onBatchEnd: () => this.model.stopTraining = stop_requested }]

    });
  }

  testCallback() {

  }

}
