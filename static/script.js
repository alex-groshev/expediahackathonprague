
$(document).ready(function () {
	$(".wait").hide();
	$(".posContainer").hide();
	$(".valuesContainer").hide();
	$(".actionsContainer").hide();
	$("#output").hide();
	$("#promoPanel").hide();
});



function diplayDashboard() {
	$(".wait").show();
	$(".posContainer").hide();
	$(".valuesContainer").hide();
	$(".actionsContainer").hide();
	$("#output").hide();
	$("#promoPanel").hide();

	drawPOS();
}



function drawPOS() {
	var hotelID = 15240008;
	var username = "EQCRateGain";
	var password = "kaB7tRuP";
	var host = "https://services.expediapartnercentral.com";


	$.ajax({
		type: "GET",
		url: host + '/top-tpids/lodgingSort/v1/hops/HopsTopTpidsAndRegions',
		data: {
			'hotelId': hotelID
		},
		headers: {
			'Authorization': 'Basic ' + window.btoa(username + ':' + password),
			'Accept': 'application/json'
		},
		dataType: 'json',
		success: function (data) {

			$("#posList").html("");

			for (var i in data.hopsTpidsList) {

				var posID = data.hopsTpidsList[i].tpid;

				var counter = 0;
				for (var j in data.hopsTpidsList[i].sortedRegionList) {

					var regionId = data.hopsTpidsList[i].sortedRegionList[j];
					var endpoint = "http://localhost:5000/names/pos/" + posID + "/region/" + regionId;

					$.ajax({
						type: "GET",
						url: endpoint,
						success: function (our_data) {
							var jsonData = JSON.parse(our_data);
							$("#posList").append(writePOSRow(jsonData.posId, jsonData.regionId, jsonData.pos, jsonData.region));
							$(".wait").hide();
							$(".posContainer").show();
							$("#datepicker_" + jsonData.posId + "_" + jsonData.regionId).datepicker({
								dateFormat: "yy-mm-dd",
								onSelect: function () {
									var dateStr = $("#datepicker_" + posID + "_" + jsonData.regionId).val();
									drawRate(posID, jsonData.regionId, dateStr, "1");
								},
								disabled: (counter === 1)
							});
							counter++;
						},
						error: function (jqXHR, textStatus, errorThrown) {
							$("#output").show();
							$("#output").html('<strong>ERROR</strong>:&nbsp;' + jqXHR.responseText + " - " + textStatus + " - " + JSON.stringify(errorThrown));
						}
					});
				}
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("#output").show();
			$("#output").html('<strong>ERROR</strong>:&nbsp;' + jqXHR.responseText + " - " + textStatus + " - " + JSON.stringify(errorThrown));
		}
	});

}




function drawRate(posID, regionID, dateStr, btnOrder) {
	$("#output").hide();

	var hotelID = 15240008;
	var endpoint = "http://localhost:5000/series/hotel/" + hotelID + "/pos/" + posID + "/region/" + regionID + "/searchDate/" + dateStr;

	$.ajax({
		type: "GET",
		url: endpoint,
		success: function (data) {
			showData(JSON.parse(data));

			// display actions
			$(".actionsContainer").show();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("#output").show();
			$("#output").html('<strong>ERROR</strong>:&nbsp;' + jqXHR.responseText + " - " + textStatus + " - " + JSON.stringify(errorThrown));
		}
	});


	// get stats
	var stats_endpoint = "http://localhost:5000/stats/hotel/" + hotelID + "/pos/" + posID + "/region/" + regionID + "/searchDate/" + dateStr;
	$.ajax({
		type: "GET",
		url: stats_endpoint,
		success: function (stats_data) {
			showStats(JSON.parse(stats_data));
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
		labelList[i] = dataSerie[i].checkinDate;

		avgRankList[i] = parseFloat(dataSerie[i].avgRank);
		avgRateList[i] = parseFloat(dataSerie[i].avgPrice);
		avgCompList[i] = parseFloat(dataSerie[i].avgComp);
	}

	$(".valuesContainer").show();
	drawLineChart(labelList, avgRateList, "rate_avg_chart");
	drawLineChart(labelList, avgRankList, "rank_avg_chart");
	drawLineChart(labelList, avgCompList, "comp_avg_chart");

	$('html, body').animate({
		scrollTop: $("#chartsDiv").offset().top
	}, 1000);
}




function promoFill() {
	var hotelID = 15240008;
	var endpoint = "http://localhost:5000/promos/" + hotelID;
	
	$.ajax({
		type: "GET",
		url: endpoint,
		success: function (data) {
			var dataSerie = JSON.parse(data);

			var counter = 1;
			for (var i in dataSerie.percents) {

				$("#promo_perc_" + counter).html(fixNumber(dataSerie.percents[i]));
				$("#promo_score_" + counter).html(fixNumber(dataSerie.scores[i]));
				counter++;
			}
			
			$("#promoPanel").show();
			
			$('html, body').animate({
				scrollTop: $("#promoPanel").offset().top
			}, 1000);
			
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("#output").show();
			$("#output").html('<strong>ERROR</strong>:&nbsp;' + jqXHR.responseText + " - " + textStatus + " - " + JSON.stringify(errorThrown));
		}
	});
}




function showStats(dataSerie) {
	$("#rate_avg").html(fixNumber(dataSerie.avg.price));
	$("#rate_min").html(fixNumber(dataSerie.min.price));
	$("#rate_max").html(fixNumber(dataSerie.max.price));
	$("#rate_std_dev").html(fixNumber(dataSerie.std.price));

	$("#rank_avg").html(fixNumber(dataSerie.avg.rank));
	$("#rank_min").html(fixNumber(dataSerie.min.rank));
	$("#rank_max").html(fixNumber(dataSerie.max.rank));
	$("#rank_std_dev").html(fixNumber(dataSerie.std.rank));

	$("#comp_avg").html(fixNumber(dataSerie.avg.comp));
	$("#comp_min").html(fixNumber(dataSerie.min.comp));
	$("#comp_max").html(fixNumber(dataSerie.max.comp));
	$("#comp_std_dev").html(fixNumber(dataSerie.std.comp));
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




function writePOSRow(posID, regionID, posName, regionName) {

	var string = "<tr><td>" + posName + " (" + posID + ")</td>";
	string += "<td>" + regionName + " (" + regionID + ")</td><td>";
	string += "<input type='text' id='datepicker_" + posID + "_" + regionID + "'>";
	string += "</td></tr>";

	return string;
}



function fixNumber(string) {
	return parseFloat(Math.round(string * 100) / 100).toFixed(2);
}



/**
 * OLD
 */
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


