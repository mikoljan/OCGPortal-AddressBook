requirejs.config({
    "baseUrl": "js",
    "paths": {
        "jquery": "libs/jquery-3.1.1.min",
        "bootstrap": "libs/bootstrap.bundle.min",
        "knockout": "libs/knockout-3.5.0",        
        "helpers": "helpers/helper",        
        "spscripts": 'libs/sp.loader.core',
        "domready" : 'libs/domReady',
        "camljs": 'libs/camljs',       
        "kobindings": 'libs/knockout-custom',
        "jqueryui": "libs/jquery-ui-1.12.1.min",
        "validator": 'libs/validator',
        "fileinput": 'libs/fileinput.min'
        
    },
    //urlArgs: "v=5",
    shim: {      
        'bootstrap': { 'deps': ['jquery'] }, 
        'validator': { 'deps': ['jquery'] }
    },
});

