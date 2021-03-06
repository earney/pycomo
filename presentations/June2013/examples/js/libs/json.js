function _py(obj){
    if(obj===null){return None}
    if(isinstance(obj,list)){
        var res = []
        for(var i=0;i<obj.length;i++){
            res.push(_py(obj[i]))
        }
        return res
    }
    if(obj.__class__!==undefined && (typeof obj!=='function')){return obj}
    if(typeof obj==='object' && obj.__class__===undefined){
        // transform JS object into a Python dict
        var res = dict()
        for(var attr in obj){
            res.__setitem__(attr,_py(obj[attr]))
        }
        return res
    }
    return JSObject(obj)
}
function _js(obj){
    // obj is a Python object
    if (isinstance(obj,[int,str])){return obj}
    else if(obj===None){return null}
    else if(obj===True){return true}
    else if(obj===False){return false}
    else if(isinstance(obj,float)){return obj.value}
    else if(isinstance(obj,[list,tuple])){
        var res = []
        for(var i=0;i<obj.length;i++){res.push(_js(obj[i]))}
        return res
    }else if(isinstance(obj,dict)){
        var res = new Object()
        for(var i=0;i<obj.$keys.length;i++){
            res[obj.$keys[i]]=obj.$values[i]
        }
        return res
    }else{
        throw TypeError(str(obj)+' is not JSON serializable')
    }
}

$module =  {

    __getattr__ : function(attr){return this[attr]},

    loads : function(json_obj){return _py(JSON.parse(json_obj))},

    dumps : function(obj){return JSON.stringify(_js(obj))},
}