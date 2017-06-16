//=============================================================================
// Echomap Composite Character Generator Plugin
// ECH_CCG_Test.js
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v20160815.1 desc incoming
 * @author Echomap Plugins
 *
 * @param ---General---
 * @default
 *
 *
 * @help
*/

//=============================================================================
// Start
//=============================================================================

var Imported = Imported || {};
Imported.Echomap_CCG_Test = true;
Imported['ECH - CCG_Test'] = '20160815.1';

if (Imported["ECH - Utils"] === undefined) {
  throw new Error("Please add ECH_Utils before ECH_CCG!");
}
if (Imported["ECH - CCG"] === undefined) {
  throw new Error("Please add ECH_CCG before ECH_CCG_TEST!");
}

var Echomap = Echomap || {};
Echomap.CCG_Test = Echomap.CCG_Test || {};


var efs = Imported.Echomap_CCG;
if(efs != undefined && efs){
	 console.log('Echomap.CCG_Test IS loaded');
     Echomap.Utils.sayHello("ECH_CCG_Test",Imported['ECH - CCG_Test']);
} else {
	console.log('Echomap.CCG_Test NOT loaded');
}

//=============================================================================
// Tests
//=============================================================================
Echomap.CCGUtil.doTests = function (objId) {
	Echomap.Utils.log('doTests','Called');
	var actor = $gameActors.actor(objId)
	var actorId = actor.actorId();

	//Test add layer
	//Echomap.CCGUtil.addLayerToActor = function(actorId,layerName,fileName,layerType) {
	// Clear Ears
    Echomap_ProcessCCG.remLayerFromActor(actorId,'beastears','face/FG_BeastEars_p01_c1_m006', Echomap.CCGUtil.partytype.face);
	Echomap_ProcessCCG.remLayerFromActor(actorId,'beastears',null, Echomap.CCGUtil.partytype.tv);
	Echomap_ProcessCCG.remLayerFromActor(actorId,'beastears',null, Echomap.CCGUtil.partytype.sv);

	// Add Ears
	Echomap_ProcessCCG.addLayerToActor(actorId,'beastears','face/FG_BeastEars_p01_c1_m006', Echomap.CCGUtil.partytype.face);
	Echomap_ProcessCCG.addLayerToActor(actorId,'beastears','tv/TV_BeastEars_p01',           Echomap.CCGUtil.partytype.tv);
	Echomap_ProcessCCG.addLayerToActor(actorId,'beastears','sv/SV_BeastEars_p01',           Echomap.CCGUtil.partytype.sv);

    Echomap_ProcessCCG.processImageChange(actor);

	Echomap.Utils.log('doTests','Done');
};

Echomap.CCGUtil.doTests2 = function (objId) {
	Echomap.Utils.log('doTests2','Called');
	var actor = $gameActors.actor(objId)
	var actorId = actor.actorId();

	//Test removee layer
	//Echomap.CCGUtil.remLayerFromActor(actorId,'beastears','face/FG_BeastEars_p01_c1_m006', Echomap.CCGUtil.partytype.face);
	Echomap_ProcessCCG.remLayerFromActor(actorId,'beastears','face/FG_BeastEars_p01_c1_m006', Echomap.CCGUtil.partytype.face);
	Echomap_ProcessCCG.remLayerFromActor(actorId,'beastears',null, Echomap.CCGUtil.partytype.tv);
	Echomap_ProcessCCG.remLayerFromActor(actorId,'beastears',null, Echomap.CCGUtil.partytype.sv);

    Echomap_ProcessCCG.processImageChange(actor);

	Echomap.Utils.log('doTests2','Done');
};

Echomap.CCGUtil.doTests3 = function () {
	Echomap.Utils.log('doTests3','Called');
	var battlesubject = BattleManager._subject;
	Echomap.Utils.log('doTests3','battlesubject',battlesubject||"null");
	var battletarget = BattleManager._target;
	Echomap.Utils.log('doTests3','battletarget',battletarget||"null");
	if(battlesubject){
		Echomap.CCGUtil.doTests2(battlesubject._actorId);
	}
	Echomap.Utils.log('doTests3','Done');
}

//=============================================================================
// Echomap.CCGUtil
//=============================================================================

Echomap.CCGUtil = Echomap.CCGUtil || {};

