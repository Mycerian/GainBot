const fs = require("fs");

exports.run = (client, message, args) => {
	// Allow a user to sign up in the sign-up channel
	if (message.channel.name.indexOf('signup') == -1) {
		message.channel.send("This command can only be used in a sign-up channel.");
		return false;
	}
	message.delete().catch(O_o=>{}); 

	const signup = args[0];
	const raid = message.channel.name;
	const user = args[1] ? args[1] : message.member.displayName;
	const userName = user.charAt(0).toUpperCase() + user.slice(1).toLowerCase();
	
	var signValue;
	if (signup === '+') {
		signValue = 'yes';
	} else if (signup === '-') {
		signValue = 'no';
	} else if (signup === 'm') {
		signValue = 'maybe';
	} else {
		message.channel.send('Invalid sign-up. Please sign up as "+", "-", or "m".');
		return false;
	}
	
	const fileName = '/tmp/' + raid + '.json';
	let parsedLineup = {};
	if (fs.existsSync(fileName)) {
		currentLineup = fs.readFileSync(fileName, 'utf8');
		parsedLineup = JSON.parse(currentLineup);
	}
	
	parsedLineup[userName] = signValue;
	fs.writeFileSync(fileName, JSON.stringify(parsedLineup)); 
		
	message.channel.fetchPinnedMessages()
		.then(function(list){
			if (!list.length) { return false; }
			pinnedMsg = list.last();
			currentContent = pinnedMsg.content;
			const raid = message.channel.name;
			const fileName = '/tmp/' + raid + '.json';
			let parsedLineup = {};
			if (fs.existsSync(fileName)) {
				currentLineup = fs.readFileSync(fileName, 'utf8');
				parsedLineup = JSON.parse(currentLineup);
			}
			
			let yesArray = [];
			let maybeArray = [];
			let noArray = [];
			
			for (player in parsedLineup) {
				if (parsedLineup[player] === 'yes') {
					yesArray.push(player);
				} else if (parsedLineup[player] === 'maybe') {
					maybeArray.push(player);
				} else if (parsedLineup[player] === 'no') {
					noArray.push(player);
				}
			}
			
			pinnedMsg.edit(
				'Please let the officers know if you will be able to make this raid by signing up here with a "+", "-" or "m"\n'
				+ '\n' + "Yes (" + yesArray.length + "): " + yesArray.join(', ') 
				+ '\n' + "Maybe (" + maybeArray.length + "): " + maybeArray.join(', ')
				+ '\n' + "No (" + noArray.length + "): " + noArray.join(', ')
			);
		});		
};