'use strict';
// var util = require('util');
// var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var AppstarterGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askAboutApp: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Let\'s gernate an app using the appstarter generator!'));

    var prompts = [{
      name: 'appName',
      message: 'What do you want to call your app?'
    },{
      name: 'appDescription',
      message: 'Tell me a little bit about your app:'
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.appDescription = props.appDescription;

      done();
    }.bind(this));
  },

  askAboutFrameworks: function () {
    var done = this.async();

    var prompts = [
    {
      name: 'uxFramework',
      type: 'list',
      message: 'Would you like to include one of these wonderful UX frameworks?',
      choices: ['None', 'Bootstrap', 'Foundation']
    },{
      name: 'jsFramework',
      type: 'list',
      message: 'Would you like to include one of these wonderful js frameworks?',
      choices: ['None', 'Angularjs']
    }];

    this.prompt(prompts, function (props) {
      this.uxFramework = typeof props.uxFramework === 'undefined' || props.uxFramework === 'None' ? false : props.uxFramework.toLowerCase();
      this.jsFramework = typeof props.jsFramework === 'undefined' || props.jsFramework === 'None' ? false : props.jsFramework.toLowerCase();

      done();
    }.bind(this));
  },

  askAboutPreprocessors: function () {
    var done = this.async();
    var uxFramework = this.uxFramework;

    var prompts = [
    {
      name: 'cssPre',
      type: 'list',
      message: 'CSS preprocessor',
      choices: ['None', 'Compass', 'Sass', 'Less'],
      when: function () {
        return true || !uxFramework;
      }
    },
    {
      name: 'jsPre',
      type: 'list',
      message: 'Javascript preprocessor',
      choices: ['None', 'Coffeescript']
    }];

    this.prompt(prompts, function (props) {
      this.cssPre  = typeof props.cssPre === 'undefined' || props.cssPre === 'None' ? false : props.cssPre.toLowerCase();
      this.jsPre   = typeof props.jsPre === 'undefined' || props.jsPre === 'None' ? false : props.jsPre.toLowerCase();

      done();
    }.bind(this));
  },

  askAboutDirectories: function () {
    var done = this.async();
    var cssPre = this.cssPre;
    var jsPre  = this.jsPre;

    var slashFilter = function (input) {
      return input.replace(/^\/*|\/*$/g, '');
    };

    this.log(chalk.yellow('\nLet\'s set up some directories.'));

    var prompts = [
    {
      name: 'cssPreDir',
      message: 'CSS preprocessor directory',
      default: this.cssPre === 'less' ? '_less' : '_scss',
      filter: slashFilter,
      when: function () {
        return cssPre;
      }
    },
    {
      name: 'cssDir',
      message: 'CSS directory',
      default: 'css',
      filter: slashFilter
    },
    {
      name: 'jsPreDir',
      message: 'Javascript preprocessor directory',
      default: '_src',
      filter: slashFilter,
      when: function () {
        return jsPre;
      }
    },
    {
      name: 'jsDir',
      message: 'Javascript directory',
      default: 'js',
      filter: slashFilter
    },
    {
      name: 'imgDir',
      message: 'Image directory',
      default: 'img',
      filter: slashFilter
    },
    {
      name: 'fontsDir',
      message: 'Webfont directory',
      default: 'fonts',
      filter: slashFilter
    }];

    this.prompt(prompts, function (props) {
      this.cssDir    = props.cssDir;
      this.jsDir     = props.jsDir;
      this.imgDir    = props.imgDir;
      this.fontsDir  = props.fontsDir;
      this.cssPreDir = props.cssPreDir;
      this.jsPreDir  = props.jsPreDir;

      // Split asset directories on slashes
      this.cssExDir   = typeof props.cssDir !== 'undefined' ? props.cssDir.split('/').pop() : '';
      this.jsExDir    = typeof props.jsDir !== 'undefined' ? props.jsDir.split('/').pop() : '';
      this.imgExDir   = typeof props.imgDir !== 'undefined' ? props.imgDir.split('/').pop() : '';
      this.fontsExDir = typeof props.fontsDir !== 'undefined' ? props.fontsDir.split('/').pop() : '';

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/templates');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
  }
});

module.exports = AppstarterGenerator;
