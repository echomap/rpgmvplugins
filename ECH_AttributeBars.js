//=============================================================================
// ECH_AttributeBars.js
// HUD bars
//   Version #1(scripts) based on: Galv's Variable Bar
// Echomap Plugin echomap<echomap@gmail.com>
//=============================================================================

//=============================================================================
/*:en
 * @plugindesc (Depends ECH_Attributes) A graphical bar that displays in the map scene to show 
 *  the current value of a max value visually using attributes.
 * @author Echomap Plugins
 *
 * @param ---General---
 * @default
 *
 * @param File Name
 * @parent ---General---
 * @type string
 * @desc File name to load JSON data from
 * @default "ECH_AttribHud.json"
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
 * Bars for things...
 * - Version #1, used script calls
 *   - Created and modified via scripts
 *   - $gameSystem._eattribBars
 *   - (havent testing this version in a bit, may remove)
 * - Version #2, uses a JSON file to load bar data.  (this.combohudkeys)
 *   - Shown in Scene_Battle and Scene_Map
 *
 * Example JSON file /data/ECH_AttribHud.json
 {
	"combohuds": {
		"one": {
			"backgroundimage": "CyberSpaceBlueGreen",
			"x": 965,
			"y": 5,
			"fields": {
				"Name":
				{
					"enable": true,
					"barmode":  1,
					"TitleAlign": "left",
					"title": "Name:",
					"tx": 5,
					"ty": 0,
					"tfontsize": 18,
					"ValueType":   "static",
					"ValueAssign": "Jenna",
					"ValueAlign": "left",
					"vx": 60,
					"vy": 0,
					"MaxType": "exclude",
					"MaxAssign": "",
					"MaxAlign": "left",
					"mtint": "#FFFFFF",
					"mx": 105,
					"my": 0
				}
			}
		}
	}
 }
 * Supports "Value Types":
 *	"exclude"
 *	"static"
 *	"attribute"
 *	"eval"
 *	"hp"
 *	"mp"
 *	"tp"
 *  "states"
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 * -<none>
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * -<none>
 * ============================================================================
 * Plugin Script/Functions
 * ============================================================================
 * Echomap.AttributeBars.disableAll()
 * Echomap.AttributeBars.enableAll()
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * 
 * To create a variable bar on screen, you can use the following script call:
 *
 * Echomap.AttributeBars.create(id,"barimage","barimage2",var1,var2,x,y,ox,oy, mode);
 *
 * id         = A unique id number and index to reference the variable bar
 * barimage   = Image name from /img/pictures/ to use for the variable bar
 * barimage2  = Image name from /img/pictures/ to use for the bar underlay
 * var1       = Variable id to use for current value of bar
 * var2       = Variable id to use for maximum value of bar
 * x          = X position of the bar images on the screen
 * y          = Y position of the bar images on the screen
 * ox         = The x offset of the barimage in relation to barimage2
 * oy         = The y offset of the barimage in relation to barimage2
 * tx	      = text x
 * ty
 * title      = title text
 * ttx        = title x
 * tty
 * mode       = 0=horizontal fill to the right, 1=vertical fill down, 2=vertical fill upwards
 *
 * If you create a new bar using the same id as another bar you have already
 * created, it will remove that bar and create the new one.
 *
 * To remove a variable bar from the screen, you can use:
 *
 * 	Echomap.AttributeBars.remove(id);
 *
 * To modify a variable bar, you can use the following:
 *
 *	Echomap.AttributeBars.mod(id).barimage = "image";
 *  Echomap.AttributeBars.mod(id).barimage2 = "image";
 *  Echomap.AttributeBars.mod(id).var1 = currentVarId;
 *  Echomap.AttributeBars.mod(id).var2 = maxVarId;
 *  Echomap.AttributeBars.mod(id).x = xPos;
 *  Echomap.AttributeBars.mod(id).y = yPos;
 *  Echomap.AttributeBars.mod(id).ox = oxPos;
 *  Echomap.AttributeBars.mod(id).oy = oyPos;
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * - v20231018.1 : initial
 *
 * ============================================================================
 * TODO
 * ============================================================================
 * -State Icons?
 *
 * ============================================================================
 * Plugin License
 * ============================================================================
 * https://choosealicense.com/licenses/agpl-3.0/
 * echomap@gmail.com
 */
//=============================================================================

var Imported = Imported || {};
Imported['ECH - AttributeBars'] = '20230901.1';
Imported.ECH_AttributeBars = true;

