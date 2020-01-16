module.exports = [{
	Agency: "Publicis",
	Client: "Client-Name_Config", 				// ex. "T-Mobile", "CITI"
	Campaign: "Campaign-Name_Config", 			
	Server_Location: "",
	Preview_Page: "default",					// opt. "default", "T-Mobile", "HPE", "CITI"
	Units:[
		{
			Version_Name: "Version1_Name", 		
			Template: "standard", 				// opt. "default", "dynamic", "richmedia", "static"
			Ad_Platforms: "iab", 				// opt. "studio", "iab"
			Click_Tags: 3,						// amount
			Naming_Convention:{
				Name_Before_AdSize: "Q119_038-Before_", 
				Name_After_AdSize: "_After"			
			},		
			Sizes: [
				{ width:300, 	height:250,		fileWeight: 150},
				{ width:160, 	height:600,		fileWeight: 150},
				{ width:300, 	height:600,		fileWeight: 150},
				{ width:320, 	height:50,		fileWeight: 150},
				{ width:728, 	height:90,		fileWeight: 150},
				{ width:970, 	height:66,		fileWeight: 150},
				{ width:970, 	height:250,		fileWeight: 150},
				{ width:1280, 	height:100,		fileWeight: 150}
			],
			Create_BackupImages: "false",
			Third_Party_Plugins: { 				// place third party api or local urls file path in the qoutes below, place local files in "_thirdParty_files"
				Add_Plugins: true,
				File_Paths: [
					"about:blank",
					"about:blank"
				]
			}
		}			
	]
}]

/*
	Gulp Project Init 
		- Fill out banner config, gulp templates
		- Comment out what is not needed on intitial build
		- Run task 
		- Use the unit in the build folder to start development

	Gulp Watch
		- Watch the build folder for any changes
		- Launch dev-tools with all the sizes in the tab
	
	Gulp Resize 
		- After the master is built, add other sizes to config, skip sizes that are already in folder, when adding more sizes
		- If Duplicate_Master: "false", use preset banner templates. If true duplicate master into the specified sizes 
		- Exports all the files into the build folder
		- Change meta tag
	
	Gulp Preview Server
		- validate code
		- add click tag (need a way for multiple click tags)
		- change file names
		- check file size
		- create preview, upload to server

	Gulp Package
		- take units from the build folder
		- validate code
		- add click tag (need a way for multiple click tags)
		- check file size	
		- create backup image
*/