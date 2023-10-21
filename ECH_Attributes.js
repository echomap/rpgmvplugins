//=============================================================================
// ECH_Attributes.js
// Attributes structure in objects
// Echomap Plugin echomap<echomap@gmail.com>
//=============================================================================

//=============================================================================
/*:
 * @plugindesc (Requires ECH_Utils.js) Manage extra data in the Actors
 * @author Echomap Plugins
 *
 * @param ---General---
 * @default
 *
 * @param LogLevel
 * @desc 1:Error/ 2:Warn/ 3:Info / 4:Debug / 5:Debug2 / 6:Trace
 * @default 3
 * @type number
 *
 * @param LogTrace
 * @desc To always print traces or not?
 * @default false
 * @type boolean
 * 
 * @param ProfileTag
 * @desc ProfileTag name in <> to place attribute data
 * @default ECHAttributes
 *
 * @param VarName
 * @desc VarName variable in actors to use to place attribute data
 * @default attributes
 *
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Adds a propery to objects set in param 'VarName', ie: attributes,
 *   as well as methods to get and set them.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 * --Example note--
 *<ECHAttributes>
 *gender:male
 *orientation:female
 *other1:false
 *</ECHAttributes>
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * Use: (Should change this probably? as no pre-command)
 * SetAttribute actorId key value
 * GetAttribute actorId key
 *
 * ============================================================================
 * Plugin Script/Functions
 * ============================================================================ 
 * Echomap._attributeLoader houses the Echomap_Attributes Object
 * Which has these functions:
 *
Echomap_Attributes.addNumToAttribute(actorId, attribKey, attribNum) 
Echomap_Attributes.subNumToAttribute(actorId, attribKey, attribNum) 
Echomap_Attributes.setAttribute(actorId, attribKey, attribData) 
Echomap_Attributes.isAttributeMax(actorId, attribKey, attribMaxKey) 
Echomap_Attributes.checkAttributeMax(actorId, attribKey, attribMaxKey) 
Echomap_Attributes.getAttribute(actorId, attribKey, isnum) 
Echomap_Attributes.setEnemyAttribute(actorId, attribKey, attribData) 
Echomap_Attributes.getEnemyAttribute(actorId, attribKey) 
Echomap_Attributes.getAttributeFromObject(obj, attribKey, isnum) 
 *
 * (Mins and Maxes assume the values stored are Numbers, or convertable to them)
 *
 * ============================================================================
 * Plugin Internal
 * ============================================================================
 * Will call on game load, Echomap_AttribLoader:
 * Which processes through these data groups, looking for notetags
 *	$dataActors
 *	$dataArmors
 *	$dataClasses
 *	$dataEnemies
 *	$dataItems
 *	$dataSkills
 *	$dataStates
 *	$dataWeapons
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 0.10:
 * - 2023 09 24 always write attrib data
 * - 2023 09 18 removed over logging
 * - 2016 08 11 initial
 *
 * ============================================================================
 * TODO
 * ============================================================================
 *  <none>
 * ============================================================================
 * Plugin License
 * ============================================================================
 * https://choosealicense.com/licenses/agpl-3.0/
 *
 */
//=============================================================================

var Imported = Imported || {};
Imported['ECH - Attributes'] = '20230901.1';
Imported.Echomap_Attributes = true;

if (Imported["ECH - Utils"] === undefined) {
  throw new Error("Please add ECH_Utils before ECH_Attributes!");
}

var Echomap = Echomap || {};
Echomap.Attributes = Echomap.Attributes || {};
Echomap.Attributes.DataLoaded = false;
Echomap.Attributes.MyPluginName = "Attributes";
Echomap.Attributes.MyVersion = "20230901.1"
if(Echomap.Utils)
	Echomap.Utils.sayHello("Attributes",Imported['ECH - Attributes']);

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.Attributes.Parameters = PluginManager.parameters('ECH_Attributes');
Echomap.Params = Echomap.Params || {};

