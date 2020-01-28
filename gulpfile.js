'use strict';

/* _ Modules _ */
    const { series, src, dest, parallel, watch}         = require('gulp');
    const replace                                       = require('gulp-replace');
    const include                                       = require('gulp-include');
    const concat                                        = require('gulp-concat');
    const zip                                           = require('gulp-zip');
    const plumber                                       = require('gulp-plumber');
    const jsonTransform                                 = require('gulp-json-transform');
    const babel                                         = require('gulp-babel')

/* _ Node _ */
    const del                                           = require('del');
    const browserSync                                   = require('browser-sync');
    const fs                                            = require('fs');

/* _ Variables _ */
    const
        config                                          = require('./banner_config'),
        dir = {                 
            banner_templates                            : './src/components/banner_templates',
            staging_templates                           : { preview: './src/staging/preview_page', dev:'./src/staging/dev_environment' },
            temp                                        : './_temp',
            watch                                       : './_watch',
            working                                     : './_working',
            traffick                                    : './_traffick'
        },                  
        clickTags                                       = {}
    ;

//-- clean --//
    async function clean(cb) {
        await del(`${dir.temp}/**`, { force : true });
        await del(`${dir.watch}/**`, { force : true });
        await del(`${dir.working}/**`, { force : true });
        await del(`${dir.traffick}/**`, { force : true });
        cb();
    }

//-- create_custom_html --//
    function create_custom_html(done) {
        
        //config
        const getConfig = config.map((config) => {
        return (config_done) => {

            // units
            const units = config.Units.map((unit) => {
                return (units_done) => {

                    clickTags.amount = [];
                    for (let index = 0; index < unit.Click_Tags; index++) {                    
                        clickTags.amount.push(index);
                    }

                    // size
                    const sizes = unit.Sizes.map((size) => {
                        return (sizes_done) => {

                                const clickTags_map = clickTags.amount.map((j) => {
                                    return (clickTag_done) => {

                                        clickTags.id = {};
                                        clickTags.id[`clickTag${j}`] = `clickTag${j}`;
                
                                        src(`${dir.banner_templates}/${unit.Template}/_clickTags/${unit.Ad_Platforms}/*.html`)
                                        .pipe(plumber())
                                        .pipe(replace('{clickTag}', clickTags.id[`clickTag${j}`]))
                                        .pipe(dest(`${dir.temp}/clickTags/raw/clickTag${j}`));                                
                                        
                                        clickTag_done();

                                    }
                                })
                                    
                            return series(...clickTags_map, (series_done) => {
                                series_done();
                                sizes_done();
                            })();
                        }
                    });

                    return series(...sizes, (series_done) => {
                        series_done();
                        units_done();
                    })();
                    
                }
            });

            return series(...units, (series_done) => {
                series_done();
                config_done();
            })();
            //
        }
        });

    return series(...getConfig, (series_done) => {
        series_done();
        done();
    })();
    //
    }

    function concat_custom_html(done) {  

        src(`${dir.temp}/clickTags/**/*head.html`)
        .pipe(plumber())
        .pipe(concat('clickTags-head.html'))
        .pipe(dest(`${dir.temp}/clickTags/clickTags_export`))

        src(`${dir.temp}/clickTags/**/*footer.html`)
        .pipe(plumber())
        .pipe(concat('clickTags-footer.html'))
        .pipe(dest(`${dir.temp}/clickTags/clickTags_export`))     
        
        done();
    }

//-- build_temp --//
    function build_temp(done) {
        
            //config
            const getConfig = config.map((config) => {
            return (config_done) => {

                // units
                const units = config.Units.map((unit) => {
                    return (units_done) => {

                        // size
                        const sizes = unit.Sizes.map((size) => {
                            return (sizes_done) => {
                                                                
                                src([`${dir.banner_templates}/${unit.Template}/${"default"}/**/*`, `${dir.thirdParty_Plugins}/**/*`])
                                .pipe(plumber())
                                
                                //html
                                .pipe(replace('{clickTag-head}', "../../../../../../_temp/clickTags/clickTags_export/clickTags-head.html"))
                                .pipe(replace('{clickTag-footer}', "../../../../../../_temp/clickTags/clickTags_export/clickTags-footer.html"))
                                .pipe(include())

                                .pipe(replace('{width}', size.width))
                                .pipe(replace('{height}', size.height))
                                .pipe(replace('{Client-Name}', config.Client))
                                .pipe(replace('{Campaign-Name}', config.Campaign))
                                .pipe(replace('{Size}', `${size.width }x${size.height}`))  
                                // css
                                .pipe(replace('-width-', size.width)) 
                                .pipe(replace('-height-', size.height))
                                .pipe(dest(`${dir.working}/Versions/${unit.Version_Name}/${unit.Naming_Convention.Name_Before_AdSize}${size.width}x${size.height}${unit.Naming_Convention.Name_After_AdSize}`));  
                                
                                sizes_done();
                            }
                        });

                        return series(...sizes, (series_done) => {
                            series_done();
                            units_done();
                        })();
                        
                    }
                });

                return series(...units, (series_done) => {
                    series_done();
                    config_done();
                })();
                //
            }
            });
        
        return series(...getConfig, (series_done) => {
            series_done();
            done();
        })();
        //
    }

//-- gulp --//

function convertES6 (){
    gulp.task('scripts', function() {
        return gulp.src(
          [
          'node_modules/babel-polyfill/dist/polyfill.js',
          'js/*.js'
          ])
          .pipe(babel({presets: ['es2015']}))
          .pipe(gulp.dest('compiled'))
    });
}


