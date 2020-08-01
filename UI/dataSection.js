import GLOBALS from "../config.js";
import * as errorHandler from "./errorHandling.js";


export default class DataSection {

    constructor(file_id) {
        this.file_id = file_id
        this.data_element = document.getElementById(file_id);
        this.data_element.addEventListener("change", this.parse.bind(this), false);

        this.data = null
        this.inputCols = null
        this.labelCols = null
        this.numClasses = null
        this.excludeRows = null
        this.trainSplit = null
        this.valSplit = null
        this.testSplit = null
        this.fieldsList = [this.file_id, "features", "labels", "row-exclude", "num-classes",
            "train-split", "val-split"]
    }

    preprocess() {

        errorHandler.clearErrors(this.fieldsList);
        this.getDataOptions();
        if (GLOBALS.mode == 'Classification') {
            GLOBALS.dataset.preprocessTrain(this.data, this.inputCols, this.labelCols,
                this.includedRows, this.trainSplit, this.numClasses);
        }
        else {
            GLOBALS.dataset.preprocessTrain(this.data, this.inputCols, this.labelCols,
                this.includedRows, this.trainSplit);
        }
        console.log("Done preprocessing")
        console.log(GLOBALS.dataset)

    }

    parse() {
        // var file = this.data_element.files; 

        $('#' + this.file_id).parse({
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

    parse_text(id) {

        let string = document.getElementById(id).value
        var numbers = [];
        for (let match of string.split(",")) {
            if (match.includes("-")) {
                let [begin, end] = match.split("-");

                errorHandler.assertPositiveInteger(Number(begin), id);
                errorHandler.assertPositiveInteger(Number(end), id);

                for (let num = parseInt(begin); num <= parseInt(end); num++) {
                    numbers.push(num - 1);
                }

            } else {

                errorHandler.assertPositiveInteger(Number(match), id);
                numbers.push(parseInt(match) - 1);
            }
        }


        return numbers.sort();
    }


    getIncludedRows(id, num_rows, excludeRows) {
        let keepRows = []
        errorHandler.assertLessThan(excludeRows[excludeRows.length - 1], num_rows, id, "Excluded rows are out of dataset range")
        for (let i = 0; i < num_rows; i++) {
            if (excludeRows.indexOf(i) == -1)
                keepRows.push(i);
        }
        return keepRows
    }

    getDataOptions() {

        errorHandler.assertNotNull(this.data, this.file_id, "Upload your dataset file")

        this.inputCols = this.parse_text("features");
        errorHandler.assertLessThan(this.inputCols, this.data[0].length, "features", "Columns out of dataset range")
        this.labelCols = this.parse_text("labels");
        errorHandler.assertLessThan(this.labelCols, this.data[0].length, "labels", "Columns out of dataset range")

        this.includedRows = this.getIncludedRows("row-exclude", this.data.length, this.parse_text("row-exclude"));
        if (GLOBALS.mode == 'Classification') {
            this.numClasses = parseInt(document.getElementById("num-classes").value);
            errorHandler.assertPositiveInteger(this.numClasses, "num-classes");
        }

        this.trainSplit = document.getElementById("train-split").value;
        errorHandler.assertRangeInclusive(this.trainSplit, 0, 1, "train-split")

        // this.testSplit = document.getElementById("test-split").value;
        // errorHandler.assertRangeInclusive(this.testSplit, 0, 1, "test-split")

        this.valSplit = document.getElementById("val-split").value;
        errorHandler.assertRangeInclusive(this.valSplit, 0, 1, "val-split")

    }


}