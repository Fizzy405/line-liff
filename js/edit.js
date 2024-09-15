const prioritizeDuration = true;
const status = {
	event_or_alarm: "INIT_VAL",
	instant_or_lengthy: "INIT_VAL",
	duration_or_date: "INIT_VAL",
};

document.addEventListener("DOMContentLoaded", () => {
	const url = new URL(window.location.href);
	const decoded_params = decodeURIComponent(url.search);
	const clicked_date = new URLSearchParams(decoded_params).get("date");
	
	document.getElementById("event_end_date").value = clicked_date;
	document.getElementById("event_end_date").min = clicked_date;
	
	document.getElementById("is_event").checked ? status.event_or_alarm = "event" : null;
	document.getElementById("is_alarm").checked ? status.event_or_alarm = "alarm" : null;
	
	document.getElementById("is_instant").checked ? status.instant_or_lengthy = "instant" : null;
	document.getElementById("is_lengthy").checked ? status.instant_or_lengthy = "lengthy" : null;
	
	status.duration_or_date = prioritizeDuration ? "duration" : "date";
	
	JSON.stringify(status).includes("INIT_VAL") ? alert("Error: status not updated") : null;
	
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
		
		for (element of document.querySelectorAll(`#${parentId} div:not(div#event_duration_div > div)`)) {
			element.style.display = "none";
		}
		
		for (element of document.querySelectorAll(`#${parentId} input, #${parentId} button`)) {
			element.setAttribute("disabled", "");
		}
	}
	
	function updateCollapsible() {
		toggleOff("if_event");
		
		if (status.event_or_alarm === "event") {
			toggleOn(["if_event", "notify", "is_instant", "is_lengthy"]);
			
			if (status.instant_or_lengthy === "lengthy") {
				if (status.duration_or_date === "duration") {
					toggleOn(["if_lengthy", "event_duration_div", "event_duration_years", "event_duration_months", "event_duration_days", "event_duration_hours", "event_duration_minutes", "event_duration_button"]);
				} else {
					toggleOn(["if_lengthy", "event_end_div", "event_end_date", "event_end_time", "event_end_button"]);
				}
			} else if (status.instant_or_lengthy !== "instant") {
				alert("Error: status corrupted");
			}
		} else if (status.event_or_alarm !== "alarm") {
			alert("Error: status corrupted");
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
	
	updateCollapsible();
});