 module.exports = function(grunt) {

  var path = require('path');

  grunt.registerTask('watch', [ 'watch' ]);

  grunt.initConfig({

    curl: {
      craft:{
        src: 'http://buildwithcraft.com/latest.zip?accept_license=yes',
        dest: 'craft.zip'
      }
    },

    unzip: {
      craft: {
        src: ['craft.zip'],
        dest: '.tmp/'
      }
    },

    copy: {

      // setup entire craft folder and public for new installs
      craft: {

        files: [
          // includes files within path and its sub-directories
          {expand: true, cwd: '.tmp/craft/app/', src: ['**'], dest: 'craft/app'}
        ]

      }
    },

    clean: {
      craft:[".tmp", "craft.zip"]
    },

    deployments: {

      options: {
        // any should be defined options here
        "backups_dir": "./backups",
        "target": "stage"
      },

      "local": {
        "title": "Local",
        "database": "bee_site_craft",
        "user": "root",
        "pass": "root",
        "host": "localhost"
      },
      "stage": {
        "title": "Stage",
        "database": "bee_site_craft",
        "user": "forge",
        "pass": "",
        "host": "",
        "ssh_host": ""

      }
    },

    open : {
      install : {
        path: 'http://beesite.dev/admin/install',
        app: 'Google Chrome'
      },
    },

    less: {
      development: {
        options:{
          compress:false,
          sourceMap:true,
          sourceMapBasepath:'public',
          sourceMapRootpath:'/',
          sourceMapFilename:'public/styles/styles.map',
          sourceMapURL:'/styles/styles.map'
        },

        files: {
          "public/styles/styles.css": "public/styles/styles.less"
        }

      },
      production: {
        options:{
          compress:true
        },

        files: {
          "public/styles/styles.min.css": "public/styles/styles.less"
        }

      }
    },

    watch: {

      css: {
        files: ['public/styles/*.less'],
        tasks: ['less:development']

      }
    },
    shell: {
        makeDb: {
            command: 'mysql -u root -proot -e "create database bee_site_craft"'
        }
    }

  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-deployments');
  grunt.loadNpmTasks('grunt-open');

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.task.registerTask('craft', ['curl:craft', 'unzip:craft', 'copy:craft', 'clean:craft']);
  grunt.task.registerTask('craft-install', ['craft','shell:makeDb','less:development', 'open:install']);

  grunt.task.registerTask('db-pull', ['db_pull']);





};
