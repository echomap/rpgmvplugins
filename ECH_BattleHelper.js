//=============================================================================
// ECH_BattleHelper.js
// DESC
// Echomap Plugin echomap<echomap@gmail.com>
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v0.10 Enables callbacks for events in the BattheManager
 * @author Echomap Plugins
 *
 * @param ---General---
 * @default
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Enables scripts to register callbacks for these EVENTS:
 *
Echomap.ECH_BattleHelper.callbacktypes.preaction        = "preaction"
Echomap.ECH_BattleHelper.callbacktypes.postaction       = "postaction"
Echomap.ECH_BattleHelper.callbacktypes.endaction        = "endaction"
Echomap.ECH_BattleHelper.callbacktypes.counterattack    = "counterattack"
Echomap.ECH_BattleHelper.callbacktypes.startturn        = "startturn"
Echomap.ECH_BattleHelper.callbacktypes.postorders       = "postorders"
Echomap.ECH_BattleHelper.callbacktypes.endturn          = "endturn"
Echomap.ECH_BattleHelper.callbacktypes.endbattle        = "endbattle"
Echomap.ECH_BattleHelper.callbacktypes.startbattle      = "startbattle"
Echomap.ECH_BattleHelper.callbacktypes.poststateadded   = "poststateadded"
Echomap.ECH_BattleHelper.callbacktypes.poststateremoved = "poststateremoved"
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
 * Echomap.ECH_BattleHelper.addCallback (type, functioncall ) 
 * Echomap.ECH_BattleHelper.testStartCallback ()
 * Echomap.ECH_BattleHelper.callCallback (callbacktype) 
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
 * - 2023 09 03: initial
 *
 * ============================================================================
 * TODO
 * ============================================================================
 * //TODO End Battle
 * //TODO magicreflect
 * // "startaction"
 * //TODO end Battle
 * 
 * ============================================================================
 * Plugin License
 * ============================================================================
 * https://choosealicense.com/licenses/agpl-3.0/
 * echomap@gmail.com
 */
//=============================================================================

var Imported = Imported || {};
Imported["ECH - BattleHelper"] = '20230903.1';
Imported.ECH_BattleHelper = true;

var Echomap = Echomap || {};
Echomap.ECH_BattleHelper = Echomap.ECH_BattleHelper || {};
Echomap.ECH_BattleHelper.MyPluginName = "ECH_BattleHelper";
Echomap.ECH_BattleHelper.alias = {}
Echomap.ECH_BattleHelper.callbacks = []
if(Echomap.Utils)
	Echomap.Utils.sayHello("ECH_BattleHelper",Imported['ECH - BattleHelper']);

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.ECH_BattleHelper.Parameters = PluginManager.parameters("ECH_BattleHelper");
Echomap.Params = Echomap.Params || {};
//-----------------------------------------------------------------------------

//=============================================================================
//=============================================================================
// ** This Plugin
//=============================================================================	

//-----------------------
// ** Constants
//-----------------------

Echomap.ECH_BattleHelper.callbacktypes = {}
Echomap.ECH_BattleHelper.callbacktypes.preaction        = "preaction"
Echomap.ECH_BattleHelper.callbacktypes.postaction       = "postaction"
Echomap.ECH_BattleHelper.callbacktypes.endaction        = "endaction"
Echomap.ECH_BattleHelper.callbacktypes.counterattack    = "counterattack"
Echomap.ECH_BattleHelper.callbacktypes.startturn        = "startturn"
Echomap.ECH_BattleHelper.callbacktypes.postorders       = "postorders"
Echomap.ECH_BattleHelper.callbacktypes.endturn          = "endturn"
Echomap.ECH_BattleHelper.callbacktypes.endbattle        = "endbattle"
Echomap.ECH_BattleHelper.callbacktypes.startbattle      = "startbattle"
Echomap.ECH_BattleHelper.callbacktypes.poststateadded   = "poststateadded"
Echomap.ECH_BattleHelper.callbacktypes.poststateremoved = "poststateremoved"

