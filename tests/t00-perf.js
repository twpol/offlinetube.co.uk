var
	listBase64 = '',
	listNumber = [],
	listString = [],
	itemCount = 512,
	iterations = itemCount * 1000,
	targetBase64s = [],
	targetNumbers = [],
	targetStrings = [],
	start,
	end;

for (var i = 0; i < itemCount; i++) {
	var num = Math.floor(Math.random() * itemCount);
	var numParts = [(num >> 8) & 0xFF, (num >> 0) & 0xFF];
	listBase64 += Buffer.from(numParts).toString('base64');
	listNumber.push(Number(num));
	listString.push(String(num));

	var iParts = [(i >> 8) & 0xFF, (i >> 0) & 0xFF];
	targetBase64s += Buffer.from(iParts).toString('base64');
	targetNumbers.push(Number(i));
	targetStrings.push(String(i));
}

start = Date.now();
for (var i = 0; i < iterations; i++) {
	listBase64.indexOf(targetBase64s[i % itemCount]);
}
end = Date.now();
console.log('%d ms base64', end - start);

start = Date.now();
for (var i = 0; i < iterations; i++) {
	listNumber.indexOf(targetNumbers[i % itemCount]);
}
end = Date.now();
console.log('%d ms [Number]', end - start);

start = Date.now();
for (var i = 0; i < iterations; i++) {
	listString.indexOf(targetStrings[i % itemCount]);
}
end = Date.now();
console.log('%d ms [String]', end - start);
