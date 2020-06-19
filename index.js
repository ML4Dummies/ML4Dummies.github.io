console.log('Hello TensorFlow');

const trainingFile = document.getElementById('fileuploadTrain');

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
  var data = results.data;
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

function preprocess(data){
    //Step 1. Shuffle the data
    tf.util.shuffle(data)
    
    //Step 2. Separate data into inputs and labels an put into tensors
    inputs = data.map(row => row.slice(0, -1));
    labels = data.map(row => row.slice(-1));
    const inputTensor = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

     //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
     const inputMax = inputTensor.max();
     const inputMin = inputTensor.min();  
     const labelMax = labelTensor.max();
     const labelMin = labelTensor.min();
 
     const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
     const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

}


trainingFile.addEventListener("change", handleFiles, false);
function handleFiles() {
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
      console.log("Done with all files");
    }
  });
  
  console.log(trainingFile);
}


