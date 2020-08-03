import * as errorHandler from "./errorHandling.js";

export function parse_text(id) {

    let string = document.getElementById(id).value
    var numbers = [];
    for (let match of string.split(",")) {
        if (match.includes("-")) {
            let [begin, end] = match.split("-");

            errorHandler.assertPositiveInteger(Number(begin), id);
            errorHandler.assertPositiveInteger(Number(end), id);

            for (let num = parseInt(begin); num <= parseInt(end); num++) {
                numbers.push(num - 1);
            }

        } else {

            errorHandler.assertPositiveInteger(Number(match), id);
            numbers.push(parseInt(match) - 1);
        }
    }


    return numbers.sort();
}

export function getIncludedRows(id, num_rows, excludeRows) {
    let keepRows = []
    errorHandler.assertLessThan(excludeRows[excludeRows.length - 1], num_rows, id, "Excluded rows are out of dataset range")
    for (let i = 0; i < num_rows; i++) {
        if (excludeRows.indexOf(i) == -1)
            keepRows.push(i);
    }
    return keepRows
}

export function parse(obj) {
    // var file = this.data_element.files; 

    function load_dataset(results) {
        var data = results.data;
        var matrix = new Array();

        for (let i = 0; i < data.length - 1; i++) {
            var row = data[i];
            var cells = row.map(Number);
            matrix.push(cells);
        }
        data = matrix
        obj.data = data;
    }

    $('#'+ obj.file_id).parse({
        config: {
            delimiter: ",",
            header: false,
            complete: load_dataset
        },
     
    })
    
}