const default_data = {
	event_or_alarm: "event",
	notify: true,
	instant_or_lengthy: "instant",
	duration_or_date: "duration",
	repeat: false,
	date_or_index_or_duration: "date",
};

const storage_item = sessionStorage.getItem("calendar_liff_data");

const data = storage_item === null ? default_data : { ...default_data, ...JSON.parse(storage_item) };

data.notify === "true" ? data.notify = true : null;
data.repeat === "true" ? data.repeat = true : null;
data.notify === "false" ? data.notify = false : null;
data.repeat === "false" ? data.repeat = false : null;

if (typeof data.notify !== "boolean") {
	data.notify = default_data.notify;
}
if (typeof data.repeat !== "boolean") {
	data.repeat = default_data.repeat;
}

document.addEventListener("DOMContentLoaded", () => {
	function updateValues() {
		if (Object.hasOwn(data, "date")) {
			document.getElementById("event_end_date").value = data.date;
			document.getElementById("event_end_date").min = data.date;
		} else {
			alert("Error: date not recognized");
		}
		
		document.getElementById("is_event").checked = data.event_or_alarm === "event";
		document.getElementById("is_alarm").checked = data.event_or_alarm === "alarm";
		
		document.getElementById("notify").checked = data.notify;
		
		document.getElementById("is_instant").checked = data.instant_or_lengthy === "instant";
		document.getElementById("is_lengthy").checked = data.instant_or_lengthy === "lengthy";
		
		document.getElementById("repeat").checked = data.repeat;
		
		for (key in data) {
			if (!Object.hasOwn(default_data, key) && typeof data[key] === "string") {
				document.getElementById(key).value = data[key];
			}
		}
	}
	
	updateValues();
	
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
		
		if (data.event_or_alarm === "event") {
			toggleOn(["if_event", "notify", "is_instant", "is_lengthy"]);
			
			if (data.instant_or_lengthy === "lengthy") {
				switch (data.duration_or_date) {
					case "duration":
						toggleOn(["if_lengthy", "event_duration_div", "event_duration_years", "event_duration_months", "event_duration_days", "event_duration_hours", "event_duration_minutes", "event_duration_button"]);
						break;
					
					case "date":
						toggleOn(["if_lengthy", "event_end_div", "event_end_date", "event_end_time", "event_end_button"]);
						break;
					
					default:
						alert("Error: data corrupted");
				}
			} else if (data.instant_or_lengthy !== "instant") {
				alert("Error: data corrupted");
			}
		} else if (data.event_or_alarm !== "alarm") {
			alert("Error: data corrupted");
		}
		
		if (data.repeat) {
			toggleOn(["if_repeat", "repeat_interval_years", "repeat_interval_months", "repeat_interval_days", "repeat_interval_hours", "repeat_interval_minutes"]);
			
			switch (data.date_or_index_or_duration) {
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
					alert("Error: data corrupted");
			}
		}
	}
	
	document.getElementById("is_event").onclick = () => {
		data.event_or_alarm = "event";
		updateCollapsible();
	};
	document.getElementById("is_alarm").onclick = () => {
		data.event_or_alarm = "alarm";
		updateCollapsible();
	};
	
	document.getElementById("notify").onclick = () => {
		data.notify = !data.notify;
		updateCollapsible();
	};
	
	document.getElementById("is_instant").onclick = () => {
		data.instant_or_lengthy = "instant";
		updateCollapsible();
	};
	document.getElementById("is_lengthy").onclick = () => {
		data.instant_or_lengthy = "lengthy";
		updateCollapsible();
	};
	
	document.getElementById("event_duration_button").onclick = () => {
		data.duration_or_date = "date";
		updateCollapsible();
	};
	document.getElementById("event_end_button").onclick = () => {
		data.duration_or_date = "duration";
		updateCollapsible();
	};
	
	document.getElementById("repeat").onclick = () => {
		data.repeat = !data.repeat;
		updateCollapsible();
	};
	
	document.getElementById("repeat_end_button").onclick = () => {
		data.date_or_index_or_duration = "index";
		updateCollapsible();
	};
	document.getElementById("repeat_index_button").onclick = () => {
		data.date_or_index_or_duration = "duration";
		updateCollapsible();
	};
	document.getElementById("repeat_duration_button").onclick = () => {
		data.date_or_index_or_duration = "date";
		updateCollapsible();
	};
	
	updateCollapsible();
	
	document.getElementById("form_submit_button").onclick = () => {
		if (document.getElementById("repeat_end_date").value === "" && document.getElementById("repeat_end_time").value === "") {
			document.getElementById("repeat_end_date").removeAttribute("required");
			document.getElementById("repeat_end_time").removeAttribute("required");
		} else {
			document.getElementById("repeat_end_date").setAttribute("required", "");
			document.getElementById("repeat_end_time").setAttribute("required", "");
		}
	};
	
	document.getElementById("form").onsubmit = (event) => {
		alert("Form submitted before LIFF was initialized - Please try again later");
		
		event.preventDefault();
	};
	
	liff.init({
			liffId: "2006289768-NrQ6QZLK",
		})
		.then(() => {
			document.getElementById("form").onsubmit = (event) => {
				const data_to_send = {};
				
				for ([key, value] of new FormData(document.getElementById("form"))) {
					if (typeof key !== "string") {
						alert(`${key} is not a string`);
					}
					if (typeof value !== "string") {
						alert(`${value} is not a string`);
					}
					
					data_to_send[key] = value;
				}
				
				if (data_to_send.event_or_alarm === "event" && !Object.hasOwn(data_to_send, "notify")) {
					data_to_send["notify"] = "false";
				}
				if (!Object.hasOwn(data_to_send, "repeat")) {
					data_to_send["repeat"] = "false";
				}
				
				if (!document.getElementById("event_duration_button").hasAttribute("disabled")) {
					data_to_send["duration_or_date"] = "duration";
				}
				if (!document.getElementById("event_end_button").hasAttribute("disabled")) {
					data_to_send["duration_or_date"] = "date";
				}
				
				if (!document.getElementById("repeat_end_button").hasAttribute("disabled")) {
					data_to_send["date_or_index_or_duration"] = "date";
				}
				if (!document.getElementById("repeat_index_button").hasAttribute("disabled")) {
					data_to_send["date_or_index_or_duration"] = "index";
				}
				if (!document.getElementById("repeat_duration_button").hasAttribute("disabled")) {
					data_to_send["date_or_index_or_duration"] = "duration";
				}
				
				data_to_send["id_token"] = liff.getIDToken();
				
				if (data_to_send["id_token"] === null) {
					alert("ID Token could not be retrieved");
					data_to_send["id_token"] = "TEST_USER";
				}
				
				fetch("https://script.google.com/macros/s/AKfycbzzsiUsPrLP1PPYYwmlyr8lvCk6rxYJUT5HxqDVr5tiVR2SexSt2SCPetj8p01v55zf/exec", {
					headers: {
						"Content-Type": "text/plain;charset=utf-8",
					},
					method: "POST",
					body: JSON.stringify(data_to_send),
					redirect: "follow",
				}).then((res) => {
					if (!res.ok) {
						throw new Error(`Failed with HTTP status code ${res.status}`);
					}
					
					return res.text();
				}).then((res) => {
					console.log(res);
				}).catch((err) => {
					console.log(err);
				});
				
				event.preventDefault();
			};
		})
		.catch((err) => {
			alert(`Error: LIFF initialization failed: ${err}`);
		});
});