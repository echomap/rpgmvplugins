//=============================================================================
// ECH_TextOnScreen.js
// DESC
// Echomap Plugin echomap<echomap@gmail.com>
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v0.10 TODO
 * @author Echomap
 *
 * @param ---General---
 * @default
 * 
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * <None>
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 * -<None> 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * -<None>
 * ============================================================================
 * Plugin Script/Functions
 * ============================================================================
 * -<None>
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
Imported["ECH - TextOnScreen"] = '20231018.1';
Imported.ECH_TextOnScreen = true;

var Echomap = Echomap || {};
Echomap.ECH_TextOnScreen = Echomap.ECH_TextOnScreen || {};
Echomap.ECH_TextOnScreen.MyPluginName = "ECH_TextOnScreen";
Echomap.ECH_TextOnScreen.alias = {}
if(Echomap.Utils)
	Echomap.Utils.sayHello("ECH_TextOnScreen", Imported["ECH - TextOnScreen"] );

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.ECH_TextOnScreen.Parameters = PluginManager.parameters("ECH_TextOnScreen");
Echomap.Params = Echomap.Params || {};

//Echomap.ECH_TextOnScreen.SingleActorMode = eval(Echomap.ECH_TextOnScreen.Parameters['SingleActorMode'] || false );
//-----------------------------------------------------------------------------

//=============================================================================
// ** This Plugin
//=============================================================================

//==============================
// * Plugin Object
//==============================

function Sprite_ScreenText() {
    this.initialize.apply(this, arguments);
}

Sprite_ScreenText.prototype = Object.create(Sprite_Base.prototype);
Sprite_ScreenText.prototype.constructor = Sprite_ScreenText;

Sprite_ScreenText.prototype.initialize = function(args) {
    Sprite_Base.prototype.initialize.call(this);
	//
	this.bitmap = new Bitmap(Graphics.width, Graphics.height);
	this.z = 50;
	this.opacity = 0;
	//
	this._text = args.text;
	this._x = args.x;
	this._y = args.y;
	this._duration = args.duration;
	this._fadeInDuration = args.fadeInDuration;
	this._fadeDuration = args.fadeDuration;
	//
	/*setTimeout(function () {
		//doWork
		}
	}, 0);
	this._endTimer = setTimeout(function() {
		this.stop();
	}.bind(this), delay * 1000);
	*/
	setTimeout(() => {
		const fadeInInterval = setInterval(() => {
			this.opacity += 255 / (this._fadeInDuration / (1000 / 60));
			if (this.opacity >= 255) {
				clearInterval(fadeInInterval);
			}
		}, 1000 / 60); // 60 frames per second
	}, 0);
	//
	setTimeout(() => {
		const fadeOutInterval = setInterval(() => {
			this.opacity -= 255 / (this._fadeDuration / (1000 / 60));
			if (this.opacity <= 0) {
				clearInterval(fadeOutInterval);
				console.log("-- remove text")
				SceneManager._scene.removeChild(this);
			}
		}, 1000 / 60); // 60 frames per second
	}, this._duration);
};

Sprite_ScreenText.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
	//
	var text = this._text
	const width = Graphics.width;
	const height = Graphics.height;
	var x = this._x
	var y = this._y
	console.log("-- show text: '" + text + "'")
	this.bitmap.drawText(text, x, y, width, height, 'center');
	
};
//==============================
// * Plugin Functions
//==============================

//var elm = {}
Echomap.ECH_TextOnScreen.showText = function(elm){
	//
	if(elm.x) elm.x = parseInt(elm.x)
	if(elm.y) elm.y = parseInt(elm.y)
	if(elm.duration) elm.duration = parseInt(elm.duration)
	if(elm.fadeInDuration) elm.fadeInDuration = parseInt(elm.fadeInDuration)
	if(elm.fadeDuration) elm.fadeDuration     = parseInt(elm.fadeDuration)	
	//if(elm.fontSize) elm.fontSize = parseInt(elm.fontSize)
	//
	var tsprite = new Sprite_ScreenText(elm);
	SceneManager._scene.addChild(tsprite);
}
//=============================================================================
// ** Game_System
//=============================================================================	

//==============================
// * XXX
//==============================


//==============================
// * PluginCommand
//==============================

Echomap.ECH_TextOnScreen.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Echomap.ECH_TextOnScreen.Game_Interpreter_pluginCommand.call(this, command, args);
	if (command !== 'TextOnScreen' && command !== 'ECH_TextOnScreen') {
		return;
	}
	switch (args[0]) {
		case 'showText':
			var str = args.slice(1).join(' ') //eval( )
			const regex = /([a-z]\w*)=((?:[^"]|"[^"]+")+?)(?=,\s*[a-z]\w*=|$)/g
			var m;
			//var els = [];
			var elm = {}
			while ((m = regex.exec(str)) !== null) {
				//els.push(`${m[1]}: ${m[2]}`);
				elm[ `${m[1]}` ] = `${m[2]}`
			}
			//console.log("els=")
			//console.log(els)
			Echomap.ECH_TextOnScreen.showText(elm);
/*
var text = args[1]
var x = eval(args[2]) 			var y = eval(args[3])
var fontSize = eval(args[2])
var fontFace 			//var textColor
var outlineEnabled			//var outlineColor
var duration 			var fadeInDuration 			var fadeDuration
sfx, sfxVolume,  parseInt(sfxPitch));
*/
			break;
		default:
			console.error('Error with param: ' + args[0]);
	}
};

//=============================================================================
// End of File
//=============================================================================
