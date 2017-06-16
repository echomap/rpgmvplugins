//=============================================================================
// Echomap Composite Character Generator Plugin
// ECH_CCG.js
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v20160815.3 (Requires ECH_Utils.js) Creates a composite image from a bunch of smaller pieces.
 * @author Echomap Plugins
 *
 * @param ---General---
 * @default
 *
 * @param writeToDisk
 * @desc write composite image to disk on=true, off=false
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin combine layers of images to dynamically create the sprite sheets.
 *
 * Sprite Type:
 * 	There are three types of sprite sheets.
 *      1. SV/Battler
 *      2. TV/MapCharacter
 *      3. Face/Profile
 *	 Each has a different layout of layers from 0 up.
 *	 Layers can be specified as # or as a name. See the function
 *		"Echomap.CCGUtil.parseLayerNameToId" for the specifics as to what
 *		layer # each NAME maps to and what layer level should proably be
 * 		specified for each sprite type.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Actor and Equipment Notetags:
 *	Starting composites can be specified in the Actor's notetags.
 *
 *	Notetags start and end with tags, like:
 *		CCGProfileFace, CCGProfileTV, CCGProfileSV
 *
 *	To specify the list of layers to combine for the ACTOR's face/profile
 * 		sheet. for example:
 *   <CCGProfileFace>
 *      1: face/FG_Body_p01_c1_m001.png, 0
 *      2: face/FG_Face_p01_c1_m001.png, 0
 *      ...
 *   </CCGProfileFace>
 *
 *	To specify the list of layers to combine for the ACTOR's TV/MapCharacter
 * 		sheet. for example:
 *	 ie:
 *   <CCGProfileTV>
 *      1: tv/TV_Wing2_p02.png, 0
 *      2: tv/TV_Tail2_p03.png, 0
 *      ...
 *   </CCGProfileTV>
 *
 * To specify the list of layers to combine for the ACTOR's SV/Battler
* 		sheet. for example:
 *   <CCGProfileSV>
 *      1: sv/SV_Tail_p06.png, 0
 *      2: sv/SV_Wing_p03.png, 0
 *      ...
 *   </CCGProfileSV>
 *
 * List of equipment to show by default if no equipment covers the ACTOR
 *	 in those areas/layers.
 * 	TODO: (START Of work, not finished), as should be one for TV and SV
 *   <CCGEquipFace>
 *      ...
 *   </CCGEquipFace>
 *
 * The lines of data inside these tags can be a few different types:
 *	a) layer#: file hue
 *	 1: sv/SV_Tail_p06.png 0
 *	b) layerName: file hue
 *	 tail: sv/SV_Tail_p06.png 0
 *	c) layerName: file hue R G B
 *	 tail: sv/SV_Tail_p06.png 0 20 10 30
 *
 * Slots, like 'tail' and 'face' are mapped to layer#'s
 *		in Echomap.CCGUtil.parseLayerNameToId
 *
 *	HUE: Is specified as per other items in RPMGMaker
 *	R G B are apparently adjustments to the RGB, not sure yet< TODO >
 *
 * Equipment Notetags:
 *	Note tags in equipment , armor, etc, need to be specified like this instead
 *		of the above, because of how it seeems RPGMaker allows access to metadata.
 *
 *   <CCG_ITEM_FACE:FILENAME,FILENAME...>
 *   <CCG_ITEM_TV:FILNAME,...>
 *      ie: <CCG_ITEM_TV:tv/TV_Clothing1_p14 >
 *   <CCG_ITEM_SV:layerID: FILENAME HUE,... >
 *      ie: <CCG_ITEM_SV:11: sv/SV_Cloak2_p01 0,11:sv/SV_Cloak1_p01 0,10: sv/SV_Clothing1_p04 0>
 *
 *
 *	 TODO: <CCG_VARIABLE_ID: variableid > variable id to store this data for use/cache
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * Plugin Command(s):
 *   addLayerToActor  - Adds a layer to an ACTOR
 *                          Params: actorId,layerName,fileName,layerType
 *   remLayerToActor  - Removes a layer actorId,layerName,fileName,layerType
  *                          Params: actorId,layerName,fileName,layerType
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 2016 08 13 updates to queue
 * 2016 08 11 updated to store data in game-actor not plugin
 * 2016 07 28 updates to work with "MOG_ActorHud.js" (v0.11)
 * 2016 06 11 Initial working version (v0.10)
 *
 * ============================================================================
 * TODO
 * ============================================================================
 * Equipment by actor in the tag
 * Equipment gender or tagged for specific actor or gender, etc.
 * default equipped for SV/TV
 *
 * Default EQ by actor
 * Spreadsheet?
 * more layers, ie: boots, socks, shirt, jacket
 * documentation
 * gameVariables to store layers in? but why?
 *
 * ============================================================================
 * Questions / Unknown
 * ============================================================================
 * How will this react on slow computers?
 * what are the _c images for? Masks, to better change the hue/colors?
 *
 * ============================================================================
 * Additional Actor storage data
 * ============================================================================
 gameActor.isComposite = undefined;
 gameActor.isCompositeFace
 gameActor.isCompositeTV
 gameActor.isCompositeSV
 gameActor.composite = {};
 gameActor.composite.filename = {};
 gameActor.composite.filename.face = facesPath + 'writenewcompimage_'+objId+'.png';
 gameActor.composite.filename.tv   = facesPath + 'writenewcompimage_'+objId+'.png';
 gameActor.composite.filename.sv   = facesPath + 'writenewcompimage_'+objId+'.png';
 gameActor.composite.layerdata = {};
 raw = the actor's body parts / equip = the actors equipment layer /
    defequip = the equipment to show if there is nothign in the equip layer
 gameActor.composite.layerdata.face  .raw/.equip/.defequip
 gameActor.composite.layerdata.tv    .raw/.equip/.defequip
 gameActor.composite.layerdata.sv    .raw/.equip/.defequip
 gameActor.composite.layerdata.backup ...

 gameActor.faceNameOrig  = $dataActors[actorId].faceName;
 gameActor.faceIndexOrig = $dataActors[actorId].faceIndex;
 dataActor.characterNameOrig  = $dataActors[actorId].characterName;
 dataActorcharacterIndexOrig = $dataActors[actorId].characterIndex;
 dataActor.battlerNameOrig  = $dataActors[actorId].battlerName;
 dataActor.battlerIndexOrig = $dataActors[actorId].battlerIndex;
 * ============================================================================
 * Data Structurs
 * ============================================================================
 * Echomap_Queue
 * Echomap_Processor
 * Echomap_LoaderCCG
 * Echomap_CCG_ImgObject
 * Echomap.CCGUtil
 * Echomap_ProcessCCG
 */
//=============================================================================

var Imported = Imported || {};
Imported['ECH - CCG'] = '20160815.3';
Imported.Echomap_CCG = true;

if (Imported["ECH - Utils"] === undefined) {
  throw new Error("Please add ECH_Utils before ECH_CCG!");
}

var Echomap = Echomap || {};
Echomap.CCG = Echomap.CCG || {};
Echomap.CCG.Waiters      = new Array();
Echomap.CCG.DataLoaded = false;
Echomap.Utils.sayHello("ECH_CCG",Imported['ECH - CCG']);

//=============================================================================
// Parameter Variables
//=============================================================================
Echomap.CCG.Parameters = PluginManager.parameters('ECH_CCG');
Echomap.Params = Echomap.Params || {};
Echomap.Params.writeToDisk = String(Echomap.CCG.Parameters['writeToDisk']) || true;

//=============================================================================
// Boot Strapping Overrides
//=============================================================================
Echomap.CCG.Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    Echomap.CCG.Scene_Title_commandNewGame.call(this);
    Echomap.Utils.log('commandNewGame(CCG)', 'commandNewGame');
    if ($gameActors && $gameActors._data) {
        var eProc = new Echomap_LoaderCCG();
        eProc.processNotetagsToGame($gameActors._data);
    }
    Echomap.Utils.log('commandNewGame(CCG)', 'Done');
}
/* TODO: is there any reason to load notetags now? by using DataManager.loadGame */

//-----------------------------------------------------------------------------

//=============================================================================
// Echomap.Util
//=============================================================================
Echomap.Utils.log_override = Echomap.Utils.log;
Echomap.Utils.log = function(methodname,msg1,msg2,level) {
	Echomap.Utils.log_override.call(this, methodname,msg1,msg2,level);
	if(Echomap.Utils.debuglevel > 6) {
		console.log('Echomap.CCG WaitersCount: '+ Echomap.CCG.Waiters.length );
	}
};
//-----------------------------------------------------------------------------

//=============================================================================
// Echomap_Queue
// DESC
//=============================================================================
function Echomap_Queue() {
    this.initialize.apply(this, arguments);
}
Echomap_Queue.prototype.initialize = function() {
	Echomap.Utils.log('Echomap_Queue', 'initialize' );
    ccgqueue = []
};
Echomap_Queue.prototype.queue = function (eProc) {
    Echomap.Utils.log('queue', 'requeue', eProc.toString() );
    ccgqueue.push(eProc);
}
Echomap_Queue.prototype.queueImageCreateForActor = function (actor,parttype) {
    Echomap.Utils.log('queueImageCreateForActor', 'Called w/actorId: '+actor._actorId+ ' parttype: '+parttype);
    var eProc = new Echomap_Processor(this,actor,parttype);
    Echomap.Utils.log('queueImageCreateForActor', 'queue', eProc.toString() );
    ccgqueue.push(eProc);
    Echomap.Utils.log('queueImageCreateForActor', 'ccgqueue size', ccgqueue.length);
    Echomap.Utils.log('queueImageCreateForActor', 'Done');
}

Echomap_Queue.prototype.processQueue = function (actor,parttype) {
    if(ccgqueue.length>0)
        Echomap.Utils.log('processQueue', 'ccgqueue size', ccgqueue.length);
    var eProc = ccgqueue.pop(); //Echomap_Processor
    if(eProc==undefined) {
        //Echomap.Utils.log('processQueue', 'NO processing' );
        return;
    }
    //Check if processing
    if(eProc.isDone()){
        Echomap.Utils.log('processQueue', 'Done processing', eProc.toString() );
        return;
    }
    //check if expired
    if(eProc.isExpired()){
        Echomap.Utils.log('processQueue', 'Expired processing', eProc.toString() );
        return;
    }
    //run processor
    Echomap.Utils.log('processQueue', 'processing', eProc.toString() );
    eProc.doWork();
    //put back on list if not done
    //ccgqueue.push(eProc);
}

//Echomap.CCG.Echomap_Queue = new Echomap_Queue();

