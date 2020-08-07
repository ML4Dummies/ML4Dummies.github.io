import GLOBALS from "../config.js"

export default class ModelSection{

    constructor(){
        this.countLayer = 0;
        this.modelMode='customize'
        
        document.getElementById("add-layer").addEventListener("click", () => {
            this.countLayer+=1;
            this.addLayer(this.countLayer, this.countLayer);
        });

        document.getElementById("del-layer").addEventListener("click", () =>{
            if(this.countLayer!=0){
                this.deleteLayer(this.countLayer)
                this.countLayer-=1
            }

        });

        let radioTable=document.getElementById('model-customize-radio');

        let radioUpload=document.getElementById('model-upload-radio');
       

        radioTable.onclick = function() {
            
            document.getElementById("model-customize").style.display = "block";
            this.modelMode='customize'
            document.getElementById("model-upload").style.display = "none";
        }
        radioUpload.onclick = function() {
            
            document.getElementById("model-upload").style.display = "block";
            this.modelMode='upload'
            document.getElementById("model-customize").style.display = "none";

        }

        this.modelJson=document.getElementById("fileuploadModelJson")
        this.modelWeightsBin=document.getElementById("fileuploadModelBin")
        this.modelJson.addEventListener("change",() => parseUtils.updateUploadLabel(this.modelJson) , false);
        this.modelWeightsBin.addEventListener("change",() => parseUtils.updateUploadLabel(this.modelWeightsBin), false);
    }


    makeModel(){
        if( this.modelMode == 'customize'){
            let modelDict=this.parseLayers();
            GLOBALS.model.createModel(modelDict);
        }
        else if(this.modelMode == 'upload'){
            GLOBALS.model.uploadModel();
        }
    }

    deleteLayer(index){
        document.getElementById("model-table").deleteRow(index); 
    }

    addLayer(layer_pos, name, disabled=false) {

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
        // activation.type = "text";
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

    parseLayers(){

        let dataSection = GLOBALS.dataSection;
        let mode = GLOBALS.mode;
        let labelCols = dataSection.labelCols;

        let layersInfo={}
        for(let i = 1; i<=this.countLayer; i++){
            let key="layer-"+i;
            let layerVal = parseInt(document.getElementById("layer-"+i).value);
            let layerAct = document.getElementById("activ-"+i).value;
            layersInfo[key] = {'value':layerVal, 'activation':layerAct};
        }
    
        let key="final";
        if (mode==='Classification'){
            let layerVal = parseInt(document.getElementById("num-classes").value);
            let layerAct = 'linear';
            layersInfo[key] = {'value':layerVal, 'activation':layerAct};
        }
        else{
            let layerVal = labelCols.length;
            layersInfo[key] = {'value':layerVal, 'activation':'linear'};
        }
    
        return layersInfo
    }

    


}