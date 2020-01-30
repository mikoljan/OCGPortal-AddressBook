var dateFormat = "DD/MM/YYYY"
var dateTimeFormat = "DD/MM/YYYY HH:mm:ss"

var dateFormatDataTable = "dd/MM/yyyy"

var tendersLibraryTitle = "Tenders"
var clientsListTitle = "Clients"
var commentsListTitle = "Comments"
var packagesLibraryTitle = "Packages"
var territoryManagersListTitle = "Territory managers"
var territoryManagersMappingListTitle = "TmMapping"

var tableDeleteButtonHtml = '<a href="" class="tm_delete"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>';
var tableEditButtonHtml = '<a href="" class="tm_edit"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i></a>';
//Get parameter from URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function peoplePickerBinding(lookupValue) {
    if (lookupValue && (lookupValue.length > 0)) {
        var fuv = new SP.FieldUserValue();
        fuv.set_lookupId(lookupValue[0]);
        return fuv;
    }
    return null;
}

function getFieldUserValue(itemId) {    
    var fuv = new SP.FieldUserValue();
    fuv.set_lookupId(itemId);
    return fuv;    
}

function dateFieldBinding(dateFieldId) {
    var date = checkDate($("#" + dateFieldId).val())
    return date ? date : null;
}

function getUserFromField(item, fieldName) {
    var d = $.Deferred()

    if (item.get_item(fieldName)) {
        getUser(item.get_item(fieldName).get_lookupId()).done(function (user) {
            d.resolve(user)
        });
    }
    else {
        d.resolve(null);
    }
    return d.promise();
}


// Query the picker for user information.
function getPickerUserIds(peoplePicker) {
    var deferred, deferreds = [];
    var context = new SP.ClientContext.get_current();
    var resolvedUserIds = new Array();
    var users = peoplePicker.GetAllUserInfo();
    $.each(users, function (i, user) {
        //user.Key = loginname
        deferred = getUserId(user.Key).then(function (userId) {
            resolvedUserIds.push(userId);
        });

        deferreds.push(deferred);
    });
    return $.when.apply($, deferreds).then(function () {
        return resolvedUserIds;
    });
}

function getPickerUsersInfo(peoplePicker) {
    var deferred, deferreds = [];
    var context = new SP.ClientContext.get_current();
    var resolvedUsers = new Array();
    var users = peoplePicker.GetAllUserInfo();
    $.each(users, function (i, user) {        
        deferred = getUserInfo(user.Key).then(function (usr) {
            resolvedUsers.push(usr);
        });

        deferreds.push(deferred);
    });
    return $.when.apply($, deferreds).then(function () {
        return resolvedUsers;
    });
}

//Get the user info
function getUserInfo(loginName) {
    var d = $.Deferred();
    var context = new SP.ClientContext.get_current();
    var user = context.get_web().ensureUser(loginName);
    context.load(user);
    context.executeQueryAsync(function () {
        var obj = {
            id: user.get_id(),
            name: user.get_title(),
            login: user.get_loginName()
        };
        d.resolve(obj);
    }, function (s, a) {
        d.reject(s, a);
    }
    );
    return d.promise();
}

// Get the user ID.
function getUserId(loginName) {
    var d = $.Deferred();
    var context = new SP.ClientContext.get_current();
    var user = context.get_web().ensureUser(loginName);
    context.load(user);
    context.executeQueryAsync(function () {
        d.resolve(user.get_id());
    }, function (s, a) {
        d.reject(s, a);
    }
    );
    return d.promise();
}

function getFileProperties(relUrl) {
    var d = $.Deferred();
    var ctx = SP.ClientContext.get_current();
    //get file
    var file = ctx.get_web().getFileByServerRelativeUrl(relUrl);
    ctx.load(file, 'ListItemAllFields');

    return executeQueryAsyncDeferred(ctx, "Failed to load properties for file '" + relUrl + "'").then(function () {
        return $.Deferred().resolve(file).promise();
    });    
}