//-----------------------
// ** Plugin Script/Functions
//-----------------------
//
Echomap.ECH_BattleHelper.addCallback = function (type, functioncall ) {
	if( Echomap.ECH_BattleHelper.callbacks[type] === undefined )
		Echomap.ECH_BattleHelper.callbacks[type] = []
	//TODO check if on there already?
	Echomap.ECH_BattleHelper.callbacks[type].push(functioncall)
}

//for (item in flist) {
Echomap.ECH_BattleHelper.testStartCallback = function () {
	console.warn("<Test start callback called>")
	//BattleManager._subject == Game_Actor
	//BattleManager._targets == array Game_Enemy
}

Echomap.ECH_BattleHelper.callCallback = function (callbacktype) {
	console.warn("CallCallback for type: " + callbacktype )
	var flist = Echomap.ECH_BattleHelper.callbacks[callbacktype]
	if(flist!=undefined){
		flist.forEach((tcallout) => {
			var bind = eval(tcallout);
			if (bind != ''){
				bind.call(this);
			}
		});
	}
}

//=============================================================================
//=============================================================================
// ** Game Systems
//=============================================================================	

//=======================
// ** Window_BattleActor
//=======================

//Make user only skills, not require a select ME
Echomap.ECH_BattleHelper.alias.Window_BattleActor_autoSelect = Window_BattleActor.prototype.autoSelect
Window_BattleActor.prototype.autoSelect = function() {
	Echomap.ECH_BattleHelper.alias.Window_BattleActor_autoSelect.call(this);
	//
	var action = BattleManager.inputtingAction();
	if (action.isForUser()) {
		//Scene_Battle.prototype.onActorOk.call(this);
		action._targetIndex = 0;
		action.setTarget(0);
		var tScene = SceneManager._scene
		tScene._actorWindow.select(0)
		tScene._actorWindow.hide();
		tScene._actorWindow.active = false
		tScene._skillWindow.hide();
		tScene._itemWindow.hide();
		tScene.selectNextCommand();
		//BattleManager.updateTurn()
	}
};

//Game_Action.prototype.needsSelection = function() {
//    return this.checkItemScope([1, 7, 9, 11]);
//};

//=======================
// ** BattleManager
//=======================
/*
Echomap.ECH_BattleHelper.alias.BattleManager_startBattle = BattleManager.startBattle
BattleManager.startBattle = function() {
	console.log("BattleManager.startBattle")
	Echomap.ECH_BattleHelper.alias.BattleManager_startBattle.call(this)	
	// Setup Test Callback
	//Echomap.ECH_BattleHelper.addCallback( Echomap.ECH_BattleHelper.callbacktypes.actionstart, "Echomap.ECH_BattleHelper.testStartCallback" )
}*/

//
Echomap.ECH_BattleHelper.alias.BattleManager_startTurn = BattleManager.startTurn
BattleManager.startTurn = function() {
	console.log("BattleManager.startTurn")
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.startturn);
	Echomap.ECH_BattleHelper.alias.BattleManager_startTurn.call(this);
	//after player selects command action
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.postorders);
}
// called from invokeAction
// can get values from BattleManager._targets["0"]._result
Echomap.ECH_BattleHelper.alias.BattleManager_invokeNormalAction = BattleManager.invokeNormalAction
BattleManager.invokeNormalAction = function(subject, target) {
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.preaction)
	Echomap.ECH_BattleHelper.alias.BattleManager_invokeNormalAction.call(this, subject, target);
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.postaction)
}
// End of Actor and Enemy's turn
Echomap.ECH_BattleHelper.alias.BattleManager_endAction = BattleManager.endAction
BattleManager.endAction = function() {
	console.log("BattleManager.endAction")
	Echomap.ECH_BattleHelper.alias.BattleManager_endAction.call(this);
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.endaction);
}
//
Echomap.ECH_BattleHelper.alias.BattleManager_endTurn = BattleManager.endTurn
BattleManager.endTurn = function() {
	console.log("BattleManager.endTurn")
	Echomap.ECH_BattleHelper.alias.BattleManager_endTurn.call(this);
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.endturn);
}
Echomap.ECH_BattleHelper.alias.BattleManager_startBattle = BattleManager.startBattle
BattleManager.startBattle = function() {
	console.log("BattleManager.startBattle")
	Echomap.ECH_BattleHelper.alias.BattleManager_startBattle.call(this);
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.startbattle);
}

