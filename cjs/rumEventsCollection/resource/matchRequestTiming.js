"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchRequestTiming = matchRequestTiming;

var _resourceUtils = require("./resourceUtils");

var _tools = require("../../helper/tools");

/**
 * Look for corresponding timing in resource timing buffer
 *
 * Observations:
 * - Timing (start, end) are nested inside the request (start, end)
 * - Browsers generate a timing entry for OPTIONS request
 *
 * Strategy:
 * - from valid nested entries
 * - if a single timing match, return the timing
 * - if two following timings match (OPTIONS request), return the timing for the actual request
 * - otherwise we can't decide, return undefined
 */
function matchRequestTiming(request) {
  if (!performance || !('getEntriesByName' in performance)) {
    return;
  }

  var sameNameEntries = performance.getEntriesByName(request.url, 'resource');

  if (!sameNameEntries.length || !('toJSON' in sameNameEntries[0])) {
    return;
  }

  var candidates = (0, _tools.map)(sameNameEntries, function (entry) {
    return entry.toJSON();
  });
  candidates = (0, _tools.filter)(candidates, _resourceUtils.toValidEntry);
  candidates = (0, _tools.filter)(candidates, function (entry) {
    return isBetween(entry, request.startTime, endTime(request));
  });

  if (candidates.length === 1) {
    return candidates[0];
  }

  if (candidates.length === 2 && firstCanBeOptionRequest(candidates)) {
    return candidates[1];
  }

  return;
}

function firstCanBeOptionRequest(correspondingEntries) {
  return endTime(correspondingEntries[0]) <= correspondingEntries[1].startTime;
}

function endTime(timing) {
  return timing.startTime + timing.duration;
}

function isBetween(timing, start, end) {
  return timing.startTime >= start && endTime(timing) <= end;
}