//=============================================================================
// Test Hair Layer Hue and Tone R/G/B
//=============================================================================

Echomap.CCGUtil.testHairColorHue = function(actorId,hueCol,hueVal) {
	Echomap.Utils.log('testHairColorHue','actorId', actorId);
	Echomap.Utils.log('testHairColorHue','hueCol' , hueCol );
	Echomap.Utils.log('testHairColorHue','hueVal' , hueVal );

    Echomap.CCGUtil.testHairColorHueTV(actorId,hueCol,hueVal);
    Echomap.CCGUtil.testHairColorHueSV(actorId,hueCol,hueVal);
    Echomap.CCGUtil.testHairColorHueFA(actorId,hueCol,hueVal);

	var actor = $gameActors.actor( actorId )
    Echomap_ProcessCCG.processImageChange(actorId);
	Echomap.Utils.log('testHairColorHue','Done');
}
Echomap.CCGUtil.testHairColorHueTV = function(actorId,hueCol,hueVal) {
    var gameActor = $gameActors.actor(actorId)
	var imgLayers = gameActor.composite.layerdata.tv.raw;

	var hr1 = Echomap.CCGUtil.parseLayerNameToId ('hairrear1',Echomap.CCGUtil.partytype.tv);
	var hr2 = Echomap.CCGUtil.parseLayerNameToId ('hairrear2',Echomap.CCGUtil.partytype.tv);
	var hf1 = Echomap.CCGUtil.parseLayerNameToId ('hairfront',Echomap.CCGUtil.partytype.tv);

	// imgobject is a Echomap_CCG_ImgObject
    var imgobject = undefined;
    if(hr1>=1) {
	   imgobject = imgLayers[hr1];
    	if(imgobject != undefined) {
    		for (var i = 0; i < imgobject.length; i++) {
    			var imgobject2 = Echomap.CCGUtil.testColorHue2(imgobject[i],hueCol,hueVal);
    			imgobject[i] = imgobject2;
    		}
    		imgLayers[hr1] = imgobject;
    	}
    }
    if(hr2>=1) {
    	imgobject = imgLayers[hr2];
    	if(imgobject != undefined) {
    		for (var i = 0; i < imgobject.length; i++) {
    			var imgobject2 = Echomap.CCGUtil.testColorHue2(imgobject[i],hueCol,hueVal);
            }
    		imgLayers[hr2] = imgobject;
    	}
    }
    if(hf1>=1) {
    	imgobject = imgLayers[hf1];
    	if(imgobject != undefined) {
    		for (var i = 0; i < imgobject.length; i++) {
    			var imgobject2 = Echomap.CCGUtil.testColorHue2(imgobject[i],hueCol,hueVal);
                imgobject[i] = imgobject2;
    		}
    		imgLayers[hf1] = imgobject;
        }
    }
	//gameActor.composite.layerdata.tv.raw = imgLayersTV;
	//Echomap.CCG.layerdataTV[ actorId ] = imgLayers;
}
Echomap.CCGUtil.testHairColorHueSV = function(actorId,hueCol,hueVal) {
    var gameActor = $gameActors.actor(actorId)
	var imgLayers = gameActor.composite.layerdata.sv.raw;


	var hr1 = Echomap.CCGUtil.parseLayerNameToId ('hairrear', Echomap.CCGUtil.partytype.sv);
	var hf1 = Echomap.CCGUtil.parseLayerNameToId ('hairfront',Echomap.CCGUtil.partytype.sv);

	// imgobject is a Echomap_CCG_ImgObject
    var imgobject = undefined;
    if(hr1>=1) {
    	var imgobject = imgLayers[hr1];
    	if(imgobject != undefined) {
    		for (var i = 0; i < imgobject.length; i++) {
    			var imgobject2 = Echomap.CCGUtil.testColorHue2(imgobject[i],hueCol,hueVal);
    			imgobject[i] = imgobject2;
    		}
    		imgLayers[hr1] = imgobject;
    	}
    }
    if(hf1>=1) {
    	imgobject = imgLayers[hf1];
    	if(imgobject != undefined) {
    		for (var i = 0; i < imgobject.length; i++) {
    			var imgobject2 = Echomap.CCGUtil.testColorHue2(imgobject[i],hueCol,hueVal);
                imgobject[i] = imgobject2;
    		}
    		imgLayers[hf1] = imgobject;
    	}
    }
	//Echomap.CCG.layerdataSV[ actorId ] = imgLayers;
	//gameActor.composite.layerdata.tv.raw = imgLayers;
}
Echomap.CCGUtil.testHairColorHueFA = function(actorId,hueCol,hueVal) {
    var gameActor = $gameActors.actor(actorId)
	var imgLayers = gameActor.composite.layerdata.face.raw;

	var hr1 = Echomap.CCGUtil.parseLayerNameToId ('hairrear1', Echomap.CCGUtil.partytype.face);
    var hr2 = Echomap.CCGUtil.parseLayerNameToId ('hairrear2', Echomap.CCGUtil.partytype.face);
	var hf1 = Echomap.CCGUtil.parseLayerNameToId ('hairfront',Echomap.CCGUtil.partytype.face);
	var hf2 = Echomap.CCGUtil.parseLayerNameToId ('hairfront2',Echomap.CCGUtil.partytype.face);

	// imgobject is a Echomap_CCG_ImgObject
    var imgobject = undefined;
    if(hr1>=1) {
        imgobject = imgLayers[hr1];
    	if(imgobject != undefined) {
    		for (var i = 0; i < imgobject.length; i++) {
    			var imgobject2 = Echomap.CCGUtil.testColorHue2(imgobject[i],hueCol,hueVal);
    			imgobject[i] = imgobject2;
    		}
    		imgLayers[hr1] = imgobject;
    	}
    }
    if(hr2>=1) {
        imgobject = imgLayers[hr2];
    	if(imgobject != undefined) {
    		for (var i = 0; i < imgobject.length; i++) {
    			var imgobject2 = Echomap.CCGUtil.testColorHue2(imgobject[i],hueCol,hueVal);
    			imgobject[i] = imgobject2;
    		}
    		imgLayers[hr2] = imgobject;
    	}
    }
    if(hf1>=1) {
        imgobject = imgLayers[hf1];
    	if(imgobject != undefined) {
    		for (var i = 0; i < imgobject.length; i++) {
    			var imgobject2 = Echomap.CCGUtil.testColorHue2(imgobject[i],hueCol,hueVal);
    			imgobject[i] = imgobject2;
    		}
            imgLayers[hf1] = imgobject;
    	}
    }
    if(hf2>=1) {
        imgobject = imgLayers[hf2];
    	if(imgobject != undefined) {
    		for (var i = 0; i < imgobject.length; i++) {
    			var imgobject2 = Echomap.CCGUtil.testColorHue2(imgobject[i],hueCol,hueVal);
    			imgobject[i] = imgobject2;
    		}
            imgLayers[hf2] = imgobject;
    	}
    }
	//Echomap.CCG.layerdataFA[ actorId ] = imgLayers;
    //gameActor.composite.layerdata.face.raw = imgLayers;
}
Echomap.CCGUtil.testColorHue2 = function(imgobject,hueCol,hueVal) {
	Echomap.Utils.log('testColorHue2','imgobject',imgobject);
	Echomap.Utils.log('testColorHue2','hueCol' , hueCol );
	Echomap.Utils.log('testColorHue2','hueVal' , hueVal );
	var newHue = undefined;
	if( hueCol==undefined || hueCol == 0 ) {
		newHue = imgobject._hue;
		newHue = parseInt(newHue) + hueVal;
		imgobject.setHue(newHue);
		Echomap.Utils.log('testColorHue2','setHue_',newHue);
	} else if( hueCol==1) {
		newHue = imgobject._toneR
		newHue = parseInt(newHue) + hueVal;
		imgobject.setToneR(newHue);
		Echomap.Utils.log('testColorHue2','setToneR',newHue);
	} else if( hueCol==2) {
		newHue = imgobject._toneG;
		newHue = parseInt(newHue) + hueVal;
		imgobject.setToneG(newHue);
		Echomap.Utils.log('testColorHue2','setToneG',newHue);
	} else if( hueCol==3) {
		newHue = imgobject._toneB;
		newHue = parseInt(newHue) + hueVal;
		imgobject.setToneB(newHue);
		Echomap.Utils.log('testColorHue2','setToneB',newHue);
	}
	return imgobject;
}

//=============================================================================
// End of File
//=============================================================================
//};
//})();
