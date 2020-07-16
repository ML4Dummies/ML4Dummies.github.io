train_split = 0.9
val_split = 0.1
test_split = 0.1

const NUM_PAGES = 6


var curr_page = 1;
const trainingFile = document.getElementById('fileuploadTrain');
const predictFile = document.getElementById('fileuploadPredict');

function displayHTMLTable(results){
	var table = "<table class='table'>";
	var data = results.data;
	 
	for(i=0;i<data.length;i++){
		table+= "<tr>";
		var row = data[i];
		var cells = row.join(",").split(",");
		 
		for(j=0;j<cells.length;j++){
			table+= "<td>";
			table+= cells[j];
			table+= "</th>";
		}
		table+= "</tr>";
	}
  table+= "</table>";
  console.log("test");
  document.querySelector('#console').innerHTML = table;
	// $("#parsed_csv_list").html(table);
}

function load_dataset(results){
  data = results.data;
  // console.log(data.length)
  var matrix=new Array();
  for(i=1;i<data.length-1;i++){
    var row = data[i];
    var cells = row.map(Number);
    //console.log(cells)
    matrix.push(cells);
  }

  data = matrix
  
}

function parse_text(id){
  raw_text = document.getElementById(id).value
  numbers = parse(raw_text)
  return numbers
}

function parse(string) {
  let numbers = [];
  for (let match of string.split(",")) {
      if (match.includes("-")) {
          let [begin, end] = match.split("-");
          for (let num = parseInt(begin); num <= parseInt(end); num++) {
              numbers.push(num-1);
          }
      } else {
          numbers.push(parseInt(match)-1);
      }
  }
  return numbers;
}

function included_rows(num_rows, excludeRows){
  let keepRows = []
  for (let i=0; i<num_rows;i++){
    if (excludeRows.indexOf(i)==-1)
     keepRows.push(i);
  }
  return keepRows
}  

function preprocess(array){

  input_cols = parse_text("features")
  label_cols = parse_text("labels")
  included_row = included_rows(array.length, parse_text("row-exclude"))
  
  return tf.tidy(() => {

    tf.util.shuffle(array);

    //Step 2. Separate data into inputs and labels an put into tensors
    var data_matrix = tf.tensor2d(array, [array.length, array[0].length]).gather(included_row, axis = 0);
    var inputTensor = data_matrix.gather(input_cols, axis = 1)
    var labelTensor = data_matrix.gather(label_cols, axis = 1)
    
    if(mode=='Classification'){
      var num_classes = parseInt(document.getElementById("num-classes").value);
      labelTensor=tf.oneHot(labelTensor.squeeze().asType('int32'),num_classes)
    }
    // exclusion_list = new Array()
    // for (let i=0; i<inputTensor.shape[0];i++){
    //   for (let j=0; j<inputTensor.shape[1];j++){
    //     if (!Number.isFinite(inputTensor.slice([i,j],[1,1]).dataSync()[0]) 
    //           && !Number.isFinite(labelTensor.slice([i,j],[1,1]).dataSync()[0])){
    //       exclusion_list.push(i);
    //       break;
    //     }
    //   }
    // }
    
    // included_row = included_rows(inputTensor.shape[0],exclusion_list)
    // const inputTensor = inputTensor.gather(included_row, axis = 0)
    // const labelTensor = labelTensor.gather(included_row, axis = 0)
    var datasetSize = inputTensor.shape[0]
    var trainSize = parseInt(datasetSize*train_split)
    var testSize = datasetSize - trainSize

    var trainData = tf.slice(inputTensor, 0, trainSize)
    var trainLabels = tf.slice(labelTensor, 0, trainSize)

    var testData = tf.slice(inputTensor, trainSize, testSize)
    var testLabels = tf.slice(labelTensor,  trainSize , testSize)
    

     //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
     const inputMax = trainData.max(axis=0);
     const inputMin = trainData.min(axis=0);  
    //  const labelMin = trainLabels.min(axis=0);  
    //  const labelMax = trainLabels.max(axis=0);  

    //  const inputMin = tf.tensor1d([-18.885, -152.463, -15.5146078412997, -48.0287647107959, 9.397, -49.339, 59, 0])
    //  const inputMax = tf.tensor1d([18.065, -86.374,  9.974, 30.592, 49.18, 2.95522851438373, 104.4, 1])
    //  console.log(inputMax.dataSync())
    //  console.log(inputMin.dataSync())
 
     const normalizedTrain = trainData.sub(inputMin).div(inputMax.sub(inputMin));
    //  const normalizedTrainLabels = trainLabels.sub(labelMin).div(labelMax.sub(labelMin));

     const normalizedTest = testData.sub(inputMin).div(inputMax.sub(inputMin));
    //  const normalizedTestLabels = testLabels.sub(labelMin).div(labelMax.sub(labelMin));     

     return [{inputs: normalizedTrain, 
              labels: trainLabels, 
              max: inputMax,
              min: inputMin
              // labelMin, labelMax
              },
            {inputs: normalizedTest, labels: testLabels}]
  });
}

function preprocess_predict(array, train_data){
  console.log(array.length)  
  input_cols_predict = parse_text("features-predict")
  included_row_predict = included_rows(array.length, parse_text("row-exclude-predict"))
  
  return tf.tidy(() => {

    var data_matrix = tf.tensor2d(array, [array.length, array[0].length]).gather(included_row_predict, axis = 0);
    var inputTensor = data_matrix.gather(input_cols_predict, axis = 1)

    inputMax= train_data.max;
    inputMin= train_data.min;
    
    const normalizedPredict = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    normalizedPredict.print();
    
    return normalizedPredict
  
  });

}