if (Imported["Echomap_Attributes"] === undefined) {
  throw new Error("Please add Echomap_Attributes before ECH_AttributeBars!");
}
var Echomap = Echomap || {};
Echomap.AttributeBars = Echomap.AttributeBars || {};
Echomap.AttributeBars.DataLoaded = false;
Echomap.AttributeBars.MyPluginName = "ECH_AttributeBars";
Echomap.AttributeBars.MyVersion = "20230901.1"
if(Echomap.Utils)
	Echomap.Utils.sayHello("AttributeBars",Imported['ECH - AttributeBars']);

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.AttributeBars.Parameters = PluginManager.parameters('ECH_AttributeBars');
Echomap.Params = Echomap.Params || {};
Echomap.AttributeBars.configurl  = String( Echomap.AttributeBars.Parameters['File Name'] || "ECH_AttribHud.json" );
Echomap.AttributeBars.showincombat = eval(Echomap.AttributeBars.Parameters['showincombat'] || false );
//Echomap.Params.attributeProfileTag = (Echomap.Attributes.Parameters['ProfileTag']) || "ECHAttributes";
//-----------------------------------------------------------------------------

//=============================================================================
// ** This Plugin
//=============================================================================

//==============================
// * Plugin Objects
//==============================

Echomap.AttributeBars.loadBarsFromJSON = function() {
	this.setupfromfile = false
	this._loadFromJSONFile( Echomap.AttributeBars.configurl, this._loadFileDataSuccess.bind(this), this._loadFileDataError.bind(this) );
}

Echomap.AttributeBars._loadFileDataSuccess = function(filedata) {	
	this.rawhuddata = filedata.huds
	this.combohuds = filedata.combohuds
	Echomap.AttributeBars._loadFileDataSuccessHuds(filedata);
	Echomap.AttributeBars._loadFileDataSuccessComboHuds(filedata);
}

Echomap.AttributeBars._loadFileDataSuccessComboHuds = function(filedata) {
	//console.log(this.combohuds);
	//	
	var pseudoArrayKeys = Object.keys(this.combohuds);
	this.combohudkeys = []
	pseudoArrayKeys.forEach(function(actor) {
		//console.log(actor);
		this.combohudkeys.push(actor);
	}, this);
	$gameSystem._eattribComboBarKeys = pseudoArrayKeys;
	//
	for (var i = 0; i < this.combohudkeys.length; i++) {
		var hkey = this.combohudkeys[i]
		var hVal = this.combohuds[hkey]
		
		var ComboHudObj = new Object();
		ComboHudObj.bg = hVal.backgroundimage
		ComboHudObj.x = hVal.x
		ComboHudObj.y = hVal.y
		//
		ComboHudObj.rawfields = hVal.fields
		ComboHudObj.fieldkeys = []
		ComboHudObj.fields = []
		var pseudoFieldKeys = Object.keys( hVal.fields );
		pseudoFieldKeys.forEach(function(actor) {
			//console.log(actor);
			ComboHudObj.fieldkeys.push(actor);
		}, this);
		
		for (var fi = 0; fi < ComboHudObj.fieldkeys.length; fi++) {
			var fkey = ComboHudObj.fieldkeys[fi]
			var fVal = hVal.fields[fkey]
			//console.log(hVal);
			var tHud = []
			tHud.enable = eval( fVal['enable'] || false )
			tHud.barmode = fVal['barmode'] || 0
			tHud.title = fVal['title'] || undefined
			tHud.TitleAlign = fVal['TitleAlign'] || "left"
			tHud.tx = fVal['tx'] || 0
			tHud.ty = fVal['ty'] || 0
			//tHud.ttint = fVal['ttint'] || 16777215
			tHud.ttint = fVal['ttint'] || "#FFFFFF"
			tHud.tfontsize = fVal['tfontsize'] || 16 //todo get from somewhere systemwise?
			tHud.ValueType = fVal['ValueType'] || undefined
			tHud.ValueAssign = fVal['ValueAssign'] || undefined
			tHud.ValueAlign = fVal['ValueAlign'] || "left"
			tHud.vx = fVal['vx'] || 0
			tHud.vy = fVal['vy'] || 0
			//tHud.vtint = fVal['vtint'] || 16777215
			tHud.vtint = fVal['vtint'] || "#FFFFFF"
			tHud.vtint3rd = fVal['vtint3rd'] || undefined
			tHud.vfontsize = fVal['vfontsize'] || 16 
			tHud.MaxType = fVal['MaxType'] || undefined
			tHud.MaxAssign = fVal['MaxAssign'] || undefined
			tHud.MaxAlign = fVal['MaxAlign'] || "left"
			tHud.mx = fVal['mx'] || 0
			tHud.my = fVal['my'] || 0
			//tHud.mtint = fVal['mtint'] || 16777215 
			tHud.mtint = fVal['mtint'] || "#FFFFFF"
			tHud.mfontsize = fVal['mfontsize'] || 16 
			//tHud.numfontsize = fVal['numfontsize'] || 16
			ComboHudObj.fields.push(tHud)
		}		
		//
		$gameSystem._eattribComboBars[hkey] = ComboHudObj;
	}
	
	//
	if(
		(Echomap.AttributeBars.showincombat && SceneManager._scene.constructor == Scene_Battle)
		||
		SceneManager._scene.constructor == Scene_Map ){
		Echomap.AttributeBars.enableAll()
		var thisScene =  SceneManager._scene;
		thisScene.createVarComboBars();
	}
	else 
		Echomap.AttributeBars.disableAll();
}

