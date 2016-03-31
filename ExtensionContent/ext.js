var recordElementGroups = {}; 

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
    
    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    // Update the color of the panel when the theme color of the product changed.
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);

    $(".input-cla").each(function() {

        $(this).on('keyup', function() {
        	limitToInt($(this));
        });
        
        $(this).on('paste', function() {
        	var self = $(this);
        	window.setTimeout(function() {
        		limitToInt(self);
        	}, 10);
        }); 
    })  

    $(".input-radius-cla").each(function() {

        $(this).on('keyup', function() {
            limitToFloat($(this));
        });
        
        $(this).on('paste', function() {
            var self = $(this);
            window.setTimeout(function() {
                limitToFloat(self);
            }, 10);
        }); 
    }) 
    $('#row_input_text').on('change', function() {
        updateRowSectionsElement($('#element_section_group'), parseInt($(this).val()), $('#each_section_text').val());
    });

    updateRowSectionsElement($('#element_section_group'), parseInt($('#row_input_text').val()), $('#each_section_text').val());

    $('#each_section_text').on('change', function() {
        $('.each-input-number').val($(this).val());
    });
}



/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 */
function updateThemeWithAppSkinInfo(appSkinInfo) {
	
    //Update the background color of the panel
    var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
    document.body.bgColor = toHex(panelBackgroundColor);
        
    var styleId = "ppstyle";
    
    var csInterface = new CSInterface();
	var appName = csInterface.hostEnvironment.appName;
    
    if(appName == "PHXS"){
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", "border-radius:3px;");
	}
	if(appName == "PHXS" || appName == "PPRO" || appName == "PRLD") {
		////////////////////////////////////////////////////////////////////////////////////////////////
		// NOTE: Below theme related code are only suitable for Photoshop.                            //
		// If you want to achieve same effect on other products please make your own changes here.    //
		////////////////////////////////////////////////////////////////////////////////////////////////
		
	    
	    var gradientBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 40) + " , " + toHex(panelBackgroundColor, 10) + ");";
	    var gradientDisabledBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 15) + " , " + toHex(panelBackgroundColor, 5) + ");";
	    var boxShadow = "-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);";
	    var boxActiveShadow = "-webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);";
	    
	    var isPanelThemeLight = panelBackgroundColor.red > 127;
	    var fontColor, disabledFontColor;
	    var borderColor;
	    var inputBackgroundColor;
	    var gradientHighlightBg;
	    if(isPanelThemeLight) {
	    	fontColor = "#000000;";
	    	disabledFontColor = "color:" + toHex(panelBackgroundColor, -70) + ";";
	    	borderColor = "border-color: " + toHex(panelBackgroundColor, -90) + ";";
	    	inputBackgroundColor = toHex(panelBackgroundColor, 54) + ";";
	    	gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -40) + " , " + toHex(panelBackgroundColor,-50) + ");";
	    } else {
	    	fontColor = "#ffffff;";
	    	disabledFontColor = "color:" + toHex(panelBackgroundColor, 100) + ";";
	    	borderColor = "border-color: " + toHex(panelBackgroundColor, -45) + ";";
	    	inputBackgroundColor = toHex(panelBackgroundColor, -20) + ";";
	    	gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -20) + " , " + toHex(panelBackgroundColor, -30) + ");";
	    }
	    
	
	    //Update the default text style with pp values
	    
	    addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + fontColor + "; background-color:" + toHex(panelBackgroundColor) + ";");
	    addRule(styleId, "button, select, input[type=text], input[type=button], input[type=submit]", borderColor);    
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", gradientBg);    
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", boxShadow);
	    addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", gradientHighlightBg);
	    addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", boxActiveShadow);
	    addRule(styleId, "[disabled]", gradientDisabledBg);
	    addRule(styleId, "[disabled]", disabledFontColor);
	    addRule(styleId, "input[type=text]", "padding:1px 3px;");
	    addRule(styleId, "input[type=text]", "background-color: " + inputBackgroundColor) + ";";
	    addRule(styleId, "input[type=text]:focus", "background-color: #ffffff;");
	    addRule(styleId, "input[type=text]:focus", "color: #000000;");
	    
	} else {
		// For AI, ID and FL use old implementation	
		addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + reverseColor(panelBackgroundColor) + "; background-color:" + toHex(panelBackgroundColor, 20));
	    addRule(styleId, "button", "border-color: " + toHex(panelBackgroundColor, -50));
	}
}

function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);
    
    if (stylesheet) {
        stylesheet = stylesheet.sheet;
           if( stylesheet.addRule ){
               stylesheet.addRule(selector, rule);
           } else if( stylesheet.insertRule ){
               stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
           }
    }
}


function reverseColor(color, delta) {
    return toHex({red:Math.abs(255-color.red), green:Math.abs(255-color.green), blue:Math.abs(255-color.blue)}, delta);
}

