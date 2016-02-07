define({
	name: 'Stockwell',
	links: [
		{
			a: ['morden-bank-edgware', 'morden-bank-high-barnet', 'morden-charing-cross-edgware', 'morden-charing-cross-high-barnet'],
			b: [''],
			at: ['L1B']
		},
		{
			_a: ['high-barnet-morden'],
			b: [''],
			at: ['L6C']
		},
		{
			from: ['morden-bank-edgware', 'morden-bank-high-barnet', 'morden-charing-cross-edgware', 'morden-charing-cross-high-barnet'],
			to: ['brixton-walthamstow-central'],
			at: ['L3C', 'L4B', 'L5B', 'L6A', 'L6B'] // Northern Line positions
		},
		{
			from: ['brixton-walthamstow-central'],
			to: ['morden-bank-edgware', 'morden-bank-high-barnet', 'morden-charing-cross-edgware', 'morden-charing-cross-high-barnet'],
			at: ['R1C', 'R2A', 'R2C', 'R4B', 'R4C'] // Victoria Line positions
		}
	]
});