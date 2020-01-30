
define(['knockout'], function (ko) {

    ko.bindingHandlers.readonly = {
        update: function (element, valueAccessor) {

            var value = ko.utils.unwrapObservable(valueAccessor());
            if (value) {
                $(element).attr("readonly", "readonly");
                //$(element).addClass("disabled");
            } else {
                $(element).removeAttr("readonly");
                //  $(element).removeClass("disabled");
            }
        }
    };

    ko.bindingHandlers.datepicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            //var options = allBindingsAccessor().datepickerOptions || {};
            //$(element).datepicker(options);
            
            $(document).ready(function () {
                $(element).datepicker({
                    dateFormat: 'dd/mm/yy',
                    changeMonth: true,
                    changeYear: true,
                    yearRange: "-90:+5",
                });
            });
            
            //handle the field changing
            ko.utils.registerEventHandler(element, "change", function () {
                var observable = valueAccessor();
                observable($(element).datepicker("getDate"));
            });

            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).datepicker("destroy");
            });
        },
        //update the control when the view model changes
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
                current = $(element).datepicker("getDate");

            if (value - current !== 0) {
                $(element).datepicker("setDate", value);
            }
        }
    };

    ko.bindingHandlers.readSelectedText = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();

            $(element).change(function () {
                value($("option:selected", this).text());
            });
        },
        update: function (element, valueAccessor) {
        }
    };

    ko.bindingHandlers.clientPeoplePicker = {
        currentId: 0,
        init: function (element, valueAccessor, allBindings) {
            var unwrapped = ko.utils.unwrapObservable(valueAccessor());
            var options = {};
            if (unwrapped.hasOwnProperty('options'))
                options = unwrapped.options;
            var obs = unwrapped.data;
            var currentId = ko.bindingHandlers.clientPeoplePicker.currentId++;
            var currentElemId = "";
            if (element.id)
                currentElemId = element.id;
            else {
                currentElemId = "ClientPeoplePicker" + currentId;
                element.setAttribute("id", currentElemId);
            }

            obs._peoplePickerId = currentElemId + "_TopSpan";
            ko.bindingHandlers.clientPeoplePicker.initPeoplePicker(currentElemId, options).done(function (picker) {
                if (options.Disabled) {
                    picker.SetEnabledState(false);
                }
                picker.OnValueChangedClientScript = function (elementId, userInfo) {
                    var temp = new Array();
                    for (var x = 0; x < userInfo.length; x++) {
                        temp[temp.length] = userInfo[x].Key;
                    }
                    obs(temp);
                    if (options.Disabled) {
                        $("#" + currentElemId).find(".sp-peoplepicker-delImage").hide();
                    }
                };
            });
        },
        update: function (element, valueAccessor, allBindings) {
            var obs = ko.utils.unwrapObservable(valueAccessor()).data;
            if (!ko.isObservable(obs)) {
                throw "clientPeoplePicker binding requires an observable array";
            }
            if (typeof SPClientPeoplePicker === 'undefined')
                return;

            var peoplePicker =
                SPClientPeoplePicker.SPClientPeoplePickerDict[obs._peoplePickerId];
            if (peoplePicker) {
                var keys = peoplePicker.GetAllUserKeys();
                keys = keys.length > 0 ? keys.split(";") : [];
                var updateKeys = obs() && obs().length ? obs() : [];
                var newKeys = new Array();
                for (var x = 0; x < updateKeys.length; x++) {
                    for (var y = 0; y < keys.length && updateKeys[x] != keys[y]; y++) { }
                    if (y >= keys.length) {
                        newKeys[newKeys.length] = updateKeys[x];
                    }
                }

                if (newKeys.length > 0) {
                    //removes all resolved users - added by mf
                    var usersobject = peoplePicker.GetAllUserInfo();
                    usersobject.forEach(function (index) {
                        peoplePicker.DeleteProcessedUser(usersobject[index]);
                    });

                    peoplePicker.AddUserKeys(newKeys.join(";"));
                }
            }
        },
        initPeoplePicker: function (elementId, options) {
            var dfd = $.Deferred();

            // Merge options with default options
            var schema = {};
            schema['PrincipalAccountType'] = options.hasOwnProperty("PrincipalAccountType") ? options.PrincipalAccountType : 'User';
            schema['SearchPrincipalSource'] = options.hasOwnProperty("SearchPrincipalSource") ? options.SearchPrincipalSource : 15;
            schema['ResolvePrincipalSource'] = options.hasOwnProperty("ResolvePrincipalSource") ? options.ResolvePrincipalSource : 15;
            schema['AllowMultipleValues'] = options.hasOwnProperty("AllowMultipleValues") ? options.AllowMultipleValues : true;
            schema['MaximumEntitySuggestions'] = options.hasOwnProperty("MaximumEntitySuggestions") ? options.MaximumEntitySuggestions : 20;
            schema['Width'] = options.hasOwnProperty("Width") ? options.Width : 'auto';
            //schema['Width'] = options.hasOwnProperty("Width") ? options.Width : '240px';
            //schema['Height'] = '21px';

            // Render and initialize the picker. 
            // Pass the ID of the DOM element that contains the picker, an array of initial
            // PickerEntity objects to set the picker value, and a schema that defines
            // picker properties.
            SPClientPeoplePicker_InitStandaloneControlWrapper(elementId, null, schema);

            dfd.resolve(SPClientPeoplePicker.SPClientPeoplePickerDict[elementId + "_TopSpan"]);
            return dfd.promise();
        }
    };


});