import GLOBALS from "../config.js";


export function assertPositiveInteger(number, id, msg=null){

    if(msg == null) msg = "Number should be integer and positive"

    if(!Number.isInteger(number) || number <= 0){
        throw {"id":id,"msg":msg}
    }
    
}

export function assertLessThan(number, target, id, msg=null){
    if(msg == null) msg = "The number should be less that or equal to target"
    
    console.log(number);
    console.log(target)
    if(number >= target){
        console.log("ERROR")
        throw {"id":id,"msg":msg}
    }
    
}



