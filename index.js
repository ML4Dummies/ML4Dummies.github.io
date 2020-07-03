TRAIN_SPLIT = 0.9
VAL_SPLIT = 0.1
TEST_SPLIT = 0.1


const trainingFile = document.getElementById('fileuploadTrain');
const testingFile = document.getElementById('fileuploadTest');

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
    data_matrix = tf.tensor2d(array, [array.length, array[0].length]).gather(included_row, axis = 0);
    const inputTensor = data_matrix.gather(input_cols, axis = 1)
    const labelTensor = data_matrix.gather(label_cols, axis = 1)
   
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
    var trainSize = parseInt(datasetSize*TRAIN_SPLIT)
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
              inputMax, inputMin, 
              // labelMin, labelMax
              },
            {inputs: normalizedTest, labels: testLabels}]
  });
}

document.getElementById("preprocess").addEventListener("click", () => {
  [train_data, test_data] = preprocess(data)
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

async function trainModel(){
  console.log("Training...")
  // model=createModel();

  if(mode==='Regression'){
    console.log(mode)
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse'],
    });
  }
  else{
    console.log(mode)
    model.compile({
      optimizer: tf.train.adam(),
      loss: 'sparseCategoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  const batchSize = 32;
  const epochs = 100;
  inputs=train_data['inputs']
  labels=train_data['labels']

  // inputs=tf.tensor2d([1,2,3,4,5],[5,1])
  // labels=tf.tensor2d([2,4,6,8,10],[5,1])

  inputs.print()
  labels.print()
  console.log(inputs.shape)
  console.log(labels.shape)

  return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
      //validationSplit: VAL_SPLIT,
      callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'], 
      { height: 200, callbacks: ['onEpochEnd'] }
      )
  });
}

function testModel(){

  inputs=test_data['inputs']
  labels=test_data['labels'].squeeze()
  let results=[];
  
  tf.tidy(()=>{
    const values = model.predict(inputs);
    pred=values.argMax(axis=1);
    result=pred.equal(labels);
    accuracy=result.sum().dataSync()[0]/result.shape[0];
    console.log("Accuracy:")
    document.getElementById("console").appendChild(document.createTextNode("Accuracy: "+accuracy.toString()));
  });
}

// function calcPitchClassEval(pitchIndex, classSize, values) {
//   // Output has 7 different class values for each pitch, offset based on
//   // which pitch class (ordered by i)
//   let index = (pitchIndex * classSize * num_classes) + pitchIndex;
//   let total = 0;
//   for (let i = 0; i < classSize; i++) {
//     total += values[index];
//     index += NUM_PITCH_CLASSES;
//   }
//   return total / classSize;
// }

// function testModel(){
//   console.log("Results")

//   inputs=test_data['inputs']
//   labels=test_data['labels']
//   let results=[];
//   tf.tidy(()=>{
//     const values = model.predict(inputs).dataSync();
//     const classSize = TEST_DATA_LENGTH / num_classes;
//     for (let i = 0; i < NUM_PITCH_CLASSES; i++) {
//       results.push(calcPitchClassEval(i, classSize, values))
//     }
//   });
  
  
//   console.log(results)
// }

trainingFile.addEventListener("change", handleTrainFiles, false);
//testingFile.addEventListener("change", handleTestFiles, false)

function handleTrainFiles() {
  const file = this.files; /* now you can work with the file list */
  
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
// function handleTestFiles() {
//   const file = this.files; /* now you can work with the file list */

// $('#fileuploadTest').parse({
//   config: {
//     delimiter: ",",
//     header:false, //Handled in the convertToMatrix
//     complete: load_dataset
//     //console.log//displayHTMLTable,
//   },
//   before: function(file, inputElem)
//   {
//     //console.log("Parsing file...", file);
//   },
//   error: function(err, file)
//   {
//     //console.log("ERROR:", err, file);
//   },
//   complete: function()
//   {
//     console.log("Complete")
//     test_data=data
//     console.log("Done with all files");
//   }
// });

// }
// module.exports = {trainModel}