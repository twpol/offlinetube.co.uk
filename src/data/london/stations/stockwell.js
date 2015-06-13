define({
	name: 'Stockwell',
	links: [
		{
			a: ['northern-mo-bk-ed', 'northern-mo-bk-hb', 'northern-mo-cx-ed', 'northern-mo-cx-hb'],
			b: [''],
			at: ['L1B']
		},
		{
			_a: ['northern-hb-mo'],
			b: [''],
			at: ['L6C']
		},
		{
			from: ['northern-mo-bk-ed', 'northern-mo-bk-hb', 'northern-mo-cx-ed', 'northern-mo-cx-hb'],
			to: ['victoria'],
			at: ['L3C', 'L4B', 'L5B', 'L6A', 'L6B'] // Northern Line positions
		},
		{
			from: ['victoria'],
			to: ['northern-mo-bk-ed', 'northern-mo-bk-hb', 'northern-mo-cx-ed', 'northern-mo-cx-hb'],
			at: ['R1C', 'R2A', 'R2C', 'R4B', 'R4C'] // Victoria Line positions
		}
	]
});