function addFileToFolder(arrayBuffer, fileName, serverUrl, serverRelativeUrlToFolder) {

    // Construct the endpoint.
    var fileCollectionEndpoint = String.format(
        "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
        "/add(overwrite=true, url='{2}')",
        serverUrl, serverRelativeUrlToFolder, fileName);

    // Send the request and return the response.
    // This call returns the SharePoint file.
    var d = $.Deferred();
    jQuery.ajax({
        url: fileCollectionEndpoint,
        type: "POST",
        data: arrayBuffer,
        processData: false,
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
        }
    })
        .done(function (data, textStatus, jqXHR) {
            console.log("File uploaded;");
            d.resolve(data, textStatus, jqXHR);
        })
        .fail(function (xhr, textStatus, errorThrown) {
            //converting to one string error message
            console.log("Failed to upload file to folder: " + xhr.responseText + "; fileName=" + fileName + "; serverUrl=" + serverUrl + "; relUrl=" + serverRelativeUrlToFolder);
            d.reject("Failed to upload file to folder: "+xhr.responseText);
        });
    return d.promise();
}

//deferred version for executeQueryAsync method. Returns error as string.
function executeQueryAsyncDeferred(context, errMessage) {
    var d = $.Deferred();
    context.executeQueryAsync(function () {
        d.resolve();
    }, function (s, a) {
        if (errMessage)
            d.reject(errMessage +"; "+ a.get_message() + '\n' + a.get_stackTrace());
        else
            d.reject(a.get_message() + '\n' + a.get_stackTrace());
        });
    return d.promise();
}
// Get the local file as an array buffer.
function getFileBuffer(i, fileInput) {
    var d = jQuery.Deferred();
    var reader = new FileReader();
    reader.onloadend = function (e) {
        d.resolve(e.target.result, i);
    }
    reader.onerror = function (e) {
        d.reject(e.target.error);
    }
    reader.readAsArrayBuffer(fileInput[0].files[i]);
    return d.promise();
}

function getLinkToDocumentByteArray() {
    var d = jQuery.Deferred();
    var reader = new FileReader();
    reader.onloadend = function (e) {
        d.resolve(e.target.result);
    }
    reader.onerror = function (e) {
        d.reject(e.target.error);
    }
    reader.readAsArrayBuffer(new Blob(["<%@ Assembly Name='Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c' %>\r\n <%@ Register TagPrefix='SharePoint' Namespace='Microsoft.SharePoint.WebControls' Assembly='Microsoft.SharePoint' %>\r\n <%@ Import Namespace='System.IO' %>\r\n <%@ Import Namespace='Microsoft.SharePoint' %>\r\n <%@ Import Namespace='Microsoft.SharePoint.Utilities' %>\r\n <%@ Import Namespace='Microsoft.SharePoint.WebControls' %>\r\n <html>\r\n <head> <meta name='progid' content='SharePoint.Link' /> </head>\r\n <body>\r\n <form id='Form2' runat='server'>\r\n <SharePoint:UrlRedirector id='UrlRedirector1' runat='server' />\r\n </form>\r\n </body>\r\n </html>"], { type: "plain/text" }
    ));
    return d.promise();
}



function getDocumentSetProperties(docSetUrl) {
    var d = $.Deferred();
    var ctx = SP.ClientContext.get_current();
    //get file
    var docSetFolder = ctx.get_web().getFolderByServerRelativeUrl(docSetUrl);
    ctx.load(docSetFolder, 'ListItemAllFields');
    return executeQueryAsyncDeferred(ctx, "Failed to load document set properties").then(function () {
        return $.Deferred().resolve(docSetFolder).promise();
    });    
}

function getListContentType(listName, ctId) {
   
    var ctx = SP.ClientContext.get_current();
    var oList = ctx.get_web().get_lists().getByTitle(listName);
    var ctColl = oList.get_contentTypes();
    ctx.load(ctColl);
    return executeQueryAsyncDeferred(ctx, "Failed to load content types").then(function () {
        var contentTypeEnumerator = ctColl.getEnumerator();
        while (contentTypeEnumerator.moveNext()) {
            var ct = contentTypeEnumerator.get_current();
            if (ct.get_id().toString().startsWith(ctId)) {
                return $.Deferred().resolve(ct.get_id()).promise();                
            }
        }
        return $.Deferred().reject("Cannot find content type " + ctId).promise();
    });   
}

function getFieldChoices(listTitle, fieldInternalName) {    var dfd = $.Deferred();    var context = SP.ClientContext.get_current();    var web = context.get_web();    var list = web.get_lists().getByTitle(listTitle);    var field = list.get_fields().getByInternalNameOrTitle(fieldInternalName);    context.load(field);    context.executeQueryAsync(function () {        var choiceField = context.castTo(field, SP.FieldChoice);        context.load(choiceField)        context.executeQueryAsync(function () {            dfd.resolve(choiceField.get_choices());        }, function (c, e) {            console.warn("getFieldChoices failed to load choices: " + e.get_message())            dfd.reject();        });    }, function (cont, err) {        console.warn("getFieldChoices failed to load choices: " + err.get_message())        dfd.reject();    });    return dfd.promise();};

