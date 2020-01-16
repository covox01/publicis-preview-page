
<!-- 

npm run build

    gulp clean                  // starts on a blank folder
    gulp create_clickTags       // pulls data from config and creates tags
    gulp concat_clickTags       // places all the tags in one file
    gulp build_temp             // build template based on the config into "_working"
    gulp init_watchFiles        // prepares files for the "_watch" folder
    gulp clean_watchHTML        // removes html modules
    

gulp init_watchFiles && gulp server
-->



























































Gulp task
    Dev Environment
        - add the button functionality into the index of the dev environment with concat, don't do it when exporting


Saving Packages
**Always
    npm install --save-dev

    Current packages

        @babel/core: Core Babel compiler.
        @babel/present-env: Tells Babel how to transpile your code for browser support.
        gulp (version 4+): The build toolkit.
        gulp-babel: Gulp plugin for working with Babel.
        gulp-plumber: Error handling for Gulp.

Task Commands
    npm run build
    
        **Note
            ( I don't like calling gulp directly on the command line because you will inevitably end up with several projects on your machine, each (potentially) requiring a different version of Gulp. And when you call gulp directly, you're using the single global version. So you may not know which version of Gulp you're using when you run gulp on the command line, and that's a problem. )