Echomap.AttributeBars._loadFileDataSuccessHuds = function(filedata) {
	//console.log(this.rawhuddata);
	
	var pseudoArrayKeys = Object.keys(this.rawhuddata);
	this.hudkeys = []
	pseudoArrayKeys.forEach(function(actor) {
		console.log(actor);
		this.hudkeys.push(actor);
	}, this);
	$gameSystem._eattribBarKeys = pseudoArrayKeys;
	//
	for (var i = 0; i < this.hudkeys.length; i++) {
		var hkey = this.hudkeys[i]
		var tHud = []
		//
		tHud.barimage  = this.rawhuddata[hkey]['image']  || "",
		tHud.barimage2 = this.rawhuddata[hkey]['image2'] || "",
		tHud.attribval = this.rawhuddata[hkey]['ValueAssign'] || 0,
		tHud.attribmax = this.rawhuddata[hkey]['MaxAssign'] || 0,			
//"ValueType":   "attribute",
//"ValueAssign": "Pleasure",
//"MaxType": "attribute",
//"MaxAssign": "PleasureMax",
//"showgauge": true,

		tHud.x = this.rawhuddata[hkey]['x'] || 0,
		tHud.y = this.rawhuddata[hkey]['y'] || 0,
		tHud.ox = this.rawhuddata[hkey]['ox'] || 0,
		tHud.oy = this.rawhuddata[hkey]['oy'] || 0,
		tHud.tx = this.rawhuddata[hkey]['tx'] || 0,
		tHud.ty = this.rawhuddata[hkey]['ty'] || 0,
		//
		tHud.title = this.rawhuddata[hkey]['title'] || undefined,
		tHud.ttx = this.rawhuddata[hkey]['ttx'] || 0,
		tHud.tty = this.rawhuddata[hkey]['tty'] || 0,
		tHud.barmode = this.rawhuddata[hkey]['barmode'] || 0 // 0 is horiz/ 1 is vertical
		//
		tHud.enable = eval(this.rawhuddata[hkey]['enable'] || false),
		//
		tHud.shownum = this.rawhuddata[hkey]['shownum'] || false,
		tHud.showmax = this.rawhuddata[hkey]['showmax'] || false,
		//tHud.numfontsize = this.rawhuddata[hkey]['Num Font Size'] || 16,
		//"numalign": 1,
		tHud.separatemax = this.rawhuddata[hkey]['separatemax'] || false,
		tHud.tmx = this.rawhuddata[hkey]['tmx'] || 0,
		tHud.tmy = this.rawhuddata[hkey]['tmy'] || 0,
		//
		tHud.showtitle = this.rawhuddata[hkey]['showtitle'] || false,
		tHud.titlefontsize = this.rawhuddata[hkey]['Title Font Size'] || 12,
		//"titlealign": 1,
		//
		//"autofade": true,
		//"smartfade": true
		//
		$gameSystem._eattribBars[hkey] = tHud;
	}	
	//
	this.setupfromfile = true;
	//
	if(
		(Echomap.AttributeBars.showincombat && SceneManager._scene.constructor == Scene_Battle)
		|| SceneManager._scene.constructor == Scene_Map ){
		Echomap.AttributeBars.enableAll()
		var thisScene =  SceneManager._scene;
		thisScene.createVarBars();
	} else 
		Echomap.AttributeBars.disableAll();
	//
}

Echomap.AttributeBars._loadFileDataError = function(errorurl) {
	Echomap.Utils.log(Echomap.ECH_HudDisplay.MyPluginName, "Error Loading from URL:", 
	errorurl );
	throw new Error("There was an error loading the file '" + errorurl + "'.");
}

/**
 * Loads a JSON file and executes the given callback with the parsed file contents as a parameter.
 */
Echomap.AttributeBars._loadFromJSONFile = function(url, callback, errorcallback) {
	var request = new XMLHttpRequest();
	request.open('GET', url);
	request.overrideMimeType('application/json');
	request.onload  = function() { callback(JSON.parse(request.responseText)); };
	request.onerror = function() { errorcallback(url); };
	request.send();
};


//===============================
// * Sprite_AttribComboBar
//===============================

function Sprite_AttribComboBar() {
    this.initialize.apply(this, arguments);
}

Sprite_AttribComboBar.prototype = Object.create(Sprite_Base.prototype);
Sprite_AttribComboBar.prototype.constructor = Sprite_AttribComboBar;


