export function getChatToken() {
  const chatToken = window.location.pathname.split('/')[1];

  if (!chatToken || !/^G?[A-Za-z0-9]+$/.test(chatToken)) {
    return;
  }

  return chatToken;
}
