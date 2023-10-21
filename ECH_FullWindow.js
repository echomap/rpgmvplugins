//=============================================================================
// ECH_FullWindow.js
// Show a full screen window with text from a DataSource
// Echomap Plugin echomap<echomap@gmail.com>
//=============================================================================

//=============================================================================
 /*:en
 * @author echomap
 * @plugindesc A plugin that displays a full sized window
 *
 *
 * @param showKeybind
 * @desc button to view the backlog / or cancel it besides the ESC
 * @default pageup
 *
 * @param marginLeft
 * @desc The space to the left of the main text. If you change it, the line feed position may shift.
 * @default 70
 *
 * @param marginRight
 * @desc The space to the right of the main text. If you change it, the line feed position may shift.
 * @default 30
 *
 * @param nameLeft
 * @desc The space to the left of the name.
 * @default 20
 *
 * @param fontSize
 * @desc The font size. If you change it, the line feed position may shift.
 * @default 24
 *
 * @param scrollSpeed
 * @desc Speed when scrolling with cursor keys
 * @default 5
 * 
 * @param PageScrollSpeed
 * @desc Speed when scrolling with PAGE keys
 * @default 25
 *
 * @param windowHeight
 * @desc The height of the window. The larger it is, the more you can display.
 * @default 2000
 *
 * @param maxLogCount
 * @desc the maximum number of logs can be stored
 * @default 50
 *
 * @param bottmMargin
 * @desc is the free space below the backlog window
 * @default 50
 *
 * @param logMargin
 * @desc is the gap between logs
 * @default 44
 *
 * @param windowSkin
 * @desc This window is used to view the backlog
 * @default WindowBacklog
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param backOpacity
 * @desc Background transparency
 * @default 128
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Show a full screen window with text from a DataSource
 *   Based off of Sabakan's BackLog plugin, params/idea (Ver 2016-03-30 20:06:42)
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 * -<None> 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * FullWindow or ECH_FullWindow
 * Sub-commands:
 *	-addLogData <datasourcename> <text>
 * 	-showLogData <datasourcename> <sourceTitle>
 *
 * Example:
 * FullWindow addLogData Log1 My data to log
 * ============================================================================
 * Plugin Script/Functions
 * ============================================================================
 * -Echomap.ECH_FullWindow.addLogData ( "datasource", "text" );
 * -Echomap.ECH_FullWindow.showLogData( "datasource", "title");
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
 * -2023 10 18
 *
 * ============================================================================
 * TODO
 * ============================================================================
 * -Test for other log Data
 * -Scene_EchLogData uses?
 * -TESTING
 * -scroll at bottom stop, or wrap?
 * ============================================================================
 * Plugin License
 * ============================================================================
 * https://choosealicense.com/licenses/agpl-3.0/
 * echomap@gmail.com
 */
 
var Imported = Imported || {};
Imported["ECH - FullWindow"] = "20231018.1"
Imported.ECH_FullWindow = true;

