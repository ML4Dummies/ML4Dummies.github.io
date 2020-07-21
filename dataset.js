export default class Dataset {

    constructor(data_element) {
        this.data_element = data_element
        this.data_element.addEventListener("change", this.parse.bind(this), false);
        this.data = null;
        this.input_cols = null;
        this.label_cols = null;
        this.included_row = null;
        this.num_classes = null;
        this.datasetSize = null;
        this.trainSize = null;
        this.testSize - null;
        this.train_split = null;
        this.test_split = null;
        this.val_split = null;
        this.trainMin = null;
        this.trainMax = null;
        this.normalizedTrain = null;
        this.normalizedTest = null;
        this.trainLabels = null;
        this.testLabels = null;
    }

    parse() {
        // var file = this.data_element.files; 

        $('#fileuploadTrain').parse({
            config: {
                delimiter: ",",
                header: false,
                complete: this.load_dataset.bind(this)
            },
            // before: function(file, inputElem)
            // {
            // console.log("Parsing file...", file);
            // },
            // error: function(err, file)
            // {
            // console.log("ERROR:", err, file);
            // },
            // complete: function()
            // {
            // console.log("Data length: " + data.length)
            // console.log("Complete")
            // }
        })
    }


    load_dataset(results) {
        var data = results.data;
        var matrix = new Array();

        for (let i = 1; i < data.length - 1; i++) {
            var row = data[i];
            var cells = row.map(Number);
            matrix.push(cells);
        }
        this.data = matrix
        //return matrix
    }

    preprocess() {
        let array = this.data;
        this.input_cols = this.parse_text("features")
        this.label_cols = this.parse_text("labels")
        this.included_row = this.included_rows(array.length, this.parse_text("row-exclude"))

        tf.tidy(() => {

            tf.util.shuffle(array);

            let data_matrix = tf.tensor2d(array, [array.length, array[0].length]).gather(this.included_row, 0);
            let inputTensor = data_matrix.gather(this.input_cols, 1)
            let labelTensor = data_matrix.gather(this.label_cols, 1)

            if (mode == 'Classification') {
                this.num_classes = parseInt(document.getElementById("num-classes").value);
                labelTensor = tf.oneHot(labelTensor.squeeze().asType('int32'), this.num_classes)
            }

            this.datasetSize = inputTensor.shape[0]
            this.trainSize = parseInt(this.datasetSize * this.train_split)
            this.testSize = this.datasetSize - this.trainSize

            let trainData = tf.slice(inputTensor, 0, this.trainSize)
            this.trainLabels = tf.slice(labelTensor, 0, this.trainSize)

            let testData = tf.slice(inputTensor, this.trainSize, this.testSize)
            this.testLabels = tf.slice(labelTensor, this.trainSize, this.testSize)

            this.trainMax = trainData.max(0);
            this.trainMin = trainData.min(0);

            this.normalizedTrain = trainData.sub(this.trainMin).div(this.trainMax.sub(this.trainMin));
            this.normalizedTest = testData.sub(this.trainMin).div(this.trainMax.sub(this.trainMin));

        });

        console.log("start", this.input_cols,
            this.label_cols,
            this.included_row,
            this.num_classes,
            this.datasetSize,
            this.train_split,
            this.test_split,
            this.val_split, "end")
    }


    parse_text(id) {
        let string = document.getElementById(id).value
        let numbers = [];
        for (let match of string.split(",")) {
            if (match.includes("-")) {
                let [begin, end] = match.split("-");
                for (let num = parseInt(begin); num <= parseInt(end); num++) {
                    numbers.push(num - 1);
                }
            } else {
                numbers.push(parseInt(match) - 1);
            }
        }
        return numbers;
    }

    
    included_rows(num_rows, excludeRows){
        let keepRows = []
        for (let i=0; i<num_rows;i++){
          if (excludeRows.indexOf(i)==-1)
           keepRows.push(i);
        }
        return keepRows
    }  

}