var countLayer=0;
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
    var table = document.getElementById("model-table");
    var row = table.insertRow(layer_pos);
    var layer_num = row.insertCell(0);
    var num_neurons = row.insertCell(1);
    var activ = row.insertCell(2);

    layer_num.appendChild(document.createTextNode(name));

    var neuronNum = document.createElement("input");
    neuronNum.type = "text";
    neuronNum.name = "layer-" + name;
    neuronNum.id = "layer-" + name;
    neuronNum.disabled = disabled;
    num_neurons.appendChild(neuronNum)


    var activation = document.createElement("select");
    activation.type = "text";
    activation.name = "activ-" + name;
    activation.id = "activ-" + name;
    activation.disabled = disabled;
    
    var relu=document.createElement("option");
    relu.value="relu";
    relu.text="ReLu";
    activation.add(relu);
    
    var sigmoid=document.createElement("option");
    sigmoid.value="sigmoid";
    sigmoid.text="Sigmoid";
    activation.add(sigmoid);

    var softmax=document.createElement("option");
    softmax.value="softmax";
    softmax.text="Softmax";
    activation.add(softmax);

    var tanh = document.createElement("option");
    tanh.value="tanh"
    tanh.text="Tanh"
    activation.add(tanh);
        
    var linear = document.createElement("option");
    linear.value='linear'
    linear.text="Linear"
    activation.add(linear);

    activ.appendChild(activation)

   
}

document.getElementById("add-layer").addEventListener("click", () => {
    countLayer+=1;
    addLayer(countLayer, countLayer);
});

var radioClassification=document.getElementById('classification');
var radioRegression=document.getElementById('regression');

radioClassification.onclick = function() {
    document.getElementById("num-classes-prompt").style.display = "block";
    mode='Classification';
}

radioRegression.onclick = function() {
    document.getElementById("num-classes-prompt").style.display = "none";
    mode='Regression';
}


function parseLayers(){
    var layersInfo={}
    for(let i = 1; i<=countLayer; i++){
        var key="layer-"+i;
        console.log(key)
        var layerVal = parseInt(document.getElementById("layer-"+i).value);
        var layerAct = document.getElementById("activ-"+i).value;
        layersInfo[key] = {'value':layerVal, 'activation':layerAct};
    }

    var key="final";
    if (mode==='Classification'){
        
        var layerVal = parseInt(document.getElementById("num-classes").value);
        // var num_classes = layerVal;
        var layerAct = 'linear';//document.getElementById("").value;
        layersInfo[key] = {'value':layerVal, 'activation':layerAct};
    }
    else{
        // var labelCols=getLabelCols()
        var layerVal = label_cols.length;
        // var num_classes = layerVal;
        layersInfo[key] = {'value':layerVal, 'activation':'linear'};
    }

    return layersInfo
}


function lossOptions(){
    var lossDiv = document.getElementById("lossDropdown");
    lossDiv.removeChild(lossDiv.firstChild);
    var lossSelect = document.createElement("select");
    lossSelect.id = "loss";
                           
    lossList = mode == "Classification" ? lossClassificationList : lossRegressionList;

    for(let i = 0; i < lossList.length; i++){
        var lossVar = document.createElement("option");
        lossVar.value=i
        lossVar.text=lossList[i][1]
        lossSelect.add(lossVar)
    }

    lossDiv.appendChild(lossSelect)
}

function optimOptions(){
   
    var optimDiv = document.getElementById("optimizerDropdown");
    var optimSelect = document.createElement("select");
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
        var optimVar = document.createElement("option");
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
        for (var field in fields_dict){
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
        countLayer=3;
    }else{
        fields_dict = {"features":5, "labels":2, "row-exclude":1, "epochs":20, "batch-size":32, "learning-rate":0.002 }
        for (var field in fields_dict){
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
        countLayer=2;
    }
    
}



