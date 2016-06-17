var src = 'src',
    dest = '',
    LiveScript = require('livescript'), 
    fs = require('fs'),
    path = require('path'),
    process = require('process'), 
    createDir,
    buildDirectory;
createDir = function(path){
    path.split('/').reduce(function(prev, curr, i){
        if(!fs.existsSync(prev))
            fs.mkdirSync(prev);
        return prev + '/' + curr;
    });
};
buildDirectory = function(src, dest){
    fs.readdir(src, function(err, files){
        if(err){
            console.error('Could not list the directory.', err);
            process.exit(1);
        }
        files.forEach(function(file, index){
            var fromPath = path.join(src, file),
                toPath = path.join(dest, path.basename(file, '.ls') + '.js');
            fs.stat(fromPath, function(err, stat){
                if(err){
                    console.log("An error occured.", err);
                    process.exit(1);
                }
                if(stat.isFile()){
                    if(path.extname(fromPath) === '.ls'){
                        fs.readFile(fromPath, 'utf-8', function(err, data){
                            if(err){
                                console.log("An error occured reading file " + fromPath, err);
                                process.exit(1);
                            }
                            data = LiveScript.compile(data, {header: false});
                            createDir(toPath);
                            fs.writeFile(toPath, data, 'utf-8', function(err){
                                if(err){
                                    console.log("An error occured writing file " + toPath, err);
                                    process.exit(1);
                                }
                            });
                        });
                    }
                } else {
                    return buildDirectory(fromPath, toPath);
                }
            });
        });
        
    });
};
buildDirectory(src, dest);