/**
 * Convert the Color object to string in hexadecimal format;
 */
function toHex(color, delta) {
    function computeValue(value, delta) {
        var computedValue = !isNaN(delta) ? value + delta : value;
        if (computedValue < 0) {
            computedValue = 0;
        } else if (computedValue > 255) {
            computedValue = 255;
        }

        computedValue = computedValue.toString(16);
        return computedValue.length == 1 ? "0" + computedValue : computedValue;
    }

    var hex = "";
    if (color) {
        with (color) {
             hex = computeValue(red, delta) + computeValue(green, delta) + computeValue(blue, delta);
        };
    }
    return "#" + hex;
}

function onAppThemeColorChanged(event) {
    // Should get a latest HostEnvironment object from application.
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    // Gets the style information such as color info from the skinInfo, 
    // and redraw all UI controls of your extension according to the style info.
    updateThemeWithAppSkinInfo(skinInfo);
} 

// limit int
function limitToInt(target) {
	target.val(target.val().replace(/\D/g,''));
}

// limit float
function limitToFloat(target) {
    target.val(target.val().replace(/([^0-9|.])/g,''));
}

// create rows sections element
function createRowSectionsElement(parent, row_number, section_number) {
    var _group = $("<div></div>");
    var _row = '<span class="span-illustration">' + row_number + ' row is </span>'
    var _input = '<input class="input-cla each-input-number" value="' + 10 + '"/>';
    var _sections = '<span class="span-illustration">sections</span>';
    _group.append(_row, _input, _sections);
    parent.append(_group);

    if(recordElementGroups[row_number] === undefined) {
       recordElementGroups[row_number] = _group; 
    }
}

// 
function updateRowSectionsElement(parent, number, section_number) {
    var i;
    for(var each in recordElementGroups) {
        if(parseInt(each) <= number) {
            recordElementGroups[each].show();
            recordElementGroups[each].children(".each-input-number").val(section_number);
        } else {
            recordElementGroups[each].hide();
        }
    }
    console.log("uuuuuuu");
    for(i=1; i<number+1; i++) {
        if(recordElementGroups[i] === undefined) {
            createRowSectionsElement(parent, i, section_number);
        }
    }
    if(number > 8) {
        number = 8;
    }

    $('#element_section_group').css('height', (number*30)+"px");

}

//
function getSecltions() {
    var result = [];
    $('.each-input-number').each(function() {
        result.push(parseInt($(this).val()));
    });
    return result;
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

function onClickButtonToRows(ppid, isPath) {
	isPath = !!isPath;
    if(ppid == "FLPR"){
    	var jsfl = 'fl.createDocument(); fl.getDocumentDOM().addNewText({left:100, top:100, right:300, bottom:300} , "Hello Flash!" ); ';
    	evalScript(jsfl);
    } else {
    	var division = $("#row_input_text").val();
        var roundListString = "[" 

    	var extScript = "$._ext_" + ppid + ".DividePath.execute("+division+",[], 0," + isPath + ")";
		evalScript(extScript);
        evalScript('$._ext_ILST.DividePath.clear()');

        $('#font_start').text("0");
        $('#font_end').text("0");
	}
}

function onClickButtonToSections(ppid) {
    if(ppid == "FLPR"){
    	var jsfl = 'fl.createDocument(); fl.getDocumentDOM().addNewText({left:100, top:100, right:300, bottom:300} , "Hello Flash!" ); ';
    	evalScript(jsfl);
    } else {
    	var division = $("#row_input_text").val();
        var roundListString = "[" 
        for(var i=1; i<parseInt(division)+1; i++) {
            roundListString += recordElementGroups[i].children().get(1).value;
            if(i == division) roundListString += "]";
            else roundListString += "," 
        }

        var radius = $("#section_radius_input_text").val();
    	var extScript = "$._ext_" + ppid + ".DividePath.execute("+division+"," + roundListString + "," + radius + ", true)";
		evalScript(extScript);
        evalScript('$._ext_ILST.DividePath.clear()');

        $('#font_start').text("0");
        $('#font_end').text("0");
	}
}

function recordStartButton(ppid) {
//    if(ppid == "FLPR"){
//    	var jsfl = 'fl.createDocument(); fl.getDocumentDOM().addNewText({left:100, top:100, right:300, bottom:300} , "Hello Flash!" ); ';
//    	evalScript(jsfl);
//    } else {
//		new CSInterface().evalScript('app.documents.length', function(result) {
//			alert(result);
//		});
//    }
	evalScript("$._ext_ILST.DividePath.start()", function(result) {
        $('#font_start').text(result);
    });
}

function recordEndButton() {
	evalScript("$._ext_ILST.DividePath.end()", function(result) {
        $('#font_end').text(result);
    });
}

function rolloverPathButton() {
	evalScript("$._ext_ILST.filpPaths()");
}
