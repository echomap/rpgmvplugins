//=============================================================================
// ECH_IconMouseOver.js
// Hover over data for icons/buffs/debuffs
// Echomap Plugin echomap<echomap@gmail.com>
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v0.10 (Requires ECH_Utils.js) Hover over data for icons/buffs/debuffs
 * @author Echomap Plugins
 *
 * @param ---General---
 * @default
 *
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Shows hoverover text for icons, automatically regognizes:
 *   -Window_ActorCommand (I need to test w/o MOG_BattleCommands) 
 *   -MOG_BattleHud
 *   -gameTroop._enemies
 * 
 * Can register icons in scenes, to show help in a popup like window.
 *
 * Requires ECH_Utils
 * ============================================================================
 * Notetags
 * ============================================================================
 * <none>
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * Echomap.ECH_IconMouseOver.registerIcon(id, x,y, width,height, text )
 * Echomap.ECH_IconMouseOver.unregisterIcon(id)
 * Echomap.ECH_IconMouseOver.getRegisteredList()
 * Echomap.ECH_IconMouseOver.unregisterSceneIcons()
 *
 * ============================================================================
 * Plugin Script/Functions
 * ============================================================================
 * <none>
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
 * 	- 2023 10 18 auto unregister icons, found updates to include menu status, and check battle things only in battle, move some things from Scene_Battle to Scene_Base 
 * 	- 2023 09 01 can get notes from property Window_ActorCommand._customIconNotes
 * 	- 2023 09 01 initial
 *
 * ============================================================================
 * TODO
 * ============================================================================
 * -<none>
 * ============================================================================
 * Plugin License
 * ============================================================================
 * https://choosealicense.com/licenses/agpl-3.0/
 * echomap@gmail.com
 * Perhaps got some inspiration from TDDP_MouseSystemEx.js (MIT license)
 *
 */
//=============================================================================

var Imported = Imported || {};
Imported["ECH - IconMouseOver"] = '20230903.1';
Imported.ECH_IconMouseOver = true;

if (Imported["ECH - Utils"] === undefined) {
  throw new Error("Please add ECH_Utils before "+"ECH_IconMouseOver"+"!");
}

var Echomap = Echomap || {};
Echomap.ECH_IconMouseOver = Echomap.ECH_IconMouseOver || {};
Echomap.ECH_IconMouseOver.MyPluginName = "ECH_IconMouseOver";
Echomap.ECH_IconMouseOver.MyVersion = "20230903.1"
if(Echomap.Utils)
	Echomap.Utils.sayHello("ECH_IconMouseOver", Imported["ECH - IconMouseOver"] );

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.ECH_IconMouseOver.Parameters = PluginManager.parameters("ECH_IconMouseOver");
Echomap.Params = Echomap.Params || {};
//Echomap.Params.debug_level   = (Echomap.Utils.Parameters['debug_level']) || 5;
//Echomap.Params.debug         = (Echomap.Utils.Parameters['debug'])       || true;
//Echomap.ECH_IconMouseOver.baseDir = Echomap.ECH_GameCustom1.Parameters['basedir'] || "img/sidebust/";
//-----------------------------------------------------------------------------

//=============================================================================
// ** This Plugin
//=============================================================================

//==============================
// * Plugin Commands
//==============================

Echomap.ECH_IconMouseOver.getRegisteredList = function(){
	var tScene = SceneManager._scene
	return tScene.ech_register_icons
}
Echomap.ECH_IconMouseOver.unregisterSceneIcons  = function() {
	var tScene = SceneManager._scene
	if(!tScene.ech_register_icons)
		return
	for (var n = 1; n < tScene.ech_register_icons.length; n++) {
		var obj     = tScene.ech_register_icons[n]; 
		delete tScene.ech_register_icons[id] // = undefined
	}
}
Echomap.ECH_IconMouseOver.unregisterIcon  = function(id) {
	var tScene = SceneManager._scene
	delete tScene.ech_register_icons[id] // = undefined
}
Echomap.ECH_IconMouseOver.registerIcon  = function(id, x,y, width,height, text ) {	
	var tScene = SceneManager._scene
	var obj = new Object()
	obj.id = id
	obj.x = x
	obj.y = y
	obj.width = width
	obj.height = height
	obj.text = text
	tScene.ech_register_icons[id] = obj
}

