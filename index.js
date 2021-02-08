'use strict';

/**
 * Copyright 2020 John McLear <john@mclear.co.uk>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const eejs = require('ep_etherpad-lite/node/eejs/');
const settings = require('ep_etherpad-lite/node/utils/Settings');

exports.clientVars = (hook, context, callback) => {
  if (!settings.ep_what_have_i_missed) settings.ep_what_have_i_missed = {};
  return callback({
    ep_what_have_i_missed: {
    },
  });
};

exports.eejsBlock_mySettings = (hook, context, callback) => {
  if (!settings.ep_what_have_i_missed) settings.ep_what_have_i_missed = {};
  context.content += eejs.require('ep_what_have_i_missed/templates/settings.ejs', {
  });
  callback();
};

exports.eejsBlock_customStyles = (hookName, args, cb) => {
  args.content += eejs.require('ep_what_have_i_missed/templates/styles.html', {}, module);
  cb();
};


exports.eejsBlock_body = (hookName, args, cb) => {
  args.content += eejs.require('ep_what_have_i_missed/templates/diff.ejs', {}, module);
  return cb();
};