//-----------------------------------------------------------------------------

//=============================================================================
// Scene_Base
// overrides
//=============================================================================
Echomap.CCG.Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    Echomap.CCG.Scene_Base_update.call(this);

    if (Echomap.CCG.Echomap_Queue === undefined) {
        Echomap.Utils.logTrace('Scene_Base', 'No echomap Queue',undefined, Echomap.Utils.trace );
        return;
    }
    Echomap.CCG.Echomap_Queue.processQueue();
};

//-----------------------------------------------------------------------------

//=============================================================================
// Echomap_Processor
// DESC
//=============================================================================
function Echomap_Processor() {
    this.initialize.apply(this, arguments);
}

Echomap_Processor.prototype.initialize = function(queue,actor,parttype) {
	Echomap.Utils.log('Echomap_Processor', 'initialize' );
    var dtn = Date.now();
    this.bmp0FA    = undefined;
    this._manager  = queue; // Echomap_Queue
    this._actor    = actor;
    this._parttype = parttype
    this._nowDate  = dtn;
    this.workNum   = 0;
    this.done    = false;
    this.expired = false;
    this.error   = false;
    this.running = false;
    this.workingOnEquip = false;
    this.loadedEquip    = false;
    this.workingOnImgX  = false;
    this.loadedEqX      = false;
    this.loadedImgX     = false;
    this.doneWithImgX   = false;
    this.composingImgX  = false;
    this.composingImgXF = false;
    this.composedImgX   = false;
    this.composingLevel      = 0;
    this.combiningLvlStarted = false;
};

Echomap_Processor.prototype.toString = function () {
    return "EP:"+this._nowDate+" id:"+this._actor._actorId+" pt:"+this._parttype;
}
Echomap_Processor.prototype.isDone = function () {
    return this.done;
}
Echomap_Processor.prototype.isError = function () {
    return this.error;
}
Echomap_Processor.prototype.isRunning = function () {
    return this.running;
}
Echomap_Processor.prototype.isExpired = function () {
    return this.expired;
}
Echomap_Processor.prototype.putBackOnList = function () {
    this._manager.queue(this);
}
Echomap_Processor.prototype.doWork = function () {
    this.workNum += 1;
    this.running = true;

    if(!this.workingOnEquip && !this.loadedEquip){
        this.workingOnEquip = true;
        var loaderProc = new Echomap_LoaderCCG();
        loaderProc.processActorEquipped(this._actor);
        this.workingOnEquip = false;
        this.loadedEquip = true;
        this.running = false;
        this.putBackOnList()
        return;
    }

    //Echomap.Utils.log('doWork', 'Called');
    if(this._parttype == Echomap.CCGUtil.partytype.face ){
        var imgLayersA = this._actor.composite.layerdata.face.raw;
        var imgLayersE = this._actor.composite.layerdata.face.equip;
        var imgLayersD = this._actor.composite.layerdata.face.defequip;
        this.createCompositeImgX(144,144, imgLayersA, imgLayersE, imgLayersD, this._actor.composite.filename.face);
    } else
    if(this._parttype == Echomap.CCGUtil.partytype.tv ) {
        var imgLayersA = this._actor.composite.layerdata.tv.raw;
        var imgLayersE = this._actor.composite.layerdata.tv.equip;
        this.createCompositeImgX(576,384, imgLayersA, imgLayersE, undefined, this._actor.composite.filename.tv);
    } else
    if(this._parttype == Echomap.CCGUtil.partytype.sv ) {
        var imgLayersA = this._actor.composite.layerdata.sv.raw;
        var imgLayersE = this._actor.composite.layerdata.sv.equip;
        this.createCompositeImgX(576,384, imgLayersA, imgLayersE, undefined, this._actor.composite.filename.sv);
    }
    //put back on list if not done
    if(!this.done) {
        this.running = false;
        this.putBackOnList()
    } else {
        Echomap.Utils.log('doWork', 'DONE with this eproc', this.toString() );
    }
}

Echomap_Processor.prototype.createCompositeImgX = function (basewidth,baseheight, imgLayersA, imgLayersE, imgLayersD, filePath ) {
    var width = basewidth , height = baseheight;
    if(this.bmp0FA==undefined)
        this.bmp0FA  = new Bitmap(width,height);

    if( imgLayersA == null ) {
        Echomap.Utils.log('createCompositeImgX', 'ERROR: Called but no layers?');
        this.done  = true;
        this.error = true;
        return false;
    }
    //this.done          = false;
    this.workingOnImgX = true;
    this.doneWithImgX  = false;

    // merge with Equipped
    if( !this.loadedEqX ) {
        Echomap.Utils.log('createCompositeImgX', 'load equip images layer on parttype', this._parttype );
        for (var i = 0, len = imgLayersA.length; i < len; i++) {
            this.loadImagesLayer(this.bmp0FA,imgLayersE[i]);
        }
        if(imgLayersD!=undefined) {
            for (var i = 0, len = imgLayersD.length; i < len; i++) {
                this.loadImagesLayer(this.bmp0FA,imgLayersD[i]);
            }
        }
        this.loadedEqX = true;
        return;
    }
    if( !this.loadedImgX ) {
        Echomap.Utils.log('createCompositeImgX', 'load images layer on parttype', this._parttype );
        //this.createCompositeImg3(actorId,bmp0a,imgLayers,filePath,baseImagePath,parttype);
        for (var i = 0, len = imgLayersA.length; i < len; i++) {
    		this.loadImagesLayer(this.bmp0FA,imgLayersA[i]);
    	}
        this.done       = false;
        this.loadedImgX = true;
        return;
    }
    // check images are loaded? ( 1.3.1 ImageManager.cache )
    for (var i = 0, len = imgLayersA.length; i < len; i++) {
          var localLayer = imgLayersA[i];
          for (var ji = 0, len = localLayer.length; ji < len; ji++) {
              var imageLocal = localLayer[ji];
              var dpath  = imageLocal.getDPath();
              //var kval   = ImageManager.cache._inner[key];
			  var kval   = ImageManager.GetCacheEcho(key);
              if(kval) //done = false;
                  return;
              //var bitmap = ImageManager.cache._inner[key].item;
			  var bitmap = ImageManager.SetCacheEcho(key, item);
              if (bitmap.isError()) {
                  throw new Error('Failed to load: ' + bitmap.url);
              }
              if (!bitmap.isReady()) {
                  return; //done = false;
              }
              //this.loadImagesLayer(bmp0,imgLayers[i]);
              //done = false;
          }
    }
    for (var i = 0, len = imgLayersE.length; i < len; i++) {
          var localLayer = imgLayersE[i];
          for (var ji = 0, len = localLayer.length; ji < len; ji++) {
              var imageLocal = localLayer[ji];
              var dpath  = imageLocal.getDPath();
              //var kval   = ImageManager.cache._inner[key];
              var kval   = ImageManager.GetCacheEcho(key);
              if(kval) //done = false;
                  return;
              //var bitmap = ImageManager.cache._inner[key].item;
              var bitmap = ImageManager.SetCacheEcho(key,item);
              if (bitmap.isError()) {
                  throw new Error('Failed to load: ' + bitmap.url);
              }
              if (!bitmap.isReady()) {
                  return; //done = false;
              }
              //this.loadImagesLayer(bmp0,imgLayers[i]);
              //done = false;
          }
    }
    if(imgLayersD!=undefined) {
        for (var i = 0, len = imgLayersD.length; i < len; i++) {
              var localLayer = imgLayersD[i];
              for (var ji = 0, len = localLayer.length; ji < len; ji++) {
                  var imageLocal = localLayer[ji];
                  var dpath  = imageLocal.getDPath();
                  //var kval   = ImageManager.cache._inner[key];
				  var kval   = ImageManager.GetCacheEcho(key);
                  if(kval) //done = false;
                      return;
                  //var bitmap = ImageManager.cache._inner[key].item;
				  var bitmap = ImageManager.SetCacheEcho(key, item);
                  if (bitmap.isError()) {
                      throw new Error('Failed to load: ' + bitmap.url);
                  }
                  if (!bitmap.isReady()) {
                      return; //done = false;
                  }
                  //this.loadImagesLayer(bmp0,imgLayers[i]);
                  //done = false;
              }
        }
    }
    if(!this.composingImgX && !this.composedImgX) {
        Echomap.Utils.log('createCompositeImgX', 'pre create composite images on parttype', this._parttype );
        this.composingImgX = true;
        this.composingLevel = 0;
        return;
    }
    if(this.composingImgX && !this.composedImgX) {
        Echomap.Utils.log('createCompositeImgX', 'create composite images on parttype', this._parttype );
        this.composedImgX  = false;
        /*
        // Stupid hack to slow this down
        if(!this.composingImgXF){
            this.composingImgXF = true;
            return;
        } else
            this.composingImgXF = false;
        */

        // Check if there are equipped items.
        var fullCntOfEquiped = 0;
        for (var i = 0, len = imgLayersE.length; i < len; i++) {
              var localLayer = imgLayersE[i];
              fullCntOfEquiped += localLayer.length;
        }
        Echomap.Utils.log('createCompositeImgX', 'fullCntOfEquiped',fullCntOfEquiped);
        // if there are equipped items don't use default items
        if(fullCntOfEquiped==0 && imgLayersD!=undefined)
            this.combineImagesLayer(this.bmp0FA,imgLayersA[this.composingLevel],imgLayersD[this.composingLevel]);
        else
            this.combineImagesLayer(this.bmp0FA,imgLayersA[this.composingLevel],imgLayersE[this.composingLevel]);
        this.composingLevel += 1;
        if( this.composingLevel >= imgLayersA.length )
            this.composedImgX  = true;
        return;
    }

    //var filePath = _actor.composite.filename.face;
    Echomap.Utils.log('createCompositeImgX', 'write file on parttype', this._parttype );
	this.bmp0FA.url = filePath;
	if( Echomap.Params.writeToDisk ) {
		var fs = require('fs');
		var imageData = this.bmp0FA.canvas.toDataURL("image/png");
		//data:image/png;base64,
		var newdata = imageData.replace(/^data:image\/(png|jpg);base64,/, "")
		//filePath = dpath+'/writenewimage.png';
		var buf = new Buffer(newdata, 'base64');
		fs.writeFileSync(filePath, buf);
	}

    Echomap.Utils.log('createCompositeImgX', 'cache work on parttype', this._parttype );
    var actorId = this._actor._actorId;
    var hue     = 0; // TODO this default okay?
    var key     = 'img/'+this._parttype+'/writenewcompimage_'+actorId+'.png:' + hue;

	Echomap.Utils.log('createCompositeImgX', 'Delete cache', key );
	ImageManager.ResetCacheEcho(key, this.bmp0FA);
	/*
    if( ImageManager._cache != undefined ) {
        delete ImageManager._cache[key];
        ImageManager._cache[key ] = this.bmp0FA;
    } else {
        // 1.3.1 ImageManager.cache
        // delete ImageManager.cache._inner[key];
        if( ImageManager.cache._inner[key] != undefined )
            ImageManager.cache._inner[key].free();
        ImageManager.cache.setItem(key, this.bmp0FA);
    }
	*/
    // ACTOR HUD
	if(Echomap.CCGUtil.partytype.face === this._parttype) {
		if(Imported.MOG_ActorHud === true) {
            Echomap.Utils.log('createCompositeImgX', 'actor hud on parttype', this._parttype );
			var key2 = 'img/actorhud/Face_' +actorId+ '.png:0';
			//TODO generate new method in imagemanager
			ImageManager.SetCacheEcho(key2, this.bmp0FA);
			/*
            if(ImageManager._cache != undefined) {
                ImageManager._cache[key2] = this.bmp0FA;
            } else {
                ImageManager.cache.setItem(key2, this.bmp0FA);
            }
			*/
			// Find the Actor Hud
			var thisScene =  SceneManager._scene;
		 	if( thisScene != undefined && thisScene.constructor == Scene_Map ) {
				//Scene_Map._spriteset
				var spritset = thisScene._spriteset;
				if(spritset != undefined){
					//Spriteset_Map
					var actorhud = spritset._actor_hud;
					if(actorhud != undefined){
						actorhud.refresh_bhud();
					}
				}
			}
		}
	}

    if( this._parttype === Echomap.CCGUtil.partytype.face ) {
    	Echomap.Utils.log('createCompositeImgX', 'setting actorId face', actorId);
    	//this.setupNames(actorId,parttype);
    	var isComposite = this._actor.isCompositeFace;
    	if(!isComposite) {
    		this._actor.faceNameOrig    = this._actor._faceName;
    		this._actor.faceIndexOrig   = this._actor._faceIndex;
    		this._actor.isCompositeFace = true;
    	}
    	this._actor._faceName  = 'writenewcompimage_'+actorId;
    	this._actor._faceIndex = 0;
    }
    else if( this._parttype === Echomap.CCGUtil.partytype.tv ) {
		Echomap.Utils.log('createCompositeImgX', 'setting actorId tv', actorId);
		var isComposite = this._actor.isCompositeTV;
		if(!isComposite) {
			this._actor.characterNameOrig  = this._actor._characterName;
			this._actor.characterIndexOrig = this._actor._characterIndex;
			this._actor.isCompositeTV = true;
		}
		this._actor._characterName = 'writenewcompimage_'+actorId;
		this._actor._characterIndex = 0;
	}
    else if( this._parttype === Echomap.CCGUtil.partytype.sv ) {
		Echomap.Utils.log('createCompositeImgX', 'setting actorId sv', actorId);
		var isComposite = this._actor.isCompositeSV;
		if(!isComposite) {
			this._actor.battlerNameOrig  = this._actor._battlerName;
			this._actor.battlerIndexOrig = this._actor._battlerIndex;
			this._actor.isCompositeSV = true;
		}
		this._actor._battlerName   = 'writenewcompimage_'+actorId;
		this._actor._battlerIndex = 0;
	} else {
		Echomap.Utils.log('createCompositeImgX', 'ERROR!! no such partType!!!', this._parttype);
	}
    this.updateScenes(this._actor);
    this.doneWithImgX = true;
    this.done         = true;
}

