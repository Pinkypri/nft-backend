const { mailOptions } = require("../../orders/helpers/utils");

module.exports = {
    invoiceMail(data) {
		let htmlString = "<tr>" +
			"<td>" +
				"<p>"+ "Hi," + "</p>" +
				"<p>" + "Thanks for shopping with us." +
				"<br><br>" +
				"Your Product details are as below (Invoice No:) and softcopy of your invoice is attached for your future reference." +
				"<br>" +
				"<ol>" + 
					"{{LIST}}" +
				"</ol>" +
				"In-case of any query, please reachout to us: +91XXXXXXXXXX; email@email.com" +
				"<br>" +
				"Once again thank you so much for shopping, " +
				"Look forward to see you again." +
			"</td>" +
		"</tr>";
		let itemListString = "";
		data.forEach(item => {
			itemListString = itemListString + "<li>" + item.ProductMaster.ProductName + "</li>";
		});

		htmlString = htmlString.replace(new RegExp('{{LIST}}', 'g'), itemListString);
		let result = {
			'subject': "Your Invoice [XXXXXXX] attached",
			'messageBody': htmlString
		}
		return result;
	},
	clientLoginMail(data) {
		let htmlString = "<tr>" +
			"<td>" +
				"<p>"+ "Hi " + data.FirstName + ",</p>" +
				"<p>" + "Thank you so much trusting anec(dot) services." +
				"<br><br>" +
				"Please find your login credentials to login:" +
				"<br>" +
				"<ol style='list-style-type:none;'>" + 
					"{{DATA}}" +
				"</ol>" +
				"In-case of any query, please reachout to us: +91XXXXXXXXXX; email@email.com" +
				"<br><br>" +
				"Once again thank you so much for shopping, " +
				"Look forward to see you again." +
			"</td>" +
		"</tr>";
		let dataString = "<li>Username: " + data.Email +"</li><li>Password: "+ data.Password +"</li>";
		htmlString = htmlString.replace(new RegExp('{{DATA}}', 'g'), dataString);
		let result = {
			'subject': "Your anec(dot) login details",
			'messageBody': htmlString
		}
		return result;
	}
}
