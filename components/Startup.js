/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const kCID  = Components.ID('220a8644-d750-4c79-95ac-a6362764bdca');
const kID   = '@clear-code.com/disableupdate/startup;1';
const kNAME = 'DisableUpdateStartupService';

const Cc = Components.classes;
const Ci = Components.interfaces;
Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

const ObserverService = Cc['@mozilla.org/observer-service;1']
		.getService(Ci.nsIObserverService);

const SSS = Cc['@mozilla.org/content/style-sheet-service;1']
		.getService(Ci.nsIStyleSheetService);

const IOService = Cc['@mozilla.org/network/io-service;1']
		.getService(Ci.nsIIOService);

function DisableUpdateStartupService() {
}
DisableUpdateStartupService.prototype = {
	classID          : kCID,
	contractID       : kID,
	classDescription : kNAME,

	observe : function(aSubject, aTopic, aData)
	{
		switch (aTopic)
		{
			case 'app-startup':
			case 'profile-after-change':
				ObserverService.addObserver(this, 'final-ui-startup', false);
				return;

			case 'final-ui-startup':
				ObserverService.removeObserver(this, 'final-ui-startup');
				this.init();
				return;
		}
	},

	init : function()
	{
		this.registerGlobalStyleSheet();
	},

	registerGlobalStyleSheet : function()
	{
		var sheet = IOService.newURI('chrome://disableupdate/content/global.css', null, null);
		if (!SSS.sheetRegistered(sheet, SSS.USER_SHEET)) {
			SSS.loadAndRegisterSheet(sheet, SSS.USER_SHEET);
		}
	},


	QueryInterface : function(aIID)
	{
		if(!aIID.equals(Ci.nsIObserver) &&
			!aIID.equals(Ci.nsISupports)) {
			throw Components.results.NS_ERROR_NO_INTERFACE;
		}
		return this;
	}

};

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([DisableUpdateStartupService]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([DisableUpdateStartupService]);