function getUser(userId) {
    var ctx = new SP.ClientContext.get_current();
    var web = ctx.get_web();

    var dfd = $.Deferred(function () {
        var user = web.get_siteUsers().getById(userId)
        ctx.load(user);
        ctx.executeQueryAsync(
            function () {
                dfd.resolve(user);
            }),
            function () {
                dfd.reject(args.get_message());
            };
    });
    return dfd.promise();
}

function getCurrentUser() {
    ctx = new SP.ClientContext.get_current();
    web = ctx.get_web();

    var dfd = $.Deferred();
    currentUser = web.get_currentUser();
    ctx.load(currentUser);
    ctx.executeQueryAsync(
        function () {
            dfd.resolve(currentUser);
        }),
        function () {
            dfd.reject(args.get_message());
        };
    return dfd.promise();
}
///Gets all list items
function loadListData(listTitle) {
    var deferred = $.Deferred();
    var ctx = new SP.ClientContext();
    var oList = ctx.get_web().get_lists().getByTitle(listTitle);

    var caml = new SP.CamlQuery();
    caml.set_viewXml('View><Query></Query></View>');
    listData = oList.getItems(caml);

    ctx.load(listData);
    ctx.executeQueryAsync(function () {
        deferred.resolve(listData);
    }, function (s, a) {
        deferred.reject(s, a);
    })

    return deferred.promise();
}

///Loads list item based on ID from list
function loadListItem(itemId, listName, properties) {
    var deferred = $.Deferred();
    var ctx = new SP.ClientContext();
    var oList = ctx.get_web().get_lists().getByTitle(listName);
    var item = oList.getItemById(itemId);
    if (properties) {
        ctx.load(item, properties);
    }
    else {
        ctx.load(item);
    }
    ctx.executeQueryAsync(function () {
        deferred.resolve(item);
    }, function (s, a) {
        deferred.reject(s, a);
    });
    return deferred.promise();
}

function deleteListItem(itemId, libTitle) {
    var d = $.Deferred();

    loadListItem(itemId, libTitle).then(function (itemToDelete) {
        itemToDelete.deleteObject();
        itemToDelete.get_context().executeQueryAsync(function () { d.resolve(); }, function (s, a) { d.reject(s, a); });
    });

    return d.promise();
}

function existsListItem(listTitle, caml) {
    var ctx = new SP.ClientContext.get_current();
    var oList = ctx.get_web().get_lists().getByTitle(listTitle);
      
    var query = new SP.CamlQuery();
    query.set_viewXml(caml);
    var items = oList.getItems(query);
    ctx.load(items);

    return executeQueryAsyncDeferred(ctx, "Invalid query").then(function () {
        if (items.get_count() == 0) {
            return $.Deferred().resolve().promise();
        }
        else
            return $.Deferred().reject().promise();
    });   
}

///Parse date based on defined format
function checkDate(dateString) {
    if (dateString) {
        //var timestamp = Date.parse(dateString)
        //if (isNaN(timestamp) == false) {
        //    var d = new Date(timestamp);
        //    return d;
        //}
        var d = moment(dateString, dateFormat).toDate();
        return d;
    }
    return null;
}

///Formats date value based on defined format to string
function getFormatedDate(date) {
    if (date) {
        return moment(date).format(dateFormat);
    }
    return "";
}

function getFormatedDateTime(date) {
    if (date) {
        return moment(date).format(dateTimeFormat);
    }
    return "";
}

function addDays(date, days) {
    if (date) {
        var d = moment(date, dateFormat).toDate();
        return moment(d).add(days, 'd').toDate();
    }
}

function initDateTimePicker(pickerId) {
    return $('#' + pickerId).datetimepicker(
        {
            format: dateFormat,
        });
}

