/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    '/': {
        view: 'home',
        locals:{
            'page':'home'
        }
    },
    'GET /admin': 'AdminController.index',
    'GET /admin/login': 'AdminController.login',
    'GET /admin/edit/:admin_id': 'AdminController.edit',
    'GET /admin/delete/:admin_id': 'AdminController.delete',

    'GET /admin/diseases': 'DiseasesController.index',
    'GET /admin/symptoms': 'SymptomsController.index',
    'GET /admin/users': 'UserController.index',

    'POST /admin/login': 'AdminController.processLogin',
    'POST /admin/create': 'AdminController.create',

    'POST /app/create': 'AppController.create',
    'GET /app/default/:app_id': 'AppController.default',
    'GET /app/edit/:app_id': 'AppController.edit',
    'GET /app/delete/:app_id': 'AppController.delete',
    'GET /app/delete': 'AppController.delete',
    'GET /app/get': 'AppController.read',
    'GET /app/list': 'AppController.list',
    'GET /app/:app_id': 'AppController.read',

    'POST /diseases/symptoms': 'DiseasesController.symptoms',
    'POST /diseases/symptoms/add': 'DiseasesController.symptoms_add',
    'POST /diseases/symptoms/remove': 'DiseasesController.symptoms_remove',
    'GET /diseases/edit/:disease_id': 'DiseasesController.edit',
    'GET /diseases/delete/:disease_id': 'DiseasesController.delete',

    'POST /symptoms/create': 'SymptomsController.create',
    'GET /symptoms/get': 'SymptomsController.read',
    'GET /symptom/:symptom_id': 'SymptomsController.read',
    'GET /symptoms': 'SymptomsController.list',
    'GET /symptoms/delete/:symptom_id': 'SymptomsController.delete',

    'GET /users': 'UserController.list',
    'GET /user/get': 'UserController.read',
    'GET /user/:user_id': 'UserController.read',
    'GET /user/delete/:user_id': 'UserController.delete',
    'GET /user/edit/:user_id': 'UserController.edit',

    'POST /survey/create': 'SurveyController.create',
    'GET /survey/:survey_id': 'SurveyController.read',
    'GET /surveys/s': 'SurveyController.getBySymptom',
    'GET /surveys/d': 'SurveyController.getByDisease',
    'GET /user/surveys/:user_id': 'SurveyController.read'


    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

};
