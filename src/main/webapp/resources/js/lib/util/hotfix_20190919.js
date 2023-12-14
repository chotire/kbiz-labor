WebSquare.uiplugin.body.prototype.initialize = function(element) {
    this.wmodeFrameHash = {};
    this.modal = null;
    this.toolTipId = "";
    this.toolTip = null;
    this.toolTipTimer = null;
    this.toolTipSec = this.options.toolTipSec;
    this.toolTipNoEffect = this.options.toolTipNoEffect;
    this.forceClose = WebSquare.core.getConfiguration("/WebSquare/body/layerForceClose/@value");
    this.layerListener = new WebSquare.bodyLayerListener();

    if (!this.resizeChecker) {
        WebSquare.uiplugin.body.prototype.resizeChecker = new WebSquare.resizeChecker();

        WebSquare.util.setInterval(this.resizeChecker.checkResize, {
           key: "body_checkResize",
           caller: this.resizeChecker,
           delay: 60
       });
    }
};

WebSquare.uiplugin.body.prototype.showToolTip = function(e, element, text) {
    ["WebSquare.uiplugin.body.prototype.showToolTip"];
    try {
        if (element.toolTipShow == false) {
            return;
        }
        if (WebSquare.util.isFF() && element.getAttribute('disabled')) {
            return;
        }
        var idx = text.indexOf("javascript:");
        if (idx > -1) {
            var userfunction = text.substring(11, text.length);
            var result = eval(userfunction);
            text = result;
        }

        if (text == "") {
            return;
        }

        if (this.toolTipTimer) {
            clearTimeout(this.toolTipTimer);
            this.toolTipTimer = null;
        }

        if (!this.toolTip) {
            this.toolTip = new WebSquare.uiplugin.balloonTip(this.id + "_balloonTip");
            this.toolTip.writeTo(this);
            this.toolTip.activate();
        }

        if (this.toolTip) {
            var it = this.event.getTargetIterator(e, this.render);

            var comp = null;

            while (it.next()) {
                if ("idToUUID" in WebSquare) {
                    comp = WebSquare.idCache[WebSquare.idToUUID[it.getElement().getAttribute("id")]];
                } else {
                    comp = WebSquare.WebSquareDocument.componentIdCache[it.getElement().getAttribute("id")];
                }
                if (!(comp && comp.render == it.getElement())) {
                    comp = null;
                }
                if (comp && comp.options && comp.options.toolTip != "") {
                    text = comp.options.toolTip;

                    var idx = text.indexOf("javascript:");
                    if (idx > -1) {
                        var userfunction = text.substring(11, text.length);
                        var result = eval(userfunction);
                        text = result;
                    }

                    break;
                }
            }

            it = null;
            this._compID = this.uuid;
            if (comp) {
                WebSquare.event.fireEvent(comp, "ontooltipshow");
                this._compID = comp.uuid;
            }

            var zoomLevel = (WebSquare.BootLoader.fullViewRatio != null) ? WebSquare.BootLoader.fullViewRatio : 1;
            var left = WebSquare.style.getAbsoluteLeft(element);
            var top = WebSquare.style.getAbsoluteTop(element);
            var compHeight = WebSquare.style.getSize(element, "height");
            var value = "";


            var toolTipTimerSec = this.toolTipSec;
            if (comp && comp.options && comp.options.toolTipSec) {
                toolTipTimerSec = parseInt(comp.options.toolTipSec);
            }

            var tooltipFormatter = (comp && comp.options && comp.options.tooltipFormatter)
                ? WebSquare.util.getGlobalFunction(comp.options.tooltipFormatter, comp.scope_id) : null;

            if (typeof tooltipFormatter === "function") {
                value = tooltipFormatter.call(comp, comp.id, text);
            } else {
                value = text;
            }

            this.toolTip.setValue(value);

            var _this = this;
            this.toolTipTimer = setTimeout(function() {
                _this.toolTip.show();
                var width = _this.toolTip.render.offsetWidth;
                var height = _this.toolTip.render.offsetHeight;
                if (left + width > document.documentElement.scrollLeft / zoomLevel + document.documentElement.clientWidth / zoomLevel - 10) {
                    left = document.documentElement.scrollLeft / zoomLevel + document.documentElement.clientWidth / zoomLevel - width - 10;
                }

                var caleTop = top - height;
                if (caleTop < document.documentElement.scrollTop / zoomLevel + 10) {
                    if (caleTop < 0) {
                        caleTop = top + compHeight + 5;
                    } else {
                        caleTop = document.documentElement.scrollTop / zoomLevel + 10;
                    }
                }
                _this.toolTip.setPosition(left, caleTop);
                WebSquare.style.adjustZIndex(_this._compID, _this.toolTip.uuid, "toolTip");
                if (_this.toolTipNoEffect !== true) {
                    _this.toolTip.setOpacity(0);
                    new WebSquare.effect.opacity(_this.toolTip.render, {
                        opacity: 0,
                        from: 1,
                        to: 0
                    });
                }
            }, toolTipTimerSec);
        }

    } catch (e) {
        WebSquare.exception.printStackTrace(e, null, this);
    }

};