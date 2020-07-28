import GLOBALS from "../config.js"
export default class Dataset {

    constructor() {

        this.data = null;
        this.inputCols = null;
        this.labelCols = null;
        this.includedRows = null;
        this.numClasses = null;
        this.datasetSize = null;
        this.trainSize = null;
        this.testSize - null;
        this.trainSplit = null;
        this.trainMin = null;
        this.trainMax = null;
        this.normalizedTrain = null;
        this.normalizedTest = null;
        this.trainLabels = null;
        this.testLabels = null;
    }   


    preprocess() {
        this.data = GLOBALS.dataSection.data;
        let array = this.data;
        this.inputCols = GLOBALS.dataSection.inputCols
        this.labelCols = GLOBALS.dataSection.labelCols
        this.includedRows = GLOBALS.dataSection.includedRows
        this.trainSplit = GLOBALS.dataSection.trainSplit

        let mode = GLOBALS.mode
        console.log("Entered!")
        // tf.tidy(() => {

        tf.util.shuffle(array);

        let data_matrix = tf.tensor2d(array, [array.length, array[0].length]).gather(this.includedRows, 0);
        let inputTensor = data_matrix.gather(this.inputCols, 1)
        let labelTensor = data_matrix.gather(this.labelCols, 1)

        if (mode == 'Classification') {
            this.numClasses = parseInt(document.getElementById("num-classes").value);
            labelTensor = tf.oneHot(labelTensor.squeeze().asType('int32'), this.numClasses)
        }

        this.datasetSize = inputTensor.shape[0]
        this.trainSize = parseInt(this.datasetSize * this.trainSplit)
        this.testSize = this.datasetSize - this.trainSize

        let trainData = tf.slice(inputTensor, 0, this.trainSize)
        this.trainLabels = tf.slice(labelTensor, 0, this.trainSize)

        let testData = tf.slice(inputTensor, this.trainSize, this.testSize)
        this.testLabels = tf.slice(labelTensor, this.trainSize, this.testSize)

        this.trainMax = trainData.max(0);
        this.trainMin = trainData.min(0);

        this.normalizedTrain = trainData.sub(this.trainMin).div(this.trainMax.sub(this.trainMin));
        this.normalizedTest = testData.sub(this.trainMin).div(this.trainMax.sub(this.trainMin));

        // });

    }


    

}