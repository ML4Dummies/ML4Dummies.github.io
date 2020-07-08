var countLayer=0;
mode='Classification'

function addLayer(layer_pos, name){
    //countLayer+=1;
    // Number of inputs to create
    //var number = 0;//document.getElementById("member").value;
    // Container <div> where dynamic content will be placed
    // var container = document.getElementById("layer-customize");
    console.log(name)
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
    num_neurons.appendChild(neuronNum)


    var activation = document.createElement("select");
    activation.type = "text";
    activation.name = "activ-" + name;
    activation.id = "activ-" + name;
    
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
    mode='Classification'
}

radioRegression.onclick = function() {
    document.getElementById("num-classes-prompt").style.display = "none";
    mode='Regression'
}


function parseLayers(){
    var layersInfo={}
    for(let i = 1; i<=countLayer; i++){
        var key="layer-"+i;
        var layerVal = parseInt(document.getElementById("layer-"+i).value);
        var layerAct = document.getElementById("activ-"+i).value;
        layersInfo[key] = {'value':layerVal, 'activation':layerAct};
    }

    var key="final";
    if (mode==='Classification'){
        
        var layerVal = parseInt(document.getElementById("num-classes").value);
        // var num_classes = layerVal;
        var layerAct = 'softmax';//document.getElementById("").value;
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
