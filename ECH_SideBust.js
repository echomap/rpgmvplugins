//=============================================================================
// ECH_SideBust.js
// SideBust image/window
// Echomap Plugin echomap<echomap@gmail.com>
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v0.10 (Requires ECH_Utils.js) - Creates an updattable side image
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
 * @param basedir
 * @parent ---General---
 * @type string
 * @desc basedir
 * @default img/sidebust/
 * 
 * @param showatstart
 * @parent ---General---
 * @type boolean
 * @desc showatstart (disabled until i figure out how to check if a save is loaded vs new game)
 * @default false
 * 
 * @param showincombat
 * @parent ---General---
 * @type boolean
 * @desc showincombat
 * @default false
 *
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Plugin to show a 'bust' of the actor to the right in a window.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 * -<None> 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * Use: SideBust or ECH_SideBust, then the next word as:
 *  debug
 *  changeLayer
 *  face2
 *  addBottoms
 * 
 * ============================================================================
 * Plugin Script/Functions
 * ============================================================================
 * Echomap.ECH_SideBust.debug()
 * Echomap.ECH_SideBust.changeLayerByID(layerID, filename, x, y, hue, toneR, toneG, toneB, gray) 
 * Echomap.ECH_SideBust.disable()
 * Echomap.ECH_SideBust.enable()
 * 
 * ============================================================================
 * Plugin Notes
 * ============================================================================
 * -<None>
 * ============================================================================
 * Plugin Internals
 * ============================================================================
 * Echomap_SideBust_SpriteQueue = new Echomap_SideBust_SpriteQueue();
 * Echomap.ECH_SideBust.sidewindow = myWindow;
 * 	
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 0.10:
 * - 2023 10 18
 *
 * ============================================================================
 * TODO
 * ============================================================================
 * -<None>
 *
 * ============================================================================
 * Plugin License
 * ============================================================================
 * https://choosealicense.com/licenses/agpl-3.0/
 * echomap@gmail.com
 */
//=============================================================================

var Imported = Imported || {};
Imported["ECH - SideBust"] = '20230903.1';
Imported.ECH_SideBust = true;

if (Imported["ECH - Utils"] === undefined) {
  throw new Error("Please add ECH_Utils before "+"ECH_SideBust"+"!");
}

var Echomap = Echomap || {};
Echomap.ECH_SideBust = Echomap.ECH_SideBust || {};
Echomap.ECH_SideBust.MyPluginName = "ECH_SideBust";
if(Echomap.Utils)
	Echomap.Utils.sayHello("ECH_SideBust", Imported["ECH - SideBust"] );

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.ECH_SideBust.Parameters = PluginManager.parameters("ECH_SideBust");
Echomap.Params = Echomap.Params || {};
Echomap.ECH_SideBust.LogLevel     = Number(Echomap.ECH_SideBust.Parameters['LogLevel'] || 0 );
Echomap.ECH_SideBust.baseDir      = Echomap.ECH_SideBust.Parameters['basedir'] || "img/sidebust/";
Echomap.ECH_SideBust.showatstart  = eval(Echomap.ECH_SideBust.Parameters['showatstart'] || false );
Echomap.ECH_SideBust.showincombat = eval(Echomap.ECH_SideBust.Parameters['showincombat'] || false );
//Echomap.ECH_SideBust.WindowX = Echomap.ECH_SideBust.Parameters['WindowX'] || false ;
//Echomap.ECH_SideBust.WindowY = Echomap.ECH_SideBust.Parameters['WindowY'] || false ;
//Echomap.ECH_SideBust.BustX   = Echomap.ECH_SideBust.Parameters['BustX'] || false ;
//Echomap.ECH_SideBust.BustY   = Echomap.ECH_SideBust.Parameters['BustY'] || false ;
//-----------------------------------------------------------------------------

//=============================================================================
// ** This Plugin
//=============================================================================

//==============================
// * Plugin Commands
//==============================
Echomap.ECH_SideBust.debug = function () {
	console.log("debug>>")
	for (let key in Echomap_SideBust_SpriteQueue.layerImagename ) {
		var obj = Echomap_SideBust_SpriteQueue.layerImagename[key]
		console.log("key: " +key+ "=" +obj)
	}
	console.log("<<debug")
}

