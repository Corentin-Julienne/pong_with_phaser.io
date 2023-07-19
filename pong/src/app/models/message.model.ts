export class Message {
	constructor(
		public text: string,
		public timestamp: Date = new Date(),
		public sender: string
	) {}
}
