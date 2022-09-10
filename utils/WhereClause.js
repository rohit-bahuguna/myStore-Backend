class WhereClause {
	constructor(base, bigQ) {
		this.base = base;
		this.bigQ = bigQ;
	}

	search() {
		const searchedWord = this.bigQ.search
			? {
					name: {
						$regex: this.bigQ.search,
						$options: 'i'
					}
				}
			: {};

		this.base = this.base.find({ ...searchedWord });

		return this;
	}

	filter() {
		const copyQ = { ...this.bigQ };

		delete copyQ['search'];
		delete copyQ['limit'];
		delete copyQ['page'];

		// convert bigQ into string => copyQ

		let stringOfCopyQ = JSON.stringify(copyQ);

		stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`);

		const jsonOfCopyQ = JSON.parse(stringOfCopyQ);

		this.base = this.base.find(jsonOfCopyQ);

		return this;
	}

	pager(resultPerPage) {
		let currentPage = 1;

		if (this.bigQ.page) {
			currentPage = this.bigQ.page;
		}

		const skipValue = resultPerPage * (currentPage - 1);

		this.base = this.base.limit(resultPerPage).skip(skipValue);

		return this;
	}
}

module.exports = WhereClause;
