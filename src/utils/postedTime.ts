export const calculatePostedTime = (eventDate: Date): string => {
    const currentDateTime = new Date();
    const diffMs = currentDateTime.getTime() - eventDate.getTime();

    // Convert milliseconds to minutes
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return "Now";
    } else if (diffMinutes === 1) {
      return "1 minute ago";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 120) {
      return "1 hour ago";
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours} hours ago`;
    } else {
      return eventDate.toLocaleString();
    }
};