
const predictFile = document.getElementById('fileuploadPredict');


import GLOBALS from "./config.js";
import Dataset from "./ML/dataset.js";
import Model from "./ML/model.js";
import Autofill from "./AI/autofill.js";
import TrainOptionsSection from "./UI/trainOptionsSection.js";
import ModelSection from "./UI/modelSection.js";
import IntroSection from "./UI/introSection.js";
import Navigation from "./UI/navigation.js";
import DataSection from "./UI/dataSection.js";

GLOBALS.navigation = new Navigation();
GLOBALS.introSection = new IntroSection();
GLOBALS.autofill = new Autofill();
GLOBALS.dataset = new Dataset();
GLOBALS.dataSection = new DataSection('fileuploadTrain');
GLOBALS.modelSection = new ModelSection();
GLOBALS.model = new Model();
GLOBALS.trainOptionsSection = new TrainOptionsSection();

// document.getElementById("train").onclick = GLOBALS.model.test.bind(GLOBALS.model)

// async function test() {
//   const model = tf.sequential({
//     layers: [tf.layers.dense({ units: 1, inputShape: [10] })]
//   });
//   model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
//   for (let i = 1; i < 5; ++i) {
//     const h = await model.fit(tf.ones([8, 10]), tf.ones([8, 1]), {
//       batchSize: 4,
//       epochs: 3
//     });
//     console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
//   }
// }

// GLOBALS.model.test()


function preprocess_predict(array, train_data) {
  console.log(array.length)
  input_cols_predict = parse_text("features-predict")
  included_row_predict = included_rows(array.length, parse_text("row-exclude-predict"))

  return tf.tidy(() => {

    let data_matrix = tf.tensor2d(array, [array.length, array[0].length]).gather(included_row_predict, 0);
    let inputTensor = data_matrix.gather(input_cols_predict, 1)

    inputMax = train_data.max;
    inputMin = train_data.min;

    const normalizedPredict = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    normalizedPredict.print();

    return normalizedPredict

  });

}

function predict(predict_data) {

  return tf.tidy(() => {
    let pred = model.predict(predict_data);

    if (mode == "Classification") {
      pred = pred.argMax(1);
      // console.log(pred)
      //document.getElementById("console").appendChild(document.createTextNode("Accuracy: "+accuracy.toString())) 
    }
    console.log(pred.dataSync())
    return pred.dataSync()
  });

}

document.getElementById("preprocess-predict").addEventListener("click", () => {
  console.log("Start")
  console.log(data.length)
  predict_data = preprocess_predict(data, train_data);
  console.log(predict_data.shape)
});

document.getElementById("predict-button").addEventListener("click", () => {
  predictions = predict(predict_data);
});

function download_csv() {
  let csv = 'Preds\n';
  predictions.forEach(function (row) {
    // if(row.join == 'undefined')
    csv += row//.join(',');
    csv += "\n";
  });

  console.log(csv);
  let hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'predictions.csv';
  hiddenElement.click();
}

function testModel() {

  let inputs = test_data['inputs']
  let labels = test_data['labels'].squeeze()
  let results = [];

  tf.tidy(() => {
    const values = model.predict(inputs);

    if (mode == "Classification") {
      let pred = values.argMax(1);
      let result = pred.equal(labels.argMax(1));
      let accuracy = result.sum().dataSync()[0] / result.shape[0];
      //document.getElementById("console").appendChild(document.createTextNode("Accuracy: "+accuracy.toString()));
      document.getElementById("console").innerHTML = "Accuracy: " + accuracy.toString();
    } else if (mode == "Regression") {
      let error = tf.losses.meanSquaredError(labels, values.squeeze())
      // document.getElementById("console").appendChild(document.createTextNode("Error: "+ error.dataSync().toString()));
      document.getElementById("console").innerHTML = "Error: " + error.dataSync().toString();
    }

  });

}

// trainingFile.addEventListener("change", handleTrainFiles, false);
// predictFile.addEventListener("change", handlePredictFiles, false);



function show(shown, hidden) {
  document.getElementById(shown).style.display = 'block';
  document.getElementById(hidden).style.display = 'none';
}






async function download_model() {
  await model.save('downloads://my-model');
}

async function upload_model() {
  console.log($('fileuploadModelJson'))
  console.log(document.getElementById('fileuploadModelJson').files[0].name)

  const uploadJSONInput = document.getElementById('fileuploadModelJson');
  const uploadWeightsInput = document.getElementById('fileuploadModelBin');

  model = await tf.loadLayersModel(tf.io.browserFiles(
    [uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
}








