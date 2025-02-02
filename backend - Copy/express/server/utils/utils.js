export default function validate_auction_data(body) {
  const {
    imageUrl,
    startingPrice,
    currentPrice,
    startDate,
    endDate,
    bidIncrement,
  } = body;
  if (startDate > endDate) return false;
  if (bidIncrement <= 0) return false;
}