Echomap_Processor.prototype.updateScenes = function(actor) {
	if(SceneManager._scene) {
		//Scene_Boot, Scene_Title
		Echomap.Utils.log('waitForImageLoading', 'SceneManager._scene.constructor=', SceneManager._scene.constructor);
		if( SceneManager._scene.constructor == Scene_Equip ) {
			Echomap.Utils.log('waitForImageLoading', 'Update Equip');
			//SceneManager._scene._statusWindow.contents.clear();
			SceneManager._scene._statusWindow.refresh();
		}
		else if( SceneManager._scene.constructor == Scene_Title ) {
			var sm = SceneManager._scene;
			sm.update();
			var asdf = SceneManager.isNextScene(Scene_Map);
			//this.updateSceneMap(actor);
		} else if( SceneManager._scene.constructor == Scene_Battle ) {
			this.updateSceneBattle(actor);
		} else if( SceneManager._scene.constructor == Scene_Map ) {
			// Why is this sometimes a Window:Infinity
			this.updateSceneMap(actor)
		} else if( SceneManager._scene.constructor == Scene_Boot ) {
			Echomap.Utils.log('waitForImageLoading', 'Scene_Boot');
        //} else if( SceneManager._scene.constructor == Scene_Splash ) {
		//	Echomap.Utils.log('waitForImageLoading', 'Scene_Splash');
		}else {
			Echomap.Utils.log('waitForImageLoading', 'ERROR SCENE UNKNOWN', SceneManager._scene.constructor);
		}
    }//Scene
}
Echomap_Processor.prototype.updateSceneMap = function(actor){
	Echomap.Utils.log('updateSceneMap', 'Called');
	// TODO Really?  need this? cant get a refresh otherwise! for some reason!
	//SceneManager.goto(Scene_Map);
	var sm = SceneManager._scene;
    if(sm==undefined)
        return;
	var ss = sm._spriteset;
    if(ss==undefined)
        return;
	//sm._spriteset.createCharacters(); //Sprite_Character
	$gamePlayer.refresh();
	var calledName = actor.characterName();
	//sm._spriteset.bitmap = ImageManager.loadCharacter(calledName);
	var spritelist = ss._characterSprites;
	for (var i = 0; i < spritelist.length; i++) {
		var spriteSel  = spritelist[i];// Sprite_Character
		//spriteSel.setCharacterBitmap();
		//actorSprite.updateBitmap();
		var imagename = spriteSel._characterName;
		//spriteSel._character ; //Game_Player
		if(imagename && imagename == calledName)
				spriteSel.setCharacterBitmap();
				//spriteSel._mainSprite.bitmap = ImageManager.loadCharacter(name);
	}
	//2
	$gamePlayer.refresh();
}
Echomap_Processor.prototype.combineImagesLayer = function(bmp,imgLayerA,imgLayerE) {
    this.combiningStarted = true;
    var imgLayer = new Array();
    for (var i = 0, len = imgLayerA.length; i < len; i++) {
        imgLayer.push( imgLayerA[i] );
    }
    for (var i = 0, len = imgLayerE.length; i < len; i++) {
        imgLayer.push( imgLayerE[i] );
    }
	for (var i = 0, len = imgLayer.length; i < len; i++) {
		var hue = 0;
		var dpath;
		var imgLocal = imgLayer[i]; //Echomap_CCG_ImgObject'
		dpath = 'img/composite/' + imgLayer[i].filename();
		imgLocal.setDPath(dpath);
		hue = imgLocal.hue();
		var toneR = imgLocal.toneR();
		var toneG = imgLocal.toneG();
		var toneB = imgLocal.toneB();
		Echomap.Utils.log('combineImagesLayer', 'dpath', dpath, 4);

		var tLayer;
		tlayer = ImageManager.loadNormalBitmapEcho3b(imgLocal);//dpath, hue, toneR,toneG,toneB);
        if (tlayer.isError()) {
            this.composingImgX = false;
            throw new Error('Failed to load: ' + tlayer.url);
        }
        if (!tlayer.isReady()) {
            this.composingImgX = false;
            Echomap.Utils.log('combineImagesLayer', 'WARN: bitmap not ready! (WHY?)!!', tlayer.url);
            return; //done = false;
            //throw new Error('Failed to load: ' + tlayer.url);
        }
		if( toneR!=0 || toneG!=0 || toneB!=0 )
			tlayer.adjustTone(toneR,toneG,toneB);
		var w = tlayer.width;
		var h = tlayer.height;
        Echomap.Utils.log('combineImagesLayer', 'bitmap ready', tlayer.url);
		bmp.blt(tlayer, 0, 0, w, h, 0, 0);
        /*tLayer.addLoadListener(function () {
            //blt ( source , sx , sy , sw , sh , dx , dy , [dw=sw] , [dh=sh] )
            bmp.blt(tLayer, 0, 0, tLayer.width, tLayer.height, 0, 0);
        });*/
	}
    this.combiningLvlStarted = false;
};

Echomap_Processor.prototype.loadImagesLayer = function(bmp,imgLayer) {
	//Echomap.Utils.log('loadImagesLayer', 'Called');
	//Array imgLayer
	for (var i = 0, len = imgLayer.length; i < len; i++) {
		var hue = 0;
		var imageLocal = imgLayer[i];
		//var dpath = 'img/composite/' + imgLayer[i];
		var dpath = 'img/composite/' + imageLocal.filename();
		hue   = imageLocal.hue();
		imageLocal.setDPath(dpath);
		if(imageLocal) {
			Echomap.Utils.log('loadImagesLayer', 'dpath', dpath, 4 );
			//var tLayer = ImageManager.loadNormalBitmap(dpath, hue);
			var tLayer = ImageManager.loadNormalBitmapEcho3(imageLocal);
		}
		/*tLayer.addLoadListener(function () {
			//blt ( source , sx , sy , sw , sh , dx , dy , [dw=sw] , [dh=sh] )
			bmp.blt(tLayer, 0, 0, tLayer.width, tLayer.height, 0, 0);
		});
		*/
	}
	//Echomap.Utils.log('loadImagesLayer', 'Done');
};

//-----------------------------------------------------------------------------

//=============================================================================
// Echomap_LoaderCCG
// The object class for the Composite image processing.
//=============================================================================
function Echomap_LoaderCCG() {
    this.initialize.apply(this, arguments);
}

Echomap_LoaderCCG.prototype.initialize = function() {
	Echomap.Utils.log('Echomap_LoaderCCG', 'initialize' );
    if(Echomap.CCG.Echomap_Queue == undefined)
        Echomap.CCG.Echomap_Queue = new Echomap_Queue();
};

Echomap_LoaderCCG.prototype.processNotetagsToGame = function (gameActorsList) {
  Echomap.Utils.log('processNotetagsToGame', 'Called');
  for (var n = 1; n < gameActorsList.length; n++) {
	var gameActor = gameActorsList[n];
	var objId     = gameActor._actorId;
	var objName   = gameActor._name;

    var dataActor = Echomap.Utils.findDataActorForGameActor(objId);
    if(dataActor){
        this.processDataToGame(gameActor, dataActor);
    } else {
        Echomap.Utils.log('processNotetagsToGame','ERROR FAILED TO FIND ACTOR', objId);
    }
  }
  Echomap.Utils.log('processNotetagsToGame','Done');
};

