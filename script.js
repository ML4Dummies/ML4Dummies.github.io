let countLayer=0;
mode='Classification'
optimList=[
    [tf.train.adam,"Adam"],
    [tf.train.sgd,"Stochastic Gradient Descent"],
    // ['tf.train.momentum()',"Momentum"],
    [tf.train.adagrad,"Adagrad"],
    [tf.train.adadelta,"Adadelta"],
    [tf.train.adamax,"Adamax"],
    [tf.train.rmsprop,"RMSprop"]]

lossClassificationList = [
    [tf.losses.softmaxCrossEntropy, "Softmax Cross Entropy"],
    [tf.losses.sigmoidCrossEntropy, "Sigmoid Cross Entropy"]];

lossRegressionList= [
    [tf.losses.meanSquaredError,"Mean Squared Error"],
    [tf.losses.absoluteDifference, "Absolute Difference"],
    [tf.losses.computeWeightedLoss, "Compute Weighted Loss"],
    [tf.losses.cosineDistance, "Cosine Distance"],
    [tf.losses.hingeLoss, "Hinge Loss"],
    [tf.losses.huberLoss, "Huber Loss"],
    [tf.losses.logLoss, "Log Loss"]];


function addLayer(layer_pos, name, disabled=false){
    //countLayer+=1;
    // Number of inputs to create
    //var number = 0;//document.getElementById("member").value;
    // Container <div> where dynamic content will be placed
    // var container = document.getElementById("layer-customize");
    let table = document.getElementById("model-table");
    let row = table.insertRow(layer_pos);
    let layer_num = row.insertCell(0);
    let num_neurons = row.insertCell(1);
    let activ = row.insertCell(2);

    layer_num.appendChild(document.createTextNode(name));

    let neuronNum = document.createElement("input");
    neuronNum.type = "text";
    neuronNum.name = "layer-" + name;
    neuronNum.id = "layer-" + name;
    neuronNum.disabled = disabled;
    num_neurons.appendChild(neuronNum)


    let activation = document.createElement("select");
    activation.type = "text";
    activation.name = "activ-" + name;
    activation.id = "activ-" + name;
    activation.disabled = disabled;
    
    let relu=document.createElement("option");
    relu.value="relu";
    relu.text="ReLu";
    activation.add(relu);
    
    let sigmoid=document.createElement("option");
    sigmoid.value="sigmoid";
    sigmoid.text="Sigmoid";
    activation.add(sigmoid);

    let softmax=document.createElement("option");
    softmax.value="softmax";
    softmax.text="Softmax";
    activation.add(softmax);

    let tanh = document.createElement("option");
    tanh.value="tanh"
    tanh.text="Tanh"
    activation.add(tanh);
        
    let linear = document.createElement("option");
    linear.value='linear'
    linear.text="Linear"
    activation.add(linear);

    activ.appendChild(activation)

   
}

document.getElementById("add-layer").addEventListener("click", () => {
    countLayer+=1;
    addLayer(countLayer, countLayer);
});

let radioClassification=document.getElementById('classification');
let radioRegression=document.getElementById('regression');

radioClassification.onclick = function() {
    document.getElementById("num-classes-prompt").style.display = "block";
    mode='Classification';
}

radioRegression.onclick = function() {
    document.getElementById("num-classes-prompt").style.display = "none";
    mode='Regression';
}


function parseLayers(){
    let layersInfo={}
    for(let i = 1; i<=countLayer; i++){
        let key="layer-"+i;
        console.log(key)
        let layerVal = parseInt(document.getElementById("layer-"+i).value);
        let layerAct = document.getElementById("activ-"+i).value;
        layersInfo[key] = {'value':layerVal, 'activation':layerAct};
    }

    let key="final";
    if (mode==='Classification'){
        
        let layerVal = parseInt(document.getElementById("num-classes").value);
        // let num_classes = layerVal;
        let layerAct = 'linear';//document.getElementById("").value;
        layersInfo[key] = {'value':layerVal, 'activation':layerAct};
    }
    else{
        // let labelCols=getLabelCols()
        let layerVal = label_cols.length;
        // let num_classes = layerVal;
        layersInfo[key] = {'value':layerVal, 'activation':'linear'};
    }

    return layersInfo
}


function lossOptions(){
    let lossDiv = document.getElementById("lossDropdown");
    lossDiv.removeChild(lossDiv.firstChild);
    let lossSelect = document.createElement("select");
    lossSelect.id = "loss";
                           
    lossList = mode == "Classification" ? lossClassificationList : lossRegressionList;

    for(let i = 0; i < lossList.length; i++){
        let lossVar = document.createElement("option");
        lossVar.value=i
        lossVar.text=lossList[i][1]
        lossSelect.add(lossVar)
    }

    lossDiv.appendChild(lossSelect)
}

function optimOptions(){
   
    let optimDiv = document.getElementById("optimizerDropdown");
    let optimSelect = document.createElement("select");
    optimSelect.id = "optimizer";

    // var optimList=[
    //     [tf.train.sgd,"Stochastic Gradient Descent"],
    //     // ['tf.train.momentum()',"Momentum"],
    //     [tf.train.adagrad,"Adagrad"],
    //     [tf.train.adadelta,"Adadelta"],
    //     [tf.train.adam,"Adam"],
    //     [tf.train.adamax,"Adamax"],
    //     [tf.train.rmsprop,"RMSprop"]]

    

    for(let i = 0; i < optimList.length; i++){
        let optimVar = document.createElement("option");
        optimVar.value=i;
        optimVar.text=optimList[i][1]
        optimSelect.add(optimVar)
    }

    optimDiv.appendChild(optimSelect)
}

function start(){
    lossOptions();
    optimOptions();
}

function autofill(){

    if (mode == "Classification"){
        fields_dict = {"features":"1-8", "labels":9,"num-classes":7, "row-exclude":1, "epochs":20, "batch-size":32, "learning-rate":0.002 }
        for (let field in fields_dict){
            document.getElementById(field).value = fields_dict[field];
        }
        addLayer(1, 1);
        addLayer(2, 2);
        addLayer(3, 3);
        addLayer(4, "final", true);
        document.getElementById("layer-1").value = 250;
        document.getElementById("layer-2").value = 175;
        document.getElementById("layer-3").value = 150;
        document.getElementById("layer-final").value = 7;
        document.getElementById("activ-1").value = "relu";
        document.getElementById("activ-2").value = "relu";
        document.getElementById("activ-3").value = "relu";
        document.getElementById("activ-final").value = "linear";
        document.getElementById("train-split").value = 0.9;
        document.getElementById("test-split").value = 0.1;
        document.getElementById("val-split").value = 0.1;
        countLayer=3;
        
    }else{
        fields_dict = {"features":5, "labels":2, "row-exclude":1, "epochs":20, "batch-size":32, "learning-rate":0.002 }
        for (let field in fields_dict){
            document.getElementById(field).value = fields_dict[field];
        }
        addLayer(1, 1);
        addLayer(2, 2);
        addLayer(3, "final", true);
        document.getElementById("layer-1").value = 100;
        document.getElementById("layer-2").value = 100;
        document.getElementById("layer-final").value = 1;
        document.getElementById("activ-1").value = "sigmoid";
        document.getElementById("activ-2").value = "sigmoid";
        document.getElementById("activ-final").value = "linear";
        document.getElementById("train-split").value = 0.9;
        document.getElementById("test-split").value = 0.1;
        document.getElementById("val-split").value = 0.1;
        countLayer=2;
    }
    
}