//Echomap.ECH_SideBust.changeLayerByID(layerID, filename, X, Y, 350, -30, -30, -30, 0);
Echomap.ECH_SideBust.changeLayerByID = function (layerID, filename, x, y, hue, toneR, toneG, toneB, gray) {
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "changeLayerByID", Echomap.LogDebug,  "Called!", "layerID", layerID, "filename", filename)
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "changeLayerByID", "Called");
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "changeLayerByID", "layerID", layerID);
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "changeLayerByID", "filename", filename);
	x = x || 0;
	y = y || 0;
	hue = hue || 0;
	toneR = toneR || 0;
	toneG = toneG || 0;
	toneB = toneB || 0;
	gray = gray || 0;
	var smooth = false;
	//Echomap_SideBust_SpriteQueue
	//TODO use layerImagename to not make sprite changes when name is the same?
	//console.log(Echomap_SideBust_SpriteQueue.sprite(layerID))
	if(Echomap_SideBust_SpriteQueue.sprite(layerID)!=null){
		Echomap_SideBust_SpriteQueue.clearLayer(layerID);
		//Echomap_SideBust_SpriteQueue.sprite(layerID).visible = false;
		//Echomap_SideBust_SpriteQueue.sprite(layerID).destroy();
	}
	if(filename==null){
		Echomap_SideBust_SpriteQueue.clearLayer(layerID);
		//if(Echomap_SideBust_SpriteQueue.sprite(layerID)!=null){
		//	Echomap_SideBust_SpriteQueue.sprite(layerID).visible = false;
		//	Echomap_SideBust_SpriteQueue.sprite(layerID).destroy();
		//	Echomap_SideBust_SpriteQueue.sprite(layerID) = null;
		//}
	} else {
		Echomap_SideBust_SpriteQueue.newSprite(layerID,filename, x, y, smooth, hue, toneR, toneG, toneB, gray)
		//Echomap_SideBust_SpriteQueue.sprite(layerID).x = x;
		//Echomap_SideBust_SpriteQueue.sprite(layerID).y = y;
	}
	//
	Echomap.ECH_SideBust._showSprites();
}
/*
-- Old Test Functions
Echomap.ECH_SideBust.changeLayer0 = function (filename, x, y) {
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "changeLayer0", "Called");	
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "changeLayer0", Echomap.LogDebug,  "Called!")
	var x = x || 0;
	var y = y || 0;
	Echomap.ECH_SideBust.changeLayerByID(0, filename, x, y);
}
Echomap.ECH_SideBust.changeToFace2 = function () {
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "changeToFace2", "Called");
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "changeToFace2", Echomap.LogDebug,  "Called!")
	var x = x || 0;
	var y = y || 0;
	Echomap.ECH_SideBust.changeLayerByID(1, "face_2", x, y);
}
Echomap.ECH_SideBust.addBottoms = function () {
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "addBottoms", "Called");
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "addBottoms", Echomap.LogDebug,  "Called!")
	var x = x || -100;
	var y = y || 0;
	Echomap.ECH_SideBust.changeLayerByID(3, "actor02_in_b_bottom", x, y);
}
*/

Echomap.ECH_SideBust.disable = function() {
	$gameSystem._eEnableSideBust = false
	Echomap.ECH_SideBust.sidewindow.visible = false
	Echomap.ECH_SideBust._showSprites()
};
Echomap.ECH_SideBust.enable = function() {
	$gameSystem._eEnableSideBust = true
	Echomap.ECH_SideBust.sidewindow.visible = true
	Echomap.ECH_SideBust._showSprites()
};

//==============================
// * Plugin -- Setup
//==============================

