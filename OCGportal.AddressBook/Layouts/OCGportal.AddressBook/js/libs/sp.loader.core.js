
define(function () {
    'use strict';

    var areScriptsLoaded = false,
        readyCalls = [];

    function runCallbacks(callbacks) {
        var i;
        for (i = 0; i < callbacks.length; i += 1) {
            callbacks[i]();
        }
    }

    function callReady() {
        var callbacks = readyCalls;

        if (areScriptsLoaded) {
            //Call the DOM ready callbacks
            if (callbacks.length) {
                readyCalls = [];
                runCallbacks(callbacks);
            }
        }
    }

    /**
     * Sets the page as loaded.
     */
    function scriptsLoaded() {
        if (!areScriptsLoaded) {
            areScriptsLoaded = true;

            callReady();
        }
    }

    if (LoadSodByKey('clientpeoplepicker.js', null) == Sods.missing) {
        RegisterSod('clientpeoplepicker.js', '/_layouts/15/clientpeoplepicker.debug.js');
    }
    if (LoadSodByKey('clientforms.js', null) == Sods.missing) {
        RegisterSod('clientforms.js', '/_layouts/15/clientforms.debug.js');
    }
    if (LoadSodByKey('clienttemplates.js', null) == Sods.missing) {
        RegisterSod('clienttemplates.js', '/_layouts/15/clienttemplates.debug.js');
    }
    if (LoadSodByKey('autofill.js', null) == Sods.missing) {
        RegisterSod('autofill.js', '/_layouts/15/autofill.debug.js');
    }
    if (LoadSodByKey('sp.documentmanagement.js', null) == Sods.missing) {
        RegisterSod('sp.documentmanagement.js', '/_layouts/15/sp.documentmanagement.debug.js');
    }
    SP.SOD.loadMultiple(['sp.js', 'sp.runtime.js', 'sp.core.js', 'clienttemplates.js', 'clientpeoplepicker.js', 'clientforms.js', 'autofill.js', 'sp.documentmanagement.js'], function () {

        console.log("SP Scripts loaded");
        scriptsLoaded();
    });


    /** START OF PUBLIC API **/

    /**
     * Registers a callback for DOM ready. If DOM is already ready, the
     * callback is called immediately.
     * @param {Function} callback
     */
    function spScriptsReady(callback) {
        if (areScriptsLoaded) {
            callback();
        } else {

            readyCalls.push(callback);
        }
        return spScriptsReady;
    }

    spScriptsReady.version = '1.0.0';

    /**
     * Loader Plugin API method
     */
    spScriptsReady.load = function (name, req, onLoad, config) {
        if (config.isBuild) {
            onLoad(null);
        } else {
            spScriptsReady(onLoad);
        }
    };

    /** END OF PUBLIC API **/

    return spScriptsReady;
});
