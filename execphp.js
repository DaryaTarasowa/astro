/**
*
*/
class ExecPHP {
	/**
	*
	*/
	constructor() {
		this.phpPath = '/usr/bin/php7.4';
		this.phpFolder = './php';
	}
	/**
	*
	*/
	parseFile(fileName, parametres, callback) {
		var realFileName = this.phpFolder + fileName;

		console.log('parsing file: ' + realFileName);
		//console.log('parametres: ' + JSON.stringify(parametres));
		var exec = require('child_process').exec;
		var cmd = this.phpPath + ' ' + realFileName + ' ' + parametres;
		exec(cmd, function(error, stdout, stderr) {
			if (stderr){
				console.log(stderr);
				callback(false);
			}else{
				callback(true, stdout);
			}
		});
	}
}
module.exports = function() {
	return new ExecPHP();
};