Echomap.ECH_BattleHelper.alias.BattleManager_endBattle = BattleManager.endBattle
BattleManager.endBattle = function(result) {
	console.log("BattleManager.endBattle")
	Echomap.ECH_BattleHelper.alias.BattleManager_endBattle.call(this);
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.endbattle);
}
//
//
//TODO  updatePhase
// TODO FUTURE add callbacks TODO
//
Echomap.ECH_BattleHelper.alias.BattleManager_startAction = BattleManager.startAction
BattleManager.startAction = function() {	
	console.log("BattleManager.startAction")
	Echomap.ECH_BattleHelper.alias.BattleManager_startAction.call(this);	
}
//
Echomap.ECH_BattleHelper.alias.BattleManager_updateTurn = BattleManager.updateTurn
BattleManager.updateTurn = function() {
	console.log("BattleManager.updateTurn")
	Echomap.ECH_BattleHelper.alias.BattleManager_updateTurn.call(this);
}
//
Echomap.ECH_BattleHelper.alias.BattleManager_processTurn = BattleManager.processTurn
BattleManager.processTurn = function() {
	console.log("BattleManager.processTurn")
	Echomap.ECH_BattleHelper.alias.BattleManager_processTurn.call(this);
}
// Called from startTurn -- creates order of turns
Echomap.ECH_BattleHelper.alias.BattleManager_makeActionOrders = BattleManager.makeActionOrders
BattleManager.makeActionOrders = function() {
	console.log("BattleManager.makeActionOrders")
	Echomap.ECH_BattleHelper.alias.BattleManager_makeActionOrders.call(this);
}
// Called from update
Echomap.ECH_BattleHelper.alias.BattleManager_updateAction = BattleManager.updateAction
BattleManager.updateAction = function() {
	console.log("BattleManager.updateAction")
	Echomap.ECH_BattleHelper.alias.BattleManager_updateAction.call(this);
}
// Called from updateAction -- calls invokeNoramlAction, counterattack, magic reflect
Echomap.ECH_BattleHelper.alias.BattleManager_invokeAction = BattleManager.invokeAction
BattleManager.invokeAction = function(subject, target) {
	console.log("BattleManager.invokeAction")
	Echomap.ECH_BattleHelper.alias.BattleManager_invokeAction.call(this,subject, target);
}
// TODO FUTURE add callbacks TODO

//=======================
// ** Game_BattlerBase
//=======================

Echomap.ECH_BattleHelper.Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
Game_BattlerBase.prototype.addNewState = function(stateId) {
    Echomap.ECH_BattleHelper.Game_BattlerBase_addNewState.call(this,stateId);
	//
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.poststateadded)
};

Echomap.ECH_BattleHelper.Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
Game_BattlerBase.prototype.eraseState = function(stateId) {
	Echomap.ECH_BattleHelper.Game_BattlerBase_eraseState.call(this,stateId);
	//
	Echomap.ECH_BattleHelper.callCallback(Echomap.ECH_BattleHelper.callbacktypes.poststateremoved)
};

//=======================
// ** Game_Actor
//=======================

/*Echomap.ECH_BattleHelper.alias.Game_Actor_performActionStart = Game_Actor.prototype.performActionStart
Game_Actor.prototype.performActionStart = function(action) {
	Echomap.ECH_BattleHelper.alias.Game_Actor_performActionStart.call(this, action)
    //
	var flist = Echomap.ECH_BattleHelper.callbacks[Echomap.ECH_BattleHelper.callbacktypes.actionstart]
		
	if(flist!=undefined){
		flist.forEach((tcallout) => {
			var bind = eval(tcallout);
			if (bind != ''){
				bind.call(this);
			}
		});
	}
};
*/
/*
Echomap.ECH_BattleHelper.alias.Game_Actor_performAction = Game_Actor.prototype.performAction
Game_Actor.prototype.performAction = function(action) {
	console.log("Game_Actor.performAction: action: " + action )
	Echomap.ECH_BattleHelper.alias.Game_Actor_performAction.call(this, action);
}
*/

//=============================================================================
// End of File
//=============================================================================