Sprite_AttribComboBar.prototype.initialize = function(index) {
    Sprite_Base.prototype.initialize.call(this);
	this._id = index;
	this.statecallbackfields = []
	//this._barWidth  = 0;
	//this._barHeight = 0;
	this.createGraphics();
	this.createFields();
	//this.createVarNums();
	//this.createTitle();
};

Sprite_AttribComboBar.prototype.addState = function(state) {
	for (var i = 0; i < this.statecallbackfields.length; i++) {		
		var field = this.statecallbackfields[i]
		var st = field.statelist[state.id]
		if(!st)
			field.statelist[state.id] = state
		//var curVal = field.statelist.join('/')
		var curVal = ""
		for (let key in field.statelist) {
			var obj = field.statelist[key]
			if(obj)
				curVal += obj.name +" " 
		}
		field.curVal = curVal
		if(field.pretext)
			field.curVal = field.pretext + field.curVal
		field.curVal = field.curVal
	}		
}

Sprite_AttribComboBar.prototype.eraseState = function(state) {
	for (var i = 0; i < this.statecallbackfields.length; i++) {		
		var field = this.statecallbackfields[i]
		var st = field.statelist[state.id]
		if(st)
			field.statelist[state.id] = undefined
		
		var curVal = ""
		for (let key in field.statelist) {
			var obj = field.statelist[key]
			if(obj)
				curVal += obj.name +" " 
		}
		field.curVal = curVal
		if(field.pretext)
			field.curVal = field.pretext + field.curVal
		field.curVal = field.curVal
	}		
}

