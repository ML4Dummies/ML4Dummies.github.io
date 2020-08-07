import GLOBALS from "../config.js";
import * as errorHandler from "./errorHandling.js";
import * as parseUtils from "./parseUtils.js"


export default class PredictionSection {

    constructor(file_id) {
        this.file_id = file_id
        this.data_element = document.getElementById(file_id);
        this.data_element.addEventListener("change",() => {
          parseUtils.parse(this)
          parseUtils.updateUploadLabel(this.data_element) }, false);
        
        this.data=null
        this.inputCols=null
        this.labelCols=null
        this.numClasses=null
        this.excludeRows=null
        this.trainSplit=null
        this.valSplit=null
        this.testSplit=null
        this.predictions = null
        this.fieldsList = [this.file_id, "features-predict","row-exclude-predict"]
        
        
        document.getElementById("predict-button").addEventListener("click", () => {
            errorHandler.clearErrors(this.fieldsList);
            try {
                this.getDataOptions();
                GLOBALS.datasetPredict.preprocessPredict(this.data, this.inputCols, this.includedRows, GLOBALS.dataset.trainMax, GLOBALS.dataset.trainMin);
                console.log("Done preprocessing")
                this.predictions = GLOBALS.model.predict(GLOBALS.datasetPredict.normalizedPredict);
                this.download_csv()
            } catch(err) {
                console.log(err)
                document.getElementById(err.id + "-error").innerHTML = err.msg    
            }
            
          });
        
        // document.getElementById("download-predictions").addEventListener("click", () => {
        //     
        //   });
        
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

    // parse_text(id) {
    //     let string = document.getElementById(id).value
    //     let numbers = [];
    //     for (let match of string.split(",")) {
    //         if (match.includes("-")) {
    //             let [begin, end] = match.split("-");
    //             for (let num = parseInt(begin); num <= parseInt(end); num++) {
    //                 numbers.push(num - 1);
    //             }
    //         } else {
    //             numbers.push(parseInt(match) - 1);
    //         }
    //     }
    //     return numbers;
    // }

    // getIncludedRows(num_rows, excludeRows) {
    //     let keepRows = []
    //     for (let i = 0; i < num_rows; i++) {
    //         if (excludeRows.indexOf(i) == -1)
    //             keepRows.push(i);
    //     }
    //     return keepRows
    // }

    getDataOptions(){
        errorHandler.assertNotNull(this.data, this.file_id, "Upload your dataset file")
        this.inputCols = parseUtils.parse_text("features-predict")
        errorHandler.assertLessThan(this.inputCols, this.data[0].length, "features", "Columns out of dataset range")
        this.includedRows = parseUtils.getIncludedRows("row-exclude-predict", this.data.length, parseUtils.parse_text("row-exclude-predict"))
    }

}