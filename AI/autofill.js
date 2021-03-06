import GLOBALS from "../config.js"


export default class Autofill {

    constructor(){

        this.modelSection = null;

        document.getElementById("autofill").onclick = this.autofill.bind(this);
        this.defaultFill()

    }

    autofill(){

        let mode = GLOBALS.mode;
        this.modelSection = GLOBALS.modelSection;
        let addLayer = this.modelSection.addLayer;

        if (mode == "Classification"){
            let fields_dict = {"features":"1-8", "labels":9,"num-classes":7, "row-exclude":1, "epochs":20, "batch-size":32, "learning-rate":0.002 }
            for (let field in fields_dict){
                document.getElementById(field).value = fields_dict[field];
            }
            // addLayer(1, 1);
            // addLayer(2, 2);
            // addLayer(3, 3);
            // addLayer(4, "final", true);
            // document.getElementById("layer-1").value = 250;
            // document.getElementById("layer-2").value = 175;
            // document.getElementById("layer-3").value = 150;
            // document.getElementById("layer-final").value = 7;
            // document.getElementById("train-split").value = 0.9;
            // // document.getElementById("test-split").value = 0.1;
            // document.getElementById("val-split").value = 0.1;
            // document.getElementById("activ-1").value = "relu";
            // document.getElementById("activ-2").value = "relu";
            // document.getElementById("activ-3").value = "relu";
            // document.getElementById("activ-final").value = "linear";
            
            // this.modelSection.countLayer=3;
    
        }else{
            let fields_dict = {"features":5, "labels":2, "row-exclude":1, "epochs":20, "batch-size":32, "learning-rate":0.002 }
            for (let field in fields_dict){
                document.getElementById(field).value = fields_dict[field];
            }
            // addLayer(1, 1);
            // addLayer(2, 2);
            // addLayer(3, "final", true);
            // document.getElementById("layer-1").value = 100;
            // document.getElementById("layer-2").value = 100;
            // document.getElementById("layer-final").value = 1;
            // document.getElementById("train-split").value = 0.9;
            // // document.getElementById("test-split").value = 0.1;
            // document.getElementById("val-split").value = 0.1;
            // document.getElementById("activ-1").value = "sigmoid";
            // document.getElementById("activ-2").value = "sigmoid";
            // document.getElementById("activ-final").value = "linear";
            
            // this.modelSection.countLayer=2;
        }
        
    }

    defaultFill(){
        let fields_dict = {"epochs":100, "batch-size":32, "learning-rate":0.002, 'train-split':0.9, "val-split":0.1}
        for (let field in fields_dict){
            document.getElementById(field).value = fields_dict[field];
        }
    }

    modelFill(){

        let numClasses = GLOBALS.dataSection.numClasses;
        let trainSize = GLOBALS.dataset.trainSize;
        let numFeatures = GLOBALS.dataSection.inputCols.length;
        let alpha = 2;
        let numHidden = Math.round(trainSize/(alpha*(numClasses + numFeatures)));
        let mode = GLOBALS.mode;
        let addLayer = GLOBALS.modelSection.addLayer;

        addLayer(1, 1);
        addLayer(2, "final", true);

        document.getElementById("layer-1").value = numHidden;

        let numFinal = mode == "Classification" ? numClasses : 1;
        document.getElementById("layer-final").value = numFinal;

        document.getElementById("activ-1").value = "relu";
        document.getElementById("activ-final").value = "linear";

        GLOBALS.modelSection.countLayer=1;



    }

}