//-- watch --//
    function init_watchFiles(done) {
        src([`${dir.working}/**/*`])
        
        .pipe(replace('{index_head}', '<!--=include html/head.html -->'))
        .pipe(replace('{index_footer}', '<!--=include html/footer.html -->'))
        .pipe(include())
        .pipe(dest(`${dir.watch}/units`))

        done();
    }

    function watcher(cb) {
        // watch(`${dir.working}/**/*.html`).on('change', series(init_watchFiles, browserSync.reload))
        // watch(`${dir.working}/**/*.css`).on('change', series(init_watchFiles, browserSync.reload))
        // watch(`${dir.working}/**/*.js`).on('change', series(init_watchFiles, browserSync.reload))
        watch(`${dir.watch}/**/*.html`).on('change', series(init_watchFiles, browserSync.reload))
        watch(`${dir.watch}/**/*.css`).on('change', series(init_watchFiles, browserSync.reload))
        watch(`${dir.watch}/**/*.js`).on('change', series(init_watchFiles, convertES6, browserSync.reload))
        cb();
    }

    function server(cb) {
        browserSync.init({
            notify: false,
            open: false,
            server: {
            baseDir: `${dir.watch}`
            }   
        })
        cb();
    }

//-- previewPage --//
    function init_previewPage(done) {
        src([`${dir.staging_templates.preview}/default_preview-page/**/*`, `!${dir.staging_templates.preview}/**/*preview_connect.json`])
        
        .pipe(dest(`${dir.watch}`))

        done();
    }

    function previewPage_JSON(done) {
        var preview_connect = [];
        
        //config
        const getConfig = config.map((config) => {
        return (config_done) => {
            
            // console.log(config)

            preview_connect = {
                Agency: config.Agency,
                Client: config.Client,
                Campaign: config.Campaign,
                Server_Location: config.Server_Location,
                File_Path: "units/Versions/",
                Units: []
            };

            // units
            const units = config.Units.map((unit) => {
                return (units_done) => {

                    // console.log(unit)

                    preview_connect.Units.push({
                        Ad_Platforms: unit.Ad_Platforms,
                        Version_Name: unit.Version_Name,
                        Sizes:[]
                    });
                    
                    // size
                    const sizes = unit.Sizes.map((size) => {
                        return (sizes_done) => {
                            
                            for (let index = 0; index < preview_connect.Units.length; index++) {
                                preview_connect.Units[index].Sizes.push({
                                    size: {width:`${size.width}`, height:`${size.height}`},
                                    file:`${unit.Naming_Convention.Name_Before_AdSize}${size.width}x${size.height}${unit.Naming_Convention.Name_After_AdSize}`,
                                    fileWeight: `${size.fileWeight}`
                                })
                            }                       
                                    
                            src(`${dir.staging_templates.preview}/default_preview-page/preview_connect.json`)
                            .pipe(jsonTransform(function(data, file) {
                                return {
                                    preview_connect
                                };
                            }))
                            .pipe(dest(`${dir.watch}`));

                            sizes_done();
                        }
                    });

                    return series(...sizes, (series_done) => {
                        series_done();
                        units_done();
                    })();
                    
                }
            });

            return series(...units, (series_done) => {
                series_done();
                config_done();
            })();
            //
        }
        });

    return series(...getConfig, (series_done) => {
        series_done();
        done();
    })();
    //
    }

//-- traffick --//
    function zipFiles(done){
        var contents        = fs.readFileSync("./_watch/preview_connect.json");
        var jsonContent     = JSON.parse(contents);
        var pc              = jsonContent.preview_connect;

        const units_zip = pc.Units.map((uz) => {
            return (units_done) => {
                const sizes_zip = uz.Sizes.map((sz) => {
                    return (sizes_done) => {
                        src(`${dir.watch}/${pc.File_Path}${uz.Version_Name}/${sz.file}/**/*`)
                        .pipe(zip(`${sz.file}.zip`))
                        .pipe(dest(`${dir.traffick}/${pc.Campaign}/${uz.Version_Name}`))
                        sizes_done();
                    }
                });
            
                return series(...sizes_zip, (series_done) => {
                    series_done();
                    units_done();
                })();
            }
        });

        return series(...units_zip, (series_done) => {
            series_done();
            done();
        })();

    }

/* _ Exports _ */
    exports.clean                           = clean;
    exports.init_watchFiles                 = init_watchFiles;
    exports.server                          = parallel(server, watcher);
    exports.watcher                         = watcher;
    exports.zipFiles                        = zipFiles;

    exports.previewPage                     = parallel (init_previewPage, previewPage_JSON)

    exports.build_temp                      = build_temp;
    exports.create_custom_html              = create_custom_html;
    exports.concat_custom_html              = concat_custom_html;





//templates

    // //-- create_custom_html --//
    // function create_custom_html(done) {
            
    //     //config
    //     const getConfig = config.map((config) => {
    //     return (config_done) => {

    //         // units
    //         const units = config.Units.map((unit) => {
    //             return (units_done) => {

    //                 clickTags.amount = [];
    //                 for (let index = 0; index < unit.Click_Tags; index++) {                    
    //                     clickTags.amount.push(index);
    //                 }

    //                 // size
    //                 const sizes = unit.Sizes.map((size) => {
    //                     return (sizes_done) => {
    
    //                             sizes_done();
    //                     }
    //                 });

    //                 return series(...sizes, (series_done) => {
    //                     series_done();
    //                     units_done();
    //                 })();
                    
    //             }
    //         });

    //         return series(...units, (series_done) => {
    //             series_done();
    //             config_done();
    //         })();
    //         //
    //     }
    //     });

    // return series(...getConfig, (series_done) => {
    //     series_done();
    //     done();
    // })();
    // //
    // }