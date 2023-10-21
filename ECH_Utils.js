//=============================================================================
// Echomap Utility Base Plugin
// ECH_Utils.js
// Version 0.10: 2023 10 18
//=============================================================================

//=============================================================================
/*:
 * @plugindesc 20231018.1 (Base Plugin) Echomap Plugins Utils
 * @author Echomap Plugins
 *
 * @param ---General---
 * @default
 *
 * @param debug_level
 * @desc debug level, default=5, minimum=3
 * @default 5
 *
 * @param debug
 * @desc debug on=true, off=false
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Base plugin for ECHOMAP.

 * ============================================================================
 * Notetags
 * ============================================================================
 * -<None> 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * <none>
 * ============================================================================
 * Plugin Script/Functions
 * ============================================================================
 * Echomap.Utils.logTrace = function(methodname,msg1,msg2)
 * Echomap.Utils.log = function(pluginname,methodname,msg1,msg2,level)
 * Echomap.Utils.debug = function(debugobj)
 * Echomap.Utils.getActorIdFromActor = function (actor) 
 * Echomap.Utils.findDataActorForGameActor = function (actorId) 
 * Echomap.Utils.echoParseNoteTagHelpDescription = function(notedata) {
 * Echomap.Utils.sayHello = function (myName, myVersion, myInfo, color1, color2, color3)
 * ============================================================================
 * Plugin Notes
 * ============================================================================
 * -<None>
 * ============================================================================
 * Plugin Internals
 * ============================================================================
 * -<None>
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 0.10:
 * 	- 2023 10 18: initial and work
 *
 * ============================================================================
 * TODO
 * ============================================================================
 * -<none>
 * ============================================================================
 * Plugin License
 * ============================================================================
 * https://opensource.org/license/MIT/
 * echomap@gmail.com
 */
//=============================================================================

var Imported = Imported || {};
Imported['ECH - Utils'] = '20231018.1';
Imported.Echomap_Utils = 1.0;
Imported.ECH_Utils = true;

var Echomap = Echomap || {};
Echomap.Utils = Echomap.Utils || {};
Echomap.Utils.SaidHello = {}
Echomap.Utils.MyUrl = "https://github.com/echomap/"

Echomap.Utils.error = 1
Echomap.Utils.info  = 2
Echomap.Utils.warn  = 3
Echomap.Utils.debug = 4
Echomap.Utils.trace = 5

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.Utils.Parameters = PluginManager.parameters('ECH_Utils');
Echomap.Params = Echomap.Params || {};
Echomap.Params.debug_level = (Echomap.Utils.Parameters['debug_level']) || 5;
Echomap.Params.debug       = (Echomap.Utils.Parameters['debug'])       || true;
//-----------------------------------------------------------------------------

//=============================================================================
// ** This Plugin
//=============================================================================

//==============================
// * Logging2
//==============================

Echomap.LogError = 1
Echomap.LogWarn  = 2
Echomap.LogInfo  = 3
Echomap.LogDebug = 4
Echomap.LogDebug2= 5
Echomap.LogTrace = 6
Echomap.Utils.LogLevel = Echomap.Utils.LogLevel || {};
Echomap.Utils.LogTraceSwitch = Echomap.Utils.LogTraceSwitch || {};

Echomap.Utils.setLogLevel = function(pluginname,debug_level) {
	Echomap.Utils.LogLevel[pluginname] = debug_level;
}
Echomap.Utils.setLogTraceSwitch = function(pluginname,onoff) {
	Echomap.Utils.LogTraceSwitch[pluginname] = onoff;
}

Echomap.Utils.log2 = function(pluginname,classname,methodname,level,msg1,msg2) {
	var msgs =  Array.prototype.slice.apply(arguments); 
	var pLogLevel = Echomap.Utils.LogLevel[pluginname]	
	if(pLogLevel==undefined) pLogLevel = Echomap.LogError
	if(level==undefined) level = 0;
	//
	if( typeof level === "string" ) {
		console.trace("invalid level passed")
	}
	if(pLogLevel>=level) {
		var cmsg = "(" +pluginname+ ")[" +level+"] " +classname+"."+methodname+ ": "
		for (var i = 4; i < msgs.length; ++i) {
			cmsg += "("+i+ ")='" +msgs[i] +"' "
		}
		if( level < Echomap.LogWarn || Echomap.Utils.LogTraceSwitch[pluginname] )
			console.trace(cmsg);
		else
			console.log(cmsg);
	}
	//
};

//==============================
// * Logging -- Old methods
//==============================

Echomap.Utils.logTrace = function(methodname,msg1,msg2) {
	Echomap.Utils.log(methodname,msg1,msg2,Echomap.Utils.trace);
};

