WebSquare.uiplugin.gridView.prototype.setTrRowTable = function() {
    ["WebSquare.uiplugin.drawInitializer.prototype.setTrRowTable"];
    try {
        this.tempDiv = document.createElement("div");
        this.tempDiv.style.width = "0px";
        this.tempDiv.style.height = "0px";
        this.tempDiv.style.overflow = "hidden";
        this.tempDiv.innerHTML = "<table id='tempTable' style='table-layout:fixed; border-collapse:collapse; border-spacing:0px;'>" + this.getTableHtml(this.htmlInfo.body, "tbody", "td", this.options.bodyTdClass) + "</table>";
        this.tempTr = this.tempDiv.getElementsByTagName("table")[0];

        var tds = this.tempTr.getElementsByTagName("td");
        this.aria_labelledby = [];
        for (var i = 0; i < tds.length; i++) {
            if (this.options.autoScope && i == 0) {
                tds[i].setAttribute("scope", "row");
            }
            this.aria_labelledby[i] = tds[i].getAttribute("aria-labelledby");
            tds[i].innerHTML = "";
        }

        this.tempDiv.id = this.id;
        this.tempDiv.className = this.options.className + " w2grid";

        document.body.appendChild(this.tempDiv);
        var oneRowHeight = this.tempDiv.getElementsByTagName("tbody")[0].offsetHeight;
        if (oneRowHeight == 0) {
            if (this.options.defaultCellHeight != -1) {
                oneRowHeight = this.options.defaultCellHeight;
            } else {
                oneRowHeight = 20;
            }
        }
        this.oneRowHeight = oneRowHeight + (WebSquare.util.isIE(6) || WebSquare.util.isIE(7) ? 1 : 0);
        if (this.options.scrollRowHeight) {
            this.oneRowScrollHeight = this.oneRowHeight;
        }
        document.body.removeChild(this.tempDiv);
    } catch (e) {
        WebSquare.exception.printStackTrace(e, null, this);
    }
};

WebSquare.uiplugin.grid.prototype.setTrRowTable = WebSquare.uiplugin.gridView.prototype.setTrRowTable ;