function predict(predict_data){
  
  return tf.tidy(()=>{
    var pred = model.predict(predict_data);
   
    if (mode == "Classification"){
      pred=pred.argMax(axis=1);
      // console.log(pred)
      //document.getElementById("console").appendChild(document.createTextNode("Accuracy: "+accuracy.toString())) 
    }
    console.log(pred.dataSync())
    return pred.dataSync()
  });

}

document.getElementById("preprocess").addEventListener("click", () => {
  train_split=document.getElementById("train-split").value;
  test_split=document.getElementById("test-split").value;
  val_split=document.getElementById("val-split").value;

  [train_data, test_data] = preprocess(data);

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
  var csv = 'Preds\n';
  predictions.forEach(function(row) {
    // if(row.join == 'undefined')
          csv += row//.join(',');
          csv += "\n";
  });

  console.log(csv);
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'predictions.csv';
  hiddenElement.click();
}


let stop_requested = false;
var stop_training = document.getElementById('stop-train');
stop_training.addEventListener('click', () => {
    stop_requested = true;
  });


function createModel() {
  // Create a sequential model
  let modelDict=parseLayers()
  model = tf.sequential();
  for(let key in modelDict){
    let num = modelDict[key].value;
    let activ = modelDict[key].activation;
    if(key=='layer-1'){
      model.add(tf.layers.dense({units: num, activation: activ, inputShape: [input_cols.length]}));
    }
    else{
      model.add(tf.layers.dense({units: num, activation: activ}));
    }
  }

  console.log('Model Summary:')
  model.summary()
  // const model = tf.sequential();
  // model.add(tf.layers.dense({units: 250, activation: 'relu', inputShape: [8]}));
  // model.add(tf.layers.dense({units: 175, activation: 'relu'}));
  // model.add(tf.layers.dense({units: 150, activation: 'relu'}));
  //model.add(tf.layers.dense({units: NUM_PITCH_CLASSES, activation: 'softmax'}));

  // return model;
}

function get_train_options(){
  options=["loss","optimizer","epochs","batch-size","shuffle", "learning-rate"];
  dict={}
  
  for(option of options){
    var optionDiv = document.getElementById(option);
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
  var options_dict=get_train_options()
  var learningRate = Number(options_dict["learning-rate"]);
  
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
  var inputs=train_data['inputs']
  var labels=train_data['labels']

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

  var inputs=test_data['inputs']
  var labels=test_data['labels'].squeeze()
  var results=[];
  
  tf.tidy(()=>{
    const values = model.predict(inputs);

    if (mode == "Classification"){
      var pred=values.argMax(axis=1);
      var result=pred.equal(labels.argMax(axis=1));
      var accuracy=result.sum().dataSync()[0]/result.shape[0];
      //document.getElementById("console").appendChild(document.createTextNode("Accuracy: "+accuracy.toString()));
      document.getElementById("console").innerHTML = "Accuracy: "+accuracy.toString();
    } else if (mode == "Regression"){
      var error = tf.losses.meanSquaredError(labels, values.squeeze())
      // document.getElementById("console").appendChild(document.createTextNode("Error: "+ error.dataSync().toString()));
      document.getElementById("console").innerHTML = "Error: "+error.dataSync().toString();
    }
    
  });

}


trainingFile.addEventListener("change", handleTrainFiles, false);
predictFile.addEventListener("change", handlePredictFiles, false);

function handleTrainFiles() {
  var file = this.files; /* now you can work with the file list */
  
  $('#fileuploadTrain').parse({
    config: {
      delimiter: ",",
      header:false, //Handled in the convertToMatrix
      complete: load_dataset
      //console.log//displayHTMLTable,
    },
    before: function(file, inputElem)
    {
      //console.log("Parsing file...", file);
    },
    error: function(err, file)
    {
      //console.log("ERROR:", err, file);
    },
    complete: function()
    {
      // train_data=data
      // console.log("Done with all files");
    }
  });
  
}

function handlePredictFiles() {
  var file = this.files; /* now you can work with the file list */

  $('#fileuploadPredict').parse({
    config: {
      delimiter: ",",
      header:false, //Handled in the convertToMatrix
      complete: load_dataset
      //console.log//displayHTMLTable,
    },
    before: function(file, inputElem)
    {
      //console.log("Parsing file...", file);
    },
    error: function(err, file)
    {
      //console.log("ERROR:", err, file);
    },
    complete: function()
    {
      console.log(data.length)
      console.log("Complete")
    }
});

}

function show(shown, hidden) {
  document.getElementById(shown).style.display='block';
  document.getElementById(hidden).style.display='none';
}

function next_page(){
  

  if(curr_page < NUM_PAGES){
    curr_page++
    // page_operations(curr_page)
    document.getElementById("Page"+String(curr_page)).style.display='flex';
    document.getElementById("Page"+String(curr_page - 1)).style.display='none';
  }
  if(curr_page != 1) document.getElementById("back").style.display='inline';
  if (curr_page == NUM_PAGES) document.getElementById("next").style.display='none';

  update_page(curr_page);

}

function update_page(page_num){
  switch(page_num){
    case 3:
      console.log(countLayer);
      if (document.getElementById('layer-final') == null) {
        addLayer(countLayer+1, "final", disabled=true)
      }
      break;
    case 4:
      lossOptions();
      break;
  }

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

function prev_page(){
  if(curr_page > 1){
    curr_page--;
    // page_operations(curr_page)
    document.getElementById("Page"+String(curr_page)).style.display='flex';
    document.getElementById("Page"+String(curr_page + 1)).style.display='none';
  }
  if(curr_page == 1) document.getElementById("back").style.display='none';
  if (curr_page != NUM_PAGES) document.getElementById("next").style.display='inline';
}

// functions page_operations(page){

//   switch(page){
//     case "Page1":

//   }

// }