Echomap.ECH_SideBust._showSprites = function () {
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "showSprites", "Called");
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "showSprites", Echomap.LogDebug,  "Called!")
	//
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "$gameSystem._eEnableSideBust", $gameSystem._eEnableSideBust);
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "showSprites", Echomap.LogDebug,   "$gameSystem._eEnableSideBust", $gameSystem._eEnableSideBust)
	if(Echomap.ECH_SideBust.sidewindow!=undefined)
		//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "Echomap.ECH_SideBust.sidewindow.visible", Echomap.ECH_SideBust.sidewindow.visible);
		Echomap.Utils.log2("SideBust", "ECH_SideBust", "showSprites", Echomap.LogDebug,  "Echomap.ECH_SideBust.sidewindow.visible", Echomap.ECH_SideBust.sidewindow.visible);
	else
		//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "Echomap.ECH_SideBust.sidewindow", "not defined yet");
		Echomap.Utils.log2("SideBust", "ECH_SideBust", "showSprites", Echomap.LogDebug, "Echomap.ECH_SideBust.sidewindow", "not defined yet");

	if(!$gameSystem._eEnableSideBust || !Echomap.ECH_SideBust.sidewindow){
		//TODO hide existing?
		return;
	}
	
	//Echomap_SideBust_SpriteQueue
	if(Echomap_SideBust_SpriteQueue.sprites!=null && 
		Echomap_SideBust_SpriteQueue!=null && Echomap.ECH_SideBust.sidewindow!=null ) {
		for (var sprite of Echomap_SideBust_SpriteQueue.sprites) {
			if( sprite!=null ){
				//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "showSprites", "ping");
				Echomap.ECH_SideBust.sidewindow.addChild(sprite);
				sprite.x = sprite.x;
				sprite.y = sprite.y;
				//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "showSprites", "added sprite to window" );
				Echomap.Utils.log2("SideBust", "ECH_SideBust", "showSprites", Echomap.LogDebug,   "added sprite to window" );
			}
		}
		//console.log(Echomap_SideBust_SpriteQueue.sprites);
	}
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "showSprites", "Done");
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "showSprites", Echomap.LogDebug,   "Done" );
}//showSprites

Echomap.ECH_SideBust._setupSprites = function () {
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "setupSprites", "Called");
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "setupSprites", Echomap.LogDebug,   "Called" );
	//Echomap.ECH_SideBust.sidewindow.hide();
    if(Echomap_SideBust_SpriteQueue == undefined)
        Echomap_SideBust_SpriteQueue = new Echomap_SideBust_SpriteQueue();
	/* 20230904
	var hue = 0;
	var smooth = false;
	//
	Echomap.ECH_SideBust.sprites[0] = new Sprite( 
			ImageManager.loadBitmap(Echomap.ECH_SideBust.baseDir, "actor02_body_1", hue, smooth)
	);
	//
	Echomap.ECH_SideBust.sprites[1] = new Sprite( 
			ImageManager.loadBitmap(Echomap.ECH_SideBust.baseDir, "actor02_face_1", hue, smooth)
	);
	*/
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "setupSprites", "Done");
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "setupSprites", Echomap.LogDebug,   "Done" );
}

Echomap.ECH_SideBust._initializeSideWindow = function (tScene) {
	//
	var xs = $gameMap.tileWidth()*7-18;
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "Width", xs);
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "initializeSideWindow", Echomap.LogDebug,   "Width", xs);
	var myWindow = Echomap.ECH_SideBust.sidewindow
	if(Echomap.ECH_SideBust.sidewindow == undefined){
		myWindow = new ECH_Side_Window(Graphics.width-xs, 0, xs, Graphics.height);
	}
    if(Echomap_SideBust_SpriteQueue == undefined)
        Echomap_SideBust_SpriteQueue = new Echomap_SideBust_SpriteQueue();

	//myWindow.opacity = 160;
	//myWindow.opacity = 0;
	Echomap.ECH_SideBust.sidewindow = myWindow;
	//console.log(Echomap.ECH_SideBust.MyPluginName+": MyWindow: Created");	
    //Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "createMapNameWindow", "MyWindow Created");
	Echomap.Utils.log2("SideBust", "ECH_SideBust", "initializeSideWindow", Echomap.LogDebug,   "MyWindow Created");
	// add this window as a child to the scene, which is when you're finally able to see it on screen
	tScene.addChild(myWindow);
	//
	Echomap.ECH_SideBust.sidespriteidx = myWindow.children.length;
	//console.log(myWindow.children);
	//
	Echomap.ECH_SideBust._setupSprites();	
	//
}