var Echomap = Echomap || {};
Echomap.ECH_FullWindow = Echomap.ECH_FullWindow || {};
Echomap.ECH_FullWindow.MyPluginName = "ECH_FullWindow";
Echomap.ECH_FullWindow.alias = {}
if(Echomap.Utils)
	Echomap.Utils.sayHello("ECH_FullWindow",Imported['ECH - FullWindow']);

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.ECH_FullWindow.Parameters = PluginManager.parameters("ECH_FullWindow");
Echomap.Params = Echomap.Params || {};
Echomap.ECH_FullWindow.showKeybind  = Echomap.ECH_FullWindow.Parameters['showKeybind'] || "pagedown";
Echomap.ECH_FullWindow.scrollSpeed  = Number( Echomap.ECH_FullWindow.Parameters['scrollSpeed'] || 5 );
Echomap.ECH_FullWindow.PageScrollSpeed  = Number( Echomap.ECH_FullWindow.Parameters['PageScrollSpeed'] || 25 );
Echomap.ECH_FullWindow.bottmMargin  = Number( Echomap.ECH_FullWindow.Parameters['bottmMargin'] || 50 );
Echomap.ECH_FullWindow.windowHeight = Number( Echomap.ECH_FullWindow.Parameters['windowHeight'] || 2000 );
Echomap.ECH_FullWindow.maxLogCount  = Number( Echomap.ECH_FullWindow.Parameters['maxLogCount'] || 50 );
Echomap.ECH_FullWindow.fontSize     = Number( Echomap.ECH_FullWindow.Parameters['fontSize'] || 24 );
Echomap.ECH_FullWindow.logMargin    = Number( Echomap.ECH_FullWindow.Parameters['logMargin'] || 44 );
Echomap.ECH_FullWindow.marginLeft   = Number( Echomap.ECH_FullWindow.Parameters['marginLeft'] || 70 );
Echomap.ECH_FullWindow.marginRight  = Number( Echomap.ECH_FullWindow.Parameters['marginRight'] || 30 );
Echomap.ECH_FullWindow.nameLeft     = Number( Echomap.ECH_FullWindow.Parameters['nameLeft'] || 20 );
Echomap.ECH_FullWindow.windowSkin   = Echomap.ECH_FullWindow.Parameters['windowSkin'] || "WindowBacklog";
Echomap.ECH_FullWindow.backOpacity  = Number( Echomap.ECH_FullWindow.Parameters['backOpacity'] || 230 );
Echomap.ECH_FullWindow._x = 0
//-----------------------------------------------------------------------------

//=============================================================================
// ** This Plugin
//=============================================================================	

//==============================
// * Plugin Data Source
//==============================

//Data Source List
Echomap.ECH_FullWindow.dataSources = []

// returns an array of text from that datasource
Echomap.ECH_FullWindow.getLogData = function(dataSourceName) {
	if( Echomap.ECH_FullWindow.dataSources[dataSourceName] )
		return Echomap.ECH_FullWindow.dataSources[dataSourceName]
	return []
}
// Add text to that datasource
Echomap.ECH_FullWindow.addLogData = function(dataSourceName, message) {
	if( Echomap.ECH_FullWindow.dataSources[dataSourceName] === undefined )
		Echomap.ECH_FullWindow.dataSources[dataSourceName] = []
	//
	var msg = Window_Base.prototype.convertEscapeCharacters(message)	
	var msglist  = msg.split(/[\r\n]+/);
	
	msglist.forEach((msg1) => {
		Echomap.ECH_FullWindow.dataSources[dataSourceName].push(msg1);
	});
	if (Echomap.ECH_FullWindow.dataSources[dataSourceName].length >= Echomap.ECH_FullWindow.maxLogCount) {
		Echomap.ECH_FullWindow.dataSources[dataSourceName].shift();
	}
}
// Clear all text to that datasource
Echomap.ECH_FullWindow.clearLogData = function(dataSourceName) {
	Echomap.ECH_FullWindow.dataSources[dataSourceName] = []
}
// Show text from this source to a full screen window
Echomap.ECH_FullWindow.showLogData = function(sourceName, sourceTitle) {
	var thisScene =  SceneManager._scene;
	Echomap.ECH_FullWindow._sourceName  = sourceName
	Echomap.ECH_FullWindow._sourceTitle = sourceTitle
	SceneManager.push(Scene_EchLogData)
}
Echomap.ECH_FullWindow.showLogData2 = function(sourceName, x, sourceTitle) {
	Echomap.ECH_FullWindow._x = x	
	Echomap.ECH_FullWindow.showLogData(sourceName, sourceTitle)
}

//==============================
// * Plugin Scene
//==============================

function Scene_EchLogData() {
    this.initialize.apply(this, arguments);
}

Scene_EchLogData.prototype = Object.create(Scene_MenuBase.prototype);
Scene_EchLogData.prototype.constructor = Scene_EchLogData;

