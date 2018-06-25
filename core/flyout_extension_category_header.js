/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2018 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Class for a button in the flyout that displays an image.
 * @author ericr@media.mit.edu (Eric Rosenbaum)
 */
'use strict';

goog.provide('Blockly.FlyoutExtensionCategoryHeader');

goog.require('Blockly.FlyoutButton');

/**
 * Class for a button in the flyout that displays an image.
 * @param {!Blockly.WorkspaceSvg} workspace The workspace in which to place this
 *     button.
 * @param {!Blockly.WorkspaceSvg} targetWorkspace The flyout's target workspace.
 * @param {!Element} xml The XML specifying the button.
 * @constructor
 */
Blockly.FlyoutExtensionCategoryHeader = function(workspace, targetWorkspace, xml) {
  /**
   * @type {!Blockly.WorkspaceSvg}
   * @private
   */
  this.workspace_ = workspace;

  /**
   * @type {!Blockly.Workspace}
   * @private
   */
  this.targetWorkspace_ = targetWorkspace;

  /**
  * @type {string}
  * @private
  */
  this.text_ = xml.getAttribute('text');

  /**
   * @type {number}
   * @private
   */
  this.flyoutWidth_ = this.targetWorkspace_.getFlyout().getWidth();

  /**
   * @type {string}
   */
  this.extensionId = xml.getAttribute('id');

  /**
   * Whether this is a label at the top of a category.
   * @type {boolean}
   * @private
   */
  this.isCategoryLabel_  = true;

  /**
   * @type {!goog.math.Coordinate}
   * @private
   */
  this.position_ = new goog.math.Coordinate(0, 0);
};
goog.inherits(Blockly.FlyoutExtensionCategoryHeader, Blockly.FlyoutButton);

/**
 * Create the label and button elements.
 * @return {!Element} The SVG group.
 */
Blockly.FlyoutExtensionCategoryHeader.prototype.createDom = function() {
  var cssClass = 'blocklyFlyoutLabel';

  this.svgGroup_ = Blockly.utils.createSvgElement('g', {'class': cssClass},
      this.workspace_.getCanvas());

  this.addTextSvg(true);

  this.setStatus(Blockly.StatusButtonState.NOT_READY);

  var statusButtonWidth = 25;
  var marginX = 15;
  var marginY = 10;

  var statusButtonX = (this.flyoutWidth_ - statusButtonWidth - marginX) / this.workspace_.scale;

  if (this.imageSrc_) {
    /** @type {SVGElement} */
    this.imageElement_ = Blockly.utils.createSvgElement(
        'image',
        {
          'class': 'blocklyFlyoutButton',
          'height': statusButtonWidth + 'px',
          'width': statusButtonWidth + 'px',
          'x': statusButtonX + 'px',
          'y': marginY + 'px'
        },
        this.svgGroup_);
    this.setImageSrc(this.imageSrc_);
  }

  this.callback_ = Blockly.statusButtonCallback.bind(this, this.extensionId);

  this.mouseUpWrapper_ = Blockly.bindEventWithChecks_(this.imageElement_, 'mouseup',
      this, this.onMouseUp_);
  return this.svgGroup_;
};

/**
 * Set the image on the status button using a status string.
 * @param {string} status The status string.
 */
Blockly.FlyoutExtensionCategoryHeader.prototype.setStatus = function(status) {
  var basePath = Blockly.mainWorkspace.options.pathToMedia;
  if (status == Blockly.StatusButtonState.READY) {
    this.setImageSrc(basePath + 'status-ready.svg');
  }
  if (status == Blockly.StatusButtonState.NOT_READY) {
    this.setImageSrc(basePath + 'status-not-ready.svg');
  }
};

/**
 * Set the source URL of the image for the button.
 * @param {?string} src New source.
 * @package
 */
Blockly.FlyoutExtensionCategoryHeader.prototype.setImageSrc = function(src) {
  if (src === null) {
    // No change if null.
    return;
  }
  this.imageSrc_ = src;
  if (this.imageElement_) {
    this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', this.imageSrc_ || '');
  }
};
