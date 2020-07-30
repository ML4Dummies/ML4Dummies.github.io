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
        this.normalizedPredict = null;
        this.normalizedTest = null;
        this.trainLabels = null;
        this.testLabels = null;
    }   


    preprocessTrain(data, inputCols,  labelCols, includedRows, trainSplit, numClasses=null) {
        
        console.log("Preprocessing training data...")

        let inputTensor = this.filterData(data, inputCols, includedRows);
        let labelTensor = this.filterData(data, labelCols, includedRows, numClasses);
        

        let [trainData, testData] = this.trainTestSplit(inputTensor, trainSplit); //Features 
        let [trainLabels, testLabels] = this.trainTestSplit(labelTensor, trainSplit); // Labels

        
        this.trainMax = trainData.max(0)
        this.trainMin = trainData.min(0)

        this.normalizedTrain = this.normalize(trainData, this.trainMax, this.trainMin);
        this.normalizedTest = this.normalize(testData, this.trainMax, this.trainMin);
        this.trainLabels = trainLabels;
        this.testLabels = testLabels;

    }

    preprocessPredict(data, inputCols, includedRows, max, min){

        console.log("Preprocessing prediction data...")
        
        let inputTensor = this.filterData(data, inputCols, includedRows);
        this.normalizedPredict = this.normalize(inputTensor, max, min);
        
    }

    filterData(data, cols, includedRows, numClasses=null){

        let data_matrix = tf.tensor2d(data, [data.length, data[0].length]).gather(includedRows, 0); 
        let tensor = data_matrix.gather(cols, 1)

        if (numClasses!=null) { //Classification mode one-hot encoding

            tensor = tf.oneHot(tensor.squeeze().asType('int32'), numClasses)
        }

        return tensor

    }

    trainTestSplit(tensor, trainSplit=1){
        let size = tensor.shape[0]
        let trainSize = parseInt(size * trainSplit)
        let testSize = size-trainSize

        let trainData = tf.slice(tensor, 0, trainSize)
        let testData = tf.slice(tensor, trainSize, testSize)

        return [trainData, testData]
    }

    normalize(tensor, max, min){
        
        let normalized = tensor.sub(min).div(max.sub(min));
        return normalized;
    }

    




    

}