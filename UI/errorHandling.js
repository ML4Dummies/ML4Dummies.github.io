import GLOBALS from "../config.js";


export function assertPositiveInteger(number, id, msg=null){

    if(msg == null) msg = "Number should be a positive integer"

    if(!Number.isInteger(number) || number <= 0){
        throw {"id":id,"msg":msg}
    }
    
}

export function assertLessThan(number, target, id, msg=null){
    if(msg == null) msg = "The number should be less than target" + target
    
    if(number >= target){
        console.log("ERROR")
        throw {"id":id,"msg":msg}
    }
    
}

export function assertLessThanOrEqual(number, target, id, msg=null){
    if(msg == null) msg = "The number should be less than or equal to target" + target
    
    if(number > target){
        console.log("ERROR")
        throw {"id":id,"msg":msg}
    }
    
}

export function assertGreaterThan(number, target, id, msg=null){
    if(msg == null) msg = "The number should be greater than target" + target
    
    if(number <= target){
        console.log("ERROR")
        throw {"id":id,"msg":msg}
    }
    
}

export function assertGreaterThanOrEqual(number, target, id, msg=null){
    if(msg == null) msg = "The number should be greater than or equal to target: " + target;
    
    if(number < target){
        console.log("ERROR")
        throw {"id":id,"msg":msg}
    }
    
}

export function assertRangeInclusive(number, targetMin, targetMax, id, msg=null){
    if(msg == null) msg = "The number should be in target range: [" + targetMin + "," + targetMax + "]";
    
    if(number < targetMin || number > targetMax){
        console.log("ERROR")
        throw {"id":id,"msg":msg}
    }
}


export function clearErrors(list){
    for (let element of list){
        // console.log(element)
        document.getElementById(element+"-error").innerHTML = "";
    }
}

export function assertNotNull(element, id, msg=null){
    if(msg == null) msg = "The element should not be null";

    if(element == null){
        console.log("ERROR")
        throw {"id":id,"msg":msg}
    }

}