Echomap_LoaderCCG.prototype.processDataToGame = function (gameActor, dataActor) {
	Echomap.Utils.log('processDataToGame', 'Called');
	//Echomap.Params.CCGData = {};
	var faPath  = Echomap.CCGUtil.getFacesPath();
	var tvPath  = Echomap.CCGUtil.getTVPath();
	var svPath  = Echomap.CCGUtil.getSVPath();

	var objId   = Echomap.Utils.getActorIdFromActor(gameActor);
	var objName = gameActor._name;
	Echomap.Utils.log('processDataToGame','objId',   objId);
	Echomap.Utils.log('processDataToGame','objName', objName);

    gameActor.isComposite = undefined;
    gameActor.composite = {};
    gameActor.composite.filename = {};
    gameActor.composite.filename.face = faPath + 'writenewcompimage_'+objId+'.png';
    gameActor.composite.filename.tv   = tvPath + 'writenewcompimage_'+objId+'.png';
    gameActor.composite.filename.sv   = svPath + 'writenewcompimage_'+objId+'.png';

	//yyy remove Echomap.CCG.filedataFA/TV/SV
    var composite = undefined;
    var notedata = dataActor.note.split(/[\r\n]+/);
    //var metaKey = 'CCGProfileFace'; //TODO pull out
    //var ometa   = dataActor.meta;
    //var ccgvarO = ometa[metaKey];
    //if(ccgvarO) {
    composite = this.processNoteData(gameActor,notedata);
    //}
	if(composite){
        gameActor.isComposite = true;
		//this.createCompositeImg( objId );
		//this.saveActorVariable(  objId);
	}

  Echomap.Utils.log('processDataToGame','Done');
};

Echomap_LoaderCCG.prototype.processNoteData = function(gameActor, notedata) {
	Echomap.Utils.log('processNoteData', 'Called' );
	//var objId   = gameActor._actorId;
    //var actorId = gameActor._actorId;

	var imgLayersFA  = Echomap.CCGUtil.getEmptyImgLayers();
	var imgLayersFAe = Echomap.CCGUtil.getEmptyImgLayers();//Echomap.CCG.layerequipFA[ actorId ] ;
	var imgLayersTV  = Echomap.CCGUtil.getEmptyImgLayers();
    var imgLayersTVe = Echomap.CCGUtil.getEmptyImgLayers();
	var imgLayersSV  = Echomap.CCGUtil.getEmptyImgLayers();
    var imgLayersSVe = Echomap.CCGUtil.getEmptyImgLayers();

	var foundTV = false, foundSV = false, foundMain = false;
    var foundFAEquip = false, foundTVEquip = false, foundSVEquip = false;

	var textMode = 'none';
    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      Echomap.Utils.log("processNoteData", "line", line);
      if (line.match(/<(?:CCGProfileFace)>/i)) {
        textMode = 'MAIN'
      } else if (line.match(/<\/(?:CCGProfileFace)>/i)) {
        textMode = 'NONE'
      } else if (line.match(/<(?:CCGEquipFace)>/i)) {
        textMode = 'EQUIPFA'
      } else if (line.match(/<\/(?:CCGEquipFace)>/i)) {
        textMode = 'NONE'
      } else if (line.match(/<(?:CCGProfileTV)>/i)) {
        textMode = 'TV'
      } else if (line.match(/<\/(?:CCGProfileTV)>/i)) {
        textMode = 'NONE'
      } else if (line.match(/<(?:CCGEquipTV)>/i)) {
        textMode = 'EQUIPTV'
      } else if (line.match(/<\/(?:CCGEquipTV)>/i)) {
        textMode = 'NONE'
      } else if (line.match(/<(?:CCGEquipSV)>/i)) {
        textMode = 'EQUIPSV'
      } else if (line.match(/<\/(?:CCGEquipSV)>/i)) {
        textMode = 'NONE'
      } else if (line.match(/<(?:CCGProfileSV)>/i)) {
        textMode = 'SV'
      } else if (line.match(/<\/(?:CCGProfileSV)>/i)) {
        textMode = 'NONE'
      } else if (textMode === 'SV') {
      	this.parseNoteLineToImgLayers(line, imgLayersSV, Echomap.CCGUtil.partytype.sv );
      	foundSV=true;
      } else if (textMode === 'TV') {
      	this.parseNoteLineToImgLayers(line, imgLayersTV, Echomap.CCGUtil.partytype.tv );
      	foundTV=true;
      } else if (textMode === 'MAIN') {
      	this.parseNoteLineToImgLayers(line, imgLayersFA, Echomap.CCGUtil.partytype.face );
      	foundMain=true;
      } else if (textMode === 'EQUIPFA') {
        this.parseNoteLineToImgLayers(line, imgLayersFAe,null);
        foundFAEquip=true;
      } else if (textMode === 'EQUIPTV') {
        this.parseNoteLineToImgLayers(line, imgLayersTVe,null);
        foundTVEquip=true;
      } else if (textMode === 'EQUIPSV') {
        this.parseNoteLineToImgLayers(line, imgLayersSVe,null);
        foundSVEquip=true;
      }
    }
    if(foundMain||foundFAEquip||foundTV||foundTVEquip||foundSV||foundSVEquip){
        if(!gameActor.composite.layerdata) {
            gameActor.composite.layerdata = {};
            gameActor.composite.layerdata.face = {};
            gameActor.composite.layerdata.tv   = {};
            gameActor.composite.layerdata.sv   = {};
        }
    }

    if(foundMain) {
        Echomap.Utils.log('processNoteData', 'foundMain' );
        gameActor.composite.layerdata.face.raw = imgLayersFA;
        Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.face);
    	//Echomap.CCG.layerdataFA [ actorId ] = imgLayers;
    }
    if(foundFAEquip) {
        Echomap.Utils.log('processNoteData', 'foundFAEquip' );
        gameActor.composite.layerdata.face.defequip = imgLayersFAe;
    	//Echomap.CCG.layerequipFA[ actorId ] = imgLayersE;
    }
	if(foundTV) {
        Echomap.Utils.log('processNoteData', 'foundTV' );
        gameActor.composite.layerdata.tv.raw = imgLayersTV;
        Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.tv);
		//Echomap.CCG.layerdataTV [ actorId ] = imgLayersTV;
    }
    if(foundTVEquip) {
        Echomap.Utils.log('processNoteData', 'foundTVEquip' );
        gameActor.composite.layerdata.tv.defequip = imgLayersTVe;
    }
	if(foundSV) {
        Echomap.Utils.log('processNoteData', 'foundSV' );
        gameActor.composite.layerdata.sv.raw = imgLayersSV;
        Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.sv);
		//Echomap.CCG.layerdataSV [ actorId ] = imgLayersSV;
    }
    if(foundSVEquip) {
        Echomap.Utils.log('processNoteData', 'foundSVEquip' );
        gameActor.composite.layerdata.sv.defequip = imgLayersSVe;
    }


	Echomap.Utils.log('processNoteData', 'Done' );
};

Echomap_LoaderCCG.prototype.parseNoteLineToImgLayers = function(line,imgLayers,parttype,ruledata) {
    var myRegexp1  = "^\\s*([a-zA-Z0-9-_./]+):\\s*([a-zA-Z0-9-_./]+)$" // face: folder/file
    var myRegexp2  = "^\\s*([0-9]+):\\s*([a-zA-Z0-9-_./]+),\\s*([a-zA-Z0-9-_]+)$"
    var myRegexp2b = "^\\s*([a-z0-9]+):\\s*([a-zA-Z0-9-_./]+),\\s*([a-zA-Z0-9-_]+)$"
	var myRegexp2c = "^\\s*([a-z0-9]+):\\s*([a-zA-Z0-9-_./]+)\\s+([0-9]+)$"  // face: folder/file hue
	var myRegexp2d = "^\\s*([a-z0-9]+):\\s*([a-zA-Z0-9-_./]+)\\s+([0-9]+)\\s+([0-9-]+)\\s+([0-9-]+)\\s+([0-9-]+)$"
	var myRegexp2e = "^\\s*([0-9]+):\\s*([a-zA-Z0-9-_./]+)\\s+([0-9]+)\\s+([0-9-]+)\\s+([0-9-]+)\\s+([0-9-]+)$"
    //var myRegexp3  = "^\\s*([a-z]+):\\s*([a-zA-Z0-9-_./]+),\\s*([a-zA-Z0-9-_]+)$"
    		      //"^([a-zA-Z0-9-_.]+),\\s*([a-zA-Z0-9]+)$";
    var match; //= line.match(myRegexp3);
    // console.log("match = " + match );
    var match1 = 0
	var match2 = "";
	var match3 = 0;
	var match4 = 0;
	var match5 = 0;
	var match6 = 0;

    if( match = line.match(myRegexp2) ) {
    	 match1 = match[1];
    	 match2 = match[2];
    	 match3 = match[3];
    	//console.log("match1 = " + match1 );
    	//console.log("match2 = " + match2 );
    	//console.log("match3 = " + match3 );
	} else if( match = line.match(myRegexp2e) ) {
		match1 = match[1];
		match2 = match[2];
		match3 = match[3];

		match4 = match[4];
		match5 = match[5];
		match6 = match[6];
	} else if( match = line.match(myRegexp2d) ) {
		var match1a = match[1];
		match1 = Echomap.CCGUtil.parseLayerNameToId(match1a,parttype);
		match2 = match[2];
		match3 = match[3];

		match4 = match[4];
		match5 = match[5];
		match6 = match[6];
	} else if( match = line.match(myRegexp2c) ) {
		var match1a = match[1]; // parseLayerNameToId
		match1 = Echomap.CCGUtil.parseLayerNameToId(match1a,parttype);
		match2 = match[2];
		match3 = match[3];
    } else if( match = line.match(myRegexp2b) ) {
		var match1a = match[1]; // parseLayerNameToId
		match1 = Echomap.CCGUtil.parseLayerNameToId(match1a,parttype);
		match2 = match[2];
		match3 = match[3];
    } else if( match = line.match(myRegexp1) ) {
    	match1 = match[1];
    	match2 = match[2];
		var match1a = Echomap.CCGUtil.parseLayerNameToId(match1,parttype);
		if(match1a && match1a>-1)
			match1 = match1a;
    	//console.log("match1 = " + match1 );
    	//console.log("match2 = " + match2 );
    }
    if(match && match1 && match1>0 && match1<imgLayers.length && match2.length >0 && match2) {
    	//Echomap.Utils.log('processNoteData match2: "',match2+'"');
		//TODO eval? ruleData?
		//var ruleResult = eval(ruledata);

		var imgobject = new Echomap_CCG_ImgObject();
		imgobject.setFilename(match2);
		imgobject.setHue(match3);
		imgobject.setToneR(match4);
		imgobject.setToneG(match5);
		imgobject.setToneB(match6);
		imgobject.setRuleData(ruledata);
    	imgLayers[match1].push( imgobject ); //match2);
		//match3
    }
}

