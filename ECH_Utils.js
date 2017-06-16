//=============================================================================
// Echomap Utility Base Plugin
// ECH_Utils.js
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v20160611.1 (Requires Nothing) Echomap Plugins Utils
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
 *
  *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
  *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 0.10:
 * - XX
 *
 *
 * ============================================================================
 * TODO
 * ============================================================================
 *
 * Fix for selection of cats and colors/hues
 *
 *
 *
 */
//=============================================================================

//(function() {
var Imported = Imported || {};
Imported['ECH - Utils'] = '20160611.1';
Imported.Echomap_Utils = 1.0;

var Echomap = Echomap || {};
Echomap.Utils = Echomap.Utils || {};
Echomap.Utils.SaidHello = {}

//Echomap.Utils.LEVEL = {};
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
// Echomap.Util
//=============================================================================
Echomap.Utils.logTrace = function(methodname,msg1,msg2) {
	Echomap.Utils.log(methodname,msg1,msg2,Echomap.Utils.trace);
}
Echomap.Utils.log = function(methodname,msg1,msg2,level) {
	if(level==undefined) level = 0;
	if(Echomap.Params.debug) {
		if(Echomap.Params.debug_level>level) {
			if(msg2 != undefined)
				console.log('Echomap.CCG '+methodname+': '+ msg1 +': "' + msg2 + '"' );
			else
				console.log('Echomap.CCG '+methodname+': '+ msg1 );
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

/**
 * From PIXI
 * @constant
 * @static
 */
Echomap.Utils.sayHello = function (myName, myVersion)
{
	if(Echomap.Utils.SaidHello[myName])
    {
        return;
    }

	var pad = '                    ';
	//var myNamePad = (pad + myName).slice(-pad.length) lpad
	var myNamePad = (myName + pad).substring(0, pad.length);

    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
    {
        var args = [
            '\n %c %c %c ✰ ' +myNamePad+ ' ✰ - %c ' + ' %c ' + ' Version - ' +myVersion+' ✰ %c %c ♥%c♥%c♥ \n\n',
            'background: #ff66a5; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'color: #ff66a5; background: #030307; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'background: #ffc3dc; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;'
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
Echomap.Utils.sayHello("ECH_Utils",Imported['ECH - Utils']);

//=============================================================================
// End of File
//=============================================================================
//};
//})();
