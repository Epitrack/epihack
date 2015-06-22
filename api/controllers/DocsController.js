/**
 * DocsController
 *
 * @description :: Server-side logic for managing Docs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `DocsController.index()`
   */
  index: function (req, res) {
    return res.view("docs/index", {page:'docs_index'});
  },


  /**
   * `DocsController.config()`
   */
  config: function (req, res) {
    return res.view("docs/docs_config", {page:'docs_config'});
  },


  /**
   * `DocsController.admin()`
   */
  admin: function (req, res) {
    return res.view("docs/docs_admin", {page:'docs_admin'});
  },


  /**
   * `DocsController.user()`
   */
  user: function (req, res) {
    return res.view("docs/docs_user", {page:'docs_user'});
  },


  /**
   * `DocsController.diseases()`
   */
  diseases: function (req, res) {
    return res.view("docs/docs_diseases", {page:'docs_diseases'});
  },


  /**
   * `DocsController.surveys()`
   */
  surveys: function (req, res) {
    return res.view("docs/docs_surveys", {page:'docs_surveys'});
  },


  /**
   * `DocsController.map()`
   */
  map: function (req, res) {
    return res.view("docs/docs_map", {page:'docs_map'});
  },


  /**
   * `DocsController.other()`
   */
  other: function (req, res) {
    return res.view("docs/docs_other", {page:'docs_other'});
  }
};

