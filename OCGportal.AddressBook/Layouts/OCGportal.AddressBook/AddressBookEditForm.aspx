<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AddressBookEditForm.aspx.cs" Inherits="OCGportal.AddressBook.Layouts.OCGportal.AddressBook.AddressBookEditForm" DynamicMasterPageFile="~masterurl/default.master" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="/_layouts/15/OCGportal.AddressBook/js/libs/require.js" data-main="/_layouts/15/OCGportal.AddressBook/js/userEditFormViewModel"></script>
    <script type="text/javascript" src="/_layouts/15/OCGportal.AddressBook/js/require.config.js"></script>
    
    <link href="/_layouts/15/OCGportal.AddressBook/css/libs/bootstrap.min.css" rel="stylesheet" />
    <link href="/_layouts/15/OCGportal.AddressBook/css/jqueryui/jquery-ui.min.css" rel="stylesheet" />
    <link href="/_layouts/15/OCGportal.AddressBook/css/libs/fileinput.min.css" rel="stylesheet" type="text/css"/>
    <link href="/_layouts/15/OCGportal.AddressBook/css/libs/font-awesome.min.css" rel="stylesheet" type="text/css"/> 
    <link href="/_layouts/15/OCGportal.AddressBook/css/addressBook.css" rel="stylesheet" />
    <link href="/_layouts/15/OCGportal.AddressBook/css/validator.css" rel="stylesheet" />
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class ="container-fluid">
        <div class="row d-flex justify-content-start" style=" margin-top:20px; padding-right: 25px" >
            <div style="text-align: right; position: relative; display:none;" data-bind="visible: isInitialized">
                <button type="button" data-bind="click: save, hidden: saving" class="btn btn-success">Save</button>
                <button class="btn-primary btn " type="button" data-bind="visible: saving" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Saving...
                </button>
                <button type="button" data-bind="click: closeForm, hidden: saving" class="btn btn-secondary" >Close</button>
            </div>
        </div>
        <span style='color: rgb(5, 86, 167); font-family: "Century Gothic","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 24pt;' rtenodeid="6">Address Book</span><img src="/_layouts/15/OCGportal.AddressBook/css/img/Olympus Logo - M.jpg" class="float-right" alt="Olympus logo" style="height:40px; width:210px" />
        <br />
        <br />


        <div class="sk-circle" data-bind="hidden: isInitialized">
          <div class="sk-circle1 sk-child"></div>
          <div class="sk-circle2 sk-child"></div>
          <div class="sk-circle3 sk-child"></div>
          <div class="sk-circle4 sk-child"></div>
          <div class="sk-circle5 sk-child"></div>
          <div class="sk-circle6 sk-child"></div>
          <div class="sk-circle7 sk-child"></div>
          <div class="sk-circle8 sk-child"></div>
          <div class="sk-circle9 sk-child"></div>
          <div class="sk-circle10 sk-child"></div>
          <div class="sk-circle11 sk-child"></div>
          <div class="sk-circle12 sk-child"></div>
        </div>

        <div id="AddressBookForm" class="container-fluid" style="display:none" data-bind="visible: isInitialized">
            <div class="row">
                <div class="form-group col-3">
                    <!-- ko if: imagePath -->
                        <img id="UserPicID" data-bind="attr:{src: imagePath}" class="img-fluid" alt="User" />
                    <!-- /ko -->
                    <!-- ko ifnot: imagePath -->
                        <img id="UserPicID" src="/_layouts/15/OCGportal.AddressBook/css/img/user-default.jpg" class="img-fluid" alt="User" />
                    <!-- /ko -->
                    <br />
                    <label style="color:red" data-bind="visible: isJPG">File must be format JPG</label>
                    <br />
                    <label data-bind="text: userPicName"></label>
                    <br />
                    <div class="float-left">
                        <input type="file" id="selectedFile" style="display: none;" data-bind="event: { change: updateFileName }"/>
                        <button type="button" class="btn btn-secondary btn-sm " onclick="document.getElementById('selectedFile').click();" data-bind="visible: isEditMode" >Browse...</button>
                    </div>
                    <div class="float-right">
                        <button type="button" class="btn btn-secondary btn-sm " data-bind="click: uploadImage, visible: canUpload">Upload</button>
                    </div>
                </div>
                <div class="form-group col-9">
                    <h4 class="text-left">Identifiers</h4>
                    <hr />
                    <div class="row">
                        <div class="form-group col-6">
                            <label for="fullName">Full Name</label>
                            <input required type="text" class="form-control" id="fullName" placeholder="Full Name" data-bind="value: fullName" data-error="Full name is a required field!"/>
                            <div class="help-block with-errors"></div>
                        </div>
                        <div class="form-group col-6">
                            <label for="status">Status</label>
                            <select id="status" class="form-control" data-bind="options: availableStatus, value: status"></select>
                        </div>
                    </div>


                    <h4 class="text-left">Personal</h4>
                    <hr />
                    <div class="row">
                        <div class="form-group col-2">
                            <label for="salutation">Salutation</label>
                            <select id="salutation" class="form-control" data-bind="options: availableSalutation, value: salutation"></select>
                        </div>
                        <div class="form-group col-5">
                            <label for="fullName">Name</label>
                            <input type="text" class="form-control" id="name" placeholder="Name" data-bind="value: name"/>
                        </div>
                        <div class="form-group col-5">
                            <label for="fullName">Surname</label>
                            <input type="text" class="form-control" id="surname" placeholder="Surname" data-bind="value: surname"/>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3">
                            <label for="degree">Degree</label>
                            <select type="text" id="degree" class="form-control multiselect multiselect-icon" multiple="multiple" role="multiselect" data-bind="options: availableDegree, selectedOptions: degree"></select> 
                        </div>      
                        <div class="form-group col-6">
                            <label for="employeeNo">Employee No</label>
                            <input type="text" class="form-control" id="employeeNo" placeholder="Employee Number" data-bind="value: employeeNo" data-uniqueempno data-uniqueempno-error="This Employee number already exist!"/>
                            <div class="help-block with-errors"></div>
                        </div>
                        <div class="form-group col-3">
                            <label for="birthDate">Birth Date</label>
                            <input type="text" id="birthDate" class="form-control" data-bind="datepicker: birthDate"/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row justify-content-between">
                <div class="col-4">
                    <h4 class="text-left">Employment</h4> 
                </div>
                <div class="col-4" style="text-align: right; position: relative; ">
                    <button type="button" class="btn btn-primary" data-bind="click: loadModal,  hidden: modalLoading">Edit Lookups</button> 
                    <button class="btn-primary btn " type="button" data-bind="visible: modalLoading" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="form-group col-6">
                    <label for="startDate">Start Date</label>
                    <input type="text" class="form-control" id="startDate" placeholder="Start Date" data-bind="datepicker: startDate"/>
                </div>
                <div class="form-group col-6">
                    <label for="endDate">End Date</label>
                    <input type="text" class="form-control" id="endDate" placeholder="End Date" data-bind="datepicker: endDate"/>
                </div>
            </div>

            <div class="row">
                <div class="form-group col-4">
                    <label for="company">Company</label>
                    <input type="text" class="form-control custom-view-label" id="company" data-bind="value: companyText" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="division">Division</label>
                    <input type="text" class="form-control custom-view-label" id="division" data-bind="value: divisionText" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="costCenter">Cost Center</label>
                    <input type="text" class="form-control custom-view-label" id="costCenter" data-bind="value: costCenterText" disabled/>
                </div>
            </div>

            <div class="row">
                <div class="form-group col-4">
                    <label for="superior">Superior</label>
                    <input type="text" class="form-control custom-view-label" id="superior" data-bind="value: superiorText" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="jobTitle">Job Title</label>
                    <input type="text" class="form-control custom-view-label" id="jobTitle" data-bind="value: jobTitleText" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="jobTitleCategory">Job Title Category</label>
                    <input type="text" class="form-control custom-view-label" id="jobTitleCategory" data-bind="value: jobTitleCategory" disabled/>
                </div>
            </div>

            <h4 class="text-left">Locality</h4>
            <hr />
            <div class="row">
                <div class="form-group col-4"> 
                    <label for="location">Location</label>
                    <select id="location" class="form-control" data-bind="options: availableLocation, value: location, optionsText: 'title', optionsValue: 'id'"></select>
                </div>
                <div class="form-group col-4">
                    <label for="floor">Floor</label>
                    <select id="floor" class="form-control" data-bind="options: availableFloor, value: floor">
                    </select>
                </div>
                <div class="form-group col-4">
                    <label for="building">Building</label>
                    <input type="text" class="form-control" id="building" placeholder="Building" data-bind="value: building"/>
                </div>
            </div>

            <h4 class="text-left">Technical Info</h4>
            <hr />
            <div class="row">
                <div class="form-group col-5">
                    <label for="phone">Phone</label>
                    <input type="text" class="form-control" id="phone" placeholder="Phone" data-bind="value: phone"/>
                </div>
                <div class="form-group col-5">
                    <label for="mobilePhone">Mobile Phone</label>
                    <input type="text" class="form-control" id="mobilePhone" placeholder="Mobile Phone" data-bind="value: mobilePhone"/>
                </div>
                <div class="form-group col-2">
                    <label for="line">Line</label>
                    <input type="text" class="form-control" id="line" placeholder="Line" data-bind="value: line"/>
                </div>
            </div>

            <div class="row">
                <div class="form-group col-4">
                    <label for="otherPhone">Other Phone</label>
                    <input type="text" class="form-control" id="otherPhone" placeholder="Other Phone" data-bind="value: otherPhone"/>
                </div>
                <div class="form-group col-4">
                    <label for="networkAccount">Network Account</label>
                    <div id="networkAccount" style="width: auto; height: auto" data-bind="clientPeoplePicker: { data: networkAccount, options: { AllowMultipleValues: false } }"></div>
                    <!--<input type="text" class="form-control" id="networkAccount" placeholder="Network Account" data-bind="clientPeoplePicker: { data: networkAccount, options: { AllowMultipleValues: false } }"/> -->
                </div>
                <div class="form-group col-4">
                    <label for="LDAPname">LDAP name</label>
                    <input type="text" class="form-control" id="LDAPname" placeholder="LDAP name" data-bind="value: LDAPname"/>
                </div>
            </div>
        
            <div class="row">
                <div class="form-group col-6">
                    <h4 class="text-left">Other</h4>
                    <hr />
                    <label for="other">Other</label>
                    <textarea class="form-control" id="other" style="resize: none" placeholder="Notes..." name="story" rows="5" data-bind="value: other"></textarea>
                    <br />
                    <label>
                        <a data-bind="visible: isEditMode, attr: {href: equipmentLink}">
                            Equipment Usage Report
                        </a>
                    </label>
                </div>
                <div class="form-group col-6">
                    <h4 class="text-left">Internal usage</h4>
                    <hr />
                    <div class="form-check">
                        <label class="form-check-label col-6" for="displayBirthday">Display Birthday</label>
                        <input class="form-check-input col-2" type="checkbox" value="" id="displayBirthday" data-bind="checked: displayBirthday" />
                    </div>
                    <div class="form-check">
                        <label class="form-check-label col-6" for="annualDialog">Annual Dialog</label>
                        <input class="form-check-input col-2" type="checkbox" value="" id="annualDialog" data-bind="checked: annualDialog"/>
                    </div>
                    <br />
                    <div class="form-group row justify-content-center">
                        <div class="col-11">
                            <label for="SSFid">SSF ID</label>
                            <input type="text" class="form-control" id="SSFid" placeholder="SSF ID" data-bind="value: SSFid"  data-uniquessfid data-uniquessfid-error="This SSF ID already exist!"/>
                            <div class="help-block with-errors"></div>
                        </div>
                    </div>
                </div>
            </div>
        

            <div class="row d-flex justify-content-end" style="margin-top:20px; padding-right: 25px">
                <div style="text-align: right; position: relative; " >
                    <button type="button" data-bind="click: save, hidden: saving" class="btn btn-success">Save</button>
                    <button class="btn-primary btn " type="button" data-bind="visible: saving" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Saving...
                    </button>
                    <button type="button" data-bind="click: closeForm, hidden: saving" class="btn btn-secondary" >Close</button>
                </div>
            </div>
        </div>

        
        
    </div>

    <div class="modal fade bd-example-modal-lg" id="employmentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle" style="margin-left: 0px">Employment</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="row">
                        <div class="form-group col-4">
                            <label for="company">Company</label>
                            <select id="company" class="form-control" data-bind="options: availableCompany, value: company, readSelectedText: companyText, optionsText: 'title', optionsValue: 'id'" ></select>
                        </div>
                        <div class="form-group col-4">
                            <label for="division">Division</label>
                            <select id="division" class="form-control" data-bind="options: availableDivision, value: division, readSelectedText: divisionText, optionsText: 'title', optionsValue: 'id'"></select>
                        </div>
                        <div class="form-group col-4">
                            <label for="costCenter">Cost Center</label>
                            <select id="costCenter" class="form-control" data-bind="options: availableCostCenter, value: costCenter, readSelectedText: costCenterText, optionsText: 'title', optionsValue: 'id'"></select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="form-group col-4">
                            <label for="superior">Superior</label>
                            <select id="superior" class="form-control" data-bind="options: availableSuperior, value: superior, readSelectedText: superiorText, optionsText: 'title', optionsValue: 'id'"></select>
                        </div>
                        <div class="form-group col-4">
                            <label for="jobTitle">Job Title</label>
                            <select id="jobTitle" class="form-control" data-bind="options: availableJobTitle, value: jobTitle, readSelectedText: jobTitleText, optionsText: 'title', optionsValue: 'id'"></select>
                        </div>
                        <div class="form-group col-4">
                            <label for="jobTitleCategory">Job Title Category</label>
                            <select id="jobTitleCategory" class="form-control" data-bind="options: availableJobTitleCategory, value: jobTitleCategory" ></select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
Address Book - Edit Form
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server" >
</asp:Content>
