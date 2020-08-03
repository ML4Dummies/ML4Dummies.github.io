import GLOBALS from "../config.js";
import * as errorHandler from "./errorHandling.js";
import * as parseUtils from "./parseUtils.js"


export default class DataSection {

    constructor(file_id) {
        this.file_id = file_id
        this.data_element = document.getElementById(file_id);
        this.data_element.addEventListener("change",() => parseUtils.parse(this) , false);

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


    getDataOptions() {

        errorHandler.assertNotNull(this.data, this.file_id, "Upload your dataset file")

        this.inputCols = parseUtils.parse_text("features");
        errorHandler.assertLessThan(this.inputCols, this.data[0].length, "features", "Columns out of dataset range")
        this.labelCols = parseUtils.parse_text("labels");
        errorHandler.assertLessThan(this.labelCols, this.data[0].length, "labels", "Columns out of dataset range")

        this.includedRows = parseUtils.getIncludedRows("row-exclude", this.data.length, parseUtils.parse_text("row-exclude"));
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