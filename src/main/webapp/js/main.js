Ext.onReady(() => {
	let displayConfig = {
		disabled: true,
		username: "",
		email: "",
		password: "",
		confirmpassword: "",
	};


	Ext.define('RegisteredUser', {
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'user_name', type: 'string' },
			{ name: 'user_email', type: 'string' },
		],
	});

	let registerUserStore = Ext.create('Ext.data.Store', {
		storeId: 'registeredUserStore',
		model: 'RegisteredUser',
		proxy: {
			type: 'ajax',
			url: 'http://localhost:8080/HyderabadReadinessProjectsServletsFinal/GetAllRegisteredUser',
			reader: {
				type: 'json',
				rootProperty: 'registeredUser'
			}
		},
		autoLoad: true
	});


	// mainContainer
	let mainPanel = Ext.create("Ext.panel.Panel", {
		layout: {
			type: "vbox",
		},
		id: "mainPanel",
		items: [
			{
				xtype: "panel",
				id: "topPanel",
				border: true,
				layout: {
					type: "hbox",
					align: "center",
				},
				bodyPadding: 15,
				margin: 20,
				items: [
					{
						xtype: "label",
						html: "Hyd Readiness 2023",
						style: { fontSize: "30px", fontWeight: "bold" },
						margin: "5 50 5 20",
					},
					{
						xtype: "image",
						width: 300,
						height: 70,
						src: "https://cdn-resources.highradius.com/resources/wp-content/uploads/2020/03/Highradius-logo.png",
						margin: "5 20 5 50",
					},
				],
			},
			{
				xtype: "panel",
				id: "bottomPanel",
				border: true,
				layout: {
					type: "vbox",
					align: "center",
					pack: "center",
				},
				bodyPadding: 5,
				margin: "0 20 20 20",
				items: [
					{
						xtype: "form",
						layout: "center",
						id: "userform",
						buttonAlign: "center",
						border: false,
						items: [
							{
								xtype: "fieldcontainer",
								width: 755,
								height: 350,
								region: "center",
								id: "formfieldcontainer",
								layout: {
									type: "vbox",
									pack: "center",
									align: "center",
								},
								items: [
									{
										xtype: "textfield",
										fieldLabel: "Username",
										name: "username",
										id: "username",
										margin: "10 10 10 10 ",
										labelWidth: "20",
										emptyText: "Username",
									},
									{
										xtype: "textfield",
										fieldLabel: "Email",
										name: "email",
										id: "email",
										emptyText: "Email Address",
										margin: "10 10 10 10 ",
										vtype: "email",
										labelWidth: "20",
										inputType: "email",
									},
									{
										xtype: "textfield",
										fieldLabel: "Password",
										name: "password",
										id: "password",
										emptyText: "Password",
										margin: "10 10 10 10 ",
										labelWidth: "20",
										inputType: "password",
									},
									{
										xtype: "textfield",
										fieldLabel: "Confirm<br>Password",
										name: "confirmpassword",
										id: "confirmpassword",
										emptyText: "Confirm Password",
										margin: "10 10 10 10 ",
										labelWidth: "20",
										inputType: "password",
									},
								],
							},
						],
					},
					{
						xtype: "button",
						id: "registerbutton",
						layout: {
							align: "center",
							pack: "center",
						},
						text: "Register",
						formBind: true,
						textAlign: "center",
						margin: "0 10 20 10 ",
						disabled: true,
						listeners: {
							click: (e) => {
								let usernameField = Ext.getCmp("username");
								let emailField = Ext.getCmp("email");
								let passwordField = Ext.getCmp("password");
								let confirmpasswordField = Ext.getCmp("confirmpassword");
								let registerButton = Ext.getCmp("registerbutton");
								let newUser = {
									username: usernameField.getValue(),
									email: emailField.getValue(),
									password: passwordField.getValue(),
								};
								let confirmpassword_input = confirmpasswordField.getValue();
								if (
									newUser.username != "" &&
									newUser.email != "" &&
									newUser.password != "" &&
									confirmpassword_input != ""
								) {
									if (confirmpassword_input == newUser.password) {
										let availableDataFromStore = registerUserStore.findRecord('user_email', newUser.email);
										console.log(availableDataFromStore);
										if (availableDataFromStore !== null) {
											Ext.Msg.show({
												title: "Error",
												message: `User Already Registered.<br/> UserName : ${availableDataFromStore.data.user_name}`,
												buttons: Ext.Msg.OKCANCEL,
												closable: false,
											});
											usernameField.reset();
											emailField.reset();
											passwordField.reset();
											confirmpasswordField.reset();
											registerButton.disable();
										} else {
											Ext.Ajax.request({
												method: "POST",
												cors: true,
												responseType: "json",
												headers: { 'Content-Type': 'application/json' },
												url: `http://localhost:8080/HyderabadReadinessProjectsServletsFinal/RegisterUser`,
												jsonData: newUser,
												success: (response) => {
													console.log(response);
													let successRowsEntryCount = Ext.JSON.decode(response.responseText);
													console.log(successRowsEntryCount);
													Ext.Msg.show({
														title: "Registration Successful",
														message: `User Registered Successfully. <br/><br/> UserName : ${newUser.username}`,
														buttons: Ext.Msg.OKCANCEL,
													});
													usernameField.reset();
													emailField.reset();
													passwordField.reset();
													confirmpasswordField.reset();
													registerButton.disable();
													registerUserStore.sync();
													registerUserStore.reload();
												},
												failure: (_response) => {
													console.log(
														"Some Error Occoured ,Please Try Again"
													);
												},
											});
										}

									} else {
										Ext.Msg.alert(
											"Password Mismatch",
											"Please enter the same password!"
										);
										confirmpasswordField.reset();
										confirmpasswordField.focus();
										registerButton.disable();
									}
								} else {
									Ext.Msg.alert(
										"Warning",
										"Please fill all the required details"
									);
								}
							},
						},
					},
				],
			},
		],
	});

	// parentContiner
	Ext.create("Ext.container.Container", {
		id: "parentContainer",
		layout: {
			type: "vbox",
		},
		bodyPadding: "10",
		renderTo: document.getElementById("root"),
		// renderTo: root,
		items: [mainPanel],
	});

	let usernameContainer = document.querySelector("#username input");
	let emailContainer = document.querySelector("#email input");
	let passwordContainer = document.querySelector("#password input");
	let confirmPasswordContainer = document.querySelector(
		"#confirmpassword input"
	);
	let registerButton = Ext.getCmp("registerbutton");
	const buttonDisplayHandler = (elementName, elementValue) => {
		displayConfig = { ...displayConfig, [elementName]: elementValue };
		if (
			displayConfig.username !== "" &&
			displayConfig.email !== "" &&
			displayConfig.password !== "" &&
			displayConfig.confirmpassword != ""
		) {
			displayConfig = { ...displayConfig, disabled: false };
			registerButton.enable();
		} else {
			displayConfig = { ...displayConfig, disabled: true };
			registerButton.disable();
		}
	};

	usernameContainer.addEventListener("keyup", (e) =>
		buttonDisplayHandler(e.target.name, e.target.value)
	);
	emailContainer.addEventListener("keyup", (e) =>
		buttonDisplayHandler(e.target.name, e.target.value)
	);
	passwordContainer.addEventListener("keyup", (e) =>
		buttonDisplayHandler(e.target.name, e.target.value)
	);
	confirmPasswordContainer.addEventListener("keyup", (e) =>
		buttonDisplayHandler(e.target.name, e.target.value)
	);
});