Echomap_LoaderCCG.prototype.processActorEquipped = function (actor) {
	Echomap.Utils.log('processActorEquipped', 'Called' );
	var actorId = actor._actorId;
	Echomap.Utils.log('processActorEquipped', 'actorId', actorId);
    if(!actorId) {
        Echomap.Utils.log('processActorEquipped', 'ERROR with actorId');
        return;
    }
    if(!actor.composite.layerdata) {
        Echomap.Utils.log('processActorEquipped', 'ERROR with layerdata');
        return;
    }

	var oequips  = actor.equips;
	var slots    = actor.slots;
	if( typeof actor.equips == 'function')
		oequips  = actor.equips();

	var imgLayersEFACE = Echomap.CCGUtil.getEmptyImgLayers();
	var imgLayersETV   = Echomap.CCGUtil.getEmptyImgLayers();
	var imgLayersESV   = Echomap.CCGUtil.getEmptyImgLayers();

    actor.composite.layerdata.face.equip = imgLayersEFACE;
    actor.composite.layerdata.tv.equip   = imgLayersETV;
	actor.composite.layerdata.sv.equip   = imgLayersESV;

	if(oequips) {
	  	for (var ii = 0; ii < oequips.length; ii++) {
			//for (var i = oequips.length - 1; i >= 0; i--) {
			var eiid = oequips[ii]
			var eobj;
			if(eiid==null)
				continue;
			if(eiid && typeof eiid == 'object'){
				eobj = eiid;
			} else {
				var equipType = $dataSystem.equipTypes[ii + 1];
		      	if (equipType === $dataSystem.equipTypes[1] ||
				      (ii === 1 && typeof actor.isDualWield != 'undefined' && actor.isDualWield()) )
					eobj = $dataWeapons[eiid];
				else
					eobj = $dataArmors[eiid];
			}
			if(eobj) {
				var myRegexp2 = "\\s*([a-zA-Z0-9-_.\/: ]+),*"
				var faceLenX = "CCG_ITEM_FACEX".length;
				Echomap.Utils.log('processActorEquipped eiid: '+eiid+' eobj:"',eobj.name+'"');

				//Try to parse for specific rule ?
				for(var propt in eobj.meta) {
					this.processActorEquippedWithRules(actor, eobj, propt, "CCG_ITEM_FACEX", imgLayersEFACE, Echomap.CCGUtil.partytype.face );
					this.processActorEquippedWithRules(actor, eobj, propt, "CCG_ITEM_SV",    imgLayersESV,   Echomap.CCGUtil.partytype.sv   );
					this.processActorEquippedWithRules(actor, eobj, propt, "CCG_ITEM_TV",    imgLayersETV,   Echomap.CCGUtil.partytype.tv   );
				}

				var charItemFace  = eobj.meta.CCG_ITEM_FACE;
				if(charItemFace)
					charItemFace = charItemFace.trim();
                //var LoaderProc = new Echomap_LoaderCCG();
				if(charItemFace){
					var match  = charItemFace.match(myRegexp2);
					Echomap.Utils.log('processActorEquipped','match',match);
					var line;
					while (match != null) {
				    	line = match[1];
						this.parseNoteLineToImgLayers(line, imgLayersEFACE, Echomap.CCGUtil.partytype.face);
						charItemFace = charItemFace.replace( line, "" );
						match = charItemFace.match(myRegexp2);
					}
				}
				var charItemTV  = eobj.meta.CCG_ITEM_TV;
				if(charItemTV)
					charItemTV = charItemTV.trim();
				if(charItemTV){
					var match  = charItemTV.match(myRegexp2);
					Echomap.Utils.log('processActorEquipped','match',match);
					var line;
					while (match != null) {
				    	line = match[1];
						this.parseNoteLineToImgLayers(line, imgLayersETV, Echomap.CCGUtil.partytype.tv);
						charItemTV = charItemTV.replace( line, "" );
						match = charItemTV.match(myRegexp2);
					}
				}
				//<CCG_ITEM_SV:9: sv/SV_Cloak1_p02 0,11:sv/SV_Cloak1_p01 0>
				var charItemSV  = eobj.meta.CCG_ITEM_SV;
				if(charItemSV){
					var match  = charItemSV.match(myRegexp2);
					Echomap.Utils.log('processActorEquipped','match',match);
					var line;
					while (match != null) {
				    	line = match[1];
						this.parseNoteLineToImgLayers(line, imgLayersESV, Echomap.CCGUtil.partytype.sv);
						charItemSV = charItemSV.replace( line, "" );
						match = charItemSV.match(myRegexp2);
					}
				}
				/* Armors and stuff dont keep their notes!
				var notedataText = eobj.note;
				if(notedataText){
					var notedata = notedataText.split(/[\r\n]+/);
					this.processEquipNoteData(actorId,notedata)
				} */
			}
		}
	}
    actor.composite.layerdata.face.equip = imgLayersEFACE;
    actor.composite.layerdata.tv.equip   = imgLayersETV;
	actor.composite.layerdata.sv.equip   = imgLayersESV;
}
Echomap_LoaderCCG.prototype.processActorEquippedWithRules = function (actor, eobj, propt, metadataName, imgLayers, layerType) {
    //var objI = eobj.meta[propt];
	var myRegexp2 = "\\s*([a-zA-Z0-9-_.\/: ]+),*"
	var faceLenX = "CCG_ITEM_FACEX".length;

	var idx = propt.indexOf( metadataName );
	if( idx> -1 ) {
		Echomap.Utils.log('processActorEquipped','match', metadataName) ;
		var parseStr = propt.substring(faceLenX+1)
		var lastIdxUnder = parseStr.lastIndexOf("_");
		if( lastIdxUnder > -1 ) {
			//<CCG_ITEM_FACE_RULE_1: gender===M >
			var ruleId   = parseStr.substring(lastIdxUnder+1);
			var ruleName = metadataName+'_RULE_'+ruleId;
			var ruleData  = eobj.meta[ruleName];
			Echomap.Utils.log('processActorEquipped','ruleData',ruleData);
			//TODO User rule to make sure this tag/item description isnt used
			//		but by the proper actor or whatever?
			//parseNoteLineToImgLayers (added ruleData at end)
			var charItemFace = eobj.meta[propt];
			var match  = charItemFace.match(myRegexp2);
			Echomap.Utils.log('processActorEquipped','match',match);
			var line;
			while (match != null) {
		    	line = match[1];
				//eval? ruleData ? TODO
				var ruleResult = eval(ruleData); // true / false
				if(ruleResult)
					this.parseNoteLineToImgLayers(line, imgLayers, layerType, ruleData );
				else
					Echomap.Utils.log('processActorEquipped','not parsing per failed rule', ruleData, 0);
				charItemFace = charItemFace.replace( line, "" );
				match = charItemFace.match(myRegexp2);
			}
		}
	}
}


Echomap_LoaderCCG.prototype.addLayerToActor = function(actorId,layerName,fileName,layerType) {
	var layerId;
	if(layerType!=undefined){
		layerId = Echomap.CCGUtil.parseLayerNameToId(layerName,layerType);
	} else {
		layerId = layerName;
	}
    var gameActor = $gameActors.actor(actorId)
	Echomap.Utils.log('addLayerToActor', 'layerId', layerId );
	if(layerId && layerId > 0 && layerId < Echomap.CCGUtil.layerMax) {
		var imgLayers;
		if(layerType== Echomap.CCGUtil.partytype.face)
            imgLayers = gameActor.composite.layerdata.face.raw;
		else if(layerType== Echomap.CCGUtil.partytype.tv )
            imgLayers = gameActor.composite.layerdata.tv.raw;
		else if(layerType== Echomap.CCGUtil.partytype.sv )
			imgLayers = gameActor.composite.layerdata.sv.raw;
		if(imgLayers){
			//if(!fileName.endsWith(".png"))
			//	fileName+=".png"
			var imgLayer = imgLayers[layerId];
			//var index = imgLayer.indexOf(fileName);
			var index = Echomap.CCGUtil.findIndexOfImgObject(imgLayer,fileName);
			Echomap.Utils.log('addLayerToActor', 'index', index);
			if (index < 0 ) {
				this.parseNoteLineToImgLayers(layerId+":"+fileName,imgLayers,layerType);
				Echomap.Utils.log('addLayerToActor', 'added image to layer' );
			} else
				Echomap.Utils.log('addLayerToActor', 'Found object already there',0);
		} else
			Echomap.Utils.log('addLayerToActor', 'Error: No layers to add to',0);
	}
};

Echomap_LoaderCCG.prototype.remLayerFromActor = function(actorId,layerName,fileName,layerType) {
	var layerId;
	if(layerType!=undefined){
		layerId = Echomap.CCGUtil.parseLayerNameToId(layerName,layerType);
	} else {
		layerId = layerName;
	}
    var gameActor = $gameActors.actor(actorId)
	if(layerId && layerId>0 && layerId<Echomap.CCGUtil.layerMax) {
		Echomap.Utils.log('remLayerFromActor', 'layerId', layerId );
		var imgLayers;
		if(layerType== Echomap.CCGUtil.partytype.face)
            imgLayers = gameActor.composite.layerdata.face.raw;
        else if(layerType== Echomap.CCGUtil.partytype.tv )
            imgLayers = gameActor.composite.layerdata.tv.raw;
        else if(layerType== Echomap.CCGUtil.partytype.sv )
            imgLayers = gameActor.composite.layerdata.sv.raw;
		if(imgLayers){
			var imgLayer = imgLayers[layerId];
			var index;
			if(fileName) {
				if(!fileName.endsWith(".png"))
					fileName+=".png"
				//index = imgLayer.indexOf(fileName);
				index = Echomap.CCGUtil.findIndexOfImgObject(imgLayer,fileName);
				if (index > -1) {
					Echomap.Utils.log('remLayerFromActor', 'fileName', fileName );
				    imgLayer = imgLayer.splice(index, 1);
				}
			} else {
				imgLayers[layerId] = new Array();
				Echomap.Utils.log('remLayerFromActor', 'Clean entire layerId', layerId );
			}
		}
	}
};