Scene_EchLogData.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_EchLogData.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);    
    this.createStatusWindow();
    //this.refreshActor();
};
Scene_EchLogData.prototype.createStatusWindow = function() {
	var  sourceName = Echomap.ECH_FullWindow._sourceName
	var  sourceTitle = Echomap.ECH_FullWindow._sourceTitle
	this._windowECH_Full_Window = new ECH_Full_Window(sourceName, sourceTitle, Echomap.ECH_FullWindow._x, 0);
	SoundManager.playOk();
	this.addWindow(this._windowECH_Full_Window);
	this._windowECH_Full_Window.activate()
};

Scene_EchLogData.prototype.update = function() {
	Scene_Base.prototype.update.call(this)
	//
	if (Input.isTriggered(Echomap.ECH_FullWindow.showKeybind) || Input.isTriggered('cancel')) {
		this.removeChild(this._windowECH_Full_Window);
		this._windowECH_Full_Window.deactivate()
		this._windowECH_Full_Window = null;
		SoundManager.playCancel();
		SceneManager.pop(Scene_EchLogData)
	}
};

//==============================
// * Plugin Window
//==============================

function ECH_Full_Window() {
	this.initialize.apply(this, arguments);
}

ECH_Full_Window.prototype = Object.create(Window_Selectable.prototype);
ECH_Full_Window.prototype.constructor = ECH_Full_Window;

ECH_Full_Window.prototype.initialize = function( dataSourceName, dataSourceTitle, x, y ) {
	x = x || 0
	y = y || 0
	this._dataSourceName  = dataSourceName;
	this._dataSourceTitle = dataSourceTitle;
	Window_Selectable.prototype.initialize.call(this, x, y, Graphics.width, Echomap.ECH_FullWindow.windowHeight);
	this.drawLogs();
}
ECH_Full_Window.prototype.backPaintOpacity = function () {
	return Echomap.ECH_FullWindow.backOpacity; //128;
};
ECH_Full_Window.prototype.logMargin = function () {
	return Echomap.ECH_FullWindow.logMargin;
};
ECH_Full_Window.prototype.standardFontSize = function () {
	return Echomap.ECH_FullWindow.fontSize;
};
ECH_Full_Window.prototype.numLines = function() {
	var logData = Echomap.ECH_FullWindow.getLogData(this._dataSourceName)
    return logData.length;
};
ECH_Full_Window.prototype.maxItems = function() {
	//var logData = Echomap.ECH_FullWindow.getLogData(this._dataSourceName)
    return 0
};
ECH_Full_Window.prototype.loadWindowskin = function () {	
	if (Echomap.ECH_FullWindow.windowSkin.length > 0) 
		this.windowskin = ImageManager.loadSystem(Echomap.ECH_FullWindow.windowSkin);
};

