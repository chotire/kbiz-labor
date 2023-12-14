WebSquare.uiplugin.gridView.prototype.spanAll = function(openFlag) {
    try {
        if (typeof openFlag == "number") {
            this.showDepth = openFlag + "";
        } else {
            openFlag = WebSquare.util.getBoolean(openFlag);
            if (openFlag == true) {
                this.showDepth = "9999";
            } else {
                this.showDepth = "1";
            }
        }
        this.initDrilldown();
        this.rowIndex = -1;
        this.lastIndex = -1;
        this.lastTopRowIndex = null;
        this.drawData(0, 0);
        this.setScrollYHeight({
            noDraw: true
        });
        this.drawFooter();
        this.displayNoResultMessage();
    } catch (e) {
        WebSquare.exception.printStackTrace(e, null, this);
    }
};