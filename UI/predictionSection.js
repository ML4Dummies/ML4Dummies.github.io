import GLOBALS from "../config.js";


export default class PredictionSection {

    constructor(file_id) {
        this.file_id = file_id
        this.data_element = document.getElementById(file_id);
        this.data_element.addEventListener("change", this.parse.bind(this), false);
        
        this.data=null
        this.inputCols=null
        this.labelCols=null
        this.numClasses=null
        this.excludeRows=null
        this.trainSplit=null
        this.valSplit=null
        this.testSplit=null
        this.predictions = null
        
        document.getElementById("preprocess-predict").addEventListener("click", () => {
            this.getDataOptions();
            GLOBALS.datasetPredict.preprocessPredict(this.data, this.inputCols, this.includedRows, GLOBALS.dataset.trainMax, GLOBALS.dataset.trainMin);
            console.log("Done preprocessing")
          });
        
        document.getElementById("predict-button").addEventListener("click", () => {
            this.predictions = GLOBALS.model.predict(GLOBALS.datasetPredict.normalizedPredict);
          });
        
        document.getElementById("download-predictions").addEventListener("click", () => {
            this.download_csv()
          });
        
    }

    parse() {
        // var file = this.data_element.files; 

        $('#'+this.file_id).parse({
            config: {
                delimiter: ",",
                header: false,
                complete: this.load_dataset.bind(this)
            },
        })
    }

    load_dataset(results) {
        var data = results.data;
        var matrix = new Array();

        for (let i = 0; i < data.length - 1; i++) {
            var row = data[i];
            var cells = row.map(Number);
            matrix.push(cells);
        }
        this.data = matrix
        //return matrix
    }

    download_csv() {
        let csv = 'Preds\n';
        this.predictions.forEach(function (row) {
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

    getIncludedRows(num_rows, excludeRows) {
        let keepRows = []
        for (let i = 0; i < num_rows; i++) {
            if (excludeRows.indexOf(i) == -1)
                keepRows.push(i);
        }
        return keepRows
    }

    getDataOptions(){
        this.inputCols = this.parse_text("features-predict")
        this.includedRows = this.getIncludedRows(this.data.length, this.parse_text("row-exclude-predict"))
    }

}