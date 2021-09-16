'use strict';

// Copyright John McLear - Etherpad Foundation 2020, Apache2.
const padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;
window.Diff = require('./diff.min');

exports.postAceInit = () => {
  // what's on the server
  const padId = clientVars.padId;
  const padRev = clientVars.collab_client_vars.rev;

  // do we have a local copy?
  const lastVisitRev = padcookie.getPref(`ep_what_have_i_missed:${padId}`);
  if (lastVisitRev) {
    clientVars.lastVisitRev = lastVisitRev;
    // console.log("padRev", padRev)
    // console.log("lastVisitRev", lastVisitRev)
    if (padRev > (lastVisitRev + 2)) {
      catchUpMessage(lastVisitRev);
    }
  }
  buttonListeners();
};

const buttonListeners = () => {
  $('.catchUpButton').on('click', () => {
    // show Differential
    showDiff(clientVars.padId, clientVars.lastVisitRev, clientVars.collab_client_vars.rev);
    console.warn(clientVars.padId, clientVars.lastVisitRev);
  });
};
/* global Diff */

const showDiff = (padId, lastVisitRev) => {
  // load latest
  const latestText = clientVars.collab_client_vars.initialAttributedText.text;
  const lastVisitTextURI = `${window.location}/${lastVisitRev}/export/txt`;
  $.get(lastVisitTextURI, (lastVisitText) => {
    const diff = Diff.diffChars(lastVisitText, latestText);
    const display = document.getElementById('diffDisplay');
    const fragment = document.createDocumentFragment();
    diff.forEach((part) => {
      // green for additions, red for deletions
      // grey for common parts
      const color = part.added ? 'limegreen'
        : part.removed ? 'red' : 'grey';
      const span = document.createElement('span');
      span.style.color = color;
      span.appendChild(document
          .createTextNode(part.value));
      fragment.appendChild(span);
    });
    display.appendChild(fragment);
    $('#timesliderLink').on('click', () => {
      document.location = `${document.location}/timeslider#${lastVisitRev}`;
    });
    $.gritter.removeAll();
    $('#ep_what_have_i_missedModal').addClass('popup-show');
    $('#ep_what_have_i_missedModal').css('max-height', '100%');
    $('#ep_what_have_i_missedModal').css('overflow', 'auto');
  });
};

const catchUpMessage = (lastVisitRev) => {
  const msgTxt = document.createElement('p');
  msgTxt.append(html10n.get('pad.ep_what_have_i_missed_catchup.msg'));
  const button = document.createElement('button');
  button.classList.add('catchUpButton');
  button.append(html10n.get('pad.ep_what_have_i_missed_catchup.button'));
  const msg = document.createDocumentFragment();
  msg.append(msgTxt, button);

  $.gritter.add({
    title: html10n.get('pad.ep_what_have_i_missed_catchup.title'),
    text: msg,
    class_name: 'warning',
    sticky: true,
  });
};

exports.handleClientMessage_NEW_CHANGES = (fnName, msg) => {
  padcookie.setPref(`ep_what_have_i_missed:${clientVars.padId}`,
      pad.collabClient.getCurrentRevisionNumber());
};

exports.handleClientMessage_ACCEPT_COMMIT = (fnName, msg) => {
  padcookie.setPref(`ep_what_have_i_missed:${clientVars.padId}`,
      pad.collabClient.getCurrentRevisionNumber());
};
