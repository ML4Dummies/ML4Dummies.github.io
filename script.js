var countLayer =1;
// var boxName = 0;

function addLayer()
{
    var layerNeuron="layerNeuron"+countLayer; 
    var layerActiv="layerActivation"+countLayer;

document.getElementById('layer-customize').innerHTML+=
'<p><b>Layer '+countLayer+'</b></p>\
    <label for="'+layerNeuron+'">Number of neurons </label>\
    <input type="text" id="'+layerNeuron+'"/>\
<br/>\
\
<label for="'+layerActiv+'"> Activation Type</label>\
    <select name="'+layerActiv+'" id="'+layerActiv+'">\
    <option selected="selected" value="none">No Activation</option>\
    <option value="relu">ReLu</option>\
    <option value="softmax">Softmax</option>\
    <option value="tanh">tanh</option>\
    </select> \
<br/>';
     countLayer += 1;
}