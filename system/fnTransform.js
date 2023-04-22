

// v.0.3 NEU
// ersetzt die Position (-1, 0, 1) mit dem passenden Button
export function fnTransformPositionToButton(position)
{
	var tempShiftedPosition = position + 1; 
	return ["btn-danger","btn-default","btn-success"][tempShiftedPosition];
}

// v.0.3 NEU
// ersetzt die Position (-1, 0, 1) mit dem passenden Icon
export function fnTransformPositionToIcon(position)
{
	var tempShiftedPosition = position + 1; 
	return ["&#x2716;","&#x21B7;","&#x2714;"][tempShiftedPosition];
}

// ersetzt die Partei-Position (-1, 0, 1) mit der passenden Farbe
export function fnTransformPositionToColor(position)
{
	var tempShiftedPosition = position + 1; 
	return ["#d9534f","#c0c0c0","#5cb85c"][tempShiftedPosition];
	
}


// ersetzt die Partei-Position (-1, 0, 1) mit dem passenden Text
export function fnTransformPositionToText(position)
{
	var tempShiftedPosition = position + 1; 
	return ["[-]","[/]","[+]"][tempShiftedPosition];
	
}
