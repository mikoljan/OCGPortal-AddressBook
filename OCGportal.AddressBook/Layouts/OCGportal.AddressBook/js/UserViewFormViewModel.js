require(["jquery", "knockout", "bootstrap", "spscripts!", "helpers", "camljs", "jqueryui", "kobindings"], function ($, ko) {

    userViewFormViewModel = function () {
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
        self.birthDate = ko.observable(new Date());
        self.startDate = ko.observable(new Date());
        self.endDate = ko.observable(new Date()); 

        self.birthDateFormated = ko.computed(function () {
            if (self.birthDate()) {
                var formatted_date = self.birthDate().getDate() + ". " + (self.birthDate().getMonth() + 1) + ". " + self.birthDate().getFullYear();
                return formatted_date;
            }
            return null;
        }, this);

        self.startDateFormated = ko.computed(function () {
            if (self.startDate()) {
                var formatted_date = self.startDate().getDate() + ". " + (self.startDate().getMonth() + 1) + ". " + self.startDate().getFullYear();
                return formatted_date;
            }
            return null;
        }, this);

        self.endDateFormated = ko.computed(function () {
            if (self.endDate()) {
                var formatted_date = self.endDate().getDate() + ". " + (self.endDate().getMonth() + 1) + ". " + self.endDate().getFullYear();
                return formatted_date;
            }
            return null;
        }, this);

        // Choice fields
        self.status = ko.observable();
        self.availableStatus = ko.observableArray();

        self.salutation = ko.observable();
        self.availableSalutation = ko.observableArray();

        self.degree = ko.observableArray();
        self.availableDegree = ko.observableArray();

        self.jobTitleCategory = ko.observable();
        self.availableJobTitleCategory = ko.observableArray();

        self.floor = ko.observable();
        self.availableFloor = ko.observableArray();

        // LookUp fields
        self.company = ko.observable();
        self.availableCompany = ko.observableArray();

        self.division = ko.observable();
        self.availableDivision = ko.observableArray();

        self.costCenter = ko.observable();
        self.availableCostCenter = ko.observableArray();

        self.superior = ko.observable();
        self.availableSuperior = ko.observableArray();

        self.jobTitle = ko.observable();
        self.availableJobTitle = ko.observableArray();

        self.location = ko.observable();
        self.availableLocation = ko.observableArray();

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
            }
        }, this);

        // Equipment Usage Link
        self.equipmentLink = ko.observable();

        // Calculated fields 


        // UserPic fields 
        self.userPicName = ko.observable();
        self.imagePath = ko.observable();

        // other helpers
        self.editInitMile = ko.observable(true);
        self.isEditMode = ko.observable(false);
        self.canEdit = ko.observable(false);
        self.isInitialized = ko.observable(false);
        var landingPage = '/Lists/AddressBook';

        // ---------------------------------Functions---------------------------------

        // Init function 
        self.init = function () {
            self.getCurrentUserPermission();

            var itemID = getUrlParameter("ID");
            if (itemID) {
                self.isEditMode(true);
                self.loadPic(itemID);
                self.loadItem(itemID);
            }
            else {
                self.isInitialized(true);
            }
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
                            "Location2",
                            "UsageReportLink");

                context.executeQueryAsync(
                    function () {
                        self.fullName(item.get_item("Title"));
                        //self.imagePath("http://olympusdev.atomts.cz/EmployeePictures/" + item.get_item("Title") + ".jpg")
                        self.equipmentLink(item.get_item("UsageReportLink"));
                        self.status(item.get_item("status"));
                        self.salutation(item.get_item("salutation"));
                        self.name(item.get_item("fName"));
                        self.surname(item.get_item("sName"));
                        if (item.get_item("pTitle")) {
                            console.log(item.get_item("pTitle")[0].split(","));
                            self.degree(item.get_item("pTitle")[0].split(","));
                        }

                        self.employeeNo(item.get_item("empNunber"));
                        self.birthDate(item.get_item("dob"));
                        self.startDate(item.get_item("startDate"));
                        self.endDate(item.get_item("endDate"));

                        if (item.get_item("CompanyCode"))
                            self.company(item.get_item("CompanyCode").get_lookupValue());

                        if (item.get_item("DivisionCode"))
                            self.division(item.get_item("DivisionCode").get_lookupValue());

                        if (item.get_item("CostCenter"))
                            self.costCenter(item.get_item("CostCenter").get_lookupValue());

                        if (item.get_item("superior"))
                            self.superior(item.get_item("superior").get_lookupValue());

                        if (item.get_item("jobTitle"))
                            self.jobTitle(item.get_item("jobTitle").get_lookupValue());

                        self.jobTitleCategory(item.get_item("jobTitleCategory"));

                        if (item.get_item("Location2"))
                            self.location(item.get_item("Location2").get_lookupValue());
                        
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

                        self.isInitialized(true);

                    },
                    function (s, a) {
                        //error
                        alert(a.get_message() + '\n' + a.get_stackTrace());
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

        // Goto EditForm
        self.edit = function () {
            window.location.replace(_spPageContextInfo.siteAbsoluteUrl + '/' + _spPageContextInfo.layoutsUrl + "/OCGportal.AddressBook/AddressBookEditForm.aspx" + '?ID=' + getUrlParameter("ID"));
        }

        // Check if user can edit
        self.getCurrentUserPermission = function () {
            var web, clientContext, currentUser, oList, perMask;

            clientContext = new SP.ClientContext.get_current();
            web = clientContext.get_web();
            currentUser = web.get_currentUser();
            oList = web.get_lists().getByTitle('AddressBook');
            clientContext.load(oList, 'EffectiveBasePermissions');
            clientContext.load(currentUser);
            clientContext.load(web);

            clientContext.executeQueryAsync(function () {
                if (oList.get_effectiveBasePermissions().has(SP.PermissionKind.editListItems)) {
                    console.log("user has edit permission");
                    self.canEdit(true);
                } else {
                    console.log("user doesn't have edit permission");
                    self.canEdit(false);
                }
            }, function (sender, args) {
                console.log('request failed ' + args.get_message() + '\n' + args.get_stackTrace());
            });
        }
    }


    // --------------------------INIT--------------------------

    var tvm = new userViewFormViewModel();
    ko.applyBindings(tvm);
    tvm.init()

    $("#networkAccount_TopSpan").addClass("form-control");
});
