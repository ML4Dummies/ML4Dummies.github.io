import GLOBALS from "./config.js";
import Dataset from "./ML/dataset.js";
import Model from "./ML/model.js";
import Autofill from "./AI/autofill.js";
import TrainOptionsSection from "./UI/trainOptionsSection.js";
import ModelSection from "./UI/modelSection.js";
import IntroSection from "./UI/introSection.js";
import Navigation from "./UI/navigation.js";
import DataSection from "./UI/dataSection.js";
import PredictionSection from "./UI/predictionSection.js";

GLOBALS.navigation = new Navigation();
GLOBALS.introSection = new IntroSection();
GLOBALS.autofill = new Autofill();
GLOBALS.dataSection = new DataSection('fileuploadTrain');
GLOBALS.dataset = new Dataset();
GLOBALS.modelSection = new ModelSection();
GLOBALS.model = new Model();
GLOBALS.trainOptionsSection = new TrainOptionsSection();
GLOBALS.predictionSection = new PredictionSection('fileuploadPredict');
GLOBALS.datasetPredict = new Dataset();

