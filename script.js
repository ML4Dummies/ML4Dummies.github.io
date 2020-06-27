// var countLayer =1;
// // var boxName = 0;

// function addLayer()
// {
//     var layerNeuron="layerNeuron"+countLayer; 
//     var layerActiv="layerActivation"+countLayer;

// document.getElementById('layer-customize').innerHTML+=
// '<p><b>Layer '+countLayer+'</b></p>\
//     <label for="'+layerNeuron+'">Number of neurons </label>\
//     <input type="text" id="'+layerNeuron+'"/>\
// <br/>\
// \
// <label for="'+layerActiv+'"> Activation Type</label>\
//     <select name="'+layerActiv+'" id="'+layerActiv+'">\
//     <option selected="selected" value="none">No Activation</option>\
//     <option value="relu">ReLu</option>\
//     <option value="softmax">Softmax</option>\
//     <option value="tanh">tanh</option>\
//     </select> \
// <br/>';
//      countLayer += 1;
// }
var countLayer=0;

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
    
    var softmax=document.createElement("option");
    softmax.value="softmax";
    softmax.text="Softmax";
    activation.add(softmax);

    var tanh = document.createElement("option");
    tanh.value="tanh"
    tanh.text="Tanh"
    activation.add(tanh);
        
    container.appendChild(activation);
    // Append a line break 
    container.appendChild(document.createElement("br"));
   
}

var radioClassification=document.getElementById('classification');
var radioRegression=document.getElementById('regression');

radioClassification.onclick = function() {
    var numClassesPrompt = document.getElementById("num-classes-prompt");
    numClassesPrompt.appendChild(document.createTextNode("Enter number of classes:"));
    var  numClasses = document.createElement("input");
    numClasses.type = "text";
    numClasses.name = "num-classes";
    numClasses.id = "num-classes";
    //input.setAttribute("id", "Div1");
    numClassesPrompt.appendChild(numClasses);
}


function parseLayers(){
    layersInfo={}
    for(let i = 1; i<=countLayer; i++){
        console.log(i)
        key="layer-"+i;
        layerVal = parseInt(document.getElementById("layer-"+i).value);
        layerAct = document.getElementById("activ-"+i).value;
        layersInfo[key] = {'value':layerVal, 'activation':layerAct};
    }
    key="classifier";
    layerVal = parseInt(document.getElementById("num-classes").value);
    layerAct = 'softmax';//document.getElementById("").value;
    layersInfo[key] = {'value':layerVal, 'activation':layerAct};

    return layersInfo
}
