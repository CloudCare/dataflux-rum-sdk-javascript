"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocumentTraceId = getDocumentTraceId;
exports.getDocumentTraceDataFromMeta = getDocumentTraceDataFromMeta;
exports.getDocumentTraceDataFromComment = getDocumentTraceDataFromComment;
exports.createDocumentTraceData = createDocumentTraceData;
exports.findTraceComment = findTraceComment;
exports.INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD = void 0;

var _tools = require("../../helper/tools");

var INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD = 2 * _tools.ONE_MINUTE;
exports.INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD = INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD;

function getDocumentTraceId(document) {
  var data = getDocumentTraceDataFromMeta(document) || getDocumentTraceDataFromComment(document);

  if (!data || data.traceTime <= Date.now() - INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD) {
    return undefined;
  }

  return data.traceId;
}

function getDocumentTraceDataFromMeta(document) {
  var traceIdMeta = document.querySelector('meta[name=df-trace-id]');
  var traceTimeMeta = document.querySelector('meta[name=df-trace-time]');
  return createDocumentTraceData(traceIdMeta && traceIdMeta.content, traceTimeMeta && traceTimeMeta.content);
}

function getDocumentTraceDataFromComment(document) {
  var comment = findTraceComment(document);

  if (!comment) {
    return undefined;
  }

  return createDocumentTraceData((0, _tools.findCommaSeparatedValue)(comment, 'trace-id'), (0, _tools.findCommaSeparatedValue)(comment, 'trace-time'));
}

function createDocumentTraceData(traceId, rawTraceTime) {
  var traceTime = rawTraceTime && Number(rawTraceTime);

  if (!traceId || !traceTime) {
    return undefined;
  }

  return {
    traceId: traceId,
    traceTime: traceTime
  };
}

function findTraceComment(document) {
  // 1. Try to find the comment as a direct child of the document
  // Note: TSLint advises to use a 'for of', but TS doesn't allow to use 'for of' if the iterated
  // value is not an array or string (here, a NodeList).
  // tslint:disable-next-line: prefer-for-of
  for (var i = 0; i < document.childNodes.length; i += 1) {
    var comment = getTraceCommentFromNode(document.childNodes[i]);

    if (comment) {
      return comment;
    }
  } // 2. If the comment is placed after the </html> tag, but have some space or new lines before or
  // after, the DOM parser will lift it (and the surrounding text) at the end of the <body> tag.
  // Try to look for the comment at the end of the <body> by by iterating over its child nodes in
  // reverse order, stoping if we come accross a non-text node.


  if (document.body) {
    for (var i = document.body.childNodes.length - 1; i >= 0; i -= 1) {
      var node = document.body.childNodes[i];
      var comment = getTraceCommentFromNode(node);

      if (comment) {
        return comment;
      }

      if (!isTextNode(node)) {
        break;
      }
    }
  }
}

function getTraceCommentFromNode(node) {
  if (node && isCommentNode(node)) {
    var match = node.data.match(/^\s*DATADOG;(.*?)\s*$/);

    if (match) {
      return match[1];
    }
  }
}

function isCommentNode() {
  return node.nodeName === '#comment';
}

function isTextNode(node) {
  return node.nodeName === '#text';
}