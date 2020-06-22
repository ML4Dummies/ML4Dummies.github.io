console.log('Hello TensorFlow');

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
  // data = tf.data.array(matrix)
  //data.forEach(e => console.log(e));
  data = preprocess(matrix)
  //data.forEach(e => console.log(e));
  //console.log(data);
}

function preprocess(array){

  return tf.tidy(() => {
    //Step 1. Shuffle the data
    tf.util.shuffle(array)
    
    //Step 2. Separate data into inputs and labels an put into tensors
    inputs = array.map(row => row.slice(0, -1));
    labels = array.map(row => row.slice(-1));
    const inputTensor = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

     //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
     const inputMax = inputTensor.max();
     const inputMin = inputTensor.min();  
     const labelMax = labelTensor.max();
     const labelMin = labelTensor.min();
 
     const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
     const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

     return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  });
}

function createModel() {
  // Create a sequential model
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 250, activation: 'relu', inputShape: [8]}));
  model.add(tf.layers.dense({units: 175, activation: 'relu'}));
  model.add(tf.layers.dense({units: 150, activation: 'relu'}));
  model.add(tf.layers.dense({units: NUM_PITCH_CLASSES, activation: 'softmax'}));

  return model;
}

async function trainModel(){
  console.log("Training...")
  model=createModel();
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
  });

  const batchSize = 100;
  const epochs = 10;
  inputs=train_data['inputs']
  labels=train_data['labels']
  console.log( inputs )

  return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
      callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss','mse'], 
      { height: 200, callbacks: ['onEpochEnd'] }
      )
  });
}

function calcPitchClassEval(pitchIndex, classSize, values) {
  // Output has 7 different class values for each pitch, offset based on
  // which pitch class (ordered by i)
  let index = (pitchIndex * classSize * NUM_PITCH_CLASSES) + pitchIndex;
  let total = 0;
  for (let i = 0; i < classSize; i++) {
    total += values[index];
    index += NUM_PITCH_CLASSES;
  }
  return total / classSize;
}

function testModel(){
  console.log("Results")

  inputs=test_data['inputs']
  labels=test_data['labels']
  let results=[];
  tf.tidy(()=>{
    const values = model.predict(inputs).dataSync();
    const classSize = TEST_DATA_LENGTH / NUM_PITCH_CLASSES;
    for (let i = 0; i < NUM_PITCH_CLASSES; i++) {
      results.push(calcPitchClassEval(i, classSize, values))
    }
  });
  
  
  console.log(results)
}

trainingFile.addEventListener("change", handleTrainFiles, false);
testingFile.addEventListener("change", handleTestFiles, false)

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
      train_data=data
      console.log("Done with all files");
    }
  });
  
}
function handleTestFiles() {
  const file = this.files; /* now you can work with the file list */

$('#fileuploadTest').parse({
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
    console.log("Complete")
    test_data=data
    console.log("Done with all files");
  }
});

}
// module.exports = {trainModel}