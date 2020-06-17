console.log('Hello TensorFlow');

const trainingFile = document.getElementById('fileuploadTrain');

trainingFile.addEventListener("change", handleFiles, false);
function handleFiles() {
  const file = this.files; /* now you can work with the file list */
  console.log(trainingFile)

}