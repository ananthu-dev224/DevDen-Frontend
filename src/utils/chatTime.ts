export const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const today = now.toDateString();
    const messageDay = messageDate.toDateString();

    if (today === messageDay) {
      return `Today ${messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (yesterday.toDateString() === messageDay) {
      return `Yesterday ${messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return (
      messageDate.toLocaleDateString() +
      " " +
      messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

};