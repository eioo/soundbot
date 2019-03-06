export function getChatToken() {
  const chatToken = window.location.pathname.split('/')[1];

  if (!chatToken || !/^[a-z]+$/.test(chatToken)) {
    return;
  }

  return chatToken;
}
