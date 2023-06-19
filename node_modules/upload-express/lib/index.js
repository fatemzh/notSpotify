"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleError(err, res, log) {
  if (log) {
    log(toString(err));
    res.status(500).end('Internal Server Error');
  }
  else {
    res.status(500).end(toString(err));
  }
}
exports.handleError = handleError;
exports.error = handleError;
function toString(v) {
  if (typeof v === 'string') {
    return v;
  }
  else {
    return JSON.stringify(v);
  }
}
exports.toString = toString;
var UploadController = (function () {
  function UploadController(log, uploadService, generateId, sizesCover, sizesImage, id) {
    this.log = log;
    this.uploadService = uploadService;
    this.generateId = generateId;
    this.sizesCover = sizesCover;
    this.sizesImage = sizesImage;
    this.id = id && id.length > 0 ? id : 'id';
    this.uploadCover = this.uploadCover.bind(this);
    this.getGallery = this.getGallery.bind(this);
    this.updateGallery = this.updateGallery.bind(this);
    this.uploadGallery = this.uploadGallery.bind(this);
    this.deleteGalleryFile = this.deleteGalleryFile.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.addExternalResource = this.addExternalResource.bind(this);
    this.deleteExternalResource = this.deleteExternalResource.bind(this);
    this.getGallery = this.getGallery.bind(this);
  }
  UploadController.prototype.getGallery = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    if (!id || id.length === 0) {
      res.status(400).end('id cannot be empty');
    }
    else {
      this.uploadService.getGallery(id)
        .then(function (obj) {
          if (obj) {
            res.status(200).json(obj).end();
          }
          else {
            res.status(404).json(null).end();
          }
        })
        .catch(function (err) { return handleError(err, res, _this.log); });
    }
  };
  UploadController.prototype.uploadCover = function (req, res) {
    var _this = this;
    if (!req || !req.files || req.files.length < 1) {
      res.status(400).end('require file');
    }
    else {
      var id_1 = req.params[this.id];
      if (!id_1 || id_1.length === 0) {
        res.status(400).end('id cannot be empty');
      }
      else {
        var listFile_1 = [];
        var generateStr_1 = this.generateId();
        req.files.forEach(function (file) {
          var fileName = file.originalname;
          var data = file.buffer;
          var name = id_1.toString() + "_" + generateStr_1 + "_" + fileName;
          listFile_1.push({ name: name, data: data });
        });
        this.uploadService
          .uploadCoverImage(id_1, listFile_1)
          .then(function (result) { return res.status(200).json(result).end(); })
          .catch(function (e) { return handleError(e, res, _this.log); });
      }
    }
  };
  UploadController.prototype.uploadImage = function (req, res) {
    var _this = this;
    if (!req || !req.files || req.files.length < 1) {
      res.status(400).end('require file');
    }
    else {
      var id_2 = req.params[this.id];
      if (!id_2 || id_2.length === 0) {
        res.status(400).end('id cannot be empty');
      }
      else {
        var listFile_2 = [];
        var generateStr_2 = this.generateId();
        req.files.forEach(function (file) {
          var fileName = file.originalname;
          var data = file.buffer;
          var name = id_2.toString() + "_" + generateStr_2 + "_" + fileName;
          listFile_2.push({ name: name, data: data });
        });
        this.uploadService
          .uploadImage(id_2, listFile_2)
          .then(function (result) { return res.status(200).json(result).end(); })
          .catch(function (e) { return handleError(e, res, _this.log); });
      }
    }
  };
  UploadController.prototype.uploadGallery = function (req, res) {
    var _this = this;
    if (!req || !req.file) {
      res.status(400).end('require file');
    }
    else {
      var id = req.params[this.id];
      if (!id || id.length === 0) {
        res.status(400).end('id cannot be empty');
      }
      else {
        var data = req.file.buffer;
        var fileType = req.file.mimetype;
        var type = fileType.split('/')[0];
        var source = req.body.source;
        var upload = {
          id: id,
          source: source,
          name: id.toString() + "_" + this.generateId(),
          data: data,
          type: type,
        };
        if (!upload) {
          res.status(400).end('data cannot be empty');
        }
        else {
          this.uploadService
            .uploadGalleryFile(upload)
            .then(function (result) { return res.status(200).json(result).end(); })
            .catch(function (e) { return handleError(e, res, _this.log); });
        }
      }
    }
  };
  UploadController.prototype.updateGallery = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    if (!id || id.length === 0) {
      res.status(400).end('data cannot be empty');
    }
    else {
      var data = req.body;
      this.uploadService
        .updateGallery(id, data)
        .then(function (result) { return res.status(200).json(result); })
        .catch(function (err) { return handleError(err, res, _this.log); });
    }
  };
  UploadController.prototype.deleteGalleryFile = function (req, res) {
    var _this = this;
    var _a;
    var id = req.params[this.id];
    if (!id || id.length === 0) {
      res.status(400).end('id cannot be empty');
    }
    else {
      var url = (_a = req.query.url) === null || _a === void 0 ? void 0 : _a.toString();
      if (!url || url.length === 0) {
        res.status(400).end('url cannot be empty');
      }
      else {
        this.uploadService
          .deleteGalleryFile(id, url)
          .then(function (result) { return res.status(200).json(result); })
          .catch(function (err) { return handleError(err, res, _this.log); });
      }
    }
  };
  UploadController.prototype.addExternalResource = function (req, res) {
    var _this = this;
    var type = req.query.type;
    var url = req.query.url;
    var id = req.params[this.id];
    if (!id || id.length === 0 || !type || !url) {
      res.status(400).end('id cannot be empty');
    }
    else {
      this.uploadService
        .addExternalResource(id, { type: type.toString(), url: url.toString() })
        .then(function (result) { return res.status(200).json(result); })
        .catch(function (e) { return handleError(e, res, _this.log); });
    }
  };
  UploadController.prototype.deleteExternalResource = function (req, res) {
    var _this = this;
    var id = req.params[this.id];
    var url = req.query.url;
    if (url && id) {
      this.uploadService
        .deleteExternalResource(id.toString(), url.toString())
        .then(function (result) { return res.status(200).json(result); })
        .catch(function (e) { return handleError(e, res, _this.log); });
    }
    else {
      return res.status(400).end('data cannot be empty');
    }
  };
  return UploadController;
}());
exports.UploadController = UploadController;
exports.UploadHandler = UploadController;
