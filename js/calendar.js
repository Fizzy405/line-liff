document.addEventListener("DOMContentLoaded", () => {
	let clicked_date = null;
	
	const calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
		aspectRatio: 0.95,
		initialView: "dayGridMonth",
		
		customButtons: {
			setToMonthView: {
				text: "Month View",
				click: () => {
					calendar.changeView("dayGridMonth");
				},
			},
			setToYearView: {
				text: "Year View",
				click: () => {
					calendar.changeView("multiMonthYear");
				},
			},
			backToMonthView: {
				text: "Back",
				click: () => {
					calendar.changeView("dayGridMonth");
				},
			},
			addEventOrAlarm: {
				text: "+",
				hint: "Add an event or an alarm",
				click: () => {
					if (clicked_date !== null) {
						const url_param_string = `date=${clicked_date}`;
						const encoded_param = encodeURIComponent(url_param_string);
						
						window.location.replace(`edit.html?${encoded_param}`);
					} else {
						alert("Error: date not recognized");
					}
				},
			},
		},
		
		viewDidMount: () => {
			const headerToolbar = { start: "title", center: "", end: "", };
			const footerToolbar = { start: "", center: "", end: "", };
			
			switch (calendar.view.type) {
				case "dayGridMonth":
					headerToolbar.end = "prev next";
					footerToolbar.end = "setToYearView";
					break;
				
				case "multiMonthYear":
					headerToolbar.end = "prev next";
					footerToolbar.end = "setToMonthView";
					break;
				
				case "listDay":
					headerToolbar.end = "backToMonthView";
					footerToolbar.end = "addEventOrAlarm";
					break;
			}
			
			calendar.setOption("headerToolbar", headerToolbar);
			calendar.setOption("footerToolbar", footerToolbar);
		},
		
		dateClick: (info) => {
			calendar.gotoDate(info.date);
			calendar.changeView("listDay");
			
			clicked_date = info.dateStr;
		},
	});
	
	calendar.render();
	
	liff
		.init({
			liffId: "2006289768-NrQ6QZLK",
		})
		.then(() => {
			/*console.log(liff.getIDToken());
			fetch("https://script.google.com/macros/s/AKfycbzxjYqUDMjRCoWsU3Qjr4uWHY8U8fHZ1HDNomiWkUlUj4eqAZP5K36x6CEX7Nyt7Aar/exec", {
				method: "POST",
				body: JSON.stringify(liff.getIDToken()),
				redirect: "follow",
			}).then((res) => {
				return res.text();
			}).then((res) => {
				console.log(res);
			});*/
			alert("ID Token: ", JSON.stringify(liff.getIDToken()));
			alert(typeof liff.getIDToken() === "undefined");
			alert(liff.getIDToken() === null);
			alert(typeof liff.getIDToken() === "object");
			alert(liff.getIDToken());
		})
		.catch((err) => {
			alert(`Error: LIFF initialization failed: ${err}`);
		});
});