//==============================
// * Plugin Window
//==============================
function ECH_Side_Window() {
	//this function will run whenever we make a new MyWindow object(a new window of this type)
	// arguments is a special keyword, which basically means all the arguments passed into MyWindow upon creation, will be sent to the initialize method
	this.initialize.apply(this, arguments);
}

//This line of code gives us all the functionality provided in Window_Base, and makes it a part of our MyWindow class
ECH_Side_Window.prototype = Object.create(Window_Base.prototype);
//This sets the constructor to be MyWindow; nothing special here
ECH_Side_Window.prototype.constructor = ECH_Side_Window;

//This is the initialize method that's called above when my window is instantiated.
//The argument keyword essentially passes the information you enter into the parameters x, y, width, height below
ECH_Side_Window.prototype.initialize = function(x, y, width, height) {
	//This call, calls the original code provided in the Window_Base.prototype function, allowing us to make use of it (think of it like copy and pasting instructions)
	//This is only important, because we plan to add more code to when we initialize a window.
	Window_Base.prototype.initialize.call(this, x, y, width, height);
}

//The core of any new window class; this is what handles processing for the window while the game is running
//We call the Window_Base.prototype update method, so we can use that code and also add more to this function.
ECH_Side_Window.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	//called every frame? console.log("MyWindow: updated ");
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "MyWindow", "update");
}
ECH_Side_Window.prototype.createContents = function() {
	Window_Base.prototype.createContents.call(this);
	//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "MyWindow", "createContents");
	Echomap.Utils.log2("SideBust", "ECH_Side_Window", "createContents", Echomap.LogDebug,   "Called");
	//
}

//==============================
// * Plugin Worker Object
//==============================
function Echomap_SideBust_SpriteQueue() {
	//console.log('Echomap_SideBust_SpriteQueue: Created' );
	Echomap.Utils.log2("SideBust", "Echomap_SideBust_SpriteQueue", "Constrcutor", Echomap.LogDebug,   "initialize");
    this.initialize.apply(this, arguments);
}
Echomap_SideBust_SpriteQueue.prototype = Object.create(Object.prototype);
Echomap_SideBust_SpriteQueue.prototype.constructor = Echomap_SideBust_SpriteQueue;

Echomap_SideBust_SpriteQueue.sprites = [];
Echomap_SideBust_SpriteQueue.layerImagename = [];

Echomap_SideBust_SpriteQueue.prototype.initialize = function() {
	//console.log('Echomap_SideBust_SpriteQueue: initialize' );
	Echomap.Utils.log2("SideBust", "Echomap_SideBust_SpriteQueue", "initialize", Echomap.LogDebug,   "initialize");
    this.sprites = []
	this.layerImagename = []
	//
	sprites = [5]
	for (i = 0; i < sprites.length; i ++)
	{
		sprites[i] = null;
		layerImagename[i] = null;
	}
};

Echomap_SideBust_SpriteQueue.sprite = function(index) {
    return this.sprites[index];
};
Echomap_SideBust_SpriteQueue.prototype.getSprite = function (index) {
    //Echomap.Utils.log('queue', 'requeue', eProc.toString() );
    return this.sprites[index];
}
Echomap_SideBust_SpriteQueue.prototype.queue = function (eProc) {
    //Echomap.Utils.log('queue', 'requeue', eProc.toString() );
    //ccgqueue.push(eProc);
}

Echomap_SideBust_SpriteQueue.clearLayer = function(layerID) {
	if(Echomap_SideBust_SpriteQueue.sprite(layerID)!=null){
		Echomap_SideBust_SpriteQueue.sprite(layerID).visible = false;
		Echomap_SideBust_SpriteQueue.sprite(layerID).destroy();
		Echomap_SideBust_SpriteQueue.sprites[layerID] = null;
		Echomap_SideBust_SpriteQueue.layerImagename[layerID] = null;
		//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "cleared", "layerID");
		Echomap.Utils.log2("SideBust", "Echomap_SideBust_SpriteQueue", "clearLayer", Echomap.LogDebug,   "Called");
	}
}

