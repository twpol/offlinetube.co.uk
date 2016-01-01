define({
	name: 'Stockwell',
	links: [
		{
			a: ['northern-morden-bank-edgware', 'northern-morden-bank-high-barnet', 'northern-morden-charing-cross-edgware', 'northern-morden-charing-cross-high-barnet'],
			b: [''],
			at: ['L1B']
		},
		{
			_a: ['northern-high-barnet-morden'],
			b: [''],
			at: ['L6C']
		},
		{
			from: ['northern-morden-bank-edgware', 'northern-morden-bank-high-barnet', 'northern-morden-charing-cross-edgware', 'northern-morden-charing-cross-high-barnet'],
			to: ['victoria'],
			at: ['L3C', 'L4B', 'L5B', 'L6A', 'L6B'] // Northern Line positions
		},
		{
			from: ['victoria'],
			to: ['northern-morden-bank-edgware', 'northern-morden-bank-high-barnet', 'northern-morden-charing-cross-edgware', 'northern-morden-charing-cross-high-barnet'],
			at: ['R1C', 'R2A', 'R2C', 'R4B', 'R4C'] // Victoria Line positions
		}
	]
});