Echomap.Utils.log = function(pluginname,methodname,msg1,msg2,level) {
	if(level==undefined) level = 0;
	if(Echomap.Params.debug) {
		if(Echomap.Params.debug_level>level) {
			if(msg2 != undefined)
				console.log("("+pluginname+") "+methodname+': '+ msg1 +': "' + msg2 + '"' );
			else
				console.log("("+pluginname+") "+methodname+': '+ msg1 );
		}
	}
};

Echomap.Utils.debug = function(debugobj) {
	var level      = debugobj.level;
	var plugname   = debugobj.plugname;
	var methodname = debugobj.methodname;
	var msg1       = debugobj.msg1;
	var msg2       = debugobj.msg2;
	var level      = debugobj.level;
	if(level==undefined) level = 4;
	if(Echomap.Params.debug) {
		if(Echomap.Params.debug_level>level) {
			if(msg2 != undefined)
				console.log('Echomap.'+plugname+' '+methodname+': '+ msg1 +': "' + msg2 + '"' );
			else
				console.log('Echomap.'+plugname+' '+methodname+': '+ msg1 );
		}
	}
};

//==============================
// * Utils
//==============================

Echomap.Utils.getActorIdFromActor = function (actor) {
	var actorId;// = actor.actorId();
	if( typeof actor.actorId == 'function')
		actorId = actor.actorId();
	else if('actorId' in actor)
		actorId = actor.actorId;
	else if('_actorId' in actor)
		actorId = actor._actorId;
	else if('id' in actor)
		actorId = actor.id;
	return actorId;
}
Echomap.Utils.findDataActorForGameActor = function (actorId) {
    var dataActor = undefined;
    var groupDA   = $dataActors;
    for (var n = 1; n < groupDA.length; n++) {
      	var obj     = groupDA[n];
      	var objId   = obj.id;
      	var objName = obj.name;
        if( obj.id === actorId ){
            dataActor = obj;
            break;
        }
    }
    return dataActor;
}

Echomap.Utils.echoParseNoteTagHelpDescription = function(notedata) {
	if(!notedata)
		return;
	var res = notedata.match(/<(?:Help Description)>/i);
	if(res){
		var res2 = notedata.match(/<Help Description>([\s\S]*?)<\/Help Description>/i );
		if(res2)
			return res2[1].trim();
	}
	return null;
};


/**
 * From PIXI
 * @constant
 * @static
 */
Echomap.Utils.sayHello = function (myName, myVersion, myInfo, color1, color2, color3)
{
	if(Echomap.Utils.SaidHello[myName])
    {
        return;
    }
	//
	var pad = '                    ';
	//var myNamePad = (pad + myName).slice(-pad.length) lpad
	var myNamePad = (myName + pad).substring(0, pad.length);
	var tText = ""
	//
	if(myVersion===undefined){
		if(Echomap[myName] && Echomap[myName].MyVersion)
			tText += ' Version - ' +Echomap[myName].MyVersion
	} else {
		tText = ' Version - ' +myVersion;
	}
	if(myInfo === undefined){
		if(Echomap[myName] && Echomap[myName].MyUrl)
			myInfo = Echomap[myName].MyUrl		
		else 
			myInfo = 'echomap@gmail.com'
	}
	//myInfo = myInfo || 'echomap@gmail.com'
	color1 = color1|| "#54be2cFF"
	color2 = color2|| "#c7e8b4FF"
	color3 = color3|| "#961800"
	
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
    {
        var args = [
            '\n %c %c %c ♥ ' +myNamePad+ ' ♥ - %c  %c ' +tText+
			' ♥ %c %c \u2730 %c\u2730%c'+myInfo+'\n\n',
            'background: '+color1+'; padding:5px 0;',
            'background: '+color1+'; padding:5px 0;',
            'color: '+color1+'; background: #030307; padding:5px 0;',
            'background: '+color1+'; padding:5px 0;',
            'background: '+color2+'; padding:5px 0;',
            'background: '+color1+'; padding:5px 0;',
            'color: '+color3+'; background: #fff; padding:5px 0;',
            'color: '+color3+'; background: #fff; padding:5px 0;',
            'color: '+color3+'; background: #fff; padding:5px 0;'
        ];

        window.console.log.apply(console, args); //jshint ignore:line
    }
    else if (window.console)
    {
        window.console.log(myName + ' ' + myVersion );
    }
    Echomap.Utils.SaidHello[myName] = myVersion;
}

//-----------------------------------------------------------------------------
Echomap.Utils.sayHello("Utils",Imported['ECH - Utils']);

//=============================================================================
// End of File
//=============================================================================
