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
    return res.view("docs/index");
  },


  /**
   * `DocsController.config()`
   */
  config: function (req, res) {
    return res.view("docs/docs_config");
  },


  /**
   * `DocsController.admin()`
   */
  admin: function (req, res) {
    return res.view("docs/docs_admin");
  },


  /**
   * `DocsController.user()`
   */
  user: function (req, res) {
    return res.view("docs/docs_user");
  },


  /**
   * `DocsController.diseases()`
   */
  diseases: function (req, res) {
    return res.view("docs/docs_diseases");
  },


  /**
   * `DocsController.surveys()`
   */
  surveys: function (req, res) {
    return res.view("docs/docs_surveys");
  },


  /**
   * `DocsController.map()`
   */
  map: function (req, res) {
    return res.view("docs/docs_map");
  },


  /**
   * `DocsController.other()`
   */
  other: function (req, res) {
    return res.view("docs/docs_other");
  }
};