Sprite_AttribComboBar.prototype.obj = function() {
    return $gameSystem._eattribComboBars[this._id]
};
Sprite_AttribComboBar.prototype.createGraphics = function() {
	var obj = this.obj();
	// background image
	//this._barimage = obj.bg 
	this.bitmap = ImageManager.loadPicture(obj.bg);
	
	this._barNeedsInit = true;
	this.updatePos(obj);
};
Sprite_AttribComboBar.prototype.updatePos = function(obj) {
	this.x = obj.x;
	this.y = obj.y;
	//this._bar.x = obj.ox;
	//this._bar.y = obj.oy;
};
Sprite_AttribComboBar.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
	var obj = this.obj();
	if (!obj)
		return;
	this.updatePos(obj);
	if($gameSystem._eattribBarsEnabled){
		this.visible = true
		this.refreshFields(obj);
	} else {
		this.visible = false
	}	
	
	//this.refreshTitle(obj);
	//this.updateImages(obj);
};
/*
Sprite_AttribComboBar.prototype.updateImages = function(obj) {
	//if (this._barimage2 != obj.barimage2 || this._barimage != obj.barimage) {
	//	this.createGraphics();
	//}
}
*/
Sprite_AttribComboBar.prototype.createFields = function() {
	var obj = this.obj();
	if (this._fields) {
		for (var i = 0; i < this._fields.length; i++) {
			this.removeChild(this._fields[i]);
		}
	}
	this._fields = []
	// init sprites
	for (var i = 0; i < obj.fields.length; i++) {
		var fielddata = obj.fields[i]
		if(fielddata.enable){
			//
			var field1  = new Sprite(new Bitmap(200,46));
			field1.x = fielddata.tx
			field1.y = fielddata.ty
			//field1.bitmap.fontSize = fielddata.numfontsize;//16
			field1.dataval = fielddata.title
			field1.datatype = "static"
			field1.aligntype = fielddata.TitleAlign
			//field1._tint    = fielddata.ttint
			field1._bitmap.textColor = fielddata.ttint
			field1._bitmap.fontSize = fielddata.tfontsize
			//field1._tintRGB = fielddata.ttint
			this.addChild(field1);
			this._fields.push(field1)
			//
			var field2 = new Sprite(new Bitmap(200,46));
			field2.x = fielddata.vx
			field2.y = fielddata.vy
			//field2.bitmap.fontSize = fielddata.numfontsize;//16
			field2.dataval = fielddata.ValueAssign
			field2.datatype = fielddata.ValueType
			field2.aligntype = fielddata.ValueAlign
			//field2._tint    = fielddata.vtint
			field2._bitmap.textColor = fielddata.vtint
			field2._bitmap.fontSize = fielddata.vfontsize
			//field2._tintRGB = fielddata.vtint
			this.addChild(field2);
			this._fields.push(field2)
			if( fielddata.ValueType=="states"){
				//register this to get updates!
				field2.statelist = []
				this.statecallbackfields.push(field2);
			}
			//
			var field3 = new Sprite(new Bitmap(200,46));
			field3.x = fielddata.mx
			field3.y = fielddata.my
			//field3.bitmap.fontSize = fielddata.numfontsize;//16
			field3.dataval = fielddata.MaxAssign
			field3.datatype = fielddata.MaxType
			field3.aligntype = fielddata.MaxAlign
			//field3._tint    = fielddata.mtint
			field3._bitmap.textColor = fielddata.mtint//"#CC00CC"
			field3._bitmap.fontSize = fielddata.mfontsize
			//context.strokeStyle = this.outlineColor;
			//context.lineWidth = this.outlineWidth;
			//field3._bitmap.adjustTone("FFCC00")
			//field3._bitmap.adjustTone(toneR,toneG,toneB);
			//field3._bitmap.rotateHue(80);
			//field3.bitmap.rotateHue(80);
			//var arr3 = [10,3,5,0]
			//field3.setColorTone( arr3 ) 
			//field3._tintRGB = fielddata.mtint
			//field3._tint = 16777100
			//field3._tintRGB = 16777100
			field3.pretext = "/"
			this.addChild(field3);
			this._fields.push(field3)
		}
	}

	/*
	if (this._number) this.removeChild(this._number);
	if (this._numberMax) this.removeChild(this._numberMax);
	this._number = new Sprite(new Bitmap(200,46));
	this._number.x = this.obj().tx
	this._number.y = this.obj().ty
	//this._number.bitmap.fontSize = $gameSystem._ECH_HudDisplay.getHudData(this._index).FontSize
	this._number.bitmap.fontSize = this.obj().numfontsize;//16
	this.addChild(this._number);
	//this._bar.addChild(this._number);
	//max
	if(this.obj().separatemax) {
		this._numberMax = new Sprite(new Bitmap(200,46));
		this._numberMax.x = this.obj().tmx
		this._numberMax.y = this.obj().tmy
		//this._number.bitmap.fontSize = $gameSystem._ECH_HudDisplay.getHudData(this._index).FontSize
		this._numberMax.bitmap.fontSize = this.obj().numfontsize;//16
		this.addChild(this._numberMax);
	}
	*/
};
/*Sprite_AttribComboBar.prototype.aligntype = function() {
	return "left"
   //if ( $gameSystem._ECH_HudDisplay.getHudData(this._index).NumAlign === 0) {return "left"    
   //} else if ( $gameSystem._ECH_HudDisplay.getHudData(this._index).NumAlign === 1) {return "center"
   //} else {return "right"};
};
*/
Sprite_AttribComboBar.prototype.refreshFields = function(obj) {
	//
	for (var i = 0; i < this._fields.length; i++) {
		var field = this._fields[i]
		field.bitmap.clear();
		var curVal = ""
		if( field.datatype === "exclude")
			continue;
		if( field.datatype === "static"){
			curVal = field.dataval
		} else if( field.datatype === "attribute"){
			curVal = Echomap._attributeLoader.getAttribute(1,field.dataval);
		} else if( field.datatype === "eval"){
			curVal = eval(field.dataval)
		} else if( field.datatype === "mdf"){
			curVal = $gameActors._data[1].mdf
		} else if( field.datatype === "hp"){
			curVal = $gameActors._data[1].hp
		} else if( field.datatype === "mp"){
			curVal = $gameActors._data[1].mp
		} else if( field.datatype === "tp"){
			curVal = $gameActors._data[1].tp
		} else if( field.datatype === "states"){
			curVal = field.curVal
			/*
			seems to be too much work for each refresh!!
			var actorVal = eval(field.dataval)
			curVal = ""
			var actor = $gameActors._data[ actorVal ]
			//._states
			var smap = actor._states.map(function(id) {
				return $dataStates[id];
			});
			for (var i = 0; i < smap.length; i++) {				
				//iconIndex, Name
				curVal += " " + smap[i].name
			}
			console.log(smap);
			*/
		}
		// TODO
		//vtint3rd 
		if(field.pretext)
			curVal = field.pretext + curVal
		var aligntype = "left"
		if(field.aligntype)
			aligntype = field.aligntype
		field.curVal = curVal
		var twidth = field.bitmap.measureTextWidth(curVal)
		field.bitmap.drawText(curVal,0,0,twidth,44, aligntype );
		//field.bitmap.drawText(curVal,0,0,190,44, aligntype );
		//field.bitmap.rotateHue(80);
	}
	/*
    this._number.bitmap.clear();
    if(this._numberMax)
		this._numberMax.bitmap.clear();
	if(obj.shownum) {
		if(obj.separatemax){
			var maxVal = Echomap._attributeLoader.getAttribute(1,obj.attribmax);
			var text = String(maxVal);
			this._numberMax.bitmap.drawText(text,0,0,190,44,this.aligntype());
		}
		var maxVal = Echomap._attributeLoader.getAttribute(1,obj.attribmax);
		var curVal = Echomap._attributeLoader.getAttribute(1,obj.attribval);
		
		var maxv = (Math.abs(maxVal).toString().split("")); 
		var maxv2 = Number(maxv.length);
		var text = obj.showmax ? (curVal).padZero(maxv2) + "/" + maxVal : String(curVal);
		this._number.bitmap.drawText(text,0,0,190,44,this.aligntype());
	}
	*/
};