Echomap_SideBust_SpriteQueue.newSprite = function(layerID, filename, x, y, smooth, hue, toneR, toneG, toneB, gray) {
	x = x || 0;
	y = y || 0;
	hue = hue || 0;
	toneR = toneR || 0;
	toneG = toneG || 0;
	toneB = toneB || 0;
	gray = gray || 0;
	//??
	smooth = smooth || false;
	var tones = [toneR, toneG, toneB, gray]
	//
	//TODO check if exists?
	//var path1 = Echomap.ECH_SideBust.baseDir + encodeURIComponent(filename) + '.png';
	//var path2 = decodeURIComponent(path1)
	//
	var bitmap = ImageManager.loadBitmap(Echomap.ECH_SideBust.baseDir, filename, hue, smooth)
	console.log("filename: '" +filename+ "'")
	bitmap.addLoadListener(function() {
		if( toneR!=0 || toneG!=0 || toneB!=0 ){
			bitmap.adjustTone(toneR,toneG,toneB);
		}
		if(hue>0){
			bitmap.rotateHue(hue);
		}
	});
	this.sprites[layerID] = new Sprite(bitmap);
	//this.sprites[layerID] = new Sprite(
	//		ImageManager.loadBitmap(Echomap.ECH_SideBust.baseDir, filename, hue, smooth)
	//	);
	this.layerImagename[layerID] = filename;
	this.sprites[layerID].x = x;
	this.sprites[layerID].y = y;

	// hue, toneR, toneG, toneB
	//this.sprites[layerID].setColorTone(tones)
	//this.sprites[layerID].
}
		
//=============================================================================
// ** Game_System
//=============================================================================

//==============================
// * Game_System
//==============================
// Initialize
Echomap.ECH_SideBust.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Echomap.ECH_SideBust.Game_System_initialize.call(this);
	//
	Echomap.Utils.setLogLevel("SideBust", Echomap.ECH_SideBust.LogLevel)
	Echomap.Utils.log2("SideBust", "Game_System", "initialize", Echomap.LogInfo,  "Startup!")
};

//==============================
// * Scene_Battle
//==============================
//1 - Setup Window
Echomap.ECH_SideBust.Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
	Echomap.ECH_SideBust.Scene_Battle_createAllWindows.call(this)
	//
	if(Echomap.ECH_SideBust.showincombat) {
		Echomap.ECH_SideBust._initializeSideWindow(this)
	}
}

//==============================
// * Scene_Map
//==============================
//1 - Setup Window
Echomap.ECH_SideBust.Scene_Map_createMapNameWindow = Scene_Map.prototype.createMapNameWindow;
Scene_Map.prototype.createMapNameWindow = function() {
	Echomap.ECH_SideBust.Scene_Map_createMapNameWindow.call(this);
	//
	Echomap.Utils.log2("SideBust", "Scene_Map", "createMapNameWindow", Echomap.LogInfo, "Called");
	//
	Echomap.ECH_SideBust._initializeSideWindow(this)
}

/*
	var xs = $gameMap.tileWidth()*7-18;
	Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "Width", xs);
	var myWindow = Echomap.ECH_SideBust.sidewindow
	if(Echomap.ECH_SideBust.sidewindow == undefined){
		myWindow = new ECH_Side_Window(Graphics.width-xs, 0, xs, Graphics.height);
	}
    if(Echomap_SideBust_SpriteQueue == undefined)
        Echomap_SideBust_SpriteQueue = new Echomap_SideBust_SpriteQueue();

	//myWindow.opacity = 160;
	//myWindow.opacity = 0;
	Echomap.ECH_SideBust.sidewindow = myWindow;
	//console.log(Echomap.ECH_SideBust.MyPluginName+": MyWindow: Created");	
    Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "createMapNameWindow", "MyWindow Created");
	// add this window as a child to the scene, which is when you're finally able to see it on screen
	this.addChild(myWindow);
	//
	Echomap.ECH_SideBust.sidespriteidx = myWindow.children.length;
	//console.log(myWindow.children);
	//
	Echomap.ECH_SideBust._setupSprites();	
	//
}//createMapNameWindow
*/

//2
// Calls; createMessageWindow(), createScrollTextWindow()
Echomap.ECH_SideBust.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
	Echomap.ECH_SideBust.Scene_Map_createAllWindows.call(this);
	//
	Echomap.Utils.log2("SideBust", "Scene_Map", "createAllWindows", Echomap.LogInfo, "Called");
}

