(function() {
  var PlistNode, PlistParser, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  PlistNode = (function() {

    function PlistNode(type, processors) {
      this.type = type;
      this.processors = processors;
      this.key = null;
      this.value = null;
      this.parent = null;
      this.children = [];
      return this;
    }

    PlistNode.prototype.addChild = function(node) {
      node.parent = this;
      this.children.push(node);
      return node;
    };

    PlistNode.prototype.getParent = function() {
      if (this.parent) {
        return this.parent;
      }
      return this;
    };

    PlistNode.prototype.convert = function() {
      var child, iterable, _i, _j, _len, _len1, _ref, _ref1;
      if (!this.children.length) {
        if ((this.processors != null) && (this.processors[this.type] != null)) {
          return this.processors[this.type](this.value);
        }
        if (this.type === 'integer') {
          return parseInt(this.value, 10);
        } else if (this.type === 'string') {
          return this.value;
        } else if (this.type === 'date') {
          try {
            return new Date(this.value);
          } catch (e) {
            return null;
          }
        } else if (this.type === 'true') {
          return true;
        } else if (this.type === 'false') {
          return false;
        } else if (this.type === 'real') {
          return parseFloat(this.value);
        } else if (this.type === 'data') {
          return this.value;
        } else if (this.type === 'dict') {
          return {};
        } else if (this.type === 'array') {
          return [];
        } else {
          return this.value;
        }
      } else {
        if (this.type === 'dict') {
          iterable = {};
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            if (child.key) {
              iterable[child.key] = child.convert();
            }
          }
        } else if (this.type === 'array') {
          iterable = [];
          _ref1 = this.children;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            child = _ref1[_j];
            iterable.push(child.convert());
          }
        }
      }
      return iterable;
    };

    return PlistNode;

  })();

  PlistParser = (function() {

    function PlistParser(xml, opts) {
      var sax, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (opts == null) {
        opts = null;
      }
      if ((typeof exports !== "undefined" && exports !== null) && !(exports.sax != null)) {
        try {
          sax = require('sax');
        } catch (e) {

        }
      }
      if (!(sax != null) && !(root.sax != null)) {
        return new Error('Missing required dependency: sax-js (https://github.com/isaacs/sax-js)');
      }
      this.sax = sax != null ? sax : root.sax;
      this.xml = xml;
      this.traverser = null;
      this.last = {
        'parent': null,
        'node': null,
        'key': null,
        'tag': null,
        'value': null
      };
      this.error = null;
      this.opts = {
        'processors': {
          'integer': (_ref = opts != null ? (_ref1 = opts.processors) != null ? _ref1.integer : void 0 : void 0) != null ? _ref : null,
          'string': (_ref2 = opts != null ? (_ref3 = opts.processors) != null ? _ref3.string : void 0 : void 0) != null ? _ref2 : null,
          'date': (_ref4 = opts != null ? (_ref5 = opts.processors) != null ? _ref5.date : void 0 : void 0) != null ? _ref4 : null,
          'true': (_ref6 = opts != null ? (_ref7 = opts.processors) != null ? _ref7["true"] : void 0 : void 0) != null ? _ref6 : null,
          'false': (_ref8 = opts != null ? (_ref9 = opts.processors) != null ? _ref9["false"] : void 0 : void 0) != null ? _ref8 : null,
          'real': (_ref10 = opts != null ? (_ref11 = opts.processors) != null ? _ref11.real : void 0 : void 0) != null ? _ref10 : null,
          'data': (_ref12 = opts != null ? (_ref13 = opts.processors) != null ? _ref13.data : void 0 : void 0) != null ? _ref12 : null,
          'dict': (_ref14 = opts != null ? (_ref15 = opts.processors) != null ? _ref15.dict : void 0 : void 0) != null ? _ref14 : null,
          'array': (_ref16 = opts != null ? (_ref17 = opts.processors) != null ? _ref17.array : void 0 : void 0) != null ? _ref16 : null
        }
      };
      return this;
    }

    PlistParser.prototype.validate = function() {
      var parser,
        _this = this;
      parser = this.sax.parser(true);
      parser.onopentag = function(node) {
        if (!this.first) {
          this.first = true;
          if (node.name !== 'plist') {
            return this.error = new Error('Invalid Property List contents (<plist> missing)');
          }
        }
      };
      parser.ondoctype = function(doctype) {
        if (doctype !== ' plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"') {
          return _this.error = new Error('Invalid Property List DOCTYPE');
        }
      };
      parser.onerror = function(error) {
        return _this.error = error;
      };
      parser.write(this.xml).close();
      if (this.error) {
        return false;
      }
      return true;
    };

    PlistParser.prototype.parse = function() {
      var parser,
        _this = this;
      parser = this.sax.parser(true);
      parser.onopentag = function(node) {
        if (node.name === 'plist') {
          return;
        } else if (node.name === 'key') {
          _this.last.key = null;
          return;
        }
        if (!_this.traverser) {
          _this.traverser = _this.last.node = new PlistNode(node.name, _this.opts.processors);
          return;
        }
        _this.last.node = _this.traverser.addChild(new PlistNode(node.name, _this.opts.processors));
        if (_this.last.key) {
          _this.last.node.key = _this.last.key.valueOf();
          _this.last.key = null;
        }
        if ((node.name === 'dict') || (node.name === 'array')) {
          return _this.traverser = _this.last.node;
        }
      };
      parser.ontext = function(text) {
        return _this.last.value = text;
      };
      parser.onclosetag = function(name) {
        if ((name === 'dict') || (name === 'array')) {
          return _this.traverser = _this.traverser.getParent();
        } else if (name === 'key') {
          if (_this.last.value) {
            _this.last.key = _this.last.value.valueOf();
            return _this.last.value = null;
          }
        } else if (_this.last.node) {
          if (_this.last.value) {
            _this.last.node.value = _this.last.value.valueOf();
          }
          return _this.last.node = null;
        }
      };
      parser.write(this.xml).close();
      return this.traverser.convert();
    };

    return PlistParser;

  })();

  root.PlistParser = PlistParser;

  root.PlistNode = PlistNode;

}).call(this);