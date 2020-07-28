import GLOBALS from "../config.js";


export default class DataSection {

    constructor(file_id) {

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
        
        document.getElementById("preprocess").addEventListener("click", () => {
            this.getDataOptions();
            GLOBALS.dataset.preprocess();
            console.log("Done preprocessing")
            console.log(GLOBALS.dataset)
          });

        
    }

    parse() {
        // var file = this.data_element.files; 

        $('#fileuploadTrain').parse({
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

        for (let i = 1; i < data.length - 1; i++) {
            var row = data[i];
            var cells = row.map(Number);
            matrix.push(cells);
        }
        this.data = matrix
        //return matrix
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
        this.inputCols = this.parse_text("features")
        this.labelCols = this.parse_text("labels")
        this.includedRows = this.getIncludedRows(this.data.length, this.parse_text("row-exclude"))
        
        this.trainSplit = document.getElementById("train-split").value;
        this.testSplit = document.getElementById("test-split").value;
        this.valSplit = document.getElementById("val-split").value;
    }


}