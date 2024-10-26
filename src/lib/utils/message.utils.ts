function formatMessageTime(timestamp: number): string {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffTime = now.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Format time
  const timeFormat = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const formattedTime = timeFormat.format(messageDate);

  // Today
  if (diffDays === 0) {
    return formattedTime;
  }

  // Yesterday
  if (diffDays === 1) {
    return `Yesterday, ${formattedTime}`;
  }

  // Within 7 days
  if (diffDays < 7) {
    const weekdayFormat = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    });
    return `${weekdayFormat.format(messageDate)} ${formattedTime}`;
  }

  // More than 7 days ago
  const dateFormat = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${dateFormat.format(messageDate)}, ${formattedTime}`;
}

export default formatMessageTime;