Echomap_LoaderCCG.prototype.hasBackupLayers = function(actor,backupName){
	Echomap.Utils.log('hasBackupLayers', 'Called');
    Echomap.Utils.log('hasBackupLayers', 'backupName', backupName);
    var retVal  = true;
    if(!actor.composite)
        retVal  = false;
    if(retVal && !actor.composite.layerdata)
        retVal  = false;
    if(retVal && !actor.composite.layerdata.backup)
        retVal  = false;
    if(retVal && !actor.composite.layerdata.backup[backupName])
        retVal  = false;
    if(retVal && !actor.composite.layerdata.backup[backupName].face.raw)
        retVal  = false;
    Echomap.Utils.log('hasBackupLayers', 'retVal', retVal);
    return retVal;
}
Echomap_LoaderCCG.prototype.makeBackupLayers = function(actor,backupName){
	Echomap.Utils.log('makeBackupLayers', 'Called');
    if(!actor.composite.layerdata)
        return;
    Echomap.Utils.log('makeBackupLayers', 'start backupName',backupName);
    actor.composite.layerdata.backup = {};
    actor.composite.layerdata.backup[backupName] = {}
    actor.composite.layerdata.backup[backupName].face = {}
    actor.composite.layerdata.backup[backupName].tv   = {}
    actor.composite.layerdata.backup[backupName].sv   = {}
    actor.composite.layerdata.backup[backupName].face.raw   = actor.composite.layerdata.face.raw;
    actor.composite.layerdata.backup[backupName].face.equip = actor.composite.layerdata.face.equip;
    actor.composite.layerdata.backup[backupName].tv.raw     = actor.composite.layerdata.tv.raw;
    actor.composite.layerdata.backup[backupName].tv.equip   = actor.composite.layerdata.tv.equip;
    actor.composite.layerdata.backup[backupName].sv.raw     = actor.composite.layerdata.sv.raw;
    actor.composite.layerdata.backup[backupName].sv.equip   = actor.composite.layerdata.sv.equip;
    Echomap.Utils.log('makeBackupLayers', 'done  backupName',backupName);
}

Echomap_LoaderCCG.prototype.restoreBackupLayers = function(actor,backupName, backupCurrent,backupCurrentName){
	Echomap.Utils.log('restoreBackupLayers', 'Called');
    if(!actor.composite.layerdata)
        return;
    Echomap.Utils.log('restoreBackupLayers', 'start backupName',backupName);
    if(!actor.composite.layerdata || !actor.composite.layerdata.backup || !actor.composite.layerdata.backup[backupName])
        return false;
    if(backupCurrent)
        Echomap_ProcessCCG.prototype.makeBackupLayers(actor,backupCurrentName);

    actor.composite.layerdata.face.raw   = actor.composite.layerdata.backup[backupName].face.raw;
    actor.composite.layerdata.face.equip = actor.composite.layerdata.backup[backupName].face.equip;
    actor.composite.layerdata.tv.raw     = actor.composite.layerdata.backup[backupName].tv.raw;
    actor.composite.layerdata.tv.equip   = actor.composite.layerdata.backup[backupName].tv.equip;
    actor.composite.layerdata.sv.raw     = actor.composite.layerdata.backup[backupName].sv.raw;
    actor.composite.layerdata.sv.equip   = actor.composite.layerdata.backup[backupName].sv.equip;
    Echomap.Utils.log('restoreBackupLayers', 'done backupName',backupName);

    var actorId = Echomap.Utils.getActorIdFromActor(actor);
    this.setupNames(actorId,Echomap.CCGUtil.partytype.face);
    this.setupNames(actorId,Echomap.CCGUtil.partytype.tv);
    this.setupNames(actorId,Echomap.CCGUtil.partytype.sv);
    Echomap.Utils.log('restoreBackupLayers', 'Done');
}
Echomap_LoaderCCG.prototype.clearLayers = function(actor,backupName){
	Echomap.Utils.log('clearLayers', 'Called');
    if(!actor.composite)
        actor.composite = {};
    if(!actor.composite.layerdata)
            actor.composite.layerdata = {};
    actor.composite.layerdata.face = {};
    actor.composite.layerdata.tv   = {};
    actor.composite.layerdata.sv   = {};
    Echomap.Utils.log('clearLayers', 'Done');
}

//-----------------------------------------------------------------------------Echomap_LoaderCCG

//=============================================================================
// Echomap.ImgObject
// 	Data object to hold image data and all the properties/colors requested.
//=============================================================================
function Echomap_CCG_ImgObject() {
    this.initialize.apply(this, arguments);
}

Echomap_CCG_ImgObject.prototype = Object.create(Object.prototype);
Echomap_CCG_ImgObject.prototype.constructor = Echomap_CCG_ImgObject;

Echomap_CCG_ImgObject.prototype.initialize = function() {
	Echomap.Utils.log('Echomap_CCG_ImgObject', 'initialize' );
	_filename = undefined;
	_hue = 0;
};
Echomap_CCG_ImgObject.prototype.filename = function() {
	return this._filename;
}
Echomap_CCG_ImgObject.prototype.hue = function() {
	return this._hue || 0 ;
}
Echomap_CCG_ImgObject.prototype.toneR = function() {
	return this._toneR || 0 ;
}
Echomap_CCG_ImgObject.prototype.toneG = function() {
	return this._toneG || 0 ;
}
Echomap_CCG_ImgObject.prototype.toneB = function() {
	return this._toneB || 0 ;
}
Echomap_CCG_ImgObject.prototype.dpath = function() {
	return this._dpath || 0 ;
}
Echomap_CCG_ImgObject.prototype.ruleData = function() {
	return this._ruleData || "" ;
}
Echomap_CCG_ImgObject.prototype.setFilename = function(val) {
	if(!val.endsWith('.png'))
		this._filename = val + '.png';
	else
		this._filename = val;
}
Echomap_CCG_ImgObject.prototype.setHue = function(val) {
	this._hue  = val || 0 ;
}
Echomap_CCG_ImgObject.prototype.setToneR = function(val) {
	this._toneR  = val || 0 ;
}
Echomap_CCG_ImgObject.prototype.setToneG = function(val) {
	this._toneG  = val || 0 ;
}
Echomap_CCG_ImgObject.prototype.setToneB = function(val) {
	this._toneB  = val || 0 ;
}
Echomap_CCG_ImgObject.prototype.setDPath = function(val) {
	this._dpath  = val || 0 ;
}
Echomap_CCG_ImgObject.prototype.setRuleData = function(val) {
	this._ruleData  = val || 0 ;
}
//-----------------------------------------------------------------------------

//=============================================================================
// Echomap.CCGUtil
//=============================================================================
Echomap.CCGUtil = Echomap.CCGUtil || {};

//Echomap.CCGUtil.workingOnFace = false;
//Echomap.CCGUtil.workingOnTV   = false;
//Echomap.CCGUtil.workingOnSV   = false;

// TODO pull these out to Echomap.Parameters?
Echomap.CCGUtil.partytype = {};
Echomap.CCGUtil.partytype.face = 'faces';
Echomap.CCGUtil.partytype.tv   = 'characters';
Echomap.CCGUtil.partytype.sv   = 'sv_actors';

Echomap.CCGUtil.layerMax = 30;

Echomap.CCGUtil.getEmptyImgLayers = function() {
	var imgLayers = new Array();
	for (var i = Echomap.CCGUtil.layerMax; i >= 0; i--) {
		imgLayers[i] = new Array();
	}
	return imgLayers;
};
Echomap.CCGUtil.parseLayerNameToId = function(layerName,layertype) {
	var layerId = -1;
	if(layertype==Echomap.CCGUtil.partytype.face){
		switch(layerName){
			case 'background':	layerId = 0; break;
			case 'hairrear2': 	layerId = 1; break;
			case 'body': 		layerId = 2; break;
		 	case 'clothing0': 	layerId = 3; break;
			case 'face': 		layerId = 4; break;
			case 'clothing2': 	layerId = 5; break;
			case 'clothing': 	layerId = 6; break;
	 		case 'clothing1': 	layerId = 6; break;
	 		case 'cloak': 		layerId = 7; break;
		 	case 'facial':		layerId = 8; break;
	 		case 'eyebrows': 	layerId = 10; break;
	 		case 'eyes': 		layerId = 11; break;
	 		case 'nose': 		layerId = 12; break;
	 		case 'mouth': 		layerId = 13; break;
			case 'pupil': 		layerId = 14; break;
	 		case 'facial': 		layerId = 15; break;
            case 'beard': 	    layerId = 16; break;
	 		case 'glasses': 	layerId = 17; break;
	 		case 'hairrear1': 	layerId = 18; break;
            case 'ears': 		layerId = 19; break;
		 	case 'beastears': 	layerId = 20; break;
		 	case 'hairfront': 	layerId = 21; break;
		 	case 'hairfront2': 	layerId = 22; break;
		 	case 'accb': 		layerId = 23; break;
		 	case 'acca': 		layerId = 24; break;
			case 'foreground':	layerId = 30; break;
		 	case 'wings': 		layerId = -1; break; //notused in face
	 		case 'tail2': 		layerId = -1; break; //notused in face
		 	case 'tail1': 		layerId = -1; break; //notused in face
		 	case 'wings1': 	    layerId = -1; break; //notused in face
		 	default: layerId = -1;
		}
	} else if (layertype==Echomap.CCGUtil.partytype.tv){
		switch(layerName){
			case 'background':	layerId = 0; break;
		 	case 'wings': 		layerId = 1; break;
		 	case 'tail2': 		layerId = 2; break;
		 	case 'body0': 		layerId = 3; break;
			case 'body': 		layerId = 4; break;
			case 'body2': 		layerId = 5; break;
		 	case 'facial': 		layerId = 6; break;
            case 'beard': 	    layerId = 7; break;
		 	case 'glasses': 	layerId = 8; break;
		 	case 'cloak': 		layerId = 9; break;
			case 'clothing0': 	layerId = 10; break;
		 	case 'clothing': 	layerId = 11; break;
			case 'clothing2': 	layerId = 12; break;
		 	case 'hairrear1': 	layerId = 13; break;
			case 'hairrear2': 	layerId = 14; break;
			case 'hairfront': 	layerId = 15; break;
		 	case 'beastears': 	layerId = 16; break;
		 	case 'accb': 		layerId = 17; break;
		 	case 'acca': 		layerId = 18; break;
		 	case 'tail1': 		layerId = 19; break;
		 	case 'wings1':  	layerId = 20; break;
			case 'foreground':	layerId = 30; break;
		 	default: layerId = -1;
		}
	} else if (layertype==Echomap.CCGUtil.partytype.sv){
		switch(layerName){
			case 'background':	layerId = 0; break;
		 	case 'tail': 		layerId = 1; break;
			case 'wings':		layerId = 2; break;
		 	case 'body': 		layerId = 3; break;
		 	case 'facial':	 	layerId = 4; break;
			case 'clothing0': 	layerId = 5; break;
		 	case 'clothing': 	layerId = 6; break;
			case 'clothing2': 	layerId = 7; break;
			case 'cloak2': 		layerId = 8; break;
		 	case 'glasses': 	layerId = 9; break;
		 	case 'cloak1': 		layerId = 10; break;
		 	case 'hairrear': 	layerId = 11; break;
		 	case 'hairfront': 	layerId = 12; break;
		 	case 'beastears': 	layerId = 13; break;
		 	case 'acca': 		layerId = 14; break;
		 	case 'accb':	 	layerId = 15; break;
			case 'foreground':	layerId = 30; break;
		 	default: layerId = -1;
		}
	 }
    return layerId;
}

