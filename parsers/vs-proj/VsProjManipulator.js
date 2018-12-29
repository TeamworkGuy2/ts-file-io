"use strict";
var FileSectionManipulator = require("../FileSectionManipulator");
/**
 * @author TeamworkGuy2
 * @since 2015-8-11
 */
var VsProjManipulator = /** @class */ (function () {
    function VsProjManipulator(vsProjFilePath, webConfigFilePath) {
        this.vsProjFileManipulator = FileSectionManipulator.loadFile(vsProjFilePath, [["<ItemGroup>", "</ItemGroup>"]]);
        this.webConfigFileManipulator = FileSectionManipulator.loadFile(webConfigFilePath, [["<serviceActivations>", "</serviceActivations>"], ["<services>", "</services>"]]);
    }
    VsProjManipulator.prototype.getProjFileSections = function () {
        return this.vsProjFileManipulator.getSections();
    };
    VsProjManipulator.prototype.getWebConfigFileSections = function () {
        return this.webConfigFileManipulator.getSections();
    };
    VsProjManipulator.prototype.addTypeScriptCompile = function (fileRelativePath) {
        this.vsProjFileManipulator.addSectionLines("TypeScriptCompile", ['    <TypeScriptCompile Include="' + fileRelativePath + '" />']);
    };
    VsProjManipulator.prototype.addCsClass = function (fileRelativePath) {
        this.vsProjFileManipulator.addSectionLines("Compile", ['    <Compile Include="' + fileRelativePath + '" />']);
    };
    VsProjManipulator.prototype.addServiceNamespace = function (projectNamespaceName, serviceImplNamespace, serviceInterfacePathNamespace, serviceWebAddressPath) {
        this.addService(VsProjManipulator.replaceAll(serviceImplNamespace, ".", "\\"), serviceImplNamespace.substr(projectNamespaceName.length + 1), VsProjManipulator.replaceAll(serviceInterfacePathNamespace, ".", "\\"), serviceInterfacePathNamespace.substr(projectNamespaceName.length + 1), serviceWebAddressPath);
    };
    VsProjManipulator.prototype.addService = function (serviceImplPath, serviceImplNamespace, serviceInterfacePath, serviceInterfacePathNamespace, serviceWebAddressPath) {
        var serviceActivationsLines = ['        <add service="' + serviceImplNamespace + '" factory="System.ServiceModel.Activation.WebServiceHostFactory" relativeAddress="' + serviceWebAddressPath + '" />'];
        var serviceEndpointLines = [
            '    <service name="' + serviceImplNamespace + '" behaviorConfiguration="serviceBehaviour">',
            '      <endpoint address="" binding="webHttpBinding" bindingConfiguration="webHttpBinding" behaviorConfiguration="webHttpBehavior" contract="' + serviceInterfacePathNamespace + '" />',
            '    </service>'
        ];
        this.webConfigFileManipulator.addSectionLines("serviceActivations", serviceActivationsLines);
        this.webConfigFileManipulator.addSectionLines("services", serviceEndpointLines);
        this.addCsClass(serviceImplPath);
        this.addCsClass(serviceInterfacePath);
    };
    VsProjManipulator.prototype.saveProjectFiles = function (vsProjFilePath, webConfigFilePath) {
        this.webConfigFileManipulator.saveFile(webConfigFilePath);
        this.vsProjFileManipulator.saveFile(vsProjFilePath);
    };
    // copied from ts-mortar
    VsProjManipulator.replaceAll = function (str, find, replace) {
        return str.split(find).join(replace);
    };
    return VsProjManipulator;
}());
module.exports = VsProjManipulator;