Echomap.Params.attributeLogLevel   = Number(Echomap.Attributes.Parameters['LogLevel'] || 0 );
Echomap.Params.attributeLogTrace   = eval(Echomap.Attributes.Parameters['LogTrace'] || false );
Echomap.Params.attributeVarName    = (Echomap.Attributes.Parameters['VarName'])    || "attributes";
Echomap.Params.attributeProfileTag = (Echomap.Attributes.Parameters['ProfileTag']) || "ECHAttributes";
//-----------------------------------------------------------------------------

//=============================================================================
// ** This Plugin
//=============================================================================

//==============================
// * Plugin Objects
//==============================

//==============================
// * Attributes
// The object class for the work of this plugin
// Stored in: Echomap._attributeLoader
//==============================

function Echomap_Attributes() {
    this.initialize.apply(this, arguments);
}
Echomap_Attributes.prototype = Object.create(Object.prototype);
Echomap_Attributes.prototype.constructor = Echomap_Attributes;

Echomap_Attributes.prototype.initialize = function() {
	//Echomap.Utils.log('Echomap_Attributes', 'initialize', 'called' );
	Echomap.Utils.log2("Attributes", "Echomap_Attributes", "initialize", Echomap.LogInfo,  "initialize" )
	Echomap.Utils.log2("Attributes", "Echomap_Attributes", "initialize", Echomap.LogWarn,  "initialize" )
};
//addNumToAttribute(1,)
Echomap_Attributes.prototype.addNumToAttribute = function (actorId, attribKey, attribNum) {
    var actor = undefined
	if( typeof actorId === 'object' )
		actor = actorId
    else
		actor = $gameActors.actor(actorId);
    var attributeData = actor[Echomap.Params.attributeVarName];
    if(!attributeData) {
        attributeData = {};
		actor[Echomap.Params.attributeVarName] = attributeData
    }
	var curval = attributeData[attribKey];
	if(!curval)
		curval = 0
	curval = Number( curval )
	curval += attribNum
	var maxval = attributeData[attribKey+"Max"];
	if(!maxval)
		maxval = 9999
	maxval = Number( maxval )
	if(curval>maxval)
		curval = maxval
    attributeData[attribKey] = curval;
};
Echomap_Attributes.prototype.subNumToAttribute = function (actorId, attribKey, attribNum) {
    var actor = undefined
	if( typeof actorId === 'object' )
		actor = actorId
    else
		actor = $gameActors.actor(actorId);
    var attributeData = actor[Echomap.Params.attributeVarName];
    if(!attributeData) {
        attributeData = {};
		actor[Echomap.Params.attributeVarName] = attributeData
    }
	var curval = attributeData[attribKey];
	if(!curval)
		curval = 0
	curval = Number( curval )
	curval -= attribNum
	var minval = attributeData[attribKey+"min"];
	if(!minval)
		minval = 0
	minval = Number( minval )
	if(curval<minval)
		curval = minval
    attributeData[attribKey] = curval;
};
Echomap_Attributes.prototype.setAttribute = function (actorId, attribKey, attribData) {
    var actor = undefined
	if( typeof actorId === 'object' )
		actor = actorId
    else
		actor = $gameActors.actor(actorId);
    var attributeData = actor[Echomap.Params.attributeVarName];
    if(!attributeData) {
        attributeData = {};
		actor[Echomap.Params.attributeVarName] = attributeData
    }
    attributeData[attribKey] = attribData;
    //actor[Echomap.Params.attributeVarName] = attributeData;
};
Echomap_Attributes.prototype.isAttributeMax = function (actorId, attribKey, attribMaxKey) {
	var a1 = Number( this.getAttribute(actorId, attribKey) )
	var a2 = Number( this.getAttribute(actorId, attribMaxKey) )
	if( a2 && a1 )
		if( a1 >= a2 )
			return true;
	return false;
}
Echomap_Attributes.prototype.checkAttributeMax = function (actorId, attribKey, attribMaxKey) {
	var a1 = Number( this.getAttribute(actorId, attribKey) )
	var a2 = Number( this.getAttribute(actorId, attribMaxKey) )
	if(a2 && a1 ){
		if( a1 > a2 )
			a1 = a2
		if( a1 < 0)
			a1 = 0
	}
}
Echomap_Attributes.prototype.getAttribute = function (actorId, attribKey, isnum) {
	isnum = isnum | false
	var actor = undefined
	if( typeof actorId === 'object' )
		actor = actorId
    else
		actor = $gameActors.actor(actorId);	
    var attributeData = actor[Echomap.Params.attributeVarName];
    if(!attributeData) {
        attributeData = {};
		actor[Echomap.Params.attributeVarName] = attributeData
    }
    var atda = attributeData[attribKey];
	if(isnum)
		if(atda)
			atda = Number(atda)
		else
			atda = 0
    return atda;
};
Echomap_Attributes.prototype.setEnemyAttribute = function (actorId, attribKey, attribData) {
    var actor = $dataEnemies[actorId];
    var attributeData = actor[Echomap.Params.attributeVarName];
    if(!attributeData) {
        attributeData = {};
		actor[Echomap.Params.attributeVarName] = attributeData
    }
    attributeData[attribKey] = attribData;
    //actor[Echomap.Params.attributeVarName] = attributeData;
};
Echomap_Attributes.prototype.getEnemyAttribute = function (actorId, attribKey) {
    var actor = $dataEnemies[actorId];
    var attributeData = actor[Echomap.Params.attributeVarName];
    if(!attributeData) {
        attributeData = {};
		actor[Echomap.Params.attributeVarName] = attributeData
    }
    var atda = attributeData[attribKey];
    return atda;
};
Echomap_Attributes.prototype.getAttributeFromObject = function (obj, attribKey, isnum) {
    var attributeData = obj[Echomap.Params.attributeVarName];
    if(!attributeData) {
        attributeData = {};
		obj[Echomap.Params.attributeVarName] = attributeData
    }
    var atda = attributeData[attribKey];
	if(isnum)
		if(atda)
			atda = Number(atda)
		else
			atda = 0
    return atda;
};
//-----------------------------------------------------------------------------
// TODO remove this?
Echomap_Attributes.prototype.setActorGender = function (actorId, genderString) {
	Echomap.Utils.log('setActorGender', 'Called');
    var actor = $gameActors.actor(actorId);
	var objId   = actor.id;
	var objName = actor._name;
	if(objId === undefined)
		objId = actor._actorId;
	Echomap.Utils.log('setActorGender','objId',   objId);
	Echomap.Utils.log('setActorGender','objName', objName);

	var attributeData = actor[Echomap.Params.attributeVarName];
    if(attributeData) {
        attributeData['gender'] = genderString;
    } else {
        attributeData = {};
        attributeData['gender'] = genderString;
        actor[Echomap.Params.attributeVarName] = attributeData;
    }
    Echomap.Utils.log('setActorGender','Done', 'called');
};
//-----------------------------------------------------------------------------

