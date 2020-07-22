
const predictFile = document.getElementById('fileuploadPredict');


import GLOBALS from "./config.js";
import Dataset from "./dataset.js";
import Model from "./ML/model.js";
import Autofill from "./AI/autofill.js";
import TrainOptionsSection from "./UI/trainOptionsSection.js";
import ModelSection from "./UI/modelSection.js";
import IntroSection from "./UI/introSection.js";
import Navigation from "./UI/navigation.js";



GLOBALS.model = new Model();
GLOBALS.dataset = new Dataset('fileuploadTrain');
GLOBALS.modelSection = new ModelSection();
GLOBALS.autofill = new Autofill();
GLOBALS.trainOptionsSection = new TrainOptionsSection()
GLOBALS.introSection = new IntroSection();
GLOBALS.navigation = new Navigation();



function preprocess_predict(array, train_data){
  console.log(array.length)  
  input_cols_predict = parse_text("features-predict")
  included_row_predict = included_rows(array.length, parse_text("row-exclude-predict"))
  
  return tf.tidy(() => {

    let data_matrix = tf.tensor2d(array, [array.length, array[0].length]).gather(included_row_predict,0);
    let inputTensor = data_matrix.gather(input_cols_predict, 1)

    inputMax= train_data.max;
    inputMin= train_data.min;
    
    const normalizedPredict = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    normalizedPredict.print();
    
    return normalizedPredict
  
  });

}

function predict(predict_data){
  
  return tf.tidy(()=>{
    let pred = model.predict(predict_data);
   
    if (mode == "Classification"){
      pred=pred.argMax(1);
      // console.log(pred)
      //document.getElementById("console").appendChild(document.createTextNode("Accuracy: "+accuracy.toString())) 
    }
    console.log(pred.dataSync())
    return pred.dataSync()
  });

}

document.getElementById("preprocess").addEventListener("click", () => {
  GLOBALS.dataset.train_split=document.getElementById("train-split").value;
  GLOBALS.dataset.test_split=document.getElementById("test-split").value;
  GLOBALS.dataset.val_split=document.getElementById("val-split").value;
  GLOBALS.dataset.preprocess();
  console.log(GLOBALS.dataset.normalizedTrain)
  });

document.getElementById("preprocess-predict").addEventListener("click", () => {
  console.log("Start")
  console.log(data.length)  
  predict_data = preprocess_predict(data,train_data);
  console.log(predict_data.shape)
});

document.getElementById("predict-button").addEventListener("click", () => {
  predictions = predict(predict_data);
});

function download_csv() {
  let csv = 'Preds\n';
  predictions.forEach(function(row) {
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


let stop_requested = false;
let stop_training = document.getElementById('stop-train');
stop_training.addEventListener('click', () => {
    stop_requested = true;
  });




function get_train_options(){
  options=["loss","optimizer","epochs","batch-size","shuffle", "learning-rate"];
  dict={}
  
  for(option of options){
    let optionDiv = document.getElementById(option);
    if(option==='shuffle'){
      dict[option] = optionDiv.checked;
    }
    else{
      dict[option] = optionDiv.value;
      console.log(optionDiv.value);
    }
  }
  console.log(dict)
 return dict
}

async function trainModel(){
  stop_requested = false;
  let options_dict=get_train_options()
  let learningRate = Number(options_dict["learning-rate"]);
  
  console.log("Training...")
  // model=createModel();
  if(mode=="Regression"){
    var loss_ =  lossRegressionList[Number(options_dict['loss'])][0];
    var metrics_ = ['mse'];
    var tfvis_metrics = ['loss', "val_loss"];
  } else{
    var loss_ = lossClassificationList[Number(options_dict['loss'])][0];
    var metrics_ = ['accuracy'];
    var tfvis_metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
  }


  model.compile({
    optimizer: optimList[Number(options_dict['optimizer'])][0](learningRate),
    loss: loss_,
    metrics: metrics_,
  });

  const batchSize = Number(options_dict['batch-size']);
  const epochs = Number(options_dict['epochs']);
  let inputs=train_data['inputs']
  let labels=train_data['labels']

  return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: options_dict['shuffle'],
      validationSplit: val_split,
      callbacks: [tfvis.show.fitCallbacks({ name: 'Training Performance' }, tfvis_metrics, { height: 200, callbacks: ['onEpochEnd'] }),
                  {onEpochEnd: testCallback},
                  {onTrainEnd: testModel},
                  {onBatchEnd: () => model.stopTraining = stop_requested}]
 
  });


  // return await model.fit(inputs, labels, {
  //   batchSize,
  //   epochs,
  //   shuffle: true,
  //   //validationSplit: val_split,
  //   callbacks: {
  //     onEpochEnd: (epoch, logs) => {
  //       const values = model.predict(inputs);
  //       console.log("Our loss: ", tf.losses.meanSquaredError(labels.squeeze(), values.squeeze()).dataSync());
  //       console.log("Actual loss: ", logs.loss)
  //     }
  //   }
// });

}

function testCallback(){
}

function testModel(){

  let inputs=test_data['inputs']
  let labels=test_data['labels'].squeeze()
  let results=[];
  
  tf.tidy(()=>{
    const values = model.predict(inputs);

    if (mode == "Classification"){
      let pred=values.argMax(1);
      let result=pred.equal(labels.argMax(1));
      let accuracy=result.sum().dataSync()[0]/result.shape[0];
      //document.getElementById("console").appendChild(document.createTextNode("Accuracy: "+accuracy.toString()));
      document.getElementById("console").innerHTML = "Accuracy: "+accuracy.toString();
    } else if (mode == "Regression"){
      let error = tf.losses.meanSquaredError(labels, values.squeeze())
      // document.getElementById("console").appendChild(document.createTextNode("Error: "+ error.dataSync().toString()));
      document.getElementById("console").innerHTML = "Error: "+error.dataSync().toString();
    }
    
  });

}




// trainingFile.addEventListener("change", handleTrainFiles, false);
// predictFile.addEventListener("change", handlePredictFiles, false);



function show(shown, hidden) {
  document.getElementById(shown).style.display='block';
  document.getElementById(hidden).style.display='none';
}






async function download_model(){
  await model.save('downloads://my-model');
}

async function upload_model(){
  console.log($('fileuploadModelJson'))
  console.log(document.getElementById('fileuploadModelJson').files[0].name)

  const uploadJSONInput = document.getElementById('fileuploadModelJson');
  const uploadWeightsInput = document.getElementById('fileuploadModelBin');

  model = await tf.loadLayersModel(tf.io.browserFiles(
     [uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
}








