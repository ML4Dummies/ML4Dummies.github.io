var countLayer=0;
mode='Classification'

function addLayer(){
    countLayer+=1;
    // Number of inputs to create
    //var number = 0;//document.getElementById("member").value;
    // Container <div> where dynamic content will be placed
    var container = document.getElementById("layer-customize");
    // Append a node with a random text
    container.appendChild(document.createTextNode("Layer "+ countLayer));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createTextNode("Number of Neurons: " ));
    // Create an <input> element, set its type and name attributes
    var neuronNum = document.createElement("input");
    neuronNum.type = "text";
    neuronNum.name = "layer-" + countLayer;
    neuronNum.id = "layer-" + countLayer;
    console.log(neuronNum.id)
    //input.setAttribute("id", "Div1");
    container.appendChild(neuronNum);

    //container.appendChild(document.createElement("br"));
    //container.appendChild(document.createElement("pre"));

    container.appendChild(document.createTextNode("    Activation Type:"));
    var activation = document.createElement("select");
    activation.type = "text";
    activation.name = "activ-" + countLayer;
    activation.id = "activ-" + countLayer;
    
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
        
    container.appendChild(activation);
    // Append a line break 
    container.appendChild(document.createElement("br"));
   
}

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
