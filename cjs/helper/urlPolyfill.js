"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeUrl = normalizeUrl;
exports.isValidUrl = isValidUrl;
exports.haveSameOrigin = haveSameOrigin;
exports.getOrigin = getOrigin;
exports.getPathName = getPathName;
exports.getSearch = getSearch;
exports.getHash = getHash;
exports.buildUrl = buildUrl;

var _tools = require("./tools");

function normalizeUrl(url) {
  return buildUrl(url, (0, _tools.getLocationOrigin)()).href;
}

function isValidUrl(url) {
  try {
    return !!buildUrl(url);
  } catch (e) {
    return false;
  }
}

function haveSameOrigin(url1, url2) {
  return getOrigin(url1) === getOrigin(url2);
}

function getOrigin(url) {
  return (0, _tools.getLinkElementOrigin)(buildUrl(url));
}

function getPathName(url) {
  var pathname = buildUrl(url).pathname;
  return pathname[0] === '/' ? pathname : '/' + pathname;
}

function getSearch(url) {
  return buildUrl(url).search;
}

function getHash(url) {
  return buildUrl(url).hash;
}

function buildUrl(url, base) {
  if (checkURLSupported()) {
    return base !== undefined ? new URL(url, base) : new URL(url);
  }

  if (base === undefined && !/:/.test(url)) {
    throw new Error('Invalid URL: ' + url);
  }

  var doc = document;
  var anchorElement = doc.createElement('a');

  if (base !== undefined) {
    doc = document.implementation.createHTMLDocument('');
    var baseElement = doc.createElement('base');
    baseElement.href = base;
    doc.head.appendChild(baseElement);
    doc.body.appendChild(anchorElement);
  }

  anchorElement.href = url;
  return anchorElement;
}

var isURLSupported;

function checkURLSupported() {
  if (isURLSupported !== undefined) {
    return isURLSupported;
  }

  try {
    var url = new URL('http://test/path');
    isURLSupported = url.href === 'http://test/path';
    return isURLSupported;
  } catch (e) {
    isURLSupported = false;
  }

  return isURLSupported;
}