//===============================
// * Sprite_AttribBar
//===============================

function Sprite_AttribBar() {
    this.initialize.apply(this, arguments);
}

Sprite_AttribBar.prototype = Object.create(Sprite_Base.prototype);
Sprite_AttribBar.prototype.constructor = Sprite_AttribBar;

Sprite_AttribBar.prototype.initialize = function(index) {
    Sprite_Base.prototype.initialize.call(this);
	this._id = index;
	this._barWidth  = 0;
	this._barHeight = 0;
	this.createGraphics();
	this.createVarNums();
	this.createTitle();
};

Sprite_AttribBar.prototype.obj = function() {
    return $gameSystem._eattribBars[this._id];
};

Sprite_AttribBar.prototype.createGraphics = function() {
	var obj = this.obj();
	// under image
	this._barimage2 = obj.barimage2;
	this.bitmap = ImageManager.loadPicture(obj.barimage2);
	
	// bar image
	if (this._bar) this.removeChild(this._bar);
	this._bar = new Sprite();
	this._barimage = obj.barimage;
	this._bar.bitmap = ImageManager.loadPicture(obj.barimage);
	this.addChild(this._bar);
	
	this._barNeedsInit = true;
	this.updatePos(obj);
};

Sprite_AttribBar.prototype.createVarNums = function() {
	if (this._number) this.removeChild(this._number);
	if (this._numberMax) this.removeChild(this._numberMax);
	this._number = new Sprite(new Bitmap(200,46));
	this._number.x = this.obj().tx
	this._number.y = this.obj().ty
	//this._number.bitmap.fontSize = $gameSystem._ECH_HudDisplay.getHudData(this._index).FontSize
	this._number.bitmap.fontSize = this.obj().numfontsize;//16
	this.addChild(this._number);
	//this._bar.addChild(this._number);
	//max
	if(this.obj().separatemax) {
		this._numberMax = new Sprite(new Bitmap(200,46));
		this._numberMax.x = this.obj().tmx
		this._numberMax.y = this.obj().tmy
		//this._number.bitmap.fontSize = $gameSystem._ECH_HudDisplay.getHudData(this._index).FontSize
		this._numberMax.bitmap.fontSize = this.obj().numfontsize;//16
		this.addChild(this._numberMax);
	}
};
Sprite_AttribBar.prototype.refreshNumber = function(obj) {	
    this._number.bitmap.clear();
    if(this._numberMax)
		this._numberMax.bitmap.clear();
	if(obj.shownum) {
		if(obj.separatemax){
			var maxVal = Echomap._attributeLoader.getAttribute(1,obj.attribmax);
			var text = String(maxVal);
			this._numberMax.bitmap.drawText(text,0,0,190,44,this.aligntype());
		}
		var maxVal = Echomap._attributeLoader.getAttribute(1,obj.attribmax);
		var curVal = Echomap._attributeLoader.getAttribute(1,obj.attribval);
		
		var maxv = (Math.abs(maxVal).toString().split("")); 
		var maxv2 = Number(maxv.length);
		var text = obj.showmax ? (curVal).padZero(maxv2) + "/" + maxVal : String(curVal);
		this._number.bitmap.drawText(text,0,0,190,44,this.aligntype());
	}
};

Sprite_AttribBar.prototype.createTitle = function() {
	if (this._title) this.removeChild(this._title);
	this._title = new Sprite(new Bitmap(200,46));
	this._title.x = this.obj().ttx
	this._title.y = this.obj().tty
	//this._number.bitmap.fontSize = $gameSystem._ECH_HudDisplay.getHudData(this._index).FontSize
	this._title.bitmap.fontSize = this.obj().titlefontsize;//12
	this.addChild(this._title);
	//this._bar.addChild(this._number);
};
Sprite_AttribBar.prototype.refreshTitle = function(obj) {	
    this._title.bitmap.clear();	
	if(obj.showtitle) {
		var curVal = obj.title	
		//var maxv2 = Number(curVal.length);
		var text = String(curVal);	
		this._title.bitmap.drawText(text,0,0,190,44,this.aligntype());
	}
};

Sprite_AttribBar.prototype.aligntype = function() {
	return "left"
   //if ( $gameSystem._ECH_HudDisplay.getHudData(this._index).NumAlign === 0) {return "left"    
   //} else if ( $gameSystem._ECH_HudDisplay.getHudData(this._index).NumAlign === 1) {return "center"
   //} else {return "right"};
};