ECH_Full_Window.prototype.drawLogs = function () {
	this._yPosOffset = 0
	this.contents.clear()
	
	var y = 0 + this._yPosOffset;
	var logData = Echomap.ECH_FullWindow.getLogData(this._dataSourceName)
	//
	this.drawTextEx("(Instructions: SCROLL: Up Arrow/Down Arrow, CLOSE: escape key)", Echomap.ECH_FullWindow.nameLeft, y);
	y += this.standardFontSize() + 8;
	height = this.standardFontSize() + 8;
	//
	this.drawGauge( 0, y, Graphics.width, 1, '#FFFFFF', '#000000') ;
	y += this.standardFontSize() + 8;
	height = this.standardFontSize() + 8;
	//
	var titleSides = " **** "
	this.drawTextEx(titleSides+this._dataSourceTitle+titleSides, Echomap.ECH_FullWindow.nameLeft, y);
	y += this.standardFontSize() + 8;
	height = this.standardFontSize() + 8;
	//
	for (var _i = 0, _a = logData; _i < _a.length; _i++) {
		var log = _a[_i];
		//
		this.drawTextEx(log, Echomap.ECH_FullWindow.marginLeft, y);
		//console.log(message.charAt(message.length - 1));
		y += this.standardFontSize() + 8;
		height = this.standardFontSize() + 8;
		
		//this.drawTextEx(message, marginLeft, y);
		//height += this._lineCount * (this.standardFontSize() + 8);
		//log.y = y + height;

		//var diff = y - Echomap.ECH_FullWindow.windowHeight + Echomap.ECH_FullWindow.bottmMargin;
		//Echomap.ECH_FullWindow.windowHeight
		//y += this.drawLog(log, y);
		y += this.logMargin();
	}
	//
	this.drawTextEx("(END of TEXT)", Echomap.ECH_FullWindow.nameLeft, y);
	y += this.standardFontSize() + 8;
	height = this.standardFontSize() + 8;
	this._maxHeight = y + height
	//
	console.log("Log last y: " + y);
};
ECH_Full_Window.prototype.update = function () {	
 	Window_Selectable.prototype.update.call(this);
	//_super.prototype.update.call(this);
	if (Input.isPressed('down')) {
		this.y -= Echomap.ECH_FullWindow.scrollSpeed;
		if (this.y < Graphics.height - this._maxHeight) {
			this.y = Graphics.height - this._maxHeight;
		}
	}
	else if (Input.isPressed('up')) {
		this.y += Echomap.ECH_FullWindow.scrollSpeed;
		if (this.y > 0) {
			this.y = 0;
		}
	} else if (Input.isPressed(Echomap.ECH_FullWindow.showKeybind) ) {
		console.log("Deactivate key pressed");
	} else if (Input.isPressed('pagedown')) {
		this.y -= Echomap.ECH_FullWindow.PageScrollSpeed;
		if (this.y < Graphics.height - this._maxHeight) {
			this.y = Graphics.height - this._maxHeight;
		}
	} else if (Input.isPressed('pageup')) {
		this.y += Echomap.ECH_FullWindow.PageScrollSpeed;
		if (this.y > 0) {
			this.y = 0;
		}
	}
	this.processWheel()
	this.processTouch() // TODO need to test
};

ECH_Full_Window.prototype.scrollDown = function() {
	this.y -= Echomap.ECH_FullWindow.scrollSpeed * 2;
	if (this.y < Graphics.height - this._maxHeight) {
		this.y = Graphics.height - this._maxHeight;
	}
};

ECH_Full_Window.prototype.scrollUp = function() {
	this.y += Echomap.ECH_FullWindow.scrollSpeed * 2;
	if (this.y > 0) {
		this.y = 0;
	}
};
//-----------------------------------------------------------------------------

//=============================================================================
// ** Game_System
//=============================================================================	

//==============================
// * Scene_Boot
//==============================

// To load the full screen window skin early
Echomap.ECH_FullWindow.alias.Scene_Boot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
	Echomap.ECH_FullWindow.alias.Scene_Boot_start.call(this);
	if (Echomap.ECH_FullWindow.windowSkin.length > 0) {
		ImageManager.loadSystem(Echomap.ECH_FullWindow.windowSkin);
	}
}

//=============================================================================
// ** Game_Interpreter
//=============================================================================	

//==============================
// * PluginCommand
//==============================

Echomap.ECH_FullWindow.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Echomap.ECH_FullWindow.Game_Interpreter_pluginCommand.call(this, command, args);
	if (command !== 'FullWindow' && command !== 'ECH_FullWindow') {
		return;
	}
	switch (args[0]) {
		case 'addLogData':
			Echomap.ECH_FullWindow.addLogData( args[1], args.slice(2).join(' ') );
			break;
		case 'showLogData':
			Echomap.ECH_FullWindow.showLogData( args[1], args.slice(2).join(' ') );
			break;
		case 'showLogData2':
			Echomap.ECH_FullWindow.showLogData2( args[1], 200, args.slice(2).join(' ') );
			break;
		default:
			console.error('Error with param: ' + args[0]);
	}
};

//=============================================================================
// End of File
//=============================================================================