//3
// Calls: createSpriteset(), this.createMapNameWindow(), createWindowLayer(), createAllWindows()
Echomap.ECH_SideBust.Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
	Echomap.ECH_SideBust.Scene_Map_createDisplayObjects.call(this);
	//
    if(Echomap_SideBust_SpriteQueue == undefined)
        Echomap_SideBust_SpriteQueue = new Echomap_SideBust_SpriteQueue();
	Echomap.Utils.log2("SideBust", "Scene_Map", "createDisplayObjects", Echomap.LogInfo, "Called");
	//
	if($gameSystem._eEnableSideBust)
		Echomap.ECH_SideBust._showSprites();
}//createDisplayObjects

//==============================
// * Scene_Boot
//==============================
// - Setup Images
Echomap.ECH_SideBust.Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
Scene_Boot.prototype.loadSystemImages = function () {
	Echomap.ECH_SideBust.Scene_Boot_loadSystemImages.call(this);
	//
	Echomap.ECH_SideBust._setupSprites();
	
	//if(Echomap.ECH_SideBust.showatstart)
		Echomap.ECH_SideBust.sidewindow.visible = true
	//else
		//Echomap.ECH_SideBust.sidewindow.visible = false

	//Echomap.ECH_SideBust._showSprites();
	/*
	OLD code prototype
	for (var i_1 in Tachie.windowColors) {
		var color_2 = Tachie.windowColors[i_1];
		if (color_2 > 0) {
			ImageManager.loadSystem('Tachie_Window' + color_2);
		}
	}
	if (Tachie.AUTO_MODE_KEY && Tachie.AUTO_MODE_KEY.length > 0) {
		for (var i = 0; i < Tachie.AUTO_MODE_MARK_TOTAL_FRAME; i++) {
			ImageManager.loadSystem('Tachie_Auto_' + (i + 1));
		}
	}
	*/
};

//==============================
// * Game_Map - Transfer and... ?
//==============================
/*
Echomap.ECH_SideBust.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
	Echomap.ECH_SideBust.Game_Map_setup.call(this, mapId);
	//
	Echomap.ECH_SideBust._showSprites();
}
*/
/*
Echomap.ECH_SideBust.Game_Map_setupStartingMapEvent = Game_Map.prototype.setupStartingMapEvent;
Game_Map.prototype.setupStartingMapEvent = function() {
	Echomap.ECH_SideBust.Game_Map_setupStartingMapEvent.call(this);
	//
	Echomap.ECH_SideBust._showSprites();	
}
*/

//=============================================================================
// ** Game_Interpreter
//=============================================================================	

//==============================
// * PluginCommand
//==============================

Echomap.ECH_SideBust.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Echomap.ECH_SideBust.Game_Interpreter_pluginCommand.call(this, command, args);
	if (command !== 'SideBust' && command !== 'ECH_SideBust') {
		//Echomap.Utils.log(Echomap.ECH_SideBust.MyPluginName, "pluginCommand",  "Wrong thingie", command );
		return;
	}
	Echomap.Utils.log2("SideBust", "Game_Interpreter", "pluginCommand", Echomap.LogInfo, args[0]);
	switch (args[0]) {
		case 'changeLayer':
			if (!args[1]) {
				console.error("The argument for " + args[0] + " of the plugin command "+command+" is insufficient. actorId is required");
				return;
			}
			var layerID = 0;
			var filename = "base";
			var x = 0;
			var y = 0;
			if (args[1]) 
				layerID = args[1];
			if (args[2]) 
				filename = args[2];
			if (args[3]) 
				x = args[3];
			if (args[4]) 
				y = args[4];
			Echomap.ECH_SideBust.changeLayerByID(layerID, filename, x, y);
			break;
		case 'face2':
			Echomap.ECH_SideBust.changeToFace2();
			break;
		case 'addBottoms':
			Echomap.ECH_SideBust.addBottoms();
			break;
		case 'debug':
			Echomap.ECH_SideBust.debug();
			break;			
		default:
			console.error('Error with param: ' + args[0]);
	}
};

//=============================================================================
// End of File
//=============================================================================