Sprite_AttribBar.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
	var obj = this.obj();
	if (!obj) return;
	this.updatePos(obj);
	if($gameSystem._eattribBarsEnabled){
		this.visible = true
	} else {
		this.visible = false
	}
	this.refreshNumber(obj);
	this.refreshTitle(obj);
	this.updateImages(obj);
};

Sprite_AttribBar.prototype.updatePos = function(obj) {
	this.x = obj.x;
	this.y = obj.y;
	this._bar.x = obj.ox;
	this._bar.y = obj.oy;
};

Sprite_AttribBar.prototype.updateImages = function(obj) {
	if (this._barimage2 != obj.barimage2 || this._barimage != obj.barimage) {
		this.createGraphics();
	}
	
	// update bar sprite
	if (this._bar.bitmap.isReady()) {
		if (this._barNeedsInit) {
			// store full bar image width for max width
			this._barWidth  = this._bar.width;
			this._barHeight = this._bar.height;
			this._barNeedsInit = false;
		}
		// set width based on current/max values
		//var curVal = $gameVariables.value(obj.var1);
		//var maxVal = $gameVariables.value(obj.var2);
		var curVal = Echomap._attributeLoader.getAttribute(1,obj.attribval);
		var maxVal = Echomap._attributeLoader.getAttribute(1,obj.attribmax);
		
		var percent = curVal > 0 && maxVal > 0 ? curVal / maxVal : 0;
		if(obj.barmode==1){
			this._bar.height = Math.max(0,Math.min(this._barHeight * percent,this._barHeight));
		} else if(obj.barmode==2){
			var offs = Math.max(0,Math.min(this._barHeight * percent,this._barHeight));
			var offt = this._barHeight - offs
			this._bar.setFrame(this._bar.x, offt, this._bar.width, this._bar.height);
			this._bar.y = offt
		} else {
			this._bar.width = Math.max(0,Math.min(this._barWidth * percent,this._barWidth));
		}
	}
};

//==============================
// * Plugin Functions
//==============================
//Version #1

Echomap.AttributeBars.create = function(id,image,image2,attribval,attribmax,x,y,ox,oy,tx,ty,title,ttx,tty,barmode) {
	if (id >= 0) {
		$gameSystem._eattribBars[id] = {
			barimage:image || "",
			barimage2: image2 || "",
			attribval:attribval || 0,
			attribmax:attribmax || 0,
			x:x || 0,
			y:y || 0,
			ox:ox || 0,
			oy:oy || 0,
			tx:tx || 0,
			ty:ty || 0,
			title: title || undefined,
			ttx:ttx || 0,
			tty:tty || 0,
			barmode:barmode|| 0, // 0 is horiz/ 1 is vertical
			shownum: true,
			showmax: true,
			separatemax: false,
			numfontsize: 16,
			titlefontsize: 12,
			showtitle: true
		};
	}
	// refresh scene
	if (SceneManager._scene.createVarBars) SceneManager._scene.createVarBars();
};

Echomap.AttributeBars.remove = function(id) {
	$gameSystem._eattribBars[id] = null;
	// refresh scene
	if (SceneManager._scene.createVarBars)
		SceneManager._scene.createVarBars();
};

Echomap.AttributeBars.mod = function(id) {
	return $gameSystem._eattribBars[id];
};

Echomap.AttributeBars.disableAll = function() {
	$gameSystem._eattribBarsEnabled = false
};
Echomap.AttributeBars.enableAll = function() {
	$gameSystem._eattribBarsEnabled = true
};
Echomap.AttributeBars.disable = function(id) {
	$gameSystem._eattribBars[id].enable = true
};
Echomap.AttributeBars.enable = function(id) {
	$gameSystem._eattribBars[id].enable = falase
};

//=============================================================================
// ** Game_System
//=============================================================================

//===============================
// * Game_System
//===============================

Echomap.AttributeBars.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Echomap.AttributeBars.Game_System_initialize.call(this);
	this._eattribBars = []; // list of all bars existing in game
	this._eattribBarsEnabled = true
	this._eattribComboBars = []; // list of all bars existing in game
};

//===============================
// * Scene_Base
//===============================

Scene_Base.prototype.createVarComboBars = function() {
	// if bars exist, remove them all
	if (this._eattribComboBars) {
		for (var i = 0; i < this._eattribComboBars.length; i++) {
			this.removeChild(this._eattribComboBars[i]);
		}
	}
	// init varBar sprite container Sprite_AttribComboBar
	this._eattribComboBars = [];	
	// create varBar sprites
	if($gameSystem._eattribComboBarKeys) {
		for (var i = 0; i < $gameSystem._eattribComboBarKeys.length; i++) {
			var key = $gameSystem._eattribComboBarKeys[i]
			var obj = $gameSystem._eattribComboBars[ key ]
			//console.log(obj);			
			if (obj) {
				this._eattribComboBars.push(new Sprite_AttribComboBar(key));
			}
		}
	}
	
	var states = $gameActors._data[1]._states
	if(states!=undefined)
	for (var si = 0; si < states.length; si++) {
		var stateId = states[si]
		var state = $dataStates[stateId]
		for (var i = 0; i < this._eattribComboBars.length; i++) {
			this._eattribComboBars[i].addState(state)
		}
	}
	
	// make children of scene
	for (var i = 0; i < this._eattribComboBars.length; i++) {
		this.addChild(this._eattribComboBars[i]);
	}
}

