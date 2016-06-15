$(document).ready(function () {
	$(".valuesContainer").hide();
	$(".actionsContainer").hide();
	$("#output").hide();
});




function drawRate(posID, regionID) {
	$("#output").hide();
	
//	var fakeData = JSON.parse("[{\"searchDate\": \"2016-06-01\", \"avgRank\": \"320.3\", \"avgRate\": \"120.3\", \"avgComp\": \"20.3\"}, {\"searchDate\": \"2016-06-02\", \"avgRank\": \"32.3\", \"avgRate\": \"121.3\", \"avgComp\": \"25.3\"}]");
//	showData(fakeData);
//	$(".actionsContainer").show();
//	return;

	var hotelID = 15240008;
	var endpoint = "http://localhost:5000/series/hotel/" + hotelID + "/pos/" + posID + "/region/" + regionID;

	$.ajax({
		type: "GET",
		url: endpoint,
		crossDomain:true,
		success: function (data) {
			showData(data);
			$(".actionsContainer").show();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("#output").show();
			$("#output").html('<strong>ERROR</strong>:&nbsp;' + jqXHR.responseText + " - " + textStatus + " - " + JSON.stringify(errorThrown));
		}
	});

}



/*
 * PRIVATE
 */
function showData(dataSerie) {
	var avgCompList = new Array();
	var avgRateList = new Array();
	var avgRankList = new Array();
	var labelList = new Array();
	for (var i in dataSerie) {
		labelList[i] = dataSerie[i].searchDate;

		avgRankList[i] = parseFloat(dataSerie[i].values[0]);
		avgRateList[i] = parseFloat(dataSerie[i].values[1]);
		avgCompList[i] = parseFloat(dataSerie[i].values[2]);
	}


	$(".valuesContainer").show();
	drawBarChart(labelList, avgRateList, "rate_avg_chart");
	drawLineChart(labelList, avgRankList, "rank_avg_chart");
	drawLineChart(labelList, avgCompList, "comp_avg_chart");

	$('html, body').animate({
		scrollTop: $("#chartsDiv").offset().top
	}, 1000);
}




function drawBarChart(labelList, dataList, canvasID) {

	var data = {
		labels: labelList,
		datasets: [
			{
				label: "Rate AVG",
				backgroundColor: "rgba(60,118,71,0.2)",
				borderColor: "rgba(60,118,71,1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(60,118,71,0.4)",
				hoverBorderColor: "rgba(60,118,71,1)",
				data: dataList
			}
		]
	};

	var ctx = document.getElementById(canvasID).getContext("2d");
	new Chart(ctx, {
		type: 'bar',
		data: data,
		options: {
			legend: {
				display: false
			}
		}
	});

}




function drawLineChart(labelList, dataList, canvasID) {
	
	// average calculation
	var avg = 0;
	var counter = 0;
	for (var i in dataList) {
		avg += dataList[i];
		
		counter++;
	}
	
	avg = avg / counter;
	
	var avgList = new Array();
	for (var i in dataList) {
		avgList[i] = avg;
	}


	var data = {
		labels: labelList,
		datasets: [
			{
				label: "Line Chart",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(51,122,183,0.4)",
				borderColor: "rgba(51,122,183,1)",
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: "rgba(51,122,183,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(51,122,183,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: dataList
			},
			{
				label: "AVG Chart",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(235,204,209,0.4)",
				borderColor: "rgba(235,204,209,1)",
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: "rgba(235,204,209,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(235,204,209,1)",
				pointHoverBorderColor: "rgba(235,204,209,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: avgList
			}
		]
	};

	var ctx = document.getElementById(canvasID).getContext("2d");
	new Chart(ctx, {
		type: 'line',
		data: data,
		options: {
			legend: {
				display: false
			}
		}
	});

}