export default class Visualiser{

	constructor(synth)
	{
		this.HEIGHT = 360;
		this.WIDTH = 640;
		this.SMOOTHING = 0.8;
		this.FFT_SIZE = 2048;
		this.synth = synth;
		this.freqs = new Uint8Array(this.synth.analyser.frequencyBinCount);
		console.log("bin count: " + this.synth.analyser.frequencyBinCount);
		this.currentMode = 'FREQ';
		this.modeMap = 
		{
			TIME:this.timeDisplay,
			FREQ:this.freqDisplay
		};

		//requestAnimationFrame(this.draw.bind(this));
	};

	setMode(mode)
	{
		currentMode = mode;
	};

	timeDisplay()
	{
		console.log("time display");
	};

	freqDisplay()
	{
		console.log(this.height);
		console.log(this.synth);
		this.synth.analyser.smoothingTimeConstant = this.SMOOTHING;
		this.synth.analyser.fftSize = this.FFT_SIZE;
		this.synth.analyser.getByteFrequencyData(this.freqs);

		var width = Math.floor(1/this.freqs.length, 10);

		var canvas = document.querySelector('canvas');
		var drawContext = canvas.getContext('2d');

		canvas.width = this.WIDTH;
		canvas.height = this.HEIGHT;

		console.log("freq display");
		for(var i = 0; i < this.synth.analyser.frequencyBinCount; i++)
		{
			var value = this.freqs[i];
			var percent = value / 256;
			var height = HEIGHT * percent;
			var offset = HEIGHT - height - 1;
			var barWidth = WIDTH/this.synth.analyser.frequencyBinCount;
			var hue = i / this.synth.analyser.frequencyBinCount * 360;
			drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
			drawContext.fillRect(i * barWidth, offset, barWidth, height);
		}

		requestAnimationFrame(this.draw.bind(this));
	};

	draw()
	{
		this.modeMap[this.currentMode]();
	};	

	display()
	{
		this.modeMap[this.currentMode]();
	};
};