Scene_Base.prototype.createVarBars = function() {
	// if bars exist, remove them all
	if (this._eattribBars) {
		for (var i = 0; i < this._eattribBars.length; i++) {
			this.removeChild(this._eattribBars[i]);
		}
	}
	// init varBar sprite container
	this._eattribBars = [];	
	// create varBar sprites
	//$gameSystem._eattribBars.forEach((obj) => {
	if($gameSystem._eattribBarKeys) {
		for (var i = 0; i < $gameSystem._eattribBarKeys.length; i++) {
			var key = $gameSystem._eattribBarKeys[i]
			var obj = $gameSystem._eattribBars[ key ]
			console.log(obj);			
			if (obj) {
				this._eattribBars.push(new Sprite_AttribBar(key));
			}
		}
	}
	/*	
	for (var i = 0; i < $gameSystem._eattribBars.length; i++) {
		// if index exists in array, add as sprite
		if ($gameSystem._eattribBars[i]) {
			this._eattribBars.push(new Sprite_AttribBar(i));		
		}
	}
	*/
	// make children
	for (var i = 0; i < this._eattribBars.length; i++) {
		this.addChild(this._eattribBars[i]);
	}
};


//===============================
// * Scene_Battle
//===============================

Echomap.AttributeBars.Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
Scene_Battle.prototype.createDisplayObjects = function() {
	Echomap.AttributeBars.Scene_Battle_createDisplayObjects.call(this);
	//
	if(!$gameSystem._eattribBars || $gameSystem._eattribBars.length<1 ) {
		//&& !Echomap.AttributeBars.setupfromfile) {
		//$gameSystem._eattribBars = []
		Echomap.AttributeBars.loadBarsFromJSON();
	}
	//
	this.createVarBars();
	this.createVarComboBars();
};

//===============================
// * Scene_Map
//===============================

Echomap.AttributeBars.Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
	Echomap.AttributeBars.Scene_Map_createDisplayObjects.call(this);
	//
	if(!$gameSystem._eattribBars || $gameSystem._eattribBars.length<1 ) {
		//&& !Echomap.AttributeBars.setupfromfile) {
		//$gameSystem._eattribBars = []
		Echomap.AttributeBars.loadBarsFromJSON();
	}
	//
	this.createVarBars();
	this.createVarComboBars();
};

//===============================
// * Game_BattlerBase
//===============================

// Just care about states on player
Echomap.AttributeBars.Game_BattlerBase_addNewState = Game_Actor.prototype.addNewState;
Game_Actor.prototype.addNewState = function(stateId) {
    Echomap.AttributeBars.Game_BattlerBase_addNewState.call(this,stateId);
	//
	var state = $dataStates[stateId]
	if(
		(Echomap.AttributeBars.showincombat && SceneManager._scene.constructor == Scene_Battle)
		||
		SceneManager._scene.constructor == Scene_Map
		){
		Echomap.AttributeBars.enableAll()
		var thisScene =  SceneManager._scene;
		for (let key in thisScene._eattribComboBars) {
			thisScene._eattribComboBars[key].addState(state)
		}
	} else 
		Echomap.AttributeBars.disableAll();
};

Echomap.AttributeBars.Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
Game_BattlerBase.prototype.eraseState = function(stateId) {
	Echomap.AttributeBars.Game_BattlerBase_eraseState.call(this,stateId);
	//
	var state = $dataStates[stateId]
	if(
		(Echomap.AttributeBars.showincombat && SceneManager._scene.constructor == Scene_Battle)
		||
		SceneManager._scene.constructor == Scene_Map ){
		Echomap.AttributeBars.enableAll()
		var thisScene =  SceneManager._scene;
		for (let key in thisScene._eattribComboBars) {
			thisScene._eattribComboBars[key].eraseState(state)
		}
	} else 
		Echomap.AttributeBars.disableAll();
};

//=============================================================================
// Game_Interpreter_pluginCommand
//=============================================================================
/*
Echomap.AttributeBars.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Echomap.AttributeBars.Game_Interpreter_pluginCommand.call(this, command, args);
    //
};
*/
//-----------------------------------------------------------------------------

//=============================================================================
// End of File
//=============================================================================