function getDocumentSet(docSetId, docLib) {
    var deferred = $.Deferred();

    var ctx = new SP.ClientContext.get_current();
    var oWeb = ctx.get_web();
    var oList = oWeb.get_lists().getByTitle(docLib);
    ctx.load(oList);
    var oLibraryFolder = oList.get_rootFolder();
    ctx.load(oLibraryFolder);

    var documentSetContentTypeID = docSetId;
    var documentSetContentType = oWeb.get_contentTypes().getById(documentSetContentTypeID);

    ctx.load(documentSetContentType);
    ctx.executeQueryAsync(function () {
        deferred.resolve(documentSetContentType, oLibraryFolder);
    }, function (s, a) {
        deferred.resolve(s, a);
    });

    return deferred.promise();
}

function initializePeoplePicker(peoplePickerElementId, user) {
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = false;
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '280px';

    if (user) {

        var users = new Array(1);
        var defaultUser = new Object();
        defaultUser.AutoFillDisplayText = user.get_title();
        defaultUser.AutoFillKey = user.get_loginName();
        defaultUser.Description = user.get_email();
        defaultUser.DisplayText = user.get_title();
        defaultUser.EntityType = "User";
        defaultUser.IsResolved = true;
        defaultUser.Key = user.get_loginName();
        defaultUser.Resolved = true;
        users[0] = defaultUser;
        SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, users, schema);
    }
    else {
        SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
    }

    //support for bootstrap
    var topSpanKey = peoplePickerElementId + "_TopSpan";
    $("#" + topSpanKey).addClass("form-control").css('width', 'auto');
}
//Inicialize DataTable
function initTable(tableId, data, columns, filter) {
    var jQueryTableId = '#' + tableId;
    var filteredData = data;
    if (filter) {
        filteredData = data.filter(function (index) {
            return index.docType === filter[0];
        });
    }

    clearTable(tableId);

    return $(jQueryTableId).DataTable({
        data: filteredData,
        deferRender: true,
        processing: true,
        columns: columns,
        columnDefs: [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ]
    })
}

//Inicialize DataTable
function clearTable(tableId) {
    var jQueryTableId = '#' + tableId;

    if ($.fn.DataTable.isDataTable(jQueryTableId)) {
        $(jQueryTableId).DataTable().destroy();
    }
}

function destoyTable(tableId) {
    var jQueryTableId = '#' + tableId;
    if ($.fn.DataTable.isDataTable(jQueryTableId)) {
        var table = $(jQueryTableId).DataTable();
        table.clear();
        table.draw();
    }
}

function selectTableRow(current, table) {
    var row = $(current).closest('tr');
    var data;
    if (row) {
        table.$('tr.selected').removeClass('selected');
        row.addClass('selected');
        data = table.row('.selected').data();
    }
    return data;
}

function setTwoNumberDecimal(event) {
    this.value = parseFloat(this.value).toFixed(2);
}



//**** START Loading and messages ****//

function buttonStartLoading(buttonId) {
    $('#' + buttonId).addClass("disabled")
    $('#' + buttonId + " i").addClass("fa fa-spinner fa-spin")
}

function buttonStopLoading(buttonId) {
    $('#' + buttonId).removeClass("disabled")
    $('#' + buttonId + " i").removeClass("fa fa-spinner fa-spin")
}

function succeedMessage(messageId, message) {
    $("#" + messageId).empty()
    $("#" + messageId).append("<div class=\"alert alert-success\">" + message + "</div>")
}

function failedMessage(messageId, message) {
    loadingFinish();
    $("#" + messageId).empty()
    $("#" + messageId).append("<div class=\"alert alert-danger\">" + message + "</div>")
}

function loadingStart() {
    if (($("#loadingModal").data('bs.modal') || {}).isShown !== true) {
        $('#loadingModal').modal({
            keyboard: false,
            focus: true,
        })
        $('#loadingModal').modal('show');
    }
}

function loadingFinish() {
    $('#loadingModal').modal('hide');
}

function IsFormValid(formId) {
    var validator = $("#" + formId).data("bs.validator");
    validator.validate();
    return !validator.hasErrors();
}

function ClearFormErrors(formId) {
    var validator = $("#" + formId).data("bs.validator");
    validator.clearErrorsAll();
}

function IsPeoplePickerEmpty(peoplePicker) {
     
    var users = peoplePicker.GetAllUserInfo();
    if (users && users.length > 0) {
        return false
    }
    else 
        return true;
}




function loadFileAsByteArray(file) {
    var dfd = $.Deferred();
    var fr = new FileReader();
    fr.onload = function (e) {
        dfd.resolve(e.target.result);
    };
    fr.readAsArrayBuffer(file, "UTF-8");
    return dfd.promise();
}
//**** END Loading and messages ****//