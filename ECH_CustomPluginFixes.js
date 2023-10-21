//=============================================================================
// ECH_CustomPluginFixes.js
// 3rd Party Changes
// Echomap Plugin echomap<echomap@gmail.com>
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v0.10 General changes to some 3rd party Plugins in ways I like.
 * @author Echomap
 *
 * @param ---General---
 * @default
 * 
 * @param SingleActorMode
 * @parent ---General---
 * @type boolean
 * @desc SingleActorMode
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * General things to change some 3rd party Plugins in ways I like.
 *
 * -Update Quest commands for YEP Main Menu
 *     If YEP_QuestJournal or Galv_QuestLog
 * -Add some callouts to MOG_TimeSystem
 * -SingleActorMode if set
 * -something for VE_Single_Actor
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 * <none>
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * <none>
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
 * 	-2023 10 18
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
Imported["ECH - CustomPluginFixes"] = '20231018.1';
Imported.ECH_CustomPluginFixes = true;

var Echomap = Echomap || {};
Echomap.ECH_CustomPluginFixes = Echomap.ECH_CustomPluginFixes || {};
Echomap.ECH_CustomPluginFixes.MyPluginName = "ECH_CustomPluginFixes";
Echomap.ECH_CustomPluginFixes.alias = {}
if(Echomap.Utils)
	Echomap.Utils.sayHello("ECH_CustomPluginFixes", Imported["ECH - CustomPluginFixes"] );

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.ECH_CustomPluginFixes.Parameters = PluginManager.parameters("ECH_CustomPluginFixes");
Echomap.Params = Echomap.Params || {};

//Update to select just a single person from Yanfly's menu manager
Echomap.ECH_CustomPluginFixes.SingleActorMode = eval(Echomap.ECH_CustomPluginFixes.Parameters['SingleActorMode'] || false );
//-----------------------------------------------------------------------------

//=============================================================================
// ** Game_System
//=============================================================================	

// Update Quest commands for YEP Main Menu
if(!Imported.YEP_QuestJournal || Imported.Galv_QuestLog){
	Game_System.prototype.isShowQuest = function() {	
	  return true;
	};
	Game_System.prototype.isEnableQuest = function() {
	  return true;
	};
	Scene_Menu.prototype.commandQuest = function() {
	  Galv.QUEST.viewLog();//SceneManager.push(Scene_Quest);
	};
	Yanfly.Param.QuestCmdName = Galv.QUEST.menuCmd;
	//String(Yanfly.Parameters['Quest Command']);	
}

//==============================
// * MOG_TimeSystem
//==============================
if (Imported.MOG_TimeSystem != undefined) {
// Set Day Phase
Game_System.prototype.set_day_phase = function() {
	if (this.hour() >= 21 || this.hour() < 3) {
		if(this._time_data[1] != 3)
			this._callEventTimeSystemNight()
		this._time_data[1] = 3 // Night
	} else if (this.hour() >= 18) {
		if(this._time_data[1] != 2)
			this._callEventTimeSystemDusk()
		this._time_data[1] = 2 //Dusk
	} else if (this.hour() >= 15) {
		if(this._time_data[1] != 0)
			this._callEventTimeSystemSunset()
		this._time_data[1] = 0 // Sunset
	} else if (this.hour() >= 9) {
		if(this._time_data[1] != 1)
			this._callEventTimeSystemNormal()
		this._time_data[1] = 1 // Normal
	} else if (this.hour() >= 6) {
		if(this._time_data[1] != 5)
			this._callEventTimeSystemSunrise()
		this._time_data[1] = 5 // Sunrise
	} else if (this.hour() >= 3) {
		if(this._time_data[1] != 4)
			this._callEventTimeSystemDawn()
		this._time_data[1] = 4 // Dawn
	} 
};
//==============================
// * Time callouts
//==============================
//-- Overwrite these to hook into the callouts
Game_System.prototype._callEventTimeSystemNight = function() {
	//console.warn("_callEventTimeSystemNight")
}
Game_System.prototype._callEventTimeSystemDusk = function() {
	//console.warn("_callEventTimeSystemDusk")
}
Game_System.prototype._callEventTimeSystemSunset = function() {
	//console.warn("_callEventTimeSystemSunset")
}
Game_System.prototype._callEventTimeSystemNormal = function() {
	//console.warn("_callEventTimeSystemNormal")
}
Game_System.prototype._callEventTimeSystemSunrise = function() {
	//console.warn("_callEventTimeSystemSunrise")
}
Game_System.prototype._callEventTimeSystemDawn = function() {
	//console.warn("_callEventTimeSystemDawn")
}
} //------MOG_TimeSystem

//==============================
// * Scene_Menu
//==============================
if(Echomap.ECH_CustomPluginFixes.SingleActorMode) {
// Update to select just a single person from Yanfly's menu manager
Scene_Menu.prototype.commandPersonalSingle = function() {
    this._statusWindow.setFormationMode(false);
    this._statusWindow.selectLast();
    this.onPersonalOk(this);
};
//was: this.commandPersonal.bind(this)
//now: this.commandPersonalSingle.bind(this)
}

//==============================
// * VE_Single_Actor
//==============================
if(Imported["VE_Single_Actor"]){
	// Rows for menucommands
	Window_MenuCommand.prototype.numVisibleRows = function() {
		return this.maxItems();
	};
	
	// this will create commandwindow
    Scene_Menu.prototype.createCommandWindow = function() {		
		//this._commandWindow = new Window_MenuCommand(0, 0);
		//this.createCommandWindowBinds();
		//this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
		//this.addWindow(this._commandWindow);
		
        this._commandWindow = new Window_MenuCommand(95, 230); //Position for menu x and y
        this._commandWindow.setHandler('item',      this.commandItem.bind(this));
        this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
        this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
        this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
        this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
        this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
        this._commandWindow.setHandler('save',      this.commandSave.bind(this));
        this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
        this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };
	// this will create menus like status- and gold window
	var _Scene_Menu_create2 = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		_Scene_Menu_create2.call(this);
		this._goldWindow.x = 240;//Graphics.boxWidth / this._goldWindow.width + 92;
		this._goldWindow.y = 0;//Graphics.boxHeight - this._goldWindow.height - 135;
		this._statusWindow.x = 240;
		this._statusWindow.y = this._goldWindow.y + this._goldWindow.height;
	};
	
}

//=============================================================================
// End of File
//=============================================================================
