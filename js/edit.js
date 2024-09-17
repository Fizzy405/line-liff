const status = {
	event_or_alarm: "event",
	notify: true,
	instant_or_lengthy: "instant",
	duration_or_date: "duration",
	repeat: false,
	date_or_index_or_duration: "date",
};

document.addEventListener("DOMContentLoaded", () => {
	const url = new URL(window.location.href);
	const decoded_params = decodeURIComponent(url.search);
	const clicked_date = new URLSearchParams(decoded_params).get("date");
	
	document.getElementById("event_end_date").value = clicked_date;
	document.getElementById("event_end_date").min = clicked_date;
	
	document.getElementById("is_event").checked = status.event_or_alarm === "event";
	document.getElementById("is_alarm").checked = status.event_or_alarm === "alarm";
	
	document.getElementById("notify").checked = status.notify;
	
	document.getElementById("is_instant").checked = status.instant_or_lengthy === "instant";
	document.getElementById("is_lengthy").checked = status.instant_or_lengthy === "lengthy";
	
	document.getElementById("repeat").checked = status.repeat;
	
	function toggleOn(elementIds) {
		for (elementId of elementIds) {
			const element = document.getElementById(elementId);
			
			switch (element.tagName) {
				case "DIV":
					element.style.display = "block";
					break;
				
				case "INPUT":
				case "BUTTON":
					element.removeAttribute("disabled");
					break;
				
				default:
					alert("Error: toggled invalid element");
			}
		}
	}
	
	function toggleOff(parentId) {
		if (document.getElementById(parentId).tagName === "DIV") {
			document.getElementById(parentId).style.display = "none";
		}
		
		for (element of document.querySelectorAll(`#${parentId} div:not(div[data-styling-div])`)) {
			element.style.display = "none";
		}
		
		for (element of document.querySelectorAll(`#${parentId} input, #${parentId} button`)) {
			element.setAttribute("disabled", "");
		}
	}
	
	function updateCollapsible() {
		toggleOff("if_event");
		toggleOff("if_repeat");
		
		if (status.event_or_alarm === "event") {
			toggleOn(["if_event", "notify", "is_instant", "is_lengthy"]);
			
			if (status.instant_or_lengthy === "lengthy") {
				switch (status.duration_or_date) {
					case "duration":
						toggleOn(["if_lengthy", "event_duration_div", "event_duration_years", "event_duration_months", "event_duration_days", "event_duration_hours", "event_duration_minutes", "event_duration_button"]);
						break;
					
					case "date":
						toggleOn(["if_lengthy", "event_end_div", "event_end_date", "event_end_time", "event_end_button"]);
						break;
					
					default:
						alert("Error: status corrupted");
				}
			} else if (status.instant_or_lengthy !== "instant") {
				alert("Error: status corrupted");
			}
		} else if (status.event_or_alarm !== "alarm") {
			alert("Error: status corrupted");
		}
		
		if (status.repeat) {
			toggleOn(["if_repeat", "repeat_interval_years", "repeat_interval_months", "repeat_interval_days", "repeat_interval_hours", "repeat_interval_minutes"]);
			
			switch (status.date_or_index_or_duration) {
				case "date":
					toggleOn(["repeat_end_div", "repeat_end_date", "repeat_end_time", "repeat_end_button"]);
					break;
				
				case "index":
					toggleOn(["repeat_index_div", "repeat_index", "repeat_index_button"]);
					break;
				
				case "duration":
					toggleOn(["repeat_duration_div", "repeat_duration_years", "repeat_duration_months", "repeat_duration_days", "repeat_duration_hours", "repeat_duration_minutes", "repeat_duration_button"]);
					break;
				
				default:
					alert("Error: status corrupted");
			}
		}
	}
	
	document.getElementById("is_event").onclick = () => {
		status.event_or_alarm = "event";
		updateCollapsible();
	};
	document.getElementById("is_alarm").onclick = () => {
		status.event_or_alarm = "alarm";
		updateCollapsible();
	};
	
	document.getElementById("notify").onclick = () => {
		status.notify = !status.notify;
		updateCollapsible();
	};
	
	document.getElementById("is_instant").onclick = () => {
		status.instant_or_lengthy = "instant";
		updateCollapsible();
	};
	document.getElementById("is_lengthy").onclick = () => {
		status.instant_or_lengthy = "lengthy";
		updateCollapsible();
	};
	
	document.getElementById("event_duration_button").onclick = () => {
		status.duration_or_date = "date";
		updateCollapsible();
	};
	document.getElementById("event_end_button").onclick = () => {
		status.duration_or_date = "duration";
		updateCollapsible();
	};
	
	document.getElementById("repeat").onclick = () => {
		status.repeat = !status.repeat;
		updateCollapsible();
	};
	
	document.getElementById("repeat_end_button").onclick = () => {
		status.date_or_index_or_duration = "index";
		updateCollapsible();
	};
	document.getElementById("repeat_index_button").onclick = () => {
		status.date_or_index_or_duration = "duration";
		updateCollapsible();
	};
	document.getElementById("repeat_duration_button").onclick = () => {
		status.date_or_index_or_duration = "date";
		updateCollapsible();
	};
	
	updateCollapsible();
	
	liff
		.init({
			liffId: "2006289768-NrQ6QZLK",
		})
		.then(() => {
			fetch("https://script.google.com/macros/s/AKfycbzxjYqUDMjRCoWsU3Qjr4uWHY8U8fHZ1HDNomiWkUlUj4eqAZP5K36x6CEX7Nyt7Aar/exec", {
				method: "POST",
				body: liff.getIDToken(),
				redirect: "follow",
			}).then((res) => {
				return res.text();
			}).then((res) => {
				console.log(res);
			});
		})
		.catch((err) => {
			alert(`Error: LIFF initialization failed: ${err}`);
		});
	
	/*fetch("https://script.google.com/macros/s/AKfycbzxjYqUDMjRCoWsU3Qjr4uWHY8U8fHZ1HDNomiWkUlUj4eqAZP5K36x6CEX7Nyt7Aar/exec", {
		method: "POST",*/
		/*body: "Test Text",*/
		/*redirect: "follow",
	}).then((res) => {
		return res.text();
	}).then((res) => {
		console.log(res);
	});*/
});