//==============================
// * Attributes Loader object
// Loads from notetags for use by the game actor(s)
//==============================

function Echomap_AttribLoader() {
    this.initialize.apply(this, arguments);
}
Echomap_AttribLoader.prototype = Object.create(Object.prototype);
Echomap_AttribLoader.prototype.constructor = Echomap_AttribLoader;

Echomap_AttribLoader.prototype.initialize = function() {
    //Echomap.Utils.log( { plugname:"Attributes", methodname:"Echomap_AttribLoader", msg1:"initialize"} );
	Echomap.Utils.log2("Attributes", "Echomap_AttribLoader", "initialize", Echomap.LogInfo, "initialize" );
	//if($gameActors)
	//	this.processNotetagsToGame($gameActors._data);
};

// Process through group --> processNotetags
Echomap_AttribLoader.prototype.processGroupNotetags = function (group) {
  //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processGroupNotetags", msg1:"Called"} );
  for (var n = 1; n < group.length; n++) {
	var obj     = group[n];
	var objId   = obj.id;
	var objName = obj.name;
	this.processNotetags(obj);
  }
  //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processGroupNotetags", msg1:"Done"} );
};

// 
Echomap_AttribLoader.prototype.processNotetags = function (obj) {
    //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processNotetags", msg1:"Called"} );
	var objId   = obj.id;
	var objName = obj.name;
    //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processNotetags", msg1:"objId", msg2:objId} );
    //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processNotetags", msg1:"objName", msg2:objName} );
	Echomap.Utils.log2("Attributes", "Echomap_AttribLoader", "initialize", Echomap.LogDebug, "processNotetags", "objId", objId, "objName", objName );

	var attributeData = undefined;
	var notedata  = obj.note.split(/[\r\n]+/);
	attributeData = this.processNoteData(objId,notedata);
    if(attributeData){ //actualy, should always put this in there
        obj[Echomap.Params.attributeVarName] = attributeData;
    }
    //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processNotetags", msg1:"Done"} );
	return attributeData;
};

