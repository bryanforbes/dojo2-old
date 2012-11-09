define(['exports'], function(exports){
	var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	exports.getDaysInMonth = function(date){
		var month = date.getMonth();
		if(month === 1 && exports.inLeapYear(date)){
			return 29;
		}
		return daysInMonth[month];
	};

	exports.inLeapYear = function(date){
		var year = date.getFullYear();
		return (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0));
	};

	exports.compare = function(date1, date2, portion){
		date1 = new Date(+date1);
		date2 = new Date(+date2);

		if(portion === 'date'){
			date1.setHours(0, 0, 0, 0);
			date2.setHours(0, 0, 0, 0);
		}else if(portion === 'time'){
			date1.setFullYear(0, 0, 0);
			date2.setFullYear(0, 0, 0);
		}

		if(date1 > date2){ return 1; }
		if(date1 < date2){ return -1; }
		return 0;
	};

	var intervals = {
		millisecond: 1,
		second: 2,
		minute: 3,
		hour: 4,
		day: 5,
		month: 6,
		quarter: 7
	};
	exports.add = function(date, interval, amount){
		var sum = new Date(+date),
			fixOvershoot = false,
			property = 'Date';

		if(interval === 'year'){
			property = 'FullYear';
			// Keep increment/decrement from 2/29 out of March
			fixOvershoot = true;
		}else if(interval === 'week'){
			amount *= 7;
		}else if(interval !== 'day'){
			var int = intervals[interval];
			if(interval === 'quarter'){
				// Naive quarter is just three months
				amount *= 3;
			}
			if(int >= intervals.month){
				// quarter and month
				// Reset to last day of month if you overshoot
				fixOvershoot = true;
				property = 'Month';
			}else if(int <= intervals.hour){
				// hour, minute, second, millisecond
				property = "UTC"+interval.charAt(0).toUpperCase() + interval.substring(1) + "s";
			}
		}

		if(property){
			sum['set'+property](sum['get'+property]()+amount);
		}
		if(fixOvershoot && (sum.getDate() < date.getDate())){
			sum.setDate(0);
		}

		return sum;
	};

	exports.subtract = function(date, interval, amount){
		return exports.add(date, interval, amount * -1);
	};

	var factors = {
		day: 86400000,
		hour: 3600000,
		minute: 60000,
		second: 1000,
		millisecond: 1
	};
	exports.difference = function(date1, date2, interval){
		interval = interval || "day";

		var yearDiff = date1.getFullYear() - date2.getFullYear(),
			delta = 1,
			factor;

		if(interval === 'quarter'){
			var m1 = date1.getMonth(),
				m2 = date2.getMonth(),
				// Figure out which quarter the months are in
				q1 = Math.floor(m1/3) + 1,
				q2 = Math.floor(m2/3) + 1;

			// Add quarters for any year difference between the dates
			q2 += (yearDiff * 4);
			delta = q1 - q2;
		}else if(interval === 'year'){
			delta = yearDiff;
		}else if(interval === 'month'){
			delta = (date1.getMonth() - date2.getMonth()) + (yearDiff * 12);
		}else if(interval === 'week'){
			// Truncate instead of rounding
			// Don't use Math.floor since value may be negative
			delta = parseInt(exports.difference(date1, date2, 'day') / 7, 10);
		}else if(factor = factors[interval]){
			delta = (date1 - date2) / factor;
		}

		// Round for fractional values and DST leaps
		return Math.round(delta);
	};
});
