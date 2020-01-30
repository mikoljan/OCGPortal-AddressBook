<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AddressBookViewForm.aspx.cs" Inherits="OCGportal.AddressBook.Layouts.OCGportal.AddressBook.AddressBookViewForm" DynamicMasterPageFile="~masterurl/default.master" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="/_layouts/15/OCGportal.AddressBook/js/libs/require.js" data-main="/_layouts/15/OCGportal.AddressBook/js/userViewFormViewModel"></script>
    <script type="text/javascript" src="/_layouts/15/OCGportal.AddressBook/js/require.config.js"></script>
    
    <link href="/_layouts/15/OCGportal.AddressBook/css/libs/bootstrap.min.css" rel="stylesheet" />
    <link href="/_layouts/15/OCGportal.AddressBook/css/jqueryui/jquery-ui.min.css" rel="stylesheet" />
    <link href="/_layouts/15/OCGportal.AddressBook/css/libs/fileinput.min.css" rel="stylesheet" type="text/css"/>
    <link href="/_layouts/15/OCGportal.AddressBook/css/libs/font-awesome.min.css" rel="stylesheet" type="text/css"/> 
    <link href="/_layouts/15/OCGportal.AddressBook/css/addressBook.css" rel="stylesheet" />
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class ="container-fluid">
        <div class="row d-flex justify-content-start" style="margin-top:20px; padding-right: 25px">
            <div style="text-align: right; position: relative; " >
                <button type="button" class="btn btn-success" data-bind="click: edit, visible: canEdit" style="display:none">Edit</button>
                <button type="button" data-bind="click: closeForm" class="btn btn-secondary" >Close</button>
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

        <div class="container-fluid" style="display:none" data-bind="visible: isInitialized">
            <div class="row">
                <div class="form-group col-3">
                    <!-- ko if: imagePath -->
                        <img id="UserPicID" data-bind="attr:{src: imagePath}" class="img-fluid" alt="User" />
                    <!-- /ko -->
                    <!-- ko ifnot: imagePath -->
                        <img id="UserPicID" src="/_layouts/15/OCGportal.AddressBook/css/img/user-default.jpg" class="img-fluid" alt="User" />
                    <!-- /ko -->
                    <br />
                    <br />
                </div>
                <div class="form-group col-9">
                    <h4 class="text-left">Identifiers</h4>
                    <hr />
                    <div class="row">
                        <div class="form-group col-6">
                            <label for="fullName">Full Name</label>
                            <input type="text" class="form-control custom-view-label" id="fullName" data-bind="value: fullName" disabled/>
                        </div>
                        <div class="form-group col-6">
                            <label for="status">Status</label>
                            <input type="text" class="form-control custom-view-label" id="status" data-bind="value: status" disabled/>
                        </div>
                    </div>


                    <h4 class="text-left">Personal</h4>
                    <hr />
                    <div class="row">
                        <div class="form-group col-2">
                            <label for="salutation">Salutation</label>
                            <input type="text" class="form-control custom-view-label" id="salutation" data-bind="value: salutation" disabled/>
                        </div>
                        <div class="form-group col-5">
                            <label for="fullName">Name</label>
                            <input type="text" class="form-control custom-view-label" id="name" data-bind="value: name" disabled/>
                        </div>
                        <div class="form-group col-5">
                            <label for="fullName">Surname</label>
                            <input type="text" class="form-control custom-view-label" id="surname" data-bind="value: surname" disabled/>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3">
                            <label for="degree">Degree</label>
                            <input type="text" class="form-control custom-view-label" id="degree" data-bind="value: degree" disabled/>
                        </div>      
                        <div class="form-group col-6">
                            <label for="employeeNo">Employee No</label>
                            <input type="text" class="form-control custom-view-label" id="employeeNo" data-bind="value: employeeNo" disabled/>
                        </div>
                        <div class="form-group col-3">
                            <input type="text" class="form-control custom-view-label" id="birthDate" data-bind="value: birthDateFormated" style="display:none" disabled/>
                        </div>
                    </div>
                </div>
            </div>

            <h4 class="text-left">Employment</h4>
            <hr />
            <div class="row">
                <div class="form-group col-6">
                    <label for="startDate">Start Date</label>
                    <input type="text" class="form-control custom-view-label" id="startDate" data-bind="value: startDateFormated" disabled/>
                </div>
                <div class="form-group col-6">
                    <label for="endDate">End Date</label>
                    <input type="text" class="form-control custom-view-label" id="endDate" data-bind="value: endDateFormated" disabled/>
                </div>
            </div>

            <div class="row">
                <div class="form-group col-4">
                    <label for="company">Company</label>
                    <input type="text" class="form-control custom-view-label" id="company" data-bind="value: company" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="division">Division</label>
                    <input type="text" class="form-control custom-view-label" id="division" data-bind="value: division" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="costCenter">Cost Center</label>
                    <input type="text" class="form-control custom-view-label" id="costCenter" data-bind="value: costCenter" disabled/>
                </div>
            </div>

            <div class="row">
                <div class="form-group col-4">
                    <label for="superior">Superior</label>
                    <input type="text" class="form-control custom-view-label" id="superior" data-bind="value: superior" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="jobTitle">Job Title</label>
                    <input type="text" class="form-control custom-view-label" id="jobTitle" data-bind="value: jobTitle" disabled/>
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
                    <input type="text" class="form-control custom-view-label" id="location" data-bind="value: location" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="floor">Floor</label>
                    <input type="text" class="form-control custom-view-label" id="floor" data-bind="value: floor" disabled/>
                    </select>
                </div>
                <div class="form-group col-4">
                    <label for="building">Building</label>
                    <input type="text" class="form-control custom-view-label" id="building" data-bind="value: building" disabled/>
                </div>
            </div>

            <h4 class="text-left">Technical Info</h4>
            <hr />
            <div class="row">
                <div class="form-group col-5">
                    <label for="phone">Phone</label>
                    <input type="text" class="form-control custom-view-label" id="phone" data-bind="value: phone" disabled/>
                </div>
                <div class="form-group col-5">
                    <label for="mobilePhone">Mobile Phone</label>
                    <input type="text" class="form-control custom-view-label" id="mobilePhone" data-bind="value: mobilePhone" disabled/>
                </div>
                <div class="form-group col-2">
                    <label for="line">Line</label>
                    <input type="text" class="form-control custom-view-label" id="line" data-bind="value: line" disabled/>
                </div>
            </div>

            <div class="row">
                <div class="form-group col-4">
                    <label for="otherPhone">Other Phone</label>
                    <input type="text" class="form-control custom-view-label" id="otherPhone" data-bind="value: otherPhone" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="networkAccount">Network Account</label>
                    <input type="text" class="form-control custom-view-label" id="networkAccount" data-bind="value: networkAccount" disabled/>
                </div>
                <div class="form-group col-4">
                    <label for="LDAPname">LDAP name</label>
                    <input type="text" class="form-control custom-view-label" id="LDAPname" data-bind="value: LDAPname" disabled/>
                </div>
            </div>
        
            <div class="row">
                <div class="form-group col-6">
                    <h4 class="text-left">Other</h4>
                    <hr />
                    <label for="other">Other</label>
                    <textarea class="form-control custom-view-label" style="resize: none" id="other" name="story" rows="5" data-bind="value: other" disabled></textarea>
                    <br />
                    <label>
                        <a data-bind="attr: {href: equipmentLink}">
                            Equipment Usage Report
                        </a>
                    </label>
                </div>
                <div class="form-group col-6">
                    <h4 class="text-left">Internal usage</h4>
                    <hr />
                    <div class="form-group row col-11">
                        <label for="displayBirthday">Display Birthday</label>
                        <input type="text" class="form-control custom-view-label" id="displayBirthday" data-bind="value: displayBirthday" disabled/>
                    </div>
                    <div class="form-group row col-11">
                        <label for="annualDialog">Annual Dialog</label>
                        <input type="text" class="form-control custom-view-label" id="annualDialog" data-bind="value: annualDialog" disabled/>
                    </div>
                    <div class="form-group row col-11">
                        <label for="SSFid">SSF ID</label>
                        <input type="text" class="form-control custom-view-label" id="SSFid" data-bind="value: SSFid" disabled/>
                    </div>
                </div>
            </div>
        

            <div class="row d-flex justify-content-end" style="margin-top:20px; padding-right: 25px">
                <div style="text-align: right; position: relative; " >
                    <button type="button" class="btn btn-success" data-bind="click: edit, visible: canEdit" style="display:none">Edit</button>
                    <button type="button" data-bind="click: closeForm" class="btn btn-secondary" >Close</button>
                </div>
            </div>

        </div>        
        
    </div>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
Address Book - View Form
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server" >
</asp:Content>