//
Echomap_AttribLoader.prototype.processNotetagsToGame = function (group) {
  //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processNotetagsToGame", msg1:"Called"} );
  group.forEach((obj) => {
	var objId   = obj._actorId;
	var objName = obj._name;
	var dataActor = undefined
	if( obj.constructor == Game_Actor ) 
		dataActor = this.findDataForGame( objId, $dataActors ); //findDataActorForGameActor(objId);
	else if( obj.constructor == Game_Enemy ) 
		dataActor = this.findDataForGame(objId, $dataEnemies );	
	else {
		//
	}
    if(dataActor){
		obj[Echomap.Params.attributeVarName] = dataActor[Echomap.Params.attributeVarName];
        //this.processDataToGame(obj,dataActor);
    }
  });
  //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processNotetagsToGame", msg1:"Done"} );
};

//
Echomap_AttribLoader.prototype.findDataForGame = function (actorId, dataGroup) {
    var dataActor = undefined;
    var groupDA = dataGroup
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

Echomap_AttribLoader.prototype.processNoteData = function(actorId,notedata) {
    //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processNoteData", msg1:"Called" } );
	var attributeData = {};
    var foundMain = false;

    var profileKey = Echomap.Params.attributeProfileTag;
    var regExKeyS = "^\\s*<"+ profileKey+">";
    var regExKeyE = "^\\s*</"+profileKey+">";
	var textMode = 'none';
    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      //Echomap.Utils.debug( { level:5, plugname:"Attributes", methodname:"processNoteData", msg1:"line", msg2:line} );
	  Echomap.Utils.log2("Attributes", "Echomap_AttribLoader", "initialize", Echomap.LogDebug, "processNoteData", "line", line );
      if (line.match(regExKeyS)) {
        textMode = 'MAIN'
      } else if (line.match(regExKeyE)) {
        textMode = 'NONE'
      } else if (textMode === 'MAIN') {
        attributeData = this.parseNoteLine(line, attributeData );
        foundMain=true;
      }
    }
    if(foundMain){}
    //Echomap.Utils.debug( { plugname:"Attributes", methodname:"processNoteData", msg1:"Done" } );
    return attributeData;
};

Echomap_AttribLoader.prototype.parseNoteLine = function(line, attributeData ) {
    var myRegexp1  = "^\\s*([a-zA-Z0-9-_./\(\)]+):\\s*([a-zA-Z0-9-_.,/\(\)]+)$"
    var match;
    var match1 = 0
	var match2 = 0;

    if( match = line.match(myRegexp1) ) {
         //Echomap.Utils.debug( { level:4, plugname:"Attributes", methodname:"parseNoteLine", msg1:"match for", msg2:line} );
		 Echomap.Utils.log2("Attributes", "Echomap_AttribLoader", "initialize", Echomap.LogDebug, "parseNoteLine", "match for", line )
         match1 = match[1];
         match2 = match[2];
         attributeData[match1] = match2;
    }
    return attributeData;
}
//-----------------------------------------------------------------------------

