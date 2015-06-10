
function onLoaded() {
    var csInterface = new CSInterface();
	
    
    var appName = csInterface.hostEnvironment.appName;
    
    if(appName != "FLPR"){
    	loadJSX();
    }    
    
    var appNames = ["ILST"];
    for (var i = 0; i < appNames.length; i++) {
        var name = appNames[i];
        if (appName.indexOf(name) >= 0) {
           var btn = document.getElementById("btn_" + name);
           if (btn)
                btn.disabled = false;
        }
    }
    

	
}




    
/**
 * Load JSX file into the scripting context of the product. All the jsx files in 
 * folder [ExtensionRoot]/jsx will be loaded. 
 */
function loadJSX() {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$._ext.evalFiles("' + extensionRoot + '")');
}

function evalScript(script, callback) {
    new CSInterface().evalScript(script, callback);
}

function onClickButton(ppid) {
    if(ppid == "FLPR"){
    	var jsfl = 'fl.createDocument(); fl.getDocumentDOM().addNewText({left:100, top:100, right:300, bottom:300} , "Hello Flash!" ); ';
    	evalScript(jsfl);
    } else {
    	var division = window.document.getElementById("input_text").value;
    	var extScript = "$._ext_" + ppid + ".DividePath.execute("+division+")";
		evalScript(extScript);
	}
}

function recordStartButton() {
	evalScript("$._ext_ILST.DividePath.start()");
}

function recordEndButton() {
	evalScript("$._ext_ILST.DividePath.end()");
}

function rolloverPathButton() {
	evalScript("$._ext_ILST.filpPaths()");
}
