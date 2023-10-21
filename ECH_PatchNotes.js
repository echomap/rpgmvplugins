//=============================================================================
// ECH_PatchNotes.js
// Display Patch Notes from a File
// Echomap Plugin echomap<echomap@gmail.com>
//=============================================================================
 
 //=============================================================================
 /*:en
 * @author Echomap / adapted Yanfly's patch notes plugin
 * @plugindesc Displays the patchnotes, in menus and free form, uses ECH_FullWindow for full screen view
 *
 *
 * @param ---File---
 * @default
 *
 * @param Patch Notes File
 * @parent ---General---
 * @desc Filename used for the Patch Notes. Place this inside your
 * project's main folder.
 * @default patchnotes.txt
 *
 * @param ---Title---
 * @default
 *
 * @param PatchTitleCommand
 * @text Command Name
 * @parent ---Title---
 * @desc This is the text used for the menu command.
 * @default Patch Notes
 *
 * @param Add Title Screen
 * @parent ---Title---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Add the 'Patch Notes' command to the title screen?
 * NO - false     YES - true
 * @default true
 *
 * @param ---Main Menu---
 * @default
 *
 * @param PatchMenuCommand
 * @text Command Name
 * @parent ---Menu---
 * @desc This is the text used for the menu command.
 * @default Patch Notes
 *
 * @param Auto Add Menu
 * @parent ---Menu---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Automatically add the 'Patch Notes' command to the main menu?
 * NO - false     YES - true
 * @default true
 *
 * @param Show Command
 * @parent ---Menu---
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show the Patch command in the main menu by default?
 * NO - false     YES - true
 * @default true
 *
 * @param Auto Place Command
 * @parent ---Menu---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Allow this plugin to decide the menu placement position?
 * NO - false     YES - true
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Displays the patchnotes, in menus and free form, uses ECH_FullWindow for full screen view
 *
 * Adapted Yanfly's patch notes plugin to use my full screen window, since
 *  it was a simple example of using their 'Main Menu Manager',
 * 
 * ============================================================================
 * YanFly Main Menu Manager
 * ============================================================================
 *       Name: Yanfly.Param.PatchCmd
 *     Symbol: PatchNotes
 *       Show: $gameSystem.isShowPatchNotesCommand()
 *    Enabled: true
 *        Ext: 
 *  Main Bind: this.commandPatchNotes.bind(this)
 * Actor Bind: 
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 * <none>
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * Start with:
 *   PatchNotes or ECH_PatchNotes
 * Sub command:
 *   showPatchNotes
 *   OpenPatchNotes
 *   hidePatchNotes
 *   HideMenuPatcNoteshCommand
 *   ShowMenuPatchNotesCommand
 *   HideMenuPatcNoteshCommand
 * 
 * ============================================================================
 * Plugin Script/Functions
 * ============================================================================
 * Echomap.AccessPatchNotes
 * ============================================================================
 * Plugin Notes
 * ============================================================================
 * Requires 'ECH_FullWindow'
 * Incompatible with 'YEP_PatchNotes'
 * ============================================================================
 * Plugin Internals
 * ============================================================================
 * -<None>
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 0.10:
 * -2023 10 18: XXX
 * -2023 09 03: XXX
 *
 * ============================================================================
 * TODO
 * ============================================================================
 * 
 * ============================================================================
 * Plugin License
 * ============================================================================
 * https://choosealicense.com/licenses/agpl-3.0/
 * echomap@gmail.com
 */
 
var Imported = Imported || {};
Imported["ECH - PatchNotes"] = "2023 10 18"
Imported.ECH_PatchNotes = true;

if (Imported["ECH_FullWindow"] === undefined) {
  throw new Error("Please add ECH_FullWindow before ECH_PatchNotes!");
}
if (Imported["Imported.YEP_PatchNotes"] != undefined) {
  throw new Error("ECH_PatchNotes is incomptible with YEP_PatchNotes!!");
}

var Echomap = Echomap || {};
Echomap.ECH_PatchNotes = Echomap.ECH_PatchNotes || {};
Echomap.ECH_PatchNotes.MyPluginName = "ECH_PatchNotes";
Echomap.ECH_PatchNotes.alias = {}
if(Echomap.Utils)
	Echomap.Utils.sayHello("ECH_PatchNotes", Imported["ECH - PatchNotes"] );
 
//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.ECH_PatchNotes.Parameters = PluginManager.parameters("ECH_PatchNotes");
Echomap.Params = Echomap.Params || {};
Echomap.Params.PatchNotesFilename = String(Echomap.ECH_PatchNotes.Parameters['Patch Notes File']);
Echomap.Params.PatchTitleCmd = String(Echomap.ECH_PatchNotes.Parameters['PatchTitleCommand']);
Echomap.Params.PatchAddTitle = eval(String(Echomap.ECH_PatchNotes.Parameters['Add Title Screen']));
Echomap.Params.PatchCmd = String(Echomap.ECH_PatchNotes.Parameters['PatchMenuCommand']);
Echomap.Params.PatchAutoAdd = eval(String(Echomap.ECH_PatchNotes.Parameters['Auto Add Menu']));
Echomap.Params.PatchShow = eval(String(Echomap.ECH_PatchNotes.Parameters['Show Command']));
Echomap.Params.PatchAutoPlace = eval(Echomap.ECH_PatchNotes.Parameters['Auto Place Command']);
//Echomap.Params.PatchAutoPlace = eval(Echomap.ECH_PatchNotes.PatchAutoPlace);
//-----------------------------------------------------------------------------

