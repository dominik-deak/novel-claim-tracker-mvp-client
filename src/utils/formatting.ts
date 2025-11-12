export const formatAmount = (pence: number) => {
	const pounds = pence / 100;
	return new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: "GBP",
	}).format(pounds);
};

export const formatDateRange = (startDate: string, endDate: string) => {
	const start = new Date(startDate).toLocaleDateString("en-GB");
	const end = new Date(endDate).toLocaleDateString("en-GB");
	return `${start} - ${end}`;
};