//TODO fix to handle addition of hue and color to name, or fix earlier?
Echomap.CCGUtil.findIndexOfImgObject = function(imgLayer,fileName) {
	//var index = imgLayer.indexOf(fileName);
	for (var i = 0; i < imgLayer.length; i++) {
		var imgObject = imgLayer[i]; //Echomap_CCG_ImgObject
		if(imgObject.filename()===fileName)
			return i;
	}
	return -1;
}

Echomap.CCGUtil.combineImagesLayer = function(bmp,imgLayer) {
	for (var i = 0, len = imgLayer.length; i < len; i++) {
		var hue = 0;
		var dpath;
		var imgLocal = imgLayer[i]; //Echomap_CCG_ImgObject'
		dpath = 'img/composite/' + imgLayer[i].filename();
		imgLocal.setDPath(dpath);
		hue = imgLocal.hue();
		var toneR = imgLocal.toneR();
		var toneG = imgLocal.toneG();
		var toneB = imgLocal.toneB();
		Echomap.Utils.log('combineImagesLayer', 'dpath', dpath, 4);

		var tLayer;
		tlayer = ImageManager.loadNormalBitmapEcho3(imgLocal);//dpath, hue, toneR,toneG,toneB);
		if( toneR!=0 || toneG!=0 || toneB!=0 )
			tlayer.adjustTone(toneR,toneG,toneB);
		var w = tlayer.width;
		var h = tlayer.height;
		bmp.blt(tlayer, 0, 0, w, h, 0, 0);
	}
};

Echomap.CCGUtil.getSVPath = function() {
	var fs = require('fs');
	//var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/img/composite/temp/');
	//var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/img/faces/');
	var path = window.location.pathname.replace(/^(.*)\/.*$/, "$1/img/"+Echomap.CCGUtil.partytype.sv+"/");
	if (path.match(/^\/([A-Z]\:)/)) {
		path = path.slice(1);
	}
	var dpath = decodeURIComponent(path);
	return dpath;
}

Echomap.CCGUtil.getTVPath = function() {
	var fs = require('fs');
	//var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/img/composite/temp/');
	//var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/img/faces/');
	var path = window.location.pathname.replace(/^(.*)\/.*$/, "$1/img/"+Echomap.CCGUtil.partytype.tv+"/");
	if (path.match(/^\/([A-Z]\:)/)) {
		path = path.slice(1);
	}
	var dpath = decodeURIComponent(path);
	return dpath;
}

Echomap.CCGUtil.getFacesPath = function() {
	var fs = require('fs');
	//var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/img/composite/temp/');
	//var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/img/faces/');
	var path = window.location.pathname.replace(/^(.*)\/.*$/, "$1/img/"+Echomap.CCGUtil.partytype.face+"/");
	if (path.match(/^\/([A-Z]\:)/)) {
		path = path.slice(1);
	}
	var dpath = decodeURIComponent(path);
	return dpath;
}
//-----------------------------------------------------------------------------


//=============================================================================
// Echomap_ProcessCCG
// The object class to call externally for the Composite image processing.
//=============================================================================
function Echomap_ProcessCCG() {
    this.initialize.apply(this, arguments);
}

Echomap_ProcessCCG.prototype = Object.create(Object.prototype);
Echomap_ProcessCCG.prototype.constructor = Echomap_ProcessCCG;

Echomap_ProcessCCG.prototype.initialize = function() {
	Echomap.Utils.log('Echomap_ProcessCCG', 'initialize' );
};
Echomap_ProcessCCG.actorEquippedChanged = function(gameActor) {
	Echomap.Utils.log('actorEquippedChanged', 'Called' );
    Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.face);
    Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.tv);
    Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.sv);
    Echomap.Utils.log('actorEquippedChanged', 'Done' );
};

Echomap_ProcessCCG.addLayerToActor  = function(actorId,layerName,fileName,layerType,procNow) {
    var loaderProc = new Echomap_LoaderCCG();
    loaderProc.addLayerToActor(actorId,layerName,fileName,layerType,procNow);
}
Echomap_ProcessCCG.remLayerFromActor = function(actorId,layerName,fileName,layerType,procNow) {
    var loaderProc = new Echomap_LoaderCCG();
    loaderProc.remLayerFromActor(actorId,layerName,fileName,layerType,procNow);
}
Echomap_ProcessCCG.hasBackupLayers = function(actor,backupName) {
    var loaderProc = new Echomap_LoaderCCG();
    loaderProc.hasBackupLayers(actor,backupName);
}
Echomap_ProcessCCG.makeBackupLayers = function(actor,backupName, backupCurrent,backupCurrentName) {
    var loaderProc = new Echomap_LoaderCCG();
    loaderProc.makeBackupLayers(actor,backupName, backupCurrent,backupCurrentName);
}
Echomap_ProcessCCG.restoreBackupLayers = function(actorId,layerName,fileName,layerType,procNow) {
    var loaderProc = new Echomap_LoaderCCG();
    loaderProc.restoreBackupLayers(actorId,layerName,fileName,layerType,procNow);
}
Echomap_ProcessCCG.clearLayers = function(actor,backupName){
    var loaderProc = new Echomap_LoaderCCG();
    loaderProc.clearLayers(actor,backupName);
}

Echomap_ProcessCCG.processImageChange = function(actorId,parttype) {
    Echomap.Utils.log('processImageChange','Called');
	var gameActor = $gameActors.actor(actorId);
    if( typeof actorId == 'object') {
        gameActor = actorId;
        actorId = gameActor._actorId;
    }

    if(this._parttype == Echomap.CCGUtil.partytype.face ){
        Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.face);
    } else
    if(this._parttype == Echomap.CCGUtil.partytype.tv ){
        Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.tv);
    } else
    if(this._parttype == Echomap.CCGUtil.partytype.sv ){
        Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.sv);
    } else {
        Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.face);
        Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.tv);
        Echomap.CCG.Echomap_Queue.queueImageCreateForActor(gameActor,Echomap.CCGUtil.partytype.sv);
    }
	Echomap.Utils.log('processImageChange','Done');
}

Echomap_ProcessCCG.changeFaceLayer = function(actorId,layerName,layerData,keepLayer,procNow) {
	Echomap.Utils.log('changeFaceLayer','Called');
	var actor   = $gameActors.actor(actorId)
	//var actorId = actor.actorId();
	//Test add layer
	if(!keepLayer)
		Echomap_ProcessCCG.remLayerFromActor(actorId, layerName, null, Echomap.CCGUtil.partytype.face,false);
	// Add
	Echomap_ProcessCCG.addLayerToActor(actorId, layerName, layerData, Echomap.CCGUtil.partytype.face,false);
	//
    if(procNow)
        Echomap_ProcessCCG.processImageChange(actor);
	Echomap.Utils.log('changeFaceLayer','Done');
};

Echomap_ProcessCCG.changeTVLayer = function(actorId,layerName,layerData,keepLayer,procNow) {
	Echomap.Utils.log('changeTVLayer','Called');
	var actor   = $gameActors.actor(actorId)
	//var actorId = actor.actorId();
	if(!keepLayer)
		Echomap_ProcessCCG.remLayerFromActor(actorId, layerName, null, Echomap.CCGUtil.partytype.tv,false);
	Echomap_ProcessCCG.addLayerToActor(actorId, layerName, layerData, Echomap.CCGUtil.partytype.tv,false);
	//
    if(procNow)
        Echomap_ProcessCCG.processImageChange(actor);
	Echomap.Utils.log('changeTVLayer','Done');
};

Echomap_ProcessCCG.changeSVLayer = function(actorId,layerName,layerData,keepLayer,procNow) {
	Echomap.Utils.log('changeSVLayer','Called');
	var actor   = $gameActors.actor(actorId)
	//var actorId = actor.actorId();
	if(!keepLayer)
		Echomap_ProcessCCG.remLayerFromActor(actorId, layerName, null, Echomap.CCGUtil.partytype.sv);
	Echomap_ProcessCCG.addLayerToActor(actorId, layerName, layerData, Echomap.CCGUtil.partytype.sv);
    //
    if(procNow)
        Echomap_ProcessCCG.processImageChange(actor);
	Echomap.Utils.log('changeSVLayer','Done');
};

//-----------------------------------------------------------------------------

//=============================================================================
// Game_Interpreter
//=============================================================================
Echomap.CCG.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Echomap.CCG.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'addLayerToActor') {
		var actor = $gameActors.actor(args[0]);
        //actorId,layerName,fileName,layerType
        Echomap_ProcessCCG.addLayerToActor(args[0],args[1],args[2],args[3]);
        /*TODO
		var process = new Echomap_ProcessCCG();
		process.addLayerToActor(args[0],args[1],args[2],args[3]);
		process.processImageChange(actor);
        */
	}
    //}
    if (command === 'remLayerFromActor') {
		//actorId,layerName,fileName,layerType
        Echomap_ProcessCCG.remLayerFromActor(args[0],args[1],args[2],args[3]);
        /*TODO
		Echomap.CCGUtil.remLayerFromActor(args[0],args[1],args[2],args[3]);
		var actor = $gameActors.actor(args[0]);
		var process = new Echomap_ProcessCCG();
		process.processImageChange(actor);
        */
    }
};
//-----------------------------------------------------------------------------