//==============================
// * Plugin Window
//==============================

function Window_Echo_HoverInfo() {
    this.initialize.apply(this, arguments);
}

Window_Echo_HoverInfo.prototype = Object.create(Window_Base.prototype);
Window_Echo_HoverInfo.prototype.constructor = Window_Echo_HoverInfo;

Window_Echo_HoverInfo.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = '';
	this._wordWrap = true;
	this.contents.fontSize = 12;
	//Window_Base.prototype.makeFontSmaller();
	//var img1 = ImageManager.loadPicture("bgblueblur3");
	//this.contents.blt(img1, 0, 0, img1.width, img1.height, 0, 0);
	//sx, sy, sw, sh, dx, dy);
	//
};

Window_Echo_HoverInfo.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_Echo_HoverInfo.prototype.clear = function() {
    this.setText('');
};

Window_Echo_HoverInfo.prototype.setItem = function(item) {
    this.setText(item ? item.description : '');
};

Window_Echo_HoverInfo.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
};

//=============================================================================
// ** Game_System
//=============================================================================

//===============================
// * OVERWRITE
//===============================
/**
* Removing the check for whether _mousePressed is active to facilitate hover events
*/
TouchInput._onMouseMove = function(event) {
    if (this._mousePressed) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    } else {
		var x = Graphics.pageToCanvasX(event.pageX);
		var y = Graphics.pageToCanvasY(event.pageY);		
		this._checkUnderCursorStatus(event.pageX, event.pageY);
	}
};

//==============================
// * Window_ActorCommand
//==============================
// - update help text
Window_ActorCommand.prototype.load_com_images = function() {
	this._com_images = [];
	for (var i = 0; i < this._list.length; i++) {
		 if (this._max_com < this._list.length) {this._max_com = this._list.length}
		 for (var r = 0; r < this._list.length; r++) {
		      this._com_images.push(ImageManager.loadBcom("Com_" + this._list[r].name));
			  this._com_images[r]._eStateDataN = this._list[r].name;
			  var skillNote = "<help description>"+this._list[r].name+"</help description>";
			  for (var isd = 1; isd < $dataSkills.length; isd++) {
			  	if( $dataSkills[isd].name === this._list[r].name ) {
			  		skillNote = $dataSkills[isd].note
			  		break;
			  	}
			  }
			  if(this._customIconNotes!=undefined){
				  var itz = this._customIconNotes[this._list[r].name]
				  if(itz!=undefined){
					  skillNote = itz
				  }
			  }
			  this._com_images[r]._eStateDataT = skillNote;
		 };
	};
	this._layout_img = ImageManager.loadBcom("Layout");
	this._cursor_b_img = ImageManager.loadBcom("Cursor");
	if (String(Moghunter.bcom_arrow) === "true") {this._arrow_img = ImageManager.loadBcom("Arrow")};
	
	//
	var tScene = SceneManager._scene
	if(tScene && tScene._ehoverWindow) {
		tScene._ehoverWindow.contents.clear();
		tScene._ehoverWindow.drawTextEx(" ", 0, 0);
		tScene.showEHoverWindow(0, 0, 1, 1 )
	}
};