//=============================================================================
// ** This Plugin
//=============================================================================	
//<none>

//=============================================================================
// Game_System
//=============================================================================
//Setup command for MM
Echomap.ECH_PatchNotes.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Echomap.ECH_PatchNotes.Game_System_initialize.call(this);
	this.initPatchNotes();
};
//Setup command for MM
Game_System.prototype.initPatchNotes = function() {
  this._PatchNotesCommandShow = Echomap.Params.PatchShow;
};
//Setup command for MM
Game_System.prototype.isShowPatchNotesCommand = function() {
	if (this._PatchNotesCommandShow === undefined)
		this.initPatchNotes();
	return this._PatchNotesCommandShow;
};
//Setup command for MM
Game_System.prototype.setShowPatchNotesCommand = function(value) {
	if (this._PatchNotesCommandShow === undefined)
		this.initPatchNotes();
	this._PatchNotesCommandShow = value;
};

//=============================================================================
// Window_MenuCommand
//=============================================================================

Echomap.ECH_PatchNotes.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
	Echomap.ECH_PatchNotes.Window_MenuCommand_addOriginalCommands.call(this);
	if (Echomap.Params.PatchAutoAdd)
		this.addPatchCommand();
};

Window_MenuCommand.prototype.addPatchCommand = function() {
	if (!Echomap.Params.PatchAutoPlace)
		return;
	if (!$gameSystem.isShowPatchNotesCommand()) 
		return;
	if (this.findSymbol('PatchNotes') > -1) 
		return;
	var text = Echomap.Params.PatchCmd;
	this.addCommand(text, 'PatchNotes', true);
};

//=============================================================================
// Window_TitleCommand
//=============================================================================

Echomap.ECH_PatchNotes.Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
	Echomap.ECH_PatchNotes.Window_TitleCommand_makeCommandList.call(this);
	this.addPatchNotesCommand();
};

Window_TitleCommand.prototype.addPatchNotesCommand = function() {
	if (!Echomap.Params.PatchAddTitle)
		return;
	this.addCommand(Echomap.Params.PatchTitleCmd, 'PatchNotes');
};

//=============================================================================
// Scene_Menu
//=============================================================================

Echomap.ECH_PatchNotes.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
	Echomap.ECH_PatchNotes.Scene_Menu_createCommandWindow.call(this);
	this._commandWindow.setHandler('PatchNotes', this.commandPatchNotes.bind(this));
};

Scene_Menu.prototype.commandPatchNotes = function() {
	Echomap.AccessPatchNotes();
	this._commandWindow.activate();
};

//=============================================================================
// Scene_Title
//=============================================================================

Echomap.ECH_PatchNotes.Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
  Echomap.ECH_PatchNotes.Scene_Title_createCommandWindow.call(this);
  this._commandWindow.setHandler('PatchNotes', this.commandPatchNotes.bind(this));
};

Scene_Title.prototype.commandPatchNotes = function() {
	Echomap.AccessPatchNotes();
	this._commandWindow.activate();
};

//=============================================================================
// Utilities
//=============================================================================

Echomap.AccessPatchNotes = function() {
	//if ($gameTemp.isPlaytest())
	//	console.log('Opening Patch Notes File...');
	TouchInput.clear();
	Input.clear();
	fetch(`../patchnotes.txt`)
		.then(response =>
		response.text().then(text => {
			//
			Echomap.ECH_FullWindow.clearLogData("patchnotes")
			Echomap.ECH_FullWindow.addLogData("patchnotes",text);
			Echomap.ECH_FullWindow.showLogData("patchnotes", "Patch Notes");
		})
	)
	.catch(err => console.error("Unable to read text file", err));
};

//=============================================================================
// Game_Interpreter
//=============================================================================

//==============================
// * PluginCommand
//==============================

Echomap.ECH_PatchNotes.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Echomap.ECH_PatchNotes.Game_Interpreter_pluginCommand.call(this, command, args);
	if (command !== 'PatchNotes' && command !== 'ECH_PatchNotes') {
		return;
	}
	switch (args[0]) {
		case 'showPatchNotes':
		case 'OpenPatchNotes':
			Echomap.AccessPatchNotes();
			break;
		case 'hidePatchNotes':
		case 'HideMenuPatcNoteshCommand':
			//TODO Echomap.HidePatchNotes();
			break;
		case 'ShowMenuPatchNotesCommand':
			$gameSystem.setShowPatchNotesCommand(true);
			break;
		case 'HideMenuPatcNoteshCommand':
			$gameSystem.setShowPatchNotesCommand(false);
			break;
		default:
			console.error('Error with param: ' + args[0]);
	}
};

//=============================================================================
// End of File
//=============================================================================