//=============================================================================
// Scene_Equip Overrides
//=============================================================================
// User selected to changed equipment of Actor
Echomap.CCG.Scene_Equip_onItemOk = Scene_Equip.prototype.onItemOk;
Scene_Equip.prototype.onItemOk = function() {
	Echomap.CCG.Scene_Equip_onItemOk.call(this);

	Echomap.Utils.log('Scene_Equip_onItemOk','!!!!!!!!!!!!!!!!!');
	//Echomap.Utils.log('Echomap._loaded_CCG', Echomap._loaded_CCG)
	//TODO, stop it from doing work so many times later or post create game and refresh?
	//var scene = SceneManager._scene;
	if( SceneManager._scene.constructor != Scene_Boot ){
	 	//SceneManager._scene.constructor != Scene_Title) {
		//Scene_Title
		var actor = this.actor();
        Echomap_ProcessCCG.processImageChange  (actor);
		//var process = new Echomap_ProcessCCG();
		////process.processActorEquipped(actor);
		//process.processImageChange  (actor);
	}
}
//-----------------------------------------------------------------------------

//=============================================================================
// Scene_Title and Scene_Boot Overrides
//=============================================================================
Echomap.CCG.Scene_Title_start = Scene_Title.prototype.start ;
Scene_Title.prototype.start  = function() {
    Echomap.CCG.Scene_Title_start.call(this);
    Echomap.Utils.log('Scene_Title:start','!!!!!!!!!!!!!!!!!');
    /*
    var gameActorsList = $gameActors._data;
    for (var n = 1; n < gameActorsList.length; n++) {
      var gameActor = gameActorsList[n];
      var objId     = gameActor._actorId;
      var objName   = gameActor._name;
      var eProc = new Echomap_Processor(undefined,gameActor,undefined);
      var imgLayersA = gameActor.composite.layerdata.sv.raw;
      var imgLayersE = gameActor.composite.layerdata.sv.equip;
      eProc.loadImagesLayer(undefined,imgLayersA);
      //eProc.preloadImages($gameActors._data);
    }
    */
}
var original_Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
      original_Scene_Boot_loadSystemImages.call(this);
     Echomap.Utils.log('Scene_Boot:loadSystemImages','!!!!!!!!!!!!!!!!!');
};
/* TODO
Scene_Title.prototype.waitTillReady  = function() {
	//if( Echomap.CCG.Waiters.length > 0 )
	Echomap.CCG.Scene_Title_start.call(this);
}
Scene_Boot.prototype.waitTillReady  = function() {
	if( Echomap.CCG.Waiters.length > 0 )
		setTimeout(this.waitTillReady, 100);
	else
		Echomap.CCG.Scene_Boot_start.call(this);
}
Echomap.CCG.Scene_Title_start = Scene_Title.prototype.start ;
Scene_Title.prototype.start  = function() {
	var group = $dataActors;
    for (var n = 1; n < group.length; n++) {
	  	var obj = group[n];
	  	var objId = obj.id;
	  	var objName = obj.name;
	  	var eProc = new Echomap_ProcessCCG();
	  	//unneeded per below calls it eProc.processActorEquipped(obj);
	  	//eProc.processCCGActorNotetags(obj);
		eProc.processImageChange(obj);
    }
	//this.waitTillReady();
	//var ms = 4000;
	//	ms += new Date().getTime();
	//	while (new Date() < ms){}
	Echomap.CCG.Scene_Title_start.call(this);
}
Echomap.CCG.Scene_Boot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
	var group = $dataActors;
    for (var n = 1; n < group.length; n++) {
	  	var obj = group[n];
	  	var objId = obj.id;
	  	var objName = obj.name;
	  	var eProc = new Echomap_ProcessCCG();
	  	//unneeded per below calls it eProc.processActorEquipped(obj);
	  	//eProc.processCCGActorNotetags(obj);
		eProc.processImageChange(obj);
    }
	//function pausecomp(ms) {
	//var ms = 2000;
	//	ms += new Date().getTime();
	//	while (new Date() < ms){}
	//}
	//this.waitTillReady();
	Echomap.CCG.Scene_Boot_start.call(this);
};
*/
//-----------------------------------------------------------------------------

//=============================================================================
// Game_Actor Overrides
//=============================================================================
Echomap.CCG.Game_Actor_clearEquipments = Game_Actor.prototype.clearEquipments;
Game_Actor.prototype.clearEquipments = function() {
    Echomap.CCG.Game_Actor_clearEquipments.call(this);
	var actor = this;
    Echomap_ProcessCCG.actorEquippedChanged(actor);
	//var process = new Echomap_ProcessCCG();
    //process.actorEquippedChanged(actor);
	//process.processActorEquipped(actor);
	//process.processImageChange  (actor);
};
Echomap.CCG.Game_Actor_optimizeEquipments = Game_Actor.prototype.optimizeEquipments;
Game_Actor.prototype.optimizeEquipments = function() {
    Echomap.CCG.Game_Actor_optimizeEquipments.call(this);
	var actor = this;
    Echomap_ProcessCCG.actorEquippedChanged(actor);
	//var process = new Echomap_ProcessCCG();
	//process.processActorEquipped(actor);
	//process.processImageChange  (actor);
};
//-----------------------------------------------------------------------------

//=============================================================================
// ImageManager Overrides
//=============================================================================
ImageManager.GetCacheEcho = function(key) {
    var fromCache = undefined;
    if(ImageManager._cache != undefined) {
        fromCache = this._cache[key];
	} else if(ImageManager._imageCache != undefined) {
		fromCache = this._imageCache.get(key)
    } else if(ImageManager.cache != undefined) {
        fromCache = this.cache.getItem(key);
    }
	// Pre Utils.RPGMAKER_VERSION = "1.5.0";
	//return ImageManager.cache._inner[key];
	// Utils.RPGMAKER_VERSION = "1.5.0";
	//return this._imageCache.get(key)
	return fromCache;
}
ImageManager.InCacheEcho = function(imageKey) {
	var fromCache = ImageManager.GetCacheEcho(imageKey);
    var inCache = false;
    if(fromCache != undefined) {
        inCache =  true;
    }
    return inCache;
}
ImageManager.SetCacheEcho = function(imageKey,imageItem) {
	if(ImageManager._cache != undefined) {
		// version ?
		ImageManager._cache[imageKey] = imageItem;
	} else if(ImageManager._imageCache != undefined) {
		// Utils.RPGMAKER_VERSION = "1.5.0";
		//var bitmap = 
		this._imageCache.add(imageKey, imageItem);
		return this._imageCache.get(imageKey)
	} else if(ImageManager.cache != undefined) {
		// Pre Utils.RPGMAKER_VERSION = "1.5.0";	
		ImageManager.cache.setItem(imageKey, imageItem);
		//var bitmap = ImageManager.cache._inner[imageKey].imageItem;
	}
}
ImageManager.ResetCacheEcho = function(key,imageItem) {
	if( ImageManager._cache != undefined ) {
		// version ?? 
		delete ImageManager._cache[key];
		ImageManager._cache[key ] = imageItem;
	} else if(ImageManager._imageCache != undefined) {
		// vers Utils.RPGMAKER_VERSION = "1.5.0";
		if( ImageManager._imageCache._items[key] != undefined )
			ImageManager._imageCache._items[key] = undefined;
		ImageManager._imageCache.add(key, imageItem);
	} else if( ImageManager.cache != undefined ) {
		// 1.3.1
		if( ImageManager.cache._inner[key] != undefined )
			ImageManager.cache._inner[key].free();
		ImageManager.cache.setItem(key, imageItem);
	} else {
	}
}

ImageManager.loadNormalBitmapEcho3 = function(imageLocal) {
	var path  = imageLocal.dpath();
	var hue   = imageLocal.hue();
	var toneR = imageLocal.toneR();
	var toneG = imageLocal.toneG();
	var toneB = imageLocal.toneB();
    var key = path + ':' + hue + ':' + toneR+ ':' +toneG+ ':' +toneB;
	var inCache = ImageManager.InCacheEcho(key);
	/*
    var inCache = false;
    if(ImageManager._cache != undefined) {
        inCache = this._cache[key];
    } else {
        inCache = this.cache.getItem(key);
    }
	*/
    if (!inCache || inCache == undefined) {
        var bitmap = Bitmap.load(path);
        bitmap.addLoadListener(function() {
            bitmap.rotateHue(hue);
        });
		ImageManager.SetCacheEcho(key,bitmap);
		/*
        if(ImageManager._cache != undefined) {
            this._cache[key] = bitmap;
        } else {
            this.cache.setItem(key, bitmap);
        }
		*/
    }
    var thisItem = undefined;
	thisItem = ImageManager.GetCacheEcho(key);
	/*
    if(ImageManager._cache != undefined) {
        thisItem = this._cache[key];
    } else {
        thisItem = this.cache.getItem(key);
    }
	*/
    return thisItem;
};
ImageManager.loadNormalBitmapEcho3b = function(imageLocal) {
	var path  = imageLocal.dpath();
	var hue   = imageLocal.hue();
	var toneR = imageLocal.toneR();
	var toneG = imageLocal.toneG();
	var toneB = imageLocal.toneB();
    var key = path + ':' + hue + ':' + toneR+ ':' +toneG+ ':' +toneB;
    /*
    var inCache = false;
    if(ImageManager._cache != undefined) {
        inCache = this._cache[key];
    } else {
        inCache = this.cache.getItem(key);
    }
    if (!inCache || inCache == undefined) {
        asdf
    }
    */
    var thisItem = undefined;
	thisItem = ImageManager.GetCacheEcho(key);
	/*
    if(ImageManager._cache != undefined) {
        thisItem = this._cache[key];
    } else {
        thisItem = this.cache.getItem(key);
    }
	*/
    return thisItem;
};
ImageManager.loadNormalBitmapEcho2 = function(path, hue, toneR,toneG,toneB) {
    var key = path + ':' + hue + ':' + toneR+ ':' +toneG+ ':' +toneB;
	var inCache = ImageManager.InCacheEcho(key);
	/*
    var inCache = false;
    if(ImageManager._cache != undefined) {
        inCache = this._cache[key];
    } else {
        inCache = this.cache.getItem(key);
    }
	*/
    if (!inCache || inCache == undefined) {
        var bitmap = Bitmap.load(path);
        bitmap.addLoadListener(function() {
            bitmap.rotateHue(hue);
        });
		thisItem = ImageManager.SetCacheEcho(key,bitmap);
		/*
        if(ImageManager._cache != undefined) {
            this._cache[key] = bitmap;
        } else {
            this.cache.setItem(key, bitmap);
        }
		*/
    }
    var thisItem = undefined;
	thisItem = ImageManager.GetCacheEcho(key);
	/*
    if(ImageManager._cache != undefined) {
        thisItem = this._cache[key];
    } else {
        thisItem = this.cache.getItem(key);
    }
	*/
    return thisItem;//this._cache[key];
};
//-----------------------------------------------------------------------------

//=============================================================================
// End of File
//=============================================================================
//};
//})();
