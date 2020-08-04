import GLOBALS from "../config.js";


export default class TrainOptionsSection {

    constructor() {
        
        this.optimList=[
            [tf.train.adam,"Adam"],
            [tf.train.sgd,"Stochastic Gradient Descent"],
            // ['tf.train.momentum()',"Momentum"],
            [tf.train.adagrad,"Adagrad"],
            [tf.train.adadelta,"Adadelta"],
            [tf.train.adamax,"Adamax"],
            [tf.train.rmsprop,"RMSprop"]]
        
        this.lossClassificationList = [
            [tf.losses.softmaxCrossEntropy, "Softmax Cross Entropy"],
            [tf.losses.sigmoidCrossEntropy, "Sigmoid Cross Entropy"]];
        
        this.lossRegressionList= [
            [tf.losses.meanSquaredError,"Mean Squared Error"],
            [tf.losses.absoluteDifference, "Absolute Difference"],
            [tf.losses.computeWeightedLoss, "Compute Weighted Loss"],
            [tf.losses.cosineDistance, "Cosine Distance"],
            [tf.losses.hingeLoss, "Hinge Loss"],
            [tf.losses.huberLoss, "Huber Loss"],
            [tf.losses.logLoss, "Log Loss"]];

        this.options=["loss","optimizer","epochs","batch-size", "learning-rate"];
        
        this.lossOptions();
        this.optimOptions();

    }

    lossOptions(){
        
        let mode = GLOBALS.mode;

        let lossDiv = document.getElementById("lossDropdown");
        lossDiv.removeChild(lossDiv.firstChild);
        let lossSelect = document.createElement("select");
        lossSelect.id = "loss";
                               
        let lossList = mode == "Classification" ? this.lossClassificationList : this.lossRegressionList;
    
        for(let i = 0; i < lossList.length; i++){
            let lossVar = document.createElement("option");
            lossVar.value=i
            lossVar.text=lossList[i][1]
            lossSelect.add(lossVar)
        }
    
        lossDiv.appendChild(lossSelect)
    }
    
    
    optimOptions(){
   
        let optimDiv = document.getElementById("optimizerDropdown");
        let optimSelect = document.createElement("select");
        optimSelect.id = "optimizer";

        for(let i = 0; i < this.optimList.length; i++){
            let optimVar = document.createElement("option");
            optimVar.value=i;
            optimVar.text=this.optimList[i][1]
            optimSelect.add(optimVar)
        }

        optimDiv.appendChild(optimSelect)
    }

    get_train_options(){
        
        let dict={}
        
        for(let option of this.options){
          
          let optionDiv = document.getElementById(option);
        //   if(option==='shuffle'){
        //     dict[option] = optionDiv.checked;
        //   }
        //   else{
            dict[option] = optionDiv.value;
            // console.log(optionDiv.value);
        //   }
        }
        // console.log(dict)
       return dict
      }

}