//===============================
// * Battle Hud
//===============================
if( Imported.MOG_BattleHud === true ) { 
// - Create States - 
Battle_Hud.prototype.refresh_states2 = function() {
	this._state_icon.visible = false;
	this._battler.need_refresh_bhud_states = false;
	for (i = 0; i < this._stateIcons.length; i++){
		this._state_icon.removeChild(this._stateIcons[i]);
	};	
	if (this._battler.allIcons().length == 0) {return};
	this._state_icon.visible = true;
	//this._state_icon.y = -30;
	this._stateIcons = [];
	var w = Window_Base._iconWidth;
	var icons = this._battler.allIcons().slice(0,w);
	var m = Math.min(Math.max(this._battler.allIcons().length,0),Moghunter.bhud_statesMax);
	var align = Moghunter.bhud_statesAlign;
	for (i = 0; i < m; i++){
		 this._stateIcons[i] = new Sprite(this._state_img);
	     var sx = icons[i] % 16 * w;
		 var sy = Math.floor(icons[i] / 16) * w;
		 this._stateIcons[i].setFrame(sx, sy, w, w);
		 if (align === 1) {
		     this._stateIcons[i].x = -((w + 4) * i);
		 } else if (align === 2) { 
		     this._stateIcons[i].y = (w + 4) * i;
		 } else if (align === 3) {
			 this._stateIcons[i].y = -((w + 4) * i);
		 } else {	 
		     this._stateIcons[i].x = (w + 4) * i;
		 };
		 //
		 //Add Information to States
		 var tStateId  = this._battler._states[i];
		 var tStateData = $dataStates[tStateId];
		 this._stateIcons[i]._eStateDataN = tStateData.name
		 this._stateIcons[i]._eStateDataT = tStateData.note
		 //this doesnt work???
		 //this._stateIcons[i].addListener("mouseover", this._onStateMouseover, true);//.bind(this._stateIcons[i]) );
		 //
		 this._state_icon.addChild(this._stateIcons[i]);
		 //this doesnt work???
		 //this._state_icon.addListener("mouseover", this._onStateMouseover)
	};
};
//this doesnt work???
//Battle_Hud.prototype._onStateMouseover = function(event) {
//	console.log("XXXXXXXXXXXXXXXXXXX");
//};
//this doesnt work???
//Battle_Hud.prototype._onStateMouseover = function() {
//	console.log("XXXXXXXXXXXXXXXXXXX TTTTTTTTTTTTTTTTTTTTT");
//};
}

//===============================
// * TouchInput
//===============================
/**
* Check cursor's status and whether to alter cursor
* @method _checkCursorStatus
* @param pageX {Number} Mouse page X coordinate
* @param pageY {Number} Mouse page Y coordinate
*/
TouchInput._checkUnderCursorStatus = function(pageX, pageY) {
	// Check for events under mouse and perform actions, and get event in result
	//var overEvents = this._checkForEventUnderMouse(pageX, pageY);
	if (TouchInput.conditionsValidForMouseHoverCheck()) {
		var found = false;
		var f1 = undefined;
		if(Imported.MOG_BattleHud )
			f1 = this._checkUnderCursorStatusBUD(pageX,pageY);
		if(f1) found = true
		if(TouchInput.conditionsValidInBattleForMouseHoverCheck()) {
			var f2 = this._checkUnderCursorStatusCMD(pageX,pageY);
			if(f2) found = true
			var f3 = this._checkUnderCursorStatusENEMY(pageX,pageY);
			if(f3) found = true
		}
		//TODO quick check here too?
		var f4 = this._checkUnderCursorStatusRegistered(pageX,pageY)
		var f5 = this._checkUnderCursorStatusExtend(pageX,pageY)
		if(!found && !f4 && !f5 )//&& this._isSceneBattle())
			SceneManager._scene.hideEHoverWindow();
	}
};
// 
TouchInput._checkUnderCursorStatusRegistered = function(pageX, pageY) {
	var tScene = SceneManager._scene
	if(!tScene) return undefined
	if(!tScene.ech_register_icons)
		return undefined
	var foundAnIconToHover = false
	for (let i in tScene.ech_register_icons) {
		var spriteObj = tScene.ech_register_icons[i] //Object
		var xT = spriteObj.x;
		var yT = spriteObj.y;
		var xTM = xT + spriteObj.width;
		var yTM = yT + spriteObj.height;
		if( (pageX>=xT && pageX<=xTM) && (pageY>=yT && pageY<=yTM) ) {
			var tText = this._echoParseNoteTag(spriteObj.text)
			if(tText==undefined)
				 tText = spriteObj.text;
			if(tText!=null) {
				TouchInput._echoShowTextInEHover(tText,xT,yT,tScene)
				foundAnIconToHover = true
				break;
			}
		}
	}
	return foundAnIconToHover;
}

// extend to other things here
TouchInput._checkUnderCursorStatusExtend = function(pageX, pageY) {
	return undefined;
}

