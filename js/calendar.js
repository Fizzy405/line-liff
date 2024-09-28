document.addEventListener("DOMContentLoaded", () => {
	const data = {
		date: null,
	};
	
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
					if (data.date !== null) {
						sessionStorage.setItem("calendar_liff_data", JSON.stringify(data));
						window.location.replace("edit.html");
					} else {
						alert("Error: date not recognized");
					}
				},
			},
		},
		
		viewDidMount: () => {
			const headerToolbar = { start: "title", center: "", end: "" };
			const footerToolbar = { start: "", center: "", end: "" };
			
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
			
			data.date = info.dateStr;
		},
	});
	
	sessionStorage.removeItem("calendar_liff_data");
	
	calendar.render();
	
	liff.init({
			liffId: "2006289768-NrQ6QZLK",
		})
		.catch((err) => {
			alert(`Error: LIFF initialization failed: ${err}`);
		});
});