import GLOBALS from "../config.js"

export default class IntroSection{

    constructor(){
        
        let radioClassification=document.getElementById('classification');
        let radioRegression=document.getElementById('regression');

        radioClassification.onclick = function() {
            document.getElementById("num-classes-prompt").style.display = "block";
            GLOBALS.mode='Classification';

            GLOBALS.trainOptionsSection.lossOptions();

        }
        
        radioRegression.onclick = function() {
            document.getElementById("num-classes-prompt").style.display = "none";
            GLOBALS.mode='Regression';
            GLOBALS.trainOptionsSection.lossOptions();
        }

    }


}