//=============================================================================
// ** Game_System
//=============================================================================

//===============================
// * DataManager
//===============================

//TODO: What about loading a save?
// Function Called about 5 times on game start
Echomap.Attributes.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
	if (!Echomap.Attributes.DataManager_isDatabaseLoaded.call(this)) return false;
	if(!$dataSystem.echo_loaded_attributes){
		Echomap.Utils.setLogLevel("Attributes", Echomap.Params.attributeLogLevel )
		Echomap.Utils.setLogTraceSwitch("Attributes", Echomap.Params.attributeLogTrace )
		Echomap.Utils.log2("Attributes", "DataManager", "initialize", Echomap.LogInfo,  "Startup!")
		// Know that $gameSystem is null here
		Echomap.Utils.log2("Attributes", "DataManager", "initialize", Echomap.LogDebug, "DataManager", "Attributes Loading...");
        Echomap._loaded_Attributes = true;
		$dataSystem.echo_loaded_attributes = true;
        var eProc = new Echomap_AttribLoader();
		eProc.processGroupNotetags($dataActors);	
		eProc.processGroupNotetags($dataArmors);
		eProc.processGroupNotetags($dataClasses);
		eProc.processGroupNotetags($dataEnemies);
		eProc.processGroupNotetags($dataItems);
		//dataMap
		//dataMapInfos
		eProc.processGroupNotetags($dataSkills);
		eProc.processGroupNotetags($dataStates);
		eProc.processGroupNotetags($dataWeapons);
		// Know that $gameSystem is null here
	}
	return true;
};

// Called when RPG loads and on new game, and... 
Echomap.Attributes.DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function () {
    //Echomap.Utils.debug( { plugname:"Attributes", methodname:"DataManager", msg1:"setupNewGame"} );
	Echomap.Utils.log2("Attributes", "DataManager", "setupNewGame", Echomap.LogDebug, "DataManager", "setupNewGame");
	Echomap.Attributes.DataManager_setupNewGame.call(this);
    //if(!Echomap.Attributes.DataLoaded){
        //Echomap.Attributes.DataLoaded = true;
		if(!Echomap._attributeLoader)
			Echomap._attributeLoader = new Echomap_Attributes();		
    	if ($gameActors && $gameActors._data) {
            var eProc = new Echomap_AttribLoader();
			eProc.processNotetagsToGame( $gameActors._data );
    		//eProc.processNotetagsToGame($gameActors._data);
			//eProc.processNotetagsToGame($gameEnemies._data);
			//Echomap._attributeLoader = new Echomap_Attributes();
    	}
    //}
};

//
Echomap.Attributes.DataManager_loadDatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function() {
	Echomap.Attributes.DataManager_loadDatabase.call(this);
	//
	if(!Echomap._attributeLoader)
		Echomap._attributeLoader = new Echomap_Attributes();
	//
}

//-----------------------------------------------------------------------------


//=============================================================================
// Game_Interpreter_pluginCommand
//=============================================================================
Echomap.Attributes.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Echomap.Attributes.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'SetActorGender') {
        // 1 actorId
        // 2 gender
		var process
		if(Echomap._attributeLoader)
			process = Echomap._attributeLoader
		else 
			process = new Echomap_Attributes();
		process.setActorGender(args[0],args[1]);
	}
    if (command === 'SetAttribute') {
        // 1 actorId
        // 2 key
        // 3 value
		var process
		if(Echomap._attributeLoader)
			process = Echomap._attributeLoader
		else 
			process = new Echomap_Attributes();
		process.setAttribute(args[0],args[1],args[2]);
	}
    if (command === 'GetAttribute') {
        // 1 actorId
        // 2 key
		var process
		if(Echomap._attributeLoader)
			process = Echomap._attributeLoader
		else 
			process = new Echomap_Attributes();

		process.getAttribute(args[0],args[1]);
	}
    //
};
//-----------------------------------------------------------------------------

//=============================================================================
// End of File
//=============================================================================