TouchInput._checkUnderCursorStatusENEMY = function(pageX, pageY, wac) {
	var tScene = SceneManager._scene
	if( tScene != undefined && tScene.constructor != Scene_Battle ) {
		return;
	}
	var foundAnIconToHover = false
	//
	for (i = 0; i < $gameTroop._enemies.length; i ++) {
		var enemy = $gameTroop._enemies[i] //Game_Enemy
		var eBattler = enemy.battler()  //Sprite_Enemy
		if(eBattler)
		for (b = 0; b < eBattler.children.length; b ++) {
			var spriteSI = eBattler.children[b] //Sprite_StateIcon
			var spriteX = spriteSI.x
			var spriteY = spriteSI.y
			if( spriteSI.parent ) {
				spriteX += spriteSI.parent.x
				spriteY += spriteSI.parent.y
			}
			//
			var xT = spriteX;
			var yT = spriteY;
			var xTM = spriteX + spriteSI.width;
			var yTM = spriteY + spriteSI.height;
			//
			if( (pageX>=xT && pageX<=xTM) && (pageY>=yT && pageY<=yTM) ){
				var bhsiT = spriteSI.bitmap
				var enemyStateId = enemy._states[b]
				var tStateData   = $dataStates[enemyStateId];
				if(!tStateData)
					continue;
				var tText = this._echoParseNoteTag(tStateData.note)
				if(tText!=null) {
					TouchInput._echoShowTextInEHover(tText,xT,yT,tScene)
					foundAnIconToHover = true
					break;
				}
			}//check  can put this in a sub function? todo?
		}
	}
	//
	return foundAnIconToHover;
}

TouchInput._checkUnderCursorStatusCMD = function(pageX, pageY, wac) {
	var tScene = SceneManager._scene
	var wac = tScene._actorCommandWindow 
	if(wac==null || wac._com_sprites==null || !wac.active)
		return;
	var foundAnIconToHover = false
	for (var i = 0; i < wac._com_sprites.length; i++) {
		var tsprite = wac._com_sprites[i];
		var psprite = tsprite.parent
		var org2 = psprite.org2
		if(org2==null)
			org2= psprite.org
		//
		var xT = org2[0] + tsprite.x - tsprite.width;
		var yT = org2[1] + tsprite.y - tsprite.height;
		var xTM = xT + tsprite._frame.width;
		var yTM = yT + tsprite._frame.height;
		//
		if( (pageX>=xT && pageX<=xTM) && (pageY>=yT && pageY<=yTM) ){
			var bhsiT = tsprite.bitmap
			if(bhsiT._eStateDataN!=null || bhsiT._eStateDataT!=null){
				var tText = this._echoParseNoteTag(bhsiT._eStateDataT)
				if(tText!=null) {
					TouchInput._echoShowTextInEHover(tText,xT,yT,tScene)
					foundAnIconToHover = true
					break;
				}
			}
		}
	}
	return foundAnIconToHover;
};

TouchInput._checkUnderCursorStatusBUD = function(pageX, pageY) {
	var tScene = SceneManager._scene
	var bh = tScene._battle_hud;
	if(bh==null)
		return;
	var x = $gameMap.canvasToMapX(Graphics.pageToCanvasX(pageX));
	var y = $gameMap.canvasToMapY(Graphics.pageToCanvasY(pageY));
	var bhsi = bh[0]._state_icon;
	var foundAnIconToHover = false
	if(bhsi!=null && bhsi.children.length>0 ) {
		for (i = 0; i < bhsi.children.length; i++) {
			var tsprite = bhsi.children[i]
			var parT = tsprite.parent;
			var xT = parT.x + tsprite.x;
			var yT = parT.y + tsprite.y;
			var xTM = xT + tsprite._realFrame.width;
			var yTM = yT + tsprite._realFrame.height;
			if( (pageX>=xT && pageX<=xTM) && (pageY>=yT && pageY<=yTM) ){
				if(tsprite._eStateDataN!=null || tsprite._eStateDataT!=null){
					var tText = this._echoParseNoteTag(tsprite._eStateDataT)
					if(tText!=null) {
						foundAnIconToHover = true;
						var textState = { index: 0, x: x, y: y, left: x };
						textState.text = tScene._ehoverWindow.convertEscapeCharacters(tText);
						var sdf1h = tScene._ehoverWindow.calcTextHeight(textState, true);
						var x=0;
						var y=0;
						tScene._ehoverWindow.contents.clear();
						var tsn = tScene._ehoverWindow.drawTextEx(tText, 0, 0);
						tScene.showEHoverWindow(xT, yT, tsn*1.5, sdf1h*2 )
						break;
					}
				}
			}
		}
	}
	return foundAnIconToHover;
};

TouchInput._echoShowTextInEHover = function(tText,xT,yT,tScene) {
	if(!tScene)
		tScene = SceneManager._scene
	if(Imported.YEP_MessageCore)
		tText = tScene._ehoverWindow.convertExtraEscapeCharacters(tText)
	var textState = { index: 0, x: x, y: y, left: x };
	textState.text = tScene._ehoverWindow.convertEscapeCharacters(tText);
	var sdf1h = tScene._ehoverWindow.calcTextHeight(textState, true);
	var x=0;
	var y=0;					
	tScene._ehoverWindow.contents.clear();
	var tsn = tScene._ehoverWindow.drawTextEx(tText, 0, 0);//, sdf1w, 'left');
	tScene.showEHoverWindow( xT, yT, tsn*2, sdf1h*2 )
};

TouchInput._echoParseNoteTag = function(notedata) {
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
* Function to check whether conditions are prime to check for events under the mouse
*/
TouchInput.conditionsValidInBattleForMouseHoverCheck = function() {
	/*
	console.log( "_isSceneMap:" +this._isSceneMap() )
	console.log( "_isSceneBattle:" +this._isSceneBattle() )
	console.log( "_isSceneMenu:" +this._isSceneMenu() )
	console.log( $gameMap )
	console.log( $dataMap )
	if($gameMap && $gameMap._interpreter)
		console.log( $gameMap._interpreter.isRunning() )
	*/
	return (
	SceneManager.isCurrentSceneStarted() && 
		this._isSceneBattle() &&
		$gameMap !== null &&
		$dataMap !== null &&
		$gameMap._interpreter.isRunning()
	);
};

/**
* Function to check whether conditions are prime to check for events under the mouse
*/
TouchInput.conditionsValidForMouseHoverCheck = function() {
	/*
	console.log( "_isSceneMap:" +this._isSceneMap() )
	console.log( "_isSceneBattle:" +this._isSceneBattle() )
	console.log( "_isSceneMenu:" +this._isSceneMenu() )
	console.log( $gameMap )
	console.log( $dataMap )
	if($gameMap && $gameMap._interpreter)
	console.log( $gameMap._interpreter.isRunning() )
	*/
	return (
	SceneManager.isCurrentSceneStarted() && 
	(this._isSceneMap() || this._isSceneBattle() || this._isSceneMenu() ) &&
		$gameMap !== null &&
		$dataMap !== null //&&
		//$gameMap._interpreter.isRunning()
	);
};

/**
* Check if current scene is of the type Scene_Map
*/
TouchInput._isSceneMap = function() {
	return (SceneManager._scene instanceof Scene_Map);
}

/**
* Check if current scene is of the type 
*/
TouchInput._isSceneBattle = function() {
	return (SceneManager._scene instanceof Scene_Battle);
}
TouchInput._isSceneMenu = function() {
	return (
	// TODO Menus can be off set, but i cant find out how much
		//SceneManager._scene instanceof Scene_MenuBase ||
		//SceneManager._scene instanceof Scene_Menu ||
		SceneManager._scene instanceof Scene_Status 
	);
}

/*
//===============================
// * Scene_Battle
//==============================
//Create Layout Window
Echomap.ECH_IconMouseOver.Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows
Scene_Battle.prototype.createAllWindows = function() {
	Echomap.ECH_IconMouseOver.Scene_Battle_createAllWindows.call(this)	
	this.createEHoverWindow()
}

//===============================
// * Scene_Map
//==============================
//Create Layout Window
Echomap.ECH_IconMouseOver.Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded
Scene_Map.prototype.onMapLoaded = function() {	
	Echomap.ECH_IconMouseOver.Scene_Map_onMapLoaded.call(this)	
    this.createEHoverWindow();
};
*/
//===============================
// * Scene_Base
//===============================

// Clear Registered Icons when Window is hidden -- huh, should i be doing this here?
//    or like on  Scene_Base.prototype.stop = function() ?
/*
Echomap.ECH_IconMouseOver.Window_Base_hide = Window_Base.prototype.hide;
Window_Base.prototype.hide = function() {
    Echomap.ECH_IconMouseOver.Window_Base_hide.call(this)
	//
	Echomap.ECH_IconMouseOver.unregisterSceneIcons()
};
//20231019
*/
//20231019
Echomap.ECH_IconMouseOver.Scene_Base_stop = Scene_Base.prototype.stop
Scene_Base.prototype.stop = function() {
	Echomap.ECH_IconMouseOver.Scene_Base_stop.call(this);
	//
	Echomap.ECH_IconMouseOver.unregisterSceneIcons()
}
// Clear Registered Icons
Echomap.ECH_IconMouseOver.Scene_Base_initialize = Scene_Base.prototype.initialize
Scene_Base.prototype.initialize = function() {
    Echomap.ECH_IconMouseOver.Scene_Base_initialize.call(this);
    //
	this.ech_register_icons = []
};
// Create Layout Window
Echomap.ECH_IconMouseOver.Scene_Base_start = Scene_Base.prototype.start
Scene_Base.prototype.start = function() {
	Echomap.ECH_IconMouseOver.Scene_Base_start.call(this)	
	if($gameSystem)
		this.createEHoverWindow()
}
// Create Layout Window
Scene_Base.prototype.createEHoverWindow = function() {
	if(this._ehoverWindow)
		return
    this._ehoverWindow = new Window_Echo_HoverInfo();
    this._ehoverWindow.visible = false;
	this._ehoverWindow.mz = 500
	this._ehoverWindow.z  = 100
    this.addChild(this._ehoverWindow);

	this._ehoverWindow.x = 0;
	this._ehoverWindow.y = 0;
	this._ehoverWindow.height = 200
	this._ehoverWindow.width = 350

    //var wy = this._ehoverWindow.y + this._ehoverWindow.height;
    //var wh = this._statusWindow.y - wy;
    //this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);
    //this._skillWindow.setHelpWindow(this._ehoverWindow);
    //this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    //this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    //this.addWindow(this._skillWindow);
};
// Show Layout Window
Scene_Base.prototype.showEHoverWindow = function(myX, myY, myW, myH) {
    if (this._ehoverWindow && !this._ehoverWindow.visible) {
		this._ehoverWindow.width  = myW
		this._ehoverWindow.height = myH
		var gW = Graphics.width;
		var gH = Graphics.height;
		//TODO do better with this positioning
		//text width? change window? or make a bitmap?
		if( myX > gW - this._ehoverWindow.width )
			myX = gW - this._ehoverWindow.width
		if( myY > gH - this._ehoverWindow.height )
			myY = myY - this._ehoverWindow.height
		if( myX<0)
			myX = 0;
		if( myY<0)
			myY = 0;
		//
		this._ehoverWindow.x = myX
		this._ehoverWindow.y = myY
		this._ehoverWindow.move(myX, myY, this._ehoverWindow.width, this._ehoverWindow.height);
        this._ehoverWindow.show();
	} else {
		//this._ehoverWindow.refresh();
    }
};
// Show Layout Window
Scene_Base.prototype.hideEHoverWindow = function() {
    if (this._ehoverWindow &&  this._ehoverWindow.visible) {
        this._ehoverWindow.hide();
    }
};
// Show Layout Window
Scene_Base.prototype.setTextEHoverWindow = function(text) {
    if (this._ehoverWindow) {
		this._ehoverWindow._text = text;
        this._ehoverWindow.show();
    }
};

//=============================================================================
// ** Game_Interpreter
//=============================================================================	

//==============================
// * PluginCommand
//==============================



//=============================================================================
// End of File
//=============================================================================
