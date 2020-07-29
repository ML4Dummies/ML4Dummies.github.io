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




    preprocess(data, inputCols, labelCols, includedRows, trainSplit, numClasses=null) {
        // this.data = GLOBALS.dataSection.data;
        // let array = data;
        // this.inputCols = GLOBALS.dataSection.inputCols;
        // this.labelCols = GLOBALS.dataSection.labelCols;
        // this.includedRows = GLOBALS.dataSection.includedRows;
        // this.numClasses = GLOBALS.dataSection.numClasses;
        // this.trainSplit = GLOBALS.dataSection.trainSplit;

        
        console.log("Entered!")
        // tf.tidy(() => {

        

        // let data_matrix = tf.tensor2d(array, [array.length, array[0].length]).gather(this.includedRows, 0);
        // let inputTensor = data_matrix.gather(this.inputCols, 1)
        // let labelTensor = data_matrix.gather(this.labelCols, 1)

        // if (mode == 'Classification') {
        //     this.numClasses = parseInt(document.getElementById("num-classes").value);
        //     labelTensor = tf.oneHot(labelTensor.squeeze().asType('int32'), this.numClasses)
        // }

        let [inputTensor, labelTensor] = this.filterData(data, inputCols, labelCols, includedRows, numClasses);

        // this.datasetSize = inputTensor.shape[0]
        // this.trainSize = parseInt(this.datasetSize * this.trainSplit)
        // this.testSize = this.datasetSize - this.trainSize

        // let trainData = tf.slice(inputTensor, 0, this.trainSize)
        // this.trainLabels = tf.slice(labelTensor, 0, this.trainSize)

        // let testData = tf.slice(inputTensor, this.trainSize, this.testSize)
        // this.testLabels = tf.slice(labelTensor, this.trainSize, this.testSize)

        let [trainData, trainLabels, testData, testLabels] = this.trainTestSplit(inputTensor, labelTensor, trainSplit);

        this.trainMax = trainData.max(0);
        this.trainMin = trainData.min(0);

        // this.normalizedTrain = trainData.sub(this.trainMin).div(this.trainMax.sub(this.trainMin));
        // this.normalizedTest = testData.sub(this.trainMin).div(this.trainMax.sub(this.trainMin));

        this.normalizedTrain = this.normalize(trainData, this.trainMax, this.trainMin);
        this.normalizedTest = this.normalize(testData, this.trainMax, this.trainMin);
        this.trainLabels = trainLabels;
        this.testLabels = testLabels;

       

        // });

    }

    trainTestSplit(inputTensor, labelTensor, trainSplit){
        let datasetSize = inputTensor.shape[0]
        let trainSize = parseInt(datasetSize * trainSplit)
        let testSize = datasetSize - trainSize

        let trainData = tf.slice(inputTensor, 0, trainSize)
        let trainLabels = tf.slice(labelTensor, 0, trainSize)

        let testData = tf.slice(inputTensor, trainSize, testSize)
        let testLabels = tf.slice(labelTensor, trainSize, testSize)

        return [trainData, trainLabels, testData, testLabels]
    }

    normalize(tensor, max, min){
        let normalized = tensor.sub(min).div(max.sub(min));
        return normalized;
    }

    filterData(data, inputCols, labelCols, includedRows, numClasses=null){

        // console.log(data);
        // tf.util.shuffle(data);
        
        
        let data_matrix = tf.tensor2d(data, [data.length, data[0].length]).gather(includedRows, 0);
        
        let inputTensor = data_matrix.gather(inputCols, 1)
        let labelTensor = data_matrix.gather(labelCols, 1)

        let mode = GLOBALS.mode

        if (mode == 'Classification') {
            labelTensor = tf.oneHot(labelTensor.squeeze().asType('int32'), numClasses)
        }

        return [inputTensor, labelTensor]

    }




    

}