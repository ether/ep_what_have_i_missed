// Copyright John McLear - Etherpad Foundation 2020, Apache2.
var padcookie = require("ep_etherpad-lite/static/js/pad_cookie").padcookie;
var hooks = require("ep_etherpad-lite/static/js/pluginfw/hooks");
var Changeset = require("ep_etherpad-lite/static/js/Changeset");
window.Diff = require('./diff.min');

exports.postAceInit = function(){
  // what's on the server
  var padId = clientVars.padId;
  var padRev = clientVars.collab_client_vars.rev

  // do we have a local copy?
  var lastVisitRev = padcookie.getPref("ep_what_have_i_missed:"+padId);
    if(lastVisitRev){
    clientVars.lastVisitRev = lastVisitRev;
    // console.log("padRev", padRev)
    // console.log("lastVisitRev", lastVisitRev)
    if(padRev > (lastVisitRev+2)){
      catchUpMessage(lastVisitRev);
    }
  }
  buttonListeners();
  settingsListeners(); // enables listeners for settings
  loadSettings(); // loads settings from cookies
  appendUI(); // update the UI to show who we're following
}

function buttonListeners(){
  $('.catchUpButton').on('click', function(){
    // show Differential
    showDiff(clientVars.padId, clientVars.lastVisitRev, clientVars.collab_client_vars.rev)
    console.warn(clientVars.padId, clientVars.lastVisitRev)
  })
}

function showDiff(padId, lastVisitRev){
  // load latest
  var latestText = clientVars.collab_client_vars.initialAttributedText.text;
  var lastVisitTextURI = window.location + "/" + lastVisitRev + "/export/txt";
  $.get(lastVisitTextURI, function(lastVisitText){
    var diff = Diff.diffChars(lastVisitText, latestText);
    var display = document.getElementById('diffDisplay');
    var fragment = document.createDocumentFragment();
    diff.forEach((part) => {
      // green for additions, red for deletions
      // grey for common parts
      const color = part.added ? 'green' :
        part.removed ? 'red' : 'grey';
      span = document.createElement('span');
      span.style.color = color;
      span.appendChild(document
        .createTextNode(part.value));
      fragment.appendChild(span);
    });
    display.appendChild(fragment);
    $('#timesliderLink').attr("href", window.location+"/timeslider")
    $.gritter.removeAll();
    $('#ep_what_have_i_missedModal').addClass('popup-show');
  })
}

function catchUpMessage(lastVisitRev){
  var msg = html10n.get("pad.ep_what_have_i_missed_catchup.msg") + "<br><br>";

  var button = "<button class='catchUpButton'>"+html10n.get("pad.ep_what_have_i_missed_catchup.button") +"</button>"

  $.gritter.add({
    title: html10n.get("pad.ep_what_have_i_missed_catchup.title"),
    text: msg + button,
    class_name: "warning",
    sticky: true,
  });
}

exports.handleClientMessage_NEW_CHANGES = function(fnName, msg){
  padcookie.setPref("ep_what_have_i_missed:"+clientVars.padId, pad.collabClient.getCurrentRevisionNumber());
}

exports.handleClientMessage_ACCEPT_COMMIT = function(fnName, msg){
  padcookie.setPref("ep_what_have_i_missed:"+clientVars.padId, pad.collabClient.getCurrentRevisionNumber());
}

function appendUI(){
}

function follow(authorId){
}

function unfollow(authorId){
}

function followingAuthor(authorId){
}

function goToLineNumber(lineNumber){
  // Sets the Y scrolling of the browser to go to this line
  var $inner = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find('#innerdocbody');
  var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
  var $outerdocHTML = $('iframe[name="ace_outer"]').contents().find("#outerdocbody").parent();
  var line = $inner.find("div:nth-child("+(lineNumber+1)+")");
  var newY = $(line)[0].offsetTop + "px";
  $outerdoc.css({top: newY +"px"}); // Chrome
  $outerdocHTML.animate({scrollTop: newY}); // needed for FF
}

function settingsListeners(){
  $('#options-followAll').on('change', function(){
    clientVars.ep_what_have_i_missed.followAll = !clientVars.ep_what_have_i_missed.followAll; // toggles.
    padcookie.setPref("ep_what_have_i_missed.followAll", $(this).prop("checked"));
    // if you enable follow All it will set enable to true
    if($(this).prop("checked")){
      clientVars.ep_what_have_i_missed.enableFollow = true;
      $('#options-enableFollow').prop("checked", true);
    }
    updateFollowingUI()
  });

  $('#options-enableFollow').on('click', function(){
    clientVars.ep_what_have_i_missed.enableFollow = !clientVars.ep_what_have_i_missed.enableFollow; // toggles.
    padcookie.setPref("ep_what_have_i_missed.enableFollow", $(this).prop("checked"));
  });
}

function loadSettings(){

}

function updateFollowingUI(){
  // For each person we're following add the eye in the users list.
  var userRows = $('#otheruserstable').contents().find("tr")
  $.each(userRows, function(){
    $(this).find("td > div").text("");
  });
  if(clientVars.ep_what_have_i_missed.followAll){
    var userRows = $('#otheruserstable').contents().find("tr")
    $.each(userRows, function(){
      $(this).find("td > div").text("👁");
      $(this).find("td > div").css({"font-size":"12px","color":"#666","line-height":"17px","padding-left":"3px"});
    });
  }else{
    $.each(clientVars.ep_what_have_i_missed.following, function(authorId){
      // find the authorId item..
      var userRow = $('#otheruserstable').contents().find("[data-authorid='"+authorId+"']")
      $(userRow).find("td > div").text("👁");
      $(userRow).find("td > div").css({"font-size":"12px","color":"#666","line-height":"17px","padding-left":"3px"});
    })
  }
}

function isEditingTimeout(){
  // on initial initialization of pad for 1 second don't drag my focus.
  clientVars.ep_what_have_i_missed.isEditing = true;
  clientVars.ep_what_have_i_missed.editingTimeout = setTimeout(function(){
    clientVars.ep_what_have_i_missed.isEditing = false;
  }, 1000)
}
