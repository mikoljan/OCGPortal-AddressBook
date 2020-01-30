require(["jquery", "knockout", "bootstrap", "spscripts!", "helpers", "validator","camljs", "jqueryui", "kobindings"], function ($, ko) {

    userEditFormViewModel = function () {
        var self = this;

        // ---------------------------------Variables---------------------------------

        // Text fields
        self.fullName = ko.observable();
        self.name = ko.observable();
        self.surname = ko.observable();
        self.employeeNo = ko.observable();
        self.building = ko.observable();
        self.phone = ko.observable();
        self.mobilePhone = ko.observable();
        self.line = ko.observable();
        self.otherPhone = ko.observable();
        self.LDAPname = ko.observable();

        self.other = ko.observable();
        self.SSFid = ko.observable();

        // Date fields
        self.birthDate = ko.observable();
        self.startDate = ko.observable();
        self.endDate = ko.observable();

        // Choice fields
        self.status = ko.observable();
        self.availableStatus = ko.observableArray(["Please select a value..."]);

        self.salutation = ko.observable();
        self.availableSalutation = ko.observableArray(["Please select a value..."]);

        self.degree = ko.observableArray();
        self.availableDegree = ko.observableArray();

        self.jobTitleCategory = ko.observable();
        self.availableJobTitleCategory = ko.observableArray(["Please select a value..."]);

        self.floor = ko.observable();
        self.availableFloor = ko.observableArray(["Please select a value..."]);

        // LookUp fields
        self.company = ko.observable();
        self.companyText = ko.observable();
        self.availableCompany = ko.observableArray([{
            id: 0,
            title: "Please select a value..."
        }]);

        self.division = ko.observable();
        self.divisionText = ko.observable();
        self.availableDivision = ko.observableArray([{
            id: 0,
            title: "Please select a value..."
        }]);

        self.costCenter = ko.observable();
        self.costCenterText = ko.observable();
        self.availableCostCenter = ko.observableArray([{
            id: 0,
            title: "Please select a value..."
        }]);

        self.superior = ko.observable();
        self.superiorText = ko.observable();
        self.availableSuperior = ko.observableArray([{
            id: 0,
            title: "Please select a value..."
        }]);

        self.jobTitle = ko.observable();
        self.jobTitleText = ko.observable();
        self.availableJobTitle = ko.observableArray([{
            id: 0,
            title: "Please select a value..."
        }]);

        self.location = ko.observable();
        self.availableLocation = ko.observableArray([{
            id: 0,
            title: "Please select a value..."
        }]);

        // CheckBox fields
        self.displayBirthday = ko.observable(false);
        self.annualDialog = ko.observable(false);


        // PeoplePicker fields
        self.networkAccount = ko.observableArray();
        self.networkAccountID = ko.observable();
        self.networkAccountIDCompute = ko.computed(function () {

            if (self.networkAccount()[0]) {
                var userFnc = self.getUserIdFromLogin(self.networkAccount()[0]);
                userFnc.then(function (driverID) {
                    console.log("Net Acc ID: " + driverID);

                    self.networkAccountID(driverID);
                });

                if (! self.LDAPname()) {
                    var regex = /\\.*$/g;
                    var found = self.networkAccount()[0].match(regex);

                    self.LDAPname(found[0].substring(1, found[0].length));
                }
            }
        }, this);

        

        // Calculated fields 


        // Equipment Usage Link
        self.equipmentLink = ko.observable();

        // UserPic fields 
        self.userPicName = ko.observable();
        self.imagePath = ko.observable();
        self.correctImagePathEnding = ko.computed(function () {
            if (self.userPicName()) {
                var str = "set";
                str = self.userPicName();
                var patt = /\.jpg$/gmi;
                var result = self.userPicName().match(patt);

                if (result)
                    return true;
            }
            return false;

        }, this);
        self.isJPG = ko.computed(function () {
            return self.userPicName() && !self.correctImagePathEnding();
        }, this);
        self.canUpload = ko.computed(function () {
            return self.userPicName() && self.correctImagePathEnding();
        }, this);


        // other helpers
        self.editInitMile = ko.observable(true);
        self.isEditMode = ko.observable(false);
        self.isInitialized = ko.observable(false);

        self.modalLoaded = ko.observable(false);
        self.modalLoading = ko.observable(false);

        self.saving = ko.observable(false);

        self.notValidSSF = ko.observable(false);
        self.notValidEmpNo = ko.observable(false);

        self.SSFid.subscribe(function () { self.notValidSSF(false); }, this)
        self.employeeNo.subscribe(function () { self.notValidEmpNo(false); }, this)

        var landingPage = '/Lists/AddressBook';

        // ---------------------------------Functions---------------------------------

        // Init function 
        self.init = function () {
            var tmpFloor = getFieldChoices("AddressBook", "floor");
            var tmpJobTitleCategory = getFieldChoices("AddressBook", "jobTitleCategory");
            //var tmpLocation = getFieldChoices("AddressBook", "location");
            var tmpSalutation = getFieldChoices("AddressBook", "salutation");
            var tmpStatus = getFieldChoices("AddressBook", "status");
            var tmpDegree = getFieldChoices("AddressBook", "pTitle");

            var tmpLocation = self.loadLocation();
            /*var tmpCompany = self.loadCompanies();
            var tmpDivision = self.loadDivision();
            var tmpCostCenter = self.loadCostCenter();
            var tmpSuperior = self.loadSuperior();
            var tmpJobTitle = self.loadJobTitle();*/

            $.when(tmpFloor, tmpJobTitleCategory, tmpLocation, tmpSalutation, tmpStatus, tmpDegree/*, tmpCompany, tmpDivision, tmpCostCenter, tmpSuperior, tmpJobTitle*/).then(function (r1, r2, r3, r4, r5, r6) {
                
                //alert();
                self.availableFloor.push.apply(self.availableFloor, r1);
                self.availableJobTitleCategory.push.apply(self.availableJobTitleCategory, r2);
                //self.availableLocation.push.apply(self.availableLocation, r3);
                self.availableSalutation.push.apply(self.availableSalutation, r4);
                self.availableStatus.push.apply(self.availableStatus, r5);
                self.availableDegree.push.apply(self.availableDegree, r6);

                // init bs validation
                $('#AddressBookForm').validator({
                    delay: 100,
                    custom: {
                        uniquessfid: function ($el) {
                            console.log("$el.val(): " + $el.val());
                            if ($el.val() != "") {
                                return self.notValidSSF();
                            }
                            else {
                                console.log("Else TRUE");
                                return false;
                            }
                        },
                        uniqueempno: function ($el) {
                            console.log("$el.val(): " + $el.val());
                            if ($el.val() != "") {
                                return self.notValidEmpNo();
                            }
                            else {
                                console.log("Else TRUE");
                                return false;
                            }
                        }
                    },
                    errors: {
                        uniquessfid: "This Employee number already exist!"
                    }
                });

                console.log(self.availableCompany());

                $(function () {
                    $("select[role='multiselect']").multiselect();
                });

                var itemID = getUrlParameter("ID");
                if (itemID) {
                    self.isEditMode(true);
                    self.loadPic(itemID);
                    self.loadItem(itemID);
                }
                else {
                    self.isInitialized(true);
                }
                
            });
        }

        self.loadModal = function () {
            
            if (!self.modalLoaded()) {
                self.modalLoading(true);
                var tmpCompany = self.loadCompanies();
                var tmpDivision = self.loadDivision();
                var tmpCostCenter = self.loadCostCenter();
                var tmpSuperior = self.loadSuperior();
                var tmpJobTitle = self.loadJobTitle();

                $.when(tmpCompany, tmpDivision, tmpCostCenter, tmpSuperior, tmpJobTitle).then(function () {
                    self.modalLoaded(true);
                    self.modalLoading(false);
                    $('#employmentModal').modal('show');
                });
            } else {
                $('#employmentModal').modal('show');
            }
        }

        self.loadLocation = function () {
            
            var defer = $.Deferred();
            try {
                var context = SP.ClientContext.get_current();
                var list = context.get_web().get_lists().getByTitle("Location");
                var camlQuery = new SP.CamlQuery();
                var items = list.getItems(camlQuery);
                context.load(items);

                context.executeQueryAsync(
                    function () {
                        //success

                        var itemEnum = items.getEnumerator();
                        while (itemEnum.moveNext()) {

                            var oListItem = itemEnum.get_current();
                            //alert(oListItem.get_item('Title') + "   " + oListItem.get_id());
                            var obj = {
                                id: oListItem.get_id(),
                                title: oListItem.get_item('Title')
                            };
                            self.availableLocation.push(obj);
                        }
                        defer.resolve();

                    },
                    function (s, a) {
                        //error
                        self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                        defer.reject();
                    });
            }
            catch (err) {
                self.errorMessage(err.message);
            }
            return defer.promise();
        }

        self.loadCompanies = function () {
           
            var defer = $.Deferred();
            try {
                var context = SP.ClientContext.get_current();
                var list = context.get_web().get_lists().getByTitle("Companies New");
                var camlQuery = new SP.CamlQuery();
                var items = list.getItems(camlQuery);
                context.load(items);

                context.executeQueryAsync(
                    function () {
                        //success

                        var itemEnum = items.getEnumerator();
                        while (itemEnum.moveNext()) {

                            var oListItem = itemEnum.get_current();
                            var obj = {
                                id: oListItem.get_id(),
                                title: oListItem.get_item('Title')
                            };
                            self.availableCompany.push(obj);
                        }
                        defer.resolve();

                    },
                    function (s, a) {
                        //error
                        self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                        defer.reject();
                    });
            }
            catch (err) {
                self.errorMessage(err.message);
            }
            return defer.promise();
        }

        self.loadDivision = function () {
            var defer = $.Deferred();
            try {
                var context = SP.ClientContext.get_current();
                var list = context.get_web().get_lists().getByTitle("Divisions New");
                var camlQuery = new SP.CamlQuery();
                var items = list.getItems(camlQuery);
                context.load(items);

                context.executeQueryAsync(
                    function () {
                        //success

                        var itemEnum = items.getEnumerator();
                        while (itemEnum.moveNext()) {

                            var oListItem = itemEnum.get_current();
                            var obj = {
                                id: oListItem.get_id(),
                                title: oListItem.get_item('Title')
                            };
                            self.availableDivision.push(obj);
                        }
                        defer.resolve();

                    },
                    function (s, a) {
                        //error
                        self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                        defer.reject();
                    });
            }
            catch (err) {
                self.errorMessage(err.message);
            }
            return defer.promise();
        }

        self.loadCostCenter = function () {
            var defer = $.Deferred();
            try {
                var context = SP.ClientContext.get_current();
                var list = context.get_web().get_lists().getByTitle("Cost Centers New");
                var camlQuery = new SP.CamlQuery();
                var items = list.getItems(camlQuery);
                context.load(items);

                context.executeQueryAsync(
                    function () {
                        //success

                        var itemEnum = items.getEnumerator();
                        while (itemEnum.moveNext()) {

                            var oListItem = itemEnum.get_current();
                            var obj = {
                                id: oListItem.get_id(),
                                title: oListItem.get_item('fullNameByCostCenter')
                            };
                            self.availableCostCenter.push(obj);
                        }
                        defer.resolve();

                    },
                    function (s, a) {
                        //error
                        self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                        defer.reject();
                    });
            }
            catch (err) {
                self.errorMessage(err.message);
            }
            return defer.promise();
        }

        self.loadSuperior = function () {
            var defer = $.Deferred();
            try {
                var context = SP.ClientContext.get_current();
                var list = context.get_web().get_lists().getByTitle("AddressBook");
                var camlQuery = new SP.CamlQuery();
                var items = list.getItems(camlQuery);
                context.load(items);

                context.executeQueryAsync(
                    function () {
                        //success

                        var itemEnum = items.getEnumerator();
                        while (itemEnum.moveNext()) {

                            var oListItem = itemEnum.get_current();
                            var obj = {
                                id: oListItem.get_id(),
                                title: oListItem.get_item('Title')
                            };
                            self.availableSuperior.push(obj);
                        }
                        defer.resolve();

                    },
                    function (s, a) {
                        //error
                        self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                        defer.reject();
                    });
            }
            catch (err) {
                self.errorMessage(err.message);
            }
            return defer.promise();
        }
        
        self.loadJobTitle = function () {
            var defer = $.Deferred();
            try {
                var context = SP.ClientContext.get_current();
                var list = context.get_web().get_lists().getByTitle("Job Catalogue");
                var camlQuery = new SP.CamlQuery();
                var items = list.getItems(camlQuery);
                context.load(items);

                context.executeQueryAsync(
                    function () {
                        //success

                        var itemEnum = items.getEnumerator();
                        while (itemEnum.moveNext()) {

                            var oListItem = itemEnum.get_current();
                            var obj = {
                                id: oListItem.get_id(),
                                title: oListItem.get_item('NadpisEN')
                            };
                            self.availableJobTitle.push(obj);
                        }
                        defer.resolve();

                    },
                    function (s, a) {
                        //error
                        self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                        defer.reject();
                    });
            }
            catch (err) {
                self.errorMessage(err.message);
            }
            return defer.promise();
        }

        // Save item to list
        self.save = function () {
            //var tmpUniqueSSF = self.uniqueSSF();
            //var tmpUniqueEmp = self.uniqueEmpNo();
            self.saving(true);
            var tmpUnique = self.uniqueValues();

            $.when(tmpUnique).then(function () {

                if (IsFormValid("AddressBookForm")) {
                    console.log("Saving");
                    var context = SP.ClientContext.get_current();
                    var list = context.get_web().get_lists().getByTitle("AddressBook");

                    var itemID = getUrlParameter("ID");
                    if (itemID) {
                        var item = list.getItemById(itemID);
                    }
                    else {
                        var itemCreateInfo = new SP.ListCreationInformation();
                        var item = list.addItem(itemCreateInfo);
                    }

                    self.setItemPropeties(item);

                    console.log("Item loaded, waiting for update.");

                    item.update();
                    console.log("Item updated.");

                    context.load(item);
                    console.log("Context loaded.");

                    context.executeQueryAsync(
                        function () {
                            console.log("Item uploaded.");

                            self.closeForm();
                        },
                        function (s, a) {
                            console.log("Failed: " + a.get_message());
                            //alert(a.get_message() + '\n' + a.get_stackTrace());
                        }
                    );
                } else {
                    self.saving(false);
                }
            });
        }

        // Checks unique of actual SSF and EmployeeNumber
        self.uniqueValues = function () {
            var defer = $.Deferred();
            var context = SP.ClientContext.get_current();
            var list = context.get_web().get_lists().getByTitle("AddressBook");
            var caml = new SP.CamlQuery();


            caml.set_viewXml("<View><Query><Where><Or><Eq><FieldRef Name='empNunber' /><Value Type='Text'>" + self.employeeNo() + "</Value></Eq><Eq><FieldRef Name='SSFID' /><Value Type='Text'>" + self.SSFid() + "</Value></Eq></Or></Where></Query></View>");
            items = list.getItems(caml);
            context.load(items);

            context.executeQueryAsync(
                function () {
                    var enumerator = items.getEnumerator();
                    while (enumerator.moveNext()) {
                        var listItem = enumerator.get_current();

                        if (listItem.get_id() != getUrlParameter("ID")) {
                            if (listItem.get_item("empNunber") == self.employeeNo())
                                self.notValidEmpNo(true);

                            if (listItem.get_item("SSFID") == self.SSFid())
                                self.notValidSSF(true);
                        }
                    }
                    defer.resolve(true);
                },
                function (s, a) {
                    //error
                    console.log(a.get_message() + '\n' + a.get_stackTrace());
                });


            return defer.promise();
        }

        // Checks unique of actual SSF
        self.uniqueSSF = function () {
            var defer = $.Deferred();
            var context = SP.ClientContext.get_current();
            var list = context.get_web().get_lists().getByTitle("AddressBook");
            var collListItem = list.getItems("");
            context.load(collListItem);


            context.executeQueryAsync(
                function () {
                    var listEnumerator = collListItem.getEnumerator();
                    while (listEnumerator.moveNext()) {
                        console.log(listEnumerator.get_current().get_item("SSFID") + " == " + self.SSFid());
                        if (listEnumerator.get_current().get_item("SSFID") == self.SSFid() && !(listEnumerator.get_current().get_id() == getUrlParameter("ID")) ) {
                            defer.resolve(true);
                            
                            return;
                        }
                    }
                    defer.resolve(false);
                },
                function (s, a) {
                    //error
                    self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                });


            return defer.promise();
        }

        // Checks unique of actual SSF
        self.uniqueEmpNo = function () {
            var defer = $.Deferred();
            var context = SP.ClientContext.get_current();
            var list = context.get_web().get_lists().getByTitle("AddressBook");
            var collListItem = list.getItems("");
            context.load(collListItem);


            context.executeQueryAsync(
                function () {
                    var listEnumerator = collListItem.getEnumerator();
                    while (listEnumerator.moveNext()) {
                        if (listEnumerator.get_current().get_item("empNunber") == self.employeeNo() && !(listEnumerator.get_current().get_id() == getUrlParameter("ID"))) {
                            defer.resolve(true);

                            return;
                        }
                    }
                    defer.resolve(false);
                },
                function (s, a) {
                    //error
                    self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                });


            return defer.promise();
        }

        // Loads item from list
        self.loadItem = function (id) {
            try {
                var context = SP.ClientContext.get_current();
                var list = context.get_web().get_lists().getByTitle("AddressBook");
                var item = list.getItemById(id);
                context.load(item, 
                            "Title",
                            "status",
                            "salutation",
                            "fName",
                            "sName",
                            "pTitle",
                            "empNunber",
                            "dob",
                            "startDate",
                            "endDate",
                            "CompanyCode",
                            "DivisionCode",
                            "CostCenter",
                            "superior",
                            "jobTitle",
                            "jobTitleCategory",
                            "location",
                            "floor",
                            "Building",
                            "phone",
                            "mobilePhone",
                            "landLine",
                            "otherPhone",
                            "networkAccount",
                            "ldapName",
                            "comment",
                            "displayBirthday",
                            "annualDialog",
                            "SSFID",
                            "UsageReportLink",
                            "Location2");

                context.executeQueryAsync(
                    function () {
                        self.fullName(item.get_item("Title"));
                        //self.imagePath("http://olympusdev.atomts.cz/EmployeePictures/" + item.get_item("Title") + ".jpg")

                        self.status(item.get_item("status"));
                        self.salutation(item.get_item("salutation"));
                        self.name(item.get_item("fName"));
                        self.surname(item.get_item("sName"));
                        if (item.get_item("pTitle")) {
                            console.log(item.get_item("pTitle")[0].split(","));
                            self.degree(item.get_item("pTitle")[0].split(","));
                            $("select[role='multiselect']").multiselect('select', self.degree());
                        }

                        self.employeeNo(item.get_item("empNunber"));
                        self.birthDate(item.get_item("dob"));
                        self.startDate(item.get_item("startDate"));
                        self.endDate(item.get_item("endDate"));

                        if (item.get_item("CompanyCode")) {
                            var obj = {
                                id: item.get_item("CompanyCode").get_lookupId(),
                                title: item.get_item("CompanyCode").get_lookupValue()
                            };
                            self.availableCompany.push(obj);
                            self.company(item.get_item("CompanyCode").get_lookupId());
                            self.companyText(obj.title);
                            //self.loadCompanies();
                        }

                        if (item.get_item("DivisionCode")) {
                            var obj = {
                                id: item.get_item("DivisionCode").get_lookupId(),
                                title: item.get_item("DivisionCode").get_lookupValue()
                            };
                            self.availableDivision.push(obj);
                            self.division(item.get_item("DivisionCode").get_lookupId());
                            self.divisionText(obj.title);
                            //self.loadDivision();
                        }                        

                        if (item.get_item("CostCenter")) {
                            var obj = {
                                id: item.get_item("CostCenter").get_lookupId(),
                                title: item.get_item("CostCenter").get_lookupValue()
                            };
                            self.availableCostCenter.push(obj);
                            self.costCenter(item.get_item("CostCenter").get_lookupId());
                            self.costCenterText(obj.title);
                            //self.loadCostCenter();
                        }

                        if (item.get_item("superior")) {
                            var obj = {
                                id: item.get_item("superior").get_lookupId(),
                                title: item.get_item("superior").get_lookupValue()
                            };
                            self.availableSuperior.push(obj);
                            self.superior(item.get_item("superior").get_lookupId());
                            self.superiorText(obj.title);
                            //self.loadSuperior();

                        }

                        if (item.get_item("jobTitle")) {
                            var obj = {
                                id: item.get_item("jobTitle").get_lookupId(),
                                title: item.get_item("jobTitle").get_lookupValue()
                            };
                            self.availableJobTitle.push(obj);
                            self.jobTitle(item.get_item("jobTitle").get_lookupId());
                            self.jobTitleText(obj.title);
                            //self.loadJobTitle();
                        }

                        if (item.get_item("Location2")) 
                            self.location(item.get_item("Location2").get_lookupId());
                        /*
                        if (item.get_item("Location2")) {
                            var obj = {
                                id: item.get_item("Location2").get_lookupId(),
                                title: item.get_item("Location2").get_lookupValue()
                            };
                            self.availableLocation.push(obj);
                            self.location(item.get_item("Location2").get_lookupId());
                            //self.loadLocation();
                        }*/

                        self.jobTitleCategory(item.get_item("jobTitleCategory"));
                        self.floor(item.get_item("floor"));
                        self.building(item.get_item("Building"));
                        self.phone(item.get_item("phone"));
                        self.mobilePhone(item.get_item("mobilePhone"));
                        self.line(item.get_item("landLine"));
                        self.otherPhone(item.get_item("otherPhone"));

                        if (item.get_item("networkAccount")) {
                            var netAddId = item.get_item("networkAccount").get_lookupId();
                            console.log("Network Acc loaded: " + netAddId);
                            self.networkAccountID(netAddId);
                            getUser(netAddId).then(function (spuser) {
                                self.networkAccount([spuser.get_loginName()]);
                                console.log("Network Acc loaded: " + self.networkAccount());
                            });
                        }
                        //self.networkAccountID(item.get_item("networkAccount"));
                        
                        self.LDAPname(item.get_item("ldapName"));
                        self.other(item.get_item("comment"));
                        self.displayBirthday(item.get_item("displayBirthday"));
                        self.annualDialog(item.get_item("annualDialog"));
                        self.SSFid(item.get_item("SSFID"));
                        self.equipmentLink(item.get_item("UsageReportLink"));

                        self.isInitialized(true);

                    },
                    function (s, a) {
                        //error
                        self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                        self.isInitialized(true);
                    });
            }
            catch (err) {
                self.errorMessage(err.message);
                self.isInitialized(true);
            }
        }

        // Loads pic from list
        self.loadPic = function (id) {
            try {
                var context = SP.ClientContext.get_current();
                var list = context.get_web().get_lists().getByTitle("Employee Pictures");
                var caml = new SP.CamlQuery();
                var web = context.get_web();
                var webPrefix;

                context.load(web);

                context.executeQueryAsync(
                    function () {
                        webPrefix = web.get_url();
                    },
                    function (s, a) {
                        //error
                        console.log(a.get_message() + '\n' + a.get_stackTrace());
                    }
                );

                caml.set_viewXml("<View><Query><Where><And><Eq><FieldRef Name='IsActive' /><Value Type='Boolean'>1</Value></Eq><Eq><FieldRef Name='AddressBookLookup' LookupId='TRUE'/><Value Type='Lookup'>" + id + "</Value></Eq></And></Where></Query></View>");
                items = list.getItems(caml);
                context.load(items);

                context.executeQueryAsync(
                    function () {
                        console.log("Finding a picture.");
                        var enumerator = items.getEnumerator();
                        enumerator.moveNext();
                        var listItem = enumerator.get_current();

                        console.log("GOOD");
                        console.log("Picture URL: " + webPrefix + "/EmployeePictures/" + listItem.get_item("FileLeafRef"));
                        self.imagePath(webPrefix + "/EmployeePictures/" + listItem.get_item("FileLeafRef"));
                    },
                    function (s, a) {
                        //error
                        console.log(a.get_message() + '\n' + a.get_stackTrace());
                    });
            }
            catch (err) {
                console.log(err.message);
            }
        }

        // Set List item
        self.setItemPropeties = function (item) {
            item.set_item("Title", self.fullName());

            if (self.status() != "Please select a value...")
                item.set_item("status", self.status());

            if (self.salutation() != "Please select a value...")
                item.set_item("salutation", self.salutation());

            item.set_item("fName", self.name());
            item.set_item("sName", self.surname());
            item.set_item("pTitle", self.degree().toString());
            item.set_item("empNunber", self.employeeNo());
            item.set_item("dob", self.birthDate());
            item.set_item("startDate", self.startDate());
            item.set_item("endDate", self.endDate());

            if (self.company() != 0 && self.company())
                item.set_item("CompanyCode", self.company());

            if (self.division() != 0 && self.division())
                item.set_item("DivisionCode", self.division());

            if (self.costCenter() != 0 && self.costCenter())
                item.set_item("CostCenter", self.costCenter());

            if (self.superior() != 0 && self.superior())
                item.set_item("superior", self.superior());

            if (self.jobTitle() != 0 && self.jobTitle())
                item.set_item("jobTitle", self.jobTitle());

            if (self.jobTitleCategory() != "Please select a value...")
                item.set_item("jobTitleCategory", self.jobTitleCategory());

            if (self.location() != 0 && self.location())
                item.set_item("Location2", self.location());

            if (self.floor() != "Please select a value...")
                item.set_item("floor", self.floor());

            item.set_item("Building", self.building());
            item.set_item("phone", self.phone());
            item.set_item("mobilePhone", self.mobilePhone());
            item.set_item("landLine", self.line());
            item.set_item("otherPhone", self.otherPhone());
            console.log("Saving networkAccount: " + self.networkAccountID());
            item.set_item("networkAccount", self.networkAccountID());
            item.set_item("ldapName", self.LDAPname());

            item.set_item("comment", self.other());
            item.set_item("displayBirthday", self.displayBirthday());
            item.set_item("annualDialog", self.annualDialog());
            item.set_item("SSFID", self.SSFid());


            console.log("Item propeties was loaded");
        }

        // Closes form and returns to list
        self.closeForm = function () {
            var sourceUrl = getUrlParameter("Source");
            var webUrl = _spPageContextInfo.siteAbsoluteUrl;

            if (sourceUrl.length > 0) {
                window.location.replace(sourceUrl);
            }
            else {
                window.location.replace(webUrl + landingPage);
            }
        }

        // Updates name of file
        self.updateFileName = function () {
            var fileList = document.getElementById('selectedFile').files;
            if (fileList[0]) {
                console.log(fileList[0].name);

                self.userPicName(fileList[0].name);
                if (fileList && fileList[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $('#UserPicID')
                            .attr('src', e.target.result);
                    };

                    reader.readAsDataURL(fileList[0]);
                }
            }
            else {
                self.userPicName(null);
            }
            

        }

        // Upload image to ProfileImage list
        self.uploadImage = function () {
            console.log("Image is being uploaded");
            var parts = $("#selectedFile")[0].value.split('\\');
            var fileName = parts[parts.length - 1];

            getFileBuffer(0, $("#selectedFile")).then(function (byteArray, index) {
                uploadFile(byteArray, fileName);
            });
        }

        // Gets users userID
        self.getUserIdFromLogin = function (loginName) {
            var context = SP.ClientContext.get_current();
            var spuser = context.get_web().ensureUser(loginName);
            console.log("Finding by login name: " + loginName);
            context.load(spuser);

            return executeQueryAsyncDeferred(context, null).then(function () {
                return spuser.get_id();
            });
        }

        // Specify
        function uploadFile(arrayBuffer, fileName) {
            var today = new Date();

            //--------- Load current active picture ---------
            
            // Get SharePoint context
            var ctxPic = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl);

            // Get Documents Library
            var oList = ctxPic.get_web().get_lists().getByTitle("Employee Pictures");
            var camlQuery = new SP.CamlQuery();

            // CAML query to get only the documents related to the current page (that means, this code is valid to be executed inside every page)
            // 		_spPageContextInfo.pageItemId is the current page ID
            camlQuery.set_viewXml("<View><Query><Where><And><Eq><FieldRef Name='IsActive' /><Value Type='Boolean'>1</Value></Eq><Eq><FieldRef Name='AddressBookLookup' LookupId='TRUE'/><Value Type='Lookup'>" + getUrlParameter("ID") + "</Value></Eq></And></Where></Query></View>");
            var collListItem = oList.getItems(camlQuery);

            // Include only needed fields to reduce network load
            ctxPic.load(collListItem);

            ctxPic.executeQueryAsync(function () {
                //Iterate results and build the div container
                var listItemEnumerator = collListItem.getEnumerator();

                //Set every item with (IsActive == true) to false
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    console.log(oListItem.get_item("Title"));
                    oListItem.set_item("IsActive", false);
                    oListItem.update();
                    
                    ctxPic.load(oListItem);

                    ctxPic.executeQueryAsync(
                        function () {
                            console.log("IsActive on EmpPicture set to FALSE.");
                        },
                        function (s, a) {
                            console.log("Failed: " + a.get_message());
                            //alert(a.get_message() + '\n' + a.get_stackTrace());
                        }
                    );
                }
            },
                function (sender, args) {
                    console.log('Request collListItem failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                }
            );

            //--------- END: Load current active picture ---------

            //Get Client Context,Web and List object.  
            var clientContext = new SP.ClientContext();
            var oWeb = clientContext.get_web();
            var oList = oWeb.get_lists().getByTitle("Employee Pictures");

            //Convert the file contents into base64 data
            var bytes = new Uint8Array(arrayBuffer);
            var i, length, out = '';
            for (i = 0, length = bytes.length; i < length; i += 1) {
                out += String.fromCharCode(bytes[i]);
            }
            var base64 = btoa(out);

            //Create FileCreationInformation object using the read file data
            var createInfo = new SP.FileCreationInformation();
            createInfo.set_content(base64);
            createInfo.set_url(self.fullName() + "-" + addZero(today.getHours()) + "-" + addZero(today.getMinutes()) + "-" + today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear() + ".jpg");

            //Add the file to the library
            var uploadedDocument = oList.get_rootFolder().get_files().add(createInfo);

            var newListItem = uploadedDocument.get_listItemAllFields();
            //alert(getUrlParameter("ID"));
            newListItem.set_item("AddressBookLookup", getUrlParameter("ID"));
            newListItem.set_item("IsActive", true);
            newListItem.set_item("Title", self.fullName() + " " + addZero(today.getHours()) + ":" + addZero(today.getMinutes()) + " " + today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear());
            
            newListItem.update();

            //Load client context and execcute the batch  
            clientContext.load(uploadedDocument);
            clientContext.executeQueryAsync(function () {
                //success
                alert("Picture: \"" + self.fullName() + ".jpg\" has been uploaded and set to active.");
                document.getElementById('selectedFile').value = "";
                self.updateFileName();
            },
            function (s, a) {
                //error
                //self.errorMessage(a.get_message() + '\n' + a.get_stackTrace());
                //alert("FAILED");
                console.log(a.get_message() + '\n' + a.get_stackTrace());
            });
        }

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        
    }




    /**
     * bootstrap-multiselect.js
     * https://github.com/davidstutz/bootstrap-multiselect
     *
     * Copyright 2012, 2013 David Stutz
     * 
     * Dual licensed under the BSD-3-Clause and the Apache License, Version 2.0.
     */
    !function ($) {

        "use strict";// jshint ;_;

        if (typeof ko != 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
            ko.bindingHandlers.multiselect = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var ms = $(element).data('multiselect');
                    if (!ms) {
                        $(element).multiselect(ko.utils.unwrapObservable(valueAccessor()));
                    }
                    else if (allBindingsAccessor().options && allBindingsAccessor().options().length !== ms.originalOptions.length) {
                        ms.updateOriginalOptions();
                        $(element).multiselect('rebuild');
                    }
                }
            };
        }

        function Multiselect(select, options) {

            this.options = this.mergeOptions(options);
            this.$select = $(select);

            // Initialization.
            // We have to clone to create a new reference.
            this.originalOptions = this.$select.clone()[0].options;
            this.query = '';
            this.searchTimeout = null;

            this.options.multiple = this.$select.attr('multiple') == "multiple";
            this.options.onChange = $.proxy(this.options.onChange, this);

            // Build select all if enabled.
            this.buildContainer();
            this.buildButton();
            this.buildSelectAll();
            this.buildDropdown();
            this.buildDropdownOptions();
            this.buildFilter();
            this.updateButtonText();

            this.$select.hide().after(this.$container);
        };

        Multiselect.prototype = {

            // Default options.
            defaults: {
                // Default text function will either print 'None selected' in case no
                // option is selected, or a list of the selected options up to a length of 3 selected options.
                // If more than 3 options are selected, the number of selected options is printed.
                buttonText: function (options, select) {
                    if (options.length == 0) {
                        return this.nonSelectedText + ' <b class="caret"></b>';
                    }
                    else {

                        if (options.length > 3) {
                            return options.length + ' ' + this.nSelectedText + ' <b class="caret"></b>';
                        }
                        else {
                            var selected = '';
                            options.each(function () {
                                var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).html();

                                //Hack by Victor Valencia R.
                                if ($(select).hasClass('multiselect-icon')) {
                                    var icon = $(this).data('icon');
                                    label = '<span class="glyphicon ' + icon + '"></span> ' + label;
                                }

                                selected += label + ', ';
                            });
                            return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
                        }
                    }
                },
                // Like the buttonText option to update the title of the button.
                buttonTitle: function (options, select) {
                    if (options.length == 0) {
                        return this.nonSelectedText;
                    }
                    else {
                        var selected = '';
                        options.each(function () {
                            selected += $(this).text() + ', ';
                        });
                        return selected.substr(0, selected.length - 2);
                    }
                },
                // Is triggered on change of the selected options.
                onChange: function (option, checked) {

                },
                buttonClass: 'btn',
                dropRight: false,
                selectedClass: 'active',
                buttonWidth: 'auto',
                buttonContainer: '<div class="btn-group" />',
                // Maximum height of the dropdown menu.
                // If maximum height is exceeded a scrollbar will be displayed.
                maxHeight: false,
                includeSelectAllOption: false,
                selectAllText: ' Select all',
                selectAllValue: 'multiselect-all',
                enableFiltering: false,
                enableCaseInsensitiveFiltering: false,
                filterPlaceholder: 'Search',
                // possible options: 'text', 'value', 'both'
                filterBehavior: 'text',
                preventInputChangeEvent: false,
                nonSelectedText: 'None',
                nSelectedText: 'selected'
            },

            // Templates.
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"></button>',
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div>',
                li: '<li><a href="javascript:void(0);"><label></label></a></li>',
                liGroup: '<li><label class="multiselect-group"></label></li>'
            },

            constructor: Multiselect,

            buildContainer: function () {
                this.$container = $(this.options.buttonContainer);
            },

            buildButton: function () {
                // Build button.
                this.$button = $(this.templates.button).addClass(this.options.buttonClass);

                // Adopt active state.
                if (this.$select.prop('disabled')) {
                    this.disable();
                }
                else {
                    this.enable();
                }

                // Manually add button width if set.
                if (this.options.buttonWidth) {
                    this.$button.css({
                        'width': this.options.buttonWidth
                    });
                }

                // Keep the tab index from the select.
                var tabindex = this.$select.attr('tabindex');
                if (tabindex) {
                    this.$button.attr('tabindex', tabindex);
                }

                this.$container.prepend(this.$button)
            },

            // Build dropdown container ul.
            buildDropdown: function () {

                // Build ul.
                this.$ul = $(this.templates.ul);

                if (this.options.dropRight) {
                    this.$ul.addClass('pull-right');
                }

                // Set max height of dropdown menu to activate auto scrollbar.
                if (this.options.maxHeight) {
                    // TODO: Add a class for this option to move the css declarations.
                    this.$ul.css({
                        'max-height': this.options.maxHeight + 'px',
                        'overflow-y': 'auto',
                        'overflow-x': 'hidden'
                    });
                }

                this.$container.append(this.$ul)
            },

            // Build the dropdown and bind event handling.
            buildDropdownOptions: function () {

                this.$select.children().each($.proxy(function (index, element) {
                    // Support optgroups and options without a group simultaneously.
                    var tag = $(element).prop('tagName').toLowerCase();
                    if (tag == 'optgroup') {
                        this.createOptgroup(element);
                    }
                    else if (tag == 'option') {
                        this.createOptionValue(element);
                    }
                    // Other illegal tags will be ignored.
                }, this));

                // Bind the change event on the dropdown elements.
                $('li input', this.$ul).on('change', $.proxy(function (event) {
                    var checked = $(event.target).prop('checked') || false;
                    var isSelectAllOption = $(event.target).val() == this.options.selectAllValue;

                    // Apply or unapply the configured selected class.
                    if (this.options.selectedClass) {
                        if (checked) {
                            $(event.target).parents('li').addClass(this.options.selectedClass);
                        }
                        else {
                            $(event.target).parents('li').removeClass(this.options.selectedClass);
                        }
                    }

                    // Get the corresponding option.
                    var value = $(event.target).val();
                    var $option = this.getOptionByValue(value);

                    var $optionsNotThis = $('option', this.$select).not($option);
                    var $checkboxesNotThis = $('input', this.$container).not($(event.target));

                    // Toggle all options if the select all option was changed.
                    if (isSelectAllOption) {
                        $checkboxesNotThis.filter(function () {
                            return $(this).is(':checked') != checked;
                        }).trigger('click');
                    }

                    if (checked) {
                        $option.prop('selected', true);

                        if (this.options.multiple) {
                            // Simply select additional option.
                            $option.prop('selected', true);
                        }
                        else {
                            // Unselect all other options and corresponding checkboxes.
                            if (this.options.selectedClass) {
                                $($checkboxesNotThis).parents('li').removeClass(this.options.selectedClass);
                            }

                            $($checkboxesNotThis).prop('checked', false);
                            $optionsNotThis.prop('selected', false);

                            // It's a single selection, so close.
                            this.$button.click();
                        }

                        if (this.options.selectedClass == "active") {
                            $optionsNotThis.parents("a").css("outline", "");
                        }
                    }
                    else {
                        // Unselect option.
                        $option.prop('selected', false);
                    }

                    this.updateButtonText();
                    this.$select.change();
                    this.options.onChange($option, checked);

                    if (this.options.preventInputChangeEvent) {
                        return false;
                    }
                }, this));

                $('li a', this.$ul).on('touchstart click', function (event) {
                    event.stopPropagation();
                    $(event.target).blur();
                });

                // Keyboard support.
                this.$container.on('keydown', $.proxy(function (event) {
                    if ($('input[type="text"]', this.$container).is(':focus')) {
                        return;
                    }
                    if ((event.keyCode == 9 || event.keyCode == 27) && this.$container.hasClass('open')) {
                        // Close on tab or escape.
                        this.$button.click();
                    }
                    else {
                        var $items = $(this.$container).find("li:not(.divider):visible a");

                        if (!$items.length) {
                            return;
                        }

                        var index = $items.index($items.filter(':focus'));

                        // Navigation up.
                        if (event.keyCode == 38 && index > 0) {
                            index--;
                        }
                        // Navigate down.
                        else if (event.keyCode == 40 && index < $items.length - 1) {
                            index++;
                        }
                        else if (!~index) {
                            index = 0;
                        }

                        var $current = $items.eq(index);
                        $current.focus();

                        if (event.keyCode == 32 || event.keyCode == 13) {
                            var $checkbox = $current.find('input');

                            $checkbox.prop("checked", !$checkbox.prop("checked"));
                            $checkbox.change();
                        }

                        event.stopPropagation();
                        event.preventDefault();
                    }
                }, this));
            },

            // Will build an dropdown element for the given option.
            createOptionValue: function (element) {
                if ($(element).is(':selected')) {
                    $(element).prop('selected', true);
                }

                // Support the label attribute on options.
                var label = $(element).attr('label') || $(element).html();
                var value = $(element).val();

                //Hack by Victor Valencia R.            
                if ($(element).parent().hasClass('multiselect-icon') || $(element).parent().parent().hasClass('multiselect-icon')) {
                    var icon = $(element).data('icon');
                    label = '<span class="glyphicon ' + icon + '"></span> ' + label;
                }

                var inputType = this.options.multiple ? "checkbox" : "radio";

                var $li = $(this.templates.li);
                $('label', $li).addClass(inputType);
                $('label', $li).append('<input type="' + inputType + '" />');

                //Hack by Victor Valencia R.
                if (($(element).parent().hasClass('multiselect-icon') || $(element).parent().parent().hasClass('multiselect-icon')) && inputType == 'radio') {
                    $('label', $li).css('padding-left', '0px');
                    $('label', $li).find('input').css('display', 'none');
                }

                var selected = $(element).prop('selected') || false;
                var $checkbox = $('input', $li);
                $checkbox.val(value);

                if (value == this.options.selectAllValue) {
                    $checkbox.parent().parent().addClass('multiselect-all');
                }

                $('label', $li).append(" " + label);

                this.$ul.append($li);

                if ($(element).is(':disabled')) {
                    $checkbox.attr('disabled', 'disabled').prop('disabled', true).parents('li').addClass('disabled');
                }

                $checkbox.prop('checked', selected);

                if (selected && this.options.selectedClass) {
                    $checkbox.parents('li').addClass(this.options.selectedClass);
                }
            },

            // Create optgroup.
            createOptgroup: function (group) {
                var groupName = $(group).prop('label');

                // Add a header for the group.
                var $li = $(this.templates.liGroup);
                $('label', $li).text(groupName);

                //Hack by Victor Valencia R.
                $li.addClass('text-primary');

                this.$ul.append($li);

                // Add the options of the group.
                $('option', group).each($.proxy(function (index, element) {
                    this.createOptionValue(element);
                }, this));
            },

            // Add the select all option to the select.
            buildSelectAll: function () {
                var alreadyHasSelectAll = this.$select[0][0] ? this.$select[0][0].value == this.options.selectAllValue : false;
                // If options.includeSelectAllOption === true, add the include all checkbox.
                if (this.options.includeSelectAllOption && this.options.multiple && !alreadyHasSelectAll) {
                    this.$select.prepend('<option value="' + this.options.selectAllValue + '">' + this.options.selectAllText + '</option>');
                }
            },

            // Build and bind filter.
            buildFilter: function () {

                // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.
                if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                    var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);
                    if (this.$select.find('option').length >= enableFilterLength) {

                        this.$filter = $(this.templates.filter);
                        $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);
                        this.$ul.prepend(this.$filter);

                        this.$filter.val(this.query).on('click', function (event) {
                            event.stopPropagation();
                        }).on('keydown', $.proxy(function (event) {
                            // This is useful to catch "keydown" events after the browser has updated the control.
                            clearTimeout(this.searchTimeout);

                            this.searchTimeout = this.asyncFunction($.proxy(function () {

                                if (this.query != event.target.value) {
                                    this.query = event.target.value;

                                    $.each($('li', this.$ul), $.proxy(function (index, element) {
                                        var value = $('input', element).val();
                                        if (value != this.options.selectAllValue) {
                                            var text = $('label', element).text();
                                            var value = $('input', element).val();
                                            if (value && text && value != this.options.selectAllValue) {
                                                // by default lets assume that element is not
                                                // interesting for this search
                                                var showElement = false;

                                                var filterCandidate = '';
                                                if ((this.options.filterBehavior == 'text' || this.options.filterBehavior == 'both')) {
                                                    filterCandidate = text;
                                                }
                                                if ((this.options.filterBehavior == 'value' || this.options.filterBehavior == 'both')) {
                                                    filterCandidate = value;
                                                }

                                                if (this.options.enableCaseInsensitiveFiltering && filterCandidate.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
                                                    showElement = true;
                                                }
                                                else if (filterCandidate.indexOf(this.query) > -1) {
                                                    showElement = true;
                                                }

                                                if (showElement) {
                                                    $(element).show();
                                                }
                                                else {
                                                    $(element).hide();
                                                }
                                            }
                                        }
                                    }, this));
                                }
                            }, this), 300, this);
                        }, this));
                    }
                }
            },

            // Destroy - unbind - the plugin.
            destroy: function () {
                this.$container.remove();
                this.$select.show();
            },

            // Refreshs the checked options based on the current state of the select.
            refresh: function () {
                $('option', this.$select).each($.proxy(function (index, element) {
                    var $input = $('li input', this.$ul).filter(function () {
                        return $(this).val() == $(element).val();
                    });

                    if ($(element).is(':selected')) {
                        $input.prop('checked', true);

                        if (this.options.selectedClass) {
                            $input.parents('li').addClass(this.options.selectedClass);
                        }
                    }
                    else {
                        $input.prop('checked', false);

                        if (this.options.selectedClass) {
                            $input.parents('li').removeClass(this.options.selectedClass);
                        }
                    }

                    if ($(element).is(":disabled")) {
                        $input.attr('disabled', 'disabled').prop('disabled', true).parents('li').addClass('disabled');
                    }
                    else {
                        $input.prop('disabled', false).parents('li').removeClass('disabled');
                    }
                }, this));

                this.updateButtonText();
            },

            // Select an option by its value or multiple options using an array of values.
            select: function (selectValues) {
                if (selectValues && !$.isArray(selectValues)) {
                    selectValues = [selectValues];
                }

                for (var i = 0; i < selectValues.length; i++) {

                    var value = selectValues[i];

                    var $option = this.getOptionByValue(value);
                    var $checkbox = this.getInputByValue(value);

                    if (this.options.selectedClass) {
                        $checkbox.parents('li').addClass(this.options.selectedClass);
                    }

                    $checkbox.prop('checked', true);
                    $option.prop('selected', true);
                    this.options.onChange($option, true);
                }

                this.updateButtonText();
            },

            // Deselect an option by its value or using an array of values.
            deselect: function (deselectValues) {
                if (deselectValues && !$.isArray(deselectValues)) {
                    deselectValues = [deselectValues];
                }

                for (var i = 0; i < deselectValues.length; i++) {

                    var value = deselectValues[i];

                    var $option = this.getOptionByValue(value);
                    var $checkbox = this.getInputByValue(value);

                    if (this.options.selectedClass) {
                        $checkbox.parents('li').removeClass(this.options.selectedClass);
                    }

                    $checkbox.prop('checked', false);
                    $option.prop('selected', false);
                    this.options.onChange($option, false);
                }

                this.updateButtonText();
            },

            // Rebuild the whole dropdown menu.
            rebuild: function () {
                this.$ul.html('');

                // Remove select all option in select.
                $('option[value="' + this.options.selectAllValue + '"]', this.$select).remove();

                // Important to distinguish between radios and checkboxes.
                this.options.multiple = this.$select.attr('multiple') == "multiple";

                this.buildSelectAll();
                this.buildDropdownOptions();
                this.updateButtonText();
                this.buildFilter();
            },

            // Build select using the given data as options.
            dataprovider: function (dataprovider) {
                var optionDOM = "";
                dataprovider.forEach(function (option) {
                    optionDOM += '<option value="' + option.value + '">' + option.label + '</option>';
                });

                this.$select.html(optionDOM);
                this.rebuild();
            },

            // Enable button.
            enable: function () {
                this.$select.prop('disabled', false);
                this.$button.prop('disabled', false)
                    .removeClass('disabled');
            },

            // Disable button.
            disable: function () {
                this.$select.prop('disabled', true);
                this.$button.prop('disabled', true)
                    .addClass('disabled');
            },

            // Set options.
            setOptions: function (options) {
                this.options = this.mergeOptions(options);
            },

            // Get options by merging defaults and given options.
            mergeOptions: function (options) {
                return $.extend({}, this.defaults, options);
            },

            // Update button text and button title.
            updateButtonText: function () {
                var options = this.getSelected();

                // First update the displayed button text.
                $('button', this.$container).html(this.options.buttonText(options, this.$select));

                // Now update the title attribute of the button.
                $('button', this.$container).attr('title', this.options.buttonTitle(options, this.$select));

            },

            // Get all selected options.
            getSelected: function () {
                return $('option[value!="' + this.options.selectAllValue + '"]:selected', this.$select).filter(function () {
                    return $(this).prop('selected');
                });
            },

            // Get the corresponding option by ts value.
            getOptionByValue: function (value) {
                return $('option', this.$select).filter(function () {
                    return $(this).val() == value;
                });
            },

            // Get an input in the dropdown by its value.
            getInputByValue: function (value) {
                return $('li input', this.$ul).filter(function () {
                    return $(this).val() == value;
                });
            },

            updateOriginalOptions: function () {
                this.originalOptions = this.$select.clone()[0].options;
            },

            asyncFunction: function (callback, timeout, self) {
                var args = Array.prototype.slice.call(arguments, 3);
                return setTimeout(function () {
                    callback.apply(self || window, args);
                }, timeout);
            }
        };

        $.fn.multiselect = function (option, parameter) {
            return this.each(function () {
                var data = $(this).data('multiselect'), options = typeof option == 'object' && option;

                // Initialize the multiselect.
                if (!data) {
                    $(this).data('multiselect', (data = new Multiselect(this, options)));
                }

                // Call multiselect method.
                if (typeof option == 'string') {
                    data[option](parameter);
                }
            });
        };

        $.fn.multiselect.Constructor = Multiselect;

        // Automatically init selects by their data-role.
        /*$(function () {
            $("select[role='multiselect']").multiselect();
        });*/

    }(window.jQuery);

    // --------------------------INIT--------------------------

    var tvm = new userEditFormViewModel();
    ko.applyBindings(tvm);
    tvm.init()

    $("#networkAccount_TopSpan").addClass("form-control");
});
