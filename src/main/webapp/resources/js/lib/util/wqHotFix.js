/* Websquare Hot fix start*/
WebSquare.uiplugin.autoComplete.prototype.getFormattedValue = function (_122, _123) {
    ["WebSquare.autoComplete.getFormattedValue"];
    try {
        var ret = _123;
        if (this.options.displayFormatter) {
            if (!this.displayFormatter) {
                this.fixedIndex = -1;
                if (this.options.allOption == true) {
                    this.fixedIndex++;
                }
                if (this.options.chooseOption == true) {
                    this.fixedIndex++;
                }
                try {
                    //this.displayFormatter = (this.options.displayFormatter) ? eval(this.options.displayFormatter) : null;
                	/*var obj = this.options.displayFormatter.split(".");
                    var scObj = this.getScope().getObj(obj[0]);
                    
                    this.displayFormatter = scObj[obj[1]]; 
                    */
                	  var _15e = null;
                      if (this.options.displayFormatter) {
                          try {
                              if (typeof this.options.displayFormatter == "function") {
                                  _15e = this.options.displayFormatter;
                              } else {
                                  _15e = WebSquare.util.getGlobalFunction(this.options.displayFormatter, this.scope_id);
                                  if (_15e != null) {
                                      this.displayFormatter = _15e;
                                  }
                              }
                          } catch (e) {
                              _15e = null;
                          }
                      }
                } catch (e) {}
            }
            if (this.displayFormatter && _122 > this.fixedIndex) {
                ret = this.displayFormatter(_123);
            }
        }
        return ret;
    } catch (e) {
        WebSquare.exception.printStackTrace(e);
    }
};
